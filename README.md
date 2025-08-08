# Homelab - Gatos: Plataforma para monitoramento de bem estar dos meus pets

Uma plataforma de microsserviços modulares, projetada para coletar, processar e visualizar dados de sensores em pontos estratégicos da casa. O caso de uso principal é o monitoramento do ambiente e comportamento de gatos domésticos.

## Funcionalidades

-   **Monitoramento visual** Acompanhe os dados dos sensores em gráficos detalhados na dashboard.
-   **Análise Inteligente:** Agentes de análise independentes processam dados brutos para gerar insights e alertas significativos (como qualidade do ar ruim e nível de água baixo).
-   **Controle Remoto:** Acione atuadores no ambiente físico diretamente pela interface web. Por enquanto apenas um comando para o buzzer que espanta os gatos da mesa.
-   **Arquitetura Escalável:** Construído sobre uma base de microsserviços, o sistema é projetado para ser extensível com novos módulos e domínios de dados.
-   **Ambiente Containerizado:** Todo o ecossistema é organizado com Docker, garantindo um setup de desenvolvimento simplificado.

## Arquitetura

Os diversos serviços comunicam-se de forma assíncrona através de brokers de mensagem, tratando dados como um fluxo de eventos.

```mermaid
graph TD
    subgraph "Hardware (Borda)"
        A[Nós ESP32 com Sensores/Atuadores]
    end

    subgraph "Plataforma Backend (Serviços em Docker)"
        B((Broker MQTT Mosquitto))
        C((Broker RabbitMQ))
        D[(Banco de Dados PostgreSQL)]

        E[cat_ingestor (Python)]
        F[analysis_agent_anomaly (Python)]
        G[analysis_agent_water (Python)]
        L[command_gateway (Python)]
        H[backend (API Laravel)]
        I[soketi (WebSocket Server)]
    end

    subgraph "Camada de Apresentação"
        J[frontend (Nuxt)]
        K(Usuário Administrador)
    end

    %% FLUXO DE DADOS (SENSOR -> TELA)
    A -- "1. Publica Dados Brutos via MQTT" --> B;

    B -- "2. Ouve Tópicos de Sensores" --> E;
    B -- "2. Ouve Tópicos de Sensores" --> F;
    B -- "2. Ouve Tópicos de Sensores" --> G;

    E -- "3. Persiste Dados Brutos" --> D;

    F -- "4. Publica Insight de Anomalia" --> C;
    G -- "4. Publica Insight de Nível da Água" --> C;

    C -- "5. Ouve Fila de Insights" --> E;

    E -- "6. Persiste Insight Processado" --> D;
    E -- "7. Dispara Gatilho HTTP (Tempo Real)" --> H;

    H -- "8. Transmite Evento via WebSocket" --> I;
    I -- "9. Notificação Push" --> J;

    J -- "10. Requisição HTTP (Dados Históricos)" --> H;
    H -- "11. Consulta Banco de Dados" --> D;

    J -- "12. Renderiza Dashboard para" --> K;

    %% FLUXO DE COMANDO (ADMIN -> ATUADOR)
    K -- "A. Aciona Comando na Interface" --> J;
    J -- "B. Envia Requisição POST para API" --> H;
    H -- "C. Faz Chamada HTTP Interna" --> L;
    L -- "D. Publica Comando via MQTT" --> B;
    B -- "E. Envia Comando para Nó Específico" --> A;
```

## Stack

| Categoria          | Tecnologia                      | Propósito                                                           |
| :----------------- | :------------------------------ | :------------------------------------------------------------------ |
| **Hardware**       | ESP32                           | Microcontrolador para os nós.                                       |
|                    | Sensores (MQ-135, HC-SR04, PIR) | Coleta de dados.                                                    |
| **Backend**        | PHP / Laravel                   | API REST para o frontend.                                           |
|                    | Python / Flask                  | Microsserviços (ingestor, agentes de análise, gateway de comandos). |
| **Frontend**       | Vue.js / Nuxt.js                | Interface do dashboard reativa.                                     |
| **Infraestrutura** | Docker / Docker Compose         | Containerização de todos os serviços.                               |
|                    | PostgreSQL                      | Banco de dados.                                                     |
| **Mensageria**     | Mosquitto (MQTT)                | Broker para comunicação dos dispositivos IoT.                       |
|                    | RabbitMQ                        | Barramento de eventos para comunicação entre microsserviços.        |

