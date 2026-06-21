# Pyramid Portfolio

A full-stack **agency portfolio website** built with **Next.js 14 App Router**, backed by **Supabase Postgres** via **Drizzle ORM**, following a **DDD + SOLID module-based architecture**. Includes a private admin dashboard for managing team members, protected by JWT authentication.

---

## Tech stack

| Concern          | Choice                                                              |
| ---------------- | ------------------------------------------------------------------- |
| Framework        | Next.js 14 (App Router)                                             |
| Language         | TypeScript                                                          |
| Styling          | Tailwind CSS + SCSS                                                 |
| Animation        | GSAP, Framer Motion, Lenis (smooth scroll)                          |
| Database         | Supabase (Postgres, Transaction Pooler)                             |
| ORM              | Drizzle ORM + drizzle-kit                                           |
| Auth             | JWT via `jose` (Edge-compatible), HTTP-only cookies, 7-day sessions |
| Passwords        | bcryptjs (salt rounds: 10)                                          |
| Validation       | Zod v4                                                              |
| Logging          | Winston + winston-daily-rotate-file (PSR-3, 7-day retention, JSON)  |
| Containerisation | Docker (multi-stage, `standalone` output) + Docker Compose          |

---

## Architecture

The backend follows **Domain-Driven Design (DDD)** with a **module-based** structure. Each domain (`team`, `auth`) is self-contained and split into three layers:

```
src/modules/<domain>/
├── application/
│   ├── dtos/          # Clean output types (no DB types leaked)
│   ├── interfaces/    # Service contracts
│   └── services/      # Business logic
├── infrastructure/
│   ├── interfaces/    # Repository contracts
│   ├── repositories/  # Drizzle queries — only layer that touches the DB
│   └── models/        # Drizzle table schemas
└── presentation/
    ├── controllers/   # Thin — validates input, calls service, returns Response
    └── schemas/       # Zod request schemas
```

**Layering rule:** `app` → `widgets` → `components` → `shared`. `modules` is imported only from `app/api` route handlers.

---

