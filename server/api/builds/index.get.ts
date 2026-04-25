import { db } from '~/server/database/db';

export default defineEventHandler(async () => {
  try {
    const allBuilds = await db.query.builds.findMany({
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
