<div align="center">

<img src="https://img.shields.io/badge/status-production_ready-10B981?style=flat-square&logoColor=white" height="22"/>
<img src="https://img.shields.io/badge/testes-integração_%2B_unitário-7C3AED?style=flat-square" height="22"/>
<img src="https://img.shields.io/badge/arquitetura-layered_%2B_ESM-3B82F6?style=flat-square" height="22"/>
<img src="https://img.shields.io/badge/docker-compose-2496ED?style=flat-square&logo=docker&logoColor=white" height="22"/>
<img src="https://img.shields.io/badge/license-ISC-F59E0B?style=flat-square" height="22"/>

<br/><br/>

```
██╗     ██╗███╗   ██╗██╗  ██╗    ███████╗██╗  ██╗ ██████╗ ██████╗ ████████╗███████╗███╗   ██╗███████╗██████╗
██║     ██║████╗  ██║██║ ██╔╝    ██╔════╝██║  ██║██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝████╗  ██║██╔════╝██╔══██╗
██║     ██║██╔██╗ ██║█████╔╝     ███████╗███████║██║   ██║██████╔╝   ██║   █████╗  ██╔██╗ ██║█████╗  ██████╔╝
██║     ██║██║╚██╗██║██╔═██╗     ╚════██║██╔══██║██║   ██║██╔══██╗   ██║   ██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗
███████╗██║██║ ╚████║██║  ██╗    ███████║██║  ██║╚██████╔╝██║  ██║   ██║   ███████╗██║ ╚████║███████╗██║  ██║
╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
```

**Encurtador de URLs full-stack com autenticação JWT, refresh token automático e testes de integração.**

*Construído como projeto de aprendizado e portfólio — cada decisão técnica foi pensada, justificada e documentada.*

</div>

---

## 🗂️ Arquitetura do Projeto

```
link-shortener/
│
├── backend/  ← Node.js · Express · TypeScript · MongoDB
│   ├── config/
│   │   ├── env.ts              ← Validação de variáveis com Zod
│   │   ├── index.ts            ← Exporta config tipada e segura
│   │   └── database.ts         ← Conexão MongoDB por ambiente
│   │
│   ├── src/
│   │   ├── __tests__/          ← Vitest + Supertest (integração + unitário)
│   │   │   ├── login.spec.ts
│   │   │   ├── postShortUrl.spec.ts
│   │   │   ├── redirectLink.spec.ts
│   │   │   ├── deleteUser-Url.spec.ts
│   │   │   └── generateShortCode.spec.ts
│   │   │
│   │   ├── @types/
│   │   │   └── express/
│   │   │       └── index.d.ts  ← Extensão do tipo Request (campo user)
│   │   │
│   │   ├── auth/
│   │   │   └── auth.ts         ← Middleware JWT (extrai e valida token)
│   │   │
│   │   ├── controllers/        ← Camada HTTP: recebe req, chama service, retorna res
│   │   │   ├── short-url.controller.ts
│   │   │   └── users.controller.ts
│   │   │
│   │   ├── services/           ← Regras de negócio puras, sem HTTP
│   │   │   ├── short-url.service.ts
│   │   │   └── users.service.ts
│   │   │
│   │   ├── models/             ← Acesso ao banco (Mongoose)
│   │   │   ├── short-url.models.ts
│   │   │   └── users.models.ts
│   │   │
│   │   ├── routes/             ← Declaração de endpoints e middlewares
│   │   │   ├── short-url.routes.ts
│   │   │   └── users.routes.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── AppError.ts          ← Classe de erro customizada
│   │   │   └── error.middleware.ts  ← Handler global de erros
│   │   │
│   │   ├── docs/               ← Documentação Swagger/OpenAPI
│   │   │   ├── swagger.ts
│   │   │   ├── short-url.docs.ts
│   │   │   ├── users.docs.ts
│   │   │   └── components/
│   │   │       └── schemas.docs.ts
│   │   │
│   │   ├── schemas/
│   │   │   └── schema.ts       ← Schemas Zod para validação de entrada
│   │   │
│   │   ├── validators/
│   │   │   └── validator.ts    ← Middleware de validação genérico
│   │   │
│   │   └── utils/
│   │       └── generate.short-code.ts  ← nanoid(6)
│   │
│   ├── app.ts                  ← Express app (CORS, rate limit, rotas, Swagger)
│   ├── start.ts                ← Entry point (conecta DB, sobe servidor)
│   └── Dockerfile
│
├── frontend/  ← React · TypeScript · Vite · CSS puro
│   └── src/
│       ├── @types/             ← Tipos globais (User, ShortUrl, ApiError...)
│       ├── components/         ← Button, Input, Card, Toast, UrlItem
│       ├── context/            ← AuthContext (estado global de autenticação)
│       ├── hooks/              ← useAuth, useLocalStorage
│       ├── pages/              ← Login, Register, Dashboard
│       ├── service/            ← api.ts (interceptor + refresh), auth.ts, shortUrl.ts
│       ├── styles/             ← variables.css + global.css
│       └── utils/              ← constants.ts, validation.ts
│   └── Dockerfile
│
└── docker-compose.yaml         ← Orquestração dos serviços backend + frontend
```

