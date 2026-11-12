# Análise técnica — cadastros, NCM, documentação e infraestrutura

Data: 12/11/2026. Cards consultados no GitHub: #15, #16, #17, #18 e #42, incluindo comentários (nenhum comentário nesses cards na consulta). Este documento é entrada para as próximas proposals OpenSpec; não declara implementação desses cards.

## Base confirmada

- Runtime verificado no container: PHP **8.5.12**, Laravel **13.38.0**.
- Framework e linguagem preservados: Laravel/PHP, Eloquent, migrations, FormRequests, API Resources, policies, Sanctum, PHPUnit, Pint e Larastan.
- MySQL 8.4 e Redis 7, via Docker. Não instalar PHP/Composer no host.
- Novos endpoints sob `/api/v1`, com o mesmo envelope de erro, paginação validada e request ID.
- Branch atual: `codex/backend-base-api`. Novas branches usarão nomes de funcionalidades, sem nome de pessoa. Novos commits, push e PR dependem de nova autorização.
- Trabalho local do usuário em `.postman/` e `postman/` deve ser preservado. O vínculo local aponta para workspace diferente daquele criado pelo MCP; não sincronizar automaticamente.

## Diferença entre o card #42 e a decisão vigente

O texto da #42 ainda cita PHP 8.3, PostgreSQL e `pdo_pgsql`, e diz que não existe backend/CI. A situação mudou. O PRD `docs/prds/setup-laravel-api/PRD.md`, seções 8 e 10, já decide PHP 8.5.12, MySQL 8.4 e `pdo_mysql`, e registra expressamente que #42/#9 precisam ser alinhadas. Portanto, manter a base aprovada e registrar o desvio; não migrar banco ou reduzir PHP silenciosamente. Não editar os cards externos sem solicitação.

## Ordem de execução e gates

| Etapa | Escopo | Evidência necessária antes de seguir |
| --- | --- | --- |
| 0 | Pendências da entrega anterior | Documentar uso/qualidade (R2), triagem dos avisos Composer e reconciliar tasks com evidências. Revalidar se houver mudança de dependências. |
| 1 | #42, somente fundação local/CI | Tornar o ambiente de teste reproduzível, adicionar worker/scheduler e smoke de job, scripts, proxy para API, build de produção e CI com MySQL/Redis + front. Sem substituir dados/volumes existentes. |
| 2 | #16, NCM | Importação do arquivo oficial repetida sem duplicação; dados inválidos sem importação parcial; busca por código/descrição; fonte, ato e vigência no retorno; testes de datas nas bordas. |
| 3 | #15, estabelecimentos | CNPJ válido e mesma raiz da empresa; UF obrigatória; vínculo correto nas rotas aninhadas; owner/member e usuário de outra empresa testados no HTTP. |
| 4 | #17, produtos | NCM existente e vigente; criação/edição/confirmação; confirmação invalidada após troca de NCM; histórico auditável; isolamento entre empresas. |
| 5 | #18, OpenAPI | Documentar os endpoints reais da fase 2, exemplos e erros; `/docs` apenas em desenvolvimento; verificar geração e contrato dos schemas. Repetir fluxos pelo Postman. |
| 6 | #42, preparação de homologação/produção | Registrar o que depende de hospedagem, DNS, credenciais, backups/restore e operação. Não declarar infraestrutura remota entregue por existir Dockerfile. |

O ambiente HTTP/MySQL isolado já existe em `docker-compose.postman.yml`, portanto o restante da #42 não bloqueia todos os testes de cadastros. A etapa 1 deve ser uma fatia pequena; qualquer decisão externa pendente não paralisa #16/#15. Não misturar todos os cards em uma única task sem checkpoints.

## #16 — Base de NCM

- Fonte oficial: [Receita Federal — Download NCM](https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/classificacao-fiscal-de-mercadorias/download-ncm-nomenclatura-comum-do-mercosul). Endpoint divulgado: `https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json`.
- A Receita informa que o download contém somente a tabela vigente, sem códigos passados ou futuros. Não apresentar esse arquivo como histórico completo. Casos de vencimento/futuro precisam de fixtures controladas nos testes.
- Confirmar o formato efetivamente recebido antes de fechar o parser. A tabela possui níveis hierárquicos; produtos devem referenciar apenas NCM completo de oito dígitos, preservando zeros iniciais. Validar o arquivo completo antes de persistir.
- `ncm:import` recebe arquivo local oficial; guardar fonte, ato, datas, data da importação e referência da carga. Não executar sincronização automática: pertence à #31.
- Datas devem ser analisadas estritamente; intervalo inválido não pode virar silenciosamente uma NCM vigente. Definir representação explícita de vigência aberta e avaliação em data de referência do servidor.
- A proposta deve definir a chave de idempotência e a política para reimportações/códigos ausentes. Ausência no snapshot não autoriza inventar uma data legal de expiração. Não apagar NCM referenciada por produtos.
- Falta de conectividade com o Siscomex não deve tornar testes automatizados instáveis. Fixtures pequenas com formato oficial para CI; download real e importação de carga completa como smoke separado, com checksum/data registrados.

