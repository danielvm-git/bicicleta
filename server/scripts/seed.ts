import "dotenv/config";
import fs from "fs";
import path from "path";
import { db } from "../database/db";
import {
  components,
  groups,
  bikes,
  bikeComponents,
  componentPrices,
} from "../database/schema";
import {
  parseCSV,
  parseBikeKV,
  parseXLSX,
  cleanPrice,
  inferMetadata,
  inferTechnicalSpecs,
  cleanWeight,
  normalizeCategory,
} from "../utils/parser";

async function seed() {
  const dryRun = process.argv.includes("--dry-run");

  if (dryRun) {
    console.log("--- DRY RUN ---");
  }

  if (!dryRun) {
    console.log("Cleaning existing data...");
    await db.delete(componentPrices);
    await db.delete(bikeComponents);
    await db.delete(bikes);
    await db.delete(groups);
    await db.delete(components);
  }

  // 1. Seed Components from Tabular CSV
  console.log("Seeding components from CSV...");
  const componentsFiles = [
    "componentes_absolute_candidatos.csv",
    "absolute_wild.csv",
    "montagem_absolute_nero.csv",
    "montagem_absolute_prime.csv",
    "montagem_absolute_wild.csv",
    "montagem_show_nextep.csv",
  ];

  for (const file of componentsFiles) {
    if (fs.existsSync(file)) {
      console.log(`Processing ${file}...`);
      const componentRows = parseCSV(file);
      for (const row of componentRows) {
        const category = normalizeCategory(
          row.Categoria || row.Componente || row.item
        );
        const model = row.Modelo || row.Produto || row.item;

        if (category === "TOTAL" || !category || !model) continue;

        const { brand: inferredBrand, line: inferredLine } = inferMetadata(
          String(model),
          file
        );
        const specs = inferTechnicalSpecs(
          String(model),
          row.Especificação || row.Descricao,
          row.Link || row.url
        );
        const weight = cleanWeight(row.Peso || String(model));

        const data = {
          category: String(category).trim(),
          model: String(model).trim(),
          brand: row.Marca || row.brand || inferredBrand,
          line: row.Linha || row.line || inferredLine,
          link: row.Link || row.url,
          price: cleanPrice(row.Preço || row.Preco || row.Valor || "0"),
          weight: weight || null,
          speeds: specs.speeds || null,
          steeringType: specs.steeringType || null,
          axleType: specs.axleType || null,
          suspensionTravel: specs.suspensionTravel || null,
        };

        if (!dryRun) {
          await db.insert(components).values(data);
        } else {
          console.log(
            `[DRY RUN] Would insert component: [${data.category}] ${data.model} (Brand: ${data.brand}, Line: ${data.line}, Specs: ${data.speeds || "N/A"}) from ${file}`
          );
        }
      }
    }
  }

  // 2. Seed Groups
  // ... (no changes needed in groups for now)

  // 3. Seed Bikes from KV CSVs
  console.log("Seeding bikes from CSV KV...");
  const bikesDir = "bicicletas_analise";
  if (fs.existsSync(bikesDir)) {
    const bikeFiles = fs
      .readdirSync(bikesDir)
      .filter((f) => f.endsWith(".csv"));
    for (const file of bikeFiles) {
      const bikePath = path.join(bikesDir, file);
      const bikeData = parseBikeKV(bikePath);

      if (!dryRun) {
        const [insertedBike] = await db
          .insert(bikes)
          .values({
            name: bikeData.name,
            description: `Importado de ${file}`,
            totalPrice: bikeData.price,
          })
          .returning();

        for (const component of bikeData.components) {
          const [insertedComponent] = await db
            .insert(components)
            .values({
              category: component.category,
              model: component.model,
              brand: component.brand,
              line: component.line,
              price: "0",
              weight: component.weight || null,
              speeds: component.speeds || null,
              steeringType: component.steeringType || null,
              axleType: component.axleType || null,
              suspensionTravel: component.suspensionTravel || null,
            })
            .returning();

          await db.insert(bikeComponents).values({
            bikeId: insertedBike.id,
            componentId: insertedComponent.id,
          });
        }
      } else {
        console.log(
          `[DRY RUN] Would insert bike: ${bikeData.name} with ${bikeData.components.length} components`
        );
      }
    }
  }

  // 4. Seed Bikes from XLSX
  console.log("Seeding bikes from XLSX...");
  const xlsxFiles = [
    "MTB Montada R$3.000.xlsx",
    "MTB Montada R$5.000.xlsx",
    "MTB Montada R$7.500.xlsx",
    "MTB Montada R$10.000.xlsx",
  ];

  for (const file of xlsxFiles) {
    if (fs.existsSync(file)) {
      const bikeData = parseXLSX(file);
      if (!dryRun) {
        const [insertedBike] = await db
          .insert(bikes)
          .values({
            name: `${file.replace(".xlsx", "")} (${bikeData.name})`,
            description: `Importado de ${file}`,
            totalPrice: bikeData.price,
          })
          .returning();

        for (const component of bikeData.components) {
          const [insertedComponent] = await db
            .insert(components)
            .values({
              category: component.category,
              model: component.model,
              brand: component.brand,
              line: component.line,
              link: component.link,
              price: component.price || "0",
              weight: component.weight || null,
              speeds: component.speeds || null,
              steeringType: component.steeringType || null,
              axleType: component.axleType || null,
              suspensionTravel: component.suspensionTravel || null,
            })
            .returning();

          await db.insert(bikeComponents).values({
            bikeId: insertedBike.id,
            componentId: insertedComponent.id,
          });
        }
      } else {
        console.log(
          `[DRY RUN] Would insert XLSX bike: ${bikeData.name} from ${file} with ${bikeData.components.length} components`
        );
      }
    }
  }

  console.log("Seed completed!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
