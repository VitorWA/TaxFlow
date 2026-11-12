param([ValidateSet('up','down','migrate','seed','test','shell')][string]$Action = 'up')
$ErrorActionPreference = 'Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    switch ($Action) {
        'up' { docker compose up -d --build --wait --wait-timeout 300 }
        'down' { docker compose down }
        'migrate' { docker compose exec api php artisan migrate }
        'seed' { docker compose exec api php artisan db:seed }
        'test' { docker compose exec api php artisan test }
        'shell' { docker compose exec api sh }
    }
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally { Pop-Location }
