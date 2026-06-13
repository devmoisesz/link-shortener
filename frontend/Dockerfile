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
EXPOSE 5173

# Comando que roda quando container inicia
CMD ["npm", "run", "dev", "--", "--host"]