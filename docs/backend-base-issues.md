# Backend base — issues de João Vitor

Esta entrega acompanha os cards atribuídos a `JoaoVitor9991` na branch `codex/joao-vitor-issues`. A implementação e as evidências são registradas em [tasks.md](../openspec/changes/backend-base-joao-vitor/tasks.md). Este documento não declara conclusão antes dos checks.

| Card | Entrega e critério | Observação |
| --- | --- | --- |
| [#8](https://github.com/VitorWA/TaxFlow/issues/8) | Skeleton Laravel, Docker e healthcheck | Já implementado na develop; verificar regressão. PHP 8.5/MySQL decorrem de decisões anteriores. |
| [#9](https://github.com/VitorWA/TaxFlow/issues/9) | PHPUnit isolado, Pint, Larastan e CI em PRs | Duração real e execução no GitHub dependem de publicação autorizada. |
| [#10](https://github.com/VitorWA/TaxFlow/issues/10) | `/api/v1`, erros uniformes, Resources, validação, CORS e request ID | `/api/health` mantém seu contrato. |
| [#11](https://github.com/VitorWA/TaxFlow/issues/11) | Login, logout, perfil, throttle e seed local | Tokens Sanctum; rotas de domínio autenticadas. |
| [#12](https://github.com/VitorWA/TaxFlow/issues/12) | Enums, CNPJ/NCM/EAN e catálogo de selects | Tipos de operação/destinatário são catálogo inicial provisório. |
| [#13](https://github.com/VitorWA/TaxFlow/issues/13) | Cadastro, listagem, detalhe e atualização de empresas | CNPJ canônico único; regime persistido. |
| [#14](https://github.com/VitorWA/TaxFlow/issues/14) | Vínculos owner/member, policies e isolamento | Owner altera, member consulta. Integração das policies de recursos futuros permanece rastreada. |

## Contratos e limites

- Novas rotas usam `/api/v1`; respostas de sucesso usam `data`; paginação inclui `links` e `meta`.
- Erros usam `error.code`, `error.message`, `error.details` e `request_id`.
- CNPJ válido estruturalmente não equivale a consulta cadastral na Receita; NCM com oito dígitos não comprova vigência. Integrações oficiais pertencem aos próximos cards.
- Não há gestão de membros, CRUD de estabelecimentos/produtos ou análise tributária nesta entrega.
- Policies de Establishment, Product e TaxConsultation precisam de integração e testes com os models/rotas quando esses recursos forem implementados.
- Não há commits, push, PR ou deploy autorizados. A revisão local antecede qualquer solicitação de publicação.

## Validação

Comandos e resultados efetivos serão acrescentados ao checklist da change durante a implementação. O backend deve ser executado exclusivamente pelo Docker conforme `backend/AGENTS.md`. Não instalar PHP/Composer no host, não executar testes contra dados de desenvolvimento e não usar rollback destrutivo como teste de rotina.