---

## 🛠️ Tecnologias

### Backend
<div>
  <img src="https://img.shields.io/badge/Node.js-111827?style=flat&logo=nodedotjs&logoColor=339933" height="26"/>
  <img src="https://img.shields.io/badge/Express_5-111827?style=flat&logo=express&logoColor=white" height="26"/>
  <img src="https://img.shields.io/badge/TypeScript-111827?style=flat&logo=typescript&logoColor=3178C6" height="26"/>
  <img src="https://img.shields.io/badge/MongoDB-111827?style=flat&logo=mongodb&logoColor=47A248" height="26"/>
  <img src="https://img.shields.io/badge/Mongoose-111827?style=flat&logo=mongoose&logoColor=880000" height="26"/>
  <img src="https://img.shields.io/badge/JWT-111827?style=flat&logo=jsonwebtokens&logoColor=white" height="26"/>
  <img src="https://img.shields.io/badge/Swagger-111827?style=flat&logo=swagger&logoColor=85EA2D" height="26"/>
  <img src="https://img.shields.io/badge/Zod-111827?style=flat&logo=zod&logoColor=3068B7" height="26"/>
  <img src="https://img.shields.io/badge/bcrypt-111827?style=flat&logo=letsencrypt&logoColor=white" height="26"/>
  <img src="https://img.shields.io/badge/nanoid-111827?style=flat&logo=npm&logoColor=CB3837" height="26"/>
</div>

### Testes
<div>
  <img src="https://img.shields.io/badge/Vitest-111827?style=flat&logo=vitest&logoColor=6E9F18" height="26"/>
  <img src="https://img.shields.io/badge/Supertest-111827?style=flat&logo=testinglibrary&logoColor=E33332" height="26"/>
</div>

### Frontend
<div>
  <img src="https://img.shields.io/badge/React_19-111827?style=flat&logo=react&logoColor=61DAFB" height="26"/>
  <img src="https://img.shields.io/badge/TypeScript-111827?style=flat&logo=typescript&logoColor=3178C6" height="26"/>
  <img src="https://img.shields.io/badge/Vite-111827?style=flat&logo=vite&logoColor=646CFF" height="26"/>
  <img src="https://img.shields.io/badge/CSS_puro-111827?style=flat&logo=css3&logoColor=1572B6" height="26"/>
  <img src="https://img.shields.io/badge/React_Router_v7-111827?style=flat&logo=reactrouter&logoColor=CA4245" height="26"/>
  <img src="https://img.shields.io/badge/Fetch_API-111827?style=flat&logo=javascript&logoColor=F7DF1E" height="26"/>
</div>

### Infraestrutura
<div>
  <img src="https://img.shields.io/badge/Docker-111827?style=flat&logo=docker&logoColor=2496ED" height="26"/>
  <img src="https://img.shields.io/badge/Docker_Compose-111827?style=flat&logo=docker&logoColor=2496ED" height="26"/>
</div>

---

## 🧠 Decisões Técnicas

> Esta seção documenta as escolhas feitas durante o desenvolvimento e os raciocínios por trás delas. Um bom engenheiro não só escreve código — ele justifica cada decisão.

---

### 1. Vitest no lugar do Jest

