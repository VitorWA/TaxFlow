# Achados do review: setup-laravel-api

Passes executados em sequência: conformidade com a spec, corretude, stack (Laravel/Docker), simplificação, segurança e qualidade dos testes. Não houve passe de SQL, performance ou frontend, porque o diff não tem queries de domínio, caminho quente nem mudança no front.

Severidades: blocker > high > medium > low > nit.

---

## M1: MySQL e Redis expostos em todas as interfaces, e o Redis está sem senha
- **Severidade:** medium · **Passe:** segurança · **Escopo:** dentro
- **Onde:** `docker-compose.yml:45` e `docker-compose.yml:58`
- **Impacto:** as portas são publicadas em `0.0.0.0`/`[::]`. Numa rede compartilhada (escritório, Wi-Fi público), qualquer máquina alcança o Redis sem autenticação e o MySQL com `root`/`root` e `taxflow`/`secret`. Um Redis aberto permite ler e apagar cache, sessões e filas, e é um vetor conhecido de escrita arbitrária.
- **Evidência:**
  - `docker port taxflow-redis-1` → `6379/tcp -> 0.0.0.0:6379` e `[::]:6379`.
  - `docker port taxflow-db-1` → `3306/tcp -> 0.0.0.0:3306`.
  - `redis-cli CONFIG GET requirepass` → vazio.
- **Correção:** publicar só no loopback, com `"127.0.0.1:${DB_FORWARD_PORT:-3306}:3306"` e `"127.0.0.1:${REDIS_FORWARD_PORT:-6379}:6379"`. O acesso entre containers continua pela rede interna. A API (`8000`) pode seguir o mesmo padrão. O front fica como está, para preservar o comportamento atual.

## M2: `backend/AGENTS.md` e `backend/CLAUDE.md` mandam agentes rodarem instaladores remotos
- **Severidade:** medium · **Passe:** segurança / stack · **Escopo:** dentro (os arquivos entram no repo por esta change)
- **Onde:** `backend/AGENTS.md:15-32` (o `CLAUDE.md` é idêntico)
- **Impacto:** os arquivos vêm do Laravel Boost no skeleton. Eles instruem qualquer agente de IA que abrir `backend/` a executar `curl … | bash` e `iex (DownloadString(...))` de `php.new`, e a instalar o Laravel Boost. Isso contradiz a decisão do PRD de rodar só via Docker, e é uma instrução de execução remota versionada para agentes.
- **Evidência:** `backend/AGENTS.md:20` → `/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.5)"`; `:26` → `iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.5'))`.
- **Correção:** remover os dois arquivos ou substituí-los por instruções curtas baseadas em Docker (`docker compose exec api php artisan …`).

