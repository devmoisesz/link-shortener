<div align="center">

<img src="https://img.shields.io/badge/status-production_ready-10B981?style=flat-square&logoColor=white" height="22"/>
<img src="https://img.shields.io/badge/arquitetura-SOLID_%2B_clean_layers-3B82F6?style=flat-square" height="22"/>
<img src="https://img.shields.io/badge/testes-unit_%2B_e2e-7C3AED?style=flat-square" height="22"/>
<img src="https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" height="22"/>
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

**Encurtador de URLs full-stack com autenticação JWT, refresh token, arquitetura escalável, testes automatizados e CI com GitHub Actions.**

*A última evolução do projeto não adicionou novas funcionalidades de produto. O foco foi refatorar a base para uma arquitetura mais sustentável, aplicando princípios SOLID, melhorando testabilidade e automatizando validações com testes unitários, E2E e pipeline de CI.*

</div>

---

## Visão Geral

O projeto é um encurtador de URLs construído com **Node.js**, **Express**, **TypeScript**, **MongoDB**, **React** e **Vite**.

A aplicação já possuía autenticação, criação de URLs curtas, listagem, exclusão e redirecionamento. A nova etapa do projeto reorganizou o backend para separar responsabilidades com mais clareza, reduzir acoplamento com o banco de dados e permitir testes mais rápidos e confiáveis.

Principais mudanças recentes:

- Nova arquitetura baseada em controllers, services, repositories e factories.
- Aplicação de princípios SOLID, especialmente separação de responsabilidades e inversão de dependência.
- Repositories com contratos explícitos e implementações Mongoose e in-memory.
- Services isolados da camada HTTP e do banco de dados.
- Testes unitários para regras de negócio usando repositories em memória.
- Testes E2E para controllers e fluxos HTTP com Supertest.
- Configuração do Vitest com projetos separados para `unit` e `e2e`.
- Pipeline de CI no GitHub Actions executando testes E2E em pull requests.

---

## Arquitetura do Projeto

```text
links-shortener/
|
├── backend/                         # Node.js + Express + TypeScript + MongoDB
│   ├── config/
│   │   ├── database.ts              # Conexão com MongoDB por ambiente
│   │   ├── env.ts                   # Validação das variáveis de ambiente com Zod
│   │   └── index.ts                 # Configuração tipada da aplicação
│   │
│   ├── src/
│   │   ├── auth/                    # Middleware de autenticação JWT
│   │   ├── controllers/             # Camada HTTP organizada por domínio
│   │   │   ├── short-url/
│   │   │   └── users/
│   │   │
│   │   ├── docs/                    # Swagger / OpenAPI
│   │   ├── middleware/              # AppError e middleware global de erros
│   │   ├── repositories/            # Contratos e implementações de persistência
│   │   │   ├── in-memory/           # Repositories usados em testes unitários
│   │   │   ├── mongoose/            # Repositories reais com MongoDB/Mongoose
│   │   │   ├── short-url.repository.ts
│   │   │   └── users.repository.ts
│   │   │
│   │   ├── routes/                  # Definição das rotas Express
│   │   ├── schemas/                 # Schemas Zod para entrada HTTP
│   │   ├── services/                # Casos de uso e regras de negócio
│   │   │   ├── factories/           # Composição das dependências reais
│   │   │   ├── delete-url.ts
│   │   │   ├── get-user-urls.ts
│   │   │   ├── login.ts
│   │   │   ├── redirect-link.ts
│   │   │   ├── register-user.ts
│   │   │   └── shortenUrl.ts
│   │   │
│   │   ├── utils/                   # Utilitários e helpers de teste
│   │   └── validators/              # Middleware genérico de validação
│   │
│   ├── app.ts                       # Configuração do Express
│   ├── start.ts                     # Entry point da aplicação
│   ├── vite.config.mjs              # Configuração Vitest: unit + e2e
│   └── Dockerfile
│
├── frontend/                        # React + TypeScript + Vite
│   ├── src/
│   │   ├── @types/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── service/
│   │   ├── styles/
│   │   └── utils/
│   └── Dockerfile
│
├── .github/workflows/
│   └── run-e2e-tests.yml            # CI: executa testes E2E em pull requests
│
└── docker-compose.yaml              # Orquestra backend + frontend
```

