<script setup lang="ts">
const { data: publicPage, pending } = await useFetch("/api/bikes/public");

const bikes = computed(() => publicPage.value?.items ?? []);

const formatCurrency = (value: number | string) => {
  const val = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
};

const getSummary = (bike: any) => {
  const frame = bike.bikeComponents.find(
    (bc: any) => bc.component?.category === "Quadro"
  );
  const fork = bike.bikeComponents.find(
    (bc: any) => bc.component?.category === "Suspensão"
  );

  let parts = [];
  if (frame?.component) parts.push(frame.component.model);
  if (fork?.component) parts.push(fork.component.model);

  return parts.length > 0 ? parts.join(" • ") : "Montagem personalizada";
};

useSeoMeta({
  title: "Galeria da Comunidade | Monta Bike",
  ogTitle: "Galeria da Comunidade | Monta Bike",
  description:
    "Explore montagens de MTB criadas pela comunidade no Monta Bike.",
  ogDescription:
    "Explore montagens de MTB criadas pela comunidade no Monta Bike.",
});
</script>

<template>
  <UContainer class="py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-display">Galeria da Comunidade</h1>
      <p class="text-gray-600 mt-2">
        Explore as montagens criadas por outros ciclistas.
      </p>
    </div>

    <div
      v-if="pending"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <USkeleton v-for="i in 6" :key="i" class="h-48 w-full" />
    </div>

    <div
      v-else-if="bikes && bikes.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <UCard
        v-for="bike in bikes"
        :key="bike.id"
        class="flex flex-col h-full card-elevated"
      >
        <template #header>
          <div class="flex justify-between items-start">
            <h2 class="font-display text-lg truncate pr-2">{{ bike.name }}</h2>
            <span class="metric-large text-primary font-bold flex-shrink-0">{{
              formatCurrency(bike.totalPrice)
            }}</span>
          </div>
        </template>

        <div class="flex-1">
          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {{ getSummary(bike) }}
          </p>
        </div>

        <template #footer>
          <UButton
            :to="`/b/${bike.slug}`"
            block
            variant="soft"
            icon="i-heroicons-eye"
          >
            Ver Detalhes
          </UButton>
        </template>
      </UCard>
    </div>

    <EmptyState
      v-else
      icon="i-heroicons-photo"
      title="Nenhuma montagem pública ainda"
      description="Seja o primeiro a compartilhar sua bicicleta criada no Monta Bike!"
      actionLabel="Criar a Primeira"
      actionHref="/builder"
      actionIcon="i-heroicons-plus"
    />
  </UContainer>
</template>
