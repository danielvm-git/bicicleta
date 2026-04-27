export interface BikeComponent {
  id: number;
  category: string;
  model: string;
  brand?: string | null;
  line?: string | null;
  functionalGroup?: string | null;
  link?: string | null;
  price: string;
  weight?: string | null;
  speeds?: string | null;
  steeringType?: string | null;
  axleType?: string | null;
  suspensionTravel?: string | null;
  imageUrl?: string | null;
  updatedAt?: string | Date | null;
}

export interface UnifiedBike {
  id?: number | string;
  slug?: string;
  name: string;
  description?: string | null;
  totalPrice: number | string;
  imageUrl?: string | null;
  bikeComponents: {
    id?: number;
    component: BikeComponent;
  }[];
}

/** Stable ids for each Rule in the CompatibilityEngine (CONTEXT.md). */
export const COMPATIBILITY_RULE_IDS = [
  "drivetrain_speed_mismatch",
  "boost_rear_axle",
  "steering_over_tapered_error",
  "steering_tapered_over_warning",
  "steering_headset_tapered_on_over_error",
] as const;

export type CompatibilityRuleId = (typeof COMPATIBILITY_RULE_IDS)[number];

export interface CompatibilityIssue {
  /** Stable id for tests and builder UI; message copy can change without breaking consumers. */
  ruleId: CompatibilityRuleId;
  severity: "error" | "warning";
  message: string;
  /** One primary implicated **Component** (if applicable). */
  componentId?: number;
  /** Several parts involved in the same **Rule** (e.g. drivetrain). */
  relatedComponentIds?: number[];
  /** Category of the implicated part (redundant with catalog slot / UI grouping). */
  category?: string;
  reason?: string;
}
