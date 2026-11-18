## 1. Skeleton Laravel (F1)

- [x] 1.1 Criar `backend/` com `composer create-project laravel/laravel backend` num container com `dunglas/frankenphp:1-php8.5.12` e o Composer de `composer:2` (D2). Registrar a versão do Laravel resolvida. Se alguma dependência não aceitar PHP 8.5, parar e reportar. Pronto: `backend/artisan` existe e `php artisan --version` roda no container.
  - Evidência: imagem `taxflow-php-tools` (`php -v` → `PHP 8.5.12 (cli) (ZTS)`).
  - Criado em `/tmp` no container e copiado sem `vendor/`, `.env` e `database.sqlite` (ajuste registrado em D2).
  - `php artisan --version` → `Laravel Framework 13.38.0`. Todas as dependências aceitaram PHP 8.5.
- [x] 1.2 Ajustar `backend/composer.json`: `"php": "^8.5"` e `config.platform.php = "8.5.12"`. Rodar `composer update --lock` no container. Pronto: `composer validate` passa.
  - Evidência: `composer update --lock --no-install` → `Nothing to modify in lock file`; `composer validate` → `./composer.json is valid`.
- [x] 1.3 Adicionar `!.env.example` ao `.gitignore` da raiz, criar o `.gitattributes` (`*.sh text eol=lf`) e o `.dockerignore` (`backend/`, `node_modules`, `dist`, `.git`, `.env`) (D10). Pronto: `git check-ignore backend/.env.example` não retorna nada e `git check-ignore backend/.env` retorna o path.
  - Evidência: `git check-ignore backend/.env.example` → vazio; `git check-ignore -v backend/.env` → `backend/.gitignore:3:.env`; `file entrypoint.sh` → sem CRLF.

## 2. Configuração (F3)

- [x] 2.1 Reescrever `backend/.env.example`: `DB_CONNECTION=mysql`, `DB_HOST=db`, `DB_PORT=3306`, `DB_DATABASE=taxflow`, `DB_USERNAME=taxflow`, `DB_PASSWORD=secret`, `REDIS_CLIENT=phpredis`, `REDIS_HOST=redis`, `REDIS_PORT=6379`, `CACHE_STORE=redis`, `QUEUE_CONNECTION=redis`, `SESSION_DRIVER=redis`, `APP_URL=http://localhost:8000`, `APP_KEY=` vazio e `TAX_ENGINE=fake`. Valores iguais aos defaults do compose (spec local-dev-environment, "Configuração de exemplo completa").
  - Evidência: arquivo reescrito. A subida com `cp` do exemplo conecta no MySQL e no Redis (health 200).
  - Removidas do exemplo as variáveis AWS, Memcached e `VITE_APP_NAME`, que não são usadas.
- [x] 2.2 Criar `backend/config/tax.php` com `'engine' => env('TAX_ENGINE', 'fake')` (D9). Pronto: `php artisan tinker --execute="echo config('tax.engine');"` imprime `fake`.
  - Evidência: `docker compose exec api php artisan tinker --execute="echo config('tax.engine');"` → `fake`.

## 3. Containers (F2)

- [x] 3.1 Criar `backend/Dockerfile` (D3): base `dunglas/frankenphp:1-php8.5.12`, `install-php-extensions pdo_mysql redis intl bcmath zip pcntl`, Composer de `composer:2`, `WORKDIR /app`, entrypoint e `CMD ["frankenphp","php-server","--root","public/","--listen",":8000"]`. Pronto: `docker compose build api` conclui e `php -v` no container mostra 8.5.12.
  - Evidência: `docker compose build api` → `api Built`; log do FrankenPHP → `"php_version":"8.5.12"`.
- [x] 3.2 Criar `backend/docker/entrypoint.sh` (D4), com finais de linha LF e executável: abortar sem `.env` com a mensagem do `cp`, rodar `composer install` sem `vendor/autoload.php`, rodar `key:generate --force` com `APP_KEY` vazia, sem migrations, e terminar com `exec "$@"`.
  - Evidência: sem `.env`, `api` → `exited 1` com `backend/.env não encontrado. Rode: cp backend/.env.example backend/.env`.
  - No primeiro boot: `Generating optimized autoload files` e `Application key set successfully`; `APP_KEY=base64...` presente no `backend/.env`.
