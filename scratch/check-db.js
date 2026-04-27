import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

async function check() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }
  const sql = neon(process.env.DATABASE_URL);
  try {
    const comps = await sql`SELECT count(*) FROM components`;
    const bikesCount = await sql`SELECT count(*) FROM bikes`;
    console.log("Components count:", comps[0].count);
    console.log("Bikes count:", bikesCount[0].count);
  } catch (err) {
    console.error("Query failed:", err);
  }
}

check();
