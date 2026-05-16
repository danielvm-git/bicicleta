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
    class="flex flex-col items-center justify-center py-16 px-4 brutalist-card bg-gray-50"
  >
    <div class="h-24 w-24 bg-black flex items-center justify-center mb-8">
      <UIcon :name="props.icon" class="w-12 h-12 text-white" />
    </div>

    <h3
      class="text-3xl font-display font-black text-black mb-4 uppercase text-center"
    >
      {{ props.title }}
    </h3>

    <p
      v-if="props.description"
      class="font-body text-lg text-black/70 text-center max-w-md mb-8"
    >
      {{ props.description }}
    </p>

    <UButton
      v-if="props.actionLabel && props.actionHref"
      :to="props.actionHref"
      :icon="props.actionIcon"
      class="brutalist-button text-lg px-8 py-4"
    >
      {{ props.actionLabel }}
    </UButton>
  </div>
</template>

<style scoped>
/* EmptyState styling is handled by Tailwind utilities */
</style>
