## Problem

`npm test` (Vitest, Nuxt environment) printed `<Suspense> is an experimental feature and its API will likely change` to stdout for every test file, adding noise to CI and pre-commit output.

## Initial Diagnosis

- **Location**: Vitest Nuxt test environment (Vue + Suspense)
- **Root cause**: Vue still emits a development warning for Suspense; Nuxt’s test harness uses Suspense internally.
- **Reproducer** (before fix): `npm test` and observe repeated Suspense lines.

---

## Bug Fix Report (after merge)

**Bug ID:** `BUG-2026-04-26-002`  
**Severity:** Low  
**Status:** Fixed and verified

### Error Summary

| Field    | Value                                      |
| -------- | ------------------------------------------ |
| Message  | `<Suspense> is an experimental feature...` |
| Location | `tests/vitest-setup.ts` (filter)           |
| Trigger  | Any Vitest file using the Nuxt environment |

### Root Cause

Vue development build logs Suspense as experimental; the Nuxt + Vitest stack surfaces that to the console for each worker/file.

### Fix Applied

- Added `tests/vitest-setup.ts` to filter only the known Suspense substring on `console.log` / `console.warn`, preserving other output.
- Registered via `setupFiles` in `vitest.config.ts`.

### Prevention

- **Mechanism:** Centralized filter + comment in setup file.
- **Details:** Revisit when Vue stabilizes Suspense or the warning is removed from the test path.

### Test Coverage

- New tests: 0
- Suite: 30 unit tests, `npm run preflight` green
- `npm test` — no Suspense lines in output

### Commit

`fix(test): filter Suspense experimental console noise in Vitest`
