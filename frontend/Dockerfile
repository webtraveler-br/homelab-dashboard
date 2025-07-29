FROM node:20-alpine

WORKDIR /app

ARG APP_ENV=production
ARG HOST_UID=1000
ARG HOST_GID=1000

# Cria usuário/grupo com UID/GID do host
RUN addgroup -g $HOST_GID appuser && \
    adduser -D -u $HOST_UID -G appuser appuser

# Copia apenas arquivos de dependência para otimizar cache
COPY --chown=appuser:appuser package*.json ./
RUN npm install

# Copia o restante do projeto
COPY --chown=appuser:appuser . .

EXPOSE 8080

USER appuser

# Comando condicional para dev/prod
CMD ["sh", "-c", "if [ \"$APP_ENV\" = \"development\" ]; then npm run dev; else npm run build && npm run start; fi"]
