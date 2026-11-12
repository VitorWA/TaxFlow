# Testes HTTP no Postman

Coleção: `TaxFlow.postman_collection.json`. Importar no Postman e executar pelo Runner em ordem, com uma iteração. A variável `base_url` aponta para `http://127.0.0.1:18000`.

## Preparar ambiente exclusivo

Com Docker disponível e `backend/.env` criado a partir do exemplo:

```sh
docker compose -p taxflow-postman -f docker-compose.postman.yml up -d --build --wait
docker compose -p taxflow-postman -f docker-compose.postman.yml exec -T api php artisan migrate --force
docker compose -p taxflow-postman -f docker-compose.postman.yml exec -T api php tests/Postman/seed.php
```

MySQL e Redis são exclusivos deste compose, sem portas publicadas. As credenciais e a chave do compose são fictícias e exclusivas de teste. O seeder recusa execução fora de `testing`/MySQL `taxflow_postman`.

Usuários fictícios: `owner@postman.test`, `member@postman.test` e `outsider@postman.test`; senha `postman-test-password`. A coleção obtém os tokens por login. Desmarcar **Keep variable values** no Runner evita manter os tokens após a execução. A empresa nova recebe CNPJ sintético a cada rodada. Aguardar um minuto entre rodadas para não interferir com os limites de login da anterior.

## Resultado observado em 12/11/2026

- Newman 6.2.1: 33 requisições, 96 assertions aprovadas, zero falhas.
- Aplicativo Postman 12.34.2, Runner local, uma iteração (13:30): 96 verificações aprovadas, zero falhas, zero erros.
- Fluxos: health com MySQL/Redis reais; login válido/inválido; email array/objeto; perfil; enums; cadastro/consulta/atualização e persistência de empresa; CNPJ inválido/duplicado; filtro/paginação; member somente leitura; outro usuário sem acesso; logout e rejeição de token revogado; rate limit 429.

Esse resultado valida a API HTTP com MySQL, sem cobrir telas do frontend ou o CI remoto. Os testes unitários/feature do backend são outra suíte (70 testes, 309 assertions).

Para encerrar os serviços de teste:

```sh
docker compose -p taxflow-postman -f docker-compose.postman.yml down
```

Não executar comandos de sincronização de workspace sem conferir conta e destino. A coleção local pode ser importada em um workspace pessoal sem vincular o repositório a workspaces de trabalho.
