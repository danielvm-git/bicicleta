# Database Components Audit Report

**Generated**: 2026-04-27 12:22 UTC-3  
**Database**: Bicicleta Project (Neon)

## 📊 EXECUTIVE SUMMARY

| Metric                                           | Value |
| ------------------------------------------------ | ----- |
| **Total Components**                             | 586   |
| **Unique Brands**                                | 20    |
| **Unique Categories**                            | 37    |
| **Unique (Brand, Category, Model) Combinations** | 427   |
| **Duplicate Records Found**                      | 159   |
| **Duplication Rate**                             | 27.1% |

**Key Finding**: The database contains **159 duplicate component records** representing **101 duplicate (brand, category, model) combinations**.

---

## 🔍 DUPLICATE ANALYSIS

### Brands with Most Duplicates

1. **Absolute**: 47 duplicate records
2. **Colli**: 28 duplicate records
3. **Caloi**: 19 duplicate records
4. **TSW**: 6 duplicate records
5. **Shimano**: 12 duplicate records
6. **Other brands**: 41 duplicate records

### Categories Most Affected by Duplicates

1. **Componente** - 33 total records, 1 unique model (32 duplicates = 97%)
2. **Pneus** - 33 total records, 5 unique models (28 duplicates = 85%)
3. **Freios** - 75 total records, 53 unique models (22 duplicates = 29%)
4. **Quadro** - 55 total records, 36 unique models (19 duplicates = 35%)
5. **Suspensão** - 68 total records, 56 unique models (12 duplicates = 18%)

---

## 🎯 REMEDIATION RECOMMENDATIONS

### Priority 1: Critical Cleanup (Degenerate Data)

1. **Componente Category (97% duplicates)**
   - **Issue**: 33 records, but only 1 unique model ("Detalhe" - untranslated/generic)
   - **Records**: Brands Caloi (7), Colli (13), Oggi (3), Sense (2), null (2), TSW (3), others
   - **Action**: Review if this category should exist or needs proper model names
   - **Impact**: Removing could consolidate ~32 duplicate entries

2. **Pneus Category (85% duplicates)**
   - **Issue**: 33 records but only 5 unique models; many are generic "MTB 29\""
   - **Affected**: Brands Caloi (7), Colli (12), TSW (3), Oggi (2), Sense (2), null (2), others
   - **Action**: Break down by tire brand/model; source data may need correction
   - **Impact**: Fixing could eliminate ~28 duplicates

### Priority 2: High Duplication (35%+ duplicates)

- **Caixa de Direção**: 60% duplication - 3 duplicate entries
- **Canote**: 36% duplication - 5 duplicate entries
- **Quadro**: 35% duplication - 19 duplicate entries

### Priority 3: Moderate Duplication (20-35%)

- Corrente, Cubo, Discos, Freios, Guidão, Mesa

### Priority 4: Low Duplication (<20%)

- Cassete, Câmbio Traseiro, Movimento Central, Pedivela, Transmissão

---

## 📋 COMPLETE DUPLICATE LIST

### All 101 Duplicate (Brand, Category, Model) Combinations

#### Absolute (45 duplicates)

