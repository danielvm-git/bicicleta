import { db } from '~/server/database/db';
import { components } from '~/server/database/schema';
import { parseCSVContent, cleanPrice, inferMetadata, inferTechnicalSpecs, cleanWeight, normalizeCategory } from '~/server/utils/parser';

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
  }

  const file = formData[0];
  const filename = file.filename || 'upload.csv';
  
  // Currently only CSV support via API for simplicity
  if (!filename.endsWith('.csv')) {
    throw createError({ statusCode: 400, statusMessage: 'Only .csv files are supported via API currently' });
  }

  const content = file.data.toString('utf-8');

  try {
    const records = parseCSVContent(content);
    let successCount = 0;

    for (const row of records) {
      const category = normalizeCategory(row.Categoria || row.Componente || row.item);
      const model = row.Modelo || row.Produto || row.item;
      
      if (!category || !model || category === 'TOTAL') continue;

      const { brand, line } = inferMetadata(model, filename);
      const specs = inferTechnicalSpecs(model, row.Especificação || row.Descricao, row.Link || row.url);
      const weight = cleanWeight(row.Peso || model);

      const data = {
        category,
        model: String(model).trim(),
        brand: row.Marca || row.brand || brand,
        line: row.Linha || row.line || line,
        link: row.Link || row.url,
        price: cleanPrice(row.Preço || row.Preco || row.Valor || '0'),
        weight: weight || null,
        speeds: specs.speeds || null,
        steeringType: specs.steeringType || null,
        axleType: specs.axleType || null,
        suspensionTravel: specs.suspensionTravel || null,
      };

      await db.insert(components).values(data);
      successCount++;
    }

    // Invalidate caches
    const storage = useStorage('cache');
    const keys = await storage.getKeys();
    for (const key of keys) {
      if (key.includes('api-')) {
        await storage.removeItem(key);
      }
    }

    return {
      success: true,
      count: successCount,
      filename
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error processing file',
    });
  }
});
