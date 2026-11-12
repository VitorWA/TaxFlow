# Review — CHANGES-REQUESTED

- Data: 12/11/2026 (America/Cuiaba).
- Change: `backend-base-joao-vitor`, cards #8–#14.
- Branch: `codex/joao-vitor-issues`.
- Base e HEAD: `1c1e57c0b551a994ee694a20f89e9fd103949c75` (`develop`); implementação ainda sem commits, incluindo arquivos não rastreados.
- Passes sequenciais: conformidade com specs/cards; fluxo HTTP e autorização; domínio/persistência; segurança; testes/CI/documentação.

## Evidências atuais

- OpenSpec `status --change backend-base-joao-vitor --json`: planejamento completo.
- OpenSpec `validate backend-base-joao-vitor --type change --strict --no-interactive`: passou.
- `docker compose exec -T api php artisan test --compact`: **68 passed, 262 assertions**, 5,49 s.
- `docker compose exec -T api vendor/bin/pint --test`: passou, 68 arquivos.
- `docker compose exec -T api vendor/bin/phpstan analyse --no-progress --memory-limit=512M`: sem erros.
- `git diff --check`: sem erros de whitespace; avisos locais de conversão LF/CRLF nas skills preexistentes.
- Repro isolada pelo kernel HTTP no container: email em array produz 500.
- `composer audit --format=json --no-interaction`: código 1, 7 avisos em 4 pacotes.

## Veredito

**CHANGES-REQUESTED**: corrigir R1 e preencher a documentação R2 antes de aceitar esta entrega. Nenhum blocker/high novo demonstrado; dois achados P2 acionáveis. Ver detalhes e limites em `achados.md`.

Testes verdes não cobrem todos os contratos: faltou entrada composta no login. A revisão não certifica execução no GitHub nem integração dos recursos futuros da #14. Não foram alterados código de produção, dependências ou testes; apenas relatórios e tarefas do review. Nenhum commit, push ou PR.

Próximo passo: `$mashure-apply` para corrigir R1/R2, registrar evidência no checklist e repetir os checks afetados.
