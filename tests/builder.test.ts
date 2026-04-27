import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useBuilderStore } from "../stores/builder";

describe("Builder Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Mock $fetch globally
    vi.stubGlobal("$fetch", vi.fn());
  });

  it("adds components correctly", () => {
    const store = useBuilderStore();
    const component = {
      id: 1,
      category: "Quadro",
      model: "Absolute Nero",
      price: "1000.00",
      weight: "1.5",
    };

    store.selectComponent(component);
    expect(store.components["Quadro"]).toEqual(component);
    expect(store.totalPrice).toBe(1000);
    expect(store.totalWeight).toBe(1.5);
  });

  it("removes components correctly", () => {
    const store = useBuilderStore();
    const component = {
      id: 1,
      category: "Quadro",
      model: "Absolute Nero",
      price: "1000.00",
      weight: "1.5",
    };

    store.selectComponent(component);
    store.removeComponent("Quadro");
    expect(store.components["Quadro"]).toBeUndefined();
    expect(store.totalPrice).toBe(0);
  });

  it("selectGroup resolves components via API and updates state", async () => {
    const store = useBuilderStore();

    const cassette = {
      id: 2,
      category: "Cassete",
      model: "Shimano Deore M6100",
      price: "500.00",
      weight: "0.6",
    };

    const crankset = {
      id: 3,
      category: "Pedivela",
      model: "Shimano Deore M6100",
      price: "800.00",
      weight: "0.9",
    };

    // Mock $fetch to return different components based on query
    vi.mocked($fetch).mockImplementation((url, options: any) => {
      if (options?.query?.category === "Cassete")
        return Promise.resolve([cassette]);
      if (options?.query?.category === "Pedivela")
        return Promise.resolve([crankset]);
      return Promise.resolve([]);
    });

    await store.selectGroup({
      cassette: "Shimano Deore M6100",
      crankset: "Shimano Deore M6100",
    });

    expect($fetch).toHaveBeenCalledWith(
      "/api/components",
      expect.objectContaining({
        query: expect.objectContaining({
          search: "Shimano Deore M6100",
          category: "Cassete",
        }),
      })
    );
    expect($fetch).toHaveBeenCalledWith(
      "/api/components",
      expect.objectContaining({
        query: expect.objectContaining({
          search: "Shimano Deore M6100",
          category: "Pedivela",
        }),
      })
    );

    expect(store.components["Cassete"]).toEqual(cassette);
    expect(store.components["Pedivela"]).toEqual(crankset);
    expect(store.totalPrice).toBe(1300); // 500 + 800
    expect(store.totalWeight).toBe(1.5); // 0.6 + 0.9
  });

  it("clears state correctly", () => {
    const store = useBuilderStore();
    store.selectComponent({
      id: 1,
      category: "Quadro",
      model: "X",
      price: "100",
    });
    store.name = "Custom Bike";

    store.clear();

    expect(Object.keys(store.components).length).toBe(0);
    expect(store.name).toBe("Nova Bike");
  });
});
