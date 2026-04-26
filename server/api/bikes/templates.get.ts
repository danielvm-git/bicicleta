import { db } from "~/server/database/db";

export default defineEventHandler(async () => {
  try {
    const templates = await db.query.bikes.findMany({
      where: (bikes, { ilike, or }) =>
        or(
          ilike(bikes.name, "%Template%"),
          ilike(bikes.description, "%Template%"),
          ilike(bikes.description, "%Importado de%")
        ),
      with: {
        bikeComponents: {
          with: {
            component: true,
          },
        },
      },
    });
    return templates;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
