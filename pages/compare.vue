<script setup lang="ts">
const route = useRoute()
const { selectedComponents: customBuild, totalPrice: customTotalPrice } = useBuilder()

const { data: templates, pending } = await useFetch('/api/builds/templates')

const templateId = ref<number | null>(null)

watchEffect(() => {
  if (route.query.id) {
    templateId.value = parseInt(route.query.id as string)
  }
})

const selectedTemplate = computed(() => {
  if (!templates.value) return null
  return templates.value.find(t => t.id === templateId.value) || null
})

const normalizationMap: Record<string, string> = {
  'Cassete': 'Transmissão',
  'Corrente': 'Transmissão',
  'Câmbio Dianteiro': 'Transmissão',
  'Câmbio Traseiro': 'Transmissão',
  'Pedivela': 'Transmissão',
  'Alavanca de Câmbio': 'Transmissão',
  'Movimento Central': 'Transmissão',
  'Guidão': 'Cockpit',
  'Mesa': 'Cockpit',
  'Canote': 'Cockpit',
  'Selim': 'Cockpit',
  'Manopla': 'Cockpit',
  'Caixa de Direção': 'Cockpit',
  'Aro': 'Rodas',
  'Cubo': 'Rodas',
  'Raio': 'Rodas',
  'Pneu': 'Pneus',
  'Câmara': 'Pneus',
  'Freio': 'Freios',
  'Manete de Freio': 'Freios',
  'Disco de Freio': 'Freios',
}

const normalize = (category: string) => normalizationMap[category] || category

const groupedCustom = computed(() => {
  const grouped: Record<string, any[]> = {}
  Object.values(customBuild.value).forEach(comp => {
    const norm = normalize(comp.category)
    if (!grouped[norm]) grouped[norm] = []
    grouped[norm].push(comp)
  })
  return grouped
})

const groupedTemplate = computed(() => {
  const grouped: Record<string, any[]> = {}
  if (!selectedTemplate.value) return grouped
  selectedTemplate.value.buildComponents.forEach((bc: any) => {
    const comp = bc.component
    const norm = normalize(comp.category)
    if (!grouped[norm]) grouped[norm] = []
    grouped[norm].push(comp)
  })
  return grouped
})

const allCategories = computed(() => {
  const cats = new Set([...Object.keys(groupedCustom.value), ...Object.keys(groupedTemplate.value)])
  return Array.from(cats).sort()
})

const formatCurrency = (value: number | string) => {
  const val = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

const templateTotalPrice = computed(() => {
  if (!selectedTemplate.value) return 0
  return parseFloat(selectedTemplate.value.totalPrice || '0')
})
</script>

<template>
  <UContainer class="py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Comparação Side-by-Side</h1>
      <UButton to="/builder" variant="ghost" icon="i-heroicons-arrow-left">
        Voltar ao Simulador
      </UButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <UCard>
        <template #header>
          <h2 class="font-bold">Sua Build Atual</h2>
        </template>
        <div class="flex justify-between items-center">
          <span class="text-gray-500">Total Estimado</span>
          <span class="text-xl font-bold text-primary">{{ formatCurrency(customTotalPrice) }}</span>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="font-bold">Bike Comercial (Template)</h2>
        </template>
        <div v-if="!templateId">
          <USelectMenu
            v-model="templateId"
            :options="templates || []"
            placeholder="Selecione um template para comparar"
            option-attribute="name"
            value-attribute="id"
            searchable
          />
        </div>
        <div v-else-if="selectedTemplate" class="flex justify-between items-center">
          <div>
            <p class="font-medium">{{ selectedTemplate.name }}</p>
            <p class="text-xs text-gray-500">{{ selectedTemplate.description }}</p>
          </div>
          <div class="text-right">
            <span class="text-xl font-bold text-primary">{{ formatCurrency(templateTotalPrice) }}</span>
            <UButton
              variant="ghost"
              color="gray"
              icon="i-heroicons-x-mark"
              size="xs"
              class="ml-2"
              @click="templateId = null"
            />
          </div>
        </div>
      </UCard>
    </div>

    <div v-if="selectedTemplate" class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-200 dark:border-gray-700">
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-800">
            <th class="border border-gray-200 dark:border-gray-700 p-3 text-left">Categoria</th>
            <th class="border border-gray-200 dark:border-gray-700 p-3 text-left">Sua Build</th>
            <th class="border border-gray-200 dark:border-gray-700 p-3 text-left">Template</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in allCategories" :key="category">
            <td class="border border-gray-200 dark:border-gray-700 p-3 font-semibold bg-gray-50/50 dark:bg-gray-800/50">
              {{ category }}
            </td>
            <td class="border border-gray-200 dark:border-gray-700 p-3 align-top">
              <div v-if="groupedCustom[category]" class="space-y-1">
                <div v-for="comp in groupedCustom[category]" :key="comp.id">
                  <p class="text-sm font-medium">{{ comp.brand }} {{ comp.model }}</p>
                  <p class="text-xs text-gray-500">{{ formatCurrency(comp.price) }}</p>
                </div>
              </div>
              <span v-else class="text-gray-400 text-sm italic">Não selecionado</span>
            </td>
            <td class="border border-gray-200 dark:border-gray-700 p-3 align-top">
              <div v-if="groupedTemplate[category]" class="space-y-1">
                <div v-for="comp in groupedTemplate[category]" :key="comp.id">
                  <p class="text-sm font-medium">{{ comp.brand }} {{ comp.model }}</p>
                  <p class="text-xs text-gray-500">{{ formatCurrency(comp.price) }}</p>
                </div>
              </div>
              <span v-else class="text-gray-400 text-sm italic">N/A</span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-gray-50 dark:bg-gray-800 font-bold">
            <td class="border border-gray-200 dark:border-gray-700 p-3">TOTAL</td>
            <td class="border border-gray-200 dark:border-gray-700 p-3 text-primary">
              {{ formatCurrency(customTotalPrice) }}
            </td>
            <td class="border border-gray-200 dark:border-gray-700 p-3 text-primary">
              {{ formatCurrency(templateTotalPrice) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div v-else-if="!pending" class="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
      <UIcon name="i-heroicons-arrow-path" class="text-4xl text-gray-400 mb-2" />
      <p class="text-gray-500">Selecione um template comercial para iniciar a comparação.</p>
    </div>
  </UContainer>
</template>
