# Tests — bicicleta

## Layout

| Path                | Role                                                             |
| ------------------- | ---------------------------------------------------------------- |
| `**/*.test.ts`      | **Vitest** (Nuxt environment) — unit / composable / parser logic |
| `e2e/*.spec.ts`     | **Playwright** — browser E2E (not run by Vitest)                 |
| `support/helpers/`  | Shared URLs and future Playwright / API helpers                  |
| `support/fixtures/` | Placeholder for `mergeTests` and auth/seed hooks                 |

## Preflight & hooks (overview)

| Command                   | What runs                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `npm run preflight:quick` | Vitest + Prettier check (fast)                                                                              |
| `npm run preflight`       | Vitest + Playwright E2E + Prettier + **Nuxt production build**                                              |
| `npm run typecheck`       | `nuxi typecheck` — **currently fails** on several pages; run when fixing TS; not in `preflight` until green |
| **Husky `pre-commit`**    | `lint-staged` (Prettier on staged files) + `npm run test`                                                   |
| **Husky `pre-push`**      | `npm run preflight` (full gate before remote)                                                               |

Use `preflight` before releases and in CI; rely on hooks for day-to-day.

## Unit / integration (Vitest)

```bash
npm test
npm test -- --run
```

`vitest.config.ts` **includes only** `tests/**/*.test.ts` so Playwright `*.spec.ts` files are never collected by Vitest.

## E2E (Playwright)

**Requires** a working `DATABASE_URL` and a **32+ character** `NUXT_SESSION_PASSWORD` (nuxt-auth-utils) so `/api/*` and session routes work. Put these in `.env` (see `.env.example`). The Playwright `webServer` injects a dev default session secret when `NUXT_SESSION_PASSWORD` is missing or too short, so E2E can run without hand-editing env for quick checks — use a real secret in CI.

```bash
# Browsers (first time, CI, or new machine)
npx playwright install chromium

# Headless (starts `npm run dev` automatically via webServer in playwright.config)
npm run test:e2e

# Iteration
npm run test:e2e:ui
npm run test:e2e:headed
npm run test:e2e:debug
```

- **Base URL:** `BASE_URL` (default `http://127.0.0.1:3000`) — see `playwright.config.ts`
- **Artifacts:** on failure, trace + screenshot + video; HTML report in `playwright-report/`; JUnit at `playwright-junit.xml`

## Selectors and quality

- Prefer **roles** and accessible names (`getByRole`, `getByLabel`) over CSS.
- For stable regression targets on critical paths, add **`data-testid`** in components and use `getByTestId`.
- Avoid `waitForTimeout`; rely on web-first assertions and `expect()` auto-waiting.
- TEA knowledge: see BMAD `test-quality`, `network-first` (if intercepting), `fixture-architecture` for larger suites.

## CI

- Run `npx playwright install --with-deps chromium` (or the browsers you use in `playwright.config` projects) before `npm run test:e2e`.
- Set `CI=true` for stricter Playwright settings (`forbidOnly`, retries) already wired in `playwright.config.ts`.
- Reuse or cache Playwright browser binaries between jobs to save time.

## Pact / Playwright utils

- This repo does not add `@seontechnologies/playwright-utils` by default. Enable in `_bmad/tea/config.yaml` and follow the TEA fragment `overview.md` if you add typed API helpers and shared fixtures.
