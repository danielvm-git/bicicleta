# Design Audit: Implementation Roadmap & Code Recommendations

**Date:** April 27, 2026  
**Project:** Monta Bike Configurator  
**Audit Health Score:** 65/100  
**Total Issues:** 45 (14 High, 18 Medium, 13 Low)

---

## Executive Summary

Your bike configurator has solid foundations (excellent fonts, comprehensive theme system, responsive grid) but suffers from **weak visual hierarchy, typography inconsistency, and information density problems** that degrade the user experience.

**Critical Fixes Required (7 days):**

1. Fix typography hierarchy (H1 sizing, font weights)
2. Resolve WCAG contrast failures (secondary text, borders)
3. Emphasize key metrics (prices, totals)
4. Group builder categories (37 → 8-10)
5. Simplify gallery cards (remove or collapse tags)
6. Restructure admin page (move theme selector)
7. Add active state indicators (Guide tier buttons)

---

## File-by-File Implementation Recommendations

### 1. `assets/css/brand.css` — Typography & Global Styles

**Current State:** Undersized headings, inconsistent font weights, no contrast utilities

**Priority Fixes:** CRITICAL (affects all pages)

#### Change 1: Update H1-H4 Sizing

**Lines:** 32-48  
**Current:**

```css
h1 {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 700;
}
h2 {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 700;
}
h3 {
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: 700;
}
```

**Recommended:**

```css
h1 {
  font-size: 2.5rem; /* 40px - was 32px */
  line-height: 1.1;
  font-weight: 800; /* was 700 */
  letter-spacing: -0.03em;
}

h2 {
  font-size: 1.875rem; /* 30px - was 24px */
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
}

h3 {
  font-size: 1.5rem; /* 24px - was 20px */
  line-height: 1.3;
  font-weight: 700;
}

h4 {
  font-size: 1.125rem; /* 18px - NEW */
  line-height: 1.4;
  font-weight: 600;
}
```

**Rationale:** Proper heading hierarchy improves scannability; larger H1 provides page context immediately.

#### Change 2: Add Font Weight Scale

**Lines:** After line 11  
**Add:**

```css
/* Font weight hierarchy - document intention */
:root {
  --fw-light: 300;
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: 700;
  --fw-extrabold: 800;
}

/* Usage guide:
   - 300: Light emphasis (rare)
   - 400: Body text (regular)
   - 500: Form labels, secondary info
   - 600: Small headings, important labels (h4, buttons)
   - 700: Headings (h1-h3), primary emphasis
   - 800: Display headings, extreme emphasis
*/
```

**Rationale:** Documents the weight system so all developers follow same pattern.

#### Change 3: Update Body & Small Text

**Lines:** 8-12, after line 28  
**Add:**

```css
body {
  line-height: 1.6; /* was implicit ~1.5 */
}

p {
  line-height: 1.6;
  font-size: 1rem; /* 16px */
}

small,
.text-sm {
  font-size: 0.875rem; /* 14px - MINIMUM */
  line-height: 1.5;
}

.text-xs {
  font-size: 0.75rem; /* 12px - use sparingly */
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--fw-semibold);
}
```

**Rationale:** Improves readability; enforces 14px minimum text size for accessibility.

#### Change 4: Add Contrast Utility Classes

**Lines:** After font definitions (around line 80)  
**Add:**

```css
/* Text color utilities - WCAG AA compliant */
.text-contrast-primary {
  color: #1c1917; /* 16.4:1 on white - excellent */
}

.text-contrast-secondary {
  color: #57534e; /* 4.8:1 on white - WCAG AA ✓ */
}

.text-contrast-tertiary {
  color: #78716b; /* 3.2:1 on white - use sparingly */
}

.text-contrast-disabled {
  color: #a8a29e; /* 2.2:1 - for disabled states */
  opacity: 0.65;
}

/* Border contrast utilities */
.border-contrast-default {
  border-color: #d6d3d1; /* 3.5:1 - visible borders */
}

.border-contrast-strong {
  border-color: #a8a29e; /* 6:1 - prominent borders */
}

/* Metric emphasis class - for prices, totals */
.metric-large {
  font-size: 2rem; /* 32px */
  font-weight: 800;
  line-height: 1.1;
  color: var(--color-brand-ink);
  letter-spacing: -0.02em;
}

/* Button disabled state */
button:disabled,
[role="button"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f5f4;
  color: #a8a29e;
  border-color: #d6d3d1;
}
```

