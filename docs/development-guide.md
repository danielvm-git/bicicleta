# Development Guide

## Prerequisites

- Node.js v18 or newer
- Postgres Database (Neon serverless recommended)
- API Keys:
  - Neon Database URL
  - Mercado Livre API credentials (for price scraping)

## Environment Setup

1. Clone the repository.
2. Copy `.env.example` to `.env`.
3. Fill out the environment variables:
   ```env
   DATABASE_URL="postgres://user:password@host/dbname"
   MELI_CLIENT_ID="your_client_id"
   MELI_CLIENT_SECRET="your_client_secret"
   ```

## Installation

Run `npm install` to install all dependencies.

## Available Scripts

### Development

- `npm run dev`: Starts the Nuxt development server at `http://localhost:3000`.

### Database

- `npm run db:push`: Pushes Drizzle schema changes to the database.
- `npm run db:generate`: Generates migration files based on schema changes.
- `npm run setup:db`: Alias for pushing the schema.

### Utilities

- `npm run logos:download`: Triggers the script to programmatically download missing brand logos via API.

### Testing

- `npm run test`: Runs unit tests via Vitest.
- `npm run test:e2e`: Runs end-to-end tests via Playwright in headless mode.
- `npm run test:e2e:ui`: Opens the Playwright UI mode for interactive E2E testing.
- `npm run preflight`: Runs a full suite of tests, formatting checks, and a production build to verify readiness.

### Formatting & Types

- `npm run format:check`: Checks formatting using Prettier.
- `npm run typecheck`: Runs TypeScript compiler checks via Nuxt.

## Architecture

This project uses Nuxt 3, which implies an Isomorphic architecture where code can run on both the server and the client. Data is fetched primarily via Nuxt's `useFetch` composable connecting to the Nitro backend API routes in the `server/api` directory.
