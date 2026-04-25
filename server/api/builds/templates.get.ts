import { db } from '~/server/database/db';

export default defineEventHandler(async () => {
  try {
    const templates = await db.query.builds.findMany({
      where: (builds, { ilike, or }) => or(
        ilike(builds.name, '%Template%'),
        ilike(builds.description, '%Template%')
      ),
      with: {
        buildComponents: {
          with: {
            component: true
          }
        }
      }
    });
    return templates;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error',
    });
  }
});