**Problema:** Jest 30 roda em CommonJS por padrão. A biblioteca `nanoid` v5 — usada para gerar os short codes — é um módulo ESM puro e não é compatível com CommonJS sem configuração adicional e complexa.

**Decisão:** Usar **Vitest**, que foi projetado para ambientes ESM nativos e se integra perfeitamente com projetos que usam `"type": "module"` no `package.json`.

**Resultado:** Zero configuração extra para ESM. Os testes rodam imediatamente, inclusive o teste unitário do `generateShortCode` que usa `nanoid` diretamente.

---

### 2. Validação de variáveis de ambiente com Zod na camada de startup

**Problema:** Variáveis de ambiente incorretas ou ausentes causam falhas silenciosas ou erros difíceis de depurar em runtime, às vezes em produção.

**Decisão:** Criar `config/env.ts` que usa **Zod** para validar `process.env` no momento em que a aplicação sobe. Se qualquer variável estiver ausente ou com formato inválido, a aplicação para imediatamente com uma mensagem clara.

**Por que não usar o schema/validator da aplicação?** A camada `schemas/` e `validators/` foi projetada para validar *requisições HTTP* (request/response). Variáveis de ambiente não são dados de requisição — elas são configuração de infraestrutura. Misturar as responsabilidades violaria o princípio de separação de concerns.

**Resultado:** `config/index.ts` exporta um objeto `config` completamente tipado, sem `string | undefined` em nenhum campo. Qualquer acesso a uma variável de ambiente na aplicação passa por esse objeto seguro.

---

### 3. Banco de dados separado por ambiente via NODE_ENV

**Problema:** Testes de integração que escrevem no banco de desenvolvimento corrompem dados reais e tornam o ambiente imprevisível.

**Decisão:** Criar duas connection strings no `.env` — `MONGO_URI_PROD` e `MONGO_URI_TEST` — e selecionar automaticamente qual usar com base na variável `NODE_ENV`.

**Resultado:** Rodar `npm test` nunca toca o banco de produção. Trocar de ambiente é uma linha no `.env`. A separação é explícita, rastreável e auditável.

---

### 4. Error handling centralizado com AppError

**Problema:** Sem um padrão de erros, cada rota retorna status codes e formatos de resposta diferentes, tornando o frontend imprevisível e o backend impossível de manter.

**Decisão:** Criar a classe `AppError` com `message` e `statusCode`, e um `errorMiddleware` global que captura qualquer erro lançado nos controllers/services.

**Resultado:** Qualquer serviço pode lançar `throw new AppError('URL não encontrada', 404)` e o middleware garante que a resposta HTTP terá exatamente o formato esperado. Erros não previstos caem no catch genérico com status 500.

---

### 5. Auto-refresh de token deduplicado no frontend

**Problema:** Se múltiplas requisições simultâneas recebem 401, todas tentariam renovar o token ao mesmo tempo, causando múltiplas chamadas ao endpoint `/refresh` e condições de corrida.

**Decisão:** Usar uma variável `refreshTokenRequest` em memória que armazena a Promise de refresh em andamento. Enquanto a Promise existe, todas as outras requisições que precisam do token renovado aguardam a mesma Promise em vez de disparar novas.

```typescript
const getRefreshTokenRequest = (): Promise<string | null> => {
  if (!refreshTokenRequest) {
    refreshTokenRequest = refreshAccessToken().finally(() => {
      refreshTokenRequest = null;
    });
  }
  return refreshTokenRequest;
};
```

**Resultado:** Independente de quantas requisições paralelas recebam 401, apenas uma chamada ao `/refresh` é feita.

---

### 6. Documentação da API com Swagger/OpenAPI

**Problema:** APIs sem documentação dificultam a integração por outros desenvolvedores e o próprio processo de testes manuais durante o desenvolvimento.

**Decisão:** Integrar o **swagger-ui-express** com um documento OpenAPI 3.0 estruturado em módulos separados por domínio (`users.docs.ts`, `short-url.docs.ts`, `schemas.docs.ts`), montado em `swagger.ts` e exposto na rota `/docs`.

**Por que modular?** Um único arquivo de documentação cresce indefinidamente conforme a API expande. A separação por domínio mantém cada arquivo coeso, facilita a revisão e evita conflitos de merge em times.

