#!/bin/sh
set -e

cd /app

if [ ! -f .env ]; then
    echo "backend/.env não encontrado. Rode: cp backend/.env.example backend/.env" >&2
    exit 1
fi

# Reinstala quando o vendor/ (volume) não corresponde ao composer.lock atual,
# por exemplo depois de um pull que adicionou dependências.
lock_hash=$(sha256sum composer.lock | cut -d' ' -f1)
if [ ! -f vendor/autoload.php ] || [ "$(cat vendor/.composer-lock.sha256 2>/dev/null)" != "$lock_hash" ]; then
    composer install --no-interaction --prefer-dist
    echo "$lock_hash" > vendor/.composer-lock.sha256
fi

if ! grep -Eq '^APP_KEY="?[^"[:space:]]+' .env; then
    php artisan key:generate --force
fi

exec "$@"
