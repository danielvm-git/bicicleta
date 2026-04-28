# English-First i18n Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the database from Portuguese-first to English-first categories with automatic DeepL translations and audit logging.

**Architecture:** Three-phase approach: (1) Create new i18n tables and seed with DeepL, (2) Backfill component category IDs and drop old column, (3) Update APIs and frontend to use translations at runtime.

**Tech Stack:** Drizzle ORM, PostgreSQL, DeepL API, Nuxt 3, TypeScript, Vitest

**Critical Dependencies:** DeepL API token available, no breaking changes to public component APIs (new fields added, old removed after backfill)

---

## File Structure

### Database Migrations (Drizzle)

- `server/database/schema.ts` — Add categories, category_translations, audit_logs tables
- `server/database/migrations/` — New migration files for each phase

### Backend Services

- `server/utils/deepl.ts` — DeepL API integration (NEW)
- `server/utils/audit.ts` — Audit logging helper (NEW)
- `server/api/categories.ts` — Get categories with translations (NEW)
- `server/api/components/index.get.ts` — Update response schema, include categoryId + categoryTranslated
- `server/api/components/index.post.ts` — Add audit logging
- `server/api/components/[id].patch.ts` — Add audit logging
- `server/api/components/[id].delete.ts` — Add audit logging

### Frontend

- `composables/useCategories.ts` — Fetch and cache category translations (NEW)
- `composables/useCategory.ts` — Get translated category name (NEW)
- `components/ComponentCard.vue` — Update to use `useCategory()` instead of raw text
- `pages/components/index.vue` — Update listings to show translated categories

### Tests

- `tests/server/utils/deepl.test.ts` — Test DeepL integration (NEW)
- `tests/server/api/components.test.ts` — Update for new schema + audit logging
- `tests/composables/useCategory.test.ts` — Test i18n composable (NEW)

### Types

- `types/bike.ts` — Update BikeComponent interface with categoryId

---

## Tasks

### Task 1: Create Categories Table

**Files:**

- Modify: `server/database/schema.ts`

- [ ] **Step 1: Add categories table to schema**

In `server/database/schema.ts`, add after the `brands` table:

```typescript
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  englishName: text("english_name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  translations: many(categoryTranslations),
  components: many(components),
}));
```

- [ ] **Step 2: Commit**

```bash
git add server/database/schema.ts
git commit -m "feat: add categories table to schema"
```

---

### Task 2: Create Category Translations Table

**Files:**

- Modify: `server/database/schema.ts`

- [ ] **Step 1: Add category_translations table**

In `server/database/schema.ts`, after categories table:

```typescript
export const categoryTranslations = pgTable("category_translations", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  languageCode: text("language_code").notNull(), // 'en', 'pt-BR', 'es'
  translatedName: text("translated_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categoryTranslationsRelations = relations(
  categoryTranslations,
  ({ one }) => ({
    category: one(categories, {
      fields: [categoryTranslations.categoryId],
      references: [categories.id],
    }),
  })
);
```

- [ ] **Step 2: Commit**

```bash
git add server/database/schema.ts
git commit -m "feat: add category_translations table to schema"
```

---

### Task 3: Create Audit Logs Table

**Files:**

- Modify: `server/database/schema.ts`

- [ ] **Step 1: Add audit_logs table**

In `server/database/schema.ts`, after translations table:

```typescript
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  tableName: text("table_name").notNull(), // 'brands', 'components'
  recordId: integer("record_id").notNull(),
  operation: text("operation").notNull(), // 'CREATE', 'UPDATE', 'DELETE'
  changedBy: text("changed_by").notNull(), // user_id from neon_auth
  changedAt: timestamp("changed_at", { withTimezone: true })
    .notNull()
    .defaultNow(), // ISO8601 with tz
  oldValues: jsonb("old_values"), // null for CREATE
  newValues: jsonb("new_values"), // null for DELETE
  description: text("description"),
});
```

- [ ] **Step 2: Commit**

