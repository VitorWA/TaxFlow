# API: execução e validação

PHP 8.5.12, Laravel 13, MySQL 8.4, Redis 7 e Sanctum. PHP/Composer executam nos containers.

## Preparar o ambiente

Na raiz, copie `backend/.env.example` para `backend/.env`. Opcionalmente copie `.env.example` para `.env` e ajuste apenas as portas publicadas. No PowerShell, uma porta alternativa pode ser definida com `$env:REDIS_FORWARD_PORT='63790'`.

```powershell
./scripts/dev.ps1 up
./scripts/dev.ps1 migrate
./scripts/dev.ps1 seed
docker compose exec api php artisan scribe:generate --force
```

API em http://localhost:8000, frontend em http://localhost:3000 e docs em http://localhost:8000/docs. O Vite encaminha `/api` ao container da API. O seed é idempotente e restrito a local/testing: usuário `test@example.com`, senha `password` e empresa fictícia `11222333000181`. Não cria credenciais de produção.

Login: `POST /api/v1/auth/login` com `{"email":"test@example.com","password":"password"}`. Copie `data.token` para `Authorization: Bearer TOKEN`. `/api/v1/auth/me` consulta o usuário; logout revoga apenas o token usado. Login limita cinco tentativas por email/IP e trinta por IP; 429 informa Retry-After.

## Importar NCM

Baixe o JSON pela página oficial da Receita ou pelo endpoint Siscomex. O download é um snapshot vigente, sem histórico oficial completo. O comando recebe arquivo local, valida tudo antes da transação e aceita apenas códigos completos de oito dígitos, preservando zeros iniciais.

```powershell
docker compose exec api curl -fL 'https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json?perfil=PUBLICO' -o /tmp/ncm.json
docker compose exec api php artisan ncm:import /tmp/ncm.json
```

O resultado informa count, unchanged e checksum SHA-256. Arquivo idêntico não grava novamente. Códigos ausentes em carga posterior são mantidos com `in_current_table=false`; o sistema não inventa uma data legal de expiração. `is_current` considera presença no snapshot e as datas inicial/final inclusivas, no fuso da aplicação. Não há sincronização automática nesta entrega.

## Contratos

- Empresas: `/api/v1/companies`; proprietário escreve e membro lê. Sem vínculo, detalhe/edição retornam 404.
- Estabelecimentos: `/api/v1/companies/{company}/establishments`, detalhe/edição em `/{establishment}`. `type` matriz/filial, CNPJ válido e de mesma raiz, `state` obrigatório, `taxpayer_status` contribuinte/nao_contribuinte/isento. Município e inscrição estadual opcionais. `company_id` vem da URL. ID filho de outra empresa retorna 404 mesmo se o usuário acessa ambas.
- NCM: `GET /api/v1/ncms?q=0101&per_page=15` pesquisa prefixo do código ou parte da descrição; `/{code}` retorna fonte, ato, datas e importação. Exige autenticação.
- Produtos: `/api/v1/products`; cadastro exige `company_id`, `description`, `ncm_code`. EAN/GTIN válido e código interno opcionais. Listagem pesquisa descrição/EAN/NCM com `q`, e pode filtrar `company_id`. Todas as consultas permanecem no escopo de acesso.
- Produto inicia `classification_status=sugerida`. `POST /api/v1/products/{id}/confirm-ncm` recebe corpo vazio, valida vigência e define `confirmed_by`/`confirmed_at`. Repetir não cria mudança fictícia. Trocar `ncm_code` em PATCH remove confirmação e registra código antigo/novo, autor e data na mesma transação. `GET /api/v1/products/{id}/ncm-history` pagina esse histórico. Edição de descrição preserva confirmação. Não é permitido transferir empresa ou forjar metadados de confirmação.

Respostas usam `data`; listas incluem `links` e `meta`. `page>=1`, `per_page` entre 1 e 100, padrão 15. Erros seguem `error.code`, `error.message`, `error.details`, `request_id`, com header X-Request-ID. Status usuais: 401 sem autenticação, 403 membro tentando escrever, 404 recurso inexistente/fora do escopo, 422 validação, 429 login limitado. Exclusão, gestão de membros e motor fiscal real ficam fora desses cards.

## Documentação e qualidade

```powershell
docker compose exec api php artisan scribe:generate --force
./scripts/test-api.ps1
./scripts/test-api.ps1 -MySql
docker compose exec api vendor/bin/pint --test
docker compose exec api vendor/bin/phpstan analyse --no-progress --memory-limit=512M
docker compose exec api composer validate --strict
docker compose exec api composer audit
docker compose exec taxflow-frontend npm run build
```

Scribe usa exemplos fictícios versionados em `backend/docs/examples`; não executa response calls nem cria models para exemplos. Gera `/docs`, `/docs.openapi` e `/docs.postman`, disponíveis em local/testing e 404 nos demais ambientes. Arquivos gerados são ignorados pelo Git e devem ser regenerados após alterações de contrato. A coleção gerada serve à exploração manual; a suíte PHPUnit faz as asserções de comportamento.

SQLite roda em memória. `-MySql` executa a mesma suíte e os testes de worker/scheduler no compose `taxflow-postman`, banco `taxflow_postman`, Redis e volume vendor separados do desenvolvimento. Esses testes podem recriar **esse banco de teste**, portanto não o use para guardar trabalho manual. O bootstrap rejeita MySQL sem sufixo `_test`/`_postman` e qualquer DB_URL nessa conexão. O cache array evita interferência entre os testes de rate limit; os smokes usam Redis real, fila e chaves exclusivas com limpeza. Não execute Integration no ambiente dev.

O CI configura SQLite, MySQL/Redis e build frontend; sua execução no GitHub depende de publicação da branch. A imagem `production` contém vendor sem require-dev, não copia `.env`, banco SQLite, dados locais ou arquivos gerados, e exige APP_KEY externa. Detalhes e pendências da infraestrutura estão em [infraestrutura.md](infraestrutura.md).

## Roteiro manual para quem receber

1. Preparar ambiente, migrations, seed e carga oficial. Fazer login e consultar empresas/NCM.
2. Cadastrar uma filial usando `11222333000262` na empresa de demonstração; rejeitar CNPJ de raiz diferente, UF ausente e URL com parent incorreto.
3. Criar produto com NCM vigente, confirmar, editar descrição, trocar NCM e conferir remoção da confirmação e histórico. Rejeitar NCM inválido, EAN inválido e confirmação forjada.
4. Usar usuários com vínculo member e sem vínculo para conferir leitura e recusas de escrita/acesso. Estes cenários já têm testes HTTP automatizados; o roteiro manual permite conferir a experiência de integração.
5. Consultar docs/OpenAPI, conferir os payloads do frontend e logout. O frontend existente ainda usa dados simulados em suas telas; estes cards entregam a API e o proxy, sem uma integração completa das telas.
