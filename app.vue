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
    label: "Simulador",
    icon: "i-heroicons-wrench-screwdriver",
    to: "/builder",
    class: "hidden sm:flex",
  },
  {
    label: "Peças",
    icon: "i-heroicons-cpu-chip",
    to: "/components",
    class: "hidden md:flex",
  },
  {
    label: "Marcas",
    icon: "i-heroicons-tag",
    to: "/brands",
    class: "hidden lg:flex",
  },
  {
    label: "Guia",
    icon: "i-heroicons-book-open",
    to: "/guide",
    class: "hidden lg:flex",
  },
  {
    label: "Galeria",
    icon: "i-heroicons-photo",
    to: "/gallery",
    class: "hidden xl:flex",
  },
];

const mobileNavLinks = [
  {
    icon: "i-heroicons-wrench-screwdriver",
    to: "/builder",
    class: "sm:hidden",
  },
  {
    icon: "i-heroicons-cpu-chip",
    to: "/components",
    class: "md:hidden hidden sm:flex",
  },
];
</script>

<template>
  <div class="min-h-screen bg-brand-bg dark:bg-gray-900 font-body">
    <header
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 no-print"
    >
      <UContainer class="flex items-center justify-between h-16">
        <div class="flex items-center gap-4 sm:gap-8">
          <NuxtLink
            to="/"
            class="text-xl font-display flex items-center gap-2 group"
          >
            <UIcon
              name="i-heroicons-bolt"
              class="text-primary group-hover:scale-110 transition-transform"
            />
            <span class="hidden sm:inline">Monta Bike</span>
          </NuxtLink>

          <nav class="flex items-center gap-1">
            <template v-for="link in navLinks" :key="link.to">
              <UButton
                :to="link.to"
                variant="ghost"
                color="gray"
                :icon="link.icon"
                :class="[link.class, 'font-display']"
              >
                {{ link.label }}
              </UButton>
            </template>

            <template v-for="link in mobileNavLinks" :key="'mobile-' + link.to">
              <UButton
                :to="link.to"
                variant="ghost"
                color="gray"
                :icon="link.icon"
                :class="link.class"
              />
            </template>

            <UButton
              to="/admin/components"
              variant="ghost"
              color="gray"
              icon="i-heroicons-cog-6-tooth"
              class="hidden 2xl:flex font-display"
            >
              Admin
            </UButton>
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
        </div>
      </UContainer>
    </header>

    <OfflineBanner />

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
