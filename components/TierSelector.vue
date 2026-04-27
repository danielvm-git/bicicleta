<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const tiers = [
  {
    id: "Entry",
    label: "Iniciante",
    description: "Custo-benefício e durabilidade",
  },
  { id: "Mid", label: "Entusiasta", description: "Performance e precisão" },
  { id: "Pro", label: "Competição", description: "Alta performance e leveza" },
];

const selectTier = (id: string) => {
  emit("update:modelValue", id);
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <button
      v-for="tier in tiers"
      :key="tier.id"
      @click="selectTier(tier.id)"
      class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 text-center"
      :class="[
        modelValue === tier.id
          ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20 scale-[1.02]'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 hover:bg-primary/5',
      ]"
    >
      <h3
        class="font-display text-xl font-bold mb-2"
        :class="
          modelValue === tier.id
            ? 'text-primary'
            : 'text-gray-800 dark:text-gray-100'
        "
      >
        {{ tier.label }}
      </h3>
      <p
        class="text-sm"
        :class="
          modelValue === tier.id
            ? 'text-primary/80 font-medium'
            : 'text-gray-500 dark:text-gray-400'
        "
      >
        {{ tier.description }}
      </p>
    </button>
  </div>
</template>

<style scoped>
.font-display {
  font-family: "Bricolage Grotesque", sans-serif;
}
</style>