**Resultado:** Documentação interativa disponível em `http://localhost:3000/docs` com exemplos de request/response, schemas reutilizáveis via `$ref` e suporte a autenticação Bearer para testar endpoints protegidos.

---

### 7. Containerização com Docker e Docker Compose

**Problema:** O clássico "funciona na minha máquina" — diferenças de versão de Node.js, variáveis de ambiente não configuradas e dependências do sistema tornam o setup do projeto demorado e propenso a erros.

**Decisão:** Criar um `Dockerfile` para cada serviço (backend e frontend) usando a imagem `node:22-alpine` para manter as imagens leves, e um `docker-compose.yaml` na raiz do projeto para orquestrar os dois serviços com uma única linha de comando.

**Por que Alpine?** A imagem Alpine tem menos de 10MB, contra ~900MB da imagem Node.js padrão. Para um serviço de produção, isso reduz significativamente o tempo de build e o tamanho do artefato publicado.

**Resultado:** Qualquer desenvolvedor pode rodar o projeto completo com `docker compose up --build`, sem precisar instalar Node.js, configurar variáveis globais ou resolver conflitos de versão.

---

## ✅ Funcionalidades

### Autenticação
- Registro com nome, email e senha (bcrypt com 10 rounds)
- Login com geração de **access token** (1 dia) e **refresh token** (7 dias)
- Renovação automática de token no frontend sem interrupção da experiência
- Logout com limpeza completa de storage
- Proteção de rotas no frontend e middleware de autenticação no backend

### Encurtamento de URLs
- Geração de short code único com `nanoid(6)`
- Verificação de colisão com loop de regeneração automática
- Deduplicação: o mesmo usuário não encurta a mesma URL duas vezes
- Redirecionamento público via `GET /shortener/:shortCode`

### Gerenciamento
- Listagem paginada das URLs do usuário (10 por página)
- Exclusão com verificação de propriedade (usuário só deleta suas próprias URLs)
- Timestamps de criação

### Interface
- Design glassmorphism com animações CSS
- Floating labels nos inputs
- Toast notifications animados
- Skeleton loading states
- Indicador de força de senha no cadastro
- Feedback visual de cópia para clipboard

---

## 🧪 Testes

| Arquivo | Tipo | O que testa |
|---|---|---|
| `login.spec.ts` | Integração | Login válido retorna 200; credenciais inválidas retornam 400 |
| `postShortUrl.spec.ts` | Integração | Criação de URL encurtada retorna 201 com token válido |
| `redirectLink.spec.ts` | Integração | Redirecionamento 302 para URL original |
| `deleteUser-Url.spec.ts` | Integração | Usuário autenticado não consegue deletar URL de outro usuário |
| `generateShortCode.spec.ts` | Unitário | Short code gerado tem 6 caracteres e é do tipo string |

```bash
# Rodar todos os testes
npm test

# Rodar uma vez (CI)
npm run test:run
```

---

## 📋 Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/users/register` | Cadastrar usuário |
| `POST` | `/users/login` | Login e geração de tokens |
| `POST` | `/users/refresh` | Renovar access token |

### URLs
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/shortener/api/shorten` | ✅ | Encurtar URL |
| `GET` | `/shortener/api/urls` | ✅ | Listar URLs do usuário (paginado) |
| `DELETE` | `/shortener/api/:shortCode` | ✅ | Deletar URL |
| `GET` | `/shortener/:shortCode` | ❌ | Redirecionar para URL original |

### Documentação
| Rota | Descrição |
|---|---|
| `GET /docs` | Interface Swagger UI com todos os endpoints documentados |

---

## 🖥️ Interface da Aplicação

### Tela de Cadastro
![Register Screen](img/tela-cadastro.png)

Card com design glassmorphism, validação em tempo real, indicador de força de senha e ícone de confirmação por campo.

### Tela de Login
![Login Screen](img/tela-login.png)

Floating labels, gradiente animado de fundo e shimmer effect no botão durante carregamento.

### Dashboard
![Dashboard Screen](img/tela-dashboard.png)

Header fixo, área de encurtamento com resultado animado, histórico com paginação, skeleton loading e toast notifications.

---

## 🚀 Como Executar

### Opção 1 — Docker Compose (recomendado)

> Pré-requisitos: [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.

```bash
# 1. Clone o repositório
git clone https://github.com/devmoisesz/link-shortener.git
cd link-shortener

