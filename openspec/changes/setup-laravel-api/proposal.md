## Why

O repositório tem só o front React/Vite, e todas as issues de backend (#9 a #41) dependem de uma API Laravel executável. A issue #8 cria essa base: o projeto Laravel, o banco, o Redis e o ambiente local via Docker Compose, com um healthcheck que prova que tudo está conectado.

PRD: `docs/prds/setup-laravel-api/PRD.md`

## What Changes

- Novo projeto Laravel (estável mais recente) em `backend/`, rodando em **PHP 8.5.12** sobre **FrankenPHP**.
- `docker-compose.yml` ganha os serviços `api` (porta 8000), `db` (MySQL 8.4) e `redis` (Redis 7), com healthchecks e `depends_on: service_healthy`. O serviço `taxflow-frontend` continua igual.
- Primeiro boot automático no container `api`: `composer install` e `key:generate` quando necessários. Migrations continuam manuais.
- `backend/.env.example` único com MySQL, Redis (cache, fila e sessão) e `TAX_ENGINE=fake`. Exceção `!.env.example` no `.gitignore`.
- `.dockerignore` na raiz para tirar `backend/` do build do front.
- Endpoint `GET /api/health` que checa banco e Redis (200/503), com feature test em PHPUnit.
- `config/tax.php` expondo `TAX_ENGINE`.
- README com instruções de subida local.

Sem breaking changes: o front não é alterado.

## Capabilities

### New Capabilities
- `api-health`: contrato do `GET /api/health`, que informa a disponibilidade do banco e do Redis sem expor detalhes de infraestrutura.
- `local-dev-environment`: subida do ambiente local completo (front, API, MySQL, Redis) com um único `cp` do `.env` e `docker compose up`, incluindo bootstrap automático e migrations manuais.

### Modified Capabilities
<!-- Nenhuma: não existem specs vivas em openspec/specs/. -->

## Impact

- **Arquivos novos:** `backend/` (skeleton Laravel, `Dockerfile`, entrypoint, `routes/api.php`, `config/tax.php`, controller e teste do health), `.dockerignore`.
- **Arquivos alterados:** `docker-compose.yml` (serviços adicionados), `.gitignore` (uma exceção) e `README.md`.
- **Dependências:** imagens `dunglas/frankenphp:1-php8.5.12`, `mysql:8.4` e `redis:7-alpine`; pacotes Composer do skeleton Laravel. O Sanctum **não** entra (fica para a #11).
- **Issues relacionadas:** desbloqueia #9, #10, #11, #13–#18 e a fase 3. A #42 e a #9 precisam trocar PostgreSQL por MySQL.
- **Front (`src/`):** nenhuma alteração.
