import { describe, it, expect } from "vitest";
import { z } from "zod";

const postBodySchema = z
  .object({
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional().nullable(),
    componentIds: z.array(z.number().int().positive()).min(1),
    isPublic: z.boolean().optional(),
    totalPrice: z.union([z.number(), z.string()]).optional(),
  })
  .strict();

describe("POST /api/bikes body contract", () => {
  it("rejects empty componentIds", () => {
    expect(
      postBodySchema.safeParse({ name: "Test", componentIds: [] }).success
    ).toBe(false);
  });
  it("rejects extra keys (strict)", () => {
    expect(
      postBodySchema.safeParse({
        name: "Test",
        componentIds: [1],
        userId: "evil",
      }).success
    ).toBe(false);
  });
  it("accepts minimal valid payload", () => {
    expect(
      postBodySchema.safeParse({ name: "Test", componentIds: [1] }).success
    ).toBe(true);
  });
});
