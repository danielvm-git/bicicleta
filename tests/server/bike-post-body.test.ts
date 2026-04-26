import { describe, it, expect } from "vitest";
import { bikePostBodySchema } from "~/server/api/bikes/bikePostBody";

describe("POST /api/bikes body contract", () => {
  it("rejects empty componentIds", () => {
    expect(
      bikePostBodySchema.safeParse({ name: "Test", componentIds: [] }).success
    ).toBe(false);
  });
  it("rejects extra keys (strict)", () => {
    expect(
      bikePostBodySchema.safeParse({
        name: "Test",
        componentIds: [1],
        userId: "evil",
      }).success
    ).toBe(false);
  });
  it("accepts minimal valid payload", () => {
    expect(
      bikePostBodySchema.safeParse({ name: "Test", componentIds: [1] }).success
    ).toBe(true);
  });
});