- [x] 3.3 Atualizar `docker-compose.yml` (D5): serviços `api`, `db` (mysql:8.4, healthcheck `mysqladmin ping`) e `redis` (redis:7-alpine, healthcheck `redis-cli ping`), volumes `db-data` e `api-vendor`, portas `8000`, `${DB_FORWARD_PORT:-3306}` e `${REDIS_FORWARD_PORT:-6379}`, e `api` com `depends_on: service_healthy`. O `taxflow-frontend` fica sem alteração.
  - Evidência: `docker compose config --quiet` OK; `DB_FORWARD_PORT=33060 REDIS_FORWARD_PORT=63790 docker compose config` → `published: "33060"` e `"63790"`.
  - Ajustes registrados em D5: sem `env_file` e com healthcheck próprio no `api`.
- [x] 3.4 Validar a subida: `docker compose config` sem erros. Num clone limpo, `cp backend/.env.example backend/.env && docker compose up -d` deixa os 4 serviços `running`/`healthy` e a `APP_KEY` preenchida. Um segundo `docker compose down && docker compose up -d` sobe sem erro. Sem `backend/.env`, o `api` sai com a mensagem do `cp`.
  - Evidência: `api`, `db` e `redis` ficam `running healthy` e `taxflow-frontend` fica `running`.
  - `docker compose down && up -d` → health 200 em cerca de 2s.
  - Observado: depois da subida que falhou sem `.env`, foi preciso `--force-recreate api` para o forward da porta 8000 voltar (documentado no README e no design).
- [x] 3.5 Validar migrations manuais: logo após a subida, o banco não tem tabelas. Depois, `docker compose exec api php artisan migrate` termina sem erros.
  - Evidência: `information_schema.tables` do schema `taxflow` → `0` antes do migrate.
  - `migrate` → `create_users_table`, `create_cache_table` e `create_jobs_table` com `DONE`.

## 4. Healthcheck (F4)

- [x] 4.1 Escrever primeiro `backend/tests/Feature/HealthCheckTest.php` (D8), com os casos 200 tudo ok, 503 banco fora, 503 Redis fora e corpo sem a mensagem da exceção (Redis sempre mockado). Pronto: os testes falham (red) porque a rota não existe.
  - Evidência: `php artisan test --filter=HealthCheckTest` → `4 failed`.
  - Adicionado depois `Exceptions::fake()` + `assertReported` para cobrir "a exceção é registrada no log" da spec.
- [x] 4.2 Criar `backend/routes/api.php` e registrá-lo em `bootstrap/app.php` com `withRouting(api: ...)`, sem `install:api`/Sanctum (D6).
  - Evidência: `bootstrap/app.php` com `api: __DIR__.'/../routes/api.php'`; `composer.json` sem Sanctum.
- [x] 4.3 Implementar o `App\Http\Controllers\HealthController` invokable (D7): `select 1`, Redis `ping`, `report($e)` em cada falha e JSON `{status, checks}` com 200/503. Registrar `Route::get('/health', HealthController::class)`. Pronto: `docker compose exec api php artisan test` fica verde.
  - Evidência: `php artisan test` → `6 passed (13 assertions)`.
- [x] 4.4 Validar manualmente:
  - `curl -i localhost:8000/api/health` → 200.
  - `docker compose stop db` → 503 com `database: fail`; depois `start db`.
  - `docker compose stop redis` → 503 com `redis: fail`; depois `start redis`.
  - Antes do migrate: 200.

  Evidência:
  - Sem migrate → `{"status":"ok",...}` 200.
  - `db` parado → `{"status":"fail","checks":{"database":"fail","redis":"ok"}}` 503.
  - `redis` parado → `{"status":"fail","checks":{"database":"ok","redis":"fail"}}` 503.
  - Os erros aparecem em `storage/logs/laravel.log` e não na resposta.

## 5. Documentação (F5)

- [x] 5.1 Escrever o `README.md`: visão do monorepo, pré-requisito (Docker), `cp backend/.env.example backend/.env`, `docker compose up`, portas, migrate, testes, health, `DB_FORWARD_PORT`/`REDIS_FORWARD_PORT`, aviso de credenciais duplicadas (`.env` × compose) e `vendor/` em volume (com o contorno `docker compose cp`).
  - Evidência: `README.md` reescrito; todos os comandos citados foram executados nesta sessão. Incluída a nota do `--force-recreate`.

