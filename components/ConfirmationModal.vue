<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
  confirmText: "",
  cancelText: "",
  isDangerous: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
}>();

const i18n = useI18n();

const displayTitle = computed(
  () => props.title || i18n.modals.confirmation.title
);
const displayDescription = computed(
  () => props.description || i18n.modals.confirmation.description
);
const displayConfirmText = computed(
  () => props.confirmText || i18n.modals.confirmation.confirm
);
const displayCancelText = computed(
  () => props.cancelText || i18n.modals.confirmation.cancel
);

const handleConfirm = () => {
  emit("confirm");
  emit("update:modelValue", false);
};

const handleClose = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <UModal :model-value="modelValue" @update:model-value="handleClose">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">
            {{ displayTitle }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="handleClose"
          />
        </div>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ displayDescription }}
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="handleClose">
            {{ displayCancelText }}
          </UButton>
          <UButton
            :color="isDangerous ? 'red' : 'primary'"
            @click="handleConfirm"
          >
            {{ displayConfirmText }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
