import { db } from "../database/db";
import { components } from "../database/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const category = query.category as string;
  const brand = query.brand as string;

  let filters = [];
  if (category) {
    filters.push(eq(components.category, category));
  }
  if (brand) {
    filters.push(eq(components.brand, brand));
  }

  const result = await db
    .selectDistinct({ line: components.line })
    .from(components)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(components.line);

  return result.map((r) => r.line).filter(Boolean);
});
