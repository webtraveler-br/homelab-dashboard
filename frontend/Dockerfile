FROM node:20-alpine

WORKDIR /app

ARG APP_ENV=production
ARG HOST_UID=1000
ARG HOST_GID=1000

# Cria usuário/grupo com UID/GID do host, evitando conflito se já existirem
RUN getent group $HOST_GID || addgroup -g $HOST_GID appuser; \
    getent passwd $HOST_UID || adduser -D -u $HOST_UID -G appuser appuser

# Copia apenas arquivos de dependência para otimizar cache
COPY --chown=appuser:appuser package*.json ./
RUN npm install

# Copia o restante do projeto
COPY --chown=appuser:appuser . .

EXPOSE 8080

USER $HOST_UID

# CMD: exibe variáveis de ambiente relevantes e inicia o serviço
CMD ["sh", "-c", "echo \"APP_ENV=$APP_ENV\"; echo \"HOST=$HOST\"; echo \"PORT=$PORT\"; if [ \"$APP_ENV\" = \"development\" ]; then npm run dev; else npm run build && npm run start; fi"]
