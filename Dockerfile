# Define uma imagem base do Node.js 22 com Alpine Linux 
FROM node:22-alpine

WORKDIR /app

# Copia apenas os arquivos de dependência
COPY package.json package-lock.json ./

# Instala Todas as dependências
RUN npm ci

# Copia o restante do código-fonte
COPY . .

# Expõe a porta que o servidor usa 
EXPOSE 3000

# Comando que roda quando container inicia
CMD ["npx", "tsx", "start.ts"]