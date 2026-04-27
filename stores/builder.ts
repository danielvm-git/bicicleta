import { defineStore } from "pinia";
import { computed, watch, ref } from "vue";
import type { BikeComponent } from "../types/bike";
import { sumComponentPrices } from "~/utils/bikePrice";
import {
  validateBike,
  issueRelevantForBuilderPreview,
} from "~/utils/compatibility";

export interface BuilderState {
  name: string;
  description: string;
  components: Record<string, BikeComponent>;
}

export const useBuilderStore = defineStore("builder", () => {
  const name = ref("Nova Bike");
  const description = ref("");
  const components = ref<Record<string, BikeComponent>>({});

  // Load from localStorage if available
  if (import.meta.client) {
    const saved = localStorage.getItem("builder-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        name.value = parsed.name || "Nova Bike";
        description.value = parsed.description || "";
        components.value = parsed.components || {};
      } catch (e) {
        console.error("Failed to load builder state from localStorage", e);
      }
    }

    // Persist to localStorage on changes
    watch(
      [name, description, components],
      () => {
        localStorage.setItem(
          "builder-state",
          JSON.stringify({
            name: name.value,
            description: description.value,
            components: components.value,
          })
        );
      },
      { deep: true }
    );
  }

  const totalPrice = computed(() =>
    sumComponentPrices(Object.values(components.value))
  );

  const totalWeight = computed(() => {
    const total = Object.values(components.value).reduce((acc, component) => {
      const w = component.weight ? parseFloat(String(component.weight)) : 0;
      return acc + (!Number.isFinite(w) || w < 0 ? 0 : w);
    }, 0);
    return Math.round(total * 1000) / 1000;
  });

  const issues = computed(() => validateBike(Object.values(components.value)));

  function selectComponent(component: BikeComponent) {
    components.value[component.category] = component;
  }

  function removeComponent(category: string) {
    delete components.value[category];
  }

  function clear() {
    components.value = {};
    name.value = "Nova Bike";
    description.value = "";
  }

  function checkCompatibility(component: BikeComponent) {
    const tempComponents = {
      ...components.value,
      [component.category]: component,
    };
    const tempIssues = validateBike(Object.values(tempComponents));
    const relevantIssues = tempIssues.filter((i) =>
      issueRelevantForBuilderPreview(i, component)
    );

    if (relevantIssues.length > 0) {
      return { compatible: false, reason: relevantIssues[0].message };
    }
    return { compatible: true };
  }

  /**
   * Selects a complete mechanical group.
   * Resolves component names in the group to actual catalog components.
   */
  async function selectGroup(group: any) {
    // Mapping of group fields to component categories
    // These must match the normalized categories in the catalog
    const mapping: Record<string, string> = {
      frontShifter: "Trocador",
      rearShifter: "Trocador",
      frontDerailleur: "Câmbio Dianteiro",
      rearDerailleur: "Câmbio Traseiro",
      cassette: "Cassete",
      bottomBracket: "Movimento Central",
      chain: "Corrente",
      crankset: "Pedivela",
    };

    const promises = [];
    for (const [field, category] of Object.entries(mapping)) {
      const modelName = group[field];
      if (modelName) {
        // Fetch component by model and category
        // We use the search API to find the best match
        promises.push(
          $fetch<BikeComponent[]>("/api/components", {
            query: { search: modelName, category },
          })
            .then((results) => {
              // Find an exact model match or fallback to the first result
              const match =
                results.find(
                  (c) => c.model.toLowerCase() === modelName.toLowerCase()
                ) || results[0];
              if (match) {
                selectComponent(match);
              }
            })
            .catch((err) => {
              console.warn(
                `Failed to resolve component for group field ${field}: ${modelName}`,
                err
              );
            })
        );
      }
    }
    await Promise.all(promises);
  }

  async function save(customName?: string) {
    if (customName) name.value = customName;

    return await $fetch<{ id: number; slug: string }>("/api/bikes", {
      method: "POST",
      body: {
        name: name.value,
        description: description.value,
        componentIds: Object.values(components.value).map((c) => c.id),
        totalPrice: totalPrice.value,
      },
    });
  }

  async function share(customName?: string) {
    const result = await save(customName);
    const shareUrl = `${window.location.origin}/b/${result.slug}`;
    if (import.meta.client) {
      await navigator.clipboard.writeText(shareUrl);
    }
    return shareUrl;
  }

  return {
    name,
    description,
    components,
    totalPrice,
    totalWeight,
    issues,
    selectComponent,
    removeComponent,
    clear,
    checkCompatibility,
    selectGroup,
    save,
    share,
  };
});
