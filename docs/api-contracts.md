# API Contracts

This document outlines the primary Server APIs (Nitro endpoints) available in the Bicicleta application.

## Public / Frontend Routes

### Bikes

- `GET /api/bikes` - Retrieve a list of bikes.
- `POST /api/bikes` - Create a new bike build.
- `GET /api/bikes/[slug]` - Retrieve a specific bike by its public slug.
- `PATCH /api/bikes/[slug]` - Update an existing bike.
- `GET /api/bikes/templates` - Retrieve pre-configured bike templates.
- `GET /api/bikes/public` - Retrieve a list of public bike builds.

### Catalog & Components

- `GET /api/components` - List components with optional filtering.
- `PATCH /api/components/[id]` - Update specific component data.
- `GET /api/categories` - Get structured categories for components.
- `GET /api/groups` - Get pre-configured drivetrain groups.
- `GET /api/lines` - Get product lines for a given brand.
- `GET /api/brands` - List all available brands.
- `GET /api/brands/[name]/matrix` - Get a product matrix/hierarchy for a specific brand.
- `GET /api/catalog/hierarchy` - Get the full catalog tree hierarchy.

### Search

- `GET /api/search` - Global search for components, brands, and bikes.

## Admin Routes

_Note: These routes require administrative authentication._

- `POST /api/admin/scrape` - Trigger a scraper (e.g., Mercado Livre) to update component prices.
- `POST /api/admin/import` - Import bulk data.
- `GET /api/admin/brands` - List brands for admin management.
- `POST /api/admin/brands` - Create a new brand.
- `PATCH /api/admin/brands/[id]` - Edit an existing brand.
- `DELETE /api/admin/brands/[id]` - Delete a brand.
- `POST /api/admin/brands/[id]/logo` - Upload or download a logo for a specific brand.

## Authentication

- `[...]/api/auth/[...]` - Handles authentication flows (likely Neon Auth integration or custom Auth handler).
- `POST /api/claim` - Claim a bike build to an authenticated user.
