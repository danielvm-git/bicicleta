# Data Models

This document outlines the database schema for the Bicicleta application, powered by Drizzle ORM and Neon PostgreSQL.

## Core Entities

### 1. Brands (`brands`)

Stores the canonical list of bicycle component manufacturers.

- `id` (text, PK): Normalized brand name (e.g., "shimano").
- `name` (text, unique): Display name.
- `url` (text): Official website.
- `logoFilename` (text): Local path to the downloaded brand logo.

### 2. Components (`components`)

The master inventory of all individual bicycle parts.

- `id` (serial, PK)
- `category` (text): e.g., "Derailleur", "Cassette".
- `model` (text): Specific model number.
- `brand` (text, FK): References `brands.id`.
- `line` (text): e.g., "Deore XT", "Ultegra".
- `functionalGroup` (text): e.g., "Drivetrain", "Brakes".
- `link` (text): External link.
- `imageUrl` (text): Product image.
- `price` (numeric): Current calculated or manually entered price.
- `weight` (numeric): Weight in kg.
- Additional spec fields: `speeds`, `steeringType`, `axleType`, `suspensionTravel`, `performanceLevel`.

### 3. Component Prices (`component_prices`)

Tracks historical pricing data for components (e.g., from scrapers).

- `id` (serial, PK)
- `componentId` (integer, FK): References `components.id`.
- `price` (numeric): The recorded price point.
- `createdAt` (timestamp): When this price was scraped or recorded.

### 4. Groups (`groups`)

Defines pre-configured drivetrain or component groups.

- `id` (serial, PK)
- `brand` (text): The brand of the group.
- `line` (text): The product line.
- `configuration` (text): e.g., "1x12", "2x11".
- Component fields: `frontShifter`, `rearShifter`, `frontDerailleur`, `rearDerailleur`, `cassette`, `bottomBracket`, `chain`, `crankset`.

### 5. Bikes (`bikes`)

Represents a user's custom bicycle build.

- `id` (serial, PK)
- `name` (text): Name of the build.
- `description` (text): Optional description.
- `totalPrice` (numeric): The aggregate price of all components.
- `slug` (text, unique): Public sharing slug.
- `isPublic` (boolean): Whether the build is publicly visible.
- `userId` (text): Optional user owner ID.

### 6. Bike Components (`bike_components`)

Junction table mapping individual components to a specific bike build.

- `id` (serial, PK)
- `bikeId` (integer, FK): References `bikes.id`.
- `componentId` (integer, FK): References `components.id`.

## Schema Relationships

- **Brands** have many **Components** and **Groups**.
- **Components** have many **Prices** and can belong to many **Bike Components** (many-to-many with Bikes).
- **Bikes** have many **Components** through the **Bike Components** junction table.
