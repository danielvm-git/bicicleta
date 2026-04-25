import { db } from '../database/db'
import { components } from '../database/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string

  let filters = []
  if (category) {
    filters.push(eq(components.category, category))
  }

  const result = await db.selectDistinct({ brand: components.brand })
    .from(components)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(components.brand)
  
  return result.map(r => r.brand).filter(Boolean)
})
