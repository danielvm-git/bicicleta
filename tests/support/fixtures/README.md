# Test fixtures

Place shared Playwright `mergeTests` extensions or Nuxt test fixtures here as the suite grows.

- Auth/session: wire `nuxt-auth-utils` when E2E needs a logged-in user.
- Data: prefer API seeding or idempotent setup — avoid hard waits (see TEA `test-quality`).
