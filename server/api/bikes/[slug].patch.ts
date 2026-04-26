import { db } from "~/server/database/db";
import { bikes } from "~/server/database/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const session = await getUserSession(event);
  const body = await readBody(event);

  if (!slug || !session.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    const [updated] = await db
      .update(bikes)
      .set({ isPublic: body.isPublic })
      .where(
        and(
          eq(bikes.slug, slug),
          eq(bikes.userId, session.user.githubId.toString())
        )
      )
      .returning();

    if (!updated) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bike not found or not owned by user",
      });
    }

    return updated;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
