## Purpose

Definir comportamento verificável para establishment-management no backend Laravel do TaxFlow, mantendo autorização e evidências de teste.

## ADDED Requirements

### Requirement: Cadastro e validação
Rotas /api/v1/companies/{company}/establishments SHALL listar, criar, consultar e atualizar estabelecimentos; CNPJ válido da mesma raiz e UF são obrigatórios.

#### Scenario: Raiz diferente
- **WHEN** um owner cadastra estabelecimento de outra raiz
- **THEN** a API retorna 422 sem gravar

### Requirement: Isolamento aninhado
O sistema SHALL permitir leitura a membros vinculados e escrita somente a owners; o estabelecimento deve pertencer à empresa da URL.

#### Scenario: ID de outra empresa
- **WHEN** um usuário acessa estabelecimento com parent incorreto
- **THEN** a API retorna 404
