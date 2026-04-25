import { db } from '~/server/database/db';
import { builds, buildComponents } from '~/server/database/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  if (!body.name || !body.componentIds || !Array.isArray(body.componentIds)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: name and componentIds (array)',
    });
  }

  const { name, description, totalPrice, componentIds } = body;

  try {
    // Validate component existence
    if (componentIds.length > 0) {
      const existingComponents = await db.query.components.findMany({
        where: (components, { inArray }) => inArray(components.id, componentIds),
      });

      if (existingComponents.length !== componentIds.length) {
        throw createError({
          statusCode: 400,
          statusMessage: 'One or more component IDs are invalid',
        });
      }
    }

    const [newBuild] = await db.insert(builds).values({
      name,
      description,
      totalPrice: totalPrice?.toString() || '0',
    }).returning();

    if (componentIds.length > 0) {
      await db.insert(buildComponents).values(
        componentIds.map((id: number) => ({
          buildId: newBuild.id,
          componentId: id,
        }))
      );
    }

    return newBuild;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error',
    });
  }
});
