## Purpose

Oferecer contratos previsíveis para clientes da API e permitir diagnóstico de falhas sem expor dados internos ou credenciais.

## ADDED Requirements

### Requirement: Versionamento e recursos
Novos endpoints de domínio MUST usar `/api/v1` e respostas de sucesso com envelope `data`. Coleções paginadas MUST fornecer `links` e `meta`. O contrato existente de `/api/health` MUST permanecer compatível.

#### Scenario: Consulta paginada
- **WHEN** o cliente lista empresas usando parâmetros válidos
- **THEN** recebe dados, links e metadados de paginação no contrato documentado

### Requirement: Erros uniformes
Erros 422, 401, 403, 404, 429 e 5xx MUST retornar JSON com `error.code`, `error.message`, `error.details` e `request_id`.

#### Scenario: Validação inválida
- **WHEN** uma requisição contém dados inválidos
- **THEN** a API retorna 422 e detalhes por campo no envelope de erro

#### Scenario: Falha inesperada
- **WHEN** uma exceção não tratada ocorre fora do ambiente local
- **THEN** a resposta 500 contém mensagem genérica e não expõe trace, SQL ou credenciais

### Requirement: Query strings validadas
Listagens MUST validar os parâmetros de paginação, filtros e ordenação, limitar o tamanho das páginas e rejeitar campos de ordenação não permitidos.

#### Scenario: Ordenação desconhecida
- **WHEN** o cliente solicita ordenação por um campo não permitido
- **THEN** a API retorna 422 em vez de interpolar o campo na consulta

### Requirement: CORS de desenvolvimento
A API MUST permitir a origem configurada do frontend de desenvolvimento e os headers necessários para autenticação e correlação.

#### Scenario: Preflight do frontend
- **WHEN** a origem local configurada envia preflight para a API
- **THEN** a resposta permite os métodos e headers usados pelo cliente

### Requirement: Correlação de requisições
A API MUST associar um identificador a cada requisição, devolvê-lo ao cliente e incluí-lo em logs estruturados sem registrar senhas ou tokens.

#### Scenario: Diagnóstico de erro
- **WHEN** uma requisição falha
- **THEN** o identificador da resposta permite localizar o evento correspondente no log
