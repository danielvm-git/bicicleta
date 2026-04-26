import { db } from "../database/db";
import { components, groups, bikes, bikeComponents } from "../database/schema";
import { count, eq } from "drizzle-orm";

async function verify() {
  console.log("--- Verificação S01 ---");

  const [compCount] = await db.select({ value: count() }).from(components);
  const [groupCount] = await db.select({ value: count() }).from(groups);
  const [bikeCount] = await db.select({ value: count() }).from(bikes);
  const [bikeCompCount] = await db
    .select({ value: count() })
    .from(bikeComponents);

  console.log(`Components: ${compCount.value}`);
  console.log(`Groups: ${groupCount.value}`);
  console.log(`Bikes: ${bikeCount.value}`);
  console.log(`Bike components: ${bikeCompCount.value}`);

  const [brandCoverage] = await db
    .select({ count: count(components.brand) })
    .from(components);
  const [lineCoverage] = await db
    .select({ count: count(components.line) })
    .from(components);

  console.log(`Components with Brand: ${brandCoverage.count}`);
  console.log(`Components with Line: ${lineCoverage.count}`);

  const sampleBikes = await db
    .select({
      bikeName: bikes.name,
      compCategory: components.category,
      compModel: components.model,
      compBrand: components.brand,
      compLine: components.line,
    })
    .from(bikes)
    .leftJoin(bikeComponents, eq(bikes.id, bikeComponents.bikeId))
    .leftJoin(components, eq(bikeComponents.componentId, components.id))
    .limit(10);

  if (sampleBikes.length > 0) {
    console.log(`Sample bike: ${sampleBikes[0].bikeName}`);
    for (const row of sampleBikes) {
      console.log(
        ` - [${row.compCategory}] ${row.compModel} (${row.compBrand} / ${row.compLine})`
      );
    }
  }

  if (
    compCount.value > 0 &&
    brandCoverage.count > 0 &&
    groupCount.value === 11
  ) {
    console.log("✅ Ingestão validada com sucesso!");
    process.exit(0);
  } else {
    console.log("❌ Ingestão incompleta ou com erros de normalização.");
    process.exit(1);
  }
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
