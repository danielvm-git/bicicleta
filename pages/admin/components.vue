<script setup lang="ts">
const search = ref("");
const isEditModalOpen = ref(false);
const selectedComponent = ref<any>(null);
const uploading = ref(false);
const selectedFile = ref<File | null>(null);
const importResult = ref<any>(null);
const scraping = ref(false);
const scrapeResult = ref<any>(null);

const {
  data: components,
  refresh,
  pending,
} = await useFetch("/api/components", {
  query: { search },
  watch: [search],
});

const onFileChange = (e: any) => {
  selectedFile.value = e[0];
};

const uploadFile = async () => {
  if (!selectedFile.value) return;
  uploading.value = true;
  importResult.value = null;

  const formData = new FormData();
  formData.append("file", selectedFile.value);

  try {
    const res: any = await $fetch("/api/admin/import", {
      method: "POST",
      body: formData,
    });
    importResult.value = res;
    await refresh();
  } catch (e) {
    console.error(e);
    alert("Erro no processamento do arquivo.");
  } finally {
    uploading.value = false;
  }
};

const runScrape = async () => {
  scraping.value = true;
  scrapeResult.value = null;
  try {
    const res: any = await $fetch("/api/admin/scrape", {
      method: "POST",
    });
    scrapeResult.value = res;
    await refresh();
  } catch (e) {
    console.error(e);
    alert("Erro ao disparar automação.");
  } finally {
    scraping.value = false;
  }
};

const columns = [
  { key: "category", label: "Categoria", sortable: true },
  { key: "brand", label: "Marca", sortable: true },
  { key: "model", label: "Modelo", sortable: true },
  { key: "price", label: "Preço", sortable: true },
  { key: "actions", label: "Ações" },
];

const formatCurrency = (value: number | string) => {
  const val = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
};

const openEdit = (comp: any) => {
  selectedComponent.value = { ...comp };
  isEditModalOpen.value = true;
};

const saveEdit = async () => {
  if (!selectedComponent.value) return;

  try {
    await $fetch(`/api/components/${selectedComponent.value.id}`, {
      method: "PATCH",
      body: selectedComponent.value,
    });
    isEditModalOpen.value = false;
    await refresh();
    alert("Componente atualizado!");
  } catch (e) {
    console.error(e);
    alert("Erro ao atualizar componente.");
  }
};
</script>

