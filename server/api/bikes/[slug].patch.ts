import { z } from "zod";
import { db } from "~/server/database/db";
import { bikes } from "~/server/database/schema";
import { and, eq } from "drizzle-orm";
import { rethrowH3Error } from "~/server/utils/http";
import { getNeonSession, getNeonUserId } from "~/server/utils/neonSession";

const patchBodySchema = z
  .object({
    isPublic: z.boolean(),
  })
  .strict();

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const session = await getNeonSession(event);
  const userId = getNeonUserId(session);
  const raw = await readBody(event);

  if (!slug || !userId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const parsed = patchBodySchema.safeParse(raw);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid body: ${parsed.error.message}`,
    });
  }
  const body = parsed.data;

  try {
    const [updated] = await db
      .update(bikes)
      .set({ isPublic: body.isPublic })
      .where(and(eq(bikes.slug, slug), eq(bikes.userId, userId)))
      .returning();

    if (!updated) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bike not found or not owned by user",
      });
    }

    return updated;
  } catch (error: unknown) {
    rethrowH3Error(error, "bikes.[slug].patch");
  }
});
