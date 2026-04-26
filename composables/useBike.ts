import { computed } from "vue";
import type { BikeComponent } from "../types/bike";
import {
  issueRelevantForBuilderPreview,
  validateBike,
} from "~/utils/compatibility";
import { sumComponentPrices } from "~/utils/bikePrice";

export interface BikeState {
  name: string;
  description: string;
  components: Record<string, BikeComponent>;
}

// Global singleton for the builder
export const useBikeBuilder = () => {
  const state = useState<BikeState>("builder-selected-components", () => ({
    name: "Nova Bike",
    description: "",
    components: {},
  }));

  const safeNonNegative = (n: number) => (!Number.isFinite(n) || n < 0 ? 0 : n);

  // Leverage: Price aggregate shared with server POST /api/bikes (see utils/bikePrice)
  const totalPrice = computed(() =>
    sumComponentPrices(Object.values(state.value.components))
  );

  // Leverage: Weight calculation hidden behind a simple getter
  const totalWeight = computed(() => {
    const total = Object.values(state.value.components).reduce(
      (acc, component) => {
        const w = component.weight ? parseFloat(String(component.weight)) : 0;
        return acc + safeNonNegative(w);
      },
      0
    );
    return Math.round(total * 1000) / 1000;
  });

  // Locality: Compatibility check integrated into the model
  const issues = computed(() => {
    return validateBike(Object.values(state.value.components));
  });

  // Methods
  const selectComponent = (component: BikeComponent) => {
    state.value.components[component.category] = component;
  };

  const checkCompatibility = (component: BikeComponent) => {
    // Basic implementation: check if this component would cause issues if added
    const tempComponents = {
      ...state.value.components,
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
  };

  const removeComponent = (category: string) => {
    delete state.value.components[category];
  };

  const clear = () => {
    state.value.components = {};
    state.value.name = "Nova Bike";
    state.value.description = "";
  };

  // Locality: Persistence logic inside the module
  const save = async (customName?: string) => {
    if (customName) state.value.name = customName;

    return await $fetch<{ id: number; slug: string }>("/api/bikes", {
      method: "POST",
      body: {
        name: state.value.name,
        description: state.value.description,
        componentIds: Object.values(state.value.components).map((c) => c.id),
        totalPrice: totalPrice.value,
      },
    });
  };

  const share = async (customName?: string) => {
    const result = await save(customName);
    const shareUrl = `${window.location.origin}/b/${result.slug}`;
    await navigator.clipboard.writeText(shareUrl);
    return shareUrl;
  };

  return reactive({
    state,
    totalPrice,
    totalWeight,
    issues,
    selectComponent,
    checkCompatibility,
    removeComponent,
    clear,
    save,
    share,
  });
};