- Caixa de Direção > ABSOLUTE 44MM: 3 records [6630, 6857, 6880]
- Caixa de Direção > Absolute Integrada: 2 records [6903, 6925]
- Canote > ABSOLUTE: 3 records [6649, 6876, 6899]
- Canote > CANOTE DE SELIM ABSOLUTE WILD: 2 records [6474, 6628]
- Canote > CANOTE RETRÁTIL ABSOLUTE PRIME EX: 2 records [6473, 6616]
- Cassete > CASSETE ABSOLUTE 11V 11/50D: 2 records [6382, 6622]
- Cassete > CASSETE ABSOLUTE 12V 11/50D: 2 records [6383, 6597]
- Cassete > CASSETE ABSOLUTE PRIME 12V 11/52D: 2 records [6387, 6609]
- Corrente > CORRENTE ABSOLUTE A-12 12V 126 ELOS: 3 records [6388, 6598, 6610]
- Corrente > CORRENTE ABSOLUTE RX-11 11V 116 ELOS: 2 records [6389, 6623]
- Cubo > CUBO DIAN/TRAS ABSOLUTE NERO 2 CS PTO 32F OEM: 2 records [6396, 6601]
- Cubo > PAR DE CUBOS ABSOLUTE PRIME: 2 records [6398, 6613]
- Cubo > PAR DE CUBOS ABSOLUTE WILD DISC: 2 records [6400, 6625]
- Câmbio Traseiro > CAMBIO TRASEIRO ABSOLUTE NERO 12V MTB OEM: 2 records [6407, 6596]
- Câmbio Traseiro > CÂMBIO TRASEIRO WILD II 11V: 2 records [6412, 6621]
- Câmbio Traseiro > CÂMBIO TRASEIRO WILD II 12V: 2 records [6411, 6608]
- Discos > DISCO DE FREIO ABSOLUTE NERO: 2 records [6433, 6594]
- Freios > FREIO A DISCO HIDRÁULICO ABSOLUTE PRIME: 2 records [6461, 6606]
- Freios > FREIO A DISCO HIDRÁULICO ABSOLUTE WILD 2: 2 records [6465, 6619]
- Freios > FREIO A DISCO MECÂNICO ABSOLUTE NERO IS: 2 records [6455, 6593]
- Guidão > GUIDÃO ABSOLUTE NERO: 2 records [6480, 6602]
- Guidão > GUIDÃO ABSOLUTE PRIME 35: 2 records [6481, 6614]
- Guidão > GUIDÃO ABSOLUTE WILD ELEVADO: 2 records [6479, 6626]
- Guidão > KIT ABSOLUTE ALUMINIO: 3 records [6646, 6873, 6896]
- Manopla > ABSOLUTE DE ESPUMA: 3 records [6648, 6875, 6898]
- Mesa > ABSOLUTE: 3 records [6647, 6874, 6897]
- Mesa > SUPORTE DE GUIDÃO ABSOLUTE NERO: 2 records [6498, 6603]
- Mesa > SUPORTE DE GUIDÃO ABSOLUTE PRIME 35: 2 records [6493, 6615]
- Mesa > SUPORTE DE GUIDÃO ABSOLUTE WILD: 2 records [6496, 6627]
- Movimento Central > MOVIMENTO CENTRAL ABSOLUTE PRIME 68/73MM: 2 records [6557, 6612]
- Movimento Central > MOVIMENTO CENTRAL ABSOLUTE SELADO: 2 records [6556, 6600]
- Pedal > ABSOLUTE BRUTUS: 2 records [6651, 6878]
- Pedivela > PEDIVELA ABSOLUTE ALUMÍNIO SINGLE: 2 records [6560, 6599]
- Pedivela > PEDIVELA ABSOLUTE PRIME: 2 records [6565, 6611]
- Pedivela > PEDIVELA ABSOLUTE WILD: 2 records [6569, 6624]
- Quadro > Absolute Wild 2: 2 records [6902, 6924]
- Quadro > QUADRO 29 MTB ABSOLUTE NERO 5: 2 records [6374, 6591]
- Quadro > QUADRO 29 MTB ABSOLUTE PRIME SL III: 2 records [6367, 6604]
- Quadro > QUADRO 29 MTB ABSOLUTE WILD BOOST: 2 records [6377, 6617]
- Selim > ABSOLUTE POWER: 3 records [6650, 6877, 6900]
- Suspensão > GARFO 29 ABSOLUTE NERO SPORT RL PTO 100MM: 2 records [6509, 6592]
- Suspensão > GARFO 29 ABSOLUTE PRIME EX: 2 records [6529, 6605]
- Suspensão > GARFO 29 ABSOLUTE WILD 34 AIR: 2 records [6521, 6618]
- Transmissão > Prime 12v: 2 records [6574, 6575]
- Trocador Traseiro > ALAVANCA ABSOLUTE NERO 12V DIR PTO OEM: 2 records [6595, 6607]

#### Caloi (11 duplicates)

- Componente > Detalhe: 7 records [6652, 6658, 6664, 6670, 6676, 6682, 6688]
- Pneus > MTB 29": 7 records [6657, 6663, 6669, 6675, 6681, 6687, 6693]
- Quadro > Alumínio 6061 conformado: 3 records [6653, 6659, 6665]
- Suspensão > 100mm: 2 records [6660, 6666]

#### Colli (21 duplicates)

- Componente > Detalhe: 13 records [6694, 6700, 6706, 6712, 6718, 6724, 6730, 6736, 6742, 6748, 6754, 6760, 6766]
- Freios > Disco Hidráulico: 6 records [6698, 6728, 6740, 6752, 6758, 6770]
- Freios > Disco Hidráulico Colli: 2 records [6722, 6734]
- Freios > Disco Mecânico: 3 records [6704, 6710, 6764]
- Pneus > MTB 29": 12 records [6705, 6711, 6717, 6723, 6729, 6735, 6741, 6747, 6753, 6759, 6765, 6771]
- Quadro > Alumínio: 2 records [6743, 6761]
- Quadro > Alumínio 6061 com cabeamento interno: 5 records [6701, 6719, 6731, 6755, 6767]
- Quadro > MTB HT Alumínio 6061 T4+T6: 2 records [6725, 6737]
- Suspensão > Aço: 2 records [6708, 6762]
- Suspensão > Over Ahead com trava no guidão: 4 records [6732, 6750, 6756, 6768]

#### Other Brands (24 duplicates)

