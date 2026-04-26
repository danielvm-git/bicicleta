import { db } from "~/server/database/db";
import { rethrowH3Error } from "~/server/utils/http";
import { getNeonSession, getNeonUserId } from "~/server/utils/neonSession";
import { resolveBikesListFilter } from "~/server/utils/bikeAccess";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const session = await getNeonSession(event);
  const userId = getNeonUserId(session);
  const list = resolveBikesListFilter(query.user, userId);
  if (list.mode === "empty") {
    return [];
  }
  const filter = list.where;

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
