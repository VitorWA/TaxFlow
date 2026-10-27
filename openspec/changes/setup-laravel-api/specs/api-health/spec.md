## ADDED Requirements

### Requirement: Healthcheck reporta disponibilidade das dependências
A API SHALL expor `GET /api/health`, sem autenticação, que verifica a conexão padrão de banco (`select 1`) e a conexão Redis (`ping`) e responde em JSON no formato `{"status": "ok"|"fail", "checks": {"database": "ok"|"fail", "redis": "ok"|"fail"}}`.

#### Scenario: Todas as dependências disponíveis
- **WHEN** um cliente faz `GET /api/health` com banco e Redis respondendo
- **THEN** a resposta é HTTP 200 com corpo `{"status": "ok", "checks": {"database": "ok", "redis": "ok"}}`

#### Scenario: Banco indisponível
- **WHEN** um cliente faz `GET /api/health` e a checagem do banco lança exceção
- **THEN** a resposta é HTTP 503 com `status` = `fail`, `checks.database` = `fail` e `checks.redis` = `ok`

#### Scenario: Redis indisponível
- **WHEN** um cliente faz `GET /api/health` e o `ping` do Redis lança exceção
- **THEN** a resposta é HTTP 503 com `status` = `fail`, `checks.database` = `ok` e `checks.redis` = `fail`

#### Scenario: Banco sem migrations
- **WHEN** o banco está acessível mas nenhuma migration foi executada
- **THEN** `GET /api/health` responde HTTP 200, porque a checagem não depende de tabelas

### Requirement: Healthcheck não expõe detalhes de infraestrutura
A resposta do `GET /api/health` MUST NOT conter mensagens de exceção, hosts, portas, usuários ou credenciais. A falha de uma checagem SHALL ser registrada no log da aplicação.

#### Scenario: Falha com mensagem sensível
- **WHEN** a checagem do banco falha com uma exceção cuja mensagem contém host e usuário
- **THEN** o corpo da resposta contém apenas `status` e `checks`, sem a mensagem da exceção
- **AND** a exceção é registrada no log
