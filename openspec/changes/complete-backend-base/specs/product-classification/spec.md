## Purpose

Definir comportamento verificável para product-classification no backend Laravel do TaxFlow, mantendo autorização e evidências de teste.

## ADDED Requirements

### Requirement: Produtos e NCM
/api/v1/products SHALL suportar listagem filtrada, cadastro, detalhe e update; NCM deve existir, estar vigente e pertencer ao catálogo importado.

#### Scenario: NCM inválida
- **WHEN** um owner escolhe NCM inexistente ou não vigente
- **THEN** a API retorna 422

### Requirement: Confirmação e histórico
POST /products/{product}/confirm-ncm SHALL registrar usuário/data no servidor; alterações de NCM removem confirmação e geram histórico transacional consultável somente por membros vinculados.

#### Scenario: Troca de classificação
- **WHEN** o owner troca NCM de produto confirmado
- **THEN** o status volta a sugerida e o histórico preserva anterior/novo/autor/data

### Requirement: Autorização
Produtos SHALL ser consultados apenas por usuários vinculados à empresa; somente owners escrevem e company_id não pode ser transferido por update.

#### Scenario: Produto alheio
- **WHEN** usuário consulta ou altera produto de empresa sem vínculo
- **THEN** a API retorna 404 sem divulgar dados
