import { db } from '~/server/database/db';
import { builds, buildComponents } from '~/server/database/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = await getUserSession(event);
  const userId = session.user?.githubId?.toString();
  
  if (!body.name || !body.componentIds || !Array.isArray(body.componentIds)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: name and componentIds (array)',
    });
  }

  const { name, description, totalPrice, componentIds } = body;

  try {
    // Validate component existence
    let componentsData: any[] = []
    if (componentIds.length > 0) {
      componentsData = await db.query.components.findMany({
        where: (components, { inArray }) => inArray(components.id, componentIds),
      });

      if (componentsData.length !== componentIds.length) {
        throw createError({
          statusCode: 400,
          statusMessage: 'One or more component IDs are invalid',
        });
      }

      // Deep validation using isomorphic CompatibilityEngine
      const issues = validateBuild(componentsData);
      const hardErrors = issues.filter(i => i.severity === 'error');
      if (hardErrors.length > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `Compatibility Error: ${hardErrors.map(e => e.message).join('; ')}`,
        });
      }
    }

    const baseSlug = name.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;

    const [newBuild] = await db.insert(builds).values({
      name,
      description,
      totalPrice: totalPrice?.toString() || '0',
      slug,
      isPublic: body.isPublic !== undefined ? body.isPublic : true,
      userId: userId || null,
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
