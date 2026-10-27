## Context

- **Estado atual:** o repositório tem só o front React/Vite.
  - `docker-compose.yml`: um serviço `taxflow-frontend`, build do `Dockerfile` da raiz (Node 20), bind mount `.:/app` e `node_modules` isolado.
  - Não existem `backend/`, `.dockerignore` nem specs vivas.
  - O `.gitignore` ignora `.env` e `.env.*`.
- **Máquina de dev:** sem PHP nem Composer instalados, só Docker 28 com Compose v2. Toda execução de PHP é via container.
- **Decisões de produto e técnicas:** fechadas em `docs/prds/setup-laravel-api/PRD.md` (seções 10 e 11, decisões T0–T16).
- **Fronteira:** a #42 expande o ambiente depois (queue, scheduler, Dockerfile de prod, Makefile, CI, integração do front). Esta change entrega o mínimo sem fechar portas para ela.

## Goals / Non-Goals

**Goals:**
- Laravel em `backend/`, rodando em PHP 8.5.12 com FrankenPHP, conectado a MySQL 8.4 e Redis 7.
- Subida com `cp backend/.env.example backend/.env && docker compose up`.
- `GET /api/health` com o contrato da spec `api-health`, coberto por feature test.
- Front intacto.

**Non-Goals:**
- Serviços `queue`, `scheduler`, `mailpit` e `minio`; stage de produção no Dockerfile; Makefile; banco de testes MySQL; CI (#42/#9).
- Sanctum ou qualquer auth (#11); padrões de erro, paginação e CORS (#10); `VITE_API_URL` (#42).
- Migrations automáticas no boot.

## Decisions

### D1. PHP 8.5.12 + FrankenPHP em modo clássico
- **Imagem:** `dunglas/frankenphp:1-php8.5.12`, tag conferida no Docker Hub em 2026-10-26.
- **Comando:** `frankenphp php-server --root public/ --listen :8000`. O modo clássico recarrega o código a cada request, sem restart.
- **Alternativas:**
  - php-fpm + nginx: duas peças e mais configuração.
  - `artisan serve`: só serve para dev.
  - FrankenPHP worker mode/Octane: exige restart a cada mudança; fica para prod (#42).

### D2. Criação do skeleton dentro de container com o mesmo PHP
- **Como:** `composer create-project laravel/laravel backend` roda num container baseado em `dunglas/frankenphp:1-php8.5.12` com o Composer copiado de `composer:2` (`COPY --from=composer:2 /usr/bin/composer`). Assim a resolução de dependências acontece contra o PHP real.
- **`composer.json`:** declara `"php": "^8.5"` e `config.platform.php = "8.5.12"`.
- **Se alguma dependência não aceitar PHP 8.5:** parar e reportar. Não fazer downgrade.
- **Versão do Laravel:** a resolvida é registrada nas evidências da task.
- **Alternativa:** usar a imagem `composer:2` direto. Descartada porque ela traz outra versão de PHP.
- **Ajuste na implementação:** rodar o `create-project` direto no bind mount levou mais de 14 min sem terminar, por causa do I/O do Windows. O projeto foi criado em `/tmp` dentro do container e copiado para `backend/` sem `vendor/`, `.env` e `database.sqlite`. Assim levou menos de 2 min. Resultado: **Laravel 13.38.0**.

### D3. `backend/Dockerfile` (stage único de dev)
- **Base:** `dunglas/frankenphp:1-php8.5.12`.
- **Extensões:** `install-php-extensions pdo_mysql redis intl bcmath zip pcntl`.
- **Composer:** copiado de `composer:2`.
- **Arquivos:** `WORKDIR /app`, `docker-entrypoint.sh` como `ENTRYPOINT` e `php-server` como `CMD`.
- **Stage de produção:** fica para a #42, que vai adicionar stages sem mudar a base.

### D4. Entrypoint `backend/docker/entrypoint.sh`
Em ordem:
1. Se `/app/.env` não existir: imprimir `backend/.env não encontrado. Rode: cp backend/.env.example backend/.env` e sair com código 1.
2. Se `/app/vendor/autoload.php` não existir **ou** o SHA-256 do `composer.lock` diferir do marcador `vendor/.composer-lock.sha256`: rodar `composer install --no-interaction --prefer-dist` e atualizar o marcador. Isso entrou depois do review (M3), para que um pull com dependências novas não deixe o volume `vendor/` desatualizado. A regex da `APP_KEY` também trata `APP_KEY=""` como vazia (L4).
3. Se `APP_KEY` estiver vazia no `.env`: `php artisan key:generate --force`. Essa etapa escreve no `.env` do host via bind mount, de forma idempotente.
4. `exec "$@"`.

O entrypoint não roda migrations. Precisa ser salvo com finais de linha LF: adicionar `*.sh text eol=lf` num `.gitattributes`, por causa do Windows.

### D5. Compose
- **`api`:**
  - `build: ./backend`, porta `8000:8000`.
  - **Sem `env_file`** (ajuste na implementação): o Laravel lê `backend/.env` pelo bind mount. Com `env_file`, os valores do momento da criação do container, como a `APP_KEY` vazia, viram variáveis de ambiente com precedência sobre o arquivo. Além disso, o compose falharia antes do entrypoint quando o `.env` não existe.
  - **Healthcheck próprio** (ajuste na implementação): `curl -fs http://localhost:8000/up`. O healthcheck herdado da imagem FrankenPHP consulta o admin do Caddy (`:2019`), que o `php-server` desativa, e deixava o container sempre `unhealthy`.
  - Volumes: `./backend:/app` e `api-vendor:/app/vendor`.
  - `depends_on`: `db` e `redis` com `condition: service_healthy`.
- **`db`:**
  - Imagem `mysql:8.4`.
  - Variáveis `MYSQL_DATABASE: ${DB_DATABASE:-taxflow}`, `MYSQL_USER: ${DB_USERNAME:-taxflow}`, `MYSQL_PASSWORD: ${DB_PASSWORD:-secret}` e `MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-root}`.
  - Volume `db-data:/var/lib/mysql`, porta `${DB_FORWARD_PORT:-3306}:3306`.
  - Healthcheck `mysqladmin ping -h localhost -u root -p$$MYSQL_ROOT_PASSWORD`.
- **`redis`:** imagem `redis:7-alpine`, porta `${REDIS_FORWARD_PORT:-6379}:6379`, healthcheck `redis-cli ping`.
- **`taxflow-frontend`:** sem alterações.
- **Portas em loopback** (depois do review, M1): `api`, `db` e `redis` publicam em `127.0.0.1:` porque o MySQL tem credenciais de dev e o Redis não tem senha. O front segue como antes.
- **Credenciais:** os defaults inline do compose são iguais aos valores do `backend/.env.example` (`DB_HOST=db`, `REDIS_HOST=redis`).
- **Alternativa descartada:** ter também um `.env` na raiz. Seriam dois `cp` (decisão T6).

### D6. Rotas da API sem `install:api`
- **Rotas:** criar `backend/routes/api.php` e registrá-lo em `bootstrap/app.php` via `withRouting(api: __DIR__.'/../routes/api.php', ...)`. O prefixo `/api` é o padrão do Laravel.
- **Sem Sanctum:** não instalar o Sanctum nem sua migration.
- **`/up`:** a rota nativa do Laravel é mantida.

### D7. Health: controller invokable usando facades
- **Classe:** `App\Http\Controllers\HealthController` (invokable).
- **Checagens:**
  - Banco: `DB::connection()->select('select 1')`.
  - Redis: `Redis::connection()->ping()`.
  - Cada uma fica num `try/catch (\Throwable $e)` que chama `report($e)` e marca `fail`.
- **Resposta:** `response()->json([...], $allOk ? 200 : 503)`.
- **Rota:** `Route::get('/health', HealthController::class)`, sem middleware extra.
- **Alternativa descartada:** uma classe `HealthChecker` injetável. É abstração prematura com só duas checagens, e as facades já permitem mock no teste.

### D8. Testes
- **Arquivo:** `tests/Feature/HealthCheckTest.php`, em PHPUnit, usando o `phpunit.xml` do skeleton (SQLite `:memory:`, cache `array`). A suíte nunca toca o MySQL nem o Redis de dev.
- **Redis:** sempre mockado (`Redis::shouldReceive('connection->ping')`), porque não há Redis no ambiente de teste.
- **Banco:** fica real no caso de sucesso (SQLite em memória responde `select 1`). No caso de falha, é mockado (`DB::shouldReceive('connection->select')->andThrow(...)`).
- **Casos:** 200 com tudo ok, 503 com o banco fora, 503 com o Redis fora e corpo sem a mensagem da exceção. O teste de vazamento usa uma exceção com texto sensível e verifica que o corpo não contém esse texto.
- **Comando:** `docker compose exec api php artisan test`.

### D9. `config/tax.php`
- **Conteúdo:** `return ['engine' => env('TAX_ENGINE', 'fake')];`.
- **Uso:** nenhum consumidor por enquanto (#19/#21).

### D10. Arquivos de controle do Git e do Docker
- **`.gitignore` na raiz:** adicionar `!.env.example`.
- **`.dockerignore` na raiz:** `backend/`, `node_modules`, `dist`, `.git`, `.env`.
- **`.gitattributes` na raiz:** `*.sh text eol=lf`.
- **`backend/.gitignore`:** o do skeleton, que já cobre `vendor/` e `.env`.

## Risks / Trade-offs

- [Alguma dependência do Laravel ainda não aceita PHP 8.5] → o `create-project` falha. Parar e reportar ao time (D2), sem downgrade silencioso.
- [`backend/.env` e o compose com credenciais divergentes] → os defaults do compose e o `.env.example` têm os mesmos valores, e o README avisa para mudar nos dois lugares.
- [`vendor/` em volume nomeado não fica visível no host] → a IDE perde o autocomplete de pacotes. Aceito pelo desempenho no Windows e documentado no README. Contorno: `docker compose cp api:/app/vendor ./backend/vendor`.
- [Entrypoint com CRLF no Windows quebra o `sh`] → `.gitattributes` com `eol=lf`.
- [Portas 3306/6379 já em uso no host] → portas configuráveis via `DB_FORWARD_PORT`/`REDIS_FORWARD_PORT`.
- [Bind mount `.:/app` do front também enxerga `backend/`] → só leitura de arquivos, sem efeito no Vite. O `.dockerignore` resolve o build.
- [MySQL demora a inicializar no primeiro `up`] → `depends_on: service_healthy`.
- [Docker Desktop perde o forward da porta 8000 quando o container `api` foi criado numa subida que falhou (sem `.env`)] → observado na implementação. O README orienta `docker compose up -d --force-recreate api`.
- [IDE acusa classes do Laravel como indefinidas] → efeito do `vendor/` em volume (T8). Contorno documentado no README.

## Migration Plan

- **Deploy:** a entrega é aditiva e só local. Não há deploy (hospedagem é a #42).
- **Rollback:** reverter o commit e rodar `docker compose down -v` para remover os volumes `db-data` e `api-vendor`. O front volta ao estado anterior, porque o serviço `taxflow-frontend` não muda.

## Open Questions

Nenhuma bloqueante. Pendência externa: atualizar a #8 (PHP 8.5.12), a #42 e a #9 (MySQL) no GitHub.
