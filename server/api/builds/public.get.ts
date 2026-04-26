import { db } from '~/server/database/db';

export default defineEventHandler(async () => {
  try {
    const publicBuilds = await db.query.builds.findMany({
      where: (builds, { eq }) => eq(builds.isPublic, true),
      orderBy: (builds, { desc }) => [desc(builds.createdAt)],
      limit: 50,
      with: {
        buildComponents: {
          with: {
            component: true
          }
        }
      }
    });

    return publicBuilds;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error',
    });
  }
});
