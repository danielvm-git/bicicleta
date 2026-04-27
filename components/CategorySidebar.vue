<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const categories = [
  { id: "Transmissão", icon: "i-heroicons-cog" },
  { id: "Kits Completos", icon: "i-heroicons-cube" },
  { id: "Freios", icon: "i-heroicons-stop" },
  { id: "Rodas", icon: "i-heroicons-arrow-path" },
  { id: "Cockpit", icon: "i-heroicons-minus" },
  { id: "Estrutura", icon: "i-heroicons-square-3-stack-3d" },
  { id: "Conforto", icon: "i-heroicons-sparkles" },
];

const selectCategory = (id: string) => {
  emit("update:modelValue", id);
};
</script>

<template>
  <aside class="w-full md:w-64 flex-shrink-0">
    <nav
      class="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 sticky top-24"
    >
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectCategory(cat.id)"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium whitespace-nowrap md:whitespace-normal text-left"
        :class="[
          modelValue === cat.id
            ? 'bg-primary text-white shadow-sm'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-800',
        ]"
      >
        <UIcon
          :name="cat.icon"
          class="w-5 h-5 flex-shrink-0"
          :class="modelValue === cat.id ? 'text-white' : 'text-primary/60'"
        />
        <span class="font-display">{{ cat.id }}</span>
      </button>
    </nav>
  </aside>
</template>

<style scoped>
.font-display {
  font-family: "Bricolage Grotesque", sans-serif;
}
</style>
