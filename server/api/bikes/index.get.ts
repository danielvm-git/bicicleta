import { db } from "~/server/database/db";
import { bikes, bikeComponents, components } from "~/server/database/schema";
import { eq } from "drizzle-orm";
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

  try {
    // Using explicit select and join to bypass potential Drizzle Query API alias issues
    const rows = await db
      .select({
        bike: bikes,
        bikeComponent: bikeComponents,
        component: components,
      })
      .from(bikes)
      .leftJoin(bikeComponents, eq(bikes.id, bikeComponents.bikeId))
      .leftJoin(components, eq(bikeComponents.componentId, components.id))
      .where(list.where);

    // Grouping results back into the expected nested structure
    const bikesMap = new Map<number, any>();

    for (const row of rows) {
      if (!bikesMap.has(row.bike.id)) {
        bikesMap.set(row.bike.id, {
          ...row.bike,
          bikeComponents: [],
        });
      }

      if (row.bikeComponent && row.component) {
        bikesMap.get(row.bike.id).bikeComponents.push({
          ...row.bikeComponent,
          component: row.component,
        });
      }
    }

    return Array.from(bikesMap.values());
  } catch (error: unknown) {
    rethrowH3Error(error, "bikes.index.get");
  }
});
