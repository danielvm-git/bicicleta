import { db } from "~/server/database/db";
import { bikes } from "~/server/database/schema";
import { eq } from "drizzle-orm";
import { rethrowH3Error } from "~/server/utils/http";
import { getNeonSession, getNeonUserId } from "~/server/utils/neonSession";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const session = await getNeonSession(event);
  const userId = getNeonUserId(session);

  let filter;
  if (query.user === "true") {
    if (!userId) {
      return [];
    }
    filter = eq(bikes.userId, userId);
  } else {
    filter = eq(bikes.isPublic, true);
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
  } catch (error: unknown) {
    rethrowH3Error(error, "bikes.index.get");
  }
});
