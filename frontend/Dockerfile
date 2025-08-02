FROM node:20-alpine

WORKDIR /app


# Copia apenas arquivos de dependência para otimizar cache
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

EXPOSE 8080

# CMD: exibe variáveis de ambiente relevantes e inicia o serviço
CMD ["sh", "-c", "echo \"APP_ENV=$APP_ENV\"; echo \"HOST=$HOST\"; echo \"PORT=$PORT\"; if [ \"$APP_ENV\" = \"development\" ]; then npm run dev; else npm run build && npm run start; fi"]
