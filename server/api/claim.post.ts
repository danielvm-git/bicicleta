import { db } from "~/server/database/db";
import { bikes } from "~/server/database/schema";
import { inArray, isNull, and } from "drizzle-orm";
import { getNeonSession, getNeonUserId } from "~/server/utils/neonSession";
import { rethrowH3Error } from "~/server/utils/http";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = await getNeonSession(event);
  const userId = getNeonUserId(session);

  if (!userId || !body.ids || !Array.isArray(body.ids)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Unauthorized or missing IDs",
    });
  }

  try {
    const updated = await db
      .update(bikes)
      .set({ userId })
      .where(and(inArray(bikes.id, body.ids), isNull(bikes.userId)))
      .returning();

    return { success: true, count: updated.length };
  } catch (error: unknown) {
    rethrowH3Error(error, "claim.post");
  }
});
