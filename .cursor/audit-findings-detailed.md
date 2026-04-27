# Detailed Design Audit: Principle-by-Principle Analysis

## 1. SIMPLICITY: Keep designs clean and uncluttered

### Current State

**Health Score: 6/10**

The app struggles with information density and visual clutter across several pages:

#### Issues Identified

**High Priority Issues:**

1. **Builder Page - Component Category Overload**
   - 37 uncategorized component items create cognitive overload
   - Flat accordion list without visual grouping
   - No hierarchy or collapsible sections for related categories
   - File: `pages/builder.vue` (lines 65-80)

2. **Gallery Page - Card Information Overload**
   - Each card contains: title, 2-3 subtitles, price, 4-6 category tags, + button
   - Tags create visual noise competing with primary information
   - File: `components/ProductCard.vue` (full card structure)

3. **Admin Components Page - Misaligned Primary Function**
   - Theme selector section takes up 40% of viewport before table
   - Multiple theme options create visual chaos
   - Primary function (component management table) relegated to below-fold
   - File: `pages/admin/components.vue`

**Medium Priority Issues:**

- Filter UI on homepage feels cluttered (4 dropdowns + search in one row)
- Guide page has 10+ interactive elements (3 tier buttons + 7 categories) before content

#### Recommendations by File

**[pages/builder.vue](pages/builder.vue)**

- Implement category grouping: Instead of 37 flat items, create 8-10 primary groups
- Suggested structure:
  - Rodas (3-4 related categories)
  - Transmissão (5-6 related)
  - Cockpit (4-5 related)
  - Suspensão (3-4 related)
  - Etc.
- Use collapsible primary groups that expand to show subcategories
- Add visual indicators for completion status (X/Y selected)

**[components/ProductCard.vue](components/ProductCard.vue) & [components/ProductGrid.vue](components/ProductGrid.vue)**

- Reduce card information density:
  - REMOVE: Category tags or collapse into a single "Category" chip
  - REDUCE: Subtitle lines from 2-3 to 1
  - EMPHASIZE: Brand + Price only on card
  - Add: "More details" link to full information
- Option: Create two card variants
  - Simple card (gallery): Title, brand, price, one line detail
  - Detailed card (comparison): Full current structure

**[pages/admin/components.vue](pages/admin/components.vue)**

- Move theme selector to a collapsible "Settings" panel at top-right
- OR move to separate /admin/settings page
- Primary focus: Component management table
- Restructure as: Tabs (All Components | Import | Settings)

---

## 2. GRID SYSTEM: Use grids for structure, alignment, visual balance

### Current State

**Health Score: 5/10**

Layout structure is present but lacks consistency and proper grid-snapping.

#### Issues Identified

**High Priority Issues:**

1. **Inconsistent Sidebar Widths**
   - Left sidebar on Builder/Guide pages appears arbitrary (roughly 280-300px)
   - Not aligned to 12-column Tailwind grid
   - No consistent relationship to main content width
   - Files: `pages/builder.vue`, `pages/guide.vue`

2. **Filter Control Misalignment**
   - 4 dropdown controls on homepage don't align to consistent grid widths
   - Dropdown widths vary based on content, not layout system
   - "Voltar" button floats right without grid relationship
   - File: `pages/index.vue` (filter section)

3. **Three-Column Layout Breakpoints**
   - Builder layout (sidebar | content | sidebar) breaks unpredictably on mobile
   - No proper responsive grid transition plan (mobile/tablet/desktop)
   - File: `pages/builder.vue` template

**Medium Priority Issues:**

- Tier buttons on Guide page not grid-aligned with sidebar below
- Admin theme buttons inconsistent sizing (should be fixed-width or grid-based)
- Comparison page left/right columns not baseline-aligned at headers

#### Recommendations by File

**[nuxt.config.ts](nuxt.config.ts)** - Extend Tailwind config

```
Ensure 12-column grid system:
- Add container sizes for different layouts
- Define standardized sidebar width: w-80 (320px) or w-72 (288px)
- Create spacing scale utility: Define consistent gap ratios
```

**[pages/builder.vue](pages/builder.vue)**

- Left sidebar: Use consistent `w-80` class
- Right summary: Use `w-72` or `w-80`
- Main content: `flex-1` to fill remaining space
- Mobile: Stack vertically with `flex-col` responsive class
- Responsive breakpoint: `lg:flex-row flex-col`

