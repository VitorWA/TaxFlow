# Review: setup-laravel-api

| Campo | Valor |
|-------|-------|
| Change | `setup-laravel-api` |
| PRD | `docs/prds/setup-laravel-api/PRD.md` (issue #8) |
| Branch | `develop` |
| Base / SHA | `ffef9b1` (HEAD). A change ainda não foi commitada; o diff revisado é a working tree contra o HEAD. |
| Data | 2026-10-26 |
| Revisor | Claude (passes sequenciais, sem agentes paralelos) |

## Veredito: **CHANGES-REQUESTED**

Não há blocker nem high. Os critérios de aceite e todos os cenários das specs foram comprovados (ver `achados.md`). Peço mudanças por causa de três achados **medium** dentro do escopo, todos baratos de corrigir:

- **M1:** MySQL e Redis expostos em `0.0.0.0`, com o Redis sem senha.
- **M2:** `backend/AGENTS.md`/`CLAUDE.md` instruem agentes a executar instaladores remotos.
- **M3:** o `vendor/` fica desatualizado quando o `composer.lock` muda, e isso não está documentado.

| Severidade | Qtd | IDs |
|------------|-----|-----|
| blocker | 0 | — |
| high | 0 | — |
| medium | 3 | M1, M2, M3 |
| low | 4 | L1, L2, L3, L4 |
| nit | 1 | N1 |

L2 e L3 são alertas que cabem melhor na #42 (monitoramento e Dockerfile de produção).

## Comandos executados

| Comando | Resultado |
|---------|-----------|
| `openspec status --change setup-laravel-api` | 4/4 artefatos |
| `openspec validate setup-laravel-api --type change --strict --no-interactive` | `Change 'setup-laravel-api' is valid` |
| `docker compose exec api vendor/bin/pint --test <arquivos da change>` | `PASS … 5 files` |
| `docker compose exec api php artisan test` | `6 passed (13 assertions)` (rodado no apply e de novo no review) |
| `docker compose exec api php artisan route:list --path=api` | apenas `GET api/health → HealthController` |
| `docker port taxflow-redis-1` / `taxflow-db-1` | `0.0.0.0:6379` e `0.0.0.0:3306` (M1) |
| `redis-cli CONFIG GET requirepass` | vazio (M1) |
| `docker compose exec api id -u` | `0` (L3) |
| `grep -cE 'ERROR: (db down\|redis down)' backend/storage/logs/laravel.log` | `6` (L1) |

Ainda não existem lint de projeto, Larastan nem CI (#9). O Pint foi usado só como checagem pontual.

## Gates

- [x] Artefatos completos e validação estrita OK
- [x] Testes verdes
- [x] Critérios de aceite do PRD (CA1–CA11) comprovados
- [ ] Achados medium M1–M3 corrigidos
- [ ] Task 6.4 (rollback) executada ou dispensada explicitamente

## Próximo passo

`/mashure:apply setup-laravel-api` para corrigir M1–M3 (e, se quiser, L1 e L4, que também são baratos). Depois, um novo review curto e `/mashure:archive`.

## Correções aplicadas (2026-10-26)

Os achados M1, M2, M3, L1, L4 e N1 foram corrigidos e verificados (evidências em `tasks.md`, grupo 7). L2 (timeout do health) e L3 (container root) continuam como alertas para a #42. A task 6.4 (rollback) continua pendente até existir commit. Falta um re-review curto para fechar o veredito.
