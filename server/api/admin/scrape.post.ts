import { db } from "~/server/database/db";
import { components, componentPrices } from "~/server/database/schema";
import { scrapePrice } from "~/server/utils/scraper";
import { eq, isNotNull, and, ne, or, ilike } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  // Dispara o scraping para uma pequena amostra para evitar timeouts de requisição HTTP
  const targets = await db
    .select()
    .from(components)
    .where(
      and(
        isNotNull(components.link),
        ne(components.link, "-"),
        or(
          ilike(components.link, "%mercadolivre.com.br%"),
          ilike(components.link, "%meli.la%")
        )
      )
    )
    .limit(3);

  let successCount = 0;
  let failCount = 0;

  for (const item of targets) {
    if (!item.link) continue;

    const result = await scrapePrice(item.link);
    if (result.status === "success" && result.price) {
      await db
        .update(components)
        .set({
          price: result.price.toString(),
          updatedAt: new Date(),
        })
        .where(eq(components.id, item.id));

      await db.insert(componentPrices).values({
        componentId: item.id,
        price: result.price.toString(),
      });
      successCount++;
    } else {
      failCount++;
    }

    // Pequeno delay entre itens
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return {
    success: true,
    processed: targets.length,
    successCount,
    failCount,
    timestamp: new Date().toISOString(),
  };
});
