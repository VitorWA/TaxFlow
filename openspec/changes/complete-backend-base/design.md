# Design
## Context
Base existente PHP 8.5.12/Laravel 13/MySQL/Redis; análise em docs/analise-proxima-entrega.md. Atualização da branch sem divergência com origin/develop.
## Goals / Non-Goals
Entregar API e infraestrutura testáveis localmente. Serviços remotos e autorização administrativa de branches não são parte do código local.
## Decisions
- Uma change coordenadora com cinco capacidades e tasks independentes, para evitar dependência circular entre infra/docs e recursos; preservar artefatos anteriores.
- NCM: JSON oficial Nomenclaturas, normalizar pontos, ignorar níveis inferiores a oito dígitos, datas estritas d/m/Y, upsert por code. Campo in_current_table identifica presença no snapshot atual; códigos ausentes ficam preservados, mas indisponíveis para novos produtos. Não inventar data legal de término. Registrar SHA-256 e metadados da importação; rejeitar carga vazia/malformada.
- Estabelecimentos: company_id da rota, tipo matriz/filial e UF obrigatórios, CNPJ único e mesma raiz; não impor matriz única sem requisito do card. Binding restrito ao parent antes da autorização.
- Produtos: company_id, description e ncm_code obrigatórios; ean/internal_code opcionais. EAN validado quando presente. status sugerida no cadastro; confirm-ncm atribui autor/data, troca de NCM invalida confirmação. company_id e metadados de confirmação proibidos no update. Histórico em tabela própria com old/new/changed_by; locks de produto e NCM em transações evitam confirmação sobre classificação antiga.
- Datas são avaliadas no fuso configurado da aplicação. NCM permite vigência até data final inclusiva; 31/12/9999 mantém intervalo aberto da fonte. Não há sincronização automática #31.
- Reutilizar policies existentes, Resources, FormRequests e VOs. Segurança owner escreve/member lê, isolamento 404.
- Scribe 5 com response calls desativadas, exemplos estáticos e middleware que oculta documentos em produção.
- Infra: API instala dependências; worker/scheduler iniciam após API healthy e pulam instalação compartilhada. Production tem vendor --no-dev dentro da imagem, sem geração de chave nem .env obrigatório. CI com MySQL/Redis dedicados; a mesma suite roda no MySQL com variáveis explícitas que têm precedência sobre os defaults SQLite do phpunit.xml. Guard no bootstrap bloqueia bancos sem sufixo _test/_postman e DB_URL.
- Credenciais dos testes são fictícias; não mudar contas, política do GitHub, Postman ou infraestrutura externa.
## Risks / Trade-offs
Snapshot NCM não contém histórico oficial completo; preservar registros locais e indicar ausência sem inventar norma. Dependências de produção exigem Composer resolvendo com PHP fixado. Documentação gerada não substitui teste real.
## Migration Plan
Migrations aditivas em banco isolado primeiro; backup antes de aplicação em ambientes com dados. Não executar rollback destrutivo no banco do usuário. Reversão de código exige avaliar dependências e preservar dados em produtos/histórico. Deploy remoto pendente.
