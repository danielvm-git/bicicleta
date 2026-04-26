import { db } from "../database/db";
import { components } from "../database/schema";
import { eq, and, ilike, or } from "drizzle-orm";

export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event);
    const category = query.category as string;
    const brand = query.brand as string;
    const line = query.line as string;
    const search = query.search as string;

    let filters = [];
    if (category) {
      filters.push(eq(components.category, category));
    }
    if (brand) {
      filters.push(eq(components.brand, brand));
    }
    if (line) {
      filters.push(eq(components.line, line));
    }
    if (search) {
      filters.push(
        or(
          ilike(components.model, `%${search}%`),
          ilike(components.brand, `%${search}%`),
          ilike(components.line, `%${search}%`)
        )
      );
    }

    const result = await db
      .select()
      .from(components)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(components.category, components.brand, components.model);

    return result;
  },
  {
    maxAge: 60 * 15,
    name: "api-components",
    getKey: (event) => {
      const query = getQuery(event);
      return JSON.stringify(query);
    },
  }
);
