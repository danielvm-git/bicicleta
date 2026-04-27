<script setup lang="ts">
const route = useRoute();
const brandName = route.params.name as string;

const {
  data: brandData,
  pending,
  error,
} = await useFetch(`/api/brands/${brandName}/matrix`);

const areas = [
  "Transmissão",
  "Freios",
  "Rodas",
  "Cockpit",
  "Estrutura",
  "Conforto",
];
const levels = ["Pro", "Mid", "Entry"];

const viewMode = ref<"matrix" | "mindmap">("matrix");

const formatCurrency = (value: number | string) => {
  const val = typeof value === "string" ? parseFloat(value) : value;
  if (!val || val === 0) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
};

useSeoMeta({
  title: `Tabela de Equivalência: ${brandName} | Monta Bike`,
  description: `Veja a hierarquia técnica de componentes da marca ${brandName} dividida por níveis de performance.`,
});
</script>

<template>
  <UContainer class="py-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-display text-primary">{{ brandName }}</h1>
        <p class="text-gray-500 mt-1">
          Tabela de Equivalência e Hierarquia Técnica
        </p>
      </div>
      <div class="flex items-center gap-4">
        <UButtonGroup size="sm" orientation="horizontal">
          <UButton
            :variant="viewMode === 'matrix' ? 'solid' : 'ghost'"
            color="primary"
            icon="i-heroicons-table-cells"
            @click="viewMode = 'matrix'"
          >
            Matriz
          </UButton>
          <UButton
            :variant="viewMode === 'mindmap' ? 'solid' : 'ghost'"
            color="primary"
            icon="i-heroicons-share"
            @click="viewMode = 'mindmap'"
          >
            Mindmap
          </UButton>
        </UButtonGroup>
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="gray"
          @click="navigateTo('/components')"
        >
          Voltar para Peças
        </UButton>
      </div>
    </div>

    <div v-if="pending" class="flex flex-col items-center justify-center py-20">
      <UIcon
        name="i-heroicons-arrow-path"
        class="animate-spin text-4xl text-primary mb-4"
      />
      <p class="text-gray-500">Construindo matriz...</p>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-500">Erro ao carregar os dados da marca.</p>
    </div>

    <div v-else>
      <div v-if="viewMode === 'matrix'" class="overflow-x-auto pb-4">
        <div class="min-w-[900px]">
          <!-- Matrix Grid -->
          <div
            class="grid grid-cols-4 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <!-- Header -->
            <div
              class="bg-gray-50 dark:bg-gray-800 p-4 font-bold text-gray-400 uppercase text-xs"
            >
              Área Funcional
            </div>
            <div
              v-for="level in levels"
              :key="level"
              class="bg-gray-50 dark:bg-gray-800 p-4 text-center"
            >
              <span
                class="font-display text-lg"
                :class="{
                  'text-primary': level === 'Pro',
                  'text-orange-500': level === 'Mid',
                  'text-gray-500': level === 'Entry',
                }"
                >{{ level }}</span
              >
              <p
                class="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5"
              >
                Performance
              </p>
            </div>

            <!-- Rows -->
            <template v-for="area in areas" :key="area">
              <!-- Area Label (Y-Axis) -->
              <div
                class="bg-white dark:bg-gray-900 p-6 flex items-center border-r border-gray-100 dark:border-gray-800"
              >
                <span
                  class="font-display text-xl text-gray-700 dark:text-gray-200"
                  >{{ area }}</span
                >
              </div>

              <!-- Performance Cells (X-Axis) -->
              <div
                v-for="level in levels"
                :key="area + level"
                class="bg-white dark:bg-gray-900 p-4 min-h-[120px]"
              >
                <div
                  v-if="brandData?.matrix[area][level]?.length > 0"
                  class="flex flex-col gap-3"
                >
                  <div
                    v-for="comp in brandData.matrix[area][level]"
                    :key="comp.id"
                    class="group"
                  >
                    <p
                      class="text-sm font-bold leading-tight group-hover:text-primary transition-colors"
                    >
                      {{ comp.model }}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <UBadge
                        size="xs"
                        color="gray"
                        variant="soft"
                        class="text-[9px] px-1"
                        >{{ comp.category }}</UBadge
                      >
                      <span class="text-[10px] text-gray-400 font-mono">{{
                        formatCurrency(comp.price)
                      }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="h-full flex items-center justify-center">
                  <span class="text-gray-300 dark:text-gray-700 text-xs italic"
                    >N/A</span
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div v-else>
        <ClientOnly>
          <BrandMindmap :brand-name="brandName" :matrix="brandData.matrix" />
          <template #fallback>
            <div
              class="h-[600px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700"
            >
              <p class="text-gray-500">Iniciando engine de grafo...</p>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <div class="mt-12 bg-primary/5 rounded-xl p-8 border border-primary/10">
      <h3 class="font-display text-xl text-primary mb-2">
        Sobre a Classificação
      </h3>
      <p
        class="text-sm text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed"
      >
        Os níveis de performance (Pro, Mid, Entry) são atribuídos com base na
        hierarquia oficial das fabricantes e no posicionamento de mercado de
        cada linha. Esta tabela ajuda a entender como os componentes evoluem
        tecnicamente dentro da marca <strong>{{ brandName }}</strong
        >.
      </p>
    </div>
  </UContainer>
</template>

<style scoped>
/* .font-display is inherited from global brand.css */
</style>
