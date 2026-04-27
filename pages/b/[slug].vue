<script setup lang="ts">
import type { UnifiedBike } from "~/types/bike";

const route = useRoute();
const slug = route.params.slug as string;

const { data: bike, error } = await useFetch<UnifiedBike>(`/api/bikes/${slug}`);

useSeoMeta({
  title: () =>
    bike.value ? `${bike.value.name} | Monta Bike` : "Montagem de Bicicleta",
  ogTitle: () => (bike.value ? bike.value.name : "Montagem de Bicicleta"),
  description: () =>
    bike.value
      ? `Confira esta montagem de MTB no Monta Bike: ${bike.value.description || ""}.`
      : "Simulador de montagem de bicicletas MTB.",
  ogDescription: () =>
    bike.value
      ? `Confira esta montagem de MTB no Monta Bike: ${bike.value.description || ""}.`
      : "Simulador de montagem de bicicletas MTB.",
  ogSiteName: "Monta Bike",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <div>
    <!-- Error State -->
    <div
      v-if="error"
      class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6"
    >
      <div class="text-center max-w-md">
        <div
          class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 mb-6"
        >
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="text-4xl text-red-500"
          />
        </div>
        <h1 class="text-3xl font-bold text-white mb-3">Bike não encontrada</h1>
        <p class="text-slate-400 mb-8">
          O link pode estar quebrado ou a bike foi removida do catálogo.
        </p>
        <div class="flex gap-3 justify-center">
          <UButton to="/" variant="ghost" class="border border-slate-700"
            >Início</UButton
          >
          <UButton
            to="/builder"
            class="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
          >
            Criar Bike
          </UButton>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-else-if="!bike"
      class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center"
    >
      <div class="space-y-6 w-full max-w-2xl px-6">
        <USkeleton class="h-64 w-full rounded-xl" />
        <USkeleton class="h-12 w-1/2 rounded-lg" />
        <div class="grid grid-cols-2 gap-4">
          <USkeleton class="h-32 w-full rounded-lg" />
          <USkeleton class="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <BikeDetailView v-else :bike="bike" />
  </div>
</template>
