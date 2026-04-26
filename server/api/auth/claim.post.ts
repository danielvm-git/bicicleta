import { db } from "~/server/database/db";
import { bikes } from "~/server/database/schema";
import { inArray, isNull, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const body = await readBody(event);

  if (!session.user?.githubId || !body.ids || !Array.isArray(body.ids)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Unauthorized or missing IDs",
    });
  }

  const userId = session.user.githubId.toString();

  try {
    const updated = await db
      .update(bikes)
      .set({ userId })
      .where(and(inArray(bikes.id, body.ids), isNull(bikes.userId)))
      .returning();

    return { success: true, count: updated.length };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