## #15 — Estabelecimentos

- Reutilizar `State`, `TaxpayerStatus` e `Cnpj`, `BelongsToCompany` e `EstablishmentPolicy`; não duplicar a verificação de dígitos do CNPJ.
- Rotas aninhadas em `/api/v1/companies/{company}/establishments`, incluindo detalhe e atualização. Binding/consulta deve garantir que o estabelecimento realmente pertence à empresa da URL.
- Raiz = primeiros oito caracteres do CNPJ canônico, incluindo suporte alfanumérico já existente. Comparar após normalização.
- `company_id` deve vir da rota autorizada, sem permitir transferência por payload. Manter owner escreve/member lê.
- Card não define gestão de membros nem exclusão: não adicionar essas operações de carona. Regras adicionais de unicidade de matriz ou identificação automática da matriz precisam constar na proposta, sem presumir uma exigência não escrita no card.
- Testar empresa acessível com ID de estabelecimento de outra empresa na URL, além de testar usuário sem vínculo. Uma policy isolada não prova a segurança da rota aninhada.

## #17 — Produtos e classificação

- Depende de #16 e das policies #14. Model/factory/migration, Requests e Resources seguem o padrão das empresas.
- Reutilizar `Ean`, `NcmCode`, `ProductPolicy` e escopo por empresa. EAN/código interno e nulabilidade precisam ser explicitados na proposta, pois o card não define todos os campos obrigatórios.
- Sugestão e confirmação são estados distintos. `confirmed_by`/`confirmed_at` são atribuídos pelo servidor; payload não pode forjar usuário, data ou status confirmado.
- Trocar NCM remove a confirmação anterior. Alteração e histórico devem ser transacionais, com proteção contra gravações concorrentes; confirmar NCM vencido/inexistente deve falhar.
- Histórico registra NCM anterior/novo, autor e data; confirmar sem trocar o código não deve fabricar mudança de NCM. Consultas de histórico também exigem autorização.
- Não aceitar mudança de `company_id` como forma de transportar produto entre empresas. Busca por descrição/EAN/NCM deve permanecer dentro do escopo autorizado.

## #18 — Documentação gerada

- Candidato: Scribe v5, que gera HTML, OpenAPI e coleção a partir de Laravel/FormRequests/Resources. [Documentação oficial](https://scribe.knuckles.wtf/laravel/). Validar resolução real pelo Composer com Laravel 13/PHP 8.5 antes de adicionar.
- Registrar decisão na proposal e fixar dependências no lock. Não fazer downgrade de framework para acomodar documentação.
- Evitar geração de exemplos que execute writes no banco de desenvolvimento. Usar exemplos/fixtures e conexão de teste explícita; não embutir token real ou credenciais de produção.
- Documentar login e Bearer, campos, enums, validações, filtros, paginação, autorização e erros 401/403/404/422/429. Incluir fonte/vigência da NCM e diferença entre classificação sugerida/confirmada.
- Rota de desenvolvimento deve ser testada como indisponível em produção. Não confundir documentação gerada com prova de correção dos endpoints.

## #42 — Infraestrutura em fatias

- Reutilizar FrankenPHP e configuração MySQL aprovada. Adicionar worker e scheduler com comandos Laravel, health/readiness compatíveis e sem instalar dependências simultaneamente no mesmo volume.
- Adicionar build multi-stage sem bind mount no alvo de produção; dependências de desenvolvimento necessárias apenas no alvo de desenvolvimento/CI. Tratar escrita em storage/cache e chave fornecida por ambiente.
- Proxy Vite ou `VITE_API_URL` deve funcionar tanto no navegador quanto na rede Docker; não expor nomes internos de serviço como URL do navegador. Testar chamada do front à API.
- Ampliar CI existente com MySQL/Redis isolados e build do frontend. Testes SQLite continuam úteis; não substituir prova de integração MySQL por mocks.
- Worker deve processar job de teste real em fila exclusiva; scheduler deve executar tarefa observável em ambiente de teste. Não limpar Redis ou bancos usados por outros projetos.
- Proteção de branch exige administração do GitHub e é ação externa; hospedagem, domínio, secrets, backups e monitoramento exigem decisões/contas. São pendências explícitas até configuração e teste reais.
- Mailpit/MinIO são opcionais no card: só incluir se uma fatia precisar deles.

## Critério comum de pronto

Cada fatia requer testes do comportamento e das recusas de acesso, Pint, Larastan, migrations no MySQL isolado quando aplicável e documentação atualizada. Repetir apenas os checks afetados durante desenvolvimento; na integração final executar a suíte completa e os fluxos Postman ampliados. Registrar comando, resultado e limites em `tasks.md` da respectiva change. Não fechar cards ou marcar critérios externos como concluídos antes da evidência.

## Próxima proposta

Separar changes de infraestrutura local/CI, base NCM, estabelecimentos, produtos e documentação. A proposal de produtos deve depender do contrato de NCM já validado. Este refinamento não autoriza ações remotas de produção nem novos commits. O escopo necessário para começar a fundação local está identificado; detalhes dos contratos de NCM/produtos devem ser fechados ao escrever suas proposals.
