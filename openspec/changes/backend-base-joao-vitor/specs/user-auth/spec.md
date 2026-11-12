## Purpose

Permitir autenticação de usuários da API e restringir o acesso aos dados de domínio a identidades autenticadas.

## ADDED Requirements

### Requirement: Login por credenciais
`POST /api/v1/auth/login` MUST emitir token de API para credenciais válidas e responder 401 no envelope padrão para credenciais incorretas.

#### Scenario: Login válido
- **WHEN** o usuário envia email e senha corretos
- **THEN** recebe token utilizável e dados públicos do usuário

#### Scenario: Login inválido
- **WHEN** o usuário envia senha incorreta ou email inexistente
- **THEN** recebe 401 sem revelar qual credencial está incorreta

### Requirement: Limitação de tentativas
O endpoint de login MUST limitar tentativas e responder 429 quando o limite for excedido.

#### Scenario: Excesso de tentativas
- **WHEN** tentativas sucessivas excedem o limite configurado
- **THEN** novas tentativas recebem 429 com indicação de espera

### Requirement: Perfil e logout
`GET /api/v1/auth/me` MUST retornar o usuário autenticado. `POST /api/v1/auth/logout` MUST invalidar o token utilizado na requisição.

#### Scenario: Token revogado
- **WHEN** o cliente faz logout e reutiliza o mesmo token
- **THEN** o acesso a uma rota protegida retorna 401

### Requirement: Rotas de domínio protegidas
Todas as rotas de domínio, inclusive o catálogo de enums e empresas, MUST exigir autenticação. Healthcheck e login MUST permanecer acessíveis sem token.

#### Scenario: Acesso anônimo
- **WHEN** um cliente sem token solicita empresas ou enums
- **THEN** recebe 401 no envelope padrão

### Requirement: Usuário de desenvolvimento
O ambiente local MUST oferecer um seeder documentado de usuário de desenvolvimento, sem criar automaticamente credenciais conhecidas em produção.

#### Scenario: Seed local repetido
- **WHEN** o seeder de desenvolvimento roda mais de uma vez
- **THEN** o usuário continua disponível sem duplicação
