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
    const brand = query.brand as string;

    const filters = componentCatalogFilters({ category, brand });
    const result = await db
      .selectDistinct({ line: components.line })
      .from(components)
      .where(andComponentFilters(filters))
      .orderBy(components.line);

    return result.map((r) => r.line).filter(Boolean);
  },
  {
    maxAge: 60 * 60,
    name: "api-lines",
    getKey: (event) => {
      const query = getQuery(event);
      const c = (query.category as string) || "";
      const b = (query.brand as string) || "";
      return `${c}:${b}`;
    },
  }
);
