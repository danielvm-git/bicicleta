<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Admin - Brand Management | Monta Bike",
});

interface Brand {
  id: string;
  name: string;
  url: string;
  logoFilename?: string;
  componentCount?: number;
}

const {
  data: brands,
  pending: loading,
  refresh,
} = await useFetch("/api/admin/brands");

const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isLogoModalOpen = ref(false);

const selectedBrand = ref<Brand | null>(null);
const submitLoading = ref(false);

// Create brand
const handleCreateSubmit = async (formData: Brand) => {
  submitLoading.value = true;
  try {
    const response = await $fetch<Brand>("/api/admin/brands", {
      method: "POST",
      body: formData,
    });

    brands.value?.push(response);
    isCreateModalOpen.value = false;

    useNotification().add({
      title: "Success",
      description: `Brand "${response.name}" created successfully`,
      color: "green",
    });

    await refresh();
  } catch (error: any) {
    useNotification().add({
      title: "Error",
      description:
        error.data?.message || error.message || "Failed to create brand",
      color: "red",
    });
  } finally {
    submitLoading.value = false;
  }
};

// Edit brand
const handleEditClick = (brand: Brand) => {
  selectedBrand.value = brand;
  isEditModalOpen.value = true;
};

const handleEditSubmit = async (formData: Brand) => {
  if (!selectedBrand.value) return;

  submitLoading.value = true;
  try {
    const response = await $fetch<Brand>(
      `/api/admin/brands/${selectedBrand.value.id}`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    // Update in list
    const index = brands.value?.findIndex((b) => b.id === response.id) ?? -1;
    if (index !== -1 && brands.value) {
      brands.value[index] = response;
    }

    isEditModalOpen.value = false;
    selectedBrand.value = null;

    useNotification().add({
      title: "Success",
      description: `Brand "${response.name}" updated successfully`,
      color: "green",
    });
  } catch (error: any) {
    useNotification().add({
      title: "Error",
      description:
        error.data?.message || error.message || "Failed to update brand",
      color: "red",
    });
  } finally {
    submitLoading.value = false;
  }
};

// Delete brand
const handleDeleteClick = (brand: Brand) => {
  selectedBrand.value = brand;
  isDeleteModalOpen.value = true;
};

const handleDeleteConfirm = async () => {
  if (!selectedBrand.value) return;

  submitLoading.value = true;
  try {
    await $fetch(`/api/admin/brands/${selectedBrand.value.id}`, {
      method: "DELETE",
    });

    brands.value = brands.value?.filter(
      (b) => b.id !== selectedBrand.value?.id
    );
    isDeleteModalOpen.value = false;
    selectedBrand.value = null;

    useNotification().add({
      title: "Success",
      description: "Brand deleted successfully",
      color: "green",
    });
  } catch (error: any) {
    useNotification().add({
      title: "Error",
      description:
        error.data?.message || error.message || "Failed to delete brand",
      color: "red",
    });
  } finally {
    submitLoading.value = false;
  }
};

// Logo upload
const handleLogoClick = (brand: Brand) => {
  selectedBrand.value = brand;
  isLogoModalOpen.value = true;
};

const handleLogoUpload = async (file: File) => {
  if (!selectedBrand.value) return;

  submitLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("logo", file);

    const response = await $fetch<Brand>(
      `/api/admin/brands/${selectedBrand.value.id}/logo`,
      {
        method: "POST",
        body: formData,
      }
    );

    // Update in list
    const index = brands.value?.findIndex((b) => b.id === response.id) ?? -1;
    if (index !== -1 && brands.value) {
      brands.value[index] = response;
    }

    isLogoModalOpen.value = false;
    selectedBrand.value = null;

    useNotification().add({
      title: "Success",
      description: "Logo uploaded successfully",
      color: "green",
    });
  } catch (error: any) {
    useNotification().add({
      title: "Error",
      description:
        error.data?.message || error.message || "Failed to upload logo",
      color: "red",
    });
  } finally {
    submitLoading.value = false;
  }
};
</script>

<template>
  <UContainer class="py-12">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4"
    >
      <div>
        <h1 class="text-5xl font-display text-primary mb-2">
          Brand Management
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Manage brand information, logos, and metadata
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        size="lg"
        @click="isCreateModalOpen = true"
      >
        Add Brand
      </UButton>
    </div>

    <!-- Brands Table -->
    <AdminBrandTable
      :brands="brands || []"
      :loading="loading"
      @edit="handleEditClick"
      @delete="handleDeleteClick"
      @logo="handleLogoClick"
    />

    <!-- Create Modal -->
    <UModal v-model="isCreateModalOpen" title="Create New Brand">
      <div class="p-6">
        <BrandForm
          :loading="submitLoading"
          is-new
          @submit="handleCreateSubmit"
          @cancel="isCreateModalOpen = false"
        />
      </div>
    </UModal>

    <!-- Edit Modal -->
    <UModal
      v-model="isEditModalOpen"
      :title="`Edit Brand: ${selectedBrand?.name}`"
    >
      <div class="p-6">
        <BrandForm
          v-if="selectedBrand"
          :brand="selectedBrand"
          :loading="submitLoading"
          @submit="handleEditSubmit"
          @cancel="isEditModalOpen = false"
        />
      </div>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="isDeleteModalOpen" title="Delete Brand">
      <div class="p-6 space-y-4">
        <div
          class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/50"
        >
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete
            <strong>{{ selectedBrand?.name }}</strong
            >?
          </p>
          <p
            v-if="
              selectedBrand?.componentCount && selectedBrand.componentCount > 0
            "
            class="text-sm text-red-600 dark:text-red-400 mt-2"
          >
            ⚠️ This brand is used by
            {{ selectedBrand.componentCount }} component(s). They will no longer
            reference a valid brand.
          </p>
        </div>
        <div class="flex gap-2">
          <UButton
            color="red"
            @click="handleDeleteConfirm"
            :loading="submitLoading"
          >
            Delete
          </UButton>
          <UButton
            color="gray"
            variant="ghost"
            @click="isDeleteModalOpen = false"
            :disabled="submitLoading"
          >
            Cancel
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- Logo Upload Modal -->
    <UModal
      v-model="isLogoModalOpen"
      :title="`Upload Logo: ${selectedBrand?.name}`"
    >
      <div class="p-6 space-y-4">
        <div
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/svg+xml,image/png,image/jpeg,image/webp"
            @change="
              (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleLogoUpload(file);
              }
            "
            class="hidden"
          />
          <UButton
            @click="() => $refs.fileInput?.click()"
            :loading="submitLoading"
            icon="i-heroicons-arrow-up-tray"
          >
            Choose Logo File
          </UButton>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            SVG, PNG, JPEG, WebP • Max 1MB
          </p>
        </div>
        <UButton
          color="gray"
          variant="ghost"
          @click="isLogoModalOpen = false"
          block
        >
          Cancel
        </UButton>
      </div>
    </UModal>
  </UContainer>
</template>
