# Bicicleta Project Context

## Domain Language

- **Component**: A physical bike part (e.g., Frame, Hub, Derailleur) with specific technical attributes (speeds, axle type, steering type).
- **Build**: A collection of Components that theoretically form a complete bicycle.
- **CompatibilityEngine**: A deep module responsible for validating the technical coherence of a Build.
- **Rule**: A specific technical constraint (e.g., "Drivetrain speeds must match") managed by the CompatibilityEngine.
- **Issue**: A violation of a Rule, categorized as either an 'error' (physical impossibility) or a 'warning' (sub-optimal or risky configuration).
- **Seam**: The interface between the UI/API and the CompatibilityEngine, allowing for logic changes without impacting the callers.
- **Isomorphic**: Refers to the CompatibilityEngine being executable on both the client (Vue/Nuxt) and the server (Nitro).
