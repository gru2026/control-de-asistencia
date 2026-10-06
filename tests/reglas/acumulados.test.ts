import { describe, expect, it } from "vitest";
import { calcularAcumulados, type RegistroResumen } from "@/lib/reglas/acumulados";

const dias = (estado: RegistroResumen["estado"], n: number, horas = 8): RegistroResumen[] =>
  Array.from({ length: n }, () => ({
    estado,
    horasTrabajadas: estado === "presente" || estado === "tarde" ? horas : null,
    entradaMetodo: estado === "presente" || estado === "tarde" ? "qr" : null,
  }));

describe("R5 · calcularAcumulados", () => {
  it("T13 20 días laborables con 2 faltas → 90 %", () => {
    const r = calcularAcumulados([...dias("presente", 18), ...dias("falta", 2)], 20);
    expect(r.porcentajeAsistencia).toBe(90);
    expect(r.faltas).toBe(2);
    expect(r.totalHoras).toBe(144);
  });

  it("T14 los permisos no cuentan como falta", () => {
    const r = calcularAcumulados([...dias("presente", 18), ...dias("permiso", 2)], 20);
    expect(r.porcentajeAsistencia).toBe(100);
    expect(r.faltas).toBe(0);
    expect(r.permisos).toBe(2);
  });

  it("T15 feriado excluido del denominador", () => {
    // mes de 21 días hábiles con 1 feriado → 20 laborables
    const r = calcularAcumulados([...dias("presente", 19), ...dias("falta", 1)], 20);
    expect(r.porcentajeAsistencia).toBe(95);
  });

  it("T16 0 días laborables → 0 % sin dividir por cero", () => {
    expect(calcularAcumulados([], 0).porcentajeAsistencia).toBe(0);
  });

  it("cuenta tardanzas como asistencia y marcaciones hechas en el PC", () => {
    const registros: RegistroResumen[] = [
      { estado: "tarde", horasTrabajadas: 7.5, entradaMetodo: "qr" },
      { estado: "presente", horasTrabajadas: 8, entradaMetodo: "kiosco" },
      { estado: "presente", horasTrabajadas: 8, entradaMetodo: "asistido" },
    ];
    const r = calcularAcumulados(registros, 3);
    expect(r.tardanzas).toBe(1);
    expect(r.porcentajeAsistencia).toBe(100);
    expect(r.marcacionesPc).toBe(2);
    expect(r.totalHoras).toBe(23.5);
  });
});
