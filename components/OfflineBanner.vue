<script setup lang="ts">
const { isOffline } = useOffline();
</script>

<template>
  <Transition
    enter-active-class="transform transition duration-300 ease-out"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transform transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="isOffline"
      class="bg-orange-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium sticky top-16 z-[45] no-print"
    >
      <UIcon
        name="i-heroicons-exclamation-circle"
        class="w-5 h-5 flex-shrink-0"
      />
      <span
        >Você está offline. As alterações serão sincronizadas quando você voltar
        a se conectar.</span
      >
    </div>
  </Transition>
</template>
