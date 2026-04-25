import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { db } from '../database/db';
import { components, groups, builds, buildComponents } from '../database/schema';
import { parseCSV, parseBikeKV, parseXLSX, cleanPrice, inferMetadata } from '../utils/parser';

async function seed() {
  const dryRun = process.argv.includes('--dry-run');

  if (dryRun) {
    console.log('--- DRY RUN ---');
  }

  if (!dryRun) {
    console.log('Cleaning existing data...');
    await db.delete(buildComponents);
    await db.delete(builds);
    await db.delete(groups);
    await db.delete(components);
  }

  // 1. Seed Components from Tabular CSV
  console.log('Seeding components from CSV...');
  const componentsFiles = [
    'componentes_absolute_candidatos.csv',
    'absolute_wild.csv',
    'montagem_absolute_nero.csv',
    'montagem_absolute_prime.csv',
    'montagem_absolute_wild.csv',
    'montagem_show_nextep.csv'
  ];

  for (const file of componentsFiles) {
    if (fs.existsSync(file)) {
      console.log(`Processing ${file}...`);
      const componentRows = parseCSV(file);
      for (const row of componentRows) {
        const category = row.Categoria || row.Componente || row.item;
        const model = row.Modelo || row.Produto || row.item;
        
        if (category === 'TOTAL' || !category || !model) continue;

        const { brand: inferredBrand, line: inferredLine } = inferMetadata(String(model), file);

        const data = {
          category: String(category).trim(),
          model: String(model).trim(),
          brand: row.Marca || row.brand || inferredBrand,
          line: row.Linha || row.line || inferredLine,
          link: row.Link || row.url,
          price: cleanPrice(row.Preço || row.Preco || row.Valor || '0'),
        };
        
        if (!dryRun) {
          await db.insert(components).values(data);
        } else {
          console.log(`[DRY RUN] Would insert component: [${data.category}] ${data.model} (Brand: ${data.brand}, Line: ${data.line}) from ${file}`);
        }
      }
    }
  }

  // 2. Seed Groups
  console.log('Seeding groups...');
  const groupsFile = 'grupo_completo.csv';
  if (fs.existsSync(groupsFile)) {
    const groupRows = parseCSV(groupsFile);
    for (const row of groupRows) {
      const data = {
        brand: row.Marca,
        line: row.Linha,
        configuration: row.Configuracao,
        frontShifter: row.Trocador_Dianteiro === 'N/A' ? null : row.Trocador_Dianteiro,
        rearShifter: row.Trocador_Traseiro === 'N/A' ? null : row.Trocador_Traseiro,
        frontDerailleur: row.Cambio_Dianteiro === 'N/A' ? null : row.Cambio_Dianteiro,
        rearDerailleur: row.Cambio_Traseiro === 'N/A' ? null : row.Cambio_Traseiro,
        cassette: row.Cassete === 'N/A' ? null : row.Cassete,
        bottomBracket: row.Movimento_Central === 'N/A' ? null : row.Movimento_Central,
        chain: row.Corrente === 'N/A' ? null : row.Corrente,
        crankset: row.Pedivela === 'N/A' ? null : row.Pedivela,
        axleType: row.Tipo_Eixo === 'N/A' ? null : row.Tipo_Eixo,
      };
      if (!dryRun) {
        await db.insert(groups).values(data);
      } else {
        console.log(`[DRY RUN] Would insert group: ${data.brand} ${data.line} ${data.configuration}`);
      }
    }
  }

  // 3. Seed Bikes (Builds) from KV CSVs
  console.log('Seeding bikes from CSV KV...');
  const bikesDir = 'bicicletas_analise';
  if (fs.existsSync(bikesDir)) {
    const bikeFiles = fs.readdirSync(bikesDir).filter(f => f.endsWith('.csv'));
    for (const file of bikeFiles) {
      const bikePath = path.join(bikesDir, file);
      const bikeData = parseBikeKV(bikePath);
      
      if (!dryRun) {
        const [insertedBuild] = await db.insert(builds).values({
          name: bikeData.name,
          description: `Importado de ${file}`,
          totalPrice: bikeData.price,
        }).returning();

        for (const component of bikeData.components) {
          const [insertedComponent] = await db.insert(components).values({
            category: component.category,
            model: component.model,
            brand: component.brand,
            line: component.line,
            price: '0',
          }).returning();

          await db.insert(buildComponents).values({
            buildId: insertedBuild.id,
            componentId: insertedComponent.id,
          });
        }
      } else {
        console.log(`[DRY RUN] Would insert bike: ${bikeData.name} with ${bikeData.components.length} components`);
      }
    }
  }

  // 4. Seed Bikes from XLSX
  console.log('Seeding bikes from XLSX...');
  const xlsxFiles = [
    'MTB Montada R$3.000.xlsx',
    'MTB Montada R$5.000.xlsx',
    'MTB Montada R$7.500.xlsx',
    'MTB Montada R$10.000.xlsx'
  ];

  for (const file of xlsxFiles) {
    if (fs.existsSync(file)) {
      const bikeData = parseXLSX(file);
      if (!dryRun) {
        const [insertedBuild] = await db.insert(builds).values({
          name: `${file.replace('.xlsx', '')} (${bikeData.name})`,
          description: `Importado de ${file}`,
          totalPrice: bikeData.price,
        }).returning();

        for (const component of bikeData.components) {
          const [insertedComponent] = await db.insert(components).values({
            category: component.category,
            model: component.model,
            brand: component.brand,
            line: component.line,
            link: component.link,
            price: component.price || '0',
          }).returning();

          await db.insert(buildComponents).values({
            buildId: insertedBuild.id,
            componentId: insertedComponent.id,
          });
        }
      } else {
        console.log(`[DRY RUN] Would insert XLSX bike: ${bikeData.name} from ${file} with ${bikeData.components.length} components`);
      }
    }
  }

  console.log('Seed completed!');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
