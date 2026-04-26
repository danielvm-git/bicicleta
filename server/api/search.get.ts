import { db } from "~/server/database/db";
import { components, bikes } from "~/server/database/schema";
import { and, eq, or, ilike } from "drizzle-orm";
import { globalSearchComponentsWhere } from "~/server/utils/componentCatalog";

export default defineEventHandler(async (event) => {
  const query = getQuery(event).q as string;
  if (!query || query.length < 2) return { components: [], bikes: [] };

  const [comps, bks] = await Promise.all([
    db
      .select()
      .from(components)
      .where(globalSearchComponentsWhere(query))
      .limit(10),
    db
      .select()
      .from(bikes)
      .where(
        and(
          eq(bikes.isPublic, true),
          or(
            ilike(bikes.name, `%${query}%`),
            ilike(bikes.description, `%${query}%`)
          )
        )
      )
      .limit(5),
  ]);

  return {
    components: comps.map((c) => ({ ...c, type: "component" })),
    bikes: bks.map((b) => ({ ...b, type: "bike" })),
  };
});
