FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl libpq-dev \
    && docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html


ARG APP_ENV=production
ARG HOST_UID=33
ARG HOST_GID=33

# Instala Xdebug apenas em desenvolvimento
RUN if [ "$APP_ENV" = "development" ]; then pecl install xdebug && docker-php-ext-enable xdebug; fi

# Copia arquivos do projeto apenas em produção (em dev, use volume)
COPY . /var/www/html

EXPOSE 8000


# Cria usuário/grupo com UID/GID do host
RUN groupadd -g $HOST_GID www-data-host && \
    useradd -u $HOST_UID -g $HOST_GID -m www-data-host

# Define usuário não-root para rodar o processo
USER www-data-host

# CMD: servidor embutido em desenvolvimento, php-fpm em produção
CMD ["sh", "-c", "if [ \"$APP_ENV\" = \"development\" ]; then composer install && php artisan serve --host=0.0.0.0 --port=8000; else composer install --no-dev --optimize-autoloader && php-fpm; fi"]