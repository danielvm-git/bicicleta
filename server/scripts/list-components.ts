import { db } from "../database/db";
import { components } from "../database/schema";

interface ComponentRow {
  id: number;
  brand: string | null;
  category: string;
  model: string;
}

interface ComponentGroup {
  [brand: string]: {
    [category: string]: {
      [model: string]: number[];
    };
  };
}

async function listComponents() {
  console.log("--- Listing All Components ---\n");

  const allComponents = await db
    .select({
      id: components.id,
      brand: components.brand,
      category: components.category,
      model: components.model,
    })
    .from(components);

  console.log(`Total components in database: ${allComponents.length}\n`);

  if (allComponents.length === 0) {
    console.log("No components found.");
    return;
  }

  // Group by brand -> category -> model
  const grouped: ComponentGroup = {};
  for (const comp of allComponents) {
    const brand = comp.brand || "UNSPECIFIED";
    const category = comp.category;
    const model = comp.model;

    if (!grouped[brand]) grouped[brand] = {};
    if (!grouped[category]) grouped[brand][category] = {};
    if (!grouped[brand][category][model]) grouped[brand][category][model] = [];

    grouped[brand][category][model].push(comp.id);
  }

  // Generate summary statistics
  const brands = Object.keys(grouped);
  let totalDuplicates = 0;
  const duplicatesList: Array<{
    brand: string;
    category: string;
    model: string;
    ids: number[];
    count: number;
  }> = [];

  for (const brand of brands) {
    for (const category in grouped[brand]) {
      for (const model in grouped[brand][category]) {
        const ids = grouped[brand][category][model];
        if (ids.length > 1) {
          totalDuplicates++;
          duplicatesList.push({
            brand,
            category,
            model,
            ids,
            count: ids.length,
          });
        }
      }
    }
  }

  // Summary stats
  const uniqueCategories = new Set(allComponents.map((c) => c.category)).size;
  const uniqueBrands = brands.length;

  console.log("=== SUMMARY ===");
  console.log(`Unique brands: ${uniqueBrands}`);
  console.log(`Unique categories: ${uniqueCategories}`);
  console.log(`Duplicate (brand, category, model) combos: ${totalDuplicates}`);
  console.log(
    `Total duplicate component records: ${allComponents.length - (allComponents.length - duplicatesList.reduce((sum, d) => sum + (d.count - 1), 0))}\n`
  );

  // List by brand and category
  console.log("=== COMPONENTS BY BRAND & CATEGORY ===\n");
  for (const brand of brands.sort()) {
    console.log(`\n[${brand}]`);
    const categories = Object.keys(grouped[brand]).sort();
    for (const category of categories) {
      const models = Object.keys(grouped[brand][category]).sort();
      const count = models.length;
      console.log(`  ${category}: ${count} unique models`);

      // Show duplicates for this category
      const dups = duplicatesList.filter(
        (d) => d.brand === brand && d.category === category
      );
      if (dups.length > 0) {
        dups.forEach((dup) => {
          console.log(
            `    ⚠️  DUPLICATE: "${dup.model}" (${dup.count}x) - IDs: ${dup.ids.join(", ")}`
          );
        });
      }
    }
  }

  // Detailed duplicates list
  if (duplicatesList.length > 0) {
    console.log("\n\n=== ALL DUPLICATES (DETAILED) ===\n");
    duplicatesList.sort((a, b) => {
      if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
      if (a.category !== b.category)
        return a.category.localeCompare(b.category);
      return a.model.localeCompare(b.model);
    });

    duplicatesList.forEach((dup) => {
      console.log(
        `${dup.brand} > ${dup.category} > ${dup.model} (${dup.count} records)`
      );
      console.log(`  IDs: ${dup.ids.join(", ")}`);
    });
  } else {
    console.log("\n✅ No duplicates found!");
  }
}

listComponents().catch(console.error);
