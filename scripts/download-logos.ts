import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, isNotNull } from "drizzle-orm";
import { brands } from "../server/database/schema.ts";
import fs from "fs/promises";
import path from "path";

const LOGO_DEV_TOKEN = process.env.LOGO_DEV_TOKEN || process.env.LOGO_DEV_KEY;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in .env");
    process.exit(1);
  }

  if (!LOGO_DEV_TOKEN) {
    console.error(
      "❌ LOGO_DEV_TOKEN or LOGO_DEV_KEY is not set in .env. Please add it to download logos."
    );
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  console.log("Fetching brands from Neon database...");
  const allBrands = await db.select().from(brands).where(isNotNull(brands.url));

  console.log(`Found ${allBrands.length} brands with URLs.`);

  const publicBrandsDir = path.join(process.cwd(), "public", "brands");

  // Ensure the directory exists
  try {
    await fs.mkdir(publicBrandsDir, { recursive: true });
  } catch (error) {
    console.error("Error creating public/brands directory:", error);
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const brand of allBrands) {
    const brandUrl = brand.url;
    // Basic formatting: remove http(s):// and www.
    let domain = brandUrl.replace(/^https?:\/\//, "").replace(/^www\./, "");
    // remove trailing slashes or paths
    domain = domain.split("/")[0];

    console.log(`Processing: ${brand.name} (${domain})...`);

    try {
      const logoUrl = `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&format=png`;
      const response = await fetch(logoUrl);

      if (!response.ok) {
        console.warn(
          `⚠️ Failed to fetch logo for ${domain}: ${response.status} ${response.statusText}`
        );
        errorCount++;
        continue;
      }

      const buffer = await response.arrayBuffer();
      const filename = `${brand.id}.png`;
      const filePath = path.join(publicBrandsDir, filename);

      await fs.writeFile(filePath, Buffer.from(buffer));

      // Update the database
      await db
        .update(brands)
        .set({ logoFilename: filename })
        .where(eq(brands.id, brand.id));

      console.log(`✅ Saved ${filename} and updated database.`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error processing ${brand.name}:`, error);
      errorCount++;
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Total attempted: ${allBrands.length}`);
  console.log(`Successfully updated: ${successCount}`);
  console.log(`Errors: ${errorCount}`);

  console.log("Finished downloading and updating logos.");
  await pool.end();
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
