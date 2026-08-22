#!/bin/sh
set -eu

if [ ! -f .env ]; then
    cp .env.example .env
fi

if [ -z "${APP_KEY:-}" ] && ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force --no-interaction
fi

attempt=1
until php artisan migrate --force --no-interaction; do
    if [ "$attempt" -ge 30 ]; then
        echo "Database did not become available after 30 attempts." >&2
        exit 1
    fi
    echo "Waiting for database ($attempt/30)..." >&2
    attempt=$((attempt + 1))
    sleep 2
done

exec php -S 0.0.0.0:8080 -t public public/index.php
