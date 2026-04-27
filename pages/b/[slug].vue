<script setup lang="ts">
import { computed } from "vue";

const route = useRoute();
const slug = route.params.slug as string;

const { data: bike, error, refresh } = await useFetch(`/api/bikes/${slug}`);

const formatCurrency = (value: number | string) => {
  const val = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
};

const totalWeight = computed(() => {
  if (!bike.value) return 0;
  return bike.value.bikeComponents.reduce((total: number, bc: any) => {
    const weight =
      typeof bc.component.weight === "string"
        ? parseFloat(bc.component.weight)
        : bc.component.weight;
    return total + (isNaN(weight || 0) ? 0 : weight || 0);
  }, 0);
});

const componentsByCategory = computed(() => {
  if (!bike.value) return {};
  const grouped: Record<string, any[]> = {};
  bike.value.bikeComponents.forEach((bc: any) => {
    if (!grouped[bc.component.category]) {
      grouped[bc.component.category] = [];
    }
    grouped[bc.component.category].push(bc);
  });
  return grouped;
});

const averageComponentPrice = computed(() => {
  if (!bike.value || bike.value.bikeComponents.length === 0) return 0;
  const total = bike.value.bikeComponents.reduce((sum: number, bc: any) => {
    const price =
      typeof bc.component.price === "string"
        ? parseFloat(bc.component.price)
        : bc.component.price;
    return sum + (isNaN(price) ? 0 : price);
  }, 0);
  return total / bike.value.bikeComponents.length;
});

