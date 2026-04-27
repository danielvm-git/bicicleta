<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useBuilderStore } from "~/stores/builder";

useSeoMeta({
  title: "Performance Guide | Monta Bike",
  description: "Guia de performance para montagem da sua bicicleta.",
});

// State
const selectedTier = ref("Entry");
const selectedCategory = ref("Transmissão");

// Fetch Data
const {
  data: components,
  pending: componentsPending,
  execute: fetchComponents,
} = useFetch("/api/components", {
  query: {
    functionalGroup: selectedCategory,
    performanceLevel: selectedTier,
  },
  watch: false,
});

const {
  data: groups,
  pending: groupsPending,
  execute: fetchGroups,
} = useFetch("/api/groups", {
  watch: false,
});

watch(
  [selectedTier, selectedCategory],
  () => {
    if (selectedCategory.value === "Kits Completos") {
      fetchGroups();
    } else {
      fetchComponents();
    }
  },
  { immediate: true }
);

const builder = useBuilderStore();

const selectedComponentIds = computed(() => {
  return Object.values(builder.components).map((c) => c.id);
});

const addToBuild = (component: any) => {
  builder.selectComponent(component);
  const toast = useToast();
  toast.add({
    title: "Componente Adicionado",
    description: `${component.brand} ${component.model} adicionado ao projeto.`,
    color: "primary",
  });
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
    <div class="mb-8">
      <h1
        class="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tight mb-2"
      >
        Performance Guide
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
        Selecione o nível de performance desejado e explore os componentes
        recomendados para cada sistema da sua bicicleta.
      </p>
    </div>

    <!-- Tier Selector (Master Filter) -->
    <TierSelector v-model="selectedTier" />

    <div class="flex flex-col md:flex-row gap-8">
      <!-- Sidebar Navigation -->
      <CategorySidebar v-model="selectedCategory" />

      <!-- Main Content / Product Grid -->
      <main class="flex-grow">
        <div class="mb-6 flex items-center justify-between">
          <h2
            class="text-2xl font-display font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2"
          >
            <span class="w-2 h-6 bg-primary rounded-full"></span>
            {{ selectedCategory }}
            <span class="text-sm font-medium text-gray-400 font-sans ml-2">
              (Nível: {{ selectedTier }})
            </span>
          </h2>

          <div class="text-sm text-gray-500">
            {{
              selectedCategory === "Kits Completos"
                ? groups?.length || 0
                : components?.length || 0
            }}
            {{
              selectedCategory === "Kits Completos" ? "grupos" : "componentes"
            }}
          </div>
        </div>

        <template v-if="selectedCategory === 'Kits Completos'">
          <GroupGrid :groups="groups || []" :loading="groupsPending" />
        </template>
        <template v-else>
          <ProductGrid
            :components="components || []"
            :loading="componentsPending"
            :selected-ids="selectedComponentIds"
            @add="addToBuild"
          />
        </template>
      </main>
    </div>

    <!-- Persistent MiniBuilder -->
    <MiniBuilder />
  </div>
</template>

<style scoped>
/* .font-display is inherited from global brand.css */
</style>
