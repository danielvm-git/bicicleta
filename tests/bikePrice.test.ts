import { describe, it, expect } from "vitest";
import { sumComponentPrices } from "~/utils/bikePrice";

describe("sumComponentPrices", () => {
  it("sums numeric strings and drops invalid parts", () => {
    expect(
      sumComponentPrices([{ price: "10" }, { price: "5.5" }, { price: null }])
    ).toBe(15.5);
  });
  it("treats non-finite and negative as zero", () => {
    expect(
      sumComponentPrices([{ price: "1" }, { price: "nan" }, { price: "-3" }])
    ).toBe(1);
  });
});
