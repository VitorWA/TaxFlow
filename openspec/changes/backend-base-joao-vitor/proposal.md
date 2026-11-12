# Proposal

## Why

As issues #9–#14 atribuídas a João Vitor precisam transformar o skeleton Laravel da #8 em uma API utilizável: autenticação, domínio fiscal e empresas isoladas por usuário. Os contratos comuns e os checks de qualidade devem existir antes dos próximos cadastros.

## What Changes

- Adicionar pipeline de PHPUnit, Pint e Larastan para PRs destinados a `develop` e `main` (#9).
- Padronizar rotas `/api/v1`, erros JSON, resources, paginação, validação, CORS e correlação de logs (#10).
- Implementar login, logout, perfil autenticado e limitação de tentativas com Sanctum (#11).
- Criar enums fiscais, value objects de CNPJ/NCM/EAN e catálogo de opções (#12).
- Implementar cadastro, consulta e atualização de empresas, validação de CNPJ e persistência do regime (#13).
- Vincular usuários a empresas, atribuir `owner` ao criador e aplicar autorização e filtros por empresa (#14).
- Registrar explicitamente as integrações de policies que dependem dos futuros models de estabelecimento, produto e consulta tributária.

## Capabilities

### New Capabilities

- `backend-quality`: checks de qualidade reproduzíveis e automatizados.
- `api-conventions`: contratos transversais e observabilidade da API.
- `user-auth`: autenticação por token e revogação da sessão corrente.
- `fiscal-domain`: tipos fiscais validados e catálogo de enums.
- `company-management`: empresas e isolamento de acesso por vínculo.

### Modified Capabilities

Nenhuma spec viva existente. O healthcheck da change `setup-laravel-api` permanece compatível.

## Impact

Backend Laravel/PHP 8.5, migrations, testes, configuração, documentação e GitHub Actions. Novas dependências: Laravel Sanctum e Larastan. Mantém MySQL conforme a decisão anterior da #8; testes locais usam banco isolado. Não inclui integrações tributárias, frontend, administração de membros, deploy, publicação de PR ou commits.
