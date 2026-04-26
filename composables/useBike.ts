import { ref, computed, reactive, toRaw } from "vue";
import type { BikeComponent, CompatibilityIssue } from "../types/bike";
import { validateBike } from "../server/utils/compatibility";

export interface BikeState {
  name: string;
  description: string;
  components: Record<string, BikeComponent>;
}

export const createBike = (initialState?: Partial<BikeState>) => {
  const state = reactive<BikeState>({
    name: initialState?.name || "Nova Bike",
    description: initialState?.description || "",
    components: initialState?.components || {},
  });

  const safeNonNegative = (n: number) => (!Number.isFinite(n) || n < 0 ? 0 : n);

  // Leverage: Price calculation hidden behind a simple getter
  const totalPrice = computed(() => {
    return Object.values(state.components).reduce((total, component) => {
      const raw = parseFloat(String(component.price));
      const price = safeNonNegative(raw);
      return total + price;
    }, 0);
  });

  // Leverage: Weight calculation hidden behind a simple getter
  const totalWeight = computed(() => {
    const total = Object.values(state.components).reduce((acc, component) => {
      const w = component.weight ? parseFloat(String(component.weight)) : 0;
      return acc + safeNonNegative(w);
    }, 0);
    return Math.round(total * 1000) / 1000;
  });

  // Locality: Compatibility check integrated into the model
  const issues = computed(() => {
    return validateBike(Object.values(state.components));
  });

  // Methods
  const selectComponent = (component: BikeComponent) => {
    state.components[component.category] = component;
  };

  const checkCompatibility = (component: BikeComponent) => {
    // Basic implementation: check if this component would cause issues if added
    const tempComponents = {
      ...state.components,
      [component.category]: component,
    };
    const tempIssues = validateBike(Object.values(tempComponents));
    const relevantIssues = tempIssues.filter(
      (i) => i.message.includes(component.model) || i.severity === "error"
    );

    if (relevantIssues.length > 0) {
      return { compatible: false, reason: relevantIssues[0].message };
    }
    return { compatible: true };
  };

  const removeComponent = (category: string) => {
    delete state.components[category];
  };

  const clear = () => {
    state.components = {};
    state.name = "Nova Bike";
    state.description = "";
  };

  // Locality: Persistence logic inside the module
  const save = async (customName?: string) => {
    if (customName) state.name = customName;

    return await $fetch<{ id: number; slug: string }>("/api/bikes", {
      method: "POST",
      body: {
        name: state.name,
        description: state.description,
        componentIds: Object.values(state.components).map((c) => c.id),
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

  return {
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
  };
};

// Global singleton for the builder
export const useBikeBuilder = () => {
  const bike = useState("current-bike", () => createBike());
  return bike.value;
};
