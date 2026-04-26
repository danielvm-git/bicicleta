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
