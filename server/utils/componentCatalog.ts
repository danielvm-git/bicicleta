import { components } from "~/server/database/schema";
import { and, eq, ilike, or, type SQL } from "drizzle-orm";

/**
 * `name` on `defineCachedEventHandler` for each catalog endpoint — single source of truth
 * so invalidation stays aligned with handlers.
 */
export const CATALOG_CACHE_HANDLER_NAME = {
  components: "api-components",
  categories: "api-categories",
  brands: "api-brands",
  lines: "api-lines",
  hierarchy: "api-hierarchy",
} as const;

/**
 * Standard **Component** facet + text filters (list endpoints). Keeps the catalog
 * query seam in one place.
 */
export function componentCatalogFilters(args: {
  category?: string;
  brand?: string;
  line?: string;
  search?: string;
  functionalGroup?: string;
  performanceLevel?: string;
}): SQL[] {
  const filters: SQL[] = [];
  if (args.category) {
    filters.push(eq(components.category, args.category));
  }
  if (args.functionalGroup) {
    filters.push(eq(components.functionalGroup, args.functionalGroup));
  }
  if (args.performanceLevel) {
    filters.push(eq(components.performanceLevel, args.performanceLevel));
  }
  if (args.brand) {
    filters.push(eq(components.brand, args.brand));
  }
  if (args.line) {
    filters.push(eq(components.line, args.line));
  }
  if (args.search) {
    filters.push(
      or(
        ilike(components.model, `%${args.search}%`),
        ilike(components.brand, `%${args.search}%`),
        ilike(components.line, `%${args.search}%`)
      )!
    );
  }
  return filters;
}

export function andComponentFilters(filters: SQL[]): SQL<unknown> | undefined {
  if (filters.length === 0) {
    return undefined;
  }
  return and(...filters);
}

/** Top-of-page search: components match model or brand (narrower than list search). */
export function globalSearchComponentsWhere(query: string) {
  return or(
    ilike(components.model, `%${query}%`),
    ilike(components.brand, `%${query}%`)
  )!;
}

export async function invalidateComponentCatalogCaches() {
  const storage = useStorage("cache");
  const keys = await storage.getKeys();
  for (const key of keys) {
    if (
      Object.values(CATALOG_CACHE_HANDLER_NAME).some((n) => key.includes(n))
    ) {
      await storage.removeItem(key);
    }
  }
}
