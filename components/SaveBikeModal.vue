<script setup lang="ts">
import { ref, watch, computed } from "vue";

interface Props {
  modelValue: boolean;
  title?: string;
  placeholder?: string;
  defaultValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  placeholder: "",
  defaultValue: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm", name: string): void;
}>();

const i18n = useI18n();
const inputValue = ref("");

const displayTitle = computed(() => props.title || i18n.modals.saveBike.title);
const displayPlaceholder = computed(
  () => props.placeholder || i18n.modals.saveBike.placeholder
);

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      inputValue.value = props.defaultValue;
    }
  }
);

const handleConfirm = () => {
  if (inputValue.value.trim()) {
    emit("confirm", inputValue.value.trim());
    emit("update:modelValue", false);
  }
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
        <UInput
          v-model="inputValue"
          :placeholder="displayPlaceholder"
          @keydown.enter="handleConfirm"
          autofocus
        />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="handleClose">
            {{ i18n.modals.saveBike.cancel }}
          </UButton>
          <UButton
            color="primary"
            @click="handleConfirm"
            :disabled="!inputValue.trim()"
          >
            {{ i18n.modals.saveBike.confirm }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
