import { reactive } from "vue";
import { storeToRefs } from "pinia";
import { useBuilderStore } from "~/stores/builder";
import type { BikeComponent } from "../types/bike";

// Global singleton for the builder - now backed by Pinia
export const useBikeBuilder = () => {
  const store = useBuilderStore();
  const { name, description, components, totalPrice, totalWeight, issues } =
    storeToRefs(store);

  // Return reactive object for backward compatibility
  return reactive({
    // Direct access to store state properties
    state: store,
    totalPrice,
    totalWeight,
    issues,
    // Actions
    selectComponent: store.selectComponent,
    checkCompatibility: store.checkCompatibility,
    removeComponent: store.removeComponent,
    clear: store.clear,
    save: store.save,
    share: store.share,
    selectGroup: store.selectGroup,
  });
};
