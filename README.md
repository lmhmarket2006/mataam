# Mataam — restaurant storefront + admin

Single-tenant Next.js app: public menu (Arabic/English), cart, WhatsApp checkout, and an Arabic admin panel for categories, menu items, branches, settings, and orders. Data is stored with **Prisma**; the default setup uses **SQLite**.

## Requirements

- **Node.js** 20+ (LTS recommended)
- **npm** (or compatible client)

Optional: **Bun** is referenced in the production `start` script; you can run the standalone server with **Node** instead if you prefer.

## Environment variables

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Prisma connection string. Default local example: `file:./dev.db` (path is relative to the Prisma schema / migration context). |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits-only WhatsApp number for customer checkout links (`wa.me`). |
| `SESSION_SECRET` | Secret used to sign the admin session cookie (JWT). Use a long random string; **at least 16 characters** are required at runtime, **32+ recommended** for production. **Never commit** real secrets. |

**Do not commit** `.env` or database files — see below.

## Local setup

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run db:seed
npm run dev
```

The app runs at **http://localhost:3000** (see `package.json` `dev` script for the port).

- **Public site:** `/`
- **Admin login:** `/admin/login`

### Database file and Git

- SQLite creates a `*.db` file on disk. **`*.db` and `*.db-journal` are listed in `.gitignore`** so you do not accidentally commit customer data, orders, or password hashes.
- **Never commit** a production database to version control.

### Default admin account (seed)

After `npm run db:seed`, you can sign in with the credentials created in `prisma/seed.ts` (currently **`admin@local.test`** / **`Admin123!`**).

**You must change this password after the first login** (or replace the user in the database) before any real deployment. Re-running the seed **resets** the admin password to the seed value — do not run seed blindly on production.

## Useful npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (includes `standalone` asset copy step) |
| `npm run start` | Runs the standalone server (see script — uses Bun + `NODE_ENV=production` on Unix) |
| `npm run db:seed` | Runs `prisma/seed.ts` via `tsx` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:push` | `prisma db push` (schema sync without migration files) |
| `npm run db:reset` | Reset database (destructive) |

## Deploying

1. Set environment variables on the host (`DATABASE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `SESSION_SECRET`).
2. Run `npm run build`.
3. Run the **standalone** Node server from `.next/standalone` (the build script copies static assets and `public` into that folder). Example:

   ```bash
   node .next/standalone/server.js
   ```

   Use **HTTPS** in production so the admin session cookie is sent with `Secure` (see `src/app/api/auth/login/route.ts`).

4. **WhatsApp:** Set `NEXT_PUBLIC_WHATSAPP_NUMBER` and/or restaurant WhatsApp in admin settings so checkout links target the correct number.

### SQLite limitations

SQLite works well for a **single server** or **one container** with a **persistent volume**. It is a poor fit for **serverless** platforms that scale to many instances or ephemeral disks (e.g. multiple writers, file not shared). For high availability or multi-instance hosting, plan a move to **PostgreSQL** (or another server database) and update `DATABASE_URL` and `provider` in `schema.prisma`.

## Project structure (high level)

- `src/app/` — App Router pages and API routes (`/api/auth/*`, `/api/orders/checkout`).
- `src/components/restaurant/` — Public UI.
- `src/app/admin/` — Admin UI and server actions.
- `prisma/` — Schema, migrations, `seed.ts`.

## License / handoff

Private project — follow your agreement with the client for licensing and support.
