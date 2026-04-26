<script setup lang="ts">
const route = useRoute()
const { selectedComponents: customBuild, totalPrice: customTotalPrice, totalWeight: customTotalWeight } = useBuilder()

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

const templateTotalWeight = computed(() => {
  if (!selectedTemplate.value) return 0
  return selectedTemplate.value.buildComponents.reduce((total: number, bc: any) => {
    const weight = typeof bc.component.weight === 'string' ? parseFloat(bc.component.weight) : bc.component.weight
    return total + (isNaN(weight || 0) ? 0 : (weight || 0))
  }, 0)
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

const printPage = () => {
  window.print()
}
</script>

<template>
  <UContainer class="py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Comparação Side-by-Side</h1>
      <div class="flex gap-2 no-print">
        <UButton variant="ghost" icon="i-heroicons-printer" @click="printPage">
          Imprimir
        </UButton>
        <UButton to="/builder" variant="ghost" icon="i-heroicons-arrow-left">
          Voltar ao Simulador
        </UButton>
      </div>
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
        <div v-if="!templateId" class="no-print">
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
          <div class="text-right flex items-center gap-2">
            <span class="text-xl font-bold text-primary">{{ formatCurrency(templateTotalPrice) }}</span>
            <UButton
              variant="ghost"
              color="gray"
              icon="i-heroicons-x-mark"
              size="xs"
              class="no-print"
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
                  <div class="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-gray-500">
                    <span v-if="comp.speeds" class="font-semibold text-gray-700 dark:text-gray-300">{{ comp.speeds }}</span>
                    <span v-if="comp.axleType">{{ comp.axleType }}</span>
                    <span v-if="comp.weight" class="italic">{{ comp.weight }}kg</span>
                    <span class="font-mono">{{ formatCurrency(comp.price) }}</span>
                  </div>
                </div>
              </div>
              <span v-else class="text-gray-400 text-sm italic">Não selecionado</span>
            </td>
            <td class="border border-gray-200 dark:border-gray-700 p-3 align-top">
              <div v-if="groupedTemplate[category]" class="space-y-1">
                <div v-for="comp in groupedTemplate[category]" :key="comp.id">
                  <p class="text-sm font-medium">{{ comp.brand }} {{ comp.model }}</p>
                  <div class="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-gray-500">
                    <span v-if="comp.speeds" class="font-semibold text-gray-700 dark:text-gray-300">{{ comp.speeds }}</span>
                    <span v-if="comp.axleType">{{ comp.axleType }}</span>
                    <span v-if="comp.weight" class="italic">{{ comp.weight }}kg</span>
                    <span class="font-mono">{{ formatCurrency(comp.price) }}</span>
                  </div>
                </div>
              </div>
              <span v-else class="text-gray-400 text-sm italic">N/A</span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="bg-gray-50 dark:bg-gray-800 font-bold border-t-2 border-gray-200 dark:border-gray-700">
            <td class="border border-gray-200 dark:border-gray-700 p-3">PESO ESTIMADO</td>
            <td class="border border-gray-200 dark:border-gray-700 p-3">
              {{ customTotalWeight > 0 ? `${customTotalWeight.toFixed(3)} kg` : 'Sob consulta' }}
            </td>
            <td class="border border-gray-200 dark:border-gray-700 p-3">
              {{ templateTotalWeight > 0 ? `${templateTotalWeight.toFixed(3)} kg` : 'Sob consulta' }}
            </td>
          </tr>
          <tr class="bg-gray-50 dark:bg-gray-800 font-bold">
            <td class="border border-gray-200 dark:border-gray-700 p-3 text-lg">TOTAL</td>
            <td class="border border-gray-200 dark:border-gray-700 p-3 text-primary text-xl">
              {{ formatCurrency(customTotalPrice) }}
            </td>
            <td class="border border-gray-200 dark:border-gray-700 p-3 text-primary text-xl">
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

<style>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
