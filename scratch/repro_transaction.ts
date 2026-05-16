import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

async function repro() {
  try {
    console.log("Attempting transaction...");
    await db.transaction(async (tx) => {
      console.log("Inside transaction block");
    });
    console.log("Transaction success!");
  } catch (e) {
    console.error("Caught error:", e.message);
  }
}

repro();
