import { db } from "../../../database/db";
import { brands, components } from "../../../database/schema";
import { eq, count } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Brand ID is required",
    });
  }

  // Check if brand exists
  const existingBrand = await db
    .select()
    .from(brands)
    .where(eq(brands.id, id))
    .limit(1);

  if (existingBrand.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: `Brand with ID "${id}" not found`,
    });
  }

  // Check how many components use this brand
  const [componentCount] = await db
    .select({ count: count() })
    .from(components)
    .where(eq(components.brand, id));

  const usageCount = componentCount?.count || 0;

  try {
    // Delete the brand - cascade delete handled by DB or returns warning in response
    const result = await db.delete(brands).where(eq(brands.id, id)).returning();

    return {
      success: true,
      deleted: result[0],
      warning:
        usageCount > 0
          ? `This brand was used by ${usageCount} component(s) which still reference it`
          : undefined,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete brand: ${error.message}`,
    });
  }
});
