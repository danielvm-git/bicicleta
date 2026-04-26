import { db } from "~/server/database/db";
import { rethrowH3Error } from "~/server/utils/http";
import { getNeonSession, getNeonUserId } from "~/server/utils/neonSession";
import { whereBikeBySlugForReader } from "~/server/utils/bikeAccess";

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
      where: whereBikeBySlugForReader(slug, userId),
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
