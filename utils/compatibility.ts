import type { BikeComponent, CompatibilityIssue } from "~/types/bike";

export const validateBike = (
  components: BikeComponent[]
): CompatibilityIssue[] => {
  const issues: CompatibilityIssue[] = [];
  if (components.length === 0) return issues;

  // 1. Drivetrain speeds check
  const drivetrainCategories = [
    "Cassete",
    "Câmbio Traseiro",
    "Câmbio Dianteiro",
    "Alavanca de Câmbio",
    "Transmissão",
  ];
  const selectedSpeeds = components
    .filter((c) => drivetrainCategories.includes(c.category) && c.speeds)
    .map((c) => c.speeds);

  const uniqueSpeeds = new Set(selectedSpeeds);
  if (uniqueSpeeds.size > 1) {
    issues.push({
      severity: "error",
      message: `Incompatibilidade de velocidades: misturando ${Array.from(uniqueSpeeds).join(", ")}`,
    });
  }

  // 2. Rear Axle check (Quadro vs Cubo)
  const frame = components.find((c) => c.category === "Quadro");
  const hubs = components.filter((c) => c.category === "Cubo");

  if (frame?.axleType?.includes("Boost 148mm")) {
    const nonBoostHub = hubs.find(
      (h) => h.axleType && !h.axleType.includes("148")
    );
    if (nonBoostHub) {
      issues.push({
        severity: "error",
        message:
          "Cubo traseiro incompatível: Quadro Boost exige cubo Boost 148mm.",
        category: "Cubo",
      });
    }
  }

  // 3. Steering check (Quadro vs Suspensão)
  const suspension = components.find((c) => c.category === "Suspensão");
  const headset = components.find((c) => c.category === "Caixa de Direção");

  if (frame?.steeringType && suspension?.steeringType) {
    if (
      frame.steeringType === "Over" &&
      suspension.steeringType === "Tapered"
    ) {
      issues.push({
        severity: "error",
        message:
          "Direção incompatível: Quadro 'Over' não suporta suspensão 'Tapered'.",
        category: "Suspensão",
      });
    }
    if (
      frame.steeringType === "Tapered" &&
      suspension.steeringType === "Over"
    ) {
      issues.push({
        severity: "warning",
        message:
          "Aviso: Suspensão 'Over' em quadro 'Tapered' exige caixa de direção com redutor.",
        category: "Suspensão",
      });
    }
  }

  if (headset?.model && frame?.steeringType) {
    const headsetModel = headset.model.toLowerCase();
    const isHeadsetTapered =
      headsetModel.includes("52") ||
      headsetModel.includes("56") ||
      headsetModel.includes("tapered");
    if (frame.steeringType === "Over" && isHeadsetTapered) {
      issues.push({
        severity: "error",
        message:
          "Caixa de Direção incompatível: Quadro 'Over' (44mm) não suporta caixa 'Tapered'.",
        category: "Caixa de Direção",
      });
    }
  }

  return issues;
};

export const checkComponentCompatibility = (
  component: BikeComponent,
  bikeComponents: BikeComponent[]
): { compatible: boolean; reason?: string } => {
  const frame = bikeComponents.find((c) => c.category === "Quadro");

  // 1. Drivetrain speeds
  const drivetrainCategories = [
    "Cassete",
    "Câmbio Traseiro",
    "Câmbio Dianteiro",
    "Alavanca de Câmbio",
    "Transmissão",
  ];
  if (drivetrainCategories.includes(component.category) && component.speeds) {
    const existing = bikeComponents.find(
      (c) => drivetrainCategories.includes(c.category) && c.speeds
    );
    if (existing && existing.speeds !== component.speeds) {
      return { compatible: false, reason: `Exige ${existing.speeds}` };
    }
  }

  // 2. Rear Axle (Hub vs Frame)
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

  // 3. Steering
  if (
    component.category === "Suspensão" &&
    frame?.steeringType === "Over" &&
    component.steeringType === "Tapered"
  ) {
    return { compatible: false, reason: "Tapered em Quadro Over" };
  }

  return { compatible: true };
};
