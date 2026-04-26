import { describe, it, expect } from "vitest";
import {
  cleanWeight,
  inferTechnicalSpecs,
  cleanPrice,
  normalizeCategory,
} from "../../server/utils/parser";

describe("Parser Utils", () => {
  describe("cleanWeight", () => {
    it("should parse kg format", () => {
      expect(cleanWeight("1.2kg")).toBe("1.200");
      expect(cleanWeight("1,2 kg")).toBe("1.200");
    });

    it("should parse g format", () => {
      expect(cleanWeight("450g")).toBe("0.450");
      expect(cleanWeight("1200 gramas")).toBe("1.200");
    });

    it("should handle bare numbers", () => {
      expect(cleanWeight("1.5")).toBe("1.500");
      expect(cleanWeight("800")).toBe("0.800");
    });

    it("should return null for invalid inputs", () => {
      expect(cleanWeight("N/A")).toBeNull();
      expect(cleanWeight("")).toBeNull();
    });
  });

  describe("inferTechnicalSpecs", () => {
    it("should infer speeds", () => {
      expect(inferTechnicalSpecs("Cassete Absolute 12v").speeds).toBe("12v");
      expect(inferTechnicalSpecs("Pedivela Shimano 2x10").speeds).toBe("2x10");
      expect(inferTechnicalSpecs("Mesa Kalloy 70x7").speeds).toBeUndefined();
    });

    it("should infer steering type", () => {
      expect(
        inferTechnicalSpecs("Quadro Absolute Wild Tapered").steeringType
      ).toBe("Tapered");
      expect(
        inferTechnicalSpecs("Suspensão Absolute Prime Cônica").steeringType
      ).toBe("Tapered");
    });

    it("should infer axle type", () => {
      expect(inferTechnicalSpecs("Cubo Boost 148x12").axleType).toBe(
        "Boost 148mm"
      );
      expect(
        inferTechnicalSpecs("Quadro com eixo passante 142mm").axleType
      ).toBe("142x12mm");
    });

    it("should infer suspension travel", () => {
      expect(
        inferTechnicalSpecs("Suspensão 100mm com trava").suspensionTravel
      ).toBe("100mm");
    });
  });

  describe("normalizeCategory", () => {
    it("should normalize uppercase categories", () => {
      expect(normalizeCategory("CASSETE")).toBe("Cassete");
      expect(normalizeCategory("CAIXA DE DIREÇÃO")).toBe("Caixa de Direção");
    });

    it("should handle accents correctly from map", () => {
      expect(normalizeCategory("SUSPENSÃO")).toBe("Suspensão");
      expect(normalizeCategory("CÂMARA")).toBe("Câmara");
    });

    it("should default to title case for unknown categories", () => {
      expect(normalizeCategory("NOVA CATEGORIA")).toBe("Nova Categoria");
    });
  });
});
