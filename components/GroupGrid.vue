<script setup lang="ts">
import { useBuilderStore } from "~/stores/builder";

const props = defineProps<{
  groups: any[];
  loading?: boolean;
}>();

const builder = useBuilderStore();
const toast = useToast();

const selectGroup = async (group: any) => {
  try {
    await builder.selectGroup(group);
    toast.add({
      title: "Grupo Selecionado",
      description: `${group.brand} ${group.line} adicionado ao projeto.`,
      color: "primary",
    });
  } catch (error) {
    toast.add({
      title: "Erro ao selecionar grupo",
      description: "Não foi possível carregar todos os componentes do grupo.",
      color: "red",
    });
  }
};
</script>

<template>
  <div class="w-full">
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl border border-gray-200 dark:border-gray-700"
      ></div>
    </div>

    <div
      v-else-if="!groups || groups.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl"
    >
      <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-300 mb-4" />
      <h3
        class="font-display text-lg font-bold text-gray-700 dark:text-gray-300"
      >
        Nenhum grupo encontrado
      </h3>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="group in groups"
        :key="group.id"
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
      >
        <div class="p-5 flex-grow">
          <div class="flex justify-between items-start mb-4">
            <div>
              <span
                class="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary mb-2"
              >
                {{ group.brand }}
              </span>
              <h3
                class="text-xl font-display font-bold text-gray-900 dark:text-white"
              >
                {{ group.line }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ group.configuration }}
              </p>
            </div>
          </div>

          <div class="space-y-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
            <div v-if="group.rearDerailleur" class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-4 h-4 text-green-500"
              />
              <span>Câmbio: {{ group.rearDerailleur }}</span>
            </div>
            <div v-if="group.cassette" class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-4 h-4 text-green-500"
              />
              <span>Cassete: {{ group.cassette }}</span>
            </div>
            <div v-if="group.crankset" class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-4 h-4 text-green-500"
              />
              <span>Pedivela: {{ group.crankset }}</span>
            </div>
          </div>
        </div>

        <div
          class="p-4 border-t border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
        >
          <UButton
            block
            color="primary"
            variant="solid"
            @click="selectGroup(group)"
          >
            Selecionar Grupo
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-display {
  font-family: "Bricolage Grotesque", sans-serif;
}
</style>
