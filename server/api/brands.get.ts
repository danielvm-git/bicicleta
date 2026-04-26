import { db } from "../database/db";
import { components } from "../database/schema";
import {
  andComponentFilters,
  componentCatalogFilters,
} from "~/server/utils/componentCatalog";

export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event);
    const category = query.category as string;

    const filters = componentCatalogFilters({ category });
    const result = await db
      .selectDistinct({ brand: components.brand })
      .from(components)
      .where(andComponentFilters(filters))
      .orderBy(components.brand);

    return result.map((r) => r.brand).filter(Boolean);
  },
  {
    maxAge: 60 * 60,
    name: "api-brands",
    getKey: (event) => {
      const query = getQuery(event);
      return (query.category as string) || "all";
    },
  }
);
