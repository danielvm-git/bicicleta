<script setup lang="ts">
const { data: brands, pending, error } = await useFetch("/api/brands");

useSeoMeta({
  title: "Ecosistema de Marcas | Monta Bike",
  description:
    "Explore a hierarquia técnica e as linhas de componentes das principais marcas do mercado de ciclismo.",
});
</script>

<template>
  <UContainer class="py-12">
    <div class="mb-12">
      <h1 class="text-5xl font-display text-primary mb-4">Marcas</h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
        Explore a hierarquia técnica e o posicionamento de mercado dos
        principais fabricantes de componentes.
      </p>
    </div>

    <div
      v-if="pending"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <USkeleton v-for="i in 6" :key="i" class="h-32 w-full rounded-2xl" />
    </div>

    <div
      v-else-if="error"
      class="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20"
    >
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="text-4xl text-red-500 mb-4"
      />
      <p class="text-red-600 dark:text-red-400">
        Não foi possível carregar o ecossistema de marcas.
      </p>
      <UButton color="red" variant="ghost" class="mt-4" @click="refresh"
        >Tentar novamente</UButton
      >
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <NuxtLink
        v-for="brand in brands"
        :key="brand"
        :to="`/brands/${brand}`"
        class="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300"
      >
        <div class="flex items-center justify-between mb-4">
          <div
            class="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors duration-300"
          >
            <UIcon
              name="i-heroicons-tag"
              class="text-2xl text-primary group-hover:text-white transition-colors duration-300"
            />
          </div>
          <UIcon
            name="i-heroicons-arrow-up-right"
            class="text-gray-300 group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>

        <h2
          class="text-3xl font-display text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300"
        >
          {{ brand }}
        </h2>
        <p class="text-sm text-gray-500 mt-2">
          Ver matriz de equivalência e mindmap técnico.
        </p>

        <div
          class="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-10 rounded-3xl pointer-events-none transition-opacity"
        />
      </NuxtLink>
    </div>

    <div
      class="mt-20 p-10 bg-[#fdfcfb] dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-inner"
    >
      <div class="flex flex-col md:flex-row items-center gap-10">
        <div class="flex-1">
          <h3 class="text-2xl font-display text-primary mb-4">
            Por que entender a hierarquia?
          </h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            Cada fabricante possui uma lógica própria de evolução tecnológica.
            Entender se um componente é <strong>Entry</strong>,
            <strong>Mid</strong> ou <strong>Pro</strong> ajuda você a equilibrar
            sua montagem, evitando gargalos de performance e otimizando seu
            investimento.
          </p>
        </div>
        <div class="flex gap-4">
          <div
            class="px-6 py-4 bg-white dark:bg-gray-900 rounded-2xl border border-primary/20 shadow-sm"
          >
            <span class="block text-primary font-bold text-2xl">3+</span>
            <span
              class="text-xs text-gray-400 uppercase tracking-widest font-display"
              >Tiers de Perf</span
            >
          </div>
          <div
            class="px-6 py-4 bg-white dark:bg-gray-900 rounded-2xl border border-primary/20 shadow-sm"
          >
            <span class="block text-primary font-bold text-2xl">6+</span>
            <span
              class="text-xs text-gray-400 uppercase tracking-widest font-display"
              >Áreas Técnicas</span
            >
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
.font-display {
  font-family: "Bricolage Grotesque", sans-serif;
}
</style>
