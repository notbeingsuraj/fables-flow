# Fables Flow

**AI-Native Order-to-Collection Operating System**

Fables Flow is a production-grade SaaS platform built for Indian distributors and wholesalers, converting unstructured WhatsApp orders, invoices, and payments into automated workflows.

## Architecture

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form
- **Backend**: NestJS, PostgreSQL (Prisma), Redis, BullMQ (Worker)

## Setup

### Prerequisites

- Node.js >= 20
- pnpm >= 11
- Docker & Docker Compose (for local databases)

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start local databases (PostgreSQL, Redis):
   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Generate Prisma client and run migrations (once DB is up):
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

### Development

Start all apps (Web, API, Worker) in development mode:

```bash
pnpm dev
```

### Useful Commands

- `pnpm build`: Build all apps and packages
- `pnpm lint`: Run ESLint across the monorepo
- `pnpm typecheck`: Run TypeScript compilation check
- `pnpm test`: Run tests using Vitest

## Workspace Structure

- `apps/web`: Next.js frontend application
- `apps/api`: NestJS backend API
- `apps/worker`: BullMQ background job processor
- `packages/config`: Environment variable validation
- `packages/database`: Prisma ORM and schema
- `packages/types`: Shared TypeScript definitions
- `packages/ui`: Shared React components
- `packages/utils`: Helper functions
- `packages/validation`: Zod schemas for input validation
