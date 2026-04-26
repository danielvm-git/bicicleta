<script setup lang="ts">
import { toValue } from "vue";
const bike = useBikeBuilder();
const { loggedIn } = useNeonAuth();

const issuesList = computed(() => toValue(bike.issues));
const totalPriceValue = computed(() => toValue(bike.totalPrice));

const { data: hierarchy } = await useFetch("/api/catalog/hierarchy");
const { data: allComponents } = await useFetch("/api/components");

// Persistência de bikes
const isOpen = ref(false);
const isCompareOpen = ref(false);
const {
  data: bikesList,
  refresh: refreshBikes,
  pending: bikesPending,
} = await useFetch("/api/bikes", {
  query: computed(() => (loggedIn.value ? { user: "true" } : {})),
  lazy: true,
  server: false,
  credentials: "include",
});
const { data: templates, pending: templatesPending } = await useFetch(
  "/api/bikes/templates",
  {
    lazy: true,
    server: false,
  }
);

watch(isOpen, (newVal) => {
  if (newVal) refreshBikes();
});

const componentsMap = computed(() => {
  const map: Record<string, any[]> = {};
  if (!allComponents.value) return map;

  allComponents.value.forEach((comp) => {
    if (!map[comp.category]) map[comp.category] = [];
    map[comp.category].push(comp);
  });

  // Sort each category: compatible first
  Object.keys(map).forEach((cat) => {
    map[cat].sort((a, b) => {
      const aComp = bike.checkCompatibility(a).compatible ? 0 : 1;
      const bComp = bike.checkCompatibility(b).compatible ? 0 : 1;
      if (aComp !== bComp) return aComp - bComp;
      return (
        (a.brand || "").localeCompare(b.brand || "") ||
        a.model.localeCompare(b.model)
      );
    });
  });

  return map;
});

const groupItems = computed(() => {
  if (!hierarchy.value) return [];
  return Object.keys(hierarchy.value).map((group) => ({
    label: group,
    slot: group,
    categories: hierarchy.value[group],
    defaultOpen: true,
  }));
});

const getCategoryItems = (categories: string[]) => {
  return categories.map((category) => ({
    label: category,
    slot: category,
    defaultOpen: false,
  }));
};

const saveBike = async () => {
  const name = prompt("Dê um nome para sua bike:", bike.state.name);
  if (!name) return;

  try {
    await bike.save(name);
    alert("Bike salva com sucesso!");
    await refreshBikes();
  } catch (e) {
    console.error(e);
    alert("Erro ao salvar bike.");
  }
};

const loadBike = (bikeData: any) => {
  bike.clear();
  bike.state.name = bikeData.name;
  bike.state.description = bikeData.description;
  bikeData.bikeComponents.forEach((bc: any) => {
    bike.selectComponent(bc.component);
  });
  isOpen.value = false;
};

const shareBike = async () => {
  const name = prompt(
    "Dê um nome para sua bike para compartilhar:",
    bike.state.name
  );
  if (!name) return;

  try {
    const shareUrl = await bike.share(name);
    alert(
      `Link de compartilhamento copiado para a área de transferência:\n${shareUrl}`
    );
    await refreshBikes();
  } catch (e) {
    console.error(e);
    alert("Erro ao gerar link de compartilhamento.");
  }
};

const formatCurrency = (value: number | string) => {
  const val = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
};

const printPage = () => {
  window.print();
};

