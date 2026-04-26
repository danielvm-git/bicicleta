<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data: bike, error } = await useFetch(`/api/bikes/${slug}`);

const formatCurrency = (value: number | string) => {
  const val = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
};

const totalWeight = computed(() => {
  if (!bike.value) return 0;
  return bike.value.bikeComponents.reduce((total: number, bc: any) => {
    const weight =
      typeof bc.component.weight === "string"
        ? parseFloat(bc.component.weight)
        : bc.component.weight;
    return total + (isNaN(weight || 0) ? 0 : weight || 0);
  }, 0);
});

useSeoMeta({
  title: () =>
    bike.value ? `${bike.value.name} | Monta Bike` : "Montagem de Bicicleta",
  ogTitle: () => (bike.value ? bike.value.name : "Montagem de Bicicleta"),
  description: () =>
    bike.value
      ? `Confira esta montagem de MTB no Monta Bike: ${bike.value.description || ""}. Preço estimado: ${formatCurrency(bike.value.totalPrice)}`
      : "Simulador de montagem de bicicletas MTB.",
  ogDescription: () =>
    bike.value
      ? `Confira esta montagem de MTB no Monta Bike: ${bike.value.description || ""}. Preço estimado: ${formatCurrency(bike.value.totalPrice)}`
      : "Simulador de montagem de bicicletas MTB.",
  ogSiteName: "Monta Bike",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UContainer class="py-8">
    <div v-if="error" class="text-center py-12">
      <UIcon
        name="i-heroicons-exclamation-circle"
        class="text-6xl text-red-500 mb-4"
      />
      <h1 class="text-2xl font-bold">Bike não encontrada</h1>
      <p class="text-gray-500 mt-2">
        O link pode estar quebrado ou a bike foi removida.
      </p>
      <UButton to="/builder" class="mt-6" variant="soft"
        >Voltar ao Simulador</UButton
      >
    </div>

    <div v-else-if="bike">
      <div class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-3xl font-bold">{{ bike.name }}</h1>
          <p class="text-gray-500">{{ bike.description }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500 uppercase font-semibold">
            Total Estimado
          </p>
          <p class="text-3xl font-bold text-primary">
            {{ formatCurrency(bike.totalPrice) }}
          </p>
          <p v-if="totalWeight > 0" class="text-sm text-gray-400">
            Peso: {{ totalWeight.toFixed(3) }} kg
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="bc in bike.bikeComponents" :key="bc.id">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-gray-500 uppercase">{{
                bc.component.category
              }}</span>
              <UBadge
                v-if="bc.component.speeds"
                size="xs"
                color="gray"
                variant="soft"
                >{{ bc.component.speeds }}</UBadge
              >
            </div>
          </template>
          <div>
            <p class="font-medium">
              {{ bc.component.brand }} {{ bc.component.model }}
            </p>
            <div class="flex justify-between items-end mt-4">
              <span class="text-xs text-gray-400">
                {{ bc.component.axleType || "" }}
                {{ bc.component.weight ? ` • ${bc.component.weight}kg` : "" }}
              </span>
              <span class="font-bold text-primary">{{
                formatCurrency(bc.component.price)
              }}</span>
            </div>
          </div>
        </UCard>
      </div>

      <div class="mt-12 flex justify-center gap-4 no-print">
        <UButton
          to="/builder"
          icon="i-heroicons-wrench-screwdriver"
          variant="soft"
        >
          Criar Minha Bike
        </UButton>
        <UButton icon="i-heroicons-printer" @click="window.print()">
          Imprimir Esta Bike
        </UButton>
      </div>
    </div>
  </UContainer>
</template>

<style>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
