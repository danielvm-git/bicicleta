import { db } from "../database/db";
import { components } from "../database/schema";
import { sql } from "drizzle-orm";

async function verify() {
  console.log("--- Auditoria Técnica M02/S01 ---");

  const stats = await db
    .select({
      total: sql<number>`count(*)`,
      withWeight: sql<number>`count(weight)`,
      withSpeeds: sql<number>`count(speeds)`,
      withSteering: sql<number>`count(steering_type)`,
      withAxle: sql<number>`count(axle_type)`,
      withTravel: sql<number>`count(suspension_travel)`,
    })
    .from(components);

  const res = stats[0];
  console.log(`Total de componentes: ${res.total}`);
  console.log(
    `Com Peso: ${res.withWeight} (${((res.withWeight / res.total) * 100).toFixed(1)}%)`
  );
  console.log(
    `Com Velocidades: ${res.withSpeeds} (${((res.withSpeeds / res.total) * 100).toFixed(1)}%)`
  );
  console.log(
    `Com Steering: ${res.withSteering} (${((res.withSteering / res.total) * 100).toFixed(1)}%)`
  );
  console.log(
    `Com Eixo: ${res.withAxle} (${((res.withAxle / res.total) * 100).toFixed(1)}%)`
  );
  console.log(
    `Com Curso: ${res.withTravel} (${((res.withTravel / res.total) * 100).toFixed(1)}%)`
  );

  // Sample of components with technical info
  console.log("\n--- Amostra de Dados Técnicos ---");
  const samples = await db
    .select()
    .from(components)
    .where(
      sql`speeds IS NOT NULL OR steering_type IS NOT NULL OR weight IS NOT NULL`
    )
    .limit(10);

  samples.forEach((s) => {
    console.log(`[${s.category}] ${s.brand} ${s.model}`);
    console.log(
      `  Weight: ${s.weight || "N/A"} | Speeds: ${s.speeds || "N/A"} | Steering: ${s.steeringType || "N/A"} | Axle: ${s.axleType || "N/A"}`
    );
  });
}

verify().catch(console.error);
