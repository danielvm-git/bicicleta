import { db } from '../database/db';
import { components } from '../database/schema';
import { eq, sql } from 'drizzle-orm';

const normalizationMap: Record<string, string> = {
  'ARO': 'Aro',
  'CAIXA DE DIREÇÃO': 'Caixa de Direção',
  'CAMBIO D': 'Câmbio Dianteiro',
  'CAMBIO T': 'Câmbio Traseiro',
  'CANOTE': 'Canote',
  'CASSETE': 'Cassete',
  'CORRENTE': 'Corrente',
  'CUBO': 'Cubo',
  'CÂMARA': 'Câmara',
  'DISCOS': 'Discos',
  'FREIOS': 'Freios',
  'GUIDÃO': 'Guidão',
  'MANOPLA': 'Manopla',
  'MESA': 'Mesa',
  'MOVIMENTO CENTRAL': 'Movimento Central',
  'PEDAL': 'Pedal',
  'PEDIVELA': 'Pedivela',
  'PNEU': 'Pneu',
  'QUADRO': 'Quadro',
  'RAIO': 'Raio',
  'SELIM': 'Selim',
  'SUSPENSÃO': 'Suspensão',
  'TROCADOR': 'Trocador',
  'TUBELESS': 'Tubeless'
};

function toTitleCase(str: string): string {
  const upper = str.toUpperCase().trim();
  if (normalizationMap[upper]) return normalizationMap[upper];
  
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

async function sanitize() {
  console.log('--- Sanitizando Categorias ---');

  const allComponents = await db.select({ id: components.id, category: components.category }).from(components);
  console.log(`Processando ${allComponents.length} componentes...`);

  let updateCount = 0;
  for (const comp of allComponents) {
    const normalized = toTitleCase(comp.category);
    if (normalized !== comp.category) {
      await db.update(components)
        .set({ category: normalized })
        .where(eq(components.id, comp.id));
      updateCount++;
    }
  }

  console.log(`Pronto! ${updateCount} componentes atualizados.`);

  const finalStats = await db.select({ 
    category: components.category, 
    count: sql<number>`count(*)` 
  }).from(components).groupBy(components.category).orderBy(components.category);
  
  console.log('\n--- Estatísticas Finais ---');
  console.log(`Total de categorias únicas: ${finalStats.length}`);
  // finalStats.forEach(s => console.log(` - ${s.category}: ${s.count}`));
}

sanitize().catch(console.error);
