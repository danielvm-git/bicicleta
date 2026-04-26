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

- **Session cookies** from `nuxt-auth-utils` use the browser’s default SameSite behavior. Prefer `SameSite=Lax` (or stricter) in production for cross-site request mitigations.
- **Private bikes** are not listable with `GET /api/bikes` (that endpoint returns public bikes only unless `?user=true` and a signed-in user, in which case it returns that user’s bikes). A bike’s `slug` only resolves with `GET /api/bikes/:slug` if the bike is public or the caller is the owner.
- **Admin** (`/api/admin/import`, `/api/admin/scrape`) is restricted to GitHub user IDs in `NUXT_ADMIN_GITHUB_IDS` (or `ADMIN_GITHUB_IDS`). If unset, admin routes return **403** (fail closed). Rate limits apply (see `nuxt.config` `runtimeConfig`).

## Environment

| Variable                                      | Purpose                                                                                 |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| `NUXT_ADMIN_GITHUB_IDS` or `ADMIN_GITHUB_IDS` | Comma-separated GitHub user IDs allowed to use admin import/scrape. Required for admin. |
| `DATABASE_URL`                                | Postgres connection string for Drizzle.                                                 |

`POST /api/bikes` recomputes total price on the server; `GET /api/bikes/public` returns paginated data: `{ items, nextCursor }` with optional `?limit` and `?cursor` (cursor is the `id` of the last item from the previous page).

## Database

Apply new migrations (for example `0006_add_fk_cascade.sql`) with your usual process (`drizzle-kit` migrate or `drizzle-kit push` in development). The repo also documents cascade FKs in [server/database/schema.ts](server/database/schema.ts).
