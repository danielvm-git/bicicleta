import { db } from "../../../../database/db";
import { brands } from "../../../../database/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

const ALLOWED_TYPES = [
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/webp",
];
const MAX_FILE_SIZE = 1024 * 1024; // 1MB

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

  try {
    const form = await readMultipartFormData(event);

    if (!form) {
      throw createError({
        statusCode: 400,
        statusMessage: "No file provided",
      });
    }

    const fileField = form.find((field) => field.name === "logo");

    if (!fileField) {
      throw createError({
        statusCode: 400,
        statusMessage: "No file field named 'logo' provided",
      });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(fileField.type || "")) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
      });
    }

    // Validate file size
    if (fileField.data && fileField.data.length > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        statusMessage: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024}KB`,
      });
    }

    // Get file extension
    const ext = fileField.type?.includes("svg")
      ? "svg"
      : fileField.filename?.split(".").pop() || "png";

    // Create filename: {brand-id}.{ext}
    const filename = `${id}.${ext}`;

    // Save file to public/brands directory
    const publicDir = path.join(process.cwd(), "public", "brands");

    // Create directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, filename);
    await fs.promises.writeFile(filePath, fileField.data);

    // Update brand with logo filename
    const result = await db
      .update(brands)
      .set({
        logoFilename: filename,
        updatedAt: new Date(),
      })
      .where(eq(brands.id, id))
      .returning();

    return {
      success: true,
      brand: result[0],
      logoUrl: `/brands/${filename}`,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to upload logo: ${error.message}`,
    });
  }
});
