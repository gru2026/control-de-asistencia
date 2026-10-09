import { describe, expect, it } from "vitest";
import { numero, plural, porcentaje, variacionPuntos } from "@/lib/formato";

describe("formato venezolano", () => {
  it("números y porcentajes", () => {
    expect(numero(2128)).toBe("2.128");
    expect(porcentaje(94.97)).toBe("95 %");
    expect(porcentaje(94.97, 2)).toBe("94,97 %");
  });
  it("variación en puntos", () => {
    expect(variacionPuntos(1.26)).toBe("+1,3");
    expect(variacionPuntos(-0.13)).toBe("−0,1");
    expect(variacionPuntos(0.02)).toBe("0");
    expect(variacionPuntos(3)).toBe("+3");
  });
  it("plural", () => {
    expect(plural(1, "falta", "faltas")).toBe("1 falta");
    expect(plural(1500, "falta", "faltas")).toBe("1.500 faltas");
  });
});