**[pages/guide.vue](pages/guide.vue)**

- Left sidebar: Lock to `w-72` with responsive collapse
- Tier selector buttons: Use consistent grid layout `grid grid-cols-3 gap-4`
- Category buttons: Align vertically in `grid grid-cols-1 gap-2`

**[pages/index.vue](pages/index.vue)** or filter component

- Filter controls: `grid grid-cols-4 gap-3` on desktop
- Responsive: `grid-cols-2 gap-3` on tablet, `grid-cols-1 gap-2` on mobile
- "Voltar" button: Place in dedicated grid cell, not floated

**[components/ProductGrid.vue](components/ProductGrid.vue)**

- Verify responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Ensure consistent `gap-6` spacing
- Check mobile breakpoint effectiveness

---

## 3. VISUAL HIERARCHY: Guide viewer's eye using size, weight, placement

### Current State

**Health Score: 4/10**

Typography scaling is inconsistent and primary elements (prices, totals) lack visual emphasis.

#### Issues Identified

**High Priority Issues:**

1. **Undersized H1 Headings**
   - Current: Appears ~24-28px (from `brand.css` line 32-35)
   - Issue: Too small for primary page titles
   - Impact: Users struggle to understand page context
   - File: `assets/css/brand.css` (lines 32-35)

2. **Weak Emphasis on Key Metrics**
   - Prices and totals: Same size as surrounding text
   - "Total Estimado: R$ 0,00" should be 2-3x larger and bold
   - Current: Appears in same 16px body text
   - Files: Builder summary section, Compare view, Gallery cards

3. **Flat Accordion Hierarchy (Builder)**
   - All 37 categories same visual weight
   - No distinction between primary/secondary/tertiary categories
   - No visual indication of selected state or completion
   - File: `pages/builder.vue` (accordion rendering)

4. **Button Visual Weight Inconsistency**
   - Primary CTAs (Save, Compare) not visually distinct from secondary (Cancel, Back)
   - No clear visual hierarchy between action types
   - Files: Component usage throughout pages

5. **Empty State Low Visibility**
   - Builder empty state icon too small (~48px should be 80-120px)
   - Messaging text same size as regular body text
   - Should be 1.2-1.5x larger
   - File: Components with empty states

**Medium Priority Issues:**

- Category tags don't distinguish hierarchy from titles
- Table headers not emphasized (same weight as rows)
- Tier selector buttons (Guide) lack active state visual indication

#### Recommendations by File

**[assets/css/brand.css](assets/css/brand.css)** - Update typographic scale

```css
/* Update lines 32-48 */
h1 {
  font-size: 2.5rem; /* 40px - was 2rem */
  line-height: 1.1; /* tighter for headline */
  font-weight: 800; /* was 700 */
  letter-spacing: -0.03em; /* add more for display */
}

h2 {
  font-size: 1.875rem; /* 30px - was 1.5rem */
  line-height: 1.2;
  font-weight: 700;
}

h3 {
  font-size: 1.5rem; /* 24px - was 1.25rem */
  line-height: 1.3;
  font-weight: 700;
}

/* Add h4 for subsections */
h4 {
  font-size: 1.125rem; /* 18px */
  line-height: 1.4;
  font-weight: 600;
}

/* Add emphasis class for metrics */
.metric-large {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--color-brand-ink);
}
```

**[components/ProductCard.vue](components/ProductCard.vue)**

- Add hierarchy to card content:

  ```html
  <!-- Brand: small, secondary weight -->
  <div class="text-xs font-semibold text-primary/60 uppercase">{{ brand }}</div>

  <!-- Model: h4, primary weight -->
  <h4 class="font-display font-bold text-lg line-clamp-2">{{ model }}</h4>

  <!-- Price: metric-large class -->
  <div class="metric-large mt-2">{{ price }}</div>
  ```

**[pages/builder.vue](pages/builder.vue)** - Highlight total price

- Update summary section:
  ```html
  <div class="bg-primary/10 rounded-lg p-4 mt-4">
    <p class="text-sm text-gray-600 mb-2">Total Estimado</p>
    <div class="metric-large">{{ formatCurrency(totalPrice) }}</div>
  </div>
  ```

**Button Visual Hierarchy** - Create standardized button variants

- Primary CTA: Filled teal background, white text, bold
- Secondary: Outline teal, teal text
- Tertiary: Text-only teal
- Danger: Outline red for destructive actions
- File: Create `components/Button.vue` or update Nuxt UI config

