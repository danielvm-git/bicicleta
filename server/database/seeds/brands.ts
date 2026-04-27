import { db } from "../db";
import { components, brands } from "../schema";

/**
 * Generate a 3-letter brand ID from brand name
 * Handles collisions intelligently
 */
function generateBrandId(name: string, existingIds: Set<string>): string {
  const upper = name.toUpperCase();

  // Try first 3 letters
  let id = upper.substring(0, 3);
  if (!existingIds.has(id)) {
    return id;
  }

  // Try first 2 + last letter
  id = upper.substring(0, 2) + upper.substring(upper.length - 1);
  if (!existingIds.has(id)) {
    return id;
  }

  // Try first + middle + last
  if (upper.length >= 3) {
    id =
      upper.substring(0, 1) +
      upper.substring(1, 2) +
      upper.substring(upper.length - 1);
    if (!existingIds.has(id)) {
      return id;
    }
  }

  // Fallback: first letter + count suffix
  for (let i = 1; i < 100; i++) {
    id = upper.substring(0, 1) + String(i).padStart(2, "0");
    if (!existingIds.has(id)) {
      return id;
    }
  }

  throw new Error(`Cannot generate unique ID for brand: ${name}`);
}

export async function seedBrands() {
  console.log("🌱 Starting brands seed...");

  // Get all unique brand names from components
  const uniqueBrands = await db
    .selectDistinct({ name: components.brand })
    .from(components)
    .where((c) => c.brand !== null);

  const brandNames = uniqueBrands
    .map((b) => b.name)
    .filter((name) => name !== null && name !== "") as string[];

  console.log(`Found ${brandNames.length} unique brands:`, brandNames);

  // Check existing brands
  const existingBrands = await db.select().from(brands);
  const existingIds = new Set(existingBrands.map((b) => b.id));
  const existingNames = new Set(existingBrands.map((b) => b.name));

  console.log(`Already have ${existingBrands.length} brands in database`);

  // Generate IDs and prepare inserts
  const brandsToInsert = [];
  for (const name of brandNames) {
    if (existingNames.has(name)) {
      console.log(`⏭️  Skipping existing brand: ${name}`);
      continue;
    }

    const id = generateBrandId(name, existingIds);
    existingIds.add(id);

    // Generate placeholder URL
    const url = `https://www.${name.toLowerCase().replace(/\s+/g, "")}.com`;

    brandsToInsert.push({
      id,
      name,
      url,
      logoFilename: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✅ Generated: ${id} → ${name}`);
  }

  if (brandsToInsert.length === 0) {
    console.log("✨ All brands already seeded!");
    return;
  }

  // Insert brands
  await db.insert(brands).values(brandsToInsert);

  console.log(`✅ Successfully seeded ${brandsToInsert.length} brands!`);
}

// Run seed if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedBrands().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
}
