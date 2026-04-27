<script setup lang="ts">
import { computed } from "vue";
import {
  themes,
  getThemeById,
  type ThemeId,
} from "~/assets/themes/themes.config";
import { useTheme } from "~/composables/useTheme";

const { currentTheme, setTheme } = useTheme();

const selectedTheme = computed({
  get: () => currentTheme.value,
  set: (id: ThemeId) => setTheme(id),
});

const activeThemeMetadata = computed(() => {
  return getThemeById(selectedTheme.value);
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-display font-bold mb-2">Theme Selector</h2>
      <p class="text-gray-600 dark:text-gray-400">
        Choose a design direction for the interface. Your selection is saved
        locally.
      </p>
    </div>

    <!-- Theme Tabs -->
    <div
      class="flex flex-wrap gap-2 pb-4 border-b border-gray-200 dark:border-gray-700"
    >
      <button
        v-for="theme in themes"
        :key="theme.id"
        @click="selectedTheme = theme.id"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all duration-200',
          selectedTheme === theme.id
            ? 'bg-primary text-white shadow-md'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700',
        ]"
      >
        {{ theme.name }}
      </button>
    </div>

    <!-- Active Theme Info -->
    <div
      v-if="activeThemeMetadata"
      class="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6"
    >
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="text-xl font-display font-bold text-primary mb-2">
            {{ activeThemeMetadata.name }}
          </h3>
          <p class="text-gray-700 dark:text-gray-300 mb-3">
            {{ activeThemeMetadata.description }}
          </p>
          <div class="text-sm">
            <p class="text-gray-600 dark:text-gray-400">
              <strong>Target Audience:</strong>
              {{ activeThemeMetadata.audience }}
            </p>
          </div>
        </div>

        <!-- Color Palette Preview -->
        <div class="flex gap-2 flex-shrink-0">
          <div
            v-for="(color, idx) in activeThemeMetadata.colors"
            :key="idx"
            :style="{ backgroundColor: color }"
            :title="color"
            class="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm cursor-help hover:scale-110 transition-transform"
          />
        </div>
      </div>

      <!-- Theme Effects Preview -->
      <div
        class="text-xs text-gray-600 dark:text-gray-400 mt-4 pt-4 border-t border-primary/10"
      >
        <p class="mb-2 font-semibold">Live Preview:</p>
        <div class="grid grid-cols-3 gap-2">
          <div
            class="px-3 py-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center font-medium"
          >
            Card
          </div>
          <button
            class="px-3 py-2 rounded bg-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            Button
          </button>
          <div
            class="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-center text-gray-600 dark:text-gray-300"
          >
            Text
          </div>
        </div>
      </div>
    </div>

    <!-- Theme Description -->
    <div
      class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800"
    >
      <p class="font-semibold mb-2">ℹ️ About Themes</p>
      <ul class="space-y-1 list-disc list-inside">
        <li>
          <strong>Daniel Builds</strong>: Primary brand identity with warm tones
          and editorial feel
        </li>
        <li>
          <strong>Sport-Tech</strong>: Dark premium aesthetic with cyan accents,
          tech-forward
        </li>
        <li>
          <strong>Brutalist</strong>: Minimal black & white with red accents,
          anti-design
        </li>
        <li>
          <strong>Editorial</strong>: Magazine-style with brown tones,
          professional
        </li>
        <li>
          <strong>Retro-Futurism</strong>: Neon cyan & magenta, 90s cyberpunk
          aesthetic
        </li>
        <li>
          <strong>Organic</strong>: Green gradients with rounded edges,
          sustainable feel
        </li>
      </ul>
      <p class="mt-3 text-xs text-gray-500">
        Theme selection is stored in your browser's local storage and persists
        across sessions.
      </p>
    </div>
  </div>
</template>
