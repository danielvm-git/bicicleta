import type { BikeComponent, CompatibilityIssue } from "~/types/bike";

type RuleFn = (components: BikeComponent[]) => CompatibilityIssue[];

const DRIVETRAIN_CATEGORIES = [
  "Cassete",
  "Câmbio Traseiro",
  "Câmbio Dianteiro",
  "Alavanca de Câmbio",
  "Transmissão",
] as const;

const DRIVETRAIN_CATEGORY_SET = new Set<string>(DRIVETRAIN_CATEGORIES);

function isDrivetrainCategory(category: string): boolean {
  return DRIVETRAIN_CATEGORY_SET.has(category);
}

const ruleDrivetrainSpeeds: RuleFn = (components) => {
  const selectedSpeeds = components
    .filter((c) => isDrivetrainCategory(c.category) && c.speeds)
    .map((c) => c.speeds);
  const uniqueSpeeds = new Set(selectedSpeeds);
  if (uniqueSpeeds.size <= 1) {
    return [];
  }
  const involved = components.filter(
    (c) => isDrivetrainCategory(c.category) && Boolean(c.speeds)
  );
  return [
    {
      ruleId: "drivetrain_speed_mismatch",
      severity: "error" as const,
      message: `Incompatibilidade de velocidades: misturando ${Array.from(uniqueSpeeds).join(", ")}`,
      relatedComponentIds: involved.map((c) => c.id),
    },
  ];
};

const ruleBoostRearAxle: RuleFn = (components) => {
  const frame = components.find((c) => c.category === "Quadro");
  const hubs = components.filter((c) => c.category === "Cubo");
  if (!frame?.axleType?.includes("Boost 148mm")) {
    return [];
  }
  const nonBoostHub = hubs.find(
    (h) => h.axleType && !h.axleType.includes("148")
  );
  if (!nonBoostHub) {
    return [];
  }
  return [
    {
      ruleId: "boost_rear_axle",
      severity: "error" as const,
      message:
        "Cubo traseiro incompatível: Quadro Boost exige cubo Boost 148mm.",
      componentId: nonBoostHub.id,
      category: "Cubo",
    },
  ];
};

const ruleSteeringFrameVsSuspension: RuleFn = (components) => {
  const frame = components.find((c) => c.category === "Quadro");
  const suspension = components.find((c) => c.category === "Suspensão");
  const out: CompatibilityIssue[] = [];
  if (frame?.steeringType && suspension?.steeringType) {
    if (
      frame.steeringType === "Over" &&
      suspension.steeringType === "Tapered"
    ) {
      out.push({
        ruleId: "steering_over_tapered_error",
        severity: "error",
        message:
          "Direção incompatível: Quadro 'Over' não suporta suspensão 'Tapered'.",
        componentId: suspension.id,
        category: "Suspensão",
      });
    }
    if (
      frame.steeringType === "Tapered" &&
      suspension.steeringType === "Over"
    ) {
      out.push({
        ruleId: "steering_tapered_over_warning",
        severity: "warning",
        message:
          "Aviso: Suspensão 'Over' em quadro 'Tapered' exige caixa de direção com redutor.",
        componentId: suspension.id,
        category: "Suspensão",
      });
    }
  }
  return out;
};

const ruleHeadsetVsFrame: RuleFn = (components) => {
  const frame = components.find((c) => c.category === "Quadro");
  const headset = components.find((c) => c.category === "Caixa de Direção");
  if (!headset?.model || !frame?.steeringType) {
    return [];
  }
  const headsetModel = headset.model.toLowerCase();
  const isHeadsetTapered =
    headsetModel.includes("52") ||
    headsetModel.includes("56") ||
    headsetModel.includes("tapered");
  if (frame.steeringType === "Over" && isHeadsetTapered) {
    return [
      {
        ruleId: "steering_headset_tapered_on_over_error",
        severity: "error" as const,
        message:
          "Caixa de Direção incompatível: Quadro 'Over' (44mm) não suporta caixa 'Tapered'.",
        componentId: headset.id,
        category: "Caixa de Direção",
      },
    ];
  }
  return [];
};

const COMPATIBILITY_RULES: RuleFn[] = [
  ruleDrivetrainSpeeds,
  ruleBoostRearAxle,
  ruleSteeringFrameVsSuspension,
  ruleHeadsetVsFrame,
];

/**
 * CompatibilityEngine: runs all **Rule**s; public **seam** for **Bike** validation.
 */
export const validateBike = (
  components: BikeComponent[]
): CompatibilityIssue[] => {
  if (components.length === 0) {
    return [];
  }
  const issues: CompatibilityIssue[] = [];
  for (const rule of COMPATIBILITY_RULES) {
    issues.push(...rule(components));
  }
  return issues;
};

/**
 * Whether a **CompatibilityIssue** should mark a builder row as “incompatible” for sorting,
 * given a candidate **Component** (replaces fragile `message.includes(model)` where possible).
 */
export function issueRelevantForBuilderPreview(
  issue: CompatibilityIssue,
  component: BikeComponent
): boolean {
  if (issue.severity === "error") {
    return true;
  }
  if (issue.message.includes(component.model)) {
    return true;
  }
  if (issue.componentId != null && issue.componentId === component.id) {
    return true;
  }
  if (issue.relatedComponentIds?.includes(component.id)) {
    return true;
  }
  if (issue.category && issue.category === component.category) {
    return true;
  }
  return false;
}

export const checkComponentCompatibility = (
  component: BikeComponent,
  bikeComponents: BikeComponent[]
): { compatible: boolean; reason?: string } => {
  const frame = bikeComponents.find((c) => c.category === "Quadro");

  if (isDrivetrainCategory(component.category) && component.speeds) {
    const existing = bikeComponents.find(
      (c) => isDrivetrainCategory(c.category) && c.speeds
    );
    if (existing && existing.speeds !== component.speeds) {
      return {
        compatible: false,
        reason: `Exige ${existing.speeds}`,
      };
    }
  }

  if (
    component.category === "Cubo" &&
    frame?.axleType?.includes("Boost 148mm")
  ) {
    if (component.axleType && !component.axleType.includes("148")) {
      return { compatible: false, reason: "Exige Boost 148mm" };
    }
  }
  if (
    component.category === "Quadro" &&
    component.axleType?.includes("Boost 148mm")
  ) {
    const hub = bikeComponents.find((c) => c.category === "Cubo");
    if (hub?.axleType && !hub.axleType.includes("148")) {
      return { compatible: false, reason: "Incompatível com Cubo QR" };
    }
  }

  if (
    component.category === "Suspensão" &&
    frame?.steeringType === "Over" &&
    component.steeringType === "Tapered"
  ) {
    return { compatible: false, reason: "Tapered em Quadro Over" };
  }

  return { compatible: true };
};
