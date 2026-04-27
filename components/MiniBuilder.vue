<script setup lang="ts">
import { computed } from "vue";
import { useBuilderStore } from "~/stores/builder";

const builder = useBuilderStore();

const itemCount = computed(() => Object.keys(builder.components).length);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div
      v-if="itemCount > 0"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl"
    >
      <div
        class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 border border-gray-800 dark:border-gray-200"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white relative"
          >
            <UIcon name="i-heroicons-shopping-cart" class="w-6 h-6" />
            <span
              class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-900 dark:border-white"
            >
              {{ itemCount }}
            </span>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500">
              Sua Montagem
            </p>
            <p class="text-lg font-display font-black leading-tight">
              {{ formatPrice(builder.totalPrice) }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="builder.clear()"
          >
            Limpar
          </UButton>
          <UButton
            to="/builder"
            color="primary"
            variant="solid"
            size="lg"
            trailing-icon="i-heroicons-arrow-right"
            class="font-bold"
          >
            Ver Detalhes
          </UButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* .font-display is inherited from global brand.css */
</style>
