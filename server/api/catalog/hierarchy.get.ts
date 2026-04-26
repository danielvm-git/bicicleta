import { db } from "../../database/db";
import { components } from "../../database/schema";
import { CATALOG_CACHE_HANDLER_NAME } from "~/server/utils/componentCatalog";
import { asc } from "drizzle-orm";

export default defineCachedEventHandler(
  async (event) => {
    const result = await db
      .selectDistinct({
        group: components.functionalGroup,
        category: components.category,
      })
      .from(components)
      .orderBy(asc(components.functionalGroup), asc(components.category));

    // Group the results: { "Group": ["Category1", "Category2"] }
    const hierarchy: Record<string, string[]> = {};

    for (const row of result) {
      const groupName = row.group || "Outros";
      if (!hierarchy[groupName]) {
        hierarchy[groupName] = [];
      }
      if (row.category) {
        hierarchy[groupName].push(row.category);
      }
    }

    return hierarchy;
  },
  {
    maxAge: 60 * 60,
    name: CATALOG_CACHE_HANDLER_NAME.hierarchy,
  }
);
