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

// Search logic without blocking top-level await
const {
  data: searchResults,
  pending: searchPending,
  refresh,
} = useFetch("/api/search", {
  query: { q: searchQuery },
  immediate: false,
  watch: false,
  server: false,
  lazy: true,
});

watch(searchQuery, (val) => {
  const query = val?.trim();
  if (query) {
    refresh();
  } else {
    searchResults.value = [];
  }
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

const navLinks = [
  {
    label: "Simulator",
    icon: "i-heroicons-wrench-screwdriver",
    to: "/builder",
  },
  {
    label: "Catalog",
    icon: "i-heroicons-cpu-chip",
    to: "/components",
  },
  {
    label: "Pricing",
    icon: "i-heroicons-currency-dollar",
    to: "/pricing",
  },
  {
    label: "Brands",
    icon: "i-heroicons-tag",
    to: "/brands",
  },
];

const mobileNavLinks = [
  {
    icon: "i-heroicons-wrench-screwdriver",
    to: "/builder",
  },
  {
    icon: "i-heroicons-cpu-chip",
    to: "/components",
  },
  {
    icon: "i-heroicons-currency-dollar",
    to: "/pricing",
  },
];
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 font-body text-black">
    <header class="brutalist-header sticky top-0 z-50 no-print">
      <UContainer class="flex items-center justify-between h-20">
        <div class="flex items-center gap-8">
          <NuxtLink
            to="/"
            class="text-3xl font-display font-black tracking-tighter flex items-center gap-2 group"
          >
            <UIcon name="i-heroicons-bolt" class="text-primary scale-125" />
            <span class="inline">BICICLETA</span>
          </NuxtLink>

          <nav class="hidden lg:flex items-center gap-2">
            <template v-for="link in navLinks" :key="link.to">
              <NuxtLink :to="link.to" class="nav-link">
                {{ link.label }}
              </NuxtLink>
            </template>
          </nav>
        </div>

        <div class="flex items-center gap-4">
          <UButton
            icon="i-heroicons-magnifying-glass"
            color="white"
            variant="ghost"
            class="hidden sm:flex border-2 border-black rounded-none hover:bg-black hover:text-white transition-colors"
            @click="isSearchOpen = true"
          />

          <div
            class="hidden sm:flex items-center gap-1 bg-gray-100 p-1 border-2 border-black"
          >
            <UKbd value="meta" />
            <UKbd value="K" />
          </div>

          <div class="h-8 w-1 bg-black mx-2" />

          <UButton
            v-if="!loggedIn"
            icon="i-simple-icons-github"
            color="black"
            variant="solid"
            size="md"
            label="JOIN"
            class="font-display font-bold rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
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
        </div>
      </UContainer>
    </header>

    <OfflineBanner />

    <main class="pb-20 lg:pb-0">
      <NuxtPage />
    </main>

    <UNotifications />

    <!-- Mobile Bottom Navigation -->
    <nav
      class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black z-50 flex justify-around items-center h-20 no-print"
    >
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="flex flex-col items-center justify-center w-full h-full border-r-2 last:border-r-0 border-black transition-colors"
        active-class="bg-black text-white"
      >
        <UIcon :name="link.icon" class="text-2xl" />
        <span class="text-[10px] font-display font-black uppercase mt-1">{{
          link.label
        }}</span>
      </NuxtLink>
    </nav>

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
