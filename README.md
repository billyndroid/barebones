# Barebones Monorepo

A full-stack e-commerce application built with:

- **Backend**: Fastify + Prisma + TypeScript
- **Frontend**: Next.js + TypeScript
- **Database**: PostgreSQL (via Prisma)
- **Integration**: Shopify webhooks and API

## Structure

```
project-root/
├─ apps/
│  ├─ api/               # Backend (Fastify + Prisma)
│  └─ web/               # Frontend (Next.js)
├─ .env.example
├─ README.md
└─ package.json
```

## Getting Started

1. Copy `.env.example` to `.env` and fill in your environment variables
2. Install dependencies: `npm install`
3. Set up the database: `npm run db:push --workspace=apps/api`
4. Start development servers: `npm run dev`

## Development

- API runs on `http://localhost:3001`
- Web app runs on `http://localhost:3000`

## Environment Variables

See `.env.example` for required environment variables.