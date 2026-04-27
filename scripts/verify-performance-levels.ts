import "dotenv/config";
import { db } from "../server/database/db";
import { components } from "../server/database/schema";
import { isNull, count } from "drizzle-orm";

async function verify() {
  console.log("--- Verificação de Níveis de Performance M011 ---");

  // Total de componentes
  const [totalResult] = await db.select({ value: count() }).from(components);
  const total = totalResult.value;

  // Componentes sem performanceLevel
  const invalidComponents = await db
    .select()
    .from(components)
    .where(isNull(components.performanceLevel));

  const totalInvalid = invalidComponents.length;
  const validCount = total - totalInvalid;
  const percentage = total > 0 ? (validCount / total) * 100 : 100;

  console.log(`Total de componentes: ${total}`);
  console.log(
    `Componentes com nível: ${validCount} (${percentage.toFixed(2)}%)`
  );
  console.log(`Componentes sem nível: ${totalInvalid}`);

  if (totalInvalid > 0) {
    console.log("\nComponentes com erro (Null):");
    invalidComponents.forEach((c) => {
      console.log(`- [ID: ${c.id}] ${c.category} ${c.brand || ""} ${c.model}`);
    });
    console.log("\n❌ Falha: Existem componentes sem performanceLevel.");
    process.exit(1);
  }

  console.log(
    "\n✅ Sucesso: Todos os componentes têm performanceLevel mapeado!"
  );
  process.exit(0);
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
