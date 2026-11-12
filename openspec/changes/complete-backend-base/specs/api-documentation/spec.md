## Purpose

Definir comportamento verificável para api-documentation no backend Laravel do TaxFlow, mantendo autorização e evidências de teste.

## ADDED Requirements

### Requirement: Documentação de desenvolvimento
/docs e seus arquivos OpenAPI/Postman SHALL disponibilizar contratos, autenticação, schemas, exemplos e erros da fase 2 apenas em local/testing.

#### Scenario: Ambiente de produção
- **WHEN** um cliente solicita documentação em produção
- **THEN** o servidor retorna 404

### Requirement: Geração segura
A geração SHALL usar exemplos estáticos e não executar escritas ou enviar tokens reais; os contratos incluem todos os endpoints implementados.

#### Scenario: Gerar docs
- **WHEN** scribe:generate é executado
- **THEN** OpenAPI contém os endpoints da fase 2 e geração não altera dados
