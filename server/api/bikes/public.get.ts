import { db } from "~/server/database/db";
import { rethrowH3Error } from "~/server/utils/http";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const rawLimit = query.limit
    ? parseInt(String(query.limit), 10)
    : DEFAULT_LIMIT;
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.isNaN(rawLimit) ? DEFAULT_LIMIT : rawLimit)
  );
  const rawCursor = query.cursor
    ? parseInt(String(query.cursor), 10)
    : undefined;
  if (
    query.cursor !== undefined &&
    query.cursor !== null &&
    String(query.cursor) !== ""
  ) {
    if (rawCursor === undefined || Number.isNaN(rawCursor)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid cursor",
      });
    }
  }
  const cursor = rawCursor;

  try {
    const publicBikes = await db.query.bikes.findMany({
      where: (b, { and: andFn, eq, lt: ltFn }) => {
        const parts = [eq(b.isPublic, true)];
        if (cursor !== undefined) {
          parts.push(ltFn(b.id, cursor));
        }
        return andFn(...parts);
      },
      orderBy: (b, { desc: d }) => [d(b.id)],
      limit: limit + 1,
      with: {
        bikeComponents: {
          with: {
            component: true,
          },
        },
      },
    });

    const hasMore = publicBikes.length > limit;
    const items = hasMore ? publicBikes.slice(0, limit) : publicBikes;
    const last = items[items.length - 1];
    const nextCursor = hasMore && last ? last.id : null;

    return {
      items,
      nextCursor,
    };
  } catch (error: unknown) {
    rethrowH3Error(error, "bikes.public.get");
  }
});