# 2. Configure as variáveis de ambiente do backend
cp backend/.env.example backend/.env
# Edite backend/.env com suas credenciais MongoDB e JWT secrets

# 3. Configure as variáveis de ambiente do frontend
cp frontend/.env.example frontend/.env
# Edite frontend/.env se necessário (o padrão aponta para localhost:3000)

# 4. Suba os serviços
docker compose up --build

# Backend → http://localhost:3000
# Frontend → http://localhost:5173
# Swagger  → http://localhost:3000/docs
```

Para rodar em background:

```bash
docker compose up --build -d

# Acompanhar logs
docker compose logs -f

# Parar os serviços
docker compose down
```

---

### Opção 2 — Execução local (sem Docker)

#### Pré-requisitos
- Node.js 20+
- MongoDB local ou Atlas
- npm

#### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Gerar JWT secrets seguros
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Iniciar em desenvolvimento
npm run dev
# → http://localhost:3000
# → Swagger: http://localhost:3000/docs
```

#### Frontend

```bash
cd frontend
npm install

# Criar .env.local
echo "VITE_API_URL=http://localhost:3000" > .env.local

npm run dev
# → http://localhost:5173
```

---

## 🔑 Variáveis de Ambiente

### Backend (`.env`)

```env
# Ambiente: 'production' ou 'test'
NODE_ENV=production

# Bancos separados por ambiente
MONGO_URI_PROD=mongodb+srv://user:password@cluster.mongodb.net/linkshortener_prod
MONGO_URI_TEST=mongodb+srv://user:password@cluster.mongodb.net/linkshortener_test

# Servidor
PORT=3000

# CORS
FRONTEND_URL=http://localhost:5173

# JWT — use secrets diferentes para cada um
JWT_SECRET=seu_secret_access_token_aqui
JWT_REFRESH_SECRET=seu_secret_refresh_token_aqui

# Apenas para testes de integração
TOKEN_TESTING=token_gerado_no_login_para_uso_nos_testes
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:5173
```

> ⚠️ Nunca commite `.env`. Use `.env.example` para compartilhar a estrutura.

---

## 📦 Requisitos Não-Funcionais

| Categoria | Implementação |
|---|---|
| **Segurança** | Senhas com bcrypt (10 rounds), JWT com secrets distintos, CORS restrito, rate limiting (100 req/15min) |
| **Validação** | Zod em toda entrada HTTP e nas variáveis de ambiente |
| **Performance** | Auto-refresh deduplicado, paginação, índices MongoDB nos campos críticos |
| **Manutenibilidade** | Arquitetura em camadas, TypeScript strict, error handling centralizado |
| **Testabilidade** | Banco de testes separado, Vitest + Supertest, testes de integração reais |
| **Documentação** | Swagger UI com OpenAPI 3.0, organizado por domínio com schemas reutilizáveis |
| **Portabilidade** | Docker + Docker Compose para execução reproduzível em qualquer ambiente |

---

## 👨‍💻 Sobre o Desenvolvedor

Projeto desenvolvido por **Moisés**, estudante de Desenvolvimento de Sistemas no SENAI CIMATEC e aspirante a Backend Engineer.

Este projeto foi construído com o objetivo de consolidar na prática conhecimentos de arquitetura backend, segurança em APIs REST, testes automatizados, documentação de API e integração full-stack — cada funcionalidade e cada decisão técnica foi pensada, implementada e documentada intencionalmente.

<div>
  <a href="https://github.com/devmoisesz">
    <img src="https://img.shields.io/badge/GitHub-111827?style=flat&logo=github&logoColor=white" height="26"/>
  </a>
  <a href="https://www.linkedin.com/in/moises-figueiredo/">
    <img src="https://img.shields.io/badge/LinkedIn-111827?style=flat&logo=linkedin&logoColor=0A66C2" height="26"/>
  </a>
</div>

---

<div align="center">
  <sub>Construído com foco em aprendizado real, decisões técnicas justificadas e código que pode ir para produção.</sub>
</div>
---

<div align="center">
  <sub>Construído com foco em aprendizado real, decisões técnicas justificadas e código que pode ir para produção.</sub>
</div>
