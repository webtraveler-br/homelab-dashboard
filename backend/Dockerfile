FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl libpq-dev \
    && docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

ARG APP_ENV=production
ARG HOST_UID=1000
ARG HOST_GID=1000

# Cria usuário/grupo com UID/GID do host
RUN getent group $HOST_GID || groupadd -g $HOST_GID www-data-host; \
    getent passwd $HOST_UID || useradd -u $HOST_UID -g $HOST_GID -m www-data-host

# Copia apenas arquivos de dependência para otimizar cache
COPY --chown=www-data-host:www-data-host composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader

# Copia o restante do projeto
COPY --chown=www-data-host:www-data-host . .

# Instala Xdebug e otimiza autoloader
RUN if [ "$APP_ENV" = "development" ]; then \
        pecl install xdebug && docker-php-ext-enable xdebug && composer dump-autoload; \
    else \
        composer install --no-dev --optimize-autoloader; \
    fi

EXPOSE 8000

USER $HOST_UID

# CMD: inicia o serviço
CMD ["sh", "-c", "if [ \"$APP_ENV\" = \"development\" ]; then php artisan serve --host=0.0.0.0 --port=8000; else php-fpm; fi"]