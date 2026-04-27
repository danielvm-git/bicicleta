import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useBikeStats } from "~/composables/useBikeStats";
import type { UnifiedBike } from "~/types/bike";

describe("useBikeStats", () => {
  it("should return default values when bike is null", () => {
    const bike = ref<UnifiedBike | null>(null);
    const { totalWeight, averageComponentPrice, componentsByCategory } =
      useBikeStats(bike);

    expect(totalWeight.value).toBe(0);
    expect(averageComponentPrice.value).toBe(0);
    expect(componentsByCategory.value).toEqual({});
  });

  it("should calculate stats correctly for a bike", () => {
    const bike = ref<UnifiedBike | null>({
      name: "Test Bike",
      totalPrice: 1000,
      bikeComponents: [
        {
          component: {
            id: 1,
            category: "Quadro",
            model: "Model A",
            price: "500.00",
            weight: "1.500",
          },
        },
        {
          component: {
            id: 2,
            category: "Suspensão",
            model: "Model B",
            price: "300.00",
            weight: "2.100",
          },
        },
      ],
    });

    const { totalWeight, averageComponentPrice, componentsByCategory } =
      useBikeStats(bike);

    expect(totalWeight.value).toBe(3.6);
    expect(averageComponentPrice.value).toBe(400);
    expect(Object.keys(componentsByCategory.value)).toEqual([
      "Quadro",
      "Suspensão",
    ]);
    expect(componentsByCategory.value["Quadro"]).toHaveLength(1);
    expect(componentsByCategory.value["Suspensão"]).toHaveLength(1);
  });

  it("should handle string weights and prices correctly", () => {
    const bike = ref<UnifiedBike | null>({
      name: "Test Bike",
      totalPrice: 1000,
      bikeComponents: [
        {
          component: {
            id: 1,
            category: "Pneu",
            model: "Model C",
            price: "150.50",
            weight: "0.750",
          },
        },
      ],
    });

    const { totalWeight, averageComponentPrice } = useBikeStats(bike);

    expect(totalWeight.value).toBe(0.75);
    expect(averageComponentPrice.value).toBe(150.5);
  });

  it("should handle missing weights", () => {
    const bike = ref<UnifiedBike | null>({
      name: "Test Bike",
      totalPrice: 1000,
      bikeComponents: [
        {
          component: {
            id: 1,
            category: "Pneu",
            model: "Model C",
            price: "150.50",
            weight: null,
          },
        },
      ],
    });

    const { totalWeight } = useBikeStats(bike);

    expect(totalWeight.value).toBe(0);
  });
});
