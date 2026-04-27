<script setup lang="ts">
const props = defineProps<{
  components: any[];
  loading?: boolean;
  selectedIds?: number[];
}>();

const isSelected = (id: number) => {
  return props.selectedIds?.includes(id) || false;
};

const emit = defineEmits<{
  (e: "add", component: any): void;
}>();
</script>

<template>
  <div class="w-full">
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl border border-gray-200 dark:border-gray-700"
      ></div>
    </div>

    <div
      v-else-if="!components || components.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl"
    >
      <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-300 mb-4" />
      <h3
        class="font-display text-lg font-bold text-gray-700 dark:text-gray-300"
      >
        Nenhuma peça encontrada
      </h3>
      <p class="text-gray-500 max-w-sm mt-2">
        Não encontramos componentes para este nível de performance nesta
        categoria.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCard
        v-for="comp in components"
        :key="comp.id"
        :component="comp"
        :is-selected="isSelected(comp.id)"
        @add="$emit('add', comp)"
      />
    </div>
  </div>
</template>

<style scoped>
.font-display {
  font-family: "Bricolage Grotesque", sans-serif;
}
</style>