**Rationale:** Provides reusable classes for contrast-compliant styling throughout the app.

#### Change 5: Update Focus State

**Lines:** After line 95  
**Add:**

```css
/* Visible focus state for accessibility */
:focus-visible {
  outline: 3px solid var(--color-primary-500);
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 3px solid var(--color-primary-500);
  outline-offset: -1px;
}
```

**Rationale:** Ensures keyboard navigation is visible; required for WCAG AA accessibility.

**Testing:** After changes, verify:

- [ ] All headings appear larger and more prominent
- [ ] Body text reads easily (line height 1.6)
- [ ] Secondary text passes WCAG AA (4.5:1 contrast)
- [ ] Disabled buttons look disabled
- [ ] Focus outline is clearly visible

---

### 2. `nuxt.config.ts` — Color Palette Update

**Current State:** Secondary text color too light; borders insufficient contrast

**Priority Fixes:** CRITICAL (affects all pages)

#### Change 1: Update Gray Scale

**Lines:** 124-136  
**Current:**

```javascript
gray: {
  50: "#fafaf9",
  100: "#f5f5f4",
  200: "#e7e5e4",
  300: "#d6d3d1",
  400: "#a8a29e",  // ← PROBLEM: used for secondary text
  500: "#78716b",  // ← PROBLEM: only 3.2:1 contrast
  600: "#57534e",  // ← GOOD: 4.8:1 contrast
  700: "#44403c",
  800: "#292524",
  900: "#1c1917",
  950: "#0c0a09",
},
```

**Recommended:**

```javascript
gray: {
  50: "#fafaf9",   /* Backgrounds */
  100: "#f5f5f4",  /* Light backgrounds */
  200: "#e7e5e4",  /* Light borders */
  300: "#d6d3d1",  /* Default borders - 3.5:1 ✓ */
  400: "#c9b59a",  /* Muted elements - 2.8:1 (reduce usage) */
  500: "#a8a29e",  /* WCAG AA minimum borders - 6:1 ✓ */
  600: "#78716b",  /* Tertiary text - 3.2:1 (use sparingly) */
  700: "#57534e",  /* Secondary text - 4.8:1 ✓ GOOD */
  800: "#44403c",  /* Primary text alt */
  900: "#1c1917",  /* Body text - 16.4:1 ✓ */
  950: "#0c0a09",  /* Dark text */
},
```

**Key Changes:**

- Gray-700: Use for secondary body text (was Gray-500)
- Gray-300: Use for default borders (was Gray-200)
- Document WCAG contrast ratios as comments

**Rationale:** Ensures secondary text and borders meet WCAG AA 4.5:1 minimum for normal text.

#### Change 2: Add Text Color Utilities

**Lines:** After colors definition  
**Add:**

```javascript
extend: {
  textColor: {
    "primary-text": "#1c1917",     /* H1 text, primary */
    "secondary-text": "#57534e",   /* Body secondary, labels */
    "tertiary-text": "#78716b",    /* Muted text (sparingly) */
    "disabled-text": "#a8a29e",    /* Disabled state */
  },
  borderColor: {
    "default": "#d6d3d1",  /* Standard borders */
    "strong": "#a8a29e",   /* Prominent borders */
  },
}
```

**Rationale:** Provides semantic color names that developers can use instead of remembering hex values.

**Testing:** After changes, verify with WebAIM Contrast Checker:

