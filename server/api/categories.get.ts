import { db } from "../database/db";
import { components } from "../database/schema";
import { CATALOG_CACHE_HANDLER_NAME } from "~/server/utils/componentCatalog";

export default defineCachedEventHandler(
  async (event) => {
    const result = await db
      .selectDistinct({ category: components.category })
      .from(components)
      .orderBy(components.category);

    return result.map((r) => r.category).filter(Boolean);
  },
  {
    maxAge: 60 * 60,
    name: CATALOG_CACHE_HANDLER_NAME.categories,
  }
);
