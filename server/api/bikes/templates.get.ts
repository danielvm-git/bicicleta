import { db } from "~/server/database/db";
import { rethrowH3Error } from "~/server/utils/http";

export default defineEventHandler(async () => {
  try {
    const templates = await db.query.bikes.findMany({
      where: (bikes, { ilike, or: or_, and, eq }) =>
        and(
          eq(bikes.isPublic, true),
          or_(
            ilike(bikes.name, "%Template%"),
            ilike(bikes.description, "%Template%"),
            ilike(bikes.description, "%Importado de%")
          )
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
  } catch (error: unknown) {
    rethrowH3Error(error, "bikes.templates.get");
  }
});
