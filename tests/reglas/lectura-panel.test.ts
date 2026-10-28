import { describe, expect, it } from "vitest";
import { lecturaPorcentaje, tramoDe } from "@/lib/reglas/estadisticas";

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

describe("tramoDe (filtro por tramo de llegada, D-56)", () => {
  it("clasifica los minutos de retraso", () => {
    expect(tramoDe(-10)).toBe("antes");
    expect(tramoDe(0)).toBe("antes");
    expect(tramoDe(5)).toBe("0-5");
    expect(tramoDe(6)).toBe("6-15");
    expect(tramoDe(30)).toBe("16-30");
    expect(tramoDe(61)).toBe("60+");
    expect(tramoDe(null)).toBeNull();
  });
});
