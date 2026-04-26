<script setup lang="ts">
const isSearchOpen = ref(false);
const searchQuery = ref("");

const { loggedIn, user, signOut, signInWithGitHub } = useNeonAuth();

const userMenuItems = [
  [
    {
      label: "Usuário",
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Meu Perfil",
      icon: "i-heroicons-user",
      to: "/profile",
    },
  ],
  [
    {
      label: "Sair",
      icon: "i-heroicons-log-out",
      click: () => {
        void signOut();
      },
    },
  ],
];

const {
  data: searchResults,
  pending: searchPending,
  refresh,
} = await useFetch("/api/search", {
  query: { q: searchQuery },
  immediate: false,
  watch: false,
  server: false,
});

watch(searchQuery, (val) => {
  if (val.length >= 2) refresh();
});

const groups = computed(() => [
  {
    key: "components",
    label: "Peças e Componentes",
    commands: (searchResults.value?.components || []).map((c: any) => ({
      id: c.id,
      label: `${c.brand} ${c.model}`,
      suffix: c.category,
      to: `/components?search=${c.model}`,
    })),
  },
  {
    key: "bikes",
    label: "Bikes da Comunidade",
    commands: (searchResults.value?.bikes || []).map((b: any) => ({
      id: b.id,
      label: b.name,
      to: `/b/${b.slug}`,
    })),
  },
]);

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isSearchOpen.value = !isSearchOpen.value;
    },
  },
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 no-print"
    >
      <UContainer class="flex items-center justify-between h-16">
        <div class="flex items-center gap-4 sm:gap-8">
          <NuxtLink to="/" class="text-xl font-display flex items-center gap-2">
            <UIcon name="i-heroicons-bolt" class="text-primary" />
            <span class="hidden sm:inline">Monta Bike</span>
          </NuxtLink>

          <nav class="flex items-center gap-0.5 sm:gap-1">
            <UButton
              to="/builder"
              variant="ghost"
              color="gray"
              icon="i-heroicons-wrench-screwdriver"
              class="hidden sm:flex font-display"
              >Simulador</UButton
            >
            <UButton
              to="/builder"
              variant="ghost"
              color="gray"
              icon="i-heroicons-wrench-screwdriver"
              class="sm:hidden"
            />

            <UButton
              to="/gallery"
              variant="ghost"
              color="gray"
              icon="i-heroicons-photo"
              class="hidden sm:flex font-display"
              >Galeria</UButton
            >
            <UButton
              to="/gallery"
              variant="ghost"
              color="gray"
              icon="i-heroicons-photo"
              class="sm:hidden"
            />

            <UButton
              to="/admin/components"
              variant="ghost"
              color="gray"
              icon="i-heroicons-cog-6-tooth"
              class="hidden sm:flex font-display"
              >Admin</UButton
            >
          </nav>
        </div>

        <div class="flex items-center gap-2">
          <UButton
            icon="i-heroicons-magnifying-glass"
            color="gray"
            variant="ghost"
            class="hidden sm:flex"
            @click="isSearchOpen = true"
          />
          <UKbd value="meta" class="hidden sm:inline-flex" />
          <UKbd value="K" class="hidden sm:inline-flex" />

          <div class="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

          <UButton
            v-if="!loggedIn"
            icon="i-simple-icons-github"
            color="black"
            variant="solid"
            size="sm"
            label="Entrar"
            @click="signInWithGitHub"
          />
          <UDropdown v-else :items="userMenuItems" :ui="{ width: 'w-48' }">
            <UAvatar
              :src="user?.image ?? undefined"
              :alt="user?.name ?? undefined"
              size="sm"
              class="cursor-pointer"
            />
            <template #account="{ item }">
              <div class="text-left">
                <p class="text-xs text-gray-500">Logado como</p>
                <p class="truncate font-medium text-gray-900 dark:text-white">
                  {{ user?.name }}
                </p>
              </div>
            </template>
          </UDropdown>

          <UButton
            icon="i-simple-icons-github"
            color="gray"
            variant="ghost"
            to="https://github.com"
            target="_blank"
            class="hidden sm:flex"
          />
        </div>
      </UContainer>
    </header>

    <main>
      <NuxtPage />
    </main>

    <UNotifications />

    <UModal v-model="isSearchOpen">
      <UCommandPalette
        v-model:query="searchQuery"
        :groups="groups"
        :loading="searchPending"
        placeholder="Buscar peças ou montagens..."
        @update:model-value="
          (item) => {
            if (item.to) navigateTo(item.to);
            isSearchOpen = false;
          }
        "
      />
    </UModal>
  </div>
</template>

<style>
.no-print {
  @media print {
    display: none !important;
  }
}
</style>
