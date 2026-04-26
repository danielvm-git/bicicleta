import { randomBytes } from "node:crypto";
import { z } from "zod";
import { db } from "~/server/database/db";
import { bikes, bikeComponents } from "~/server/database/schema";
import { rethrowH3Error } from "~/server/utils/http";
import { checkRateLimit } from "~/server/utils/rateLimit";
import { validateBike } from "~/server/utils/compatibility";

const postBodySchema = z
  .object({
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional().nullable(),
    componentIds: z.array(z.number().int().positive()).min(1),
    isPublic: z.boolean().optional(),
    totalPrice: z.union([z.number(), z.string()]).optional(),
  })
  .strict();

function sumComponentPrices(components: { price: string | null }[]) {
  return components.reduce((sum, c) => {
    const p = parseFloat(c.price || "0");
    const n = Number.isFinite(p) && p >= 0 ? p : 0;
    return sum + n;
  }, 0);
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const session = await getUserSession(event);
  const userId = session.user?.githubId?.toString();

  const maxPost =
    (config as { rateLimitMaxBikesPost?: number }).rateLimitMaxBikesPost ?? 30;
  const windowMs =
    (config as { rateLimitWindowMs?: number }).rateLimitWindowMs ?? 60_000;
  checkRateLimit(event, "bikes-post", maxPost, windowMs);

  const raw = await readBody(event);
  const parsed = postBodySchema.safeParse(raw);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid body: ${parsed.error.message}`,
    });
  }
  const body = parsed.data;

  try {
    const componentsData = await db.query.components.findMany({
      where: (components, { inArray: inArr }) =>
        inArr(components.id, body.componentIds),
    });

    if (componentsData.length !== body.componentIds.length) {
      throw createError({
        statusCode: 400,
        statusMessage: "One or more component IDs are invalid",
      });
    }

    const issues = validateBike(componentsData);
    const hardErrors = issues.filter((i) => i.severity === "error");
    if (hardErrors.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Compatibility Error: ${hardErrors.map((e) => e.message).join("; ")}`,
      });
    }

    const totalPriceStr = sumComponentPrices(componentsData).toFixed(2);
    if (body.totalPrice !== undefined) {
      const client = parseFloat(String(body.totalPrice));
      const server = parseFloat(totalPriceStr);
      if (Number.isFinite(client) && Math.abs(client - server) > 0.02) {
        throw createError({
          statusCode: 400,
          statusMessage:
            "Total price out of sync with selected components. Refresh and try again.",
        });
      }
    }

    const baseSlug = body.name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

    const maxAttempts = 5;
    let lastError: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const suffix = randomBytes(4).toString("hex");
      const slug = `${baseSlug}-${suffix}`;

      try {
        return await db.transaction(async (tx) => {
          const [newBike] = await tx
            .insert(bikes)
            .values({
              name: body.name,
              description: body.description ?? null,
              totalPrice: totalPriceStr,
              slug,
              isPublic: body.isPublic !== undefined ? body.isPublic : true,
              userId: userId || null,
            })
            .returning();

          await tx.insert(bikeComponents).values(
            body.componentIds.map((id: number) => ({
              bikeId: newBike.id,
              componentId: id,
            }))
          );

          return newBike;
        });
      } catch (e: unknown) {
        const code =
          (e as { code?: string })?.code ??
          (e as { cause?: { code?: string } })?.cause?.code;
        if (code === "23505" && attempt < maxAttempts - 1) {
          lastError = e;
          continue;
        }
        rethrowH3Error(e, "bikes.index.post");
      }
    }
    rethrowH3Error(lastError, "bikes.index.post");
  } catch (error: unknown) {
    rethrowH3Error(error, "bikes.index.post");
  }
});