## Como Executar

### Pré-requisitos

-   Docker e Docker Compose
-   Git
-   PlatformIO (para compilar o firmware nos nós, caso utilize os mesmos sensores)

### 1. Estrutura de Repositórios

Este projeto utiliza dois repositórios, um por domínio. Para executar o ambiente completo, você precisa clonar os repositórios dentro de uma pasta raiz:

```bash
# Crie uma pasta raiz para o projeto
mkdir homelab
cd homelab

# Clone o repositório do dashboard (este)
git clone [https://github.com/webtraveler-br/homelab-dashboard](https://github.com/webtraveler-br/homelab-dashboard)

# Clone o repositório do módulo dos gatos
git clone [https://github.com/webtraveler-br/homelab-gatos-iot](https://github.com/webtraveler-br/homelab-gatos-iot)
```

### 2. Configuração do Ambiente

O projeto utiliza um arquivo `.env` para gerenciar todas as credenciais e configurações.

1.  Na pasta do projeto dashboard (`homelab/homelab-dashboard`), crie um arquivo `.env`.
2.  Preencha com as seguintes variáveis:

```bash
# Variáveis de Banco de Dados
DB_CONNECTION=pgsql
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=homelab
POSTGRES_PASSWORD=homelab
POSTGRES_DB=homelab

# Variáveis do RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=homelab
RABBITMQ_PASSWORD=homelab
RABBITMQ_QUEUE=insights

# Variáveis do MQTT
MQTT_BROKER=mosquitto
MQTT_BROKER_HOST=mosquitto
MQTT_BROKER_PORT=1883
MQTT_TOPIC='sensors/nodes/#'

# Variável para estado de desenvolvimento
APP_ENV=development

# UID/GID do usuário do host para evitar problemas de permissão nos volumes
HOST_UID=1000 # utilize do seu usuário
HOST_GID=1000 # utilize do seu usuário

# Variáveis do serviço command_gateway
COMMAND_GATEWAY_HOST=command_gateway
COMMAND_GATEWAY_PORT=5000
```

Para facilitar, também pode criar um arquivo make.
1.  Na pasta raiz (`homelab/`), crie um arquivo `Makefile`.
2.  Preencha da seguinte forma:

```Makefile
# Variável para docker-compose
COMPOSE = docker-compose -f homelab-dashboard/docker-compose.yml

# Define alvos "phony" para evitar conflitos com arquivos de mesmo nome
.PHONY: up down build restart logs clean \
        backend-shell backend-artisan backend-composer backend-migrate backend-seed \
        frontend-shell frontend-build \
        db-shell db-backup db-restore \
        cat-ingestor-shell cat-ingestor-logs

# -----------------------------------------------------------------------------
# Infraestrutura Geral (Docker Compose)
# -----------------------------------------------------------------------------

# Inicia os serviços
up:
	$(COMPOSE) up -d --build --force-recreate

# Para e remove os contêineres, redes e volumes
down:
	$(COMPOSE) down

# Reinicia os serviços
restart:
	$(COMPOSE) restart

# Exibe os logs de todos os serviços em tempo real
logs:
	$(COMPOSE) logs -f

# Para e remove contêineres, volumes e redes, e remove volumes órfãos
clean:
	$(COMPOSE) down -v --remove-orphans

# -----------------------------------------------------------------------------
# Backend
# -----------------------------------------------------------------------------

# Abre um shell interativo no contêiner do backend
backend-shell:
	$(COMPOSE) exec backend sh

# Executa um comando Artisan no contêiner do backend (ex: make backend-artisan cmd="cache:clear")
backend-artisan:
	$(COMPOSE) exec backend php artisan $(cmd)

# Exibe os logs do backend em tempo real
backend-logs:
	$(COMPOSE) logs -f backend

# -----------------------------------------------------------------------------
# Frontend
# -----------------------------------------------------------------------------

# Abre um shell interativo no contêiner do frontend
frontend-shell:
	$(COMPOSE) exec frontend sh

# Exibe os logs do frontend em tempo real
frontend-logs:
	$(COMPOSE) logs -f frontend

# -----------------------------------------------------------------------------
# Banco de Dados
# -----------------------------------------------------------------------------

# Abre um shell interativo no contêiner do banco de dados
db-shell:
	$(COMPOSE) exec postgres bash

# Exibe os logs do banco de dados em tempo real
db-logs:
	$(COMPOSE) logs -f postgres
```

