<script setup lang="ts">
const { data: components, pending } = useFetch("/api/components");

const categories = ["Quadro", "Suspensão", "Grupo", "Rodas", "Pneus", "Freios"];

const selectedCategory = ref("Todos");

const filteredComponents = computed(() => {
  if (!components.value) return [];
  if (selectedCategory.value === "Todos") return components.value;
  return components.value.filter((c) => c.category === selectedCategory.value);
});

const formatPrice = (price: string) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(parseFloat(price));
};
</script>

<template>
  <UContainer class="py-12">
    <div class="mb-12">
      <h1 class="text-6xl mb-4">MARKET PRICING</h1>
      <p class="font-body text-xl max-w-2xl">
        Real-time market data for high-end cycling components. Track prices,
        compare models, and build your budget with precision.
      </p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2 mb-8 p-4 bg-black border-4 border-black">
      <button
        v-for="cat in ['Todos', ...categories]"
        :key="cat"
        class="px-4 py-2 font-display font-bold uppercase transition-colors"
        :class="
          selectedCategory === cat
            ? 'bg-primary text-white'
            : 'bg-white text-black hover:bg-gray-200'
        "
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Pricing Grid -->
    <div
      v-if="pending"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="h-64 bg-gray-100 animate-pulse border-4 border-black"
      ></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="component in filteredComponents"
        :key="component.id"
        class="brutalist-card flex flex-col"
      >
        <div class="p-6 border-b-4 border-black flex-grow">
          <div class="flex justify-between items-start mb-4">
            <span
              class="bg-black text-white px-2 py-1 text-xs font-display font-black uppercase"
            >
              {{ component.category }}
            </span>
            <span class="text-xs font-mono opacity-60"
              >ID: {{ component.id }}</span
            >
          </div>
          <h3 class="text-2xl mb-2">{{ component.brand }}</h3>
          <p class="text-xl font-display font-bold mb-4">
            {{ component.model }}
          </p>
          <p
            v-if="component.performanceLevel"
            class="text-sm font-body opacity-70"
          >
            Level: {{ component.performanceLevel }}
          </p>
        </div>

        <div class="p-6 bg-gray-50 flex items-center justify-between">
          <div>
            <p class="text-xs font-display font-black uppercase opacity-50">
              Market Price
            </p>
            <p class="text-3xl font-display font-black text-primary">
              {{ formatPrice(component.price) }}
            </p>
          </div>
          <NuxtLink
            :to="`/components?search=${component.model}`"
            class="brutalist-button px-4 py-2 text-sm"
          >
            VIEW SPECS
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!pending && filteredComponents.length === 0"
      class="py-24 text-center border-4 border-black border-dashed"
    >
      <p class="text-3xl font-display font-black opacity-30 uppercase">
        No components found in this category
      </p>
    </div>
  </UContainer>
</template>
