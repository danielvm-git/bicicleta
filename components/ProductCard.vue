<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  component: any;
  isSelected?: boolean;
}>();

const emit = defineEmits<{
  (e: "add", component: any): void;
}>();

const onAdd = () => {
  emit("add", props.component);
};

const imageError = ref(false);
const handleImageError = () => {
  imageError.value = true;
};
</script>

<template>
  <div
    class="flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
  >
    <!-- Image -->
    <div
      class="h-48 bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative overflow-hidden"
    >
      <img
        v-if="component.imageUrl && !imageError"
        :src="component.imageUrl"
        :alt="component.model"
        width="300"
        height="192"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        @error="handleImageError"
      />
      <UIcon
        v-else
        name="i-heroicons-photo"
        class="w-12 h-12 text-gray-300 dark:text-gray-700"
      />
      <div
        class="absolute top-2 right-2 px-2 py-1 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
      >
        {{ component.brand }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-grow">
      <div
        class="text-xs font-semibold text-primary/80 mb-1 uppercase tracking-wide"
      >
        {{ component.type || component.functionalGroup }}
      </div>
      <h4
        class="font-display font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2"
      >
        {{ component.model }}
      </h4>

      <div class="mt-auto pt-4 flex items-center justify-between">
        <!-- Price placeholder -->
        <span class="text-sm font-medium text-gray-500"> Sob consulta </span>

        <UButton
          :color="isSelected ? 'green' : 'primary'"
          :variant="isSelected ? 'soft' : 'solid'"
          :icon="isSelected ? 'i-heroicons-check' : 'i-heroicons-plus'"
          :aria-label="`${isSelected ? 'Remover' : 'Adicionar'} ${component.brand} ${component.model} ao projeto`"
          size="sm"
          class="rounded-lg shadow-sm group-hover:shadow"
          @click="onAdd"
        >
          {{ isSelected ? "No Builder" : "Build" }}
        </UButton>
      </div>
    </div>
  </div>
</template>
