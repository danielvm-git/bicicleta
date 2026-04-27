import { db } from "../database/db";
import { brands } from "../database/schema";

export default defineCachedEventHandler(
  async (event) => {
    const result = await db
      .select({ id: brands.id, name: brands.name })
      .from(brands)
      .orderBy(brands.name);

    return result;
  },
  {
    maxAge: 60 * 60,
    name: "api-brands",
    getKey: () => "all-brands",
  }
);
