import { db } from "~/server/database/db";
import { rethrowH3Error } from "~/server/utils/http";
import { getNeonSession, getNeonUserId } from "~/server/utils/neonSession";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const session = await getNeonSession(event);

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing slug",
    });
  }

  const userId = getNeonUserId(session);

  try {
    const bike = await db.query.bikes.findFirst({
      where: (bikes, { eq, and, or: orFn }) => {
        if (!userId) {
          return and(eq(bikes.slug, slug), eq(bikes.isPublic, true));
        }
        return and(
          eq(bikes.slug, slug),
          orFn(eq(bikes.isPublic, true), eq(bikes.userId, userId))
        );
      },
      with: {
        bikeComponents: {
          with: {
            component: true,
          },
        },
      },
    });

    if (!bike) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bike not found",
      });
    }

    return bike;
  } catch (error: unknown) {
    rethrowH3Error(error, "bikes.[slug].get");
  }
});
