import { db } from "~/server/database/db";
import { bikes } from "~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const session = await getUserSession(event);

  let filter = undefined;
  if (query.user === "true") {
    if (!session.user?.githubId) return [];
    filter = eq(bikes.userId, session.user.githubId.toString());
  }

  try {
    const allBikes = await db.query.bikes.findMany({
      where: filter,
      with: {
        bikeComponents: {
          with: {
            component: true,
          },
        },
      },
    });
    return allBikes;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
