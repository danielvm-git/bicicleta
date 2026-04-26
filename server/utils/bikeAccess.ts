import { bikes } from "~/server/database/schema";
import { and, eq, or, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

/**
 * List bikes: "mine" (query.user === true) vs public catalog.
 * When the client asks for user bikes and there is no session, the list is empty.
 */
export function resolveBikesListFilter(
  userParam: unknown,
  userId: string | undefined
): { mode: "empty" } | { mode: "ok"; where: SQL<unknown> } {
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

/** First argument to Drizzle relational `findFirst({ where })` is column fields, not the table. */
type BikesReadWhereFields = {
  slug: PgColumn;
  isPublic: PgColumn;
  userId: PgColumn;
};

type RelationalWhere = (
  fields: BikesReadWhereFields,
  operators: { eq: typeof eq; and: typeof and; or: typeof or }
) => SQL<unknown> | undefined;

/**
 * Single-bike read: public, or owned by the current user, or (when anonymous) public only.
 */
export function whereBikeBySlugForReader(
  slug: string,
  userId: string | undefined
): RelationalWhere {
  return (fields, { eq, and, or: orFn }): SQL<unknown> => {
    if (!userId) {
      return and(eq(fields.slug, slug), eq(fields.isPublic, true))!;
    }
    return and(
      eq(fields.slug, slug),
      orFn(eq(fields.isPublic, true), eq(fields.userId, userId))
    )!;
  };
}