useSeoMeta({
  title: () =>
    bike.value ? `${bike.value.name} | Monta Bike` : "Montagem de Bicicleta",
  ogTitle: () => (bike.value ? bike.value.name : "Montagem de Bicicleta"),
  description: () =>
    bike.value
      ? `Confira esta montagem de MTB no Monta Bike: ${bike.value.description || ""}. Preço estimado: ${formatCurrency(bike.value.totalPrice)}`
      : "Simulador de montagem de bicicletas MTB.",
  ogDescription: () =>
    bike.value
      ? `Confira esta montagem de MTB no Monta Bike: ${bike.value.description || ""}. Preço estimado: ${formatCurrency(bike.value.totalPrice)}`
      : "Simulador de montagem de bicicletas MTB.",
  ogSiteName: "Monta Bike",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <!-- Error State -->
  <div
    v-if="error"
    class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6"
  >
    <div class="text-center max-w-md">
      <div
        class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 mb-6"
      >
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="text-4xl text-red-500"
        />
      </div>
      <h1 class="text-3xl font-bold text-white mb-3">Bike não encontrada</h1>
      <p class="text-slate-400 mb-8">
        O link pode estar quebrado ou a bike foi removida do catálogo.
      </p>
      <div class="flex gap-3 justify-center">
        <UButton to="/" variant="ghost" class="border border-slate-700"
          >Início</UButton
        >
        <UButton
          to="/builder"
          class="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
        >
          Criar Bike
        </UButton>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div
    v-else-if="!bike"
    class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center"
  >
    <div class="space-y-6 w-full max-w-2xl px-6">
      <USkeleton class="h-64 w-full rounded-xl" />
      <USkeleton class="h-12 w-1/2 rounded-lg" />
      <div class="grid grid-cols-2 gap-4">
        <USkeleton class="h-32 w-full rounded-lg" />
        <USkeleton class="h-32 w-full rounded-lg" />
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div
    v-else
    class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
  >
    <!-- Hero Section -->
    <div class="relative overflow-hidden border-b border-slate-800">
      <!-- Decorative gradient background -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none"
      />

      <UContainer class="relative py-16 md:py-24">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <!-- Left: Title & Description -->
          <div class="space-y-8">
            <div>
              <div
                class="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20"
              >
                <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span class="text-xs font-semibold text-cyan-400 uppercase"
                  >Montagem Customizada</span
                >
              </div>
              <h1
                class="text-5xl md:text-6xl font-black leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300"
              >
                {{ bike.name }}
              </h1>
              <p class="text-lg text-slate-400 leading-relaxed max-w-xl">
                {{ bike.description }}
              </p>
            </div>

            <!-- Key Stats -->
            <div class="grid grid-cols-2 gap-4">
              <div
                class="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors group"
              >
                <p class="text-xs text-slate-500 uppercase font-bold mb-1">
                  Componentes
                </p>
                <p
                  class="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors"
                >
                  {{ bike.bikeComponents.length }}
                </p>
              </div>
              <div
                class="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 transition-colors group"
              >
                <p class="text-xs text-slate-500 uppercase font-bold mb-1">
                  Peso Total
                </p>
                <p
                  class="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors"
                >
                  {{ totalWeight.toFixed(2) }} <span class="text-lg">kg</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Right: Price Card -->
          <div class="h-full flex items-start justify-end">
            <div class="w-full max-w-sm">
              <div class="relative group">
                <!-- Background gradient -->
                <div
                  class="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"
                />

                <!-- Card -->
                <div
                  class="relative bg-slate-900 rounded-2xl border border-slate-700 p-8 space-y-6"
                >
                  <div>
                    <p
                      class="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2"
                    >
                      Preço Estimado
                    </p>
                    <p
                      class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"
                    >
                      {{ formatCurrency(bike.totalPrice) }}
                    </p>
                  </div>

                  <div class="pt-4 border-t border-slate-700 space-y-3">
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-slate-400">Preço Médio/Componente</span>
                      <span class="font-semibold text-slate-300">{{
                        formatCurrency(averageComponentPrice)
                      }}</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-slate-400">Total de Componentes</span>
                      <span class="font-semibold text-slate-300">{{
                        bike.bikeComponents.length
                      }}</span>
                    </div>
                  </div>

                  <div class="flex gap-3 pt-4">
                    <UButton
                      icon="i-heroicons-wrench-screwdriver"
                      to="/builder"
                      class="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0"
                    >
                      Personalizar
                    </UButton>
                    <UButton
                      icon="i-heroicons-arrow-down-tray"
                      @click="window.print()"
                      variant="outline"
                      class="border-slate-700 hover:bg-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Components Section -->
    <div class="py-20 md:py-32">
      <UContainer>
        <!-- Section Header -->
        <div class="mb-16">
          <div class="flex items-baseline gap-4 mb-4">
            <h2 class="text-4xl md:text-5xl font-black text-white">
              Componentes
            </h2>
            <span class="text-lg text-slate-500 font-semibold"
              >{{ bike.bikeComponents.length }} peças</span
            >
          </div>
          <p class="text-slate-400 text-lg max-w-2xl">
            Cada componente foi selecionado para oferecer o melhor desempenho e
            durabilidade na sua categoria.
          </p>
        </div>

        <!-- Components Grid -->
        <div class="space-y-8">
          <div
            v-for="(components, category) in componentsByCategory"
            :key="category"
            class="space-y-4"
          >
            <!-- Category Header -->
            <div class="flex items-center gap-3 mb-6">
              <div
                class="h-1 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              />
              <h3 class="text-xl font-bold text-white uppercase tracking-wide">
                {{ category }}
              </h3>
              <span class="text-sm text-slate-500 font-semibold"
                >({{ components.length }})</span
              >
            </div>

            <!-- Components -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="bc in components" :key="bc.id" class="group relative">
                <!-- Card -->
                <div
                  class="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 p-5 hover:border-cyan-500/50 transition-all duration-300 h-full flex flex-col"
                >
                  <!-- Badge -->
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <p
                        class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2"
                      >
                        {{ bc.component.brand || "Genérico" }}
                      </p>
                      <p class="text-sm font-bold text-white leading-snug">
                        {{ bc.component.model }}
                      </p>
                    </div>
                    <div v-if="bc.component.speeds" class="ml-2">
                      <span
                        class="inline-flex items-center px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-400"
                      >
                        {{ bc.component.speeds }}
                      </span>
                    </div>
                  </div>

                  <!-- Specs -->
                  <div class="space-y-2 mb-4 flex-1 text-xs text-slate-400">
                    <div
                      v-if="bc.component.axleType"
                      class="flex items-center gap-2"
                    >
                      <span class="w-1 h-1 rounded-full bg-slate-600" />
                      {{ bc.component.axleType }}
                    </div>
                    <div
                      v-if="bc.component.weight"
                      class="flex items-center gap-2"
                    >
                      <span class="w-1 h-1 rounded-full bg-slate-600" />
                      {{ bc.component.weight }} kg
                    </div>
                    <div
                      v-if="bc.component.suspensionTravel"
                      class="flex items-center gap-2"
                    >
                      <span class="w-1 h-1 rounded-full bg-slate-600" />
                      {{ bc.component.suspensionTravel }}
                    </div>
                    <div
                      v-if="bc.component.performanceLevel"
                      class="flex items-center gap-2 pt-2 border-t border-slate-700"
                    >
                      <span
                        class="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      />
                      <span class="text-slate-300 font-semibold">{{
                        bc.component.performanceLevel
                      }}</span>
                    </div>
                  </div>

                  <!-- Price -->
                  <div
                    class="pt-4 border-t border-slate-700 flex items-center justify-between"
                  >
                    <span class="text-xs text-slate-500 uppercase font-bold"
                      >Valor</span
                    >
                    <span
                      class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"
                    >
                      {{ formatCurrency(bc.component.price) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- CTA Section -->
    <div class="relative py-20 md:py-32 border-t border-slate-800">
      <div
        class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none"
      />

      <UContainer class="relative">
        <div class="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <h3 class="text-4xl md:text-5xl font-black text-white mb-4">
              Gostou desta Montagem?
            </h3>
            <p class="text-lg text-slate-400">
              Customize cada detalhe da sua bike perfeita ou imprima esta
              configuração para consultar depois.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center no-print">
            <UButton
              to="/builder"
              icon="i-heroicons-wrench-screwdriver"
              size="lg"
              class="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 text-white font-bold"
            >
              Criar Minha Bike
            </UButton>
            <UButton
              @click="window.print()"
              icon="i-heroicons-printer"
              size="lg"
              variant="outline"
              class="border border-slate-700 hover:bg-slate-800 text-white font-bold"
            >
              Imprimir Configuração
            </UButton>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Footer Info -->
    <div
      class="py-8 border-t border-slate-800 text-center text-xs text-slate-500"
    >
      <p>
        Preços sujeitos a variação. Atualizado em
        {{ new Date().toLocaleDateString("pt-BR") }}
      </p>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }

  body {
    background: white;
  }

  /* Make content printable with good contrast */
  :deep(*) {
    background: white !important;
    color: black !important;
    border-color: #e5e7eb !important;
  }
}

/* Smooth animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep([data-v-*]) {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>
