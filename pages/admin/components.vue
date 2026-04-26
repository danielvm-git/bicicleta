<script setup lang="ts">
const search = ref('')
const isEditModalOpen = ref(false)
const selectedComponent = ref<any>(null)
const uploading = ref(false)
const selectedFile = ref<File | null>(null)
const importResult = ref<any>(null)
const scraping = ref(false)
const scrapeResult = ref<any>(null)

const { data: components, refresh, pending } = await useFetch('/api/components', {
  query: { search },
  watch: [search]
})

const onFileChange = (e: any) => {
  selectedFile.value = e[0]
}

const uploadFile = async () => {
  if (!selectedFile.value) return
  uploading.value = true
  importResult.value = null
  
  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const res: any = await $fetch('/api/admin/import', {
      method: 'POST',
      body: formData
    })
    importResult.value = res
    await refresh()
  } catch (e) {
    console.error(e)
    alert('Erro no processamento do arquivo.')
  } finally {
    uploading.value = false
  }
}

const runScrape = async () => {
  scraping.value = true
  scrapeResult.value = null
  try {
    const res: any = await $fetch('/api/admin/scrape', {
      method: 'POST'
    })
    scrapeResult.value = res
    await refresh()
  } catch (e) {
    console.error(e)
    alert('Erro ao disparar automação.')
  } finally {
    scraping.value = false
  }
}

const columns = [
  { key: 'category', label: 'Categoria', sortable: true },
  { key: 'brand', label: 'Marca', sortable: true },
  { key: 'model', label: 'Modelo', sortable: true },
  { key: 'price', label: 'Preço', sortable: true },
  { key: 'actions', label: 'Ações' }
]

const formatCurrency = (value: number | string) => {
  const val = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

const openEdit = (comp: any) => {
  selectedComponent.value = { ...comp }
  isEditModalOpen.value = true
}

const saveEdit = async () => {
  if (!selectedComponent.value) return

  try {
    await $fetch(`/api/components/${selectedComponent.value.id}`, {
      method: 'PATCH',
      body: selectedComponent.value
    })
    isEditModalOpen.value = false
    await refresh()
    alert('Componente atualizado!')
  } catch (e) {
    console.error(e)
    alert('Erro ao atualizar componente.')
  }
}
</script>

<template>
  <UContainer class="py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-display">Gestão de Componentes</h1>
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        size="sm"
        color="white"
        :trailing="false"
        placeholder="Buscar peças..."
        class="w-64"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 class="font-bold mb-4 flex items-center gap-2">
          <UIcon name="i-heroicons-cloud-arrow-up" />
          Importar Novos Componentes (CSV)
        </h2>
        <div class="flex items-center gap-2">
          <UInput type="file" size="sm" @change="onFileChange" accept=".csv" class="flex-1" />
          <UButton size="sm" :loading="uploading" :disabled="!selectedFile" icon="i-heroicons-arrow-up-tray" @click="uploadFile">
            Importar
          </UButton>
        </div>
        <p v-if="importResult" class="mt-4 text-xs text-green-600 font-medium">
          ✅ {{ importResult.count }} itens importados de '{{ importResult.filename }}'.
        </p>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 class="font-bold mb-4 flex items-center gap-2">
          <UIcon name="i-heroicons-arrow-path" />
          Automação de Preços (Scraping)
        </h2>
        <div class="flex items-center gap-4">
          <UButton :loading="scraping" icon="i-heroicons-play" color="orange" size="sm" @click="runScrape">
            Atualizar Preços (Lote de 3)
          </UButton>
        </div>
        <p v-if="scrapeResult" class="mt-4 text-xs font-medium" :class="scrapeResult.successCount > 0 ? 'text-green-600' : 'text-gray-500'">
          Sumário: {{ scrapeResult.successCount }} sucessos, {{ scrapeResult.failCount }} falhas.
          <span class="text-[10px] block text-gray-400">Finalizado em: {{ new Date(scrapeResult.timestamp).toLocaleString() }}</span>
        </p>
      </div>
    </div>

    <UTable
      :rows="components || []"
      :columns="columns"
      :loading="pending"
      class="w-full"
    >
      <template #price-data="{ row }">
        {{ formatCurrency(row.price) }}
      </template>
      <template #actions-data="{ row }">
        <UButton
          variant="ghost"
          color="gray"
          icon="i-heroicons-pencil-square"
          @click="openEdit(row)"
        />
      </template>
    </UTable>

    <UModal v-model="isEditModalOpen">
      <UCard v-if="selectedComponent">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Editar Componente
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isEditModalOpen = false" />
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Modelo">
            <UInput v-model="selectedComponent.model" />
          </UFormGroup>
          
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Marca">
              <UInput v-model="selectedComponent.brand" />
            </UFormGroup>
            <UFormGroup label="Linha">
              <UInput v-model="selectedComponent.line" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Preço (BRL)">
              <UInput v-model="selectedComponent.price" type="number" step="0.01" />
            </UFormGroup>
            <UFormGroup label="Peso (kg)">
              <UInput v-model="selectedComponent.weight" type="number" step="0.001" />
            </UFormGroup>
          </div>

          <UFormGroup label="Link">
            <UInput v-model="selectedComponent.link" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Velocidades">
              <UInput v-model="selectedComponent.speeds" placeholder="ex: 12v" />
            </UFormGroup>
            <UFormGroup label="Axle Type">
              <UInput v-model="selectedComponent.axleType" placeholder="ex: Boost 148mm" />
            </UFormGroup>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="isEditModalOpen = false">Cancelar</UButton>
            <UButton color="primary" @click="saveEdit">Salvar Alterações</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UContainer>
</template>
