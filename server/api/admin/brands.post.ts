import { db } from "../../database/db";
import { brands } from "../../database/schema";

function generateBrandId(name: string): string {
  // Normalize: lowercase, trim, replace spaces with nothing
  return name.toLowerCase().trim().replace(/\s+/g, "");
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate input
  if (!body.name || typeof body.name !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Brand name is required",
    });
  }

  if (!body.url || typeof body.url !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Brand URL is required",
    });
  }

  // Generate or use provided ID
  let id = body.id || generateBrandId(body.name);

  // Validate URL format
  try {
    new URL(body.url);
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid URL format",
    });
  }

  try {
    const result = await db
      .insert(brands)
      .values({
        id,
        name: body.name,
        url: body.url,
        logoFilename: body.logoFilename || null,
      })
      .returning();

    return result[0];
  } catch (error: any) {
    if (error.message?.includes("unique constraint")) {
      throw createError({
        statusCode: 409,
        statusMessage: `Brand with name "${body.name}" or ID "${id}" already exists`,
      });
    }
    throw error;
  }
});
