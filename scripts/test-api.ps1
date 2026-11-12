param([switch]$MySql)
$ErrorActionPreference = 'Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    if ($MySql) {
        docker compose -p taxflow-postman -f docker-compose.postman.yml up -d --build --wait --wait-timeout 300 api
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        # O MySQL é exclusivo deste compose; o bootstrap de testes recusa o banco dev.
        docker compose -p taxflow-postman -f docker-compose.postman.yml exec -T -e CACHE_STORE=array api php artisan test --compact
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        docker compose -p taxflow-postman -f docker-compose.postman.yml exec -T -e CACHE_STORE=array api vendor/bin/phpunit tests/Integration
    } else {
        docker compose exec -T api php artisan test --compact
    }
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally { Pop-Location }
