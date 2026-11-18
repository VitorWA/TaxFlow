# TaxFlow

Monorepo do TaxFlow:

- **Front:** React + Vite, na raiz (`src/`).
- **API:** Laravel 13 em PHP 8.5.12 (FrankenPHP), em `backend/`.
- **Infra local:** MySQL 8.4 e Redis 7 via Docker Compose.

## Pré-requisitos

- Docker com Docker Compose v2.

Não é preciso ter PHP, Composer nem Node na máquina: tudo roda em containers.

## Subindo o ambiente

```sh
cp backend/.env.example backend/.env
docker compose up
```

No primeiro boot, o container `api` instala as dependências do Composer e gera a `APP_KEY` no `backend/.env`. Isso leva alguns minutos. As subidas seguintes são rápidas.

Quando o `backend/composer.lock` mudar (por exemplo, depois de um pull que adicionou pacotes), basta reiniciar o container: o `api` detecta a diferença e roda `composer install` sozinho.

```sh
docker compose restart api
```

As portas ficam publicadas só em `127.0.0.1`: MySQL e Redis de dev não ficam acessíveis pela rede.

| Serviço | URL / porta no host |
|---------|---------------------|
| Front (`taxflow-frontend`) | http://localhost:3000 |
| API (`api`) | http://localhost:8000 |
| MySQL (`db`) | `localhost:3306` (usuário `taxflow`, senha `secret`, banco `taxflow`) |
| Redis (`redis`) | `localhost:6379` |

Se a 3306 ou a 6379 já estiverem em uso, troque a porta no host sem mexer em arquivos:

```sh
DB_FORWARD_PORT=33060 REDIS_FORWARD_PORT=63790 docker compose up
```

## Banco de dados

As migrations **não** rodam sozinhas. Depois de subir:

```sh
docker compose exec api php artisan migrate
```

## Healthcheck

```sh
curl -i http://localhost:8000/api/health
```

- **200** com `{"status":"ok","checks":{"database":"ok","redis":"ok"}}` quando banco e Redis respondem.
- **503** com `"status":"fail"` e a dependência com problema marcada como `"fail"`. O detalhe do erro vai para `backend/storage/logs/laravel.log`.

## Testes da API

```sh
docker compose exec api php artisan test
```

A suíte usa SQLite em memória e mocks: ela não toca o MySQL nem o Redis de desenvolvimento.

## Comandos úteis

```sh
docker compose exec api php artisan <comando>    # artisan
docker compose exec api composer <comando>       # composer
docker compose down                              # para tudo (mantém os dados)
docker compose down -v                           # para tudo e apaga banco e vendor/
```

## Observações

- **Credenciais em dois lugares:** as credenciais do MySQL ficam no `backend/.env` e também como default no `docker-compose.yml`. Se mudar de um lado, mude do outro.
- **`vendor/` fica num volume do Docker** (`api-vendor`), por desempenho no Windows, e não aparece em `backend/vendor` no host. Para o autocomplete da IDE, copie quando precisar:
  ```sh
  docker compose cp api:/app/vendor ./backend/vendor
  ```
- **Esqueceu o `.env`?** O `api` encerra pedindo o `cp`. Depois de copiar, recrie o container para o Docker refazer o mapeamento da porta:
  ```sh
  docker compose up -d --force-recreate api
  ```
