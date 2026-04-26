import { z } from "zod";
import { db } from "~/server/database/db";
import { components } from "~/server/database/schema";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "~/server/utils/auth";
import { rethrowH3Error } from "~/server/utils/http";
import { invalidateComponentCatalogCaches } from "~/server/utils/componentCatalog";

const componentPatchBodySchema = z
  .object({
    category: z.string().optional(),
    model: z.string().optional(),
    brand: z.string().nullable().optional(),
    line: z.string().nullable().optional(),
    link: z.string().nullable().optional(),
    price: z.union([z.number(), z.string()]).optional(),
    weight: z.union([z.number(), z.string(), z.null()]).optional(),
    speeds: z.string().nullable().optional(),
    steeringType: z.string().nullable().optional(),
    axleType: z.string().nullable().optional(),
    suspensionTravel: z.string().nullable().optional(),
  })
  .strict();

function toRow(
  d: z.infer<typeof componentPatchBodySchema>
): Record<string, unknown> {
  const row: Record<string, unknown> = { updatedAt: new Date() };
  if (d.category !== undefined) row.category = d.category;
  if (d.model !== undefined) row.model = d.model;
  if (d.brand !== undefined) row.brand = d.brand;
  if (d.line !== undefined) row.line = d.line;
  if (d.link !== undefined) row.link = d.link;
  if (d.price !== undefined) row.price = String(d.price);
  if (d.weight !== undefined) {
    row.weight = d.weight === null ? null : String(d.weight);
  }
  if (d.speeds !== undefined) row.speeds = d.speeds;
  if (d.steeringType !== undefined) row.steeringType = d.steeringType;
  if (d.axleType !== undefined) row.axleType = d.axleType;
  if (d.suspensionTravel !== undefined)
    row.suspensionTravel = d.suspensionTravel;
  return row;
}

export default defineEventHandler(async (event) => {
  await requireAdminSession(event);
  const id = parseInt(getRouterParam(event, "id") || "0", 10);
  const raw = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid component ID",
    });
  }

  const parsed = componentPatchBodySchema.safeParse(raw);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid body: ${parsed.error.message}`,
    });
  }

  if (Object.keys(parsed.data).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "At least one field is required",
    });
  }

  try {
    const [updated] = await db
      .update(components)
      .set(toRow(parsed.data))
      .where(eq(components.id, id))
      .returning();

    if (!updated) {
      throw createError({
        statusCode: 404,
        statusMessage: "Component not found",
      });
    }

    await invalidateComponentCatalogCaches();

    return updated;
  } catch (error: unknown) {
    rethrowH3Error(error, "components.[id].patch");
  }
});
