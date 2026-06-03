# crypto-earlybirds

Sistema Web para Negociação de Criptomoedas Fictícias — Programa Early Birds PlugInfo 2026.1 / Info Jr. UFBA.

## Stack

- **Back-end:** NestJS · Prisma · PostgreSQL · JWT · Swagger
- **Front-end:** Next.js (App Router) · TypeScript · Tailwind · shadcn/ui
- **CMS:** Prismic (categorias, hero, página Sobre)
- **Integrações:** Asaas Sandbox (depósitos) · Mailtrap (e-mails)

## Estrutura

```
.
├── backend/     # API NestJS
├── frontend/    # Next.js
├── docker/      # docker-compose (Postgres local)
└── docs/        # documentação adicional
```

## Pré-requisitos

- Node.js 22+
- npm 10+
- Docker + Docker Compose

## Setup local

### 1. Subir o banco

```bash
docker compose -f docker/docker-compose.yml up -d
```

### 2. Back-end

```bash
cd backend
cp .env.example .env             # ajuste as variáveis
npm install                      # já rodado no scaffold
npx prisma migrate dev           # aplica o schema
npm run start:dev                # http://localhost:3001
```

API disponível em `http://localhost:3001/api/v1`, Swagger em `http://localhost:3001/api/docs`.

### 3. Front-end

```bash
cd frontend
cp .env.example .env.local
npm install                      # já rodado no scaffold
npm run dev                      # http://localhost:3000
```

## Variáveis de ambiente

| Local | Variável | Descrição |
|---|---|---|
| backend | `DATABASE_URL` | Conexão Postgres |
| backend | `JWT_SECRET` | Segredo do JWT |
| backend | `FRONTEND_URL` | Origem permitida no CORS |
| backend | `ASAAS_API_KEY` | Chave Asaas Sandbox |
| backend | `MAIL_*` | SMTP Mailtrap |
| frontend | `NEXT_PUBLIC_API_URL` | URL pública da API |
| frontend | `NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME` | Nome do repo Prismic |
| frontend | `PRISMIC_ACCESS_TOKEN` | Token de leitura do Prismic |

## Cronograma & escopo

Planejamento detalhado em `PLANEJAMENTO.md` (não versionado).
