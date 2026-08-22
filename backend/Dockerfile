FROM composer:2 AS vendor

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

FROM php:8.4-cli-alpine

RUN docker-php-ext-install pdo_mysql

WORKDIR /app
COPY --from=vendor /app/vendor ./vendor
COPY . .
COPY docker/entrypoint.sh /usr/local/bin/taxflow-entrypoint
RUN chmod +x /usr/local/bin/taxflow-entrypoint

EXPOSE 8080

ENTRYPOINT ["taxflow-entrypoint"]
