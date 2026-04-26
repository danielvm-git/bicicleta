<script setup lang="ts">
const { loggedIn, user } = useUserSession();

if (!loggedIn.value) {
  navigateTo("/");
}

const {
  data: bikes,
  refresh,
  pending,
} = await useFetch("/api/bikes", {
  query: { user: "true" },
});

const anonymousIds = ref<number[]>([]);

onMounted(() => {
  const ids = localStorage.getItem("anonymous-bike-ids");
  if (ids) {
    anonymousIds.value = JSON.parse(ids);
  }
});

const claimBikes = async () => {
  if (anonymousIds.value.length === 0) return;
  try {
    await $fetch("/api/auth/claim", {
      method: "POST",
      body: { ids: anonymousIds.value },
    });
    localStorage.removeItem("anonymous-bike-ids");
    anonymousIds.value = [];
    await refresh();
    alert("Suas montagens locais foram vinculadas com sucesso!");
  } catch (e) {
    console.error(e);
    alert("Erro ao vincular montagens.");
  }
};

const formatCurrency = (value: number | string) => {
  const val = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
};

const togglePublic = async (bike: any) => {
  try {
    await $fetch(`/api/bikes/${bike.slug}`, {
      method: "PATCH",
      body: { isPublic: !bike.isPublic },
    });
    await refresh();
  } catch (e) {
    console.error(e);
    alert("Erro ao atualizar privacidade.");
  }
};
</script>

<template>
  <UContainer class="py-8">
    <div v-if="loggedIn && user" class="flex items-center gap-4 mb-12">
      <UAvatar :src="user.avatar" size="xl" />
      <div>
        <h1 class="text-3xl font-display">Meu Perfil</h1>
        <p class="text-gray-500">
          @{{ user.name }} • GitHub ID: {{ user.githubId }}
        </p>
      </div>
    </div>

    <div class="mb-8 flex justify-between items-center">
      <h2 class="text-2xl font-display">Minhas Montagens</h2>
      <UButton to="/builder" icon="i-heroicons-plus" color="primary"
        >Nova Bike</UButton
      >
    </div>

    <UAlert
      v-if="anonymousIds.length > 0"
      title="Montagens locais encontradas"
      description="Você tem montagens salvas neste navegador antes de fazer login. Deseja vinculá-las à sua conta?"
      icon="i-heroicons-cloud-arrow-up"
      color="primary"
      variant="soft"
      class="mb-8"
    >
      <template #footer>
        <UButton size="xs" color="primary" @click="claimBikes"
          >Vincular Agora</UButton
        >
      </template>
    </UAlert>

    <div
      v-if="pending"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <USkeleton v-for="i in 3" :key="i" class="h-48 w-full" />
    </div>

    <div
      v-else-if="bikes && bikes.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <UCard v-for="bike in bikes" :key="bike.id">
        <template #header>
          <div class="flex justify-between items-start">
            <h3 class="font-bold truncate">{{ bike.name }}</h3>
            <UBadge :color="bike.isPublic ? 'green' : 'gray'" variant="soft">
              {{ bike.isPublic ? "Pública" : "Privada" }}
            </UBadge>
          </div>
        </template>

        <div>
          <p class="text-2xl font-bold text-primary">
            {{ formatCurrency(bike.totalPrice) }}
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Criada em: {{ new Date(bike.createdAt).toLocaleDateString() }}
          </p>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <UButton
              :to="`/b/${bike.slug}`"
              variant="soft"
              size="xs"
              icon="i-heroicons-eye"
              >Ver</UButton
            >
            <UButton
              variant="soft"
              color="gray"
              size="xs"
              icon="i-heroicons-globe-alt"
              @click="togglePublic(bike)"
            >
              {{ bike.isPublic ? "Privar" : "Publicar" }}
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <div
      v-else
      class="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg"
    >
      <UIcon name="i-heroicons-bicycle" class="text-6xl text-gray-400 mb-4" />
      <p class="text-gray-500">Você ainda não salvou nenhuma montagem.</p>
      <UButton to="/builder" class="mt-4" variant="soft">Começar Agora</UButton>
    </div>
  </UContainer>
</template>
