<script setup lang="ts">
const { selectedComponents, selectComponent, removeComponent, totalPrice, clearBuild } = useBuilder()

const { data: categories } = await useFetch('/api/categories')
const { data: allComponents } = await useFetch('/api/components')

// Persistência de builds
const isOpen = ref(false)
const { data: buildsList, refresh: refreshBuilds, pending } = await useFetch('/api/builds', {
  lazy: true,
  server: false
})

watch(isOpen, (newVal) => {
  if (newVal) refreshBuilds()
})

const componentsMap = computed(() => {
  const map: Record<string, any[]> = {}
  if (!allComponents.value) return map
  allComponents.value.forEach(comp => {
    if (!map[comp.category]) map[comp.category] = []
    map[comp.category].push(comp)
  })
  return map
})

const items = computed(() => {
  return (categories.value || []).map(category => ({
    label: category,
    slot: category,
    defaultOpen: false
  }))
})

const saveBuild = async () => {
  const name = prompt('Dê um nome para sua build:', 'Minha Build')
  if (!name) return

  try {
    await $fetch('/api/builds', {
      method: 'POST',
      body: {
        name,
        componentIds: Object.values(selectedComponents.value).map(c => c.id),
        totalPrice: totalPrice.value
      }
    })
    alert('Build salva com sucesso!')
    await refreshBuilds()
  } catch (e) {
    console.error(e)
    alert('Erro ao salvar build.')
  }
}

const loadBuild = (build: any) => {
  const newSelected: Record<string, any> = {}
  build.buildComponents.forEach((bc: any) => {
    const comp = bc.component
    newSelected[comp.category] = comp
  })
  selectedComponents.value = newSelected
  isOpen.value = false
}

const formatCurrency = (value: number | string) => {
  const val = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}
</script>

<template>
  <UContainer class="py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Simulador de Montagem</h1>
      <div class="flex items-center gap-4">
        <UButton
          variant="ghost"
          icon="i-heroicons-folder-open"
          @click="isOpen = true"
        >
          Minhas Montagens
        </UButton>
        <div class="text-right">
          <p class="text-sm text-gray-500">Total Estimado</p>
          <p class="text-2xl font-bold text-primary">{{ formatCurrency(totalPrice) }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <UAccordion :items="items" :ui="{ wrapper: 'flex flex-col gap-2' }">
          <template v-for="category in categories" :key="category" #[category]>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
              <USelectMenu
                v-model="selectedComponents[category]"
                :options="componentsMap[category] || []"
                placeholder="Selecione uma peça..."
                searchable
                option-attribute="model"
                by="id"
                @update:model-value="val => selectComponent(val)"
              >
                <template #label>
                  <span v-if="selectedComponents[category]" class="truncate">
                    {{ selectedComponents[category].brand }} {{ selectedComponents[category].model }}
                  </span>
                  <span v-else>Selecione uma peça...</span>
                </template>
                <template #option="{ option }">
                  <div class="flex justify-between w-full">
                    <span class="truncate">{{ option.brand }} {{ option.model }}</span>
                    <span class="text-gray-500">{{ formatCurrency(option.price) }}</span>
                  </div>
                </template>
              </USelectMenu>
            </div>
          </template>
        </UAccordion>
      </div>

      <div class="lg:col-span-1">
        <UCard>
          <template #header>
            <h2 class="font-bold">Resumo da Build</h2>
          </template>

          <div v-if="Object.keys(selectedComponents).length === 0" class="text-center py-4 text-gray-500">
            Nenhuma peça selecionada.
          </div>

          <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="(comp, cat) in selectedComponents" :key="cat" class="py-2 flex justify-between items-start">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-500 uppercase">{{ cat }}</p>
                <p class="truncate text-sm">{{ comp.brand }} {{ comp.model }}</p>
              </div>
              <div class="text-right ml-4">
                <p class="text-sm font-medium">{{ formatCurrency(comp.price) }}</p>
                <UButton
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  size="2xs"
                  @click="removeComponent(cat)"
                />
              </div>
            </li>
          </ul>

          <template #footer>
            <div class="flex gap-2">
              <UButton
                block
                color="primary"
                :disabled="Object.keys(selectedComponents).length === 0"
                @click="saveBuild"
              >
                Salvar Build
              </UButton>
              <UButton
                variant="soft"
                color="gray"
                icon="i-heroicons-trash"
                @click="clearBuild"
              />
            </div>
          </template>
        </UCard>
      </div>
    </div>

    <UModal v-model="isOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Minhas Montagens
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>

        <div v-if="pending" class="flex justify-center p-4">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" />
        </div>
        <div v-else-if="buildsList && buildsList.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="build in buildsList" :key="build.id" class="py-3 flex justify-between items-center">
            <div>
              <p class="font-medium">{{ build.name }}</p>
              <p class="text-xs text-gray-500">{{ formatCurrency(build.totalPrice) }}</p>
            </div>
            <UButton size="xs" color="primary" variant="soft" @click="loadBuild(build)">
              Carregar
            </UButton>
          </div>
        </div>
        <div v-else class="text-center py-4 text-gray-500">
          Nenhuma montagem salva encontrada.
        </div>
      </UCard>
    </UModal>
  </UContainer>
</template>
