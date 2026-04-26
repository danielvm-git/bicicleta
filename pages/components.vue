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
  <div class="py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">Componentes</h1>
      <UButton to="/" variant="ghost" icon="i-heroicons-arrow-left"
        >Voltar</UButton
      >
    </div>

    <UCard class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UFormGroup label="Categoria">
          <USelect v-model="category" :options="categoryOptions" />
        </UFormGroup>

        <UFormGroup label="Marca">
          <USelect
            v-model="brand"
            :options="brandOptions"
            :disabled="!category && !brands?.length"
          />
        </UFormGroup>

        <UFormGroup label="Linha">
          <USelect
            v-model="line"
            :options="lineOptions"
            :disabled="!brand && !lines?.length"
          />
        </UFormGroup>

        <UFormGroup label="Pesquisar">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Modelo, marca..."
          />
        </UFormGroup>
      </div>
      <div
        class="flex justify-end mt-4"
        v-if="category || brand || line || search"
      >
        <UButton color="gray" variant="ghost" @click="clearFilters"
          >Limpar Filtros</UButton
        >
      </div>
    </UCard>

    <UTable :rows="components || []" :columns="columns" :loading="pending">
      <template #price-data="{ row }"> R$ {{ row.price }} </template>
    </UTable>
  </div>
</template>
