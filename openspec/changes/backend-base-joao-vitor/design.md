# Design

## Context

O skeleton da #8 já está na `develop`: Laravel 13, PHP 8.5.12, MySQL 8.4, Redis e healthcheck. `backend/AGENTS.md` exige PHP e Composer via Docker. Não há specs vivas; a change anterior contém o contrato do healthcheck e as decisões do ambiente. A motivação está em `proposal.md`.

## Goals / Non-Goals

**Goals:** contratos HTTP consistentes, autenticação por token, tipos fiscais reutilizáveis e isolamento transacional das empresas, com evidência de testes.

**Non-Goals:** implementação dos cadastros #15–#17, consultas tributárias, administração de membros, frontend, deploy e alterações de proteção de branches. Nenhum commit ou publicação sem autorização do operador.

## Decisions

### D1. Base existente e qualidade (#8/#9)

Manter MySQL e PHP definidos na change anterior; a sugestão original de PostgreSQL não substitui uma decisão já implementada. Usar PHPUnit existente, Pint e Larastan nível 5. Testes locais usam SQLite em memória e mocks de Redis, com ambiente de teste explícito. CI executa checks nas branches de destino exigidas; registrar duração real após execução remota, sem presumir a meta de cinco minutos.

### D2. Contrato HTTP (#10)

Prefixo `/api/v1` para novos endpoints. Manter `/api/health` compatível. Sucessos usam API Resources com `data`; coleções paginadas usam `links` e `meta`. FormRequests validam payloads e query strings, com allowlist de ordenação e limite de página. Erros usam `{error:{code,message,details},request_id}`; exceções inesperadas têm mensagem genérica fora do local. Middleware atribui request ID, adiciona header de resposta e registra evento estruturado sem payload sensível. CORS aceita origem configurável do frontend local.

### D3. Autenticação (#11)

Sanctum com tokens pessoais; login verifica email e hash de senha, logout revoga somente o token corrente, `me` devolve Resource de usuário. Throttle de login com resposta 429. Todos os endpoints de domínio usam `auth:sanctum`; login e health permanecem públicos. Seeder de desenvolvimento idempotente e protegido contra uso inadvertido em produção. JWT externo não se justifica para este escopo.

### D4. Tipos fiscais (#12)

Enums string-backed no domínio, com rótulos de exibição. Regimes: `simples_nacional`, `lucro_presumido`, `lucro_real`, `mei`; UFs: 27 siglas; operações iniciais: `venda`, `transferencia`, `devolucao`; finalidades: `revenda`, `consumo_final`, `industrializacao`, `uso_consumo`, `ativo_imobilizado`; destinatários: `pessoa_fisica`, `pessoa_juridica`; condições: `contribuinte`, `nao_contribuinte`, `isento`.

Operações e tipos de destinatário são um catálogo inicial provisório, não uma declaração de cobertura tributária. Value objects validam CNPJ, NCM (oito dígitos) e GTIN (formatos 8/12/13/14). Implementar CNPJ conforme fonte oficial consultada e registrar suporte numérico/alfanumérico na evidência; não transformar validação estrutural em consulta de existência cadastral. Enum `TaxRegime` é cast no model Company; demais casts acompanham futuros models.

### D5. Empresa e vínculo (#13/#14)

Persistir CNPJ canônico com índice único, razão social, nome fantasia e regime. Usar transação para inserir empresa e vínculo `owner` em `company_user`, com unicidade do par. Factories e seeders usam identificadores válidos. Consulta sempre parte do relacionamento/escopo de empresas acessíveis; policy cobre acesso direto e atualização. Política inicial: `member` lê e `owner` altera. Não há endpoint de gestão de membros nesta entrega.

### D6. Policies de recursos futuros (#14)

Reutilizar a verificação de vínculo da empresa nas policies de Establishment, Product e TaxConsultation. Esses models ainda não existem na base; testar a regra com um contrato explícito de recurso pertencente à empresa e registrar que roteamento, registro e integração real serão validados quando os models chegarem. Não criar modelos de negócio incompletos somente para aparentar conclusão dos cards futuros.

## Risks / Trade-offs

- SQLite não reproduz todas as particularidades de MySQL → manter testes de integridade e executar smoke de migrations no banco isolado quando disponível; registrar o alcance da evidência.
- Cadastro simultâneo do mesmo CNPJ → índice único além de validação e tratamento consistente da colisão.
- Catálogos fiscais provisórios → documentar valores estáveis e revisão necessária antes de expandir cobertura fiscal.
- Policies de recursos futuros sem endpoints → separar evidência da regra de autorização da integração futura, sem marcar essa integração como concluída.
- Pipeline ainda não executado no GitHub → checks locais são evidência parcial; duração e execução remota ficam pendentes até publicação autorizada.

## Migration Plan

Instalar dependências pelo Composer no container, aplicar migrations aditivas em banco local após confirmar destino e executar suíte em banco de teste. Revisar o diff antes de qualquer commit. Não executar rollback destrutivo no banco de desenvolvimento. Para reversão futura, fazer backup, reverter a entrega e avaliar migrations inversas em ambiente descartável; não remover tabelas que já contenham dados sem decisão explícita.
