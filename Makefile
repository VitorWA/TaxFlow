.PHONY: up down migrate seed test shell
up:
	docker compose up -d --build --wait --wait-timeout 300
down:
	docker compose down
migrate:
	docker compose exec api php artisan migrate
seed:
	docker compose exec api php artisan db:seed
test:
	docker compose exec api php artisan test
shell:
	docker compose exec api sh
