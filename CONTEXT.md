# Bicicleta Project Context

## Domain Language

- **Component**: A physical bike part (e.g., Frame, Hub, Derailleur) with specific technical attributes (speeds, axle type, steering type).
- **Bike**: A collection of Components that theoretically form a complete bicycle.
- **CompatibilityEngine**: A deep module responsible for validating the technical coherence of a Bike.
- **Rule**: A specific technical constraint (e.g., "Drivetrain speeds must match") managed by the CompatibilityEngine.
- **CompatibilityIssue**: A violation of a Rule, categorized as either an 'error' (physical impossibility) or a 'warning' (sub-optimal or risky configuration). Each issue carries a stable `ruleId` (see `COMPATIBILITY_RULE_IDS` in `types/bike`) so UI and tests do not depend on message copy; optional `componentId` / `relatedComponentIds` implicate **Component** rows.
- **Rule id**: Stable string key per **Rule** output (`drivetrain_speed_mismatch`, `boost_rear_axle`, etc.); the CompatibilityEngine implements **Rule**s as small functions composed by `validateBike`.
- **Seam**: The interface between the UI/API and the CompatibilityEngine, allowing for logic changes without impacting the callers.
- **Isomorphic**: Refers to the CompatibilityEngine being executable on both the client (Vue/Nuxt) and the server (Nitro).
- **Neon session DTO**: The Better Auth / `get-session` response shape; user identity is normalized in `utils/neonAuth` so the client and server do not duplicate `data.user` vs `user` handling.
- **Bike list / read policy**: Public vs “my bikes” and slug visibility rules are centralized in `server/utils/bikeAccess` so list and single-bike routes share one policy seam.
- **Component catalog query**: Facet filters and cache invalidation for list/search endpoints are centralized in `server/utils/componentCatalog` next to the **Component** data model. Cached list handlers share `CATALOG_CACHE_HANDLER_NAME` so cache busting stays aligned with `defineCachedEventHandler` `name` values.
- **Bike price aggregate**: The summed price of **Component** rows for a **Bike** uses `sumComponentPrices` in `utils/bikePrice` (isomorphic) so the builder and POST `/api/bikes` share one numeric **interface**.
