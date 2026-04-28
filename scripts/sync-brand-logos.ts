import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, isNotNull } from "drizzle-orm";
import { brands } from "../server/database/schema.ts";
import fs from "fs/promises";
import path from "path";

const LOGO_DEV_KEY = process.env.LOGO_DEV_KEY;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

function normalizeUrl(url: string): string {
  let normalized = url.trim();
  normalized = normalized.replace(/^https?:\/\//, "");
  normalized = normalized.replace(/^www\./, "");
  normalized = normalized.split("/")[0];
  return normalized;
}

function getFileExtension(contentType: string): string {
  const typeMap: Record<string, string> = {
    "image/svg+xml": "svg",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/x-icon": "ico",
  };
  return typeMap[contentType] || "png";
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadLogoWithRetry(
  domain: string,
  retryCount = 0
): Promise<{ buffer: Buffer; extension: string } | null> {
  try {
    const logoUrl = `https://img.logo.dev/${domain}?token=${LOGO_DEV_KEY}`;

    const response = await fetch(logoUrl, {
      timeout: 10000,
    });

    if (!response.ok) {
      if (retryCount < MAX_RETRIES && response.status >= 500) {
        console.warn(
          `  ⚠️ Server error (${response.status}), retrying for ${domain}... (attempt ${retryCount + 1}/${MAX_RETRIES})`
        );
        await delay(RETRY_DELAY * (retryCount + 1));
        return downloadLogoWithRetry(domain, retryCount + 1);
      }

      console.warn(`  ⚠️ HTTP ${response.status}: ${response.statusText}`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const extension = getFileExtension(contentType);
    const buffer = await response.arrayBuffer();

    return {
      buffer: Buffer.from(buffer),
      extension,
    };
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.warn(
        `  ⚠️ Network error, retrying... (attempt ${retryCount + 1}/${MAX_RETRIES})`
      );
      await delay(RETRY_DELAY * (retryCount + 1));
      return downloadLogoWithRetry(domain, retryCount + 1);
    }

    console.error(
      `  ❌ Error downloading logo:`,
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in .env");
    process.exit(1);
  }

  if (!LOGO_DEV_KEY) {
    console.error(
      "❌ LOGO_DEV_KEY is not set in .env. Please add it to download logos."
    );
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  const publicBrandsDir = path.join(process.cwd(), "public", "brands");

  try {
    await fs.mkdir(publicBrandsDir, { recursive: true });
  } catch (error) {
    console.error("Error creating public/brands directory:", error);
    process.exit(1);
  }

  console.log("🔄 Fetching brands from Neon database...");
  const allBrands = await db.select().from(brands).where(isNotNull(brands.url));

  console.log(`✅ Found ${allBrands.length} brands with URLs.\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const brand of allBrands) {
    const domain = normalizeUrl(brand.url);
    console.log(`📥 Processing: ${brand.name} (${domain})...`);

    const logoData = await downloadLogoWithRetry(domain);

    if (!logoData) {
      console.warn(`⚠️ Failed to download logo for ${domain}`);
      errorCount++;
      continue;
    }

    try {
      const filename = `${brand.id}.${logoData.extension}`;
      const filePath = path.join(publicBrandsDir, filename);

      await fs.writeFile(filePath, logoData.buffer);

      await db
        .update(brands)
        .set({ logoFilename: filename })
        .where(eq(brands.id, brand.id));

      console.log(`✅ Downloaded and saved ${filename}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error saving/updating logo for ${brand.name}:`, error);
      errorCount++;
    }

    await delay(500);
  }

  console.log("\n--- Summary ---");
  console.log(`Total attempted: ${allBrands.length}`);
  console.log(`Successfully updated: ${successCount}`);
  console.log(`Errors: ${errorCount}`);

  console.log("\n✨ Finished downloading and updating brand logos.");
  await pool.end();
}

main().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
