import { db } from '~/server/database/db';
import { components } from '~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0');
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid component ID',
    });
  }

  try {
    const [updated] = await db.update(components)
      .set({
        ...body,
        updatedAt: new Date()
      })
      .where(eq(components.id, id))
      .returning();

    if (!updated) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Component not found',
      });
    }

    // Invalidate caches
    const storage = useStorage('cache');
    const keys = await storage.getKeys();
    for (const key of keys) {
      if (key.includes('api-components') || key.includes('api-categories') || key.includes('api-brands')) {
        await storage.removeItem(key);
      }
    }

    return updated;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error',
    });
  }
});
