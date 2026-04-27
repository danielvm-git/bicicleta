<script setup lang="ts">
import { ref } from "vue";

const selectedTheme = ref<
  "sport-tech" | "brutalist" | "editorial" | "retro-futurism" | "organic"
>("sport-tech");

const themes = [
  {
    id: "sport-tech",
    name: "Sport-Tech",
    description: "Dark + Gradients. Premium tech feel com animações.",
    colors: ["#0E1219", "#06B6D4", "#0EA5E9"],
    audience: "Tech-savvy, moderno, premium",
  },
  {
    id: "brutalist",
    name: "Brutalist",
    description: "Preto + Branco + Vermelho. Minimal e raw.",
    colors: ["#000000", "#FFFFFF", "#EF4444"],
    audience: "Anti-design, designers",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Magazine style. Serif + whitespace.",
    colors: ["#F5F1E8", "#1A1A1A", "#8B7355"],
    audience: "Profissionais, técnicos",
  },
  {
    id: "retro-futurism",
    name: "Retro-Futurism",
    description: "90s + Neon. Cyber-aesthetic.",
    colors: ["#1A1A2E", "#00F0FF", "#FF006E"],
    audience: "Gamers, alternative",
  },
  {
    id: "organic",
    name: "Organic",
    description: "Green + Curves. Natural, sustentável.",
    colors: ["#FEF3E2", "#2D5016", "#7CB342"],
    audience: "Sustentabilidade, comunidade",
  },
];

const sampleBikes = [
  { name: "Absolute Wild 2", price: "R$ 5.200", components: 18 },
  { name: "Caloi Elite SL", price: "R$ 4.800", components: 16 },
  { name: "Colli Aro 29", price: "R$ 3.500", components: 14 },
];

// Get theme styles
const getThemeClasses = (themeId: string) => {
  const themes: Record<string, any> = {
    "sport-tech": {
      bgMain: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
      bgCard:
        "bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50",
      textPrimary: "text-white",
      textSecondary: "text-slate-400",
      accentGradient: "from-cyan-400 to-blue-400",
      buttonGradient:
        "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600",
      headerBg: "bg-slate-900 border-b border-slate-800",
    },
    brutalist: {
      bgMain: "bg-black",
      bgCard: "bg-white border-2 border-black hover:border-red-600",
      textPrimary: "text-black",
      textSecondary: "text-gray-600",
      accentGradient: "from-black to-red-600",
      buttonGradient:
        "bg-black text-white border-2 border-black hover:bg-red-600 hover:border-red-600",
      headerBg: "bg-white border-b-2 border-black",
    },
    editorial: {
      bgMain: "bg-[#F5F1E8]",
      bgCard: "bg-white border border-[#E5DECC] hover:shadow-lg",
      textPrimary: "text-[#1A1A1A]",
      textSecondary: "text-[#666666]",
      accentGradient: "from-[#8B7355] to-[#A89968]",
      buttonGradient: "bg-[#8B7355] text-white hover:bg-[#6B5345]",
      headerBg: "bg-white border-b border-[#E5DECC]",
    },
    "retro-futurism": {
      bgMain: "bg-[#1A1A2E]",
      bgCard:
        "bg-[#16213E] border-2 border-[#00F0FF] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]",
      textPrimary: "text-[#00F0FF]",
      textSecondary: "text-[#FF006E]",
      accentGradient: "from-[#00F0FF] to-[#FF006E]",
      buttonGradient:
        "bg-[#00F0FF] text-[#1A1A2E] hover:bg-[#FF006E] hover:text-white font-black",
      headerBg: "bg-[#0F3460] border-b-2 border-[#00F0FF]",
    },
    organic: {
      bgMain: "bg-gradient-to-br from-[#FEF3E2] via-[#FAF6F0] to-[#FEF3E2]",
      bgCard:
        "bg-white rounded-3xl border-2 border-[#E8DCC8] hover:border-[#7CB342] shadow-sm hover:shadow-lg",
      textPrimary: "text-[#2D5016]",
      textSecondary: "text-[#666633]",
      accentGradient: "from-[#7CB342] to-[#9CCC65]",
      buttonGradient:
        "bg-gradient-to-r from-[#7CB342] to-[#9CCC65] text-white hover:from-[#689F38] hover:to-[#8BC34A]",
      headerBg: "bg-white/80 backdrop-blur border-b border-[#E8DCC8]",
    },
  };
  return themes[themeId];
};

const currentTheme = computed(() => getThemeClasses(selectedTheme.value));
</script>

