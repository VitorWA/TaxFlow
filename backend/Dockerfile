FROM dunglas/frankenphp:1-php8.5.12 AS base

RUN install-php-extensions pdo_mysql redis intl bcmath zip pcntl gd

WORKDIR /app
EXPOSE 8000
CMD ["frankenphp", "php-server", "--root", "public/", "--listen", ":8000"]

FROM base AS dependencies
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist

FROM base AS production
ENV APP_ENV=production APP_DEBUG=false LOG_CHANNEL=stderr
COPY . .
COPY --from=dependencies /app/vendor ./vendor
RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R ug+rwX storage bootstrap/cache \
    && php artisan package:discover --ansi
ENTRYPOINT ["sh", "/app/docker/production-entrypoint.sh"]
CMD ["frankenphp", "php-server", "--root", "public/", "--listen", ":8000"]

FROM base AS development

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY docker/entrypoint.sh /usr/local/bin/taxflow-entrypoint
RUN chmod +x /usr/local/bin/taxflow-entrypoint

ENTRYPOINT ["taxflow-entrypoint"]
CMD ["frankenphp", "php-server", "--root", "public/", "--listen", ":8000"]