- Chaoyang > Pneu > CHAOYANG VICTORY 2.20: 2 records [6644, 6871]
- Logan > Freios > Disco Hidráulico Logan HDM500: 2 records [6674, 6680]
- Oggi > Componente > Detalhe: 3 records [6790, 6796, 6802]
- Oggi > Freios > Disco Hidráulico: 2 records [6794, 6800]
- Oggi > Pneus > MTB 29": 2 records [6801, 6807]
- Oggi > Quadro > Alumínio 6061 T6 tratado - Rota interna: 2 records [6791, 6797]
- SR Suntour > Suspensão > SR SUNTOUR XCM30: 2 records [6631, 6858]
- SR Suntour > Suspensão > SR Suntour XCM 32 (100mm): 2 records [6846, 6852]
- Sense > Componente > Detalhe: 2 records [6808, 6814]
- Sense > Pneus > MTB 29": 2 records [6813, 6819]
- Sense > Quadro > Alumínio 6061 T4/T6 Hidroformado: 2 records [6809, 6815]
- Shimano > Discos > SHIMANO RT26 160MM: 3 records [6633, 6860, 6883]
- Shimano > Freios > Disco Hidráulico Shimano: 2 records [6777, 6784]
- Shimano > Freios > Disco Hidráulico Shimano MT200: 2 records [6686, 6812]
- Shimano > Freios > SHIMANO MT200: 3 records [6632, 6859, 6882]
- Shimano > Freios > Shimano MT200 Hidráulico: 2 records [6842, 6854]
- Shimano > Movimento Central > SHIMANO BB52: 2 records [6640, 6890]
- Shimano > Transmissão > Shimano CUES 9v (1x9): 2 records [6751, 6853]
- Shimano > Transmissão > Shimano Cues 11v (1x11): 2 records [6823, 6829]
- Shimano > Transmissão > Shimano Cues 18v (2x9): 2 records [6783, 6811]
- Shimano > Transmissão > Shimano Cues 9v (1x9): 2 records [6776, 6793]
- Shimano > Transmissão > Shimano Tourney / Altus (3x7v): 2 records [6655, 6667]
- Show > Quadro > SHOW NEXTEP: 3 records [6629, 6856, 6879]
- Soul > Componente > Detalhe: 3 records [6820, 6826, 6832]
- Soul > Freios > Brave Hidráulico: 2 records [6824, 6830]
- Soul > Suspensão > Suntour XCM RL DS29 100mm: 2 records [6822, 6828]
- TSW > Componente > Detalhe: 3 records [6838, 6844, 6850]
- TSW > Pneus > MTB 29": 3 records [6843, 6849, 6855]
- Vittoria > Pneus > Vittoria Mezcal III 29x2.1: 2 records [6825, 6831]
- Vzan > Aro > VZAN EXTREME PRO: 2 records [6641, 6868]
- Vzan > Cubo > VZAN: 2 records [6642, 6869]
- null > Canote > EXA Form 900i 125mm: 2 records [6922, 6944]
- null > Componente > Detalhe: 2 records [6772, 6779]
- null > Corrente > KMC X12: 2 records [6911, 6933]
- null > Câmara > Kit Tubeless: 2 records [6918, 6940]
- null > Câmbio Dianteiro > -: 3 records [6886, 6908, 6930]
- null > Mesa > Kalloy Uno 70x7: 2 records [6920, 6942]
- null > Movimento Central > BB52: 2 records [6913, 6935]
- null > Pedivela > MT510: 2 records [6912, 6934]
- null > Pneus > MTB 29": 2 records [6778, 6785]
- null > Quadro > Alumínio 6061 K 4.0: 2 records [6774, 6781]
- null > Selim > Ryet Ultimate: 2 records [6923, 6945]
- null > Suspensão > Hidráulica com trava no guidão: 2 records [6775, 6782]

---

## 🛠️ TOOLS AVAILABLE FOR CLEANUP

### Run Duplicate Detection with list-components script

```bash
npm run dev -- server/scripts/list-components.ts
```

(Note: This requires database connectivity from localhost)

### Query Duplicates via Neon

Already queried via MCP - see duplicate list above.

### Delete Specific Duplicates

Example SQL to remove specific component IDs (keep lowest ID, delete duplicates):

```sql
-- For Absolute > Caixa de Direção > ABSOLUTE 44MM (keep 6630, delete 6857, 6880)
DELETE FROM bike_components WHERE component_id IN (6857, 6880);
DELETE FROM component_prices WHERE component_id IN (6857, 6880);
DELETE FROM components WHERE id IN (6857, 6880);
```

### Validate After Cleanup

```bash
npm run dev -- server/scripts/verify-data.ts
```

---

## 📌 NEXT STEPS

1. **Review Priority 1 items** - Decide if "Componente" (generic) should exist as-is
2. **Fix data quality** - Source data for "Pneus" category may need corrections
3. **Plan removal strategy** - Determine deduplication rules (keep first ID vs. most recent)
4. **Test cleanup** - Use a test batch first to verify referential integrity
5. **Validate** - Run verification script after each cleanup batch
6. **Monitor** - Check for any broken relationships in bike configurations
