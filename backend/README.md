# Blueprint API

NestJS backend for Blueprint.

## Getting started

### With Docker (recommended)

From the repo root:

```bash
npm run docker:up
```

API: [http://localhost:3001/api/health](http://localhost:3001/api/health)

### On the host

```bash
# from repo root
npm run db:up

cd backend
cp .env.example .env
npm install
npm run start:dev
```

API listens on [http://localhost:3001](http://localhost:3001).

Inside Compose, Nest connects to Postgres at `postgres:5432`. On the host, use `localhost` and your published `POSTGRES_PORT` in `DATABASE_URL`.

## Prisma

Schema: `prisma/schema.prisma`  
Client: inject `PrismaService` (global via `PrismaModule`)

```bash
npm run prisma:generate   # regenerate client after schema changes
npm run prisma:migrate    # create/apply migrations
npm run prisma:studio     # browse data
```

Add models in `prisma/schema.prisma`, then run `prisma:migrate`.

## Endpoints

| Method | Path          | Description                          |
| ------ | ------------- | ------------------------------------ |
| GET    | `/api/health` | Health check (includes DB ping)      |

## Scripts

| Command                 | Description        |
| ----------------------- | ------------------ |
| `npm run start:dev`     | Watch mode         |
| `npm run build`         | Compile TypeScript |
| `npm run start:prod`    | Run compiled build |
| `npm run test`          | Unit tests         |
| `npm run test:e2e`      | End-to-end tests   |
| `npm run lint`          | ESLint             |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate`  | Run migrations       |
| `npm run prisma:studio`   | Open Prisma Studio   |