## Folder structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # POST /login  POST /logout  GET /me
│   │   ├── team/          # GET /team  POST /team  GET /team/count
│   │   │   ├── admin/     # GET /team/admin  (JWT required)
│   │   │   └── [id]/      # PUT  PATCH /deactivate  PATCH /reactivate
│   │   └── health/        # GET /health  (used by Docker healthcheck)
│   ├── team/              # Public team page
│   ├── login/             # Admin login (not linked in public nav)
│   └── dashboard/         # Admin dashboard (JWT protected)
│
├── modules/
│   ├── team/              # Team domain (public read + admin CRUD)
│   └── auth/              # Auth domain (login / JWT verification)
│
├── widgets/               # Page-level sections
│   ├── Navigation/
│   ├── Hero/
│   ├── About/             # "MEET THE TEAM" button (visible when team count > 0)
│   ├── Team/              # Public team grid + skeleton
│   ├── Dashboard/         # Admin table + member modal + skeleton
│   ├── LoginForm/
│   └── Footer/
│
├── components/            # Reusable UI primitives (Button, SidebarMenu, …)
├── hooks/                 # React hooks
├── lib/db/                # Drizzle client singleton
├── shared/
│   ├── errors/            # HttpError class
│   ├── logger/            # Winston logger (injected into services)
│   └── styles/            # globals.scss
├── data/                  # Static content & nav config
├── icons/                 # SVG components
└── middleware.ts          # JWT verification — protects /dashboard, redirects /login
```

---

## Getting started

### Prerequisites

- Node 20 LTS
- A [Supabase](https://supabase.com) project with the `pyramid_team` table (see [Database](#database))

### Environment variables

Create `.env.local` at the project root:

```env
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
JWT_SECRET=<run: openssl rand -base64 32>
```

> Use the **Transaction Pooler** URL (port `6543`) from Supabase → Settings → Database. Direct connections use IPv6 and may not be reachable from all networks.

### Install & run

```bash
npm install
npm run dev          # http://localhost:3400
```

---

## Scripts

| Script                | What it does                                                  |
| --------------------- | ------------------------------------------------------------- |
| `npm run dev`         | Dev server with hot reload (port 3400)                        |
| `npm run build`       | Production build                                              |
| `npm run start`       | Serve the production build                                    |
| `npm run lint`        | ESLint                                                        |
| `npm run db:generate` | Generate Drizzle migration files from schema changes          |
| `npm run db:push`     | Push schema directly to DB (no migration files, good for dev) |
| `npm run db:migrate`  | Run pending migration files                                   |

---

## Database

### Apply schema

```bash
npm run db:push
```

### Table: `pyramid_team`

| Column           | Type           | Notes                                                      |
| ---------------- | -------------- | ---------------------------------------------------------- |
| `id`             | `uuid`         | Primary key, auto-generated                                |
| `name`           | `varchar(255)` |                                                            |
| `job_title`      | `varchar(100)` |                                                            |
| `description`    | `text`         | Nullable                                                   |
| `email`          | `varchar(255)` | Unique                                                     |
| `linkedin_url`   | `text`         | Nullable                                                   |
| `avatar_url`     | `text`         | Nullable — use a direct image URL, not a Drive viewer link |
| `password`       | `varchar(255)` | bcrypt hash, nullable                                      |
| `display_order`  | `integer`      | Controls card order on the public page                     |
| `deactivated_at` | `timestamptz`  | Nullable                                                   |
| `reactivated_at` | `timestamptz`  | Nullable                                                   |
| `created_at`     | `timestamptz`  | Auto                                                       |
| `updated_at`     | `timestamptz`  | Auto                                                       |

**Active member rule:** a member is active when `deactivated_at IS NULL` OR `reactivated_at > deactivated_at`.

### Indexes

| Index                            | Columns                          | Purpose                          |
| -------------------------------- | -------------------------------- | -------------------------------- |
| `idx_pyramid_team_display_order` | `display_order`                  | `ORDER BY` on every public query |
| `idx_pyramid_team_active_filter` | `deactivated_at, reactivated_at` | Active filter `WHERE` clause     |

### Supabase RLS

Run once in the Supabase SQL editor to allow public reads:

```sql
ALTER TABLE pyramid_team ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON pyramid_team FOR SELECT TO anon USING (true);
```

---

## Admin dashboard

The dashboard lives at `/dashboard` and is not linked anywhere in the public site.

- **Login:** `/login` — email + password (bcrypt verified, JWT issued on success)
- **Session:** 7-day HTTP-only cookie (`pyramid_token`)
- **Protected routes:** `src/middleware.ts` verifies the JWT on every `/dashboard` request and redirects to `/login` if missing or expired

### Admin API routes (all require valid JWT cookie)

| Method  | Path                        | Action                         |
| ------- | --------------------------- | ------------------------------ |
| `GET`   | `/api/team/admin`           | All members including inactive |
| `POST`  | `/api/team`                 | Create member                  |
| `PUT`   | `/api/team/[id]`            | Update member                  |
| `PATCH` | `/api/team/[id]/deactivate` | Soft-deactivate                |
| `PATCH` | `/api/team/[id]/reactivate` | Reactivate                     |

---

## Logging

Winston writes structured JSON logs to `./logs/` with daily rotation and 7-day retention. Log levels follow PSR-3: `emergency`, `alert`, `critical`, `error`, `warning`, `notice`, `info`, `debug`. In development, logs are also printed to the console.

```
logs/
├── error-2026-06-21.log
├── combined-2026-06-21.log
└── ...
```

---

## Production deployment

### Prerequisites

- Docker and Docker Compose installed on the server
- Supabase project with schema applied (`npm run db:push` run locally or from CI)

### 1. Create `.env.production`

On the server, create `.env.production` alongside the project files. This file is listed in `.dockerignore` and `.gitignore` — never commit it.

```env
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
JWT_SECRET=<same value used locally, or generate a new one with: openssl rand -base64 32>
```

### 2. Build and start

```bash
docker compose up --build -d
```

The app will be available at `http://<server-ip>:3400`.

To update after a code change:

```bash
docker compose down
docker compose up --build -d
```

### 3. Verify health

Docker automatically polls `GET /api/health` every 30 seconds. Check the container status:

```bash
docker ps                          # STATUS should show (healthy)
docker inspect pyramid-portfolio --format='{{.State.Health.Status}}'
```

### 4. View logs

Application logs (Winston) are persisted in a named Docker volume and survive container restarts:

```bash
# Tail live app logs
docker exec pyramid-portfolio tail -f /app/logs/combined-$(date +%Y-%m-%d).log

# Or inspect the volume directly
docker volume inspect pyramidportfolio_logs
```

Docker container logs (stdout):

```bash
docker logs pyramid-portfolio -f
```

### 5. Putting it behind a reverse proxy (recommended)

Run the container on port `3400` internally and expose it via **Nginx** or **Caddy** with TLS termination. Example Nginx config:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass         http://localhost:3400;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

With **Caddy** (automatic HTTPS):

```
yourdomain.com {
    reverse_proxy localhost:3400
}
```

### Environment variables reference

| Variable       | Required | Description                                                       |
| -------------- | -------- | ----------------------------------------------------------------- |
| `DATABASE_URL` | Yes      | Supabase Transaction Pooler connection string (port 6543)         |
| `JWT_SECRET`   | Yes      | Random 32-byte base64 string — used to sign/verify session tokens |
| `NODE_ENV`     | Auto     | Set to `production` by Docker Compose                             |
