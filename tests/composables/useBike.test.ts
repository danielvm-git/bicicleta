import { describe, it, expect, beforeEach } from "vitest";
import { useBikeBuilder } from "~/composables/useBike";

describe("useBikeBuilder", () => {
  let bike: ReturnType<typeof useBikeBuilder>;

  beforeEach(() => {
    bike = useBikeBuilder();
    bike.clear();
  });

  it("should start with an empty bike", () => {
    expect(bike.state.components).toEqual({});
    expect(bike.totalPrice).toBe(0);
  });

  it("should persist state across different instances", () => {
    const component = {
      id: 1,
      category: "Quadro",
      model: "Absolute Nero",
      price: 500,
    };

    bike.selectComponent(component as any);

    // Get a new instance
    const newBike = useBikeBuilder();
    expect(newBike.state.components["Quadro"]).toEqual(component);
  });

  it("should select a component", () => {
    const component = {
      id: 1,
      category: "Quadro",
      model: "Absolute Nero",
      price: "500.00",
    };

    bike.selectComponent(component as any);
    expect(bike.state.components["Quadro"]).toEqual(component);
    expect(bike.totalPrice).toBe(500);
  });

  it("should replace a component in the same category", () => {
    const comp1 = {
      id: 1,
      category: "Quadro",
      model: "Absolute Nero",
      price: "500.00",
    };
    const comp2 = {
      id: 2,
      category: "Quadro",
      model: "Absolute Wild",
      price: "700.00",
    };

    bike.selectComponent(comp1 as any);
    bike.selectComponent(comp2 as any);

    expect(bike.state.components["Quadro"]).toEqual(comp2);
    expect(bike.totalPrice).toBe(700);
  });

  it("should calculate total price for multiple categories", () => {
    bike.selectComponent({
      id: 1,
      category: "Quadro",
      model: "Nero",
      price: 500,
    } as any);
    bike.selectComponent({
      id: 2,
      category: "Suspensão",
      model: "Prime",
      price: 300.5,
    } as any);

    expect(bike.totalPrice).toBe(800.5);
  });

  it("should calculate total weight", () => {
    bike.selectComponent({
      id: 1,
      category: "Quadro",
      model: "Nero",
      price: 500,
      weight: "1.800",
    } as any);
    bike.selectComponent({
      id: 2,
      category: "Suspensão",
      model: "Prime",
      price: 300.5,
      weight: "2.100",
    } as any);

    expect(bike.totalWeight).toBe(3.9);
  });

  it("should remove a component", () => {
    bike.selectComponent({
      id: 1,
      category: "Quadro",
      model: "Nero",
      price: 500,
    } as any);
    bike.removeComponent("Quadro");
    expect(bike.state.components["Quadro"]).toBeUndefined();
    expect(bike.totalPrice).toBe(0);
  });

  it("should clear the bike", () => {
    bike.selectComponent({
      id: 1,
      category: "Quadro",
      model: "Nero",
      price: 500,
    } as any);
    bike.clear();
    expect(bike.state.components).toEqual({});
    expect(bike.totalPrice).toBe(0);
  });

  it("should detect compatibility issues for mixed speeds", () => {
    bike.selectComponent({
      id: 1,
      category: "Cassete",
      model: "12v Cassette",
      price: 200,
      speeds: "12v",
    } as any);
    bike.selectComponent({
      id: 2,
      category: "Câmbio Traseiro",
      model: "11v Derailleur",
      price: 150,
      speeds: "11v",
    } as any);

    expect(bike.issues.length).toBeGreaterThan(0);
    const issue = bike.issues[0];
    expect(issue.severity).toBe("error");
    expect(issue.message).toContain("12v");
    expect(issue.message).toContain("11v");
  });

  it("should detect axle incompatibility", () => {
    bike.selectComponent({
      id: 1,
      category: "Quadro",
      model: "Boost Frame",
      price: 500,
      axleType: "Boost 148mm",
    } as any);
    bike.selectComponent({
      id: 2,
      category: "Cubo",
      model: "QR Hub",
      price: 100,
      axleType: "Quick Release",
    } as any);

    const issue = bike.issues.find((i) => i.message.includes("Boost"));
    expect(issue?.severity).toBe("error");
    expect(issue?.message).toContain("Boost 148mm");
  });

  it("should report warning for straight fork in tapered frame", () => {
    bike.selectComponent({
      id: 1,
      category: "Quadro",
      model: "Tapered Frame",
      price: 500,
      steeringType: "Tapered",
    } as any);
    bike.selectComponent({
      id: 2,
      category: "Suspensão",
      model: "Straight Fork",
      price: 300,
      steeringType: "Over",
    } as any);

    const issue = bike.issues.find((i) => i.message.includes("redutor"));
    expect(issue?.severity).toBe("warning");
  });
});
