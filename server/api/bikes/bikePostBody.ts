import { z } from "zod";

/** POST /api/bikes — shared with tests and handler (single contract seam). */
export const bikePostBodySchema = z
  .object({
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional().nullable(),
    componentIds: z.array(z.number().int().positive()).min(1),
    isPublic: z.boolean().optional(),
    totalPrice: z.union([z.number(), z.string()]).optional(),
  })
  .strict();

export type BikePostBody = z.infer<typeof bikePostBodySchema>;