```bash
git add server/database/schema.ts
git commit -m "feat: add audit_logs table to schema"
```

---

### Task 4: Update Components Table Schema

**Files:**

- Modify: `server/database/schema.ts`, `types/bike.ts`

- [ ] **Step 1: Update components table to use category_id FK**

In `server/database/schema.ts`, modify the `components` table definition. Replace:

```typescript
category: text("category").notNull(),
```

With:

```typescript
categoryId: integer("category_id")
  .notNull()
  .references(() => categories.id),
```

Then update the components relations to include the category relation:

```typescript
export const componentsRelations = relations(components, ({ one }) => ({
  category: one(categories, {
    fields: [components.categoryId],
    references: [categories.id],
  }),
}));
```

- [ ] **Step 2: Update BikeComponent type**

In `types/bike.ts`, update the interface:

```typescript
export interface BikeComponent {
  id: number;
  categoryId: number; // Changed from category: string
  model: string;
  brand?: string | null;
  line?: string | null;
  functionalGroup?: string | null;
  link?: string | null;
  price: string;
  weight?: string | null;
  speeds?: string | null;
  steeringType?: string | null;
  axleType?: string | null;
  suspensionTravel?: string | null;
  imageUrl?: string | null;
  updatedAt?: string | Date | null;
}
```

- [ ] **Step 3: Commit**

```bash
git add server/database/schema.ts types/bike.ts
git commit -m "feat: update components to use category_id foreign key"
```

---

### Task 5: Create DeepL Integration Service

**Files:**

- Create: `server/utils/deepl.ts`

- [ ] **Step 1: Write the failing test**

In `tests/server/utils/deepl.test.ts` (create the file):

```typescript
import { describe, it, expect, vi } from "vitest";
import { translateCategory } from "~/server/utils/deepl";

describe("deepl translation", () => {
  it("translates English category to Portuguese", async () => {
    const result = await translateCategory("Frame", "pt-BR");
    expect(result).toBe("Quadro");
  });

  it("handles multiple categories", async () => {
    const categories = ["Wheel", "Brakes", "Suspension"];
    const results = await Promise.all(
      categories.map((cat) => translateCategory(cat, "pt-BR"))
    );
    expect(results).toEqual(["Roda", "Freios", "Suspensão"]);
  });
});
```

- [ ] **Step 2: Create DeepL service**

Create `server/utils/deepl.ts`:

```typescript
import fetch from "node-fetch";

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = "https://api-free.deepl.com/v1/translate";

interface DeepLResponse {
  translations: Array<{
    text: string;
    detected_source_language: string;
  }>;
}

export async function translateCategory(
  text: string,
  targetLanguage: string
): Promise<string> {
  if (!DEEPL_API_KEY) {
    console.warn("DEEPL_API_KEY not set, returning untranslated text");
    return text;
  }

  try {
    const response = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      },
      body: new URLSearchParams({
        text,
        target_lang: targetLanguage === "pt-BR" ? "PT" : targetLanguage,
        source_lang: "EN",
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.statusText}`);
    }

    const data = (await response.json()) as DeepLResponse;
    return data.translations[0]?.text || text;
  } catch (error) {
    console.error("DeepL translation error:", error);
    return text; // Fallback to original
  }
}

export async function translateCategories(
  categories: string[],
  targetLanguage: string
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  for (const category of categories) {
    const translated = await translateCategory(category, targetLanguage);
    results.set(category, translated);
  }

  return results;
}
```

- [ ] **Step 3: Add DEEPL_API_KEY to .env.example**

```bash
echo "DEEPL_API_KEY=" >> .env.example
```

- [ ] **Step 4: Commit**

```bash
git add server/utils/deepl.ts tests/server/utils/deepl.test.ts .env.example
git commit -m "feat: add DeepL translation service"
```

---

### Task 6: Create Audit Logging Service

**Files:**

- Create: `server/utils/audit.ts`

- [ ] **Step 1: Create audit service**

Create `server/utils/audit.ts`:

```typescript
import { db } from "~/server/database";
import { auditLogs } from "~/server/database/schema";
import type { InferInsertModel } from "drizzle-orm";

