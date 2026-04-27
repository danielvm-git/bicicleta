<script setup lang="ts">
interface Brand {
  id: string;
  name: string;
  url: string;
  logoFilename?: string;
  componentCount?: number;
}

interface Props {
  brands: Brand[];
  loading?: boolean;
}

interface Emits {
  (e: "edit", brand: Brand): void;
  (e: "delete", brand: Brand): void;
  (e: "logo", brand: Brand): void;
}

defineProps<Props>();
defineEmits<Emits>();

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "url", label: "Website", sortable: false },
  { key: "logoFilename", label: "Logo", sortable: false },
  { key: "componentCount", label: "Components", sortable: true },
  { key: "actions", label: "Actions" },
];
</script>

<template>
  <div class="space-y-4">
    <UTable
      :rows="brands"
      :columns="columns"
      :loading="loading"
      :ui="{
        th: { base: 'text-left' },
        td: { base: 'align-middle' },
      }"
    >
      <template #url-data="{ row }">
        <a
          :href="row.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary hover:underline truncate max-w-xs"
        >
          {{ row.url }}
          <UIcon
            name="i-heroicons-arrow-up-right"
            class="inline ml-1 w-3 h-3"
          />
        </a>
      </template>

      <template #logoFilename-data="{ row }">
        <div class="flex items-center gap-2">
          <div v-if="row.logoFilename" class="w-6 h-6 bg-gray-100 rounded">
            <img
              :src="`/brands/${row.logoFilename}`"
              :alt="`${row.name} logo`"
              class="w-full h-full object-contain"
              @error="(e) => (e.target.style.display = 'none')"
            />
          </div>
          <span v-else class="text-gray-400 text-sm">—</span>
        </div>
      </template>

      <template #componentCount-data="{ row }">
        <UBadge
          :color="row.componentCount > 0 ? 'blue' : 'gray'"
          variant="subtle"
        >
          {{ row.componentCount || 0 }}
        </UBadge>
      </template>

      <template #actions-data="{ row }">
        <div class="flex gap-2">
          <UButton
            color="gray"
            variant="ghost"
            size="xs"
            icon="i-heroicons-pencil"
            @click="$emit('edit', row)"
          />
          <UButton
            color="amber"
            variant="ghost"
            size="xs"
            icon="i-heroicons-photo"
            @click="$emit('logo', row)"
          />
          <UButton
            color="red"
            variant="ghost"
            size="xs"
            icon="i-heroicons-trash"
            @click="$emit('delete', row)"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>
