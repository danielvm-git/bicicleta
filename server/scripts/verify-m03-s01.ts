import { db } from "../database/db";
import { components, componentPrices } from "../database/schema";
import { eq } from "drizzle-orm";

async function verify() {
  console.log("--- Verificação de Ingestão de Preços ---");

  // 1. Find a component to mock update
  const [comp] = await db.select().from(components).limit(1);
  if (!comp) {
    console.error("Nenhum componente encontrado no banco.");
    return;
  }
  console.log(`Testando com: ${comp.model} (ID: ${comp.id})`);

  const mockPrice = (parseFloat(comp.price) + 10.5).toFixed(2);

  console.log(`Aplicando preço mock: R$ ${mockPrice}`);

  // 2. Perform update like the scraper would
  await db
    .update(components)
    .set({
      price: mockPrice,
      updatedAt: new Date(),
    })
    .where(eq(components.id, comp.id));

  await db.insert(componentPrices).values({
    componentId: comp.id,
    price: mockPrice,
  });

  // 3. Verify results
  const [updated] = await db
    .select()
    .from(components)
    .where(eq(components.id, comp.id));
  const history = await db
    .select()
    .from(componentPrices)
    .where(eq(componentPrices.componentId, comp.id));

  console.log(`Preço no banco: ${updated.price}`);
  console.log(`Data atualização: ${updated.updatedAt}`);
  console.log(`Total de registros no histórico: ${history.length}`);

  if (updated.price === mockPrice && history.length > 0) {
    console.log("✅ Lógica de persistência e histórico validada com sucesso!");
  } else {
    console.error("❌ Falha na validação de persistência.");
    process.exit(1);
  }
}

verify().catch(console.error);