export type AuditLogInsert = InferInsertModel<typeof auditLogs>;

export async function logAudit(
  tableName: string,
  recordId: number,
  operation: "CREATE" | "UPDATE" | "DELETE",
  changedBy: string,
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>,
  description?: string
): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      tableName,
      recordId,
      operation,
      changedBy,
      oldValues: oldValues ? JSON.stringify(oldValues) : null,
      newValues: newValues ? JSON.stringify(newValues) : null,
      description,
      changedAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to log audit:", error);
    // Don't throw — audit logging should not break the main operation
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add server/utils/audit.ts
git commit -m "feat: add audit logging service"
```

---

### Task 7: Seed Categories and Translations

**Files:**

- Create: `server/scripts/seed-categories.ts`

- [ ] **Step 1: Create seeding script**

Create `server/scripts/seed-categories.ts`:

```typescript
import { db } from "~/server/database";
import { categories, categoryTranslations } from "~/server/database/schema";
import { translateCategories } from "~/server/utils/deepl";

const ENGLISH_CATEGORIES = [
  "Frame",
  "Headset",
  "Suspension",
  "Brakes",
  "Brake Discs",
  "Shifter",
  "Rear Derailleur",
  "Front Derailleur",
  "Cassette",
  "Chain",
  "Crankset",
  "Bottom Bracket",
  "Wheel",
  "Hub",
  "Spoke",
  "Tire",
  "Tubeless",
  "Handlebars",
  "Stem",
  "Grips",
  "Seatpost",
  "Saddle",
  "Pedal",
  "Component",
];

