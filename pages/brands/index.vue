<script setup lang="ts">
interface Brand {
  id: string;
  name: string;
}

const {
  data: brands,
  pending,
  error,
  refresh,
} = await useFetch<Brand[]>("/api/brands");

useSeoMeta({
  title: "Brand Directory | BICICLETA",
  description:
    "Explore the technical hierarchy and component lines of the cycling industry's leading brands.",
});
</script>

<template>
  <UContainer class="py-12">
    <div class="mb-12">
      <h1 class="text-6xl mb-4">BRANDS</h1>
      <p class="font-body text-xl max-w-2xl">
        Explore the technical hierarchy and market positioning of lead
        manufacturers. Understand the tiers that define performance.
      </p>
    </div>

    <div
      v-if="pending"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="h-48 bg-gray-100 border-4 border-black animate-pulse"
      ></div>
    </div>

    <div v-else-if="error" class="p-12 border-4 border-primary text-center">
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="text-4xl text-primary mb-4"
      />
      <p class="text-xl font-display font-bold uppercase">
        Failed to load brand ecosystem.
      </p>
      <UButton
        color="black"
        variant="solid"
        class="mt-8 brutalist-button"
        @click="refresh"
        >RETRY</UButton
      >
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <NuxtLink
        v-for="brand in brands"
        :key="brand.id"
        :to="`/brands/${brand.name}`"
        class="brutalist-card p-8 group"
      >
        <div class="flex items-center justify-between mb-6">
          <div
            class="h-20 w-20 bg-white flex items-center justify-center transition-all group-hover:border-primary border-4 border-black p-2"
          >
            <img
              :src="`/brands/${brand.name.toLowerCase()}.jpg`"
              :alt="brand.name"
              class="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
            />
          </div>
          <UIcon
            name="i-heroicons-arrow-up-right"
            class="text-4xl transition-transform group-hover:translate-x-2 group-hover:-translate-y-2"
          />
        </div>

        <h2 class="text-4xl mb-2 group-hover:text-primary transition-colors">
          {{ brand.name }}
        </h2>
        <p class="text-sm font-body opacity-60">
          View equivalence matrix and technical mindmap.
        </p>
      </NuxtLink>
    </div>

    <div class="mt-20 p-12 border-4 border-black bg-gray-50">
      <div class="flex flex-col md:flex-row items-start gap-12">
        <div class="flex-1">
          <h3 class="text-4xl mb-6">WHY HIERARCHY?</h3>
          <p class="font-body text-lg leading-relaxed">
            Every manufacturer has its own logic for technological evolution.
            Understanding whether a component is <strong>Entry</strong>,
            <strong>Mid</strong>, or <strong>Pro</strong> helps you balance your
            build, avoiding performance bottlenecks and optimizing your
            investment.
          </p>
        </div>
        <div class="flex gap-8">
          <div
            class="p-8 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <span class="block text-primary font-black text-4xl">3+</span>
            <span
              class="text-xs font-display font-black uppercase tracking-widest"
              >Perf Tiers</span
            >
          </div>
          <div
            class="p-8 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <span class="block text-primary font-black text-4xl">6+</span>
            <span
              class="text-xs font-display font-black uppercase tracking-widest"
              >Tech Areas</span
            >
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>
