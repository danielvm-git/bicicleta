import { db } from '~/server/database/db';
import { components, builds } from '~/server/database/schema';
import { ilike, or, and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const query = getQuery(event).q as string;
  if (!query || query.length < 2) return { components: [], builds: [] };

  const [comps, blds] = await Promise.all([
    db.select().from(components)
      .where(or(
        ilike(components.model, `%${query}%`),
        ilike(components.brand, `%${query}%`)
      ))
      .limit(10),
    db.select().from(builds)
      .where(and(
        eq(builds.isPublic, true),
        or(
          ilike(builds.name, `%${query}%`),
          ilike(builds.description, `%${query}%`)
        )
      ))
      .limit(5)
  ]);

  return {
    components: comps.map(c => ({ ...c, type: 'component' })),
    builds: blds.map(b => ({ ...b, type: 'build' }))
  };
});