**Empty States** - Increase visual prominence

- Icon size: 100-120px (from current ~48px)
- Heading: h2 weight and size
- Message: body text but 1.1-1.2x current
- Suggested action: Button or link in primary color
- File: Create `components/EmptyState.vue` component

---

## 4. TYPOGRAPHY: Limit typefaces to readable, professional with clear hierarchy

### Current State

**Health Score: 6/10**

Font selection is excellent (Bricolage + Source Serif 4), but hierarchy application is weak.

#### Issues Identified

**High Priority Issues:**

1. **Inconsistent Font Weight Usage**
   - Mix of regular (400), medium (500), semibold (600), bold (700) without clear pattern
   - No documented weight hierarchy
   - Creates confusion about content importance
   - Files: Multiple components

2. **Small Text Sizes**
   - Table text: appears 12-13px, should be minimum 14px
   - Category tags: 11-12px, hard to read at distance
   - Secondary text: some items <14px
   - File: `components/ProductCard.vue`, tables in pages

3. **Line Height Issues**
   - Body text: line-height should be 1.6 for readability
   - Current: Mixed (appears to be 1.4-1.5)
   - Headings: Could be tighter (1.1-1.2)
   - File: `brand.css` needs global line-height settings

4. **Missing Display Font Scale**
   - Bricolage Grotesque should be used more boldly
   - Currently confined to headings only
   - Could enhance buttons, labels, CTA text

**Medium Priority Issues:**

- Page descriptions undersized (should be 18px, appear ~16px)
- Category labels same size as content (should be smaller, uppercase)
- Tag text illegible at small sizes

#### Recommendations by File

**[assets/css/brand.css](assets/css/brand.css)** - Establish typography system

```css
/* Add to global typography section */

/* Font weight hierarchy */
:root {
  --fw-light: 300;
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: 700;
  --fw-extrabold: 800;
}

/* Body text optimization */
body,
p {
  font-family: var(--font-body, "Source Serif 4", Georgia, serif);
  font-size: 1rem; /* 16px */
  line-height: 1.6;
  font-weight: 400;
  color: var(--color-brand-ink);
}

small,
.text-sm {
  font-size: 0.875rem; /* 14px - NEVER below this */
  line-height: 1.5;
}

.text-xs {
  font-size: 0.75rem; /* 12px - use sparingly, only for labels */
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--fw-semibold);
}

/* Emphasis classes */
.font-light {
  font-weight: var(--fw-light);
}
.font-medium {
  font-weight: var(--fw-medium);
}
.font-semibold {
  font-weight: var(--fw-semibold);
}
.font-bold {
  font-weight: var(--fw-bold);
}
.font-extrabold {
  font-weight: var(--fw-extrabold);
}
```

**[components/ProductCard.vue](components/ProductCard.vue)** - Fix typography hierarchy

```html
<!-- Category label: small, uppercase, secondary weight -->
<div class="text-xs font-semibold text-primary/70 uppercase tracking-wide mb-2">
  {{ component.type || component.functionalGroup }}
</div>

<!-- Model name: display font, bold -->
<h4 class="font-display font-bold text-lg mb-2 line-clamp-2">
  {{ component.model }}
</h4>

<!-- Brand: small, regular -->
<p class="text-sm text-gray-600">{{ component.brand }}</p>

<!-- Price: metric-large (see hierarchy section) -->
<div class="metric-large mt-auto">{{ formatCurrency(component.price) }}</div>
```

**Table Text** - Ensure readability

- Minimum table text: 14px (use `text-sm` or larger)
- Table headers: 16px, semibold, uppercase
- Row text: 14px, regular
- File: Any table component or page using tables

**Category/Tag Styling**

- Tag text: Minimum 13px (not 11-12px)
- Use `text-xs font-semibold uppercase` consistently
- File: `components/ProductCard.vue` and gallery cards

---

## 5. COLOR HARMONY: Stick to consistent color palette reflecting brand

### Current State

**Health Score: 7/10**

Color system is sophisticated with 5 complete themes, but application and contrast are issues.

#### Issues Identified

**High Priority Issues:**