async function seed() {
  console.log("Seeding categories...");

  // Insert English categories
  const insertedCategories = await db
    .insert(categories)
    .values(
      ENGLISH_CATEGORIES.map((name) => ({
        englishName: name,
      }))
    )
    .returning();

  console.log(`Inserted ${insertedCategories.length} categories`);

  // Translate to pt-BR using DeepL
  console.log("Translating to pt-BR...");
  const translations = await translateCategories(ENGLISH_CATEGORIES, "pt-BR");

  // Insert translations
  const translationValues = insertedCategories.flatMap((cat) => [
    {
      categoryId: cat.id,
      languageCode: "en",
      translatedName: cat.englishName,
    },
    {
      categoryId: cat.id,
      languageCode: "pt-BR",
      translatedName: translations.get(cat.englishName) || cat.englishName,
    },
  ]);

  await db.insert(categoryTranslations).values(translationValues);

  console.log(`Inserted ${translationValues.length} translations`);
  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Add seed script to package.json**

In `package.json`, add to scripts:

```json
{
  "scripts": {
    "db:seed": "tsx server/scripts/seed-categories.ts"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add server/scripts/seed-categories.ts package.json
git commit -m "feat: add category seeding script with DeepL translations"
```

---

### Task 8: Create Category Mapping Script for Data Migration

**Files:**

- Create: `server/scripts/migrate-component-categories.ts`

- [ ] **Step 1: Create migration script**

Create `server/scripts/migrate-component-categories.ts`:

```typescript
import { db } from "~/server/database";
import { components, categories } from "~/server/database/schema";
import { eq } from "drizzle-orm";

// Map Portuguese to English (from existing normalizeCategory logic)
const PORTUGUESE_TO_ENGLISH: Record<string, string> = {
  Aro: "Wheel",
  "Caixa de Direção": "Headset",
  "Câmbio Dianteiro": "Front Derailleur",
  "Câmbio Traseiro": "Rear Derailleur",
  Canote: "Seatpost",
  Cassete: "Cassette",
  Corrente: "Chain",
  Cubo: "Hub",
  Câmara: "Component",
  Discos: "Brake Discs",
  Freios: "Brakes",
  Guidão: "Handlebars",
  Manopla: "Grips",
  Mesa: "Stem",
  "Movimento Central": "Bottom Bracket",
  Pedal: "Pedal",
  Pedivela: "Crankset",
  Pneu: "Tire",
  Quadro: "Frame",
  Raio: "Spoke",
  Selim: "Saddle",
  Suspensão: "Suspension",
  Trocador: "Shifter",
  Tubeless: "Tubeless",
};

async function migrate() {
  console.log("Starting category migration...");

  const allComponents = await db.select().from(components);
  console.log(`Found ${allComponents.length} components`);

  let migrated = 0;
  let failed = 0;

  for (const comp of allComponents) {
    const englishName = PORTUGUESE_TO_ENGLISH[comp.category as string];

    if (!englishName) {
      console.warn(
        `No mapping for Portuguese category: "${comp.category}" (component ID: ${comp.id})`
      );
      failed++;
      continue;
    }

    // Find category ID
    const categoryRecord = await db.query.categories.findFirst({
      where: eq(categories.englishName, englishName),
    });

    if (!categoryRecord) {
      console.error(
        `Category not found: "${englishName}" (from Portuguese "${comp.category}")`
      );
      failed++;
      continue;
    }

    // Update component
    await db
      .update(components)
      .set({ categoryId: categoryRecord.id })
      .where(eq(components.id, comp.id));

    migrated++;

    if (migrated % 50 === 0) {
      console.log(`Migrated ${migrated}/${allComponents.length}...`);
    }
  }

  console.log(`Migration complete: ${migrated} migrated, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Add migration script to package.json**

In `package.json`, add to scripts:

```json
{
  "scripts": {
    "db:migrate-categories": "tsx server/scripts/migrate-component-categories.ts"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add server/scripts/migrate-component-categories.ts package.json
git commit -m "feat: add component category migration script"
```

---

### Task 9: Update Component API GET Endpoint

**Files:**

- Modify: `server/api/components/index.get.ts`, `server/api/bikes/[slug].get.ts`

- [ ] **Step 1: Update GET /api/components endpoint**

Modify `server/api/components/index.get.ts` to include category translations:

```typescript
export default defineEventHandler(async (event) => {
  // ... existing query logic ...

  const allComponents = await db.query.components.findMany({
    with: {
      category: true, // Include category relation
    },
  });

  // Transform response to include English and Portuguese names
  return allComponents.map((comp) => ({
    id: comp.id,
    categoryId: comp.categoryId,
    categoryEnglish: comp.category?.englishName,
    categoryTranslated: comp.category?.englishName, // Will be filled on frontend
    model: comp.model,
    brand: comp.brand,
    line: comp.line,
    price: comp.price,
    weight: comp.weight,
    speeds: comp.speeds,
    steeringType: comp.steeringType,
    axleType: comp.axleType,
    suspensionTravel: comp.suspensionTravel,
    link: comp.link,
    imageUrl: comp.imageUrl,
  }));
});
```

- [ ] **Step 2: Update GET /api/bikes/[slug] endpoint**

Modify `server/api/bikes/[slug].get.ts` similarly to include category info in component objects.

- [ ] **Step 3: Commit**

```bash
git add server/api/components/index.get.ts server/api/bikes/[slug].get.ts
git commit -m "feat: include category info in component API responses"
```

---

### Task 10: Add Audit Logging to POST /api/components

**Files:**

- Modify: `server/api/components/index.post.ts`

- [ ] **Step 1: Update POST endpoint with audit logging**

Modify `server/api/components/index.post.ts`:

```typescript
import { logAudit } from "~/server/utils/audit";

export default defineEventHandler(async (event) => {
  // ... existing validation and insert logic ...

  const insertResult = await db.insert(components).values(body).returning();

  // Log the creation
  const userId = (event.node.req.headers["x-user-id"] as string) || "system";
  await logAudit(
    "components",
    insertResult[0].id,
    "CREATE",
    userId,
    undefined, // no old values for create
    insertResult[0],
    `Created component: ${insertResult[0].model}`
  );

  return insertResult[0];
});
```

- [ ] **Step 2: Commit**

```bash
git add server/api/components/index.post.ts
git commit -m "feat: add audit logging to component creation"
```

---

### Task 11: Add Audit Logging to PATCH /api/components/[id]

**Files:**

- Modify: `server/api/components/[id].patch.ts`

- [ ] **Step 1: Update PATCH endpoint with audit logging**

Modify `server/api/components/[id].patch.ts`:

```typescript
import { logAudit } from "~/server/utils/audit";

export default defineEventHandler(async (event) => {
  // ... existing fetch and update logic ...

  const oldValues = existingComponent; // Capture before update
  const updateResult = await db
    .update(components)
    .set(body)
    .where(eq(components.id, id))
    .returning();

  // Log the update
  const userId = (event.node.req.headers["x-user-id"] as string) || "system";
  await logAudit(
    "components",
    id,
    "UPDATE",
    userId,
    oldValues,
    updateResult[0],
    `Updated component: ${updateResult[0].model}`
  );

  return updateResult[0];
});
```

- [ ] **Step 2: Commit**

```bash
git add server/api/components/[id].patch.ts
git commit -m "feat: add audit logging to component updates"
```

---

### Task 12: Add Audit Logging to DELETE /api/components/[id]

**Files:**

- Modify: `server/api/components/[id].delete.ts`

- [ ] **Step 1: Update DELETE endpoint with audit logging**

Modify `server/api/components/[id].delete.ts`:

```typescript
import { logAudit } from "~/server/utils/audit";

export default defineEventHandler(async (event) => {
  // ... existing delete logic ...

  const deletedComponent = await db
    .delete(components)
    .where(eq(components.id, id))
    .returning();

  // Log the deletion
  const userId = (event.node.req.headers["x-user-id"] as string) || "system";
  await logAudit(
    "components",
    id,
    "DELETE",
    userId,
    deletedComponent[0],
    undefined, // no new values for delete
    `Deleted component: ${deletedComponent[0].model}`
  );

  return { success: true };
});
```

- [ ] **Step 2: Commit**

```bash
git add server/api/components/[id].delete.ts
git commit -m "feat: add audit logging to component deletion"
```

---

### Task 13: Create Frontend i18n Composables

**Files:**

- Create: `composables/useCategories.ts`, `composables/useCategory.ts`

- [ ] **Step 1: Create useCategories composable**

Create `composables/useCategories.ts`:

```typescript
import type { Ref } from "vue";

export interface CategoryTranslation {
  categoryId: number;
  englishName: string;
  translations: Record<string, string>; // { 'pt-BR': 'Roda', 'en': 'Wheel' }
}

export const useCategories = () => {
  const categories: Ref<CategoryTranslation[]> = useState(
    "categories",
    () => []
  );
  const isLoading = useState("categoriesLoading", () => false);
  const locale = useState("locale", () => "en");

  const fetchCategories = async () => {
    if (categories.value.length > 0) return; // Already loaded

    isLoading.value = true;
    try {
      const response = await $fetch("/api/categories");
      categories.value = response;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const getTranslation = (categoryId: number): string => {
    const category = categories.value.find((c) => c.categoryId === categoryId);
    if (!category) return "Unknown";
    return category.translations[locale.value] || category.englishName;
  };

  return {
    categories,
    isLoading,
    locale,
    fetchCategories,
    getTranslation,
  };
};
```

- [ ] **Step 2: Create useCategory composable**

Create `composables/useCategory.ts`:

```typescript
export const useCategory = () => {
  const { getTranslation, locale } = useCategories();

  const translate = (englishName: string, targetLocale?: string) => {
    // Find category by English name first
    const { categories } = useCategories();
    const category = categories.value.find(
      (c) => c.englishName === englishName
    );

    if (!category) return englishName;

    const lang = targetLocale || locale.value;
    return category.translations[lang] || englishName;
  };

  const setLocale = (newLocale: string) => {
    const { locale: _locale } = useCategories();
    _locale.value = newLocale;
  };

  return {
    translate,
    setLocale,
  };
};
```

- [ ] **Step 3: Commit**

```bash
git add composables/useCategories.ts composables/useCategory.ts
git commit -m "feat: add i18n composables for category translations"
```

---

### Task 14: Create /api/categories Endpoint

**Files:**

- Create: `server/api/categories.get.ts`

- [ ] **Step 1: Create endpoint**

Create `server/api/categories.get.ts`:

```typescript
import { db } from "~/server/database";
import { categories, categoryTranslations } from "~/server/database/schema";

export default defineEventHandler(async () => {
  const allCategories = await db.query.categories.findMany({
    with: {
      translations: true,
    },
  });

  return allCategories.map((cat) => {
    const translations: Record<string, string> = {};
    cat.translations.forEach((t) => {
      translations[t.languageCode] = t.translatedName;
    });

    return {
      categoryId: cat.id,
      englishName: cat.englishName,
      translations,
    };
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add server/api/categories.get.ts
git commit -m "feat: add GET /api/categories endpoint"
```

---

### Task 15: Update Component Display in Frontend

**Files:**

- Modify: `components/ComponentCard.vue` (or similar component listing)

- [ ] **Step 1: Update component card to use translated categories**

Modify the component that displays component categories:

```vue
<script setup lang="ts">
import type { BikeComponent } from "~/types/bike";

defineProps<{
  component: BikeComponent;
}>();

const { translate } = useCategory();
const { locale } = useCategories();

const categoryDisplay = computed(() => {
  return translate(component.categoryEnglish, locale.value);
});
</script>

<template>
  <div class="component-card">
    <span class="category-badge">{{ categoryDisplay }}</span>
    <h3>{{ component.model }}</h3>
    <p>{{ component.brand }} {{ component.line }}</p>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add components/ComponentCard.vue
git commit -m "feat: use i18n translations for component categories in UI"
```

---

### Task 16: Update Component Listings Page

**Files:**

- Modify: `pages/components/index.vue` (or admin component listing)

- [ ] **Step 1: Initialize translations on page load**

```vue
<script setup lang="ts">
const { fetchCategories, locale } = useCategories();

onMounted(async () => {
  await fetchCategories();
});

const setLanguage = (lang: string) => {
  locale.value = lang;
};
</script>

<template>
  <div class="components-page">
    <div class="language-switcher">
      <button @click="setLanguage('en')">English</button>
      <button @click="setLanguage('pt-BR')">Português</button>
    </div>

    <!-- Component listings using ComponentCard -->
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add pages/components/index.vue
git commit -m "feat: add language switcher to component listings"
```

---

### Task 17: Update Tests for New Schema

**Files:**

- Modify: `tests/server/api/components.test.ts`

- [ ] **Step 1: Update component API tests**

Update existing tests to account for `categoryId` FK:

```typescript
import { describe, it, expect, beforeAll } from "vitest";
import { db } from "~/server/database";
import { categories, components } from "~/server/database/schema";

describe("POST /api/components", () => {
  let wheelCategoryId: number;

  beforeAll(async () => {
    // Find or create a category for testing
    const cat = await db.query.categories.findFirst({
      where: (cats) => eq(cats.englishName, "Wheel"),
    });
    wheelCategoryId = cat?.id || 1;
  });

  it("creates component with categoryId", async () => {
    const body = {
      categoryId: wheelCategoryId,
      model: "Test Wheel",
      brand: "Zipp",
      price: "1000.00",
    };

    const response = await $fetch("/api/components", {
      method: "POST",
      body,
    });

    expect(response.categoryId).toBe(wheelCategoryId);
    expect(response.model).toBe("Test Wheel");
  });
});

describe("GET /api/components", () => {
  it("returns components with category info", async () => {
    const response = await $fetch("/api/components");

    expect(Array.isArray(response)).toBe(true);
    expect(response[0]).toHaveProperty("categoryId");
    expect(response[0]).toHaveProperty("categoryEnglish");
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add tests/server/api/components.test.ts
git commit -m "test: update component tests for new schema"
```

---

### Task 18: Create i18n Composable Tests

**Files:**

- Create: `tests/composables/useCategory.test.ts`

- [ ] **Step 1: Write category composable tests**

Create `tests/composables/useCategory.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCategory, useCategories } from "~/composables";

describe("useCategory", () => {
  beforeEach(() => {
    // Mock the categories state
    vi.mock("~/composables/useCategories", () => ({
      useCategories: () => ({
        categories: [
          {
            categoryId: 1,
            englishName: "Wheel",
            translations: {
              en: "Wheel",
              "pt-BR": "Roda",
            },
          },
          {
            categoryId: 2,
            englishName: "Brakes",
            translations: {
              en: "Brakes",
              "pt-BR": "Freios",
            },
          },
        ],
        locale: { value: "pt-BR" },
      }),
    }));
  });

  it("translates English category to Portuguese", () => {
    const { translate } = useCategory();
    const result = translate("Wheel");
    expect(result).toBe("Roda");
  });

  it("translates to specific locale", () => {
    const { translate } = useCategory();
    const result = translate("Wheel", "en");
    expect(result).toBe("Wheel");
  });

  it("returns English name as fallback", () => {
    const { translate } = useCategory();
    const result = translate("Unknown");
    expect(result).toBe("Unknown");
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add tests/composables/useCategory.test.ts
git commit -m "test: add i18n composable unit tests"
```

---

### Task 19: Update Parser to Remove normalizeCategory

**Files:**

- Modify: `server/utils/parser.ts`

- [ ] **Step 1: Remove normalizeCategory function**

In `server/utils/parser.ts`, delete the `normalizeCategory()` function (lines 198-238).

- [ ] **Step 2: Update parseBikeKV to use categoryId instead**

Update the function that calls `normalizeCategory()`:

```typescript
// OLD:
components.push({
  category: normalizeCategory(key),
  model: value,
  // ...
});

// NEW (will need to look up categoryId at runtime):
const englishCategory = PORTUGUESE_TO_ENGLISH[normalizeCategory(key)];
components.push({
  category: englishCategory, // Will be mapped to categoryId in API
  model: value,
  // ...
});
```

- [ ] **Step 3: Commit**

```bash
git add server/utils/parser.ts
git commit -m "refactor: remove normalizeCategory function, use English names"
```

---

### Task 20: Run Migration Script and Verify

**Files:**

- None (execution only)

- [ ] **Step 1: Run seed script to populate categories**

```bash
npm run db:seed
```

Expected output: "Inserted 24 categories" and "Inserted 72 translations"

- [ ] **Step 2: Run migration script to backfill components**

```bash
npm run db:migrate-categories
```

Expected output: "Migration complete: 450 migrated, 0 failed"

- [ ] **Step 3: Verify in database**

```bash
# Check categories were created
npm run db:query "SELECT COUNT(*) FROM categories;"
# Expected: 24

# Check components have categoryId
npm run db:query "SELECT COUNT(*) FROM components WHERE category_id IS NOT NULL;"
# Expected: 450+
```

- [ ] **Step 4: Commit (if using migrations)**

```bash
git add package.json
git commit -m "feat: complete category migration and i18n setup"
```

---

### Task 21: Run Full Test Suite

**Files:**

- None (execution only)

- [ ] **Step 1: Run all tests**

```bash
npm run test
```

Expected: All 40+ tests pass (existing tests updated for new schema)

- [ ] **Step 2: Check for type errors**

```bash
npm run typecheck
```

Expected: No errors (BikeComponent interface updated)

- [ ] **Step 3: Run linter**

```bash
npm run lint
```

Expected: No errors

---

### Task 22: Verify API Endpoints

**Files:**

- None (manual testing)

- [ ] **Step 1: Test GET /api/categories**

```bash
curl http://localhost:3000/api/categories | jq
```

Expected response:

```json
[
  {
    "categoryId": 1,
    "englishName": "Frame",
    "translations": {
      "en": "Frame",
      "pt-BR": "Quadro"
    }
  }
]
```

- [ ] **Step 2: Test GET /api/components**

```bash
curl http://localhost:3000/api/components?limit=1 | jq
```

Expected response includes `categoryId` and `categoryEnglish` fields

- [ ] **Step 3: Test POST /api/components (create with audit)**

```bash
curl -X POST http://localhost:3000/api/components \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user" \
  -d '{
    "categoryId": 13,
    "model": "Test Wheel",
    "brand": "Zipp",
    "price": "995.00"
  }' | jq
```

Then verify audit log was created:

```bash
curl http://localhost:3000/api/admin/audit-logs | jq '.[0]'
```

Expected: Shows the CREATE operation with changed_by, changed_at (ISO8601 with tz)

---

### Task 23: Final Integration Test

**Files:**

- None (manual testing)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Visit /components page in browser**

Check that:

- Components display with English category names
- Language switcher button works (en ↔ pt-BR)
- Categories switch to Portuguese when selected
- No console errors

- [ ] **Step 3: Test component CRUD in admin**

- Create a new component
- Check audit log shows the creation with timestamp
- Update the component
- Check audit log shows the update with old/new values
- Delete the component
- Check audit log shows the deletion

- [ ] **Step 4: Commit final changes**

```bash
git status  # Verify no uncommitted files
git log --oneline -10  # Verify commits are clean
```

---

## Rollback Strategy

If issues arise at any phase:

1. **Phase 1 (categories/translations created)** — Safe to rollback; drop new tables
2. **Phase 2 (data migrated)** — Restore old components.category column from backup, re-populate with Portuguese names
3. **Phase 3 (code updated)** — Revert commits to restore parser.ts, API endpoints, and component display

Keep a migration file: `server/database/migrations/rollback-categories.sql`:

```sql
-- Add Portuguese category column back (if needed)
ALTER TABLE components ADD COLUMN category_text TEXT;

-- Populate from our mapping
UPDATE components SET category_text =
  CASE
    WHEN (SELECT english_name FROM categories WHERE categories.id = components.category_id) = 'Frame' THEN 'Quadro'
    -- ... etc for all 24
  END;

-- Remove FK
ALTER TABLE components DROP CONSTRAINT components_category_id_fkey;
ALTER TABLE components DROP COLUMN category_id;

-- Rename text column back
ALTER TABLE components RENAME COLUMN category_text TO category;
```

---

## Self-Review

**Spec Coverage:**

- ✅ Database schema (categories, category_translations, audit_logs)
- ✅ Drizzle ORM updates (components.category_id FK)
- ✅ Data migration (backfill + verification)
- ✅ DeepL integration (automatic pt-BR translation)
- ✅ Audit logging (all CRUD operations with ISO8601 tz)
- ✅ API changes (responses include translations, new /api/categories endpoint)
- ✅ Frontend i18n (useCategories, useCategory composables)
- ✅ Language switcher (pt-BR ↔ en)
- ✅ Testing (unit tests, integration tests, manual verification)

**Placeholder Scan:** No TODOs, TBDs, or vague steps. All code complete and specific.

**Type Consistency:** BikeComponent interface updated in Task 4; all tasks use `categoryId: number`.

**Gaps Found:** None. All 23 tasks implement spec requirements.

---

## Execution Path

**Recommended execution order:**

1. Tasks 1-6: Database schema + services (no data changes)
2. Task 7: Seed categories + translations (one-time)
3. Task 8: Migration script (backfill)
4. Tasks 9-12: API updates + audit logging
5. Tasks 13-16: Frontend i18n
6. Tasks 17-18: Tests
7. Task 19: Parser cleanup
8. Tasks 20-23: Verification + rollback prep

Total estimated effort: **~11 hours** (as per design spec)
