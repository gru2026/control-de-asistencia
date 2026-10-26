import { describe, expect, it } from "vitest";
import { lecturaPorcentaje } from "@/lib/reglas/estadisticas";

describe("lecturaPorcentaje (umbrales del panel, D-53)", () => {
  it("90 % o más es bien", () => {
    expect(lecturaPorcentaje(90)).toBe("bien");
    expect(lecturaPorcentaje(100)).toBe("bien");
  });
  it("de 80 a 89 % pide atención", () => {
    expect(lecturaPorcentaje(89.9)).toBe("atencion");
    expect(lecturaPorcentaje(80)).toBe("atencion");
  });
  it("menos de 80 % es bajo", () => {
    expect(lecturaPorcentaje(79.9)).toBe("bajo");
    expect(lecturaPorcentaje(0)).toBe("bajo");
  });
});
