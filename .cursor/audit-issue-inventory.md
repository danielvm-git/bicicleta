# Design Audit Issue Inventory

**Generated:** April 27, 2026  
**Scope:** All 7 pages audited  
**Overall Health Score:** 65/100

## Issue Summary by Severity

- **High Priority:** 14 issues (blocks usability/clarity)
- **Medium Priority:** 18 issues (degrades experience)
- **Low Priority:** 13 issues (refinement opportunities)
- **Total:** 45 issues identified

---

## HIGH PRIORITY ISSUES (14 Total)

### 1. Weak Visual Hierarchy for Primary Metrics

**Severity:** HIGH  
**Affected Principles:** Visual Hierarchy, Typography  
**Impact:** Users cannot quickly identify key information (prices, totals)  
**Pages:** Builder, Compare, Gallery, Admin

| File                         | Location                          | Issue                          | Fix                                       |
| ---------------------------- | --------------------------------- | ------------------------------ | ----------------------------------------- |
| `components/ProductCard.vue` | Card content section              | Price same size as brand/model | Create `metric-large` class: 2rem, fw-800 |
| `pages/builder.vue`          | Summary section, "Total Estimado" | Price hidden in regular text   | Highlight in card with background color   |
| `pages/compare.vue`          | Total estimate display            | Price not emphasized           | Use metric-large class + icon             |
| `pages/admin/components.vue` | Table totals                      | Values not distinct            | Bold, larger font (18px+)                 |

**Effort:** 1-2 hours  
**Files to Update:**

- `assets/css/brand.css` (add metric-large class)
- `components/ProductCard.vue` (apply class to prices)
- `pages/builder.vue` (update summary styling)

---

### 2. Text Contrast Failures (WCAG AA)

**Severity:** HIGH  
**Affected Principles:** Contrast, Color Harmony  
**Impact:** Text may be unreadable; fails accessibility compliance  
**Pages:** All pages (secondary text), Builder, Compare, Guide, Gallery, Admin

