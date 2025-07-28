

# Dockerfile simplificado para backend Laravel
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

ARG APP_ENV=production

# Instala Xdebug apenas em desenvolvimento
RUN if [ "$APP_ENV" = "development" ]; then pecl install xdebug && docker-php-ext-enable xdebug; fi

# Copia arquivos do projeto apenas em produção (em dev, use volume)
COPY . /var/www/html

# Permissões para storage e cache
RUN if [ "$APP_ENV" = "production" ]; then chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache; else chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache; fi

EXPOSE 8000

# CMD: servidor embutido em desenvolvimento, php-fpm em produção
CMD ["sh", "-c", "if [ '$APP_ENV' = 'development' ]; then php artisan serve --host=0.0.0.0 --port=8000; else php-fpm; fi"]
