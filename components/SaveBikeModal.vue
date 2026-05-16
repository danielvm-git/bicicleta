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
  <UModal
    :model-value="modelValue"
    @update:model-value="handleClose"
    :ui="{
      wrapper: 'z-[100]',
      container: 'flex items-center justify-center p-4',
      width: 'w-full max-w-lg',
      base: 'relative overflow-visible',
    }"
  >
    <div class="brutalist-card bg-white p-8 relative">
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-3xl font-display font-black uppercase tracking-tighter">
          {{ displayTitle }}
        </h3>
        <button
          class="h-10 w-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
          @click="handleClose"
        >
          <UIcon name="i-heroicons-x-mark-20-solid" class="text-xl" />
        </button>
      </div>

      <div class="space-y-6">
        <div class="relative">
          <UInput
            v-model="inputValue"
            :placeholder="displayPlaceholder"
            @keydown.enter="handleConfirm"
            autofocus
            size="xl"
            :ui="{
              base: 'rounded-none border-4 border-black focus:ring-0 focus:border-black font-body text-lg py-4',
              placeholder: 'text-black/30',
            }"
          />
        </div>

        <div class="flex justify-end gap-4 pt-4">
          <button
            class="px-6 py-3 font-display font-bold uppercase border-2 border-black hover:bg-gray-100 transition-colors"
            @click="handleClose"
          >
            {{ i18n.modals.saveBike.cancel }}
          </button>
          <button
            class="brutalist-button px-8 py-3 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            @click="handleConfirm"
            :disabled="!inputValue.trim()"
          >
            {{ i18n.modals.saveBike.confirm }}
          </button>
        </div>
      </div>
    </div>
  </UModal>
</template>