| File                  | Issue                          | Current Color       | Issue                  | Fix                                   |
| --------------------- | ------------------------------ | ------------------- | ---------------------- | ------------------------------------- |
| Global secondary text | Secondary text color too light | Gray-500 (#888)     | 3.2:1 contrast (fails) | Change to Gray-600 (#78716b): 4.8:1 ✓ |
| Card borders          | Borders invisible on white     | Gray-200 (#E5E5E5)  | 1.5:1 (fails)          | Change to Gray-300 (#D1D5DB): 3.5:1 ✓ |
| Icon colors           | Icon visibility poor           | Gray-400 (#A8A29E)  | 2:1 (fails)            | Use Gray-700/800: 8+:1 ✓              |
| Disabled buttons      | Disabled state unclear         | Gray-500 text       | Insufficient contrast  | Add background + border styling       |
| Category tags         | Tags hard to read              | Light gray on white | ~3:1 ratio             | Use primary/80 or darker gray         |

**Effort:** 2-3 hours  
**Files to Update:**

- `nuxt.config.ts` (update color palette)
- `assets/css/brand.css` (add contrast utility classes)
- All components using `text-gray-500` (replace with `text-gray-600`)

---

### 3. Builder Page: Component Category Overload

**Severity:** HIGH  
**Affected Principles:** Simplicity, Visual Hierarchy, Grid System  
**Impact:** 37 uncategorized items cause cognitive overload; users struggle to navigate  
**Pages:** Builder

| File                | Issue                                   | Current State           | Problem                  | Fix                                               |
| ------------------- | --------------------------------------- | ----------------------- | ------------------------ | ------------------------------------------------- |
| `pages/builder.vue` | Category list (lines 65-80, ~496 lines) | 37 flat accordion items | No grouping or hierarchy | Create 8-10 primary groups with nested categories |

**Specific Categories to Group:**

```
Proposed Structure:
├── Rodas (3-4 items: Aro, Cubo, Raio)
├── Transmissão (6 items: Cassete, Corrente, Câmbio Dianteiro, etc.)
├── Cockpit (5 items: Guidão, Mesa, Canote, Selim, Manopla)
├── Suspensão (4 items: Garfo, Amortecedor, Bieleta, etc.)
├── Sistema de Frenagem (3-4 items: Freio V-Brake, Freio Disco, etc.)
├── Pneu e Câmara (2-3 items)
└── Acessórios & Acabamento (remaining items)
```

**Effort:** 3-4 hours  
**Files to Update:**

- `pages/builder.vue` (refactor accordion data structure)
- `components/CategorySidebar.vue` (if exists) or create new
- API response parsing (if needed)

---

### 4. Gallery Page: Card Information Overload

**Severity:** HIGH  
**Affected Principles:** Simplicity, Visual Hierarchy, White Space  
**Impact:** Cards feel crowded; users cannot quickly identify key info (title, brand, price)  
**Pages:** Gallery

| File                                           | Issue                       | Current                                                    | Problem                                | Fix                                                                 |
| ---------------------------------------------- | --------------------------- | ---------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| `components/ProductCard.vue` (gallery variant) | Card content density        | 6+ elements: title, 2-3 subtitles, price, 4-6 tags, button | Visual noise; tags consume 30% of card | Option 1: Remove tags; Option 2: Collapse to single "Category" chip |
| Gallery card padding                           | Insufficient breathing room | p-4 (16px)                                                 | Cards feel cramped                     | Increase to p-6 or p-8 (24-32px)                                    |
| Tag styling                                    | Tags too small and numerous | text-xs, inline                                            | Hard to read; wrap inconsistently      | Use single badge "3 Categories" or remove entirely                  |

**Effort:** 2-3 hours  
**Files to Update:**

- `components/ProductCard.vue` (create gallery variant with simpler layout)
- `pages/gallery.vue` (adjust card rendering)

---

### 5. Admin Components Page: Misaligned Primary Function

**Severity:** HIGH  
**Affected Principles:** Simplicity, Visual Hierarchy, Information Architecture  
**Impact:** Theme selector dominates page; primary function (component management) below fold  
**Pages:** Admin

| File                         | Issue                    | Current                                       | Problem                                    | Fix                                                                     |
| ---------------------------- | ------------------------ | --------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------- |
| `pages/admin/components.vue` | Information architecture | Theme section (40%+ of viewport) before table | User has to scroll to see primary function | Move theme selector to collapsed panel or separate /admin/settings page |
| Theme buttons                | Visual weight            | 6 prominent color buttons + description       | Creates visual chaos                       | Collapse to dropdown or simple list                                     |

**Effort:** 2-3 hours  
**Files to Update:**

- `pages/admin/components.vue` (restructure layout)
- Possibly: Create `pages/admin/settings.vue` for theme management

---

### 6. H1 Headings Consistently Undersized

**Severity:** HIGH  
**Affected Principles:** Visual Hierarchy, Typography  
**Impact:** Users cannot quickly identify page context; pages feel underdeveloped  
**Pages:** All pages

| File                   | Issue                 | Current     | Problem                           | Fix                                         |
| ---------------------- | --------------------- | ----------- | --------------------------------- | ------------------------------------------- |
| `assets/css/brand.css` | H1 size (lines 32-35) | 2rem (32px) | Too small for primary page titles | Increase to 2.5rem (40px) or 2.75rem (44px) |

**Effort:** 0.5 hours  
**Files to Update:**

- `assets/css/brand.css` (lines 32-35: update h1 font-size)

---

### 7. Gallery Card Tags: Low Contrast and Overcrowded

**Severity:** HIGH  
**Affected Principles:** Contrast, White Space, Simplicity  
**Impact:** Tags illegible; visual clutter; difficult to parse card information  
**Pages:** Gallery

| File                         | Issue                 | Current                       | Problem                               | Fix                                                   |
| ---------------------------- | --------------------- | ----------------------------- | ------------------------------------- | ----------------------------------------------------- |
| `components/ProductCard.vue` | Category tags styling | Light gray (#9CA3AF) on white | 3:1 contrast; too many tags (4-6)     | Use primary color + semibold OR reduce to single chip |
| Tag wrapping                 | Alignment issues      | Tags wrap inconsistently      | Button position shifts; ragged layout | Collapse to single badge or fixed-height container    |

**Effort:** 1-2 hours  
**Files to Update:**

- `components/ProductCard.vue` (simplify tag rendering)

---

### 8. No Visual Indication of Selected State

**Severity:** HIGH  
**Affected Principles:** Visual Hierarchy, Contrast  
**Impact:** Users cannot confirm their selections; unclear which tier/filter is active  
**Pages:** Guide

| File              | Issue                 | Current                             | Problem                       | Fix                                                  |
| ----------------- | --------------------- | ----------------------------------- | ----------------------------- | ---------------------------------------------------- |
| `pages/guide.vue` | Tier selector buttons | Three buttons, no active indication | User unsure which is selected | Add filled background + bold text for active state   |
| Category filters  | Filter buttons        | No visual distinction for active    | User unsure what's filtered   | Bold text + underline or background color for active |

**Effort:** 1 hour  
**Files to Update:**

- `pages/guide.vue` (add active state styling)

---

### 9. Empty States Low Visibility

**Severity:** HIGH  
**Affected Principles:** Visual Hierarchy, Typography, White Space  
**Impact:** Users confused about empty state (no data vs. loading vs. error)  
**Pages:** Builder, Compare, Guide

| File                   | Issue     | Current                  | Problem                      | Fix                              |
| ---------------------- | --------- | ------------------------ | ---------------------------- | -------------------------------- |
| Empty state components | Icon size | ~48px                    | Too small; low visual impact | Increase to 100-120px            |
| Empty state message    | Text size | Same as body text (16px) | Not emphasized               | Use h3 or larger (24-28px)       |
| Empty state layout     | Spacing   | Standard padding         | Could be more generous       | Use py-24 + centered flex layout |

**Effort:** 1-2 hours  
**Files to Update:**

- Create `components/EmptyState.vue` component or update existing
- Pages using empty states

---

### 10. Inconsistent Font Weight Usage

**Severity:** HIGH  
**Affected Principles:** Typography, Visual Hierarchy  
**Impact:** No clear pattern for importance; creates visual confusion  
**Pages:** All pages

| File   | Issue             | Current                                | Problem                   | Fix                                                                            |
| ------ | ----------------- | -------------------------------------- | ------------------------- | ------------------------------------------------------------------------------ |
| Global | Font weight scale | Mix of 400/500/600/700 without pattern | Unclear what weight means | Document & enforce pattern: 400=regular, 600=labels, 700=headings, 800=display |

**Effort:** 2-3 hours  
**Files to Update:**

- `assets/css/brand.css` (add font-weight scale documentation)
- All components (standardize usage)

---

### 11. Sidebar Widths Arbitrary (Not Grid-Based)

**Severity:** HIGH  
**Affected Principles:** Grid System, Alignment  
**Impact:** Sidebars don't snap to grid; creates alignment issues  
**Pages:** Builder, Guide

| File                | Issue              | Current                 | Problem                     | Fix                                                 |
| ------------------- | ------------------ | ----------------------- | --------------------------- | --------------------------------------------------- |
| `pages/builder.vue` | Left sidebar width | ~280px or unconstrained | Not on 12-column grid       | Use `w-80` (320px) - Tailwind grid column           |
| `pages/guide.vue`   | Sidebar width      | Arbitrary               | Not aligned to content grid | Use `w-72` (288px) - consistent with other sidebars |

**Effort:** 1 hour  
**Files to Update:**

- `pages/builder.vue` (apply w-80 class to left sidebar)
- `pages/guide.vue` (apply w-72 class)

---

### 12. Disabled Button States Unclear

**Severity:** HIGH  
**Affected Principles:** Contrast, Visual Hierarchy  
**Impact:** Users unsure if buttons are interactive or not  
**Pages:** Builder, Admin

| File                     | Issue          | Current          | Problem                         | Fix                                                         |
| ------------------------ | -------------- | ---------------- | ------------------------------- | ----------------------------------------------------------- |
| Button component styling | Disabled state | opacity-50 alone | Insufficient visual distinction | Add: reduced color, cursor-not-allowed, border color change |

**Effort:** 0.5 hours  
**Files to Update:**

- `assets/css/brand.css` (add button disabled styling)
- Tailwind config for button disabled states

---

### 13. Table Text Size Below 14px Minimum

**Severity:** HIGH  
**Affected Principles:** Typography, Contrast  
**Impact:** Table text hard to read; fails readability standards  
**Pages:** Homepage (components table), Admin

| File        | Issue     | Current | Problem               | Fix                                          |
| ----------- | --------- | ------- | --------------------- | -------------------------------------------- |
| Table cells | Text size | 12-13px | Below WCAG AA minimum | Increase to 14px minimum (text-sm or larger) |

**Effort:** 1 hour  
**Files to Update:**

- Any component rendering tables
- `pages/index.vue` or components listing

---

### 14. "Voltar" Button Placement Unclear

**Severity:** HIGH  
**Affected Principles:** Alignment, Grid System  
**Impact:** Button floats without clear relationship to content  
**Pages:** Homepage (possibly multiple pages)

| File               | Issue           | Current       | Problem                    | Fix                                      |
| ------------------ | --------------- | ------------- | -------------------------- | ---------------------------------------- |
| Filter/header area | "Voltar" button | Floated right | Not aligned to layout grid | Use grid layout: reserve cell for button |

**Effort:** 0.5 hours  
**Files to Update:**

- Filter component or page header

---

## MEDIUM PRIORITY ISSUES (18 Total)

### M1. Filter Controls Not Grid-Aligned

**Severity:** MEDIUM | **Pages:** Homepage, Guide | **Principle:** Grid System, Alignment

**Issues:**

- 4 dropdown controls have varying widths based on content
- No consistent width grid
- Baseline misalignment between controls

**Fix:**

- Use `grid grid-cols-4 gap-4` on desktop
- `grid-cols-2` on tablet, `grid-cols-1` on mobile

**Files:** Filter component or page header

---

### M2. Inconsistent Dropdown/Button Widths

**Severity:** MEDIUM | **Pages:** Homepage, Compare | **Principle:** Grid System, Alignment

**Issues:**

- Dropdowns auto-size based on text length
- Creates visual imbalance

**Fix:**

- Set `min-w-[200px]` or `w-full` within grid
- Use consistent font sizing

**Files:** Component styling

---

### M3. Secondary Text Same Size as Primary Content

**Severity:** MEDIUM | **Pages:** Brands, Gallery, Admin | **Principle:** Typography, Visual Hierarchy

**Issues:**

- Subtitles (e.g., "Ver matriz...") same 16px as titles
- Hard to distinguish content hierarchy

**Fix:**

- Subtitles: 14px (`text-sm`)
- Titles: 18px+ (`text-lg`)

**Files:** `components/ProductCard.vue`, brand page components

---

### M4. Card Borders Too Subtle

**Severity:** MEDIUM | **Pages:** Brands, Gallery | **Principle:** Contrast, Visual Hierarchy

**Issues:**

- Borders: `border-gray-200` (too light)
- Nearly invisible against white

**Fix:**

- Change to `border-gray-300` or create `border-contrast-normal` class

**Files:** Card components

---

### M5. Category Buttons: Outline Too Light

**Severity:** MEDIUM | **Pages:** Guide | **Principle:** Contrast

**Issues:**

- Category filter buttons have light gray outlines
- Low contrast; hard to see

**Fix:**

- Use `border-gray-400` or darker
- Add background color on hover/active

**Files:** `pages/guide.vue` category selector

---

### M6. Mobile Breakpoint Responsiveness

**Severity:** MEDIUM | **Pages:** Builder, Guide | **Principle:** Grid System, Alignment

**Issues:**

- Multi-column layouts break on mobile without clear transition
- No smooth adaptation to smaller screens

**Fix:**

- Add `@media` breakpoints for mobile/tablet/desktop
- Verify `sm:/lg:/xl:` Tailwind classes active

**Files:** Pages with multi-column layouts

---

### M7. Tag Wrapping Creates Ragged Alignment

**Severity:** MEDIUM | **Pages:** Gallery | **Principle:** Alignment, White Space

**Issues:**

- Tags wrap inconsistently
- Button position shifts based on tag count

**Fix:**

- Collapse tags to single chip
- OR use fixed-height container with overflow
- OR remove tags entirely from card

**Files:** `components/ProductCard.vue`

---

### M8. Table Headers Not Emphasized

**Severity:** MEDIUM | **Pages:** Homepage, Admin | **Principle:** Visual Hierarchy, Typography

**Issues:**

- Table headers same weight as row data
- No visual distinction

**Fix:**

- Headers: semibold (fw-600), uppercase, larger (16px)
- Use background color (`bg-gray-50`)

**Files:** Table components

---

### M9. Page Descriptions Undersized

**Severity:** MEDIUM | **Pages:** Brands, Guide | **Principle:** Typography, Visual Hierarchy

**Issues:**

- Description text below page titles: 16px
- Should be larger for prominence

**Fix:**

- Use 18px or larger (`text-lg`)
- Consider semibold weight

**Files:** Page content

---

### M10. Icon Vertical Alignment with Text

**Severity:** MEDIUM | **Pages:** Guide, Gallery | **Principle:** Alignment

**Issues:**

- Icons not vertically centered with adjacent text
- Creates visual tension

**Fix:**

- Use `flex items-center gap-2` for icon + text pairs
- Ensure icon size matches line height

**Files:** Components with icon + text combinations

---

### M11. Toolbar Icons Lack Labels

**Severity:** MEDIUM | **Pages:** Builder | **Principle:** Simplicity, Accessibility

**Issues:**

- Icon-only buttons (save, delete, etc.)
- Users unsure what they do

**Fix:**

- Add tooltip on hover: `title="Save Bike"`
- OR add label text below icon

**Files:** `pages/builder.vue` toolbar

---

### M12. Three-Column Layout Breaks Unpredictably

**Severity:** MEDIUM | **Pages:** Builder | **Principle:** Grid System, Alignment

**Issues:**

- Sidebar | content | sidebar layout lacks responsive strategy
- No clear mobile transition

**Fix:**

- Use `grid grid-cols-1 lg:grid-cols-3` pattern
- OR use flex with responsive direction

**Files:** `pages/builder.vue` layout

---

### M13. Accordion Item Hierarchy Flat

**Severity:** MEDIUM | **Pages:** Builder | **Principle:** Visual Hierarchy, Simplicity

**Issues:**

- All accordion items same visual weight
- No distinction for selected/important items

**Fix:**

- Add bold text or background color for selected items
- Add completion percentage or check marks

**Files:** `pages/builder.vue` accordion

---

### M14. Line Height Not Optimized

**Severity:** MEDIUM | **Pages:** All | **Principle:** Typography

**Issues:**

- Body text line height: inconsistent (appears 1.4-1.5)
- Should be 1.6 for readability

**Fix:**

- Add global `body { line-height: 1.6; }`
- Headings: 1.1-1.2 (tighter)

**Files:** `assets/css/brand.css`

---

### M15. Tier Selector Button Active State

**Severity:** MEDIUM | **Pages:** Guide | **Principle:** Visual Hierarchy, Contrast

**Issues:**

- Three tier buttons (Entry, Intermediate, Advanced)
- No clear indication of which is selected

**Fix:**

- Active: Filled background, white text, bold
- Inactive: Outline style

**Files:** `pages/guide.vue` tier selector

---

### M16. Comparison Column Headers Misaligned

**Severity:** MEDIUM | **Pages:** Compare | **Principle:** Alignment

**Issues:**

- Left column (user bike) and right column (template) headers not baseline-aligned
- Creates visual tension

**Fix:**

- Use grid layout with equal header heights
- `grid grid-cols-2 gap-4`

**Files:** `pages/compare.vue`

---

### M17. Redundant Labels

**Severity:** MEDIUM | **Pages:** Guide | **Principle:** Simplicity

**Issues:**

- "(Nível: Entry)" label redundant with tier button state
- Reduces visual simplicity

**Fix:**

- Remove redundant label
- Show in summary only if needed

**Files:** `pages/guide.vue`

---

### M18. Empty State Icon Color

**Severity:** MEDIUM | **Pages:** Builder, Compare, Guide | **Principle:** Visual Hierarchy, Contrast

**Issues:**

- Icons: Gray color (low prominence)
- Should use primary color for visibility

**Fix:**

- Change icon color to `text-primary-500`
- Increase size to 100-120px

**Files:** Empty state components

---

## LOW PRIORITY ISSUES (13 Total)

### L1. Insufficient Padding Between Tags

**Severity:** LOW | **Pages:** Gallery | **Principle:** White Space

**Fix:** Increase gap between tags from `gap-1` to `gap-2`

---

### L2. Toolbar Icon Labels Missing

**Severity:** LOW | **Pages:** Builder | **Principle:** Accessibility

**Fix:** Add aria-labels or tooltips to icon buttons

---

### L3. Card Content-to-Button Spacing

**Severity:** LOW | **Pages:** Gallery | **Principle:** White Space

**Fix:** Add `mt-auto` to button; increase vertical gap

---

### L4. Theme Button Sizing Inconsistent

**Severity:** LOW | **Pages:** Admin | **Principle:** Grid System

**Fix:** Use fixed width for theme buttons (`w-32` or grid-based)

---

### L5. Focus State Visibility

**Severity:** LOW | **Pages:** All | **Principle:** Accessibility

**Fix:** Add clear focus outline (3px solid primary color)

---

### L6. Dark Mode Color Harmony

**Severity:** LOW | **Pages:** All themes | **Principle:** Color Harmony

**Fix:** Audit each theme variant for contrast and readability

---

### L7. Hover State Consistency

**Severity:** LOW | **Pages:** All | **Principle:** Consistency

**Fix:** Ensure all interactive elements have visible hover state

---

### L8. Line Length Optimization

**Severity:** LOW | **Pages:** Pages with long-form text | **Principle:** Typography

**Fix:** Limit line length to 45-75 characters for readability

---

### L9. Category Icon Alignment

**Severity:** LOW | **Pages:** Guide | **Principle:** Alignment

**Fix:** Vertically center icons with category labels

---

### L10. Border Radius Consistency

**Severity:** LOW | **Pages:** All | **Principle:** Consistency

**Fix:** Standardize border-radius: `rounded-lg` (8px) for cards, `rounded-md` (6px) for inputs

---

### L11. Button Icon Positioning

**Severity:** LOW | **Pages:** Multiple | **Principle:** Alignment

**Fix:** Ensure icons in buttons are consistently positioned and sized

---

### L12. Scroll Behavior on Mobile

**Severity:** LOW | **Pages:** Builder | **Principle:** User Experience

**Fix:** Test sidebar scrolling behavior on mobile screens

---

### L13. Color-Only Status Indication

**Severity:** LOW | **Pages:** All | **Principle:** Accessibility

**Fix:** Don't rely on color alone for status; add text labels or icons

---

## Issue Summary Table

| #      | Issue                             | Severity | Pages                            | Principles               | Est. Effort | Files                                  |
| ------ | --------------------------------- | -------- | -------------------------------- | ------------------------ | ----------- | -------------------------------------- |
| H1     | Weak visual hierarchy for metrics | HIGH     | Builder, Compare, Gallery, Admin | VH, Typo                 | 1-2h        | ProductCard, brand.css                 |
| H2     | Text contrast failures (WCAG)     | HIGH     | All                              | Contrast, CH             | 2-3h        | nuxt.config, brand.css, all components |
| H3     | Builder category overload         | HIGH     | Builder                          | Simplicity, VH, Grid     | 3-4h        | pages/builder.vue                      |
| H4     | Gallery card density              | HIGH     | Gallery                          | Simplicity, VH, WS       | 2-3h        | ProductCard                            |
| H5     | Admin page misaligned priority    | HIGH     | Admin                            | Simplicity, VH           | 2-3h        | pages/admin/components.vue             |
| H6     | H1 headings undersized            | HIGH     | All                              | VH, Typo                 | 0.5h        | brand.css                              |
| H7     | Gallery tags low contrast         | HIGH     | Gallery                          | Contrast, WS, Simplicity | 1-2h        | ProductCard                            |
| H8     | No active state indication        | HIGH     | Guide                            | VH, Contrast             | 1h          | pages/guide.vue                        |
| H9     | Empty states low visibility       | HIGH     | Builder, Compare, Guide          | VH, Typo, WS             | 1-2h        | Empty state components                 |
| H10    | Inconsistent font weights         | HIGH     | All                              | Typo, VH                 | 2-3h        | brand.css, all components              |
| H11    | Sidebar widths arbitrary          | HIGH     | Builder, Guide                   | Grid, Alignment          | 1h          | pages/builder.vue, pages/guide.vue     |
| H12    | Disabled button states unclear    | HIGH     | Builder, Admin                   | Contrast, VH             | 0.5h        | brand.css                              |
| H13    | Table text < 14px minimum         | HIGH     | Homepage, Admin                  | Typo, Contrast           | 1h          | Table components                       |
| H14    | "Voltar" button placement unclear | HIGH     | Homepage                         | Alignment, Grid          | 0.5h        | Filter component                       |
| M1-M18 | (18 medium issues)                | MEDIUM   | Various                          | Multiple                 | 12-15h      | Various                                |
| L1-L13 | (13 low issues)                   | LOW      | Various                          | Multiple                 | 3-5h        | Various                                |

---

## Implementation Roadmap

### Week 1: High Priority (14 issues, ~20 hours)

1. Update H1 sizing and typography scale (`brand.css`)
2. Fix contrast ratios (secondary text colors, borders)
3. Emphasize key metrics across pages
4. Group builder categories
5. Restructure admin page layout
6. Add active state indicators (Guide page)

### Week 2: Medium Priority (18 issues, ~15 hours)

1. Fix grid alignment (sidebars, filters)
2. Implement responsive breakpoints
3. Update table and tag styling
4. Refactor gallery cards
5. Add empty state improvements

### Week 3: Low Priority (13 issues, ~5 hours)

1. Polish: focus states, hover effects
2. Dark mode audits
3. Accessibility refinements
4. Fine-tune spacing and padding

**Total Estimated Effort:** 40 hours (~1 full-time week)