1. **Text Contrast Failures**
   - Secondary text (~#888) on white background: likely fails WCAG AA
   - Required: 4.5:1 ratio for normal text, 3:1 for large text
   - Current estimated ratio: ~3.5:1 (fails)
   - Files: Brand colors in `nuxt.config.ts`, theme CSS

2. **Border Contrast Too Subtle**
   - Current borders: Very light gray (#E5E5E5 or lighter)
   - Against white background: Nearly invisible
   - Should be #D1D5DB or darker for visibility
   - File: `assets/css/themes.css`

3. **Theme Color Overload (Admin Page)**
   - Six color palettes on one screen (default + 5 theme variants)
   - Visual chaos reduces ability to focus
   - Files: `pages/admin/components.vue`, theme selector UI

**Medium Priority Issues:**

- Disabled button states not visually distinct
- Card borders too subtle on some variants
- Low contrast on category tags (light gray text)
- Icon colors insufficient contrast

#### Recommendations by File

**[nuxt.config.ts](nuxt.config.ts)** - Update color palette

```javascript
// Update theme colors (lines 110-136)
colors: {
  primary: {
    50: "#f0f8f7",
    100: "#ddf1f0",
    200: "#b9e4e1",
    300: "#8ed4cf",
    400: "#5ebdb6",
    500: "#0d6b6b",
    600: "#0a5555",
    700: "#084545",
    800: "#063939",
    900: "#052e2e",
    950: "#021a1a",
  },
  // Enhance gray scale for better contrast
  gray: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",   /* borders: 3:1 ratio */
    300: "#d6d3d1",   /* softer borders: ~3.5:1 */
    400: "#a8a29e",   /* secondary text: ~3.2:1 - NEEDS FIX */
    500: "#78716b",   /* body text secondary: ~4.8:1 GOOD */
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
    950: "#0c0a09",
  },
},

// Add explicit text color scale
extend: {
  textColor: {
    "primary-text": "#1c1917",    /* 16.4:1 on white - excellent */
    "secondary-text": "#57534e",  /* 4.8:1 on white - WCAG AA */
    "tertiary-text": "#78716b",   /* 3.2:1 - use sparingly */
  },
  borderColor: {
    "default": "#d6d3d1",         /* 3.5:1 - visible */
    "strong": "#a8a29e",          /* 6:1 - strong borders */
  }
}
```

**[assets/css/themes.css](assets/css/themes.css)** - Fix contrast ratios

```css
/* Sport-Tech Theme */
.theme-sport-tech {
  --color-primary-500: #4dd9f5;
  --color-gray-500: #7a8aa2;
  /* Update to ensure 4.5:1 contrast on dark backgrounds */
  /* Text on #0f1420 background must be light enough */
}

/* All themes: Audit contrast ratios and update */
/* Use WebAIM contrast checker: https://webaim.org/resources/contrastchecker/ */
```

**[components/ProductCard.vue](components/ProductCard.vue)** - Fix text colors

```html
<!-- Secondary text: use gray-600 or gray-700, NOT gray-500 -->
<p class="text-sm text-gray-600">{{ component.brand }}</p>

<!-- Category label: use primary/80 or semibold for visibility -->
<div class="text-xs font-semibold text-primary/80 uppercase">
  {{ component.type }}
</div>
```

**Disabled State Styling** - Make it obvious

```css
/* In component or Nuxt UI config */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f4;
  color: #a8a29e;
  border-color: #d6d3d1;
}
```

**Admin Page Theme Selector**

- Reduce visual weight: Show only theme names, not preview swatches
- OR move to Settings panel and hide by default
- File: `pages/admin/components.vue` theme section

---

## 6. CONTRAST: Use contrast for text readability and important elements

### Current State

**Health Score: 5/10**

Multiple contrast failures affecting readability and WCAG compliance.

#### Issues Identified

**High Priority Issues:**

1. **Text Contrast Failures (WCAG AA)**
   - Secondary text (~#888): Fails 4.5:1 requirement
   - Table text: May be too light
   - Disabled buttons: Insufficient contrast
   - Category tags: 3:1 ratio (barely acceptable)
   - Files: Multiple components using gray-500/gray-600

2. **Border Contrast Issues**
   - Card borders: Nearly invisible (too light)
   - Dropdown borders: Subtle, hard to see
   - Active state borders: Not distinct enough
   - File: Component styling, card borders

3. **Icon Contrast**
   - Some icons use `text-gray-400`: 2:1 ratio (fails)
   - Disabled icons: Too faint
   - File: Icon usage throughout app

4. **Empty State Icon Low Visibility**
   - Size: ~48px (should be 100-120px)
   - Color: Gray instead of primary color
   - File: Empty state components

**Medium Priority Issues:**

- Hover states don't use sufficient contrast
- Focus states may not be visible
- Link underlines could be stronger

#### Recommendations by File

**[assets/css/brand.css](assets/css/brand.css)** - Add contrast utilities

```css
/* Text contrast classes */
.text-contrast-normal {
  color: var(--color-brand-ink);
} /* 16.4:1 */
.text-contrast-secondary {
  color: #57534e;
} /* 4.8:1 */
.text-contrast-tertiary {
  color: #78716b;
} /* 3.2:1 - use sparingly */

/* Border contrast */
.border-contrast-normal {
  border-color: #d6d3d1;
} /* 3.5:1 */
.border-contrast-strong {
  border-color: #a8a29e;
} /* 6:1 */

/* Icon contrast */
.icon-normal {
  color: var(--color-brand-ink);
}
.icon-secondary {
  color: #57534e;
}
.icon-disabled {
  color: #a8a29e;
  opacity: 0.5;
}

/* Focus states - must be visible */
:focus {
  outline: 3px solid var(--color-primary-500);
  outline-offset: 2px;
}

button:focus,
a:focus {
  outline: 3px solid var(--color-primary-500);
  outline-offset: -2px;
}
```

**Secondary Text Usage** - Replace gray-500 with gray-600

```javascript
// Files to update:
// - components/ProductCard.vue: subtitle and brand text
// - components/ProductGrid.vue: empty state text
// - pages: secondary descriptions
// - Any table component: row text

// Find all instances of text-gray-500 and change to text-gray-600
// Or use new class: text-contrast-secondary
```

**Card and Component Borders**

- Current: `border-gray-200` (too light)
- Update to: `border-gray-300` or new `border-contrast-normal`
- File: `components/ProductCard.vue`, card components

**Icon Styling**

- Normal icons: `text-gray-700` or `text-gray-800` (minimum)
- Current problematic: `text-gray-400` (1.8:1 - fails)
- File: All icon usage, especially UIcon from Nuxt UI

**Empty States** - Increase visibility

```vue
<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <!-- Icon: Large, primary color -->
    <UIcon name="i-heroicons-inbox" class="w-24 h-24 text-primary-500 mb-6" />

    <!-- Heading: H3 weight -->
    <h3 class="font-display text-2xl font-bold text-contrast-normal mb-2">
      Nenhuma peça encontrada
    </h3>

    <!-- Message: body text, secondary contrast -->
    <p class="text-contrast-secondary max-w-sm mb-6">
      Não encontramos componentes para este nível de performance.
    </p>

    <!-- CTA: button or link -->
    <button class="btn-primary">Voltar</button>
  </div>
</template>
```

---

## 7. ALIGNMENT: Good alignment creates order and improves visual appeal

### Current State

**Health Score: 5/10**

Layout structure exists but lacks consistent grid-based alignment.

#### Issues Identified

**High Priority Issues:**

1. **Sidebar Misalignment**
   - Left sidebars (Builder, Guide) not aligned to same baseline as content
   - Arbitrary widths prevent proper grid alignment
   - Files: `pages/builder.vue`, `pages/guide.vue`

2. **Filter Control Alignment**
   - 4 dropdown controls not aligned to consistent widths
   - "Voltar" button floats right without grid relationship
   - Baseline misalignment between controls
   - File: Filter section on homepage/components page

3. **Column Header Misalignment (Compare)**
   - Left column (user bike) vs right column (template) headers not baseline-aligned
   - Creates visual tension
   - File: `pages/compare.vue`

4. **Button Placement Inconsistency**
   - Buttons shift position based on content wrapping (especially gallery tags)
   - No consistent alignment grid
   - File: Gallery cards, comparison view

5. **Icon Vertical Alignment**
   - Icons not vertically centered with adjacent text
   - Especially in category selectors and buttons
   - File: Components using icons + text combinations

**Medium Priority Issues:**

- Tag wrapping creates ragged alignment in gallery cards
- Table row actions (edit icons) not vertically centered
- Multi-line content causes baseline shifts

#### Recommendations by File

**[pages/builder.vue](pages/builder.vue)** - Implement grid-aligned layout

```vue
<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Left sidebar: Fixed width grid column -->
    <aside class="w-80 border-r border-contrast-normal overflow-y-auto">
      <!-- Category list -->
    </aside>

    <!-- Main content: Flex-1 to fill remaining space -->
    <main class="flex-1 overflow-y-auto">
      <!-- Empty state or product grid -->
    </main>

    <!-- Right summary: Fixed width grid column -->
    <aside
      class="w-72 border-l border-contrast-normal overflow-y-auto bg-gray-50"
    >
      <!-- Summary section -->
    </aside>
  </div>
</template>

<!-- Mobile responsive: Stack vertically with flex-col -->
<style scoped>
@media (max-width: 1024px) {
  :root > div {
    flex-direction: column;
  }
  aside {
    height: auto;
  }
}
</style>
```

**[pages/guide.vue](pages/guide.vue)** - Align sidebar with content

```vue
<!-- Same pattern as builder: flex layout with fixed sidebar width -->
<div class="flex">
  <aside class="w-72 flex-shrink-0">
    <!-- Sidebar content -->
  </aside>
  <main class="flex-1">
    <!-- Main content aligned to sidebar top -->
  </main>
</div>
```

**Filter Controls** - Create consistent grid

```vue
<!-- Filter component: grid-based alignment -->
<div class="grid grid-cols-4 gap-3 mb-6">
  <select class="col-span-1"><!-- Performance --></select>
  <select class="col-span-1"><!-- Type --></select>
  <select class="col-span-1"><!-- Brand --></select>
  <select class="col-span-1"><!-- Price Range --></select>
</div>
```

**Icon + Text Alignment** - Use flexbox baseline

```html
<!-- Good: Icon and text aligned -->
<div class="flex items-center gap-2">
  <UIcon name="i-heroicons-check" class="w-5 h-5 flex-shrink-0" />
  <span>Label text</span>
</div>

<!-- Avoid: Separate spans that drift -->
<span class="icon">✓</span>
<span>Label text</span>
```

**Tag Alignment in Cards** - Prevent wrapping issues

```html
<!-- Option 1: Single-line tags with truncation -->
<div class="flex gap-1 overflow-hidden">
  <span class="truncate">Tag 1</span>
</div>

<!-- Option 2: Collapse tags into single chip -->
<span class="badge">4 components</span>

<!-- Option 3: Fixed-height tag container -->
<div class="h-8 overflow-hidden">
  <!-- Tags with line-clamp or hidden extras -->
</div>
```

---

## 8. WHITE SPACE: Leave enough breathing room, avoid overcrowding

### Current State

**Health Score: 6/10**

Section-level spacing is good, but component-level spacing is inconsistent.

#### Issues Identified

**High Priority Issues:**

1. **Gallery Card Density**
   - Tags create visual crowding without proper spacing
   - Content padding insufficient (p-4 → p-6 or p-8)
   - Gaps between elements too tight
   - File: `components/ProductCard.vue` (gallery variant)

2. **Builder Category List**
   - Accordion items too tight vertically
   - No breathing room between sections
   - File: `pages/builder.vue` accordion rendering

3. **Admin Page Information Density**
   - Theme section cramped: 6 buttons + description + table
   - Insufficient vertical spacing between sections
   - File: `pages/admin/components.vue`

**Medium Priority Issues:**

- Filter controls row spacing could be larger (gap-3 → gap-4)
- Table row height too tight
- Card title-to-subtitle spacing too close
- Empty state padding could be more generous

#### Recommendations by File

**[components/ProductCard.vue](components/ProductCard.vue)** - Increase breathing room

```vue
<!-- Update padding and gaps -->
<div class="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm">
  <!-- Image section: generous aspect ratio -->
  <div class="aspect-square bg-gray-100 flex items-center justify-center relative">
    <img ... />
  </div>

  <!-- Content section: increased padding -->
  <div class="p-6 flex flex-col flex-grow gap-4">
    <!-- Category label: with bottom spacing -->
    <div class="text-xs font-semibold text-primary/70 uppercase">
      {{ category }}
    </div>

    <!-- Model name: with bottom spacing -->
    <h4 class="font-display font-bold text-lg">{{ model }}</h4>

    <!-- Specs or brand: with bottom spacing -->
    <p class="text-sm text-gray-600">{{ brand }}</p>

    <!-- Spacer for flex-grow -->
    <div class="flex-grow" />

    <!-- Price: with top spacing for separation -->
    <div class="border-t border-gray-200 pt-4">
      <div class="text-xs text-gray-500 mb-2">Preço</div>
      <div class="metric-large">{{ price }}</div>
    </div>
  </div>
</div>
```

**Gallery Cards** - Simplify and space better

```vue
<!-- Reduce information density -->
<div class="p-6 space-y-4">
  <!-- Brand badge (small) -->
  <div class="text-xs font-semibold text-primary/70">{{ brand }}</div>

  <!-- Title (emphasis) -->
  <h4 class="font-display font-bold text-xl">{{ title }}</h4>

  <!-- One-line description -->
  <p class="text-sm text-gray-600">{{ description }}</p>

  <!-- Spacer -->
  <div class="flex-grow" />

  <!-- Price and button: in footer section -->
  <div class="border-t border-gray-200 pt-4 flex items-end justify-between">
    <div class="metric-large">{{ price }}</div>
    <button>View</button>
  </div>
</div>
```

**[pages/builder.vue](pages/builder.vue)** - Increase category spacing

```vue
<!-- Accordion items: add vertical spacing -->
<div class="space-y-3">
  <div v-for="group in groupItems" :key="group.slot">
    <!-- Each accordion item -->
  </div>
</div>

<!-- Inside each accordion item: increase gaps -->
<div class="space-y-2 py-3">
  <!-- Category content -->
</div>
```

**[pages/admin/components.vue](pages/admin/components.vue)** - Section spacing

```vue
<!-- Add vertical spacing between major sections -->
<div class="space-y-8">
  <!-- Theme selector section -->
  <section class="border-b pb-8">
    <!-- Content -->
  </section>
  
  <!-- Import section -->
  <section class="border-b pb-8">
    <!-- Content -->
  </section>
  
  <!-- Management table -->
  <section>
    <!-- Content -->
  </section>
</div>
```

**Filter Controls** - Increase row gap

```html
<!-- Current: gap-3 (12px) -->
<!-- Update to: gap-4 (16px) for more breathing room -->
<div class="grid grid-cols-4 gap-4 mb-8">
  <!-- Filters -->
</div>
```

**Empty States** - Generous padding

```html
<div class="flex flex-col items-center justify-center py-24 px-6 text-center">
  <!-- py-24 instead of py-20 for more vertical breathing room -->
  <!-- px-6 ensures horizontal breathing room on mobile -->
</div>
```

---

## Summary: All 8 Principles

| Principle            | Score | Key Action                                         | Files to Update                                          |
| -------------------- | ----- | -------------------------------------------------- | -------------------------------------------------------- |
| **Simplicity**       | 6/10  | Group builder categories, reduce card density      | `pages/builder.vue`, `components/ProductCard.vue`        |
| **Grid System**      | 5/10  | Implement 12-column grid, fix sidebar widths       | `pages/builder.vue`, `pages/guide.vue`, `nuxt.config.ts` |
| **Visual Hierarchy** | 4/10  | Enlarge H1, emphasize metrics, add button variants | `assets/css/brand.css`, `components/ProductCard.vue`     |
| **Typography**       | 6/10  | Fix font weights, increase min text size to 14px   | `assets/css/brand.css`, all components                   |
| **Color Harmony**    | 7/10  | Fix contrast ratios, audit WCAG compliance         | `nuxt.config.ts`, `assets/css/themes.css`                |
| **Contrast**         | 5/10  | Update secondary text colors, fix icon contrast    | `assets/css/brand.css`, components                       |
| **Alignment**        | 5/10  | Use grid-based layout, fix sidebar alignment       | `pages/builder.vue`, `pages/guide.vue`                   |
| **White Space**      | 6/10  | Increase padding in cards, space sections          | `components/ProductCard.vue`, pages                      |

---

## Implementation Priority

### Phase 1: Critical Fixes (Do First)

1. Update typography scale in `brand.css` (H1 2.5rem, proper font weights)
2. Fix contrast ratios (secondary text → gray-600, borders → gray-300)
3. Emphasize key metrics (metric-large class)
4. Group builder categories (create 8-10 primary groups)

### Phase 2: Layout Restructuring

1. Implement grid-based sidebars (w-80, w-72)
2. Fix filter control alignment
3. Add responsive breakpoints for mobile

### Phase 3: Component Refinement

1. Reduce gallery card density (remove tags or collapse)
2. Increase padding and spacing globally
3. Add empty state improvements
4. Refine button visual hierarchy

### Phase 4: Polish & Testing

1. Run contrast checker on all color combinations
2. Test responsive breakpoints
3. Verify dark mode theme compliance
4. WCAG AA accessibility audit
