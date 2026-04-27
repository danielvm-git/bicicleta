import { db } from "../../../database/db";
import { components } from "../../../database/schema";
import { eq, and, sql } from "drizzle-orm";
import { CATALOG_CACHE_HANDLER_NAME } from "~/server/utils/componentCatalog";

const TARGET_AREAS = [
  "Transmissão",
  "Freios",
  "Rodas",
  "Cockpit",
  "Estrutura",
  "Conforto",
];

// Mapeamento de Categorias para Áreas Funcionais (Matriz)
const CATEGORY_TO_AREA: Record<string, string> = {
  // Transmissão
  Cassete: "Transmissão",
  "Câmbio Dianteiro": "Transmissão",
  "Câmbio Traseiro": "Transmissão",
  Pedivela: "Transmissão",
  Trocador: "Transmissão",
  "Trocador Traseiro": "Transmissão",
  "Movimento Central": "Transmissão",
  Movimento: "Transmissão",
  Pedal: "Transmissão",
  Corrente: "Transmissão",
  Transmissão: "Transmissão",

  // Freios
  Freios: "Freios",
  Discos: "Freios",
  Pinça: "Freios",

  // Rodas
  Rodas: "Rodas",
  Aro: "Rodas",
  Cubo: "Rodas",
  Raio: "Rodas",
  Pneu: "Rodas",
  Pneus: "Rodas",
  Câmara: "Rodas",
  "Câmara/tubeless": "Rodas",
  Tubeless: "Rodas",

  // Cockpit
  Guidão: "Cockpit",
  Mesa: "Cockpit",
  Canote: "Cockpit",
  "Caixa de Direção": "Cockpit",
  Cockpit: "Cockpit",

  // Estrutura
  Quadro: "Estrutura",
  Suspensão: "Estrutura",
  Garfo: "Estrutura",

  // Conforto
  Selim: "Conforto",
  Manopla: "Conforto",
};

export default defineCachedEventHandler(
  async (event) => {
    const brandName = getRouterParam(event, "name");

    if (!brandName) {
      throw createError({
        statusCode: 400,
        message: "Brand name is required",
      });
    }

    const allComponents = await db
      .select()
      .from(components)
      .where(
        and(
          eq(components.brand, brandName.toLowerCase()),
          sql`functional_group != 'Sistema'`
        )
      );

    const matrix: any = {};
    TARGET_AREAS.forEach((area) => {
      matrix[area] = {
        Pro: [],
        Mid: [],
        Entry: [],
      };
    });

    allComponents.forEach((comp) => {
      const area = CATEGORY_TO_AREA[comp.category];
      const level = comp.performanceLevel || "Mid";

      if (area && matrix[area] && matrix[area][level]) {
        matrix[area][level].push({
          id: comp.id,
          category: comp.category,
          model: comp.model,
          line: comp.line,
          price: comp.price,
        });
      }
    });

    return {
      brand: brandName,
      matrix,
    };
  },
  {
    maxAge: 60 * 60,
    name: "api-brand-matrix",
    getKey: (event) => `matrix-${getRouterParam(event, "name")?.toLowerCase()}`,
  }
);
