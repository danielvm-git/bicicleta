import "dotenv/config";
import { db } from "../database/db";
import { components, componentPrices } from "../database/schema";
import { scrapePrice } from "../utils/scraper";
import { eq, isNotNull, and, ne, sql, ilike, or } from "drizzle-orm";

async function run() {
  const isFullRun = process.argv.includes("--full");
  console.log(
    `--- Iniciando atualização de preços via Scraping (${isFullRun ? "FULL" : "TEST"}) ---`
  );

  // For test run, only pick Mercado Livre links
  let query = db
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
    );

  if (!isFullRun) {
    // @ts-ignore
    query = query.limit(5);
  }

  const targets = await query;

  console.log(`Encontrados ${targets.length} componentes para processar.`);

  let successCount = 0;
  let failCount = 0;

  for (const item of targets) {
    if (!item.link) continue;

    console.log(`[${item.category}] Scraping: ${item.brand} ${item.model}...`);
    console.log(`  URL: ${item.link.substring(0, 60)}...`);

    const result = await scrapePrice(item.link);

    if (result.status === "success" && result.price) {
      console.log(`  ✅ Novo preço: R$ ${result.price.toFixed(2)}`);

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
      console.log(`  ❌ Falha: ${result.error || result.status}`);
      failCount++;
    }

    if (targets.length > 1) {
      // Delay to avoid being blocked
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );
    }
  }

  console.log("\n--- Resumo ---");
  console.log(`Sucessos: ${successCount}`);
  console.log(`Falhas: ${failCount}`);
}

run().catch(console.error);
