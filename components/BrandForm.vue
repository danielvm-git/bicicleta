<script setup lang="ts">
interface Brand {
  id?: string;
  name?: string;
  url?: string;
  logoFilename?: string;
}

interface Props {
  brand?: Brand;
  loading?: boolean;
  isNew?: boolean;
}

interface Emits {
  (e: "submit", formData: Brand): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  isNew: false,
  loading: false,
});

const emit = defineEmits<Emits>();

const formData = reactive({
  name: props.brand?.name || "",
  url: props.brand?.url || "",
  id: props.brand?.id || "",
});

const errors = reactive<Record<string, string>>({});

const generateId = () => {
  if (formData.name) {
    formData.id = formData.name.toLowerCase().trim().replace(/\s+/g, "");
  }
};

watch(() => formData.name, generateId, { immediate: !props.brand?.id });

const validate = (): boolean => {
  errors.name = "";
  errors.url = "";
  errors.id = "";

  if (!formData.name?.trim()) {
    errors.name = "Brand name is required";
  }

  if (!formData.url?.trim()) {
    errors.url = "Website URL is required";
  } else {
    try {
      new URL(formData.url);
    } catch {
      errors.url = "Invalid URL format";
    }
  }

  if (!formData.id?.trim()) {
    errors.id = "Brand ID is required";
  }

  return Object.values(errors).every((e) => !e);
};

const handleSubmit = () => {
  if (validate()) {
    emit("submit", formData);
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Brand Name -->
    <UFormGroup label="Brand Name" :error="errors.name" required>
      <UInput
        v-model="formData.name"
        placeholder="e.g., Shimano"
        :disabled="loading"
        @blur="generateId"
      />
    </UFormGroup>

    <!-- Brand ID -->
    <UFormGroup
      label="Brand ID"
      hint="Auto-generated from name, but you can customize it"
      :error="errors.id"
      required
    >
      <UInput
        v-model="formData.id"
        placeholder="e.g., shimano"
        :disabled="loading"
      />
    </UFormGroup>

    <!-- Website URL -->
    <UFormGroup label="Website URL" :error="errors.url" required>
      <UInput
        v-model="formData.url"
        type="url"
        placeholder="e.g., https://www.shimano.com"
        :disabled="loading"
      />
    </UFormGroup>

    <!-- Form Actions -->
    <div class="flex gap-2 pt-4">
      <UButton type="submit" :loading="loading">
        {{ isNew ? "Create Brand" : "Update Brand" }}
      </UButton>
      <UButton
        color="gray"
        variant="ghost"
        @click="$emit('cancel')"
        :disabled="loading"
      >
        Cancel
      </UButton>
    </div>
  </form>
</template>