<template>
  <UContainer class="py-8">
    <!-- Header Section -->
    <div class="mb-12">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1
            class="text-4xl font-display font-black text-gray-900 dark:text-white mb-2"
          >
            Gestão de Componentes
          </h1>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl">
            Gerencie o catálogo de peças, importe novos componentes e monitore a
            atualização de preços automatizada.
          </p>
        </div>
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="md"
          color="white"
          :trailing="false"
          placeholder="Buscar peças..."
          class="w-72"
        />
      </div>
    </div>

    <!-- Theme Selector Section - Collapsed Accordion -->
    <div class="mb-8">
      <UAccordion
        :items="[{ label: '🎨 Tema de Visualização', slot: 'theme' }]"
      >
        <template #theme>
          <ThemeSelector />
        </template>
      </UAccordion>
    </div>

    <!-- Admin Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div
        class="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 elevation-sm"
      >
        <h2
          class="font-bold font-display mb-4 flex items-center gap-2 text-gray-900 dark:text-white"
        >
          <UIcon name="i-heroicons-cloud-arrow-up" class="w-5 h-5" />
          Importar Novos Componentes (CSV)
        </h2>
        <div class="flex items-center gap-2">
          <UInput
            type="file"
            size="sm"
            @change="onFileChange"
            accept=".csv"
            class="flex-1"
          />
          <UButton
            size="sm"
            :loading="uploading"
            :disabled="!selectedFile"
            icon="i-heroicons-arrow-up-tray"
            @click="uploadFile"
          >
            Importar
          </UButton>
        </div>
        <p v-if="importResult" class="mt-4 text-xs text-green-600 font-medium">
          ✅ {{ importResult.count }} itens importados de '{{
            importResult.filename
          }}'.
        </p>
      </div>

      <div
        class="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 elevation-sm"
      >
        <h2
          class="font-bold font-display mb-4 flex items-center gap-2 text-gray-900 dark:text-white"
        >
          <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" />
          Automação de Preços (Scraping)
        </h2>
        <div class="flex items-center gap-4">
          <UButton
            :loading="scraping"
            icon="i-heroicons-play"
            color="orange"
            size="sm"
            @click="runScrape"
          >
            Atualizar Preços (Lote de 3)
          </UButton>
        </div>
        <p
          v-if="scrapeResult"
          class="mt-4 text-xs font-medium"
          :class="
            scrapeResult.successCount > 0 ? 'text-green-600' : 'text-gray-600'
          "
        >
          Sumário: {{ scrapeResult.successCount }} sucessos,
          {{ scrapeResult.failCount }} falhas.
          <span class="text-[10px] block text-gray-600"
            >Finalizado em:
            {{ new Date(scrapeResult.timestamp).toLocaleString() }}</span
          >
        </p>
      </div>
    </div>

    <!-- Table Section with Styling -->
    <div class="card-elevated rounded-2xl overflow-hidden">
      <div
        class="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 px-6 py-4"
      >
        <h2
          class="text-lg font-bold font-display text-gray-900 dark:text-white"
        >
          Componentes Cadastrados
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ components?.length || 0 }} componentes no sistema
        </p>
      </div>

      <UTable
        :rows="components || []"
        :columns="columns"
        :loading="pending"
        class="w-full"
        :ui="{
          th: {
            base: 'px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600',
          },
          td: {
            base: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-700',
          },
          tr: {
            base: 'hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
          },
        }"
      >
        <template #price-data="{ row }">
          <span class="font-semibold text-primary">{{
            formatCurrency(row.price)
          }}</span>
        </template>
        <template #actions-data="{ row }">
          <UButton
            variant="ghost"
            color="gray"
            icon="i-heroicons-pencil-square"
            @click="openEdit(row)"
            class="hover:bg-gray-200 dark:hover:bg-gray-600"
          />
        </template>
      </UTable>
    </div>

    <UModal v-model="isEditModalOpen">
      <UCard v-if="selectedComponent" class="card-elevated">
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-lg font-bold font-display text-gray-900 dark:text-white"
            >
              ✏️ Editar Componente
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isEditModalOpen = false"
            />
          </div>
        </template>

        <div class="space-y-6">
          <UFormGroup label="Modelo" hint="Nome do modelo do componente">
            <UInput
              v-model="selectedComponent.model"
              placeholder="ex: XC Comp"
            />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-6">
            <UFormGroup label="Marca" hint="Fabricante">
              <UInput
                v-model="selectedComponent.brand"
                placeholder="ex: Trek"
              />
            </UFormGroup>
            <UFormGroup label="Linha" hint="Série/Linha">
              <UInput
                v-model="selectedComponent.line"
                placeholder="ex: Performance"
              />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <UFormGroup label="Preço (BRL)" hint="Preço em reais">
              <UInput
                v-model="selectedComponent.price"
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </UFormGroup>
            <UFormGroup label="Peso (kg)" hint="Peso aproximado">
              <UInput
                v-model="selectedComponent.weight"
                type="number"
                step="0.001"
                placeholder="0.000"
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Link" hint="URL do produto">
            <UInput
              v-model="selectedComponent.link"
              type="url"
              placeholder="https://"
            />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-6">
            <UFormGroup label="Velocidades" hint="ex: 12v, 11v">
              <UInput
                v-model="selectedComponent.speeds"
                placeholder="ex: 12v"
              />
            </UFormGroup>
            <UFormGroup label="Axle Type" hint="ex: Boost 148mm">
              <UInput
                v-model="selectedComponent.axleType"
                placeholder="ex: Boost 148mm"
              />
            </UFormGroup>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="gray"
              variant="soft"
              @click="isEditModalOpen = false"
            >
              Cancelar
            </UButton>
            <UButton color="primary" @click="saveEdit" icon="i-heroicons-check">
              Salvar Alterações
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UContainer>
</template>
