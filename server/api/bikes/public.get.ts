import { db } from "~/server/database/db";

export default defineEventHandler(async () => {
  try {
    const publicBikes = await db.query.bikes.findMany({
      where: (bikes, { eq }) => eq(bikes.isPublic, true),
      orderBy: (bikes, { desc }) => [desc(bikes.createdAt)],
      limit: 50,
      with: {
        bikeComponents: {
          with: {
            component: true,
          },
        },
      },
    });

    return publicBikes;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
