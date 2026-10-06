import { describe, expect, it } from "vitest";
import { estadoAlMarcarEntrada, estadoSinMarcacion, minutosDeRetraso } from "@/lib/reglas/estados";

describe("R1 · estadoAlMarcarEntrada", () => {
  it("T1 entra antes de la hora → presente", () => {
    expect(estadoAlMarcarEntrada("06:55", "07:00", 15)).toBe("presente");
  });
  it("T2 dentro de tolerancia → presente", () => {
    expect(estadoAlMarcarEntrada("07:10", "07:00", 15)).toBe("presente");
  });
  it("T3 supera tolerancia por 1 min → tarde", () => {
    expect(estadoAlMarcarEntrada("07:16", "07:00", 15)).toBe("tarde");
  });
  it("T4 límite exacto → presente", () => {
    expect(estadoAlMarcarEntrada("07:15", "07:00", 15)).toBe("presente");
  });
  it("T7 tolerancia 0 → cualquier retraso es tarde", () => {
    expect(estadoAlMarcarEntrada("07:01", "07:00", 0)).toBe("tarde");
    expect(estadoAlMarcarEntrada("07:00", "07:00", 0)).toBe("presente");
  });
  it("rechaza tolerancia negativa y horas inválidas", () => {
    expect(() => estadoAlMarcarEntrada("07:00", "07:00", -1)).toThrow();
    expect(() => estadoAlMarcarEntrada("25:00", "07:00", 15)).toThrow();
  });
});

describe("R1 · cierre diario", () => {
  it("T5 sin marcación con permiso → permiso", () => {
    expect(estadoSinMarcacion(true)).toBe("permiso");
  });
  it("T6 sin marcación sin permiso → falta", () => {
    expect(estadoSinMarcacion(false)).toBe("falta");
  });
});

describe("minutosDeRetraso", () => {
  it("calcula el retraso y nunca es negativo", () => {
    expect(minutosDeRetraso("07:16", "07:00")).toBe(16);
    expect(minutosDeRetraso("06:50", "07:00")).toBe(0);
  });
});
