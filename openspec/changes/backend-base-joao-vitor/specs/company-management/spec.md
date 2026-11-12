## Purpose

Manter os dados fiscais das empresas e restringir sua consulta e alteração aos usuários vinculados, preparando os próximos recursos do domínio.

## ADDED Requirements

### Requirement: Cadastro de empresa
`POST /api/v1/companies` MUST cadastrar CNPJ único, razão social, nome fantasia opcional e regime tributário, persistindo os dados fiscais documentados.

#### Scenario: Cadastro válido
- **WHEN** um usuário autenticado envia os dados obrigatórios válidos
- **THEN** a API cria a empresa e retorna seus dados com status 201

#### Scenario: CNPJ duplicado
- **WHEN** o CNPJ canônico já pertence a outra empresa
- **THEN** a API rejeita o cadastro com 422

### Requirement: Consulta e atualização
`GET /api/v1/companies`, `GET /api/v1/companies/{id}` e `PATCH /api/v1/companies/{id}` MUST permitir listar, consultar e atualizar empresas conforme autorização. O regime informado MUST permanecer disponível nas consultas posteriores.

#### Scenario: Persistência do regime
- **WHEN** o proprietário altera o regime e consulta novamente a empresa
- **THEN** recebe o regime atualizado

### Requirement: Criador como proprietário
A criação de empresa MUST vincular o usuário criador com papel `owner` na mesma transação. Outros vínculos suportam papel `member`.

#### Scenario: Falha na vinculação
- **WHEN** a vinculação do proprietário falha durante a criação
- **THEN** a operação é revertida sem deixar empresa órfã

### Requirement: Isolamento por vínculo
Listagens MUST retornar somente empresas vinculadas ao usuário. Acesso direto a empresas sem vínculo MUST retornar 403 ou 404, sem divulgar seus dados.

#### Scenario: Outro usuário
- **WHEN** um usuário solicita ou tenta alterar uma empresa de outro usuário, sem vínculo próprio
- **THEN** não recebe dados nem altera a empresa

### Requirement: Papéis de acesso
Usuários `member` MUST poder consultar empresas vinculadas; somente `owner` MUST poder alterar seus dados nesta versão.

#### Scenario: Membro tenta alterar
- **WHEN** um membro envia atualização de dados da empresa
- **THEN** a API retorna 403 e mantém os dados existentes

### Requirement: Autorização de recursos subordinados
Policies de estabelecimento, produto e consulta tributária MUST verificar acesso pela empresa proprietária. A integração com rotas e models desses recursos MUST ser validada nas changes que os introduzirem; esta change não declara tais endpoints concluídos.

#### Scenario: Recurso de empresa sem vínculo
- **WHEN** a autorização de um recurso subordinado é consultada para usuário sem vínculo com sua empresa
- **THEN** o acesso é negado
