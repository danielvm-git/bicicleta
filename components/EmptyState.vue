<script setup lang="ts">
interface Props {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: "i-heroicons-inbox",
  actionIcon: "i-heroicons-arrow-right",
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800/50"
  >
    <UIcon
      :name="props.icon"
      class="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4"
    />

    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {{ props.title }}
    </h3>

    <p
      v-if="props.description"
      class="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6"
    >
      {{ props.description }}
    </p>

    <UButton
      v-if="props.actionLabel && props.actionHref"
      :to="props.actionHref"
      :icon="props.actionIcon"
      color="primary"
      variant="soft"
    >
      {{ props.actionLabel }}
    </UButton>
  </div>
</template>

<style scoped>
/* EmptyState styling is handled by Tailwind utilities */
</style>
