import { bikes } from "~/server/database/schema";
import { and, eq } from "drizzle-orm";

/**
 * List bikes: "mine" (query.user === true) vs public catalog.
 * When the client asks for user bikes and there is no session, the list is empty.
 */
export function resolveBikesListFilter(
  userParam: unknown,
  userId: string | undefined
): { mode: "empty" } | { mode: "ok"; where: ReturnType<typeof eq> } {
  const userOnly =
    userParam === "true" ||
    (Array.isArray(userParam) && userParam[0] === "true");
  if (userOnly) {
    if (!userId) {
      return { mode: "empty" };
    }
    return { mode: "ok", where: eq(bikes.userId, userId) };
  }
  return { mode: "ok", where: eq(bikes.isPublic, true) };
}

/**
 * Single-bike read: public, or owned by the current user, or (when anonymous) public only.
 */
export function whereBikeBySlugForReader(
  slug: string,
  userId: string | undefined
) {
  // Drizzle relational `where` uses a generated column module; keep callback untyped.
  return (tbl: any, { eq, and, or: orFn }: any) => {
    if (!userId) {
      return and(eq(tbl.slug, slug), eq(tbl.isPublic, true));
    }
    return and(
      eq(tbl.slug, slug),
      orFn(eq(tbl.isPublic, true), eq(tbl.userId, userId))
    );
  };
}
