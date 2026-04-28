# Component Inventory

This document provides an inventory of the reusable Vue UI components in the Bicicleta application.

## Core Application Components

- **`BikeDetailView.vue`**: Detailed view of a configured bike, including weight, price, and part lists.
- **`MiniBuilder.vue`**: A lightweight version of the builder interface for quick interactions.
- **`SaveBikeModal.vue`**: Modal to persist a custom bike build to the database.
- **`ShareBikeModal.vue`**: Modal to generate and share a public URL for a bike build.

## Catalog & Browsing

- **`ProductGrid.vue`**: Grid layout for browsing the component catalog.
- **`ProductCard.vue`**: Individual card displaying a single component's details, image, and price.
- **`GroupGrid.vue`**: Grid layout specifically for pre-configured drivetrain groups.
- **`CategorySidebar.vue`**: Sidebar navigation for filtering the catalog by category.
- **`BrandMindmap.vue`**: Interactive data visualization of brand hierarchies using Vue Flow.
- **`TierSelector.vue`**: UI control to filter components by performance tier/quality.

## Admin & Management

- **`AdminBrandTable.vue`**: Data table for managing brands in the admin dashboard.
- **`BrandForm.vue`**: Form interface for adding or editing brand data.

## Shared UI & Utilities

- **`ThemeSelector.vue`**: Dropdown/toggle to switch between the application's multi-theme design system.
- **`OfflineBanner.vue`**: Alert banner displayed when the PWA loses internet connectivity.
- **`ConfirmationModal.vue`**: Generic modal for confirming destructive actions.
- **`EmptyState.vue`**: Generic empty state placeholder for lists or grids with no data.