## 6. Verificação final

- [x] 6.1 Preservação do front: `http://localhost:3000` abre como antes, uma edição em `src/` reflete via hot reload, `npm run build` passa e `git diff --stat -- src/` está vazio.
  - Evidência: `curl localhost:3000` → 200 com `<title>TaxFlow | Inteligência fiscal para empresas</title>`.
  - Uma edição temporária em `src/main.jsx` foi servida pelo Vite em cerca de 5s e revertida com `git checkout`.
  - `docker compose exec taxflow-frontend npm run build` → `built in 14.56s`; `git status --short src/` → vazio.
- [x] 6.2 Build do front isolado: `docker compose build taxflow-frontend` não envia `backend/` ao contexto (conferir o tamanho do contexto ou `docker build --progress=plain`).
  - Evidência: `transferring context: 77B`; `ls /app` na imagem → `sem backend/ na imagem`.
- [ ] 6.3 Rodar a validação `openspec validate setup-laravel-api --type change --strict`, revisar o diff completo e pedir `/mashure:review`.
  - Validação estrita OK nesta sessão. Pendente: o review independente (`/mashure:review`).
- [ ] 6.4 Rollback documentado (design, Migration Plan): confirmar que `git revert` + `docker compose down -v` restauram o estado anterior.
  - Não executado. `down -v` apaga os volumes de dados e não há commit ainda para reverter. Por análise: a entrega só adiciona arquivos e altera `docker-compose.yml`, `.gitignore` e `README.md`. Executar depois do commit, se o review pedir.

## 7. Correções do review (`review/achados.md`)

- [x] 7.1 [M1] Publicar MySQL e Redis (e a API) só em `127.0.0.1` no `docker-compose.yml`. Pronto: `docker port` mostra `127.0.0.1:` e o health continua 200.
  - Evidência: `docker port` → `127.0.0.1:8000`, `127.0.0.1:3306` e `127.0.0.1:6379`; health 200.
- [x] 7.2 [M2] Remover ou substituir `backend/AGENTS.md` e `backend/CLAUDE.md` (Laravel Boost) por instruções baseadas em Docker. Pronto: nenhuma instrução de `curl | bash`/`iex` no repo.
  - Evidência: os arquivos do Boost foram removidos. Novo `AGENTS.md` com instruções via Docker; `CLAUDE.md` = `@AGENTS.md`.
  - `grep -rn "php.new\|DownloadString" backend --include=*.md` → nada.
- [x] 7.3 [M3] Tratar o `vendor/` desatualizado: documentar `docker compose exec api composer install` após mudança no `composer.lock` ou fazer o entrypoint detectar o hash do lock. Pronto: o README cobre o caso, ou um teste manual (alterar o lock e reiniciar) reinstala.
  - Evidência: o entrypoint compara o SHA-256 do lock com `vendor/.composer-lock.sha256`.
  - Restart sem mudança → mtime do marcador inalterado (sem reinstalação).
  - Marcador adulterado (`stale`) + restart → `composer install` rodou e o marcador voltou ao hash do lock.
  - O README documenta `docker compose restart api`.
- [x] 7.4 [L1] `Exceptions::fake()` em todos os testes do `HealthCheckTest` (ou `LOG_CHANNEL=null` no `phpunit.xml`). Pronto: a suíte não acrescenta linhas ao `storage/logs/laravel.log`.
  - Evidência: `Exceptions::fake()` no `setUp`; `laravel.log` com 594 linhas antes e depois de `php artisan test` (`6 passed, 13 assertions`).
- [x] 7.5 [L4] Regex do entrypoint tratando `APP_KEY=""` como vazia.
  - Evidência: `APP_KEY=`, `APP_KEY=""` e `APP_KEY= ` → gera chave; `APP_KEY=base64:abc` e `APP_KEY="base64:abc"` → mantém.
- [x] 7.6 [N1, opcional] `composer.json` com `name`/`description` do TaxFlow e `backend/README.md` apontando para o README da raiz.
  - Evidência: `name: taxflow/api`; `composer update --lock` + `composer validate` → valid; `backend/README.md` aponta para a raiz.
  - Pint `--test` nos arquivos da change → PASS.