const timeAgo = (date: string | Date | null) => {
  if (!date) return "Sem dados";
  const now = new Date();
  const updated = new Date(date);
  const diffTime = Math.abs(now.getTime() - updated.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return `Há ${diffDays} dias`;
};

const isOutdated = (date: string | Date | null) => {
  if (!date) return true;
  const now = new Date();
  const updated = new Date(date);
  const diffTime = Math.abs(now.getTime() - updated.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 30;
};

const hasCompatibilityError = computed(() =>
  issuesList.value.some((i) => i.severity === "error")
);
const hasCompatibilityWarning = computed(() =>
  issuesList.value.some((i) => i.severity === "warning")
);
</script>

<template>
  <UContainer class="py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-display">Simulador de Montagem</h1>
      <div class="flex items-center gap-4">
        <UButton
          variant="ghost"
          icon="i-heroicons-printer"
          class="no-print"
          @click="printPage"
        >
          Imprimir
        </UButton>
        <UButton
          variant="ghost"
          icon="i-heroicons-folder-open"
          class="no-print"
          @click="isOpen = true"
        >
          Minhas Montagens
        </UButton>
        <div class="text-right">
          <p class="text-sm text-gray-500">Total Estimado</p>
          <p class="text-2xl font-bold text-primary">
            {{ formatCurrency(totalPriceValue) }}
          </p>
        </div>
      </div>
    </div>

    <UAlert
      v-if="issuesList.length > 0"
      :color="hasCompatibilityError ? 'red' : 'orange'"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      title="Alertas de Compatibilidade"
      class="mb-8"
    >
      <template #description>
        <ul class="list-disc list-inside">
          <li v-for="issue in issuesList" :key="issue.ruleId + issue.message">
            <span :class="{ 'font-bold': issue.severity === 'error' }">{{
              issue.message
            }}</span>
          </li>
        </ul>
      </template>
    </UAlert>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 no-print">
        <UAccordion
          :items="groupItems"
          :ui="{ wrapper: 'flex flex-col gap-4' }"
        >
          <template v-for="item in groupItems" :key="item.slot" #[item.slot]>
            <div class="pl-4 border-l-2 border-primary/20 flex flex-col gap-2">
              <UAccordion :items="getCategoryItems(item.categories)">
                <template
                  v-for="category in item.categories"
                  :key="category"
                  #[category]
                >
                  <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                    <USelectMenu
                      v-model="bike.state.components[category]"
                      :options="componentsMap[category] || []"
                      placeholder="Selecione uma peça..."
                      searchable
                      option-attribute="model"
                      by="id"
                      @update:model-value="(val) => bike.selectComponent(val)"
                    >
                      <template #label>
                        <span
                          v-if="bike.state.components[category]"
                          class="truncate"
                        >
                          {{ bike.state.components[category].brand }}
                          {{ bike.state.components[category].model }}
                        </span>
                        <span v-else>Selecione uma peça...</span>
                      </template>
                      <template #option="{ option }">
                        <div
                          class="flex justify-between w-full"
                          :class="{
                            'opacity-50':
                              !bike.checkCompatibility(option).compatible,
                          }"
                        >
                          <div class="flex flex-col overflow-hidden">
                            <div class="flex items-center gap-2">
                              <span class="truncate"
                                >{{ option.brand }} {{ option.model }}</span
                              >
                              <UBadge
                                v-if="option.speeds"
                                size="xs"
                                color="gray"
                                variant="soft"
                                >{{ option.speeds }}</UBadge
                              >
                              <UBadge
                                v-if="option.axleType"
                                size="xs"
                                color="gray"
                                variant="soft"
                                >{{ option.axleType }}</UBadge
                              >
                              <UBadge
                                v-if="
                                  !bike.checkCompatibility(option).compatible
                                "
                                size="xs"
                                color="red"
                                variant="soft"
                              >
                                {{ bike.checkCompatibility(option).reason }}
                              </UBadge>
                            </div>
                            <div class="flex items-center gap-2 mt-0.5">
                              <span class="text-[10px] text-gray-400">
                                Preço: {{ timeAgo(option.updatedAt) }}
                              </span>
                              <UBadge
                                v-if="isOutdated(option.updatedAt)"
                                size="xs"
                                color="orange"
                                variant="soft"
                                class="text-[8px] px-1 py-0"
                                >Desatualizado</UBadge
                              >
                            </div>
                          </div>
                          <span class="text-gray-500 font-mono">{{
                            formatCurrency(option.price)
                          }}</span>
                        </div>
                      </template>
                    </USelectMenu>
                  </div>
                </template>
              </UAccordion>
            </div>
          </template>
        </UAccordion>
      </div>

      <div class="lg:col-span-1">
        <UCard>
          <template #header>
            <h2 class="font-display">Resumo da Bike</h2>
          </template>

          <div
            v-if="Object.keys(bike.state.components).length === 0"
            class="text-center py-4 text-gray-500"
          >
            Nenhuma peça selecionada.
          </div>

          <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <li
              v-for="(comp, cat) in bike.state.components"
              :key="cat"
              class="py-2 flex justify-between items-start"
            >
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-500 uppercase">
                  {{ cat }}
                </p>
                <p class="truncate text-sm">
                  {{ comp.brand }} {{ comp.model }}
                </p>
              </div>
              <div class="text-right ml-4">
                <p class="text-sm font-medium">
                  {{ formatCurrency(comp.price) }}
                </p>
                <UButton
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  size="2xs"
                  @click="bike.removeComponent(cat)"
                />
              </div>
            </li>
          </ul>

          <template #footer>
            <div class="flex flex-col gap-2 no-print">
              <div class="flex gap-2">
                <UButton
                  block
                  class="flex-1"
                  color="primary"
                  :disabled="Object.keys(bike.state.components).length === 0"
                  @click="saveBike"
                >
                  Salvar Bike
                </UButton>
                <UButton
                  variant="soft"
                  color="gray"
                  icon="i-heroicons-trash"
                  @click="bike.clear"
                />
              </div>
              <UButton
                block
                variant="soft"
                color="primary"
                icon="i-heroicons-share"
                :disabled="Object.keys(bike.state.components).length === 0"
                @click="shareBike"
              >
                Compartilhar Bike
              </UButton>
              <UButton
                block
                variant="outline"
                color="primary"
                icon="i-heroicons-arrows-right-left"
                @click="isCompareOpen = true"
              >
                Comparar com Bike Comercial
              </UButton>
            </div>
          </template>
        </UCard>
      </div>
    </div>

    <UModal v-model="isOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Minhas Montagens
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>

        <div v-if="bikesPending" class="flex justify-center p-4">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" />
        </div>
        <div
          v-else-if="bikesList && bikesList.length > 0"
          class="divide-y divide-gray-200 dark:divide-gray-700"
        >
          <div
            v-for="bikeData in bikesList"
            :key="bikeData.id"
            class="py-3 flex justify-between items-center"
          >
            <div>
              <p class="font-medium">{{ bikeData.name }}</p>
              <p class="text-xs text-gray-500">
                {{ formatCurrency(bikeData.totalPrice) }}
              </p>
            </div>
            <UButton
              size="xs"
              color="primary"
              variant="soft"
              @click="loadBike(bikeData)"
            >
              Carregar
            </UButton>
          </div>
        </div>
        <div v-else class="text-center py-4 text-gray-500">
          Nenhuma montagem salva encontrada.
        </div>
      </UCard>
    </UModal>

    <UModal v-model="isCompareOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Selecionar Bike Comercial para Comparar
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isCompareOpen = false"
            />
          </div>
        </template>

        <div v-if="templatesPending" class="flex justify-center p-4">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" />
        </div>
        <div
          v-else-if="templates && templates.length > 0"
          class="divide-y divide-gray-200 dark:divide-gray-700"
        >
          <div
            v-for="template in templates"
            :key="template.id"
            class="py-3 flex justify-between items-center"
          >
            <div>
              <p class="font-medium">{{ template.name }}</p>
              <p class="text-xs text-gray-500">
                {{ formatCurrency(template.totalPrice) }}
              </p>
            </div>
            <UButton
              size="xs"
              color="primary"
              variant="soft"
              @click="navigateTo(`/compare?id=${template.id}`)"
            >
              Comparar
            </UButton>
          </div>
        </div>
        <div v-else class="text-center py-4 text-gray-500">
          Nenhum template comercial encontrado.
        </div>
      </UCard>
    </UModal>
  </UContainer>
</template>

<style>
@media print {
  .no-print {
    display: none !important;
  }
  .print-only {
    display: block !important;
  }
}
</style>
