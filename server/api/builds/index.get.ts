import { db } from '~/server/database/db';
import { builds } from '~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const session = await getUserSession(event);
  
  let filter = undefined;
  if (query.user === 'true') {
    if (!session.user?.githubId) return [];
    filter = eq(builds.userId, session.user.githubId.toString());
  }

  try {
    const allBuilds = await db.query.builds.findMany({
      where: filter,
      with: {
        buildComponents: {
          with: {
            component: true
          }
        }
      }
    });
    return allBuilds;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error',
    });
  }
});
