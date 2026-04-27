# 🔍 AUDITORIA DE DESIGN - Bicicleta

**Data**: 2026-04-27 | **Status**: Diagnóstico Completo

---

## 🚨 PROBLEMAS IDENTIFICADOS

### 1. **FALTA DE UNIDADE VISUAL** ⚠️

#### Tipografia

- **Display Font**: Bricolage Grotesque (OK - característica)
- **Body Font**: Source Serif 4 (OK - legível)
- ❌ **Problema**: Inconsistência no uso. Páginas diferentes usam sizes/weights aleatórios
- ❌ Sem hierarquia tipográfica clara (text-3xl misturado com text-5xl sem lógica)

#### Cores

- Usa Nuxt UI defaults (azul primário + cinza)
- ❌ Sem palette coesa
- ❌ Dark mode genérico (cinza escuro, sem caracter)
- ❌ Acentos não têm propósito

#### Layout

- ❌ UContainer em algumas pages, full-width em outras
- ❌ Grid inconsistente (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 vs grid-cols-2)
- ❌ Padding/margin aleatório (py-8, py-12, py-16 sem padrão)
- ❌ Cards às vezes com shadows, às vezes sem

---

### 2. **FALTA DE HARMONIA** 🎨

#### Páginas Auditadas:

**App.vue (Root Layout)**

- Header branco/cinza genérico
- Nenhum visual identity
- Sticky navigation (funciona, mas visuamente chata)

**Pages/components.vue**

- Card básico para filtros (genérico)
- Table padrão Nuxt UI
- Sem visual breathing room
- Monótono

**Pages/builder.vue**

- Left sidebar + main content
- Accordions Nuxt UI padrão
- Nenhuma diferenciação
- Parece "ferramenta de admin" e não "app premium"

**Pages/b/[slug].vue** (Nova página que criamos)

- ✅ EXCELENTE - Dark mode + gradients + hover states
- ✅ Harmonia coesa
- ✅ Mas não conecta com o resto do site!

**Pages/brands/index.vue**

- Cards com hover effects legais
- Mas estilo diferente do builder
- Inconsistência com b/[slug]

---

### 3. **PROBLEMAS ESPECÍFICOS**

| Aspecto                | Problema                   | Impacto           |
| ---------------------- | -------------------------- | ----------------- |
| **Cores**              | Sem palette definida       | Parece amador     |
| **Tipografia**         | Weights aleatórios         | Hierarquia fraca  |
| **Spacing**            | Inconsistente              | Amador, confuso   |
| **Componentes**        | Mix de padrões             | Desconexo         |
| **Dark Mode**          | Genérico (just gray)       | Sem personalidade |
| **Icons**              | Heroicons OK, mas sem tema | Neutro demais     |
| **Transições**         | Poucas animações           | Estático, chato   |
| **Micro-interactions** | Quase nenhuma              | Não engaja        |

---

## 💡 OPORTUNIDADES

1. ✅ Você TEM fontes boas (Bricolage + Source Serif)
2. ✅ Estrutura HTML semântica
3. ✅ Nuxt UI é base solid
4. ✅ Dark mode suported
5. ✅ Nova página (b/[slug]) prova que consegue fazer coeso

---

## 🎯 DIAGNÓSTICO FINAL

**Situação**: Site tem boa funcionalidade, mas visual é **genérico e inconsistente**.

**Causa**: Cada página foi designada isoladamente, sem sistema visual unificado.

**Solução**: Criar **design system coeso** com direção estética clara.

---

## 5 HIPÓTESES DE AESTHETIC DIRECTION

Vou criar protótipos para você comparar:

### 1. **SPORT-TECH** (Dark + Gradients)

- Baseado no que você já fez bem
- Dark slate + cyan/blue gradients
- Maximalist animations
- **Público**: Tech-savvy, moderno, premium

### 2. **BRUTALIST** (Minimal + Raw)

- Preto + branco + vermelho
- Tipografia bold, sem-nonsense
- Zero decoração (apenas essencial)
- **Público**: Designers que gostam de anti-design

### 3. **EDITORIAL** (Magazine + Serif)

- Fundo cream/off-white
- Tipografia serif dominante
- Grid clássico + whitespace
- **Público**: Profissionais, técnicos, educadores

### 4. **RETRO-FUTURISMO** (90s + Neon)

- Fundo escuro
- Neon cyan/magenta/yellow
- Tipografia blocky
- Borders em cores fluorescentes
- **Público**: Gamer/alternative audience

### 5. **ORGANIC** (Green + Curves)

- Fundo natural (beige/sage)
- Formas orgânicas (border-radius alto)
- Tipografia rounded
- Cores terra + verde
- **Público**: Sustentabilidade, comunidade

---

Vou criar agora os 5 protótipos navegáveis!
