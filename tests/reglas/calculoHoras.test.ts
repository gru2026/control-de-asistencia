import { describe, expect, it } from "vitest";
import { horasTrabajadas } from "@/lib/reglas/calculoHoras";

const t = (hhmm: string) => new Date(`2026-10-05T${hhmm}:00-04:00`);

describe("R2 · horasTrabajadas", () => {
  it("T8 jornada completa 07:00 → 16:00", () => {
    expect(horasTrabajadas(t("07:00"), t("16:00"))).toBe(9);
  });
  it("T9 descuenta la pausa", () => {
    expect(horasTrabajadas(t("07:00"), t("16:00"), 60)).toBe(8);
  });
  it("T10 sin salida → null", () => {
    expect(horasTrabajadas(t("07:00"), null)).toBeNull();
  });
  it("T11 redondea a 2 decimales", () => {
    expect(horasTrabajadas(t("07:00"), t("15:47"))).toBe(8.78);
  });
  it("T12 salida antes que entrada → error", () => {
    expect(() => horasTrabajadas(t("16:00"), t("07:00"))).toThrow();
  });
  it("una pausa mayor que lo trabajado no da horas negativas", () => {
    expect(horasTrabajadas(t("07:00"), t("07:30"), 60)).toBe(0);
  });
});
