# Blueprint API

NestJS backend for Blueprint.

## Getting started

### With Docker (recommended)

From the repo root:

```bash
npm run docker:up
```

On boot the container runs `prisma migrate deploy` (and seeds when `SEED_DATABASE=true`).

API: [http://localhost:3001/api/health](http://localhost:3001/api/health)

### On the host

```bash
# from repo root
npm run db:up

cd backend
cp ../.env .env   # must include API_KEY + DATABASE_URL
npm install
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

API listens on [http://localhost:3001](http://localhost:3001).

Inside Compose, Nest connects to Postgres at `postgres:5432`. On the host, use `localhost` and your published `POSTGRES_PORT` in `DATABASE_URL`.

## Auth

All routes except `GET /api/health` require the `x-api-key` header matching `API_KEY`.  
The Next.js app proxies browser calls through `/backend-api/*` and injects this key server-side.

## Prisma

Schema: `prisma/schema.prisma`  
Client: inject `PrismaService` (global via `PrismaModule`)

```bash
npm run prisma:generate   # regenerate client after schema changes
npm run prisma:migrate    # create/apply migrations
npm run prisma:seed       # upsert templates / demo items
npm run prisma:studio     # browse data
```

## Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/api/health` | Health check (public; includes DB ping) |
| GET | `/api/templates` | Design-style templates |
| GET | `/api/templates/:id/items` | Items for a template |
| GET | `/api/catalog/:store/categories` | Normalized store categories (`ikea` \| `amazon`) |
| GET | `/api/catalog/:store/products` | Products by category |
| GET | `/api/catalog/:store/products/more` | Paginated category products |
| GET | `/api/catalog/:store/search` | Keyword / aesthetic search |
| GET | `/api/ikea/*` | Raw IKEA retailer endpoints |
| GET | `/api/amazon/*` | Amazon dummy-catalog endpoints |
| POST | `/api/openai/empty-room-image` | Generate empty-room image |
| POST | `/api/meshy/image-to-3d` | Image upload → Meshy task |
| POST | `/api/meshy/image-to-3d-from-url` | Image URL → Meshy task |
| GET | `/api/meshy/tasks/:id` | Meshy task status |
| GET | `/api/meshy/tasks/:id/glb` | Proxied GLB download |

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run start:dev` | Watch mode |
| `npm run build` | Compile TypeScript |
| `npm run start:prod` | Run compiled build |
| `npm run test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |
| `npm run lint` | ESLint |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run migrations |
| `npm run prisma:seed` | Seed templates / items |
| `npm run prisma:studio` | Open Prisma Studio |
