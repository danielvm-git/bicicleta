# Test fixtures

Place shared Playwright `mergeTests` extensions or Nuxt test fixtures here as the suite grows.

- Auth/session: for a logged-in E2E user, use Neon Auth (set `NUXT_NEON_AUTH_BASE_URL` and sign in with real OAuth, or add Playwright storage-state from a manual login).
- Data: prefer API seeding or idempotent setup — avoid hard waits (see TEA `test-quality`).
