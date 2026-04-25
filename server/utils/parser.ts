import fs from 'fs';
import { parse } from 'csv-parse/sync';
import XLSX from 'xlsx';

export interface ComponentRow {
  category: string;
  model: string;
  link?: string;
  price: string;
}

export interface GroupRow {
  brand: string;
  line: string;
  configuration: string;
  frontShifter?: string;
  rearShifter?: string;
  frontDerailleur?: string;
  rearDerailleur?: string;
  cassette?: string;
  bottomBracket?: string;
  chain?: string;
  crankset?: string;
  axleType?: string;
}

export interface BikeRow {
  name: string;
  price: string;
  link?: string;
  components: { category: string; model: string }[];
}

export function parseCSV(path: string, options: any = {}): any[] {
  const content = fs.readFileSync(path, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    ...options,
  });
}

export function parseKV(path: string): Record<string, string> {
  const content = fs.readFileSync(path, 'utf-8');
  const records = parse(content, {
    columns: false,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  });
  
  const result: Record<string, string> = {};
  for (const [key, value] of records) {
    if (key && value) {
      result[key] = value;
    }
  }
  return result;
}

export function cleanPrice(priceStr: string): string {
  if (!priceStr) return '0';
  // Remove R$, dots used as thousands separators, and change comma to dot if needed
  // Example: "R$ 2.190.00" -> "2190.00"
  // Example: "2.190,00" -> "2190.00"
  let cleaned = priceStr.replace('R$', '').trim();
  
  // If it contains both . and , (e.g. 1.234,56)
  if (cleaned.includes('.') && cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes(',')) {
    // If it only contains , (e.g. 1234,56)
    cleaned = cleaned.replace(',', '.');
  }
  
  // Remove remaining thousands separators if they are dots and there's another dot for decimals
  // Or if the dot is followed by 3 digits and it's not the end of the string
  // Actually, usually it's easier to just remove all non-numeric except the last dot
  const parts = cleaned.split('.');
  if (parts.length > 2) {
     cleaned = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
  }

  const numericValue = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
  return isNaN(numericValue) ? '0' : numericValue.toFixed(2);
}

export function parseBikeKV(path: string): BikeRow {
  const kv = parseKV(path);
  const components: { category: string; model: string }[] = [];
  
  const reservedKeys = ['Modelo', 'Preço Sugerido', 'Link', 'Fonte', 'Velocidades'];
  
  for (const [key, value] of Object.entries(kv)) {
    if (!reservedKeys.includes(key)) {
      components.push({ category: key, model: value });
    }
  }
  
  return {
    name: kv['Modelo'] || 'Desconhecido',
    price: cleanPrice(kv['Preço Sugerido'] || '0'),
    link: kv['Link'],
    components,
  };
}

export function parseXLSX(path: string): BikeRow {
  const workbook = XLSX.readFile(path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  const components: { category: string; model: string; link?: string; price?: string }[] = [];
  let name = 'Desconhecido';
  let totalPrice = '0';
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    
    const category = String(row[0] || '').trim();
    const model = String(row[1] || '').trim();
    const link = String(row[2] || '').trim();
    const price = String(row[3] || '').trim();
    
    if (category === 'TOTAL') {
      totalPrice = cleanPrice(price);
      continue;
    }
    
    if (category && model) {
      if (category === 'QUADRO' && name === 'Desconhecido') {
        name = model;
      }
      components.push({
        category,
        model,
        link: link || undefined,
        price: cleanPrice(price)
      });
    }
  }
  
  return {
    name,
    price: totalPrice,
    components: components as any
  };
}
