# PRD — Setup do projeto Laravel da API

- **Status:** requisitos e decisões técnicas fechados, pronto para `/mashure:propose`
- **Origem:** issue [#8](https://github.com/VitorWA/TaxFlow/issues/8) (fase 2, backend base)
- **Data:** 2026-10-26

## 1. Objetivo

Criar a base executável da API do TaxFlow: um projeto Laravel no mesmo repositório do front, com banco relacional e Redis, que sobe localmente via Docker Compose e expõe um healthcheck. As demais issues de backend (#9 a #41) dependem desta base.

## 2. Contexto

A arquitetura definida no documento *Direcionamento do TaxFlow* (set/2026) é:
Front React → API Laravel → Orquestrador → Fontes e motor → Banco.

Hoje o repositório contém apenas o front React/Vite, que usa dados mockados e não chama nenhuma API.

## 3. Usuários afetados

- **Devs do time (backend e front):** precisam subir o ambiente completo localmente sem passos manuais.
- **Issues seguintes:** #9 (CI e qualidade), #10 (padrões da API), #11 (auth), #13+ (domínio) partem desta estrutura.

Nenhum usuário final é afetado nesta entrega.

## 4. Escopo

1. Projeto Laravel (versão estável mais recente, **PHP 8.5.12**) no diretório `backend/` deste repositório (monorepo).
2. Banco relacional **MySQL** e **Redis** (cache e filas) configurados no Laravel.
3. `docker-compose.yml` com os serviços `api`, `db` e `redis`, mantendo o front funcionando.
4. `.env.example` com todas as variáveis necessárias, incluindo `TAX_ENGINE=fake`.
5. Endpoint `GET /api/health` que verifica banco e Redis.
6. README com instruções de subida local.

## 5. Não objetivos

Itens que ficam na #42 (infra) ou em outras issues, e **não** entram aqui:

- Serviços `queue`, `scheduler`, `mailpit` e `minio` no Compose (#42).
- `Dockerfile` multi-stage de produção, `Makefile`/scripts de atalho e banco de testes separado (#42).
- Integração do front com a API (`VITE_API_URL` ou proxy do Vite) e CORS (#42 e #10).
- CI, Pint, Larastan e Pest/PHPUnit (#9 e #42).
- Padrões de erro, paginação e resources da API (#10).
- Autenticação e qualquer model de domínio (#11 em diante).
- Rodar migrations automaticamente ao subir o container.
- Hospedagem, homolog e produção (#42).

## 6. Requisitos

| ID | Requisito |
|----|-----------|
| R1 | O diretório `backend/` contém um projeto Laravel na versão estável mais recente, rodando em **PHP 8.5.12** (versão fixada, não range). |
| R2 | O Laravel usa MySQL como conexão de banco padrão e Redis para cache e filas. |
| R3 | O `docker-compose.yml` define os serviços `api`, `db` (MySQL) e `redis`, além do front já existente. |
| R4 | O front continua subindo e funcionando como hoje (porta 3000, hot reload). |
| R5 | `docker compose up` sobe front, API, banco e Redis sem passos manuais além de copiar o(s) `.env.example`. Instalação de dependências e geração da `APP_KEY` não podem exigir comando manual. |
| R6 | Migrations rodam por comando explícito (`php artisan migrate`, dentro do container), documentado no README. Não rodam no boot. |
| R7 | `.env.example` lista todas as variáveis necessárias para o ambiente subir, incluindo `TAX_ENGINE=fake`. |
| R8 | `GET /api/health` verifica a conexão com o banco e com o Redis. Retorna **200** quando ambos respondem e **503** quando algum está indisponível, informando o estado de cada dependência na resposta. |
| R9 | O README explica como subir o ambiente local, rodar as migrations e verificar o healthcheck. |

## 7. Critérios de aceite

**Sucesso**
- CA1: Num clone limpo, após copiar o(s) `.env.example` para `.env`, `docker compose up` sobe front, API, banco e Redis sem outro comando manual. (R3, R5)
- CA2: `php artisan migrate`, executado no container da API, roda sem erros em banco limpo. (R6)
- CA3: Com tudo no ar, `GET /api/health` retorna 200 e indica banco e Redis como ok. (R8)
- CA4: O `.env.example` contém `TAX_ENGINE=fake` e as variáveis de banco e Redis; nenhuma variável usada pela subida está ausente. (R7)
- CA5: Seguindo apenas o README, um dev novo chega ao CA3. (R9)

**Erro**
- CA6: Com o serviço `db` parado, `GET /api/health` retorna 503 e indica o banco como indisponível. (R8)
- CA7: Com o serviço `redis` parado, `GET /api/health` retorna 503 e indica o Redis como indisponível. (R8)

**Borda**
- CA8: Subir o ambiente uma segunda vez (com volumes já existentes) funciona sem erro e não exige refazer passos. (R5)
- CA9: Subir sem rodar migrations não derruba a API; o healthcheck continua respondendo. (R6, R8)

**Preservação**
- CA10: O front abre em `http://localhost:3000` com o mesmo comportamento de antes, incluindo hot reload. (R4)
- CA11: Nenhum arquivo em `src/` muda nesta entrega.

## 8. Riscos e dependências

- **Divergência com a #42:** a #42 cita PostgreSQL e a extensão `pdo_pgsql`. A decisão aqui é MySQL, então a #42 (e a #9, nos service containers de CI) precisam ser ajustadas para MySQL (`pdo_mysql`).
- **Sobreposição com a #42:** as duas mexem em `docker-compose.yml` e `.env.example`. A #8 cria o mínimo; a #42 expande sem quebrar os serviços `api`, `db` e `redis`.
- **`.env` na raiz e em `backend/`:** o `.gitignore` atual ignora `.env` e `.env.*` (`.gitignore`), o que também bloquearia versionar `.env.example`. Precisa de exceção.
- **Volumes no Windows:** o front já usa `usePolling` por causa de bind mounts (`vite.config.js:9-11`); a API pode sofrer com desempenho de I/O no mesmo cenário.
- **Bloqueia:** #9, #10, #11, #13 a #18 e toda a fase 3.

## 9. Estado encontrado

- `docker-compose.yml:1-10` → um único serviço `taxflow-frontend`, build do `Dockerfile` da raiz, porta 3000, código montado em `/app` e `node_modules` isolado.
- `Dockerfile:1-13` → Node 20 alpine rodando `npm run dev`. O build context é a raiz, então um `backend/` com `vendor/` entraria no contexto do front sem `.dockerignore`.
- `vite.config.js:5-15` → Vite em `0.0.0.0:3000` com polling e HMR na 3000.
- `package.json` → só front (React 18, Vite 5, Tailwind 4); nome `taxflow-frontend`.
- `.gitignore` → ignora `.env` e `.env.*`.
- `README.md` → apenas o título `# TaxFlow`.
- `src/` → nenhuma chamada HTTP; dados vêm de `src/data/*Mock.js`.
- Não existem `backend/`, `.github/`, `.dockerignore` nem specs em `openspec/specs/`.

## 10. Decisões técnicas (tech-interview, 2026-10-26)

Ambiente auditado: a máquina tem Docker 28.3 e Compose v2.38, mas **não tem PHP nem Composer instalados**. Toda execução de PHP (criar o projeto, `artisan`, testes) acontece via container.

| # | Tema | Decisão | Alternativas descartadas / motivo |
|---|------|---------|-----------------------------------|
| T0 | Versão do PHP | **PHP 8.5.12**, fixada na tag da imagem (`dunglas/frankenphp:1-php8.5.12`; tag conferida no Docker Hub em 2026-10-26). O `create-project` (T2) roda num container com o mesmo PHP, para o `composer.lock` resolver contra 8.5. O `composer.json` declara `"php": "^8.5"` e `config.platform.php = "8.5.12"`. | Decisão do time (2026-10-26). A issue pedia "8.3+". |
| T1 | Runtime da API | **FrankenPHP** (imagem oficial `dunglas/frankenphp:1-php8.5.12`), modo clássico (`php-server`, sem worker) servindo `backend/public` na porta **8000**. | php-fpm + nginx: mais peças agora. `artisan serve`: só dev, a #42 teria que trocar. O modo clássico reflete mudanças no código sem restart; o worker mode fica para a #42/prod. |
| T2 | Versão do Laravel | A versão estável mais recente no momento do `composer create-project laravel/laravel backend`, executado em container com PHP 8.5.12 (ex.: a própria imagem FrankenPHP com Composer). A versão resolvida é registrada no proposal. Se alguma dependência do skeleton não aceitar PHP 8.5, isso é **bloqueio**: parar e reportar, sem fazer downgrade silencioso. | — |
| T3 | Banco | **MySQL 8.4 (LTS)**, volume nomeado persistente. | 8.0 está perto do fim do suporte. |
| T4 | Redis | **Redis 7** (alpine). Cliente **phpredis** (extensão `redis`), sem o pacote `predis`. `CACHE_STORE=redis`, `QUEUE_CONNECTION=redis`, `SESSION_DRIVER=redis`. | Sessão em `database` criaria dependência de tabela sem necessidade numa API stateless. |
| T5 | Extensões PHP | `pdo_mysql`, `redis`, `intl`, `bcmath`, `zip`, `pcntl` (via `install-php-extensions`, já incluso na imagem FrankenPHP). `gd`/`imagick` ficam para quando houver upload de imagem (#27/#42). | — |
| T6 | Arquivo `.env` | **Um só:** `backend/.env.example` → `backend/.env`. O `api` lê via `env_file`. O `docker-compose.yml` usa defaults inline (`${DB_DATABASE:-taxflow}` etc.) para as credenciais do MySQL e as portas no host, com **os mesmos valores** do `.env.example`. | Raiz + backend: dois `cp` e valores duplicados. Risco aceito: se alguém mudar credenciais no `backend/.env`, precisa mudar também no compose (documentado no README). |
| T7 | Bootstrap automático | O entrypoint do container `api` (1) aborta com mensagem clara se `backend/.env` não existir, (2) roda `composer install` se faltar `vendor/autoload.php`, (3) roda `php artisan key:generate` se `APP_KEY` estiver vazia e (4) **não** roda migrations. | Serviço de init separado: mais complexo, sem ganho. |
| T8 | `vendor/` | Volume nomeado (`api-vendor:/app/vendor`) com o código de `backend/` montado por bind. | Vendor no bind mount: lento no Windows. Contra: a IDE do host não enxerga `vendor/` (documentar). Alinhado à #42. |
| T9 | Healthchecks do Compose | `db` (`mysqladmin ping`) e `redis` (`redis-cli ping`) têm healthcheck. `api` usa `depends_on: condition: service_healthy` para os dois. | Ficar para a #42: o boot do `api` ficaria sujeito a corrida. |
| T10 | Portas | front `3000`, api `8000`, MySQL `${DB_FORWARD_PORT:-3306}`, Redis `${REDIS_FORWARD_PORT:-6379}`, expostas no host e configuráveis para evitar conflito com instalações locais. | — |
| T11 | Serviço do front | Mantém o nome `taxflow-frontend` e a definição atual. A renomeação para `frontend` fica para a #42. | Preserva CA10 e reduz o diff. |
| T12 | Build context do front | Novo `.dockerignore` na raiz excluindo `backend/` (além de `node_modules`, `dist`, `.git`). | Sem ele, `vendor/` e `.env` do backend entram na imagem do front. |
| T13 | `.gitignore` | Adicionar exceção `!.env.example`. O `backend/.gitignore` do skeleton continua cuidando de `vendor/` e `.env`. | — |
| T14 | Rotas da API | Criar `routes/api.php` e registrá-lo em `bootstrap/app.php` (`withRouting(api: ...)`, prefixo `/api`) **sem** `php artisan install:api`, ou seja, sem Sanctum. A escolha do mecanismo de auth fica para a #11. A rota nativa `/up` do Laravel continua existindo. | `install:api` instalaria Sanctum e uma migration antes da decisão de auth. |
| T15 | Contrato do `/api/health` | Sem auth e fora de qualquer middleware que a #10/#11 venham a adicionar. Checagens: banco via `select 1` na conexão padrão, Redis via `ping`. Resposta 200: `{"status":"ok","checks":{"database":"ok","redis":"ok"}}`. Resposta 503: `{"status":"fail","checks":{"database":"fail","redis":"ok"}}`. **Não** expõe mensagem de exceção, host ou credenciais. A falha é registrada no log. | — |
| T16 | `TAX_ENGINE` | Lido em `config/tax.php` (`'engine' => env('TAX_ENGINE', 'fake')`) para não ser uma variável morta. Nenhum código consome a config ainda (#19/#21). | — |

### Estratégia de teste

- **Framework:** PHPUnit do skeleton. A migração para Pest, se houver, fica para a #9.
- **Isolamento:** a suíte usa o `phpunit.xml` do skeleton (SQLite `:memory:`, cache `array`), então **nunca toca o MySQL nem o Redis de dev**. A #42 decide se haverá um banco de testes MySQL separado.
- **Feature test `HealthCheckTest`:**
  - 200 com as duas checagens ok.
  - 503 com o banco falhando.
  - 503 com o Redis falhando.
  - Corpo de erro sem mensagem de exceção.
  
  As falhas são simuladas com mocks das facades `DB`/`Redis` ou de uma classe injetável de checagem (a escolha fica para o design). Os testes não derrubam serviços reais.
- **Validação manual (aceite):** CA1, CA2, CA3, CA6, CA7, CA8 e CA10 com `docker compose` real (`docker compose stop db`/`redis` para CA6/CA7).
- **Comandos:**
  - Testes: `docker compose exec api php artisan test`
  - Migrations: `docker compose exec api php artisan migrate`
  - Health: `curl -i http://localhost:8000/api/health`
  - Build do front (preservação): `npm run build`
  
  Ainda não há lint nem análise estática (#9).

### Segurança, observabilidade e rollback

- **Segurança:** `.env` nunca é versionado e o `.env.example` traz só credenciais de dev. `APP_DEBUG=true` apenas no exemplo de dev. O health não vaza detalhes de infra.
- **Observabilidade:** falhas do health vão para o log padrão do Laravel (`stack`/`stderr` no container).
- **Rollback:** a entrega é aditiva (`backend/`, `.dockerignore`, `config/tax.php`, README). Os únicos arquivos existentes alterados são `docker-compose.yml` (serviços adicionados), `.gitignore` (uma exceção) e `README.md`. Reverter o commit restaura o estado anterior.

### Fatiamento

| Fatia | Conteúdo | Pronto quando |
|-------|----------|---------------|
| F1 — Skeleton | `composer create-project` via container em `backend/`, exceção no `.gitignore`, `.dockerignore` na raiz. | `backend/artisan` existe, o front builda (`docker compose build taxflow-frontend`) sem incluir `backend/`. |
| F2 — Containers | `backend/Dockerfile` (FrankenPHP + extensões T5), entrypoint (T7), serviços `api`/`db`/`redis` com healthchecks, volumes e portas (T8–T10). | CA1, CA8 e CA10 passam. |
| F3 — Configuração | `backend/.env.example` (MySQL, Redis, drivers T4, `TAX_ENGINE=fake`) e `config/tax.php`. | CA2 e CA4 passam. |
| F4 — Health | `routes/api.php` registrado (T14), endpoint (T15) e `HealthCheckTest`. | O teste passa; CA3, CA6, CA7 e CA9 passam manualmente. |
| F5 — Docs | README: pré-requisitos, `cp`, `up`, migrate, testes, health, portas e as ressalvas de T6/T8. | CA5 passa (um dev segue só o README). |

### Pendências fora desta entrega

- Atualizar as issues **#42** e **#9** de PostgreSQL/`pdo_pgsql` para MySQL/`pdo_mysql` (ação no GitHub, não no código).

## 11. Decisões fechadas nesta entrevista

| Decisão | Escolha |
|---------|---------|
| Fronteira com a #42 | Só o que a #8 lista; queue, scheduler, mailpit, minio, Makefile, CI e integração do front ficam na #42. |
| Healthcheck | Verifica banco e Redis; 200 se ok, 503 se algum estiver fora. |
| Migrations | Manuais (`php artisan migrate`), não rodam no boot. |
| Repositório | Monorepo, API em `backend/`. |
| Banco | **MySQL** (a issue sugeria PostgreSQL). |
| PHP | 8.5.12, fixado (T0). |
| Runtime | FrankenPHP (T1). |
| `.env` | Um só, em `backend/.env.example` (T6). |
| Teste do health | Entra nesta entrega, com PHPUnit (seção 10, estratégia de teste). |

## 12. Rastreabilidade

- Issue: https://github.com/VitorWA/TaxFlow/issues/8
- Item no project: https://github.com/users/VitorWA/projects/6/views/2?pane=issue&itemId=249656623&issue=VitorWA%7CTaxFlow%7C8
- Relacionadas: #4 (épico fase 2), #9 (CI backend), #42 (infra)
- Referência: documento *Direcionamento do TaxFlow* (set/2026)

### Texto original da issue #8

> **Setup do projeto Laravel da API**
>
> ## Contexto
> O repositório hoje contém apenas o front React/Vite. A arquitetura definida é: Front React → API Laravel → Orquestrador → Fontes e motor → Banco.
>
> ## Escopo
> - [ ] Criar projeto Laravel (versão estável mais recente, PHP 8.3+) em `backend/` neste repositório
> - [ ] Configurar banco relacional (sugestão: PostgreSQL) e Redis para cache/filas
> - [ ] Atualizar `docker-compose.yml` com os serviços `api`, `db` e `redis`, mantendo o front funcionando
> - [ ] `.env.example` com todas as variáveis necessárias (incluindo `TAX_ENGINE=fake`)
> - [ ] Healthcheck `GET /api/health`
> - [ ] README com instruções de subida local
>
> ## Critérios de aceite
> - `docker compose up` sobe front, API e banco sem passos manuais além de copiar o `.env`
> - `php artisan migrate` roda sem erros em banco limpo
> - `GET /api/health` retorna 200
>
> ## Observações
> Assume monorepo (`backend/` junto do front). Se a decisão for repositório separado, ajustar esta tarefa.
>
> ---
> Referência: documento *Direcionamento do TaxFlow* (set/2026).
