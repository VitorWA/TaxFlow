# Infraestrutura entregue e pendente — card #42

A decisão vigente é PHP 8.5.12/MySQL 8.4, conforme `docs/prds/setup-laravel-api/PRD.md`. O texto antigo da #42 cita PHP 8.3/PostgreSQL e precisa ser alinhado; a implementação preserva a arquitetura aprovada.

## Local e CI

Docker Compose mantém API, MySQL e Redis e adiciona worker Laravel, scheduler e proxy do Vite. Apenas a API prepara dependências; consumidores aguardam API healthy e reutilizam vendor, sem instalações simultâneas. Reinicie worker/scheduler após alterar código/configuração. Os volumes existentes são preservados; não use `down -v` se quiser manter dados.

Dockerfile possui alvos development e production. O último alvo continua development para compatibilidade com o Compose. Produção:

```sh
docker build --target production -t taxflow-api:release backend
```

Fornecer por ambiente APP_KEY, APP_URL, DB_CONNECTION=mysql, DB_HOST/PORT/DATABASE/USERNAME/PASSWORD, REDIS_HOST/PORT/PASSWORD, REDIS_CLIENT=phpredis, CACHE_STORE=redis, SESSION_DRIVER=redis e QUEUE_CONNECTION=redis. APP_ENV=production, APP_DEBUG=false e logs stderr são defaults da imagem. Não usar senhas de exemplo ou a chave fictícia dos testes. Não há geração automática de chave nem migrations no boot.

Após provisionar banco/Redis e configurar secrets, executar migrations como etapa controlada de release, usando a mesma imagem e configuração. Iniciar API com o CMD padrão, worker com `php artisan queue:work --sleep=1 --tries=3 --timeout=60` e scheduler com `php artisan schedule:work`. O serviço da API deve ser exposto por proxy com TLS; os consumidores não precisam de porta pública. Monitorar `/api/health` e supervisionar processos/filas. Persistir storage quando a funcionalidade usar arquivos. Não montar o código local em produção.

Foram validados localmente build e inicialização production, health 200 com MySQL/Redis exclusivos de teste, docs 404 e ausência de `.env`, Composer e PHPUnit na imagem. Isso não comprova disponibilidade, TLS ou restauração de um ambiente remoto.

CI declarado em `.github/workflows/backend.yml`: Pint, Larastan, Composer validate/audit, PHPUnit SQLite e MySQL, Redis worker/scheduler e build React. Configuração local validada; execução remota ainda não publicada nesta entrega.

## Ainda exige definição e execução externa

- Hospedagem, ambiente de homologação/produção, rede, permissões e capacidade.
- DNS/domínio, TLS/proxy e secrets reais.
- Pipeline de deploy, política de rollback e teste de release em homologação.
- Backups automáticos, retenção e **teste de restauração** dos dados.
- Monitoramento, alertas, falhas de jobs e operação do scheduler.
- Proteção de branches e checks obrigatórios no GitHub.

Esses critérios da #42 continuam pendentes. O build local não fecha o card completo. Mailpit/MinIO opcionais não foram adicionados porque os fluxos implementados não dependem deles.

## Achado fora desta entrega

`npm audit` do frontend existente reportou cinco dependências vulneráveis (três moderate, duas high), envolvendo Vite/esbuild, React Router e source-map-js. O build passou, mas isso não significa auditoria limpa do frontend. Atualizações que exigem migração principal devem ser tratadas em uma entrega própria, com validação das telas. Composer do backend foi atualizado e sua auditoria não encontrou advisories.
