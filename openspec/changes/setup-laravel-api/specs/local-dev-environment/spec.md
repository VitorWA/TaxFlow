## ADDED Requirements

### Requirement: Ambiente local sobe com um único comando
O repositório SHALL permitir subir front, API, MySQL e Redis com `cp backend/.env.example backend/.env` seguido de `docker compose up`, sem outro passo manual. Os serviços MUST expor no host: front em `3000`, API em `8000`, MySQL em `${DB_FORWARD_PORT:-3306}` e Redis em `${REDIS_FORWARD_PORT:-6379}`.

#### Scenario: Primeira subida em clone limpo
- **WHEN** um dev, num clone limpo, copia `backend/.env.example` para `backend/.env` e executa `docker compose up`
- **THEN** os serviços `taxflow-frontend`, `api`, `db` e `redis` ficam em execução
- **AND** `GET http://localhost:8000/api/health` responde HTTP 200

#### Scenario: Subidas seguintes
- **WHEN** o ambiente já foi iniciado antes (volumes existentes) e o dev executa `docker compose up` de novo
- **THEN** todos os serviços sobem sem erro e sem refazer passos

#### Scenario: `.env` ausente
- **WHEN** o dev executa `docker compose up` sem ter criado `backend/.env`
- **THEN** o container `api` encerra com uma mensagem indicando o `cp` necessário

### Requirement: Bootstrap automático da API sem migrations
No boot, o container `api` SHALL instalar as dependências Composer quando `vendor/autoload.php` não existir e SHALL gerar a `APP_KEY` quando ela estiver vazia. O boot MUST NOT executar migrations.

#### Scenario: Dependências e chave ausentes
- **WHEN** o container `api` inicia sem `vendor/` e com `APP_KEY` vazia
- **THEN** ele executa `composer install` e `php artisan key:generate` antes de servir HTTP

#### Scenario: Migrations manuais
- **WHEN** o ambiente sobe em banco limpo
- **THEN** nenhuma tabela é criada até o dev executar `docker compose exec api php artisan migrate`
- **AND** esse comando termina sem erros

### Requirement: API aguarda dependências saudáveis
Os serviços `db` e `redis` SHALL declarar healthcheck, e o serviço `api` SHALL depender deles com `condition: service_healthy`.

#### Scenario: Banco ainda inicializando
- **WHEN** `docker compose up` é executado e o MySQL ainda não aceita conexões
- **THEN** o container `api` só inicia depois que o healthcheck do `db` passar

### Requirement: Configuração de exemplo completa
`backend/.env.example` SHALL conter todas as variáveis necessárias à subida, incluindo `DB_CONNECTION=mysql`, as variáveis `DB_*` e `REDIS_*`, `CACHE_STORE=redis`, `QUEUE_CONNECTION=redis`, `SESSION_DRIVER=redis` e `TAX_ENGINE=fake`, com credenciais iguais aos defaults do `docker-compose.yml`. O valor de `TAX_ENGINE` SHALL estar disponível em `config('tax.engine')`.

#### Scenario: Leitura do motor configurado
- **WHEN** a aplicação roda com o `.env` copiado do exemplo
- **THEN** `config('tax.engine')` retorna `fake`

#### Scenario: `.env.example` versionado
- **WHEN** um dev clona o repositório
- **THEN** `backend/.env.example` está presente, enquanto `backend/.env` continua ignorado pelo Git

### Requirement: Front preservado
A adição da API MUST NOT alterar o comportamento do front: o serviço `taxflow-frontend` continua servindo em `http://localhost:3000` com hot reload, e o contexto de build da imagem do front MUST NOT incluir o diretório `backend/`.

#### Scenario: Front após a mudança
- **WHEN** o ambiente sobe com a nova configuração
- **THEN** o front abre em `http://localhost:3000` como antes e uma alteração em `src/` é refletida via hot reload

#### Scenario: Build do front isolado
- **WHEN** a imagem do `taxflow-frontend` é construída
- **THEN** nenhum arquivo de `backend/` é enviado ao contexto de build
