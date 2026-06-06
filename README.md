# Link Shortener 🔗

Uma aplicação full-stack moderna para encurtar URLs com autenticação JWT, tokens de refresh automáticos e gerenciamento de links com paginação.

---

Este projeto nasceu como um desafio para consolidar em prática meu conhecimento backend, com foco especial em **arquitetura backend robusta** e **integração seamless com frontend moderno**.

#### **Fase 1: Idealização**
Começou com uma pergunta simples: "Como criar um sistema de encurtamento de URLs?" A resposta exigiu pensar em:
- Autenticação segura com JWT
- Gerenciamento de sessão com refresh tokens
- Persistência de dados com MongoDB
- Validação rigorosa de entrada

#### **Fase 2: Backend Sólido**
Foco em criar uma API robusta:
- ✅ Implementação de autenticação com JWT + Refresh Token
- ✅ Endpoints RESTful bem estruturados
- ✅ Tratamento de erros adequado
- ✅ Rate limiting e CORS configurados
- ✅ 10 prompts técnicos bem definidos

#### **Fase 3: Integração Completa**
Reunindo tudo:
- ✅ API backend funcionando
- ✅ Frontend React responsivo
- ✅ Auto-refresh de tokens
- ✅ Paginação de URLs
- ✅ Interface moderna e minimalista
- 
---

## 🛠️ Tecnologias Utilizadas

### Backend
<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="https://skillicons.dev/icons?i=nodejs" height="40" alt="Node.js" title="Node.js">
  <img src="https://skillicons.dev/icons?i=express" height="40" alt="Express" title="Express">
  <img src="https://skillicons.dev/icons?i=typescript" height="40" alt="TypeScript" title="TypeScript">
  <img src="https://skillicons.dev/icons?i=mongodb" height="40" alt="MongoDB" title="MongoDB">
  <img src="https://skillicons.dev/icons?i=npm" height="40" alt="NPM" title="NPM">
</div>

**Pacotes principais:**
- `express`: Framework web
- `mongoose`: ODM para MongoDB
- `jsonwebtoken`: Autenticação JWT
- `bcrypt`: Hash de senhas
- `dotenv`: Variáveis de ambiente
- `cors`: Controle de origem cruzada
- `express-rate-limit`: Rate limiting

### Frontend
<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="https://skillicons.dev/icons?i=react" height="40" alt="React" title="React">
  <img src="https://skillicons.dev/icons?i=typescript" height="40" alt="TypeScript" title="TypeScript">
  <img src="https://skillicons.dev/icons?i=vite" height="40" alt="Vite" title="Vite">
  <img src="https://skillicons.dev/icons?i=css" height="40" alt="CSS3" title="CSS3">
  <img src="https://skillicons.dev/icons?i=npm" height="40" alt="NPM" title="NPM">
</div>

**Dependências principais:**
- `react-router-dom`: Roteamento
- Fetch API: Requisições HTTP
- Context API: Gerenciamento de estado

### Ferramentas & DevOps
<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="https://skillicons.dev/icons?i=git" height="40" alt="Git" title="Git">
  <img src="https://skillicons.dev/icons?i=github" height="40" alt="GitHub" title="GitHub">
  <img src="https://skillicons.dev/icons?i=postman" height="40" alt="Postman" title="Postman">
  <img src="https://skillicons.dev/icons?i=vscode" height="40" alt="VS Code" title="VS Code">
</div>

---

## 🎨 Interface da Aplicação

### Tela de Login
![Login Screen](tela-login.png)

