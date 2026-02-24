FROM node:20-bookworm

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    openjdk-17-jdk \
    gcc \
    g++ \
    git \
    curl \
    maven \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# copy package files first (better caching)
COPY package*.json ./

RUN npm install

# copy rest of project
COPY . .

EXPOSE 10000

CMD ["node", "server.js"]