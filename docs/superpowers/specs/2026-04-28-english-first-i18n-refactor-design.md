# English-First i18n Refactor Design

**Date:** 2026-04-28  
**Status:** Approved  
**Owner:** Daniel VM

## Overview

Refactor the bicicleta codebase from Portuguese-first to English-first with a runtime translation layer. Categories will be stored in English in the database with translations managed via DeepL API. All source code, types, and APIs will use English. The Nuxt/Vue frontend will translate categories to pt-BR and other languages at runtime.

## Problem Statement

Currently:

- Database categories are in Portuguese (Aro, Freios, Transmissão, etc.)
- Source code mixes Portuguese (parser.ts normalizeCategory) and English
- No internationalization framework
- Hard to add new languages
- Inconsistent naming across codebase

Goal:

- Single source of truth: English categories in database
- Clean separation: logic in English, UI translations in Vue
- Extensible i18n system via DeepL API
- Audit trail for all data changes

## Architecture

### Database Schema

**New tables:**

1. `categories` — 24 predefined English category names (Frame, Wheel, Brakes, etc.)
2. `category_translations` — I18n translations (category_id, language_code, translated_name)
3. `audit_logs` — Change tracking (table_name, operation, changed_by, changed_at ISO8601 with tz, old_values/new_values as JSONB)

**Modified tables:**

- `components.category: TEXT` → `components.category_id: INT FK`

**Unchanged:**

- brands, bikes, bike_components, groups (no schema changes)

### Category List (English)

1. Frame
2. Headset
3. Suspension
4. Brakes
5. Brake Discs
6. Shifter
7. Rear Derailleur
8. Front Derailleur
9. Cassette
10. Chain
11. Crankset
12. Bottom Bracket
13. Wheel
14. Hub
15. Spoke
16. Tire
17. Tubeless
18. Handlebars
19. Stem
20. Grips
21. Seatpost
22. Saddle
23. Pedal
24. Component (catch-all for miscellaneous)

### I18n Strategy

**DeepL Integration:**

- One-time auto-translation of 24 categories to pt-BR on deploy
- Future language support (es, fr, de, etc.) via DeepL API
- Admin can manually override translations if needed

**Runtime Translation:**

- Nuxt composable: `useCategory(englishName, locale)` → returns translated name
- Vue component filter: `{{ "Wheel" | t('component') }}`
- Fallback to English if translation missing

**Admin Operations:**

- Brand CRUD with audit logging
- Component CRUD with audit logging
- View/manage category translations (display only, no edits needed)

## Data Migration

**Phase 1: Setup**

1. Create new `categories` table with 24 English names
2. Create `category_translations` table
3. Seed `category_translations` with DeepL API calls (pt-BR)
4. Create `audit_logs` table

**Phase 2: Data Migration**

1. Backfill `components.category_id` from old `components.category` (Portuguese text lookup)
2. Verify all components have valid category_id
3. Drop old `components.category` column

**Phase 3: Code Changes**

1. Update Drizzle schema (components.category_id FK)
2. Update API responses to include category translations
3. Remove `normalizeCategory()` from parser.ts
4. Add i18n composables to frontend
5. Update component display to use translated categories

**Rollback Plan:** Keep Portuguese category mapping in a separate migration file; if needed, can revert by re-adding the text column and re-populating.

## API Changes

**GET /api/components**

```json
{
  "id": 1,
  "categoryId": 3,
  "categoryEnglish": "Wheel",
  "categoryTranslated": "Roda",
  "model": "VZAN STRIKE PRO 32F",
  ...
}
```

**POST /api/components (admin)**

```json
{
  "categoryId": 3,
  "model": "New Model",
  "brand": "Zipp",
  ...
}
```

Audit log entry created automatically with changed_by, changed_at (ISO8601 tz), new_values.

## Frontend Changes

**Nuxt i18n Setup**

- Use `@nuxtjs/i18n` or custom composable
- Category translations fetched from DB on app init
- Runtime switching: `$i18n.locale = 'pt-BR'`

**Component Display**

```vue
<script setup>
const category = useCategory("Wheel"); // Returns pt-BR: "Roda"
</script>

<template>
  <span>{{ category }}</span>
</template>
```

## Success Criteria

1. All 450+ existing components display correctly with English categories
2. Portuguese translations appear in UI without page refresh
3. Audit logs show all brand/component CRUD operations
4. DeepL integration works for new language additions
5. Zero breaking changes to public APIs (category data is new field, backward compatible)
6. All tests pass (no new test logic needed; existing tests updated for category_id FK)

## Out of Scope

- Translating component `model` names (stay in original language/brand)
- Translating brand names
- Component `line` field (stays as-is)
- Existing Portuguese data kept for reference (can be archived later)

## Timeline Estimate

- Database migration: 2 hours
- API + backend: 4 hours
- Frontend i18n: 3 hours
- Testing + QA: 2 hours
- **Total: ~11 hours**
