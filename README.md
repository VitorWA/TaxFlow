# TaxFlow

## Ambiente local

1. Copie `.env.example` para `.env` e defina senhas locais.
2. Execute `docker compose up --build`.
3. Acesse `http://localhost:3000`.

O Compose inicia o frontend React, a API Laravel com Sanctum e o MySQL. As
migrations em `backend/database/migrations` são aplicadas automaticamente
quando a API inicia. Na primeira inicialização, o container também cria o
`backend/.env` e gera uma chave local para a aplicação.

Os dados locais ficam no volume Docker `taxflow_mysql_data`. O arquivo `.env`
e o conteúdo do banco não devem ser versionados; apenas migrations e
`.env.example` são compartilhados entre os desenvolvedores.

O backend fica em `backend/`. Com os containers ativos, comandos Laravel podem
ser executados com `docker compose exec taxflow-api php artisan <comando>`.

## API de autenticação

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/health`
