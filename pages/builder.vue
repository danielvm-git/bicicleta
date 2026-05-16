<script setup lang="ts">
import { toValue } from "vue";
const bike = useBikeBuilder();
const { loggedIn } = useNeonAuth();
const i18n = useI18n();

const issuesList = computed(() => toValue(bike.issues));
const totalPriceValue = computed(() => toValue(bike.totalPrice));

const { data: hierarchy } = await useFetch("/api/catalog/hierarchy");
const { data: allComponents } = await useFetch("/api/components");

// Persistência de bikes
const isOpen = ref(false);
const isCompareOpen = ref(false);
const isSaveBikeModalOpen = ref(false);
const isShareBikeModalOpen = ref(false);
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
  return Object.keys(hierarchy.value).map((group, index) => {
    const categories = hierarchy.value[group] as string[];
    const selectedCount = categories.filter(
      (cat) => bike.state.components[cat]
    ).length;

    // Only first 2 groups open by default to reduce cognitive overload
    const isDefaultOpen = index < 2;

    return {
      label: `${group} (${selectedCount}/${categories.length})`,
      slot: group,
      categories,
      defaultOpen: isDefaultOpen,
      completed: selectedCount === categories.length,
    };
  });
});

const getCategoryItems = (categories: string[]) => {
  return categories.map((category) => {
    const selected = bike.state.components[category];
    return {
      label: selected
        ? `${category}: ${selected.brand} ${selected.model}`
        : category,
      slot: category,
      defaultOpen: false,
    };
  });
};

const saveBike = async (name: string) => {
  try {
    await bike.save(name);
    const toast = useToast();
    toast.add({
      title: "Sucesso",
      description: "Bike salva com sucesso!",
      color: "green",
    });
    await refreshBikes();
  } catch (e) {
    console.error(e);
    const toast = useToast();
    toast.add({
      title: "Erro",
      description: "Erro ao salvar bike.",
      color: "red",
    });
  }
};

