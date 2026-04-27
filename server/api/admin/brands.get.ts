import { db } from "../../database/db";
import { brands, components, groups } from "../../database/schema";
import { count, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const brandsList = await db.select().from(brands).orderBy(brands.name);

  // Get component count for each brand
  const brandResults = await Promise.all(
    brandsList.map(async (brand) => {
      const [componentCount] = await db
        .select({ count: count() })
        .from(components)
        .where(eq(components.brand, brand.id));

      return {
        ...brand,
        componentCount: componentCount?.count || 0,
      };
    })
  );

  return brandResults;
});