---

## Princípios de Arquitetura

### Separação de responsabilidades

Cada camada tem uma responsabilidade clara:

- **Controllers** recebem requisições HTTP, extraem dados, chamam services e retornam respostas.
- **Services** concentram as regras de negócio e não dependem diretamente de Express ou Mongoose.
- **Repositories** isolam o acesso a dados atrás de interfaces.
- **Factories** montam os services com as implementações reais usadas em produção.
- **Middlewares** cuidam de autenticação, validação e tratamento de erros.

### SOLID aplicado na prática

| Princípio | Como aparece no projeto |
|---|---|
| **S - Single Responsibility** | Controllers, services, repositories, validators e middlewares possuem responsabilidades separadas. |
| **O - Open/Closed** | Novas implementações de repository podem ser adicionadas sem alterar os services. |
| **L - Liskov Substitution** | Repositories in-memory e Mongoose seguem os mesmos contratos e podem ser trocados nos testes. |
| **I - Interface Segregation** | Os services dependem de contratos específicos como `UsersRepository` e `ShortUrlRepository`. |
| **D - Dependency Inversion** | Services recebem abstrações no construtor, em vez de criar dependências concretas internamente. |

### Testabilidade como consequência da arquitetura

A inversão de dependência permite testar regras de negócio sem subir servidor HTTP e sem depender do MongoDB. Para isso, os testes unitários usam repositories in-memory, enquanto os testes E2E validam o comportamento real da API passando pelas rotas e controllers.

---

## Tecnologias

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- JWT
- Cookie Parser
- Zod
- Swagger / OpenAPI
- bcrypt
- nanoid

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- CSS
- Fetch API

### Testes e CI

- Vitest
- Supertest
- Repositories in-memory
- GitHub Actions

### Infraestrutura

- Docker
- Docker Compose

---

## Testes

O backend possui dois grupos de testes configurados no Vitest:

```bash
# Testes unitários
npm test

# Testes E2E
npm run test:e2e
```

### Testes unitários

Os testes unitários ficam em `backend/src/services` e validam os casos de uso isolados:

| Área | Exemplos |
|---|---|
| Autenticação | Login e registro de usuário |
| URLs | Encurtar URL, redirecionar, listar e deletar |
| Utilitários | Geração de short code |
| Repositories fake | Uso de implementações in-memory para isolar regra de negócio |

### Testes E2E

Os testes E2E ficam em `backend/src/controllers` e exercitam a API pela camada HTTP:

| Área | Exemplos |
|---|---|
| Usuários | Registro, login e refresh token |
| URLs | Criar URL curta, listar URLs, redirecionar e deletar |
| Segurança | Fluxos autenticados e validações de propriedade |

### Configuração do Vitest

O arquivo `backend/vite.config.mjs` separa os testes em dois projetos:

```ts
projects: [
  {
    test: {
      name: 'unit',
      dir: 'src/services',
    },
  },
  {
    test: {
      name: 'e2e',
      dir: 'src/controllers',
    },
  },
]
```

Essa separação deixa o ciclo de desenvolvimento mais rápido e permite que o CI rode o grupo de testes adequado para validação de pull requests.

---

## CI com GitHub Actions

O workflow `.github/workflows/run-e2e-tests.yml` executa os testes E2E automaticamente em pull requests.

Etapas do pipeline:

1. Faz checkout do repositório.
2. Configura Node.js 20.
3. Usa cache do npm baseado em `backend/package-lock.json`.
4. Instala dependências com `npm ci`.
5. Executa `npm run test:e2e`.
6. Injeta variáveis sensíveis via GitHub Secrets.

Variáveis usadas no CI:

