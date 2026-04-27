<script setup lang="ts">
import { computed } from "vue";
import type { UnifiedBike } from "~/types/bike";
import { useBikeStats } from "~/composables/useBikeStats";

interface Props {
  bike: UnifiedBike;
}

const props = defineProps<Props>();
const bikeRef = computed(() => props.bike);

const { totalWeight, componentsByCategory, averageComponentPrice } =
  useBikeStats(bikeRef);

const formatCurrency = (value: number | string) => {
  const val = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
};

const handlePrint = () => {
  if (process.client) {
    window.print();
  }
};
</script>

<template>
  <div class="bike-detail-view min-h-screen bg-slate-950 text-white">
    <!-- Hero Section: Premium Editorial Asymmetric Layout -->
    <div class="relative overflow-hidden border-b border-slate-800">
      <div
        class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none"
      />

      <UContainer class="relative py-16 md:py-24">
        <!-- Asymmetric Grid: 7fr / 5fr -->
        <div class="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-12 items-start">
          <!-- Left: Narrative & Core Identity (7fr) -->
          <div class="space-y-8">
            <div>
              <div
                class="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20"
              >
                <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span
                  class="text-xs font-semibold text-cyan-400 uppercase tracking-widest"
                  >Montagem Premium</span
                >
              </div>
              <h1
                class="text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400"
              >
                {{ bike.name }}
              </h1>
              <p
                class="text-xl text-slate-400 leading-relaxed max-w-2xl font-medium"
              >
                {{ bike.description }}
              </p>
            </div>

            <div
              v-if="bike.imageUrl"
              class="relative group mt-12 mb-16 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50"
            >
              <img
                :src="bike.imageUrl"
                :alt="bike.name"
                class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-1000"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none"
              />
            </div>

            <!-- Performance Snapshots -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl">
              <div
                class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-all duration-500 group"
              >
                <p
                  class="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2"
                >
                  Peso Total
                </p>
                <p
                  class="text-4xl font-black text-white group-hover:text-cyan-400 transition-colors"
                >
                  {{ totalWeight.toFixed(2)
                  }}<span class="text-xl ml-1 font-bold text-slate-500"
                    >kg</span
                  >
                </p>
              </div>
              <div
                class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all duration-500 group"
              >
                <p
                  class="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2"
                >
                  Componentes
                </p>
                <p
                  class="text-4xl font-black text-white group-hover:text-blue-400 transition-colors"
                >
                  {{ bike.bikeComponents.length }}
                </p>
              </div>
              <div
                class="hidden md:block p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 transition-all duration-500 group"
              >
                <p
                  class="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-2"
                >
                  Categoria
                </p>
                <p
                  class="text-2xl font-black text-white group-hover:text-purple-400 transition-colors uppercase"
                >
                  MTB High-End
                </p>
              </div>
            </div>
          </div>

          <!-- Right: Commercial & Utility (5fr) -->
          <div class="h-full flex items-start lg:justify-end">
            <div class="w-full max-w-md">
              <div class="relative group">
                <!-- Aura Glow -->
                <div
                  class="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-1000"
                />

                <!-- Investment Card -->
                <div
                  class="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-10 space-y-8"
                >
                  <div>
                    <p
                      class="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-3"
                    >
                      Investimento Estimado
                    </p>
                    <p class="text-5xl font-black text-white">
                      {{ formatCurrency(bike.totalPrice) }}
                    </p>
                  </div>

                  <div class="pt-6 border-t border-slate-800 space-y-4">
                    <div
                      class="flex justify-between items-center text-xs tracking-wide"
                    >
                      <span class="text-slate-500 font-bold uppercase"
                        >Média por Peça</span
                      >
                      <span class="font-black text-slate-300">{{
                        formatCurrency(averageComponentPrice)
                      }}</span>
                    </div>
                    <div
                      class="flex justify-between items-center text-xs tracking-wide"
                    >
                      <span class="text-slate-500 font-bold uppercase"
                        >Status</span
                      >
                      <span
                        class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 font-black"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500" />
                        COMPATÍVEL
                      </span>
                    </div>
                  </div>

                  <div class="flex flex-col gap-3 pt-4 no-print">
                    <UButton
                      icon="i-heroicons-wrench-screwdriver"
                      to="/builder"
                      size="xl"
                      class="bg-white text-black hover:bg-slate-200 border-0 font-black uppercase tracking-widest text-xs py-4"
                      block
                    >
                      Personalizar Montagem
                    </UButton>
                    <UButton
                      icon="i-heroicons-printer"
                      @click="handlePrint"
                      variant="ghost"
                      size="xl"
                      class="text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800/50 font-black uppercase tracking-widest text-xs py-4"
                      block
                    >
                      Imprimir Ficha Técnica
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Inventory: Detailed Specs Grid -->
    <div class="py-24 bg-white text-slate-950">
      <UContainer>
        <div class="mb-20">
          <h2 class="text-6xl font-black tracking-tighter mb-4 uppercase">
            Spec Sheet
          </h2>
          <div class="h-2 w-32 bg-slate-950 mb-6" />
          <p
            class="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed"
          >
            Uma análise detalhada de cada componente selecionado para esta
            configuração de elite.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-20">
          <div
            v-for="(components, category) in componentsByCategory"
            :key="category"
            class="group"
          >
            <!-- Category Header -->
            <div
              class="flex items-end gap-4 border-b-4 border-slate-100 pb-4 mb-8"
            >
              <h3 class="text-3xl font-black uppercase tracking-tighter">
                {{ category }}
              </h3>
              <span class="text-slate-300 font-black text-xl mb-0.5"
                >/ {{ components.length }} items</span
              >
            </div>

            <!-- Component Rows (Clean List for Specs) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div
                v-for="bc in components"
                :key="bc.id"
                class="flex flex-col py-2"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p
                      class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"
                    >
                      {{ bc.component.brand || "Custom" }}
                    </p>
                    <p class="text-xl font-black leading-tight text-slate-900">
                      {{ bc.component.model }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-black text-slate-900">
                      {{ formatCurrency(bc.component.price) }}
                    </p>
                  </div>
                </div>

                <div
                  class="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  <span
                    v-if="bc.component.weight"
                    class="flex items-center gap-1"
                  >
                    <UIcon name="i-heroicons-scale" class="text-xs" />
                    {{ bc.component.weight }}kg
                  </span>
                  <span
                    v-if="bc.component.speeds"
                    class="flex items-center gap-1"
                  >
                    <UIcon name="i-heroicons-cog" class="text-xs" />
                    {{ bc.component.speeds }}v
                  </span>
                  <span
                    v-if="bc.component.performanceLevel"
                    class="flex items-center gap-1 text-slate-900"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    {{ bc.component.performanceLevel }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Print Footer -->
    <div
      class="hidden print:block py-12 border-t border-slate-200 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]"
    >
      Gerado em monta-bike.com.br — {{ new Date().toLocaleDateString("pt-BR") }}
    </div>
  </div>
</template>

<style scoped>
.bike-detail-view {
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

@media print {
  .no-print {
    display: none !important;
  }

  .bike-detail-view {
    background: white !important;
    color: black !important;
  }

  .bike-detail-view :deep(*) {
    background: transparent !important;
    color: black !important;
    border-color: #eee !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  h1 {
    background: none !important;
    -webkit-text-fill-color: black !important;
    color: black !important;
  }

  .bg-slate-950,
  .bg-slate-900\/80,
  .bg-slate-900\/50 {
    background: white !important;
    border: 1px solid #eee !important;
  }

  .text-white,
  .text-slate-100,
  .text-slate-300,
  .text-slate-400,
  .text-slate-500 {
    color: black !important;
  }

  .border-slate-800,
  .border-slate-700,
  .border-slate-100 {
    border-color: #eee !important;
  }
}
</style>
