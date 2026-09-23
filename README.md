# Blueprint

Monorepo with a Next.js frontend, NestJS backend, and PostgreSQL.

## Stack

| App      | Path       | Tech                          | Port |
| -------- | ---------- | ----------------------------- | ---- |
| Frontend | repo root  | Next.js, TypeScript, Tailwind | 3000 |
| Backend  | `backend/` | NestJS, TypeScript            | 3001 |
| Database | Docker     | PostgreSQL 16                 | 5432* |

\* Host port comes from `POSTGRES_PORT` in `.env` (defaults to `5432`).

## Start everything with Docker

```bash
cp .env.example .env
docker compose up --build -d
# or: npm run docker:up
```

| Service  | URL                                      |
| -------- | ---------------------------------------- |
| Frontend | http://localhost:3000                    |
| Backend  | http://localhost:3001/api/health         |
| Postgres | `localhost:${POSTGRES_PORT}` (see `.env`) |

Stop:

```bash
npm run docker:down
```

Logs:

```bash
npm run docker:logs
```

## Local development (without app containers)

```bash
cp .env.example .env
npm run db:up

npm install
npm run dev

cd backend && cp .env.example .env && npm install && npm run start:dev
```

If host port `5432` is already in use, set `POSTGRES_PORT=5433` in `.env` and point `backend/.env` `DATABASE_URL` at that port.

## Root scripts

| Command                  | Description                       |
| ------------------------ | --------------------------------- |
| `npm run docker:up`      | Build & start full stack          |
| `npm run docker:down`    | Stop all containers               |
| `npm run docker:logs`    | Tail all container logs           |
| `npm run docker:reset`   | Wipe volumes and recreate stack   |
| `npm run db:up`          | Start Postgres only               |
| `npm run db:down`        | Stop containers                   |
| `npm run db:logs`        | Tail Postgres logs                |
| `npm run db:reset`       | Wipe volume and recreate Postgres |
| `npm run dev`            | Start Next.js on host             |
| `npm run dev:backend`    | Start NestJS on host (watch)      |
| `npm run build`          | Build Next.js                     |
| `npm run build:backend`  | Build NestJS                      |
| `npm run lint`           | Lint frontend                     |
| `npm run lint:backend`   | Lint backend                      |
| `npm run test:backend`   | Run backend unit tests            |
