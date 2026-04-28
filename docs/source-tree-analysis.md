# Source Tree Analysis

```text
bicicleta/
├── .agents/                 # AI agent skills and configuration
├── assets/                  # Static assets and design files
├── components/              # Vue UI Components
│   ├── AdminBrandTable.vue  # Admin component for brand management
│   ├── BikeDetailView.vue   # Detailed view of a configured bike
│   ├── BrandForm.vue        # Form to add/edit brands
│   ├── BrandMindmap.vue     # Vue Flow interactive brand visualization
│   ├── CategorySidebar.vue  # Catalog navigation sidebar
│   ├── ConfirmationModal.vue
│   ├── EmptyState.vue
│   ├── GroupGrid.vue        # Grid view for component groups
│   ├── MiniBuilder.vue      # Lightweight builder interface
│   ├── OfflineBanner.vue    # PWA offline status indicator
│   ├── ProductCard.vue      # Individual component card
│   ├── ProductGrid.vue      # Grid for component catalog
│   ├── SaveBikeModal.vue    # Modal to save a custom build
│   ├── ShareBikeModal.vue   # Modal to share a build link
│   ├── ThemeSelector.vue    # UI theme switcher
│   └── TierSelector.vue     # Component tier/quality selector
├── composables/             # Vue Composables (Shared logic)
├── data/                    # Static data files and seed data
├── docs/                    # Project documentation (this folder)
├── locales/                 # i18n localization files
├── middleware/              # Nuxt route middleware (auth, etc)
├── pages/                   # Nuxt page routes (File-based routing)
│   ├── admin/               # Admin dashboard routes
│   ├── b/                   # Public shared bike routes
│   ├── brands/              # Brand catalog routes
│   ├── index.vue            # Landing page
│   ├── builder.vue          # Main bike builder interface
│   ├── catalog.vue          # Component catalog
│   ├── compare.vue          # Component comparison view
│   ├── design-system.vue    # Design system showcase
│   └── profile.vue          # User profile / saved bikes
├── scripts/                 # Utility scripts (scraping, seeding)
├── server/                  # Nitro Backend
│   ├── api/                 # API Routes
│   ├── database/            # Drizzle ORM schemas and DB config
│   └── utils/               # Server-side utilities (scraping, auth)
├── stores/                  # Pinia state management stores
│   └── builder.ts           # State for the active bike build
├── tests/                   # Unit and E2E tests
├── types/                   # TypeScript type definitions
└── utils/                   # Client-side utility functions
```

## Critical Folders

- **`components/`**: Contains all reusable Vue components. It uses Nuxt's auto-import feature, so these components are available globally in templates without manual imports.
- **`pages/`**: Nuxt's file-based routing. Each `.vue` file here maps to a URL route in the application.
- **`server/`**: The backend of the application powered by Nitro. Contains the REST API, database schemas, and server-side utilities.
- **`stores/`**: Pinia stores for global state management, primarily the bike builder state.
