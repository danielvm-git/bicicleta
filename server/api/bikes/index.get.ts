import { db } from "~/server/database/db";
import { bikes } from "~/server/database/schema";
import { eq } from "drizzle-orm";
import { rethrowH3Error } from "~/server/utils/http";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const session = await getUserSession(event);

  let filter;
  if (query.user === "true") {
    if (!session.user?.githubId) {
      return [];
    }
    filter = eq(bikes.userId, session.user.githubId.toString());
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