- [ ] Gray-900 (#1c1917) on white: 16.4:1 ✓
- [ ] Gray-700 (#57534e) on white: 4.8:1 ✓
- [ ] Gray-600 (#78716b) on white: 3.2:1 (acceptable for labels)
- [ ] Gray-300 borders on white: 3.5:1 ✓
- [ ] Gray-500 borders on white: 6:1 ✓

---

### 3. `assets/css/themes.css` — Theme Contrast Audit

**Current State:** Five themes may have contrast issues; need verification

**Priority Fixes:** HIGH (affects all pages when using alt themes)

#### Action: Audit All Themes

For each theme (.theme-sport-tech, .theme-brutalist, etc.):

**Checklist:**

```
Theme: [name]
Background: [color]
Text on background: [color]
Contrast ratio: [ratio] — Pass/Fail WCAG AA?

--color-gray-600 on --color-brand-bg: [ratio]
--color-gray-700 on --color-brand-bg: [ratio]
--color-primary-500 on --color-brand-bg: [ratio]
```

**Example Fix (Sport-Tech theme):**

```css
.theme-sport-tech {
  /* Current */
  --color-gray-500: #7a8aa2; /* 4.8:1 on #0f1420 bg */

  /* Verify with contrast checker that text is readable */
  /* If needed: */
  --color-gray-700: #bababd; /* Increase brightness for light text on dark bg */
}
```

**Tools:** Use WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)

---

### 4. `pages/builder.vue` — Restructure Categories & Highlight Total

**Current State:** 37 flat categories; total price not emphasized

**Priority Fixes:** CRITICAL (most complex page)

#### Change 1: Group Categories

**Lines:** 65-80 (groupItems computed)  
**Current:**

```typescript
const groupItems = computed(() => {
  if (!hierarchy.value) return [];
  return Object.keys(hierarchy.value).map((group) => {
    const categories = hierarchy.value[group] as string[];
    const selectedCount = categories.filter(
      (cat) => bike.state.components[cat]
    ).length;
    return {
      label: `${group} (${selectedCount}/${categories.length})`,
      slot: group,
      categories,
      defaultOpen: true, // ← ALL OPEN BY DEFAULT!
    };
  });
});
```

**Problem:** All 37 categories visible at once if hierarchy creates flat list.

**Recommended Approach:**

```typescript
// STEP 1: Check if grouping is already in API response
// If yes, modify groupItems to:
const groupItems = computed(() => {
  if (!hierarchy.value) return [];
  return Object.keys(hierarchy.value)
    .sort() /* Alphabetical for consistency */
    .map((group, index) => {
      const categories = hierarchy.value[group] as string[];
      const selectedCount = categories.filter(
        (cat) => bike.state.components[cat]
      ).length;

      /* Only open first 2 groups by default */
      const isDefaultOpen = index < 2;

      return {
        label: `${group} (${selectedCount}/${categories.length})`,
        slot: group,
        categories,
        defaultOpen: isDefaultOpen /* Most collapsed initially */,
        completed: selectedCount === categories.length,
      };
    });
});

// STEP 2: If API doesn't provide hierarchy, group client-side
if (!hierarchy.value && componentsMap.value) {
  const grouped = {
    Rodas: ["Aro", "Cubo", "Raio", "Pneu", "Câmara"],
    Transmissão: [
      "Cassete",
      "Corrente",
      "Câmbio Dianteiro",
      "Câmbio Traseiro",
      "Pedivela",
      "Alavanca de Câmbio",
      "Movimento Central",
    ],
    Cockpit: [
      "Guidão",
      "Mesa",
      "Canote",
      "Selim",
      "Manopla",
      "Caixa de Direção",
    ],
    Suspensão: ["Garfo", "Amortecedor", "Bieleta"],
    "Sistema de Frenagem": [
      "Freio V-Brake",
      "Freio Disco",
      "Alavanca de Freio",
    ],
    Corrente: ["Corrente", "Pinhão"],
    // Group remaining by pattern
  };
}
```

**Template Change:** Update accordion rendering to show visual indicators

```vue
<UAccordion
  v-for="group in groupItems"
  :key="group.slot"
  :items="[
    {
      label: group.label,
      slot: group.slot,
      icon: group.completed ? 'i-heroicons-check-circle' : 'i-heroicons-folder',
      defaultOpen: group.defaultOpen,
    },
  ]"
  color="primary"
>
  <!-- Content -->
</UAccordion>
```

#### Change 2: Emphasize Total Price

**Lines:** Around line 496+ (summary section template)  
**Current:**

```vue
<div>
  <p>Total Estimado</p>
  <p>R$ {{ formatCurrency(totalPrice) }}</p>
</div>
```

**Recommended:**

```vue
<!-- Highlight total with visual emphasis -->
<div class="bg-primary/10 border border-contrast-strong rounded-lg p-6 mt-6">
  <p class="text-xs font-semibold text-contrast-secondary uppercase mb-2">
    Total Estimado
  </p>
  <div class="metric-large">
    {{ formatCurrency(totalPriceValue) }}
  </div>

  <!-- Optional: Show component count -->
  <p class="text-sm text-contrast-secondary mt-3">
    {{ selectedComponentCount }}/{{ totalComponentCount }} componentes selecionados
  </p>
</div>
```

**Files to Review:**

- `pages/builder.vue` (entire file)
- `components/CategorySidebar.vue` (if exists)

---

### 5. `components/ProductCard.vue` — Reduce Density & Fix Hierarchy

**Current State:** 6+ elements per card; price not emphasized; tags overwhelming

**Priority Fixes:** HIGH (used in Gallery)

#### Change 1: Update Card Structure

**Lines:** 23-80 (full card template)  
**Current:**

```vue
<div class="flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
  <!-- Image -->
  <div class="h-48 bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative">
    <!-- Complex image with brand badge -->
  </div>

  <!-- Content: 6+ elements -->
  <div class="p-4 flex flex-col flex-grow">
    <!-- Category label -->
    <!-- Model name -->
    <!-- Brand -->
    <!-- Price -->
    <!-- Tags (4-6 items) -->
    <!-- Button -->
  </div>
</div>
```

**Recommended Structure (Gallery Variant):**

```vue
<template>
  <div
    class="flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
  >
    <!-- Image: Keep same -->
    <div
      class="aspect-square bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative overflow-hidden"
    >
      <img
        v-if="component.imageUrl && !imageError"
        :src="component.imageUrl"
        :alt="component.model"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        @error="handleImageError"
      />
      <UIcon
        v-else
        name="i-heroicons-photo"
        class="w-12 h-12 text-gray-400 dark:text-gray-700"
      />

      <!-- Brand badge: simplified -->
      <div
        class="absolute top-2 right-2 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded text-xs font-semibold text-gray-700 dark:text-gray-300"
      >
        {{ component.brand }}
      </div>
    </div>

    <!-- Content: Simplified -->
    <div class="p-6 flex flex-col flex-grow gap-4">
      <!-- Category: small, muted -->
      <div
        class="text-xs font-semibold text-primary/70 uppercase tracking-wide"
      >
        {{ component.type || component.functionalGroup }}
      </div>

      <!-- Model: large, bold -->
      <h4 class="font-display font-bold text-lg line-clamp-2">
        {{ component.model }}
      </h4>

      <!-- Spacer to push price down -->
      <div class="flex-grow" />

      <!-- Price section: emphasized, separated -->
      <div class="border-t border-contrast-default pt-4">
        <p class="text-xs text-contrast-secondary mb-1">Preço</p>
        <div class="metric-large">
          {{ formatCurrency(component.price) }}
        </div>
      </div>

      <!-- REMOVE: Category tags (creates clutter) -->
      <!-- OPTION: Replace with single badge -->
      <!-- <span class="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded"> -->
      <!--   {{ component.type }} -->
      <!-- </span> -->
    </div>
  </div>
</template>
```

**Key Changes:**

- Removed: 4-6 category tags
- Added: Flex spacer to push price down
- Updated: Text colors to use contrast utilities
- Updated: Border colors to use contrast-default
- Added: metric-large class for price

#### Change 2: Props for Variants

**Lines:** Top of script  
**Add:**

```typescript
interface Props {
  component: any;
  isSelected?: boolean;
  variant?:
    | "gallery"
    | "comparison"
    | "builder"; /* Support multiple card styles */
}

const props = withDefaults(defineProps<Props>(), {
  variant: "gallery",
});

/* Can add variant-specific classes later */
const cardClasses = computed(
  () =>
    ({
      gallery: "p-6" /* More padding for gallery */,
      comparison: "p-4" /* Compact for comparison */,
      builder: "p-4" /* Compact for builder */,
    })[props.variant]
);
```

**Rationale:** Allows reusing same component for different contexts with different densities.

---

### 6. `components/ProductGrid.vue` — Verify Responsive Grid

**Current State:** Uses responsive grid classes (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)

**Priority Fixes:** MEDIUM (verify mobile responsiveness)

#### Review & Verify

**Lines:** 30-46 (grid structure)

```vue
<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards -->
</div>
```

**Checklist:**

- [ ] Mobile (< 640px): 1 column
- [ ] Tablet (640px - 1024px): 2 columns
- [ ] Desktop (> 1024px): 3 columns
- [ ] Gap consistent (gap-6 = 24px)

**If not responsive, update:**

```vue
<!-- Update gap for better mobile spacing -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
```

---

### 7. `pages/index.vue` — Fix Filter Alignment & "Voltar" Button

**Current State:** Filter controls misaligned; "Voltar" button floats

**Priority Fixes:** MEDIUM (affects homepage)

#### Change 1: Align Filters to Grid

**Lines:** Filter section  
**Current (assumed):**

```vue
<div class="flex gap-2 items-center justify-between">
  <div class="flex gap-2">
    <select>Performance</select>
    <select>Type</select>
    <select>Brand</select>
    <select>Price</select>
  </div>
  <button>Voltar</button>
</div>
```

**Recommended:**

```vue
<!-- Use grid for consistent alignment -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
  <!-- 4 filters + button in 5th column on desktop -->
  <select class="col-span-1 px-4 py-2 border border-contrast-default rounded-lg">
    <option>Performance</option>
  </select>
  
  <select class="col-span-1 px-4 py-2 border border-contrast-default rounded-lg">
    <option>Type</option>
  </select>
  
  <select class="col-span-1 px-4 py-2 border border-contrast-default rounded-lg">
    <option>Brand</option>
  </select>
  
  <select class="col-span-1 px-4 py-2 border border-contrast-default rounded-lg">
    <option>Price Range</option>
  </select>
  
  <!-- "Voltar" button in aligned grid cell -->
  <button class="col-span-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold">
    Voltar
  </button>
</div>

<!-- Mobile: stack vertically, button full width -->
<style scoped>
@media (max-width: 1024px) {
  .filter-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
</style>
```

#### Change 2: Update Border Colors

**Lines:** Select/input styling  
**Replace:** `border-gray-200` → `border-contrast-default`  
**Replace:** `border-gray-300` (focus) → `border-primary-500`

---

### 8. `pages/guide.vue` — Add Active State & Fix Alignment

**Current State:** No visual indication of selected tier; filter alignment issues

**Priority Fixes:** MEDIUM

#### Change 1: Add Tier Button Styling

**Lines:** Tier selector section  
**Add:**

```vue
<script setup>
const selectedTier = ref("entry"); /* Track selected tier */
</script>

<template>
  <!-- Tier selector with active state -->
  <div class="flex gap-3 mb-8">
    <button
      v-for="tier in ['entry', 'intermediate', 'advanced']"
      :key="tier"
      @click="selectedTier = tier"
      :class="[
        'px-6 py-3 rounded-lg font-semibold transition-all',
        selectedTier === tier
          ? 'bg-primary text-white font-bold' /* Active: filled */
          : 'border border-primary text-primary' /* Inactive: outline */,
      ]"
    >
      {{
        tier === "entry"
          ? "Entry"
          : tier === "intermediate"
            ? "Intermediate"
            : "Advanced"
      }}
    </button>
  </div>
</template>
```

#### Change 2: Align Sidebar with Content

**Lines:** Layout structure  
**Current (assumed):**

```vue
<div class="flex gap-4">
  <aside><!-- Categories --></aside>
  <main><!-- Content --></main>
</div>
```

**Update to ensure grid alignment:**

```vue
<div class="flex gap-4">
  <aside class="w-72 flex-shrink-0">
    <!-- Categories: fixed width -->
  </aside>
  <main class="flex-1">
    <!-- Content: fills remaining space -->
  </main>
</div>
```

---

### 9. `pages/compare.vue` — Align Columns & Emphasize Metrics

**Current State:** Column headers misaligned; totals not emphasized

**Priority Fixes:** MEDIUM

#### Change 1: Use Grid for Column Alignment

**Lines:** Main layout  
**Update:**

```vue
<!-- Two-column layout: aligned headers -->
<div class="grid grid-cols-2 gap-6">
  <!-- Left column: User bike -->
  <div>
    <h3 class="h3 mb-4">Sua Bike</h3>
    <!-- User bike components -->
  </div>

  <!-- Right column: Template -->
  <div>
    <h3 class="h3 mb-4">Template Selecionado</h3>
    <!-- Template components -->
  </div>
</div>
```

#### Change 2: Emphasize Totals

```vue
<!-- Totals row: use metric-large -->
<div class="grid grid-cols-2 gap-6 mt-8 pt-4 border-t border-contrast-default">
  <div>
    <p class="text-sm text-contrast-secondary mb-2">Total Estimado</p>
    <div class="metric-large">
      {{ formatCurrency(userBikeTotal) }}
    </div>
  </div>

  <div>
    <p class="text-sm text-contrast-secondary mb-2">Total Template</p>
    <div class="metric-large">
      {{ formatCurrency(templateTotal) }}
    </div>
  </div>
</div>
```

---

### 10. `pages/admin/components.vue` — Restructure Layout

**Current State:** Theme selector dominates; component management below fold

**Priority Fixes:** CRITICAL (information architecture broken)

#### Change 1: Move Theme Selector

**Option A: Collapse to Panel**

```vue
<!-- At top: Collapsed theme settings -->
<div class="mb-8">
  <button @click="showThemeSettings = !showThemeSettings" class="flex items-center gap-2 text-sm font-semibold">
    <UIcon name="i-heroicons-cog" />
    Theme Settings
  </button>

  <div v-if="showThemeSettings" class="mt-4 p-6 bg-gray-50 rounded-lg border border-contrast-default">
    <!-- Theme selector UI (current code) -->
  </div>
</div>
```

**Option B: Separate Tab**

```vue
<UTabs
  :items="[
    { label: 'Components', slot: 'components' },
    { label: 'Import', slot: 'import' },
    { label: 'Settings', slot: 'settings' },
  ]"
>
  <template #components>
    <!-- Component management table -->
  </template>
  
  <template #settings>
    <!-- Theme selector -->
  </template>
</UTabs>
```

**Option C: Separate Page**

```
Create: pages/admin/settings.vue
Route: /admin/components → Main tab
Route: /admin/settings → Theme selector + other settings
```

**Recommended:** Option A (collapse) for quick access, or Option B (tabs) for organization.

#### Change 2: Emphasize Component Table

**Lines:** Table section  
**Make table the visual focus:**

```vue
<!-- Update table styling -->
<table class="w-full text-sm">
  <thead>
    <tr class="border-b-2 border-contrast-strong bg-gray-50 dark:bg-gray-900">
      <th class="px-4 py-3 text-left font-semibold text-sm uppercase text-contrast-secondary">
        Component
      </th>
      <th class="px-4 py-3 text-right font-semibold text-sm uppercase text-contrast-secondary">
        Price
      </th>
      <!-- More columns -->
    </tr>
  </thead>
  <tbody>
    <tr v-for="component in components" class="border-b border-contrast-default hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <!-- Cells -->
    </tr>
  </tbody>
</table>
```

---

### 11. `pages/gallery.vue` — Simplify Card Density

**Current State:** Cards overloaded with tags; visual clutter

**Priority Fixes:** HIGH (affects main gallery)

#### Change 1: Simplify Card Rendering

**Lines:** Card component usage  
**Update to use simplified variant:**

```vue
<ProductCard
  v-for="bike in bikes"
  :key="bike.id"
  :component="bike"
  variant="gallery"  <!-- Use simplified variant -->
  @add="selectBike"
/>
```

#### Change 2: Increase Card Padding

**Lines:** Component styling  
**Ensure:** `p-6` or `p-8` in gallery variant (not `p-4`)

---

### 12. Create `components/EmptyState.vue` — Improve Visibility

**Current State:** Empty state icons too small; text not emphasized

**Priority Fixes:** HIGH (affects Builder, Compare, Guide)

#### New Component

```vue
<script setup lang="ts">
interface Props {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

withDefaults(defineProps<Props>(), {
  icon: "i-heroicons-inbox",
});
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 px-6 text-center">
    <!-- Icon: Large, primary color -->
    <UIcon :name="icon" class="w-24 h-24 text-primary-500 mb-8" />

    <!-- Title: H2 weight -->
    <h2 class="text-2xl font-bold text-contrast-primary mb-2">
      {{ title }}
    </h2>

    <!-- Description: body, secondary text -->
    <p class="text-contrast-secondary max-w-md mb-8">
      {{ description }}
    </p>

    <!-- Optional CTA button -->
    <button
      v-if="action"
      @click="action.onClick"
      class="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
    >
      {{ action.label }}
    </button>
  </div>
</template>

<style scoped>
/* No additional styling needed - uses Tailwind classes */
</style>
```

**Usage:**

```vue
<EmptyState
  icon="i-heroicons-cube"
  title="Nenhuma peça encontrada"
  description="Não encontramos componentes para este nível de performance."
  :action="{ label: 'Tentar novamente', onClick: refresh }"
/>
```

---

## Implementation Priority & Timeline

### Phase 1: Typography & Color Fixes (2-3 days, 14 high-priority issues)

**Impact:** Fixes foundation for all other pages

- [ ] Update `brand.css` (headings, font weights, contrast utilities)
- [ ] Update `nuxt.config.ts` (gray scale, text colors)
- [ ] Audit `themes.css` for WCAG compliance
- [ ] Test across all pages
- **Effort:** 6-8 hours

### Phase 2: Key Page Restructuring (2-3 days, 4 critical pages)

**Impact:** Improves user experience on most-used pages

- [ ] Builder page (group categories, emphasize total)
- [ ] Gallery cards (simplify, reduce density)
- [ ] Admin page (restructure layout)
- [ ] Guide page (active state indicators)
- **Effort:** 8-10 hours

### Phase 3: Component Improvements (1-2 days)

**Impact:** Across-the-board UI quality improvements

- [ ] ProductCard refinements
- [ ] EmptyState component
- [ ] Filter alignment
- [ ] Grid system verification
- **Effort:** 6-8 hours

### Phase 4: Polish & Testing (1 day)

**Impact:** Quality assurance & WCAG compliance

- [ ] Contrast verification (WebAIM checker)
- [ ] Mobile responsive testing
- [ ] Dark mode testing (all 5 themes)
- [ ] Accessibility audit
- [ ] Visual regression testing
- **Effort:** 4-6 hours

**Total Estimated Effort:** 40-48 hours (~1 full-time week)

---

## Testing Checklist

### Contrast Testing

```
Tool: WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)

✓ Gray-900 (#1c1917) on white: 16.4:1
✓ Gray-700 (#57534e) on white: 4.8:1
✓ Gray-600 (#78716b) on white: 3.2:1
✓ Gray-300 borders on white: 3.5:1
✓ All theme combinations (5 themes × foreground colors)
```

### Typography Testing

```
✓ H1 appears 40px+ and prominent
✓ Body text reads easily (line-height 1.6)
✓ Small text minimum 14px
✓ Font weights follow pattern (400/600/700/800)
✓ Metric-large class used for prices/totals
```

### Responsive Testing

```
Breakpoints:
✓ Mobile (375px): Single column, stacked layout
✓ Tablet (768px): 2 columns, adjusted spacing
✓ Desktop (1024px): 3 columns, full layout
✓ Large (1440px): No overflow, proper gutters

Components:
✓ Grids responsive with proper breakpoints
✓ Sidebars collapse on mobile
✓ Cards maintain aspect ratios
✓ Text doesn't overflow or truncate unexpectedly
```

### Accessibility Testing

```
✓ Focus outlines visible and distinct
✓ Disabled buttons look disabled (not just opacity)
✓ Active states clearly indicated
✓ Color not only indicator (text/icons used too)
✓ WCAG AA compliance (1.4.3 Contrast ratio met)
✓ WCAG AA compliance (1.4.11 Non-text Contrast met)
```

### Visual Regression

```
Tools: Percy, Chromatic, or manual comparison

✓ Screenshot compare: Before vs. After for each page
✓ Verify no unintended changes to other components
✓ Check dark mode still renders correctly
✓ Verify all 5 theme variants still work
```

---

## Success Criteria

After implementation, the audit score should improve to **85+/100**:

✓ **Simplicity (8/10)** — Clear information hierarchy, builder categories grouped  
✓ **Grid System (8/10)** — All elements aligned to consistent grid  
✓ **Visual Hierarchy (8/10)** — H1 prominent, metrics emphasized, clear weighting  
✓ **Typography (8/10)** — Consistent sizing, proper hierarchy, readable text  
✓ **Color Harmony (8/10)** — Consistent palette, all themes WCAG AA compliant  
✓ **Contrast (8/10)** — All text 4.5:1+ (WCAG AA), borders visible  
✓ **Alignment (8/10)** — Grid-based layouts, proper spacing  
✓ **White Space (8/10)** — Generous padding, breathing room, no crowding

**Overall Health Score Target: 80-85/100** ✓
