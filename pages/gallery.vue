<script setup lang="ts">
const { data: builds, pending } = await useFetch('/api/builds/public')

const formatCurrency = (value: number | string) => {
  const val = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

const getSummary = (build: any) => {
  const frame = build.buildComponents.find((bc: any) => bc.component.category === 'Quadro')
  const fork = build.buildComponents.find((bc: any) => bc.component.category === 'Suspensão')
  
  let parts = []
  if (frame) parts.push(frame.component.model)
  if (fork) parts.push(fork.component.model)
  
  return parts.length > 0 ? parts.join(' • ') : 'Montagem personalizada'
}

useSeoMeta({
  title: 'Galeria da Comunidade | Monta Bike',
  ogTitle: 'Galeria da Comunidade | Monta Bike',
  description: 'Explore montagens de MTB criadas pela comunidade no Monta Bike.',
  ogDescription: 'Explore montagens de MTB criadas pela comunidade no Monta Bike.',
})
</script>

<template>
  <UContainer class="py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-display">Galeria da Comunidade</h1>
      <p class="text-gray-500 mt-2">Explore as montagens criadas por outros ciclistas.</p>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <USkeleton v-for="i in 6" :key="i" class="h-48 w-full" />
    </div>

    <div v-else-if="builds && builds.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="build in builds" :key="build.id" class="flex flex-col h-full">
        <template #header>
          <div class="flex justify-between items-start">
            <h2 class="font-display text-lg truncate pr-2">{{ build.name }}</h2>
            <UBadge color="primary" variant="subtle">{{ formatCurrency(build.totalPrice) }}</UBadge>
          </div>
        </template>

        <div class="flex-1">
          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {{ getSummary(build) }}
          </p>
          <div class="mt-4 flex flex-wrap gap-1">
            <template v-for="bc in build.buildComponents.slice(0, 4)" :key="bc.id">
               <UBadge size="xs" color="gray" variant="soft">{{ bc.component.category }}</UBadge>
            </template>
            <span v-if="build.buildComponents.length > 4" class="text-[10px] text-gray-400 self-center">
              +{{ build.buildComponents.length - 4 }} itens
            </span>
          </div>
        </div>

        <template #footer>
          <UButton :to="`/b/${build.slug}`" block variant="soft" icon="i-heroicons-eye">
            Ver Detalhes
          </UButton>
        </template>
      </UCard>
    </div>

    <div v-else class="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
      <UIcon name="i-heroicons-photo" class="text-6xl text-gray-400 mb-4" />
      <p class="text-xl font-medium text-gray-500">Nenhuma montagem pública ainda.</p>
      <UButton to="/builder" class="mt-4" variant="soft">Seja o primeiro a criar!</UButton>
    </div>
  </UContainer>
</template>