const shareBike = async (name: string) => {
  try {
    const shareUrl = await bike.share(name);
    const toast = useToast();
    toast.add({
      title: "Link copiado",
      description: `Link de compartilhamento: ${shareUrl}`,
      color: "green",
    });
    await refreshBikes();
  } catch (e) {
    console.error(e);
    const toast = useToast();
    toast.add({
      title: "Erro",
      description: "Erro ao gerar link de compartilhamento.",
      color: "red",
    });
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
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-b-8 border-black pb-8"
    >
      <div>
        <h1 class="text-7xl mb-2">{{ i18n.pages.builder.title }}</h1>
        <p class="font-body text-xl opacity-60">
          Architect your performance machine with pinpoint accuracy.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-6 no-print">
        <div class="flex items-center gap-4">
          <button
            class="h-14 w-14 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            @click="printPage"
            title="Print Specification"
          >
            <UIcon name="i-heroicons-printer" class="text-2xl" />
          </button>
          <button
            class="h-14 px-6 border-4 border-black font-display font-black uppercase hover:bg-black hover:text-white transition-colors"
            @click="isOpen = true"
          >
            Saved Builds
          </button>
        </div>

        <div
          class="bg-black text-white p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]"
        >
          <p
            class="text-xs font-display font-black uppercase tracking-widest opacity-60 mb-1"
          >
            Estimated Total
          </p>
          <div class="flex items-baseline gap-3">
            <span
              v-if="bike.totalWeight > 0"
              class="text-lg font-display font-black text-primary"
            >
              {{ bike.totalWeight }}KG
            </span>
            <span class="text-4xl font-display font-black">
              {{ formatCurrency(totalPriceValue) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Compatibility Alerts -->
    <div
      v-if="issuesList.length > 0"
      class="mb-12 p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      :class="
        hasCompatibilityError
          ? 'bg-primary text-white'
          : 'bg-yellow-400 text-black'
      "
    >
      <div class="flex items-center gap-4 mb-6">
        <UIcon
          :name="
            hasCompatibilityError
              ? 'i-heroicons-exclamation-circle'
              : 'i-heroicons-exclamation-triangle'
          "
          class="text-5xl"
        />
        <h2 class="text-4xl m-0 leading-none">System Alerts</h2>
      </div>
      <ul class="space-y-3">
        <li
          v-for="issue in issuesList"
          :key="issue.ruleId + issue.message"
          class="flex items-start gap-3"
        >
          <span class="font-black text-xl">/</span>
          <span
            class="font-display font-bold text-xl uppercase tracking-tight"
            >{{ issue.message }}</span
          >
        </li>
      </ul>
    </div>

    <div
      v-if="!hierarchy"
      class="flex flex-col items-center justify-center py-32 border-4 border-black border-dashed"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="animate-spin text-6xl text-black mb-6"
      />
      <p class="text-2xl font-display font-black uppercase">
        Initializing Ecosystem...
      </p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Component Selection -->
      <div class="lg:col-span-2 space-y-8 no-print">
        <div
          v-for="group in groupItems"
          :key="group.slot"
          class="brutalist-card"
        >
          <div
            class="bg-black text-white p-4 flex items-center justify-between"
          >
            <h2 class="text-2xl m-0 leading-none">{{ group.label }}</h2>
            <UIcon
              v-if="group.completed"
              name="i-heroicons-check-circle"
              class="w-8 h-8 text-primary"
            />
          </div>

          <div class="p-6 space-y-6 bg-white">
            <div
              v-for="category in group.categories"
              :key="category"
              class="space-y-2"
            >
              <label
                class="block text-xs font-display font-black uppercase tracking-widest text-black/40"
              >
                {{ category }}
              </label>

              <USelectMenu
                v-model="bike.state.components[category]"
                :options="componentsMap[category] || []"
                placeholder="Select Component..."
                searchable
                option-attribute="model"
                by="id"
                :ui="{
                  base: 'rounded-none border-4 border-black focus:ring-0 focus:border-black font-body text-lg py-3',
                  placeholder: 'text-black/30',
                }"
                @update:model-value="(val) => bike.selectComponent(val)"
              >
                <template #label>
                  <span
                    v-if="bike.state.components[category]"
                    class="font-display font-bold uppercase truncate"
                  >
                    {{ bike.state.components[category].brand }}
                    {{ bike.state.components[category].model }}
                  </span>
                  <span v-else class="opacity-30">NOT SELECTED</span>
                </template>

                <template #option="{ option }">
                  <div
                    class="flex justify-between w-full gap-4 py-2"
                    :class="{
                      'opacity-40': !bike.checkCompatibility(option).compatible,
                    }"
                  >
                    <div class="flex flex-col">
                      <span class="font-display font-bold uppercase"
                        >{{ option.brand }} {{ option.model }}</span
                      >
                      <div class="flex gap-2 mt-1">
                        <span
                          v-if="option.speeds"
                          class="text-[10px] bg-black text-white px-1"
                          >{{ option.speeds }} SPD</span
                        >
                        <span
                          v-if="option.axleType"
                          class="text-[10px] bg-black text-white px-1"
                          >{{ option.axleType }}</span
                        >
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="font-display font-black text-primary">{{
                        formatCurrency(option.price)
                      }}</span>
                      <p
                        v-if="!bike.checkCompatibility(option).compatible"
                        class="text-[10px] text-primary font-black uppercase mt-1"
                      >
                        {{ bike.checkCompatibility(option).reason }}
                      </p>
                    </div>
                  </div>
                </template>
              </USelectMenu>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Sidebar -->
      <div class="lg:col-span-1">
        <div class="brutalist-card sticky top-32">
          <div class="bg-black text-white p-4">
            <h2 class="text-2xl m-0 leading-none">BUILD SPEC</h2>
          </div>

          <div class="p-6">
            <div
              v-if="Object.keys(bike.state.components).length === 0"
              class="py-12"
            >
              <EmptyState
                icon="i-heroicons-wrench"
                title="READY TO START"
                description="Begin by selecting components to architect your machine."
              />
            </div>

            <ul v-else class="space-y-4">
              <li
                v-for="(comp, cat) in bike.state.components"
                :key="cat"
                class="flex flex-col border-b-2 border-black/10 pb-4 last:border-0"
              >
                <div class="flex justify-between items-start mb-1">
                  <span
                    class="text-[10px] font-display font-black uppercase text-black/40"
                    >{{ cat }}</span
                  >
                  <button
                    class="text-primary hover:bg-primary hover:text-white transition-colors p-1"
                    @click="bike.removeComponent(cat)"
                  >
                    <UIcon name="i-heroicons-trash" class="text-lg" />
                  </button>
                </div>
                <div class="flex justify-between items-end">
                  <p
                    class="font-display font-bold uppercase text-lg leading-none truncate pr-4"
                  >
                    {{ comp.brand }} {{ comp.model }}
                  </p>
                  <p class="font-display font-black text-primary flex-shrink-0">
                    {{ formatCurrency(comp.price) }}
                  </p>
                </div>
                <p v-if="comp.weight" class="text-xs font-body opacity-50 mt-1">
                  Weight: {{ comp.weight }}kg
                </p>
              </li>
            </ul>
          </div>

          <div class="p-6 bg-gray-50 border-t-4 border-black no-print">
            <div class="flex justify-between items-center mb-6">
              <span class="font-display font-black uppercase"
                >Total Weight</span
              >
              <span class="text-2xl font-display font-black"
                >{{ bike.totalWeight || "0" }}KG</span
              >
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <button
                class="brutalist-button py-4 disabled:grayscale disabled:opacity-50"
                :disabled="Object.keys(bike.state.components).length === 0"
                @click="isSaveBikeModalOpen = true"
              >
                SAVE
              </button>
              <button
                class="border-4 border-black font-display font-black uppercase hover:bg-black hover:text-white transition-colors py-4"
                @click="bike.clear"
              >
                CLEAR
              </button>
            </div>

            <button
              class="w-full border-4 border-black font-display font-black uppercase hover:bg-black hover:text-white transition-colors py-4 mb-4 flex items-center justify-center gap-2"
              :disabled="Object.keys(bike.state.components).length === 0"
              @click="isShareBikeModalOpen = true"
            >
              <UIcon name="i-heroicons-share" class="text-xl" />
              SHARE BUILD
            </button>

            <button
              class="w-full bg-primary text-white border-4 border-black font-display font-black uppercase hover:translate-x-1 hover:-translate-y-1 transition-transform py-4 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              @click="isCompareOpen = true"
            >
              <UIcon name="i-heroicons-arrows-right-left" class="text-xl" />
              COMPARE TECH
            </button>
          </div>
        </div>
      </div>
    </div>

    <UModal v-model="isOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white font-display"
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
              <p class="text-xs text-gray-600">
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
        <div v-else class="text-center py-4 text-gray-600">
          Nenhuma montagem salva encontrada.
        </div>
      </UCard>
    </UModal>

    <UModal v-model="isCompareOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white font-display"
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
              <p class="text-xs text-gray-600">
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
        <div v-else class="text-center py-4 text-gray-600">
          Nenhum template comercial encontrado.
        </div>
      </UCard>
    </UModal>

    <!-- Bikes Management Modals -->
    <SaveBikeModal
      v-model="isSaveBikeModalOpen"
      title="Dê um nome para sua bike"
      placeholder="ex: Minha Bike Custom"
      :default-value="bike.state.name"
      @confirm="saveBike"
    />
    <ShareBikeModal
      v-model="isShareBikeModalOpen"
      :default-value="bike.state.name"
      @confirm="shareBike"
    />
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