- `MONGO_URI_TEST`
- `MONGO_URI_PROD`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL`
- `NODE_ENV`

---

## Funcionalidades

As mudanças recentes foram arquiteturais e de qualidade interna. As funcionalidades de produto continuam sendo:

### Autenticação

- Registro de usuário com nome, email e senha.
- Login com geração de access token.
- Refresh token em cookie HTTP-only.
- Logout no frontend com limpeza de sessão.
- Rotas protegidas no frontend e middleware JWT no backend.

### Encurtamento de URLs

- Geração de short code com `nanoid`.
- Verificação de colisão antes de persistir a URL curta.
- Deduplicação de URL por usuário.
- Redirecionamento público por short code.

### Gerenciamento

- Listagem paginada das URLs do usuário.
- Exclusão de URL com validação de propriedade.
- Timestamps de criação.

### Interface

- Tela de cadastro.
- Tela de login.
- Dashboard com criação, listagem, paginação, cópia e exclusão de URLs.
- Toasts e estados visuais de carregamento.

---

## Endpoints da API

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/users/register` | Cadastrar usuário |
| `POST` | `/users/login` | Login e geração de token |
| `POST` | `/users/refresh` | Renovar access token |

### URLs

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/shortener/api/shorten` | Sim | Encurtar URL |
| `GET` | `/shortener/api/urls` | Sim | Listar URLs do usuário |
| `DELETE` | `/shortener/api/:shortCode` | Sim | Deletar URL |
| `GET` | `/shortener/:shortCode` | Não | Redirecionar para URL original |

### Documentação

| Rota | Descrição |
|---|---|
| `GET /docs` | Swagger UI com a documentação da API |

---

## Interface da Aplicação

### Tela de Cadastro

![Register Screen](img/tela-cadastro.png)

### Tela de Login

![Login Screen](img/tela-login.png)

### Dashboard

![Dashboard Screen](img/tela-dashboard.png)

---

## Como Executar

### Opção 1: Docker Compose

Pré-requisitos:

- Docker
- Docker Compose

```bash
git clone https://github.com/devmoisesz/link-shortener.git
cd link-shortener

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose up --build
```

Serviços:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Swagger: `http://localhost:3000/docs`

### Opção 2: Execução local

Pré-requisitos:

- Node.js 20+
- MongoDB local ou Atlas
- npm

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Variáveis de Ambiente

### Backend

```env
NODE_ENV=production
MONGO_URI_PROD=mongodb+srv://user:password@cluster.mongodb.net/linkshortener_prod
MONGO_URI_TEST=mongodb+srv://user:password@cluster.mongodb.net/linkshortener_test
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=seu_secret_access_token_aqui
JWT_REFRESH_SECRET=seu_secret_refresh_token_aqui
```

### Frontend

```env
VITE_API_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:5173
```

Nunca commite arquivos `.env`. Use `.env.example` para compartilhar apenas a estrutura esperada.

---

## Requisitos Não Funcionais

| Categoria | Implementação |
|---|---|
| **Segurança** | bcrypt, JWT, refresh token em cookie HTTP-only, CORS e rate limiting |
| **Validação** | Zod para variáveis de ambiente e dados de entrada HTTP |
| **Manutenibilidade** | Services isolados, repositories por contrato, factories e tratamento global de erros |
| **Testabilidade** | Testes unitários com in-memory repositories e testes E2E com Supertest |
| **Escalabilidade arquitetural** | Separação por camadas e domínios, facilitando novas implementações sem quebrar casos de uso existentes |
| **Documentação** | Swagger UI com OpenAPI |
| **Portabilidade** | Docker e Docker Compose |
| **Integração contínua** | GitHub Actions executando testes E2E em pull requests |

---

## Sobre o Desenvolvedor

Projeto desenvolvido por **Moisés**, estudante de Desenvolvimento de Sistemas no SENAI CIMATEC e aspirante a Backend Engineer.

Este projeto foi construído para consolidar conhecimentos de arquitetura backend, APIs REST, autenticação, testes automatizados, documentação e integração full-stack. A evolução mais recente reforça a base técnica do sistema com uma arquitetura mais escalável, testável e alinhada com princípios SOLID.

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
  <sub>Construído com foco em aprendizado real, arquitetura sustentável e código testável.</sub>
</div>
