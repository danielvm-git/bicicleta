import "dotenv/config";
import { db } from "../server/database/db";
import { components } from "../server/database/schema";
import { isNull, or, eq, count } from "drizzle-orm";

async function verify() {
  console.log("--- Verificação de Integridade M010 ---");

  // Total de componentes
  const [totalResult] = await db.select({ value: count() }).from(components);
  const total = totalResult.value;

  // Componentes sem functionalGroup ou com 'Outros'
  const invalidComponents = await db
    .select()
    .from(components)
    .where(
      or(
        isNull(components.functionalGroup),
        eq(components.functionalGroup, "Outros")
      )
    );

  const totalInvalid = invalidComponents.length;
  const sistemaComponents = await db
    .select({ value: count() })
    .from(components)
    .where(eq(components.functionalGroup, "Sistema"));

  const validCount = total - totalInvalid;
  const percentage = total > 0 ? (validCount / total) * 100 : 100;

  console.log(`Total de componentes: ${total}`);
  console.log(`Componentes válidos: ${validCount} (${percentage.toFixed(2)}%)`);
  console.log(`Componentes de sistema: ${sistemaComponents[0].value}`);
  console.log(`Componentes inválidos (Null/'Outros'): ${totalInvalid}`);

  if (totalInvalid > 0) {
    console.log("\nComponentes com erro:");
    invalidComponents.forEach((c) => {
      console.log(
        `- [ID: ${c.id}] ${c.category} ${c.brand || ""} ${c.model} -> Group: ${c.functionalGroup}`
      );
    });
    console.log(
      "\n❌ Falha: Existem componentes com functionalGroup nulo ou 'Outros'."
    );
    process.exit(1);
  }

  console.log("\n✅ Sucesso: Todos os componentes têm functionalGroup mapeado!");
  process.exit(0);
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
