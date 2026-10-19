import { describe, expect, it } from "vitest";
import { calendarioPersonal, diasDelMes, mesValido, mesVecino } from "@/lib/reglas/historial";
import { diaSemanaISO } from "@/lib/reglas/tiempo";

describe("Historial personal", () => {
  it("mes válido, vecinos y días del mes", () => {
    expect(mesValido("2026-09", "2026-10-19")).toBe("2026-09");
    expect(mesValido("2026-11", "2026-10-19")).toBe("2026-10");
    expect(mesValido("basura", "2026-10-19")).toBe("2026-10");
    expect(mesVecino("2026-01", -1)).toBe("2025-12");
    expect(mesVecino("2026-12", 1)).toBe("2027-01");
    expect(diasDelMes("2026-02")).toEqual({ desde: "2026-02-01", hasta: "2026-02-28" });
  });

  it("calendario: semanas de lunes a domingo con el estado de cada día", () => {
    const semanas = calendarioPersonal({
      mes: "2026-10",
      hoy: "2026-10-07",
      estados: new Map([["2026-10-05", "tarde"]]),
      laborable: (f) => diaSemanaISO(f) <= 5,
      feriados: ["2026-10-12"],
    });
    const dias = semanas.flat();
    expect(dias.length % 7).toBe(0);
    expect(dias.slice(0, 3)).toEqual([null, null, null]); // 1 oct 2026 es jueves
    const de = (f: string) => dias.find((d) => d?.fecha === f)?.estado;
    expect(de("2026-10-05")).toBe("tarde");
    expect(de("2026-10-06")).toBe("sin_registro");
    expect(de("2026-10-04")).toBe("libre");
    expect(de("2026-10-12")).toBe("futuro");
  });
});