## M3: `vendor/` fica desatualizado quando o `composer.lock` muda, e o README não avisa
- **Severidade:** medium · **Passe:** corretude / DX · **Escopo:** dentro
- **Onde:** `backend/docker/entrypoint.sh:11-13` e `README.md` (seção Comandos úteis)
- **Impacto:** o entrypoint só roda `composer install` quando `vendor/autoload.php` não existe. Depois que alguém adicionar uma dependência (a #9 vai adicionar Larastan, por exemplo), os outros devs dão pull, sobem o ambiente e recebem `Class not found`, porque o volume `api-vendor` continua com o conjunto antigo. Nada no README orienta o passo.
- **Evidência:** a condição `if [ ! -f vendor/autoload.php ]` não considera o `composer.lock`; `grep "composer install" README.md` → nenhuma ocorrência.
- **Correção (escolher uma):**
  - Documentar `docker compose exec api composer install` após pull com mudança no `composer.lock`.
  - Ou fazer o entrypoint comparar o hash do `composer.lock` com um marcador salvo no volume e rodar `composer install` quando divergir.

## L1: os testes gravam erros no log de desenvolvimento
- **Severidade:** low · **Passe:** qualidade dos testes · **Escopo:** dentro
- **Onde:** `backend/tests/Feature/HealthCheckTest.php:25` e `:38`
- **Impacto:** os testes de 503 chamam `report()` de verdade e gravam `db down`/`redis down` em `storage/logs/laravel.log`, o mesmo arquivo usado em dev. Isso polui o diagnóstico real.
- **Evidência:** `grep -cE 'ERROR: (db down|redis down)' backend/storage/logs/laravel.log` → `6` (2 por execução da suíte).
- **Correção:** chamar `Exceptions::fake()` em todos os testes do arquivo (num `setUp`) ou definir `LOG_CHANNEL=null` no `phpunit.xml`.

## L2: checagens do health sem timeout explícito
- **Severidade:** low · **Passe:** corretude · **Escopo:** dentro (alerta para a #42)
- **Onde:** `backend/app/Http/Controllers/HealthController.php:15-16`
- **Impacto:** com o host do banco ou do Redis inalcançável (pacotes descartados, sem `connection refused`), a requisição fica presa até o timeout padrão. Para o Redis, isso é `default_socket_timeout=60`; para o PDO, não há `PDO::ATTR_TIMEOUT`. Localmente as falhas são rápidas (DNS ou conexão recusada), mas um monitor de uptime em homolog/prod sofreria com isso.
- **Evidência:** `ini_get('default_socket_timeout')` → `60`; `config('database.redis.default')` sem `timeout`; `config('database.connections.mysql.options')` → `[]`.
- **Correção:** definir `REDIS_TIMEOUT`/`timeout` e `PDO::ATTR_TIMEOUT` curtos (por exemplo, 2s). Pode ficar para a #42, junto com a configuração de monitoramento.

## L3: o container da API roda como root
- **Severidade:** low · **Passe:** stack / segurança · **Escopo:** alerta (#42)
- **Onde:** `backend/Dockerfile:1`
- **Impacto:** em Linux/macOS, arquivos criados pelo container no bind mount (`storage/logs`, `bootstrap/cache`, a `APP_KEY` escrita no `.env`) ficam com dono root no host. No Windows não há efeito.
- **Evidência:** `docker compose exec api id -u` → `0`.
- **Correção:** usar um usuário não-root com UID/GID configuráveis. Natural de fazer na #42, que cria o Dockerfile multi-stage.

## L4: uma `APP_KEY` entre aspas vazias não é detectada
- **Severidade:** low · **Passe:** corretude · **Escopo:** dentro
- **Onde:** `backend/docker/entrypoint.sh:15`
- **Impacto:** `APP_KEY=""` casa com `^APP_KEY=.+`. O entrypoint pula o `key:generate` e a aplicação falha com `No application encryption key`. O `.env.example` atual usa `APP_KEY=` sem aspas, então o problema só aparece se alguém editar o arquivo.
- **Correção:** usar `grep -Eq '^APP_KEY="?[^"[:space:]]+'`.

## N1: metadados do skeleton não foram ajustados
- **Severidade:** nit · **Passe:** stack
- **Onde:** `backend/composer.json:3,5` e `backend/README.md`
- **Impacto:** o pacote ainda se chama `laravel/laravel`, com a descrição do skeleton, e o README do backend é o marketing do Laravel.
- **Correção:** renomear para `taxflow/api` e trocar o `backend/README.md` por um apontamento para o README da raiz.

---

## Conformidade com a spec (sem achados)

| Spec / cenário | Resultado | Evidência |
|----------------|-----------|-----------|
| api-health: tudo ok → 200 | ok | teste + `curl` → 200 |
| api-health: banco fora → 503 | ok | teste + `docker compose stop db` → `database: fail` |
| api-health: Redis fora → 503 | ok | teste + `docker compose stop redis` → `redis: fail` |
| api-health: sem migrations → 200 | ok | 0 tabelas → 200 |
| api-health: não expõe detalhes + log | ok | `test_does_not_expose_exception_details` com `assertReported` |
| local-dev: primeira subida | ok | 4 serviços up, health 200 |
| local-dev: subidas seguintes | ok | `down`/`up` → 200 em ~2s |
| local-dev: `.env` ausente | ok, com ressalva | sai com a mensagem; depois do `cp`, exigiu `--force-recreate` (documentado) |
| local-dev: bootstrap sem migrations | ok | log do entrypoint; 0 tabelas antes do migrate |
| local-dev: dependências saudáveis | ok | `depends_on: service_healthy` + `Waiting/Healthy` no `up` |
| local-dev: config de exemplo / `tax.engine` | ok | `config('tax.engine')` → `fake` |
| local-dev: `.env.example` versionado | ok | `git check-ignore` |
| local-dev: front preservado / build isolado | ok | título, hot reload, `npm run build`, contexto de 77B |

## Simplificação

Nada a simplificar. O `HealthController` tem 40 linhas, com um helper privado e sem abstração prematura. O entrypoint tem 19 linhas.
