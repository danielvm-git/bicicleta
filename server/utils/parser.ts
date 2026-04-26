import fs from 'fs';
import { parse } from 'csv-parse/sync';
import XLSX from 'xlsx';

export interface ComponentRow {
  category: string;
  model: string;
  brand?: string;
  line?: string;
  link?: string;
  price: string;
  weight?: string;
  speeds?: string;
  steeringType?: string;
  axleType?: string;
  suspensionTravel?: string;
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
  components: (ComponentRow & { price?: string })[];
}

export function parseCSVContent(content: string, options: any = {}): any[] {
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    ...options,
  });
}

export function parseCSV(path: string, options: any = {}): any[] {
  const content = fs.readFileSync(path, 'utf-8');
  return parseCSVContent(content, options);
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

export function cleanWeight(weightStr: string): string | null {
  if (!weightStr || weightStr === 'N/A' || weightStr === '0') return null;
  // Patterns: "1.2kg", "1200g", "1,2 kg", "1200 gramas"
  let cleaned = weightStr.toLowerCase().replace(',', '.').replace('gramas', 'g').trim();
  
  const kgMatch = cleaned.match(/([\d.]+)\s*kg/);
  if (kgMatch) {
    return parseFloat(kgMatch[1]).toFixed(3);
  }
  
  const gMatch = cleaned.match(/([\d.]+)\s*g/);
  if (gMatch) {
    return (parseFloat(gMatch[1]) / 1000).toFixed(3);
  }
  
  // Try bare number if it looks like kg or g
  const bareMatch = cleaned.match(/^[\d.]+$/);
  if (bareMatch) {
    const val = parseFloat(bareMatch[0]);
    if (val > 50) return (val / 1000).toFixed(3); // Assume grams if > 50
    return val.toFixed(3); // Assume kg
  }
  
  return null;
}

export function inferTechnicalSpecs(model: string, spec?: string, link?: string): { 
  speeds?: string, 
  steeringType?: string, 
  axleType?: string, 
  suspensionTravel?: string 
} {
  const combined = (model + ' ' + (spec || '') + ' ' + (link || '')).toLowerCase();
  const result: any = {};
  
  // Speeds: 12v, 11v, 1x12, 2x10, etc.
  const speedsMatch = combined.match(/\b(\d+v|1x\d+|2x\d+|3x\d+)\b/);
  if (speedsMatch) result.speeds = speedsMatch[0];
  
  // Steering: Tapered, Cônica, Over, Mega Over
  if (combined.includes('tapered') || combined.includes('cônica') || combined.includes('is42/52') || combined.includes('zs44/56')) result.steeringType = 'Tapered';
  else if (combined.includes('mega over') || combined.includes('44mm')) result.steeringType = 'Over';
  else if (combined.includes('over')) result.steeringType = 'Over';
  
  // Axle: Boost, 148, 142, 135, E-thru, QR
  if (combined.includes('110x15') || combined.includes('110mm')) result.axleType = 'Boost 110mm';
  else if (combined.includes('boost') || combined.includes('148x12') || combined.includes('148mm')) result.axleType = 'Boost 148mm';
  else if (combined.includes('142x12') || combined.includes('142mm')) result.axleType = '142x12mm';
  else if (combined.includes('9mm') || combined.includes('qr') || combined.includes('quick release')) result.axleType = 'Quick Release';
  
  // Suspension Travel: 100mm, 120mm, 80mm
  const travelMatch = combined.match(/(\d+mm)/);
  if (travelMatch && (combined.includes('garfo') || combined.includes('suspensão') || combined.includes('shock'))) {
    result.suspensionTravel = travelMatch[1];
  }
  
  return result;
}

export function normalizeCategory(category: string): string {
  const categoryMap: Record<string, string> = {
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

  if (!category) return 'Outros';
  const upper = category.toUpperCase().trim();
  if (categoryMap[upper]) return categoryMap[upper];
  
  return category.trim().toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

export function inferMetadata(model: string, filename?: string): { brand?: string, line?: string } {
  const brands = [
    'Absolute', 'Shimano', 'SRAM', 'RockShox', 'SunRace', 'GTS', 'Kapa', 'Show', 
    'Vicini', 'K7', 'Logan', 'Microshift', 'Promax', 'Chaoyang', 'Pirelli', 
    'Vzan', 'Caloi', 'Oggi', 'Sense', 'Soul', 'TSW', 'Colli', 'SR Suntour', 'Kenda', 'Vittoria'
  ];
  const lines = [
    'Nero', 'Wild', 'Prime', 'Deore', 'Alivio', 'Altus', 'SLX', 'XT', 'XTR', 
    'Eagle', 'NX', 'GX', 'SX', 'Nextep', 'Mia', 'Brut', 'Cues', 'Tourney', 'Acera', 
    'Stamina', 'Explorer', 'React', 'Extreme'
  ];

  let brand: string | undefined;
  let line: string | undefined;

  const modelLower = model.toLowerCase();
  const fnLower = filename ? filename.toLowerCase() : '';

  // Try from model first (more specific)
  for (const b of brands) {
    if (modelLower.includes(b.toLowerCase())) {
      brand = b;
      break;
    }
  }

  for (const l of lines) {
    if (modelLower.includes(l.toLowerCase())) {
      line = l;
      break;
    }
  }

  // If not found in model, try from filename
  if (!brand && fnLower) {
    for (const b of brands) {
      if (fnLower.includes(b.toLowerCase())) {
        brand = b;
        break;
      }
    }
  }

  if (!line && fnLower) {
    for (const l of lines) {
      if (fnLower.includes(l.toLowerCase())) {
        line = l;
        break;
      }
    }
  }

  return { brand, line };
}

export function parseBikeKV(path: string): BikeRow {
  const kv = parseKV(path);
  const components: BikeRow['components'] = [];
  
  const reservedKeys = ['Modelo', 'Preço Sugerido', 'Link', 'Fonte', 'Velocidades'];
  
  for (const [key, value] of Object.entries(kv)) {
    if (!reservedKeys.includes(key)) {
      const { brand, line } = inferMetadata(value, path);
      const specs = inferTechnicalSpecs(value, undefined, kv['Link']);
      const weight = cleanWeight(value);
      components.push({ category: normalizeCategory(key), model: value, brand, line, price: '0', weight: weight || undefined, ...specs });
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
  
  const components: BikeRow['components'] = [];
  let name = 'Desconhecido';
  let totalPrice = '0';
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    
    const category = normalizeCategory(String(row[0] || '').trim());
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
      const { brand, line } = inferMetadata(model, path);
      const specs = inferTechnicalSpecs(model, undefined, link);
      const weight = cleanWeight(model);
      components.push({
        category,
        model,
        brand,
        line,
        link: link || undefined,
        price: cleanPrice(price),
        weight: weight || undefined,
        ...specs
      });
    }
  }
  
  return {
    name,
    price: totalPrice,
    components
  };
}