### 3. Subindo os Serviços

Com os repositórios clonados e o arquivo `.env` configurado, inicie todo o ecossistema com um único comando:

```bash
# Navegue até a pasta do dashboard, onde está o docker-compose.yml
cd homelab-dashboard

# Suba todos os containers em modo detached (-d)
docker-compose up -d --build # ou make up
```

### 4. Acessando a Aplicação

-   **Dashboard:** [http://localhost:8080](http://localhost:8080)
-   **API (se necessário):** [http://localhost:8000](http://localhost:8000)

## TO-DO

-   **WebSockets:** Adicionar um serviço de websockets, conectar ao backend e permitir notificação de insights em tempo real.
-   **Firmware e Serviço de localização:** Adicionar funcionalidade de identificar a localização dos gatos na casa através de uma coleira com BLE.
-   **Autenticação:** Autenticação na plataforma.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
graph TD
%% Define Styles
classDef dataflow fill:#e6f2ff,stroke:#b3d9ff,stroke-width:2px;
classDef commandflow fill:#ffe6e6,stroke:#ffb3b3,stroke-width:2px;
classDef hardware fill:#f0f0f0,stroke:#333,stroke-width:2px;
classDef backend fill:#fff2cc,stroke:#ffd966,stroke-width:2px;
classDef presentation fill:#e6fffa,stroke:#b3ffe6,stroke-width:2px;

    %% Subgraphs
    subgraph "Camada de Hardware"
        direction LR
        A[Nós ESP32 - Sensores/Atuadores]:::hardware
    end

    subgraph "Camada Backend"
        direction TB

        subgraph "Mensageiros & Brokers"
            direction LR
            B((MQTT Mosquitto)):::backend
            C((RabbitMQ)):::backend
        end

        subgraph "Processamento & Armazenamento de Dados"
            direction LR
            E[cat_ingestor]:::backend
            D[(PostgreSQL DB)]:::backend
        end

        subgraph "Análise & Lógica"
            direction LR
            F[analysis_agent_anomaly]:::backend
            G[analysis_agent_water]:::backend
            L[command_gateway]:::backend
        end

        subgraph "API & Aplicação"
            H[API Backend - Laravel]:::backend
        end
    end

    subgraph "Camada de Apresentação"
        direction LR
        J[App Frontend - Nuxt]:::presentation
        K(Usuário):::presentation
    end

    %% Fluxo de Dados (Azul)
    A -- "1.Dados Brutos do Sensor" --> B;
    B -- "2.Dados Brutos" --> E;
    B -- "2.Dados Brutos" --> F;
    B -- "2.Dados Brutos" --> G;
    E -- "3.Persiste Dados Brutos" --> D;
    F -- "4a.Insight de Toxicidade" --> C;
    G -- "4b.Insight de Nível da Água" --> C;
    C -- "5.Consome Insights" --> E;
    E -- "6.Persiste Insights" --> D;
    H -- "8.Consulta Dados/Insights" --> D;
    J -- "7.Requisição HTTP" --> H;
    J -- "9.Renderiza Dashboard" --> K;

    %% Fluxo de Comando (Vermelho)
    K -.->|"A. Aciona Ação"| J;
    J -.->|"B. Comando POST"| H;
    H -.->|"C. Chamada de API Interna"| L;
    L -.->|"D. Publica Comando MQTT"| B;
    B -.->|"E. Encaminha para o Nó"| A;

    %% Aplica Estilos aos Links
    linkStyle 0,1,2,3,4,5,6,7,8,9,10,11 stroke:#007bff,stroke-width:2px,color:blue;
    linkStyle 12,13,14,15,16 stroke:#dc3545,stroke-width:2px,stroke-dasharray:5 5;

```

```