A interface de login apresenta um design minimalista inspirado em Vercel, com:
- Card centralizado com sombra sutil
- Gradiente suave de fundo
- Validação em tempo real de email
- Botão roxo (#7C3AED) com estados visuais
- Link para registro para novos usuários

### Tela Principal (Dashboard)
![Dashboard Screen](tela-dashboard.png)

Dashboard completo com:
- Header com título centralizado e botão de logout
- Seção de encurtamento de URL com validação
- Resultado com link encurtado copiável
- Lista de URLs do usuário com paginação
- Ações de copiar e deletar para cada URL
- Timestamps de criação formatados

---


---

## 📋 Requisitos Funcionais

### ✅ Autenticação & Conta

- [x] Usuário pode **registrar-se** com nome, email e senha
- [x] Usuário pode **fazer login** com email e senha
- [x] Usuário pode **fazer logout** com limpeza de tokens
- [x] **Senhas** são hasheadas com bcrypt (10 rounds)
- [x] **Tokens JWT** expiram automaticamente (1 dia)
- [x] **Refresh tokens** renovam access tokens (7 dias)

### ✅ Encurtamento de URLs

- [x] Usuário autenticado pode **encurtar URLs**
- [x] **URLs curtas** são geradas com código único (nanoid)
- [x] Usuário pode **visualizar todas suas URLs**
- [x] Usuário pode **copiar URL curta** para clipboard
- [x] Usuário pode **deletar suas URLs**
- [x] Redirecionar da **URL curta para original** (público)

### ✅ Gerenciamento de URLs

- [x] **Paginação** de URLs com limite de 10 por página
- [x] **Duplicação evitada** - mesmo usuário não encurta URL duplicada
- [x] **Timestamps** de criação registrados
- [x] **Exclusão segura** - usuário só pode deletar suas próprias URLs

### ✅ Interface & UX

- [x] Design **minimalista** inspirado em Vercel
- [x] **Validações em tempo real** de email e URL
- [x] **Loading states** visuais durante requisições
- [x] **Feedback visual** com toast notifications
- [x] **Proteção de rotas** - dashboard exige autenticação
- [x] **Responsividade** em diferentes tamanhos

---

## 📊 Requisitos Não-Funcionais

### 🔒 Segurança

- [x] **Senhas criptografadas** com bcrypt
- [x] **JWT com secrets** distintos (access + refresh)
- [x] **Headers de segurança** configurados
- [x] **CORS** restrito ao frontend
- [x] **Rate limiting** implementado (express-rate-limit)
- [x] **Validação de entrada** com Zod

### ⚡ Performance

- [x] **Auto-refresh de token** deduplicado (não faz múltiplas requisições)
- [x] **Paginação** reduz payload
- [x] **Índices MongoDB** em campos críticos

### ��️ Escalabilidade & Manutenibilidade

- [x] **Arquitetura em camadas** (controllers, services, models)
- [x] **TypeScript** com tipagem forte
- [x] **Código modular** e reutilizável
- [x] **Variáveis de ambiente** para configuração
- [x] **Tratamento de erros** consistente
- [x] **Logs estruturados** de erros
- [x] **Separação de responsabilidades** clara

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- MongoDB local ou Atlas
- npm ou yarn

### Backend Setup

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais MongoDB e JWT secrets
nano .env

# Iniciar servidor em desenvolvimento
npm run dev

# Servidor rodando em http://localhost:3000

```

### Frontend Setup

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
echo "VITE_API_URL=http://localhost:3000" > .env.local

# Iniciar Vite dev server
npm run dev

# Frontend rodando em http://localhost:5173

````

---

### 🔑 Variáveis de Ambiente

#### Backend (`.env`)

```env
# Banco de Dados
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/linkshortener

# Autenticação
JWT_SECRET=sua-chave-super-secreta-aqui
JWT_REFRESH_SECRET=sua-chave-refresh-super-secreta-aqui

# Servidor
PORT=3000

# CORS
FRONTEND_URL=http://localhost:5173
```

> 💡 Para gerar uma chave segura para o JWT, execute:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

#### Frontend (`.env.local`)

```env
VITE_API_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:5173
```

> ⚠️ Nunca envie seus arquivos `.env` para o GitHub. Utilize o `.env.example` para compartilhar apenas a estrutura das variáveis.

### 📌 Endpoints da API

POST   /users/register     # Registrar novo usuário
POST   /users/login        # Fazer login
POST   /users/refresh      # Renovar access token

**URLs Encurtadas (Requer Auth)**

POST   /shortener/api/shorten      # Encurtar URL
GET    /shortener/api/urls         # Listar URLs com paginação
DELETE /shortener/api/:shortCode   # Deletar URL

GET    /shortener/:shortCode       # Redirecionar (público)
