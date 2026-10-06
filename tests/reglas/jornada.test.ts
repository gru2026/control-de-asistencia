import { describe, expect, it } from "vitest";
import { resolverJornada } from "@/lib/reglas/jornada";
import type { Jornada } from "@/types";

const general: Jornada = {
  horaEntrada: "07:00",
  horaSalida: "16:00",
  toleranciaMin: 15,
  pausaMin: 0,
  diasLaborables: [1, 2, 3, 4, 5],
};

// 2026-10-05 = lunes, 2026-10-10 = sábado
describe("R0 · resolverJornada", () => {
  it("T0a lunes con jornada L–V usa la jornada", () => {
    expect(resolverJornada({ fecha: "2026-10-05", jornada: general })).toEqual({
      horaEntrada: "07:00",
      horaSalida: "16:00",
      toleranciaMin: 15,
      pausaMin: 0,
    });
  });

  it("T0b sábado con jornada L–V no es laborable", () => {
    expect(resolverJornada({ fecha: "2026-10-10", jornada: general })).toBeNull();
  });

  it("T0c feriado no es laborable", () => {
    expect(
      resolverJornada({ fecha: "2026-10-05", jornada: general, feriados: ["2026-10-05"] }),
    ).toBeNull();
  });

  it("T0d excepción del día usa sus horas", () => {
    const r = resolverJornada({
      fecha: "2026-10-05",
      jornada: general,
      excepciones: [
        { diaSemana: 1, horaEntrada: "13:00", horaSalida: "18:00", toleranciaMin: 5, libre: false },
      ],
    });
    expect(r).toMatchObject({ horaEntrada: "13:00", horaSalida: "18:00", toleranciaMin: 5 });
  });

  it("T0e excepción libre no es laborable", () => {
    expect(
      resolverJornada({
        fecha: "2026-10-05",
        jornada: general,
        excepciones: [
          {
            diaSemana: 1,
            horaEntrada: "07:00",
            horaSalida: "16:00",
            toleranciaMin: null,
            libre: true,
          },
        ],
      }),
    ).toBeNull();
  });

  it("T0f excepción con tolerancia null hereda la de la jornada", () => {
    const r = resolverJornada({
      fecha: "2026-10-05",
      jornada: general,
      excepciones: [
        {
          diaSemana: 1,
          horaEntrada: "08:00",
          horaSalida: "12:00",
          toleranciaMin: null,
          libre: false,
        },
      ],
    });
    expect(r?.toleranciaMin).toBe(15);
  });

  it("sin jornada asignada no es laborable", () => {
    expect(resolverJornada({ fecha: "2026-10-05", jornada: null })).toBeNull();
  });
});
