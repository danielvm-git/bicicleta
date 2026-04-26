export interface BikeComponent {
  id: number;
  category: string;
  model: string;
  brand?: string | null;
  line?: string | null;
  link?: string | null;
  price: string;
  weight?: string | null;
  speeds?: string | null;
  steeringType?: string | null;
  axleType?: string | null;
  suspensionTravel?: string | null;
  updatedAt?: string | Date | null;
}

export interface CompatibilityIssue {
  severity: "error" | "warning";
  message: string;
  category?: string;
  reason?: string;
}
