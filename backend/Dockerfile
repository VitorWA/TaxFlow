FROM dunglas/frankenphp:1-php8.5.12

RUN install-php-extensions pdo_mysql redis intl bcmath zip pcntl

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY docker/entrypoint.sh /usr/local/bin/taxflow-entrypoint
RUN chmod +x /usr/local/bin/taxflow-entrypoint

EXPOSE 8000

ENTRYPOINT ["taxflow-entrypoint"]
CMD ["frankenphp", "php-server", "--root", "public/", "--listen", ":8000"]
