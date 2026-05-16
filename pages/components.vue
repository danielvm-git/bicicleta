<script setup lang="ts">
import { ref, watch, computed } from "vue";

const category = ref("");
const brand = ref("");
const line = ref("");
const search = ref("");

const { data: categories } = await useFetch("/api/categories");
const categoryOptions = computed(() => [
  { label: "Todas as Categorias", value: "" },
  ...(categories.value?.map((c) => ({ label: c, value: c })) || []),
]);

const { data: brands, refresh: refreshBrands } = await useFetch("/api/brands", {
  query: { category },
});
const brandOptions = computed(() => [
  { label: "Todas as Marcas", value: "" },
  ...(brands.value?.map((b) => ({ label: b, value: b })) || []),
]);

const { data: lines, refresh: refreshLines } = await useFetch("/api/lines", {
  query: { category, brand },
});
const lineOptions = computed(() => [
  { label: "Todas as Linhas", value: "" },
  ...(lines.value?.map((l) => ({ label: l, value: l })) || []),
]);

const {
  data: components,
  refresh: refreshComponents,
  pending,
} = await useFetch("/api/components", {
  query: { category, brand, line, search },
});

watch(category, () => {
  brand.value = "";
  line.value = "";
});

watch(brand, () => {
  line.value = "";
});

const columns = [
  { key: "category", label: "Categoria" },
  { key: "brand", label: "Marca" },
  { key: "line", label: "Linha" },
  { key: "model", label: "Modelo" },
  { key: "price", label: "Preço" },
];

const clearFilters = () => {
  category.value = "";
  brand.value = "";
  line.value = "";
  search.value = "";
};
</script>

<template>
  <UContainer class="py-12">
    <div
      class="flex items-center justify-between mb-16 border-b-8 border-black pb-8"
    >
      <div>
        <h1 class="text-7xl mb-2">CATALOG</h1>
        <p class="font-body text-xl opacity-60 uppercase">
          Full technical specifications and market data.
        </p>
      </div>
      <UButton
        to="/"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="brutalist-button px-8 h-16"
        >BACK TO BASE</UButton
      >
    </div>

    <div class="brutalist-card mb-16 p-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="space-y-2">
          <label class="block font-display font-black text-sm uppercase"
            >Category</label
          >
          <USelect
            v-model="category"
            :options="categoryOptions"
            :ui="{
              base: 'brutalist-input h-12 !ring-0',
              rounded: 'rounded-none',
              border: 'border-2 border-black focus:border-red-500',
            }"
          />
        </div>

        <div class="space-y-2">
          <label class="block font-display font-black text-sm uppercase"
            >Brand</label
          >
          <USelect
            v-model="brand"
            :options="brandOptions"
            :disabled="!category && !brands?.length"
            :ui="{
              base: 'brutalist-input h-12 !ring-0',
              rounded: 'rounded-none',
              border: 'border-2 border-black focus:border-red-500',
            }"
          />
        </div>

        <div class="space-y-2">
          <label class="block font-display font-black text-sm uppercase"
            >Line</label
          >
          <USelect
            v-model="line"
            :options="lineOptions"
            :disabled="!brand && !lines?.length"
            :ui="{
              base: 'brutalist-input h-12 !ring-0',
              rounded: 'rounded-none',
              border: 'border-2 border-black focus:border-red-500',
            }"
          />
        </div>

        <div class="space-y-2">
          <label class="block font-display font-black text-sm uppercase"
            >Search</label
          >
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="MODEL, BRAND..."
            :ui="{
              base: 'brutalist-input h-12 !ring-0',
              rounded: 'rounded-none',
              border: 'border-2 border-black focus:border-red-500',
            }"
          />
        </div>
      </div>
      <div
        class="flex justify-end mt-8 border-t-2 border-black pt-6"
        v-if="category || brand || line || search"
      >
        <button
          class="font-display font-black text-sm uppercase underline decoration-4 hover:text-red-500 transition-colors"
          @click="clearFilters"
        >
          CLEAR ALL FILTERS
        </button>
      </div>
    </div>

    <div class="brutalist-card overflow-hidden">
      <UTable
        :rows="components || []"
        :columns="columns"
        :loading="pending"
        :ui="{
          wrapper: 'relative',
          thead: 'bg-black text-white',
          th: {
            padding: 'py-6 px-6',
            font: 'font-display font-black uppercase text-sm tracking-widest',
            color: 'text-white',
          },
          td: {
            padding: 'py-6 px-6',
            font: 'font-body font-medium',
            color: 'text-black',
          },
          divide: 'divide-y divide-black border-t border-black',
          tbody: 'divide-y divide-black',
        }"
      >
        <template #category-data="{ row }">
          <span
            class="font-display font-black text-xs uppercase bg-black text-white px-2 py-1"
            >{{ row.category }}</span
          >
        </template>

        <template #price-data="{ row }">
          <span class="font-mono font-bold text-lg">R$ {{ row.price }}</span>
        </template>
      </UTable>
    </div>
  </UContainer>
</template>
