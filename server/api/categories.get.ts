import { db } from '../database/db'
import { components } from '../database/schema'

export default defineCachedEventHandler(async (event) => {
  const result = await db.selectDistinct({ category: components.category })
    .from(components)
    .orderBy(components.category)
  
  return result.map(r => r.category).filter(Boolean)
}, {
  maxAge: 60 * 60,
  name: 'api-categories'
})
