import { db } from "../../../database/db";
import { brands } from "../../../database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Brand ID is required",
    });
  }

  const body = await readBody(event);

  // Validate URL if provided
  if (body.url) {
    try {
      new URL(body.url);
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid URL format",
      });
    }
  }

  // Prevent ID changes
  if (body.id && body.id !== id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot change brand ID",
    });
  }

  try {
    const result = await db
      .update(brands)
      .set({
        name: body.name,
        url: body.url,
        logoFilename: body.logoFilename,
        updatedAt: new Date(),
      })
      .where(eq(brands.id, id))
      .returning();

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `Brand with ID "${id}" not found`,
      });
    }

    return result[0];
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    if (error.message?.includes("unique constraint")) {
      throw createError({
        statusCode: 409,
        statusMessage: `Brand name already exists`,
      });
    }
    throw error;
  }
});
