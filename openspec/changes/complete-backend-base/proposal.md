# Proposal

## Why
Entregar os cards #15–#18 e a infraestrutura local/CI da #42 sobre a base Laravel existente, com testes automatizados antes do uso manual pelo time.

## What Changes
- Importação transacional e consultas da NCM oficial (#16).
- Estabelecimentos por empresa (#15) e produtos com confirmação/histórico de NCM (#17).
- Documentação OpenAPI gerada, disponível apenas no desenvolvimento (#18).
- Worker, scheduler, build de produção, scripts, proxy e CI MySQL/Redis/front (#42).

## Capabilities
### New Capabilities
- `ncm-catalog`: catálogo oficial importado, vigência e pesquisa.
- `establishment-management`: matriz/filial autorizadas por empresa.
- `product-classification`: produtos, confirmação e histórico auditável.
- `api-documentation`: OpenAPI e exemplos para integração.
- `runtime-infrastructure`: desenvolvimento, filas e validações reproduzíveis.
### Modified Capabilities
Nenhuma spec viva publicada; preservar contratos da base já implementada.

## Impact
PHP 8.5.12, Laravel 13, MySQL 8.4 e Redis mantidos conforme PRD aprovado. Inclui Scribe e correções de segurança das dependências da base. Não inclui deploy remoto, domínio, contratação de hospedagem ou mudanças administrativas no GitHub; esses critérios da #42 permanecem externos. Nenhum commit/push autorizado nesta etapa.
