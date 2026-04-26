## Problem

`npm run test:e2e` starts `nuxt dev` for Playwright. Vite logged `ERROR  Pre-transform error: Failed to resolve import "#app-manifest"` from Nuxt’s manifest composable, even though the suite passed. This obscured real failures in `webServer` output.

## Initial Diagnosis

- **Location**: `nuxt.config.ts` (Nuxt `experimental.appManifest`)
- **Root cause**: Vite’s import analysis still resolves the dynamic `import("#app-manifest")` in Nuxt’s SSR branch during client pre-bundle, causing resolver errors in dev.
- **Reproducer** (before fix): `npm run test:e2e` and search logs for `app-manifest`.

---

## Bug Fix Report (after merge)

**Bug ID:** `BUG-2026-04-26-001`  
**Severity:** Low  
**Status:** Fixed and verified

### Error Summary

| Field    | Value                                                           |
| -------- | --------------------------------------------------------------- |
| Error    | `Failed to resolve import "#app-manifest"` (Vite pre-transform) |
| Location | `nuxt.config.ts`                                                |
| Trigger  | Playwright `webServer` running `nuxt dev`                       |

### Root Cause

Nuxt’s app manifest feature registers a virtual module; Vite’s analyzer still trips on the dynamic import during dev client transforms.

### Fix Applied

- Set `experimental: { appManifest: false }` in `nuxt.config.ts` (project does not rely on client app manifest for route rules).
- Updated `tests/README.md` to document resolution and tradeoffs.

### Prevention

- **Mechanism:** Explicit Nuxt config + documentation.
- **Details:** See `tests/README.md` and comment in `nuxt.config.ts`.

### Test Coverage

- New tests: 0
- Suite: `npm run preflight` — all passing
- Type check / lint: `format:check` pass; `typecheck` not in scope for this change

### Commit

`fix(nuxt): disable app manifest to silence Vite #app-manifest dev noise`