<template>
  <div
    :class="['min-h-screen transition-all duration-500', currentTheme.bgMain]"
  >
    <!-- Header Navigation -->
    <div :class="['sticky top-0 z-40 py-4 border-b', currentTheme.headerBg]">
      <div class="max-w-6xl mx-auto px-4">
        <div class="mb-6">
          <h1 :class="['text-2xl font-bold mb-2', currentTheme.textPrimary]">
            Design System Gallery
          </h1>
          <p :class="['text-sm', currentTheme.textSecondary]">
            Explore 5 aesthetic directions para Bicicleta
          </p>
        </div>

        <!-- Theme Selector -->
        <div class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="theme in themes"
            :key="theme.id"
            @click="selectedTheme = theme.id as any"
            :class="[
              'px-4 py-2 rounded-lg transition-all whitespace-nowrap font-semibold',
              selectedTheme === theme.id
                ? [currentTheme.buttonGradient, 'border-0']
                : [
                    'border',
                    selectedTheme === 'sport-tech'
                      ? 'border-slate-600'
                      : 'border-gray-300',
                  ],
            ]"
          >
            {{ theme.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 py-12">
      <!-- Theme Info Card -->
      <div :class="['rounded-xl p-8 mb-12 border', currentTheme.bgCard]">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 :class="['text-3xl font-bold mb-2', currentTheme.textPrimary]">
              {{ themes.find((t) => t.id === selectedTheme)?.name }}
            </h2>
            <p :class="['text-lg mb-4', currentTheme.textSecondary]">
              {{ themes.find((t) => t.id === selectedTheme)?.description }}
            </p>
          </div>
          <!-- Color Palette -->
          <div class="flex gap-3">
            <div
              v-for="(color, idx) in themes.find((t) => t.id === selectedTheme)
                ?.colors"
              :key="idx"
              :style="{
                backgroundColor: color,
                borderColor: selectedTheme === 'brutalist' ? '#000' : color,
              }"
              class="w-12 h-12 rounded-lg border-2"
              :title="`Color ${idx + 1}: ${color}`"
            />
          </div>
        </div>
        <p :class="['text-sm font-semibold', currentTheme.textSecondary]">
          👥 {{ themes.find((t) => t.id === selectedTheme)?.audience }}
        </p>
      </div>

      <!-- Component Examples -->
      <div class="space-y-12">
        <!-- Hero Section Preview -->
        <section>
          <h3 :class="['text-2xl font-bold mb-6', currentTheme.textPrimary]">
            Hero Section
          </h3>
          <div :class="['rounded-xl p-12 border', currentTheme.bgCard]">
            <h2 :class="['text-4xl font-bold mb-4', currentTheme.textPrimary]">
              Absolute Wild 2
            </h2>
            <p :class="['text-lg mb-8', currentTheme.textSecondary]">
              Premium MTB com componentes selecionados
            </p>
            <div class="flex gap-4">
              <button
                :class="[
                  'px-6 py-3 rounded-lg font-bold transition-all',
                  currentTheme.buttonGradient,
                ]"
              >
                Ver Detalhes
              </button>
              <button
                :class="[
                  'px-6 py-3 rounded-lg border-2 font-bold',
                  currentTheme.textPrimary,
                ]"
              >
                Comparar
              </button>
            </div>
          </div>
        </section>

        <!-- Bike Cards -->
        <section>
          <h3 :class="['text-2xl font-bold mb-6', currentTheme.textPrimary]">
            Bike Cards
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              v-for="bike in sampleBikes"
              :key="bike.name"
              :class="[
                'rounded-xl p-6 border transition-all cursor-pointer',
                currentTheme.bgCard,
              ]"
            >
              <h4 :class="['font-bold text-lg mb-2', currentTheme.textPrimary]">
                {{ bike.name }}
              </h4>
              <div :class="['text-sm mb-4', currentTheme.textSecondary]">
                <p>{{ bike.components }} componentes</p>
                <p class="font-bold">{{ bike.price }}</p>
              </div>
              <button
                :class="[
                  'w-full py-2 rounded-lg font-bold transition-all',
                  currentTheme.buttonGradient,
                ]"
              >
                Ver Bike
              </button>
            </div>
          </div>
        </section>

        <!-- Component Specs Table -->
        <section>
          <h3 :class="['text-2xl font-bold mb-6', currentTheme.textPrimary]">
            Components List
          </h3>
          <div
            :class="['rounded-xl overflow-hidden border', currentTheme.bgCard]"
          >
            <table class="w-full">
              <thead>
                <tr :class="[currentTheme.buttonGradient]">
                  <th class="px-6 py-4 text-left font-bold text-white">
                    Categoria
                  </th>
                  <th class="px-6 py-4 text-left font-bold text-white">
                    Marca
                  </th>
                  <th class="px-6 py-4 text-left font-bold text-white">
                    Modelo
                  </th>
                  <th class="px-6 py-4 text-right font-bold text-white">
                    Preço
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="i in 4"
                  :key="i"
                  :class="[
                    'border-t',
                    i % 2 === 0 ? 'bg-opacity-50' : '',
                    currentTheme.bgCard,
                  ]"
                >
                  <td :class="['px-6 py-4', currentTheme.textPrimary]">
                    Freios
                  </td>
                  <td :class="['px-6 py-4', currentTheme.textPrimary]">
                    Shimano
                  </td>
                  <td :class="['px-6 py-4', currentTheme.textSecondary]">
                    MT200 Hidráulico
                  </td>
                  <td
                    :class="[
                      'px-6 py-4 text-right font-bold',
                      currentTheme.textPrimary,
                    ]"
                  >
                    R$ 450
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Sidebar Navigation Preview -->
        <section>
          <h3 :class="['text-2xl font-bold mb-6', currentTheme.textPrimary]">
            Navigation Sidebar
          </h3>
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="item in ['Quadro', 'Freios', 'Suspensão', 'Transmissão']"
              :key="item"
              :class="[
                'rounded-lg p-4 border text-center cursor-pointer transition-all',
                currentTheme.bgCard,
              ]"
            >
              <p :class="['font-bold', currentTheme.textPrimary]">{{ item }}</p>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <section
          class="mt-20 pt-12 border-t"
          :style="{ borderColor: currentTheme.textSecondary }"
        >
          <p :class="['text-center text-sm', currentTheme.textSecondary]">
            Esta galeria mostra como cada aesthetic direction se aplicaria ao
            site.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions between themes */
* {
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}

/* Remove transition from immediate elements */
button {
  transition: all 0.2s ease;
}

/* Scrollbar styling for Editorial theme */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: currentColor;
  border-radius: 4px;
}
</style>
