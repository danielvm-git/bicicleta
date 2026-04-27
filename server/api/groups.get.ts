import { db } from "../database/db";
import { groups } from "../database/schema";

export default defineEventHandler(async (event) => {
  try {
    const allGroups = await db.select().from(groups);
    return allGroups;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
