import { db } from '~/server/database/db';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing slug',
    });
  }

  try {
    const build = await db.query.builds.findFirst({
      where: (builds, { eq }) => eq(builds.slug, slug),
      with: {
        buildComponents: {
          with: {
            component: true
          }
        }
      }
    });

    if (!build) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Build not found',
      });
    }

    return build;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal Server Error',
    });
  }
});
