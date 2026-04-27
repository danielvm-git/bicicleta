import { db } from "../database/db";
import { components } from "../database/schema";
import {
  andComponentFilters,
  CATALOG_CACHE_HANDLER_NAME,
  componentCatalogFilters,
} from "~/server/utils/componentCatalog";

export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event);
    const category = query.category as string;
    const brand = query.brand as string;
    const line = query.line as string;
    const search = query.search as string;
    const functionalGroup = query.functionalGroup as string;
    const performanceLevel = query.performanceLevel as string;

    const filters = componentCatalogFilters({
      category,
      brand,
      line,
      search,
      functionalGroup,
      performanceLevel,
    });
    const result = await db
      .select()
      .from(components)
      .where(andComponentFilters(filters))
      .orderBy(components.category, components.brand, components.model);

    return result;
  },
  {
    maxAge: 60 * 15,
    name: CATALOG_CACHE_HANDLER_NAME.components,
    getKey: (event) => {
      const query = getQuery(event);
      return JSON.stringify(query);
    },
  }
);
