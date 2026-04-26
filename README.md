# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Agent stack (dev-checklist)

This repo uses the [dev-checklist](https://github.com/danielvm-git/dev-checklist) signals (specs, MCP, etc.). Versioned MCP configs for Claude, Cursor, and Gemini live at the paths listed in [docs/mcp-and-ides.md](docs/mcp-and-ides.md). When changing MCP servers, follow the PR checklist there and keep files in sync across IDEs.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Security & Bikes API

- **Neon Auth** (Better Auth) issues session cookies via your Neon project. The Nuxt app proxies `/api/auth/*` to the Neon Auth base URL so cookies are **same-origin** with the app. Prefer `SameSite=Lax` (or stricter) in production.
- **Private bikes** are not listable with `GET /api/bikes` (that endpoint returns public bikes only unless `?user=true` and a signed-in user, in which case it returns that user’s bikes). A bike’s `slug` only resolves with `GET /api/bikes/:slug` if the bike is public or the caller is the owner.
- **Admin** (`/api/admin/import`, `/api/admin/scrape`) requires a signed-in user whose Better Auth / Neon user record has **`role` set to `admin`**. Grant that in the Neon **Auth** UI or via Neon Auth’s user/role APIs. Rate limits apply (see `nuxt.config` `runtimeConfig`).

### User IDs and `bikes.userId`

Ownership uses the **Neon Auth user `id`**, not the legacy GitHub numeric id. If you have older rows with GitHub id strings, sign in and use **Vincular** on the profile page for anonymous local bikes, or run a one-off SQL update to map old ids to new Neon user ids.

## Environment

| Variable                                          | Purpose                                                                                                                                                                                |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NUXT_NEON_AUTH_BASE_URL` or `NEON_AUTH_BASE_URL` | Neon Auth service URL from **Neon Console → Auth** (the app proxies `/api/auth/*` here). If unset, `GET /api/auth/get-session` returns an empty session and sign-in routes return 503. |
| `DATABASE_URL`                                    | Postgres connection string for Drizzle.                                                                                                                                                |

`POST /api/bikes` recomputes total price on the server; `GET /api/bikes/public` returns paginated data: `{ items, nextCursor }` with optional `?limit` and `?cursor` (cursor is the `id` of the last item from the previous page).

## Database

### First-time local database

1. Copy [`.env.example`](.env.example) to `.env` and set **`DATABASE_URL`** to your Neon (or other Postgres) connection string.
2. Apply the Drizzle schema to that database: **`npm run setup:db`** (alias for `drizzle-kit push`, same as `npm run db:push`). This creates tables such as `bikes` and `components` from [server/database/schema.ts](server/database/schema.ts).
3. Restart **`npm run dev`**.

If the server logs `relation "bikes" does not exist` (for example on `GET /api/bikes/public`), the app is connected to a database where the schema has not been applied—fix the URL if needed, then run **`npm run setup:db`** again.

Apply new migrations (for example `0006_add_fk_cascade.sql`) with your usual process (`drizzle-kit` migrate or `drizzle-kit push` in development). The repo also documents cascade FKs in [server/database/schema.ts](server/database/schema.ts).
