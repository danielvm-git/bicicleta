import { components } from "~/server/database/schema";
import { and, eq, ilike, or, type SQL } from "drizzle-orm";

/**
 * Standard **Component** facet + text filters (list endpoints). Keeps the catalog
 * query seam in one place.
 */
export function componentCatalogFilters(args: {
  category?: string;
  brand?: string;
  line?: string;
  search?: string;
}): SQL[] {
  const filters: SQL[] = [];
  if (args.category) {
    filters.push(eq(components.category, args.category));
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
      key.includes("api-components") ||
      key.includes("api-categories") ||
      key.includes("api-brands") ||
      key.includes("api-lines")
    ) {
      await storage.removeItem(key);
    }
  }
}
