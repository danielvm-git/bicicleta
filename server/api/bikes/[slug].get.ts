import { db } from "~/server/database/db";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing slug",
    });
  }

  try {
    const bike = await db.query.bikes.findFirst({
      where: (bikes, { eq }) => eq(bikes.slug, slug),
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
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
