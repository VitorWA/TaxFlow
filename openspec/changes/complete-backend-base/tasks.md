# Tasks
## 1. Fundação #42
- [x] 1.1 Atualizar dependências afetadas e validar Composer audit.
- [x] 1.2 Adicionar dev/production, worker/scheduler, scripts e proxy; validar config/build e smoke isolado de fila/scheduler.
- [x] 1.3 Ampliar CI MySQL/Redis e frontend; documentar limites externos de homologação/produção.
## 2. NCM #16
- [x] 2.1 Model/migration, importador atômico idempotente e fixtures oficiais; testar carga repetida, inválida, hierarquia e datas.
- [x] 2.2 Endpoints autorizados paginados com vigência/fonte; testar pesquisa, inexistente e datas.
- [x] 2.3 Smoke de arquivo oficial no MySQL isolado, registrar metadados e resultado sem acessar banco dev.
## 3. Estabelecimentos #15
- [x] 3.1 Model/migration/Requests/Resources/controller aninhado e policies; testar CNPJ/raiz/UF, parent incorreto e owner/member/outsider.
## 4. Produtos #17
- [x] 4.1 Model/migrations/endpoints com EAN e NCM vigente; testar isolamento e payload inválido.
- [x] 4.2 Confirmação e histórico transacionais; testar invalidação após troca e campos protegidos.
## 5. OpenAPI #18
- [x] 5.1 Gerar Scribe/OpenAPI com exemplos e response calls desativadas; testar docs local e 404 produção e cobertura dos paths.
- [x] 5.2 Atualizar README operacional, contratos e roteiro manual.
## 6. Integração
- [x] 6.1 Executar testes SQLite e MySQL isolados, Pint, Larastan, build frontend, Composer audit e OpenSpec estrito.
- [x] 6.2 Conferir diff e registrar evidências e pendências externas; entregar sem commit/push/PR.
## Pendências externas da #42
- Hospedagem, domínio/DNS/TLS, secrets, backup/restore, deploy e monitoramento reais aguardam infraestrutura definida.
- Proteção de branches e execução remota do CI exigem publicação/autorização específica; não afirmar conclusão desses critérios com validação local.
- Solicitar mashure-review antes de arquivamento. Não sincronizar specs vivas ou arquivar nesta implementação.

## Evidências — 12/11/2026

Após a validação abaixo, o operador autorizou commit local na mesma branch. Essa autorização substitui a restrição de commit da etapa 6.2; push/PR continuam fora desta entrega. Arquivos de vínculo pessoal do Postman permanecem fora do commit.

- Branch `codex/backend-base-api`: fetch de origin e merge `--ff-only origin/develop` retornaram already up to date; dois commits locais preexistentes. Nenhum novo commit/push/PR nesta entrega. Arquivos locais `.postman/` e `postman/` preservados.
- `docker compose exec -T api php artisan test --compact --no-ansi`: **82 testes, 453 assertions**, SQLite em memória, todos passaram. Inclui auth, empresas, domínio, novas APIs, isolamento, histórico e documentação.
- `./scripts/test-api.ps1 -MySql`: build/health do compose isolado, **82 testes, 453 assertions** no MySQL; `vendor/bin/phpunit tests/Integration`: **2 testes, 9 assertions**, worker Redis real em fila exclusiva e execução de tarefa pelo scheduler. Cache array nos testes HTTP; Redis exclusivo nos smokes. Banco dev não foi migrado/limpo pelos testes.
- Regressão reproduzida e corrigida: `company_id:null` na edição causava NOT NULL/500. Regras `missing` agora rejeitam qualquer presença dos campos protegidos, inclusive null, com 422. Cenários adicionados à suíte.
- Carga oficial Siscomex no MySQL `taxflow_postman`: **10.516 códigos**, primeira carga `unchanged:false`; repetição `unchanged:true`. Referência `Vigente em 12/11/2026`, SHA-256 `a6f9573ea01cc6d9a9b634c1911d2d55705b4f687cdd53871d35f97ed470a450`. Arquivo e dados de smoke ficam fora do Git; a suíte MySQL posterior recria o banco de teste.
- `vendor/bin/pint --test`: **100 arquivos**, passou. `vendor/bin/phpstan analyse --no-progress --memory-limit=512M`: sem erros. `composer validate --strict`: válido; `composer audit`: nenhum advisory após atualizações no lock.
- Scribe 5.11: geração sem ResponseCalls/geração de models/escritas; fixtures estáticas versionadas, schemas 2xx em todos os endpoints documentados, filtros GET como query e login 429. `/docs`, `/docs.openapi`, `/docs.postman` 200 local/testing e 404 production, verificados por PHPUnit e smoke HTTP da imagem.
- Dockerfile production construído com sucesso; smoke local com MySQL/Redis isolados: `/api/health` 200, docs 404, sem `.env`, Composer ou PHPUnit. CMD explícito em cada estágio final evita que mudar ENTRYPOINT apague o CMD herdado. Container temporário removido após o smoke.
- Compose dev API healthy, worker/scheduler ativos, volumes existentes preservados. `curl http://localhost:3000/api/health` via proxy Vite retornou banco/Redis ok. `npm run build` no container frontend: **1.668 módulos**, passou. Ambos Compose validados com `config --quiet`.
- `.github/workflows/backend.yml` ampliado para MySQL/Redis/SQLite e frontend; configuração entregue, **CI remoto não executado** porque não houve push. Scripts aguardam readiness antes de testar.
- README e `docs/api-local.md` documentam setup, seed/login, contratos, importação, comandos automatizados e roteiro manual. `docs/infraestrutura.md` separa entregas locais dos critérios externos ainda pendentes da #42. Frontend continua com telas simuladas; estes cards não integram todas as telas.
- Achado externo ao escopo: npm audit do frontend existente reporta **5 dependências** (3 moderate/2 high), envolvendo Vite/esbuild, React Router e source-map-js. Não declarar auditoria frontend limpa nem fazer upgrade principal sem uma entrega própria.
- OpenSpec `validate complete-backend-base --strict` e `git diff --check`: passaram. Próximo gate recomendado: `$mashure-review`; change não sincronizada nem arquivada.
