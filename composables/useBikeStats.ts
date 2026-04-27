import { computed } from "vue";
import type { Ref } from "vue";
import type { UnifiedBike } from "~/types/bike";

export function useBikeStats(bike: Ref<UnifiedBike | null>) {
  const totalWeight = computed(() => {
    if (!bike.value) return 0;
    return bike.value.bikeComponents.reduce((total: number, bc) => {
      const weight =
        typeof bc.component.weight === "string"
          ? parseFloat(bc.component.weight)
          : bc.component.weight;
      return total + (isNaN(weight || 0) ? 0 : weight || 0);
    }, 0);
  });

  const componentsByCategory = computed(() => {
    if (!bike.value) return {};
    const grouped: Record<string, any[]> = {};
    bike.value.bikeComponents.forEach((bc) => {
      const category = bc.component.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(bc);
    });
    return grouped;
  });

  const averageComponentPrice = computed(() => {
    if (!bike.value || bike.value.bikeComponents.length === 0) return 0;
    const total = bike.value.bikeComponents.reduce((sum: number, bc) => {
      const price =
        typeof bc.component.price === "string"
          ? parseFloat(bc.component.price)
          : bc.component.price;
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    return total / bike.value.bikeComponents.length;
  });

  return {
    totalWeight,
    componentsByCategory,
    averageComponentPrice,
  };
}
