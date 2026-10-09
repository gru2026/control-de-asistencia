import { describe, expect, it } from "vitest";
import { finDeJornada, planificarCierre, type PersonaCierre } from "@/lib/reglas/cierre";
import type { Jornada } from "@/types";

const diurna: Jornada = {
  horaEntrada: "07:00",
  horaSalida: "16:00",
  toleranciaMin: 15,
  pausaMin: 60,
  diasLaborables: [1, 2, 3, 4, 5],
};
const nocturna: Jornada = {
  horaEntrada: "22:00",
  horaSalida: "06:00",
  toleranciaMin: 10,
  pausaMin: 0,
  diasLaborables: [7, 1, 2, 3, 4],
  nocturna: true,
};

const ana: PersonaCierre = { id: "ana", jornada: diurna, excepciones: [] };
const vigilante: PersonaCierre = { id: "vig", jornada: nocturna, excepciones: [] };

// Viernes 9 oct 2026, 18:00 en Caracas
const AHORA = new Date("2026-10-09T22:00:00Z");
const FECHAS = ["2026-10-08", "2026-10-09"];

describe("R3 · cierre diario", () => {
  it("fin de jornada diurna y nocturna", () => {
    expect(finDeJornada("2026-10-09", { ...diurna, nocturna: false }).toISOString()).toBe(
      "2026-10-09T20:00:00.000Z",
    );
    expect(finDeJornada("2026-10-08", { ...nocturna, nocturna: true }).toISOString()).toBe(
      "2026-10-09T10:00:00.000Z",
    );
  });

  it("sin registro → falta; con permiso → permiso", () => {
    const plan = planificarCierre({
      fechas: ["2026-10-09"],
      ahora: AHORA,
      personas: [ana, { ...ana, id: "luis" }],
      registros: [],
      permisos: [{ personalId: "luis", desde: "2026-10-09", hasta: "2026-10-10" }],
      feriados: [],
    });
    expect(plan.ausencias.map((a) => [a.personalId, a.estado])).toEqual([
      ["ana", "falta"],
      ["luis", "permiso"],
    ]);
    expect(plan.ausencias[0]?.regla.horaEntrada).toBe("07:00");
  });

  it("es idempotente: con el registro ya creado no vuelve a actuar", () => {
    const plan = planificarCierre({
      fechas: ["2026-10-09"],
      ahora: AHORA,
      personas: [ana],
      registros: [
        {
          personalId: "ana",
          fecha: "2026-10-09",
          horaEntrada: null,
          horaSalida: null,
          salidaNoRegistrada: false,
        },
      ],
      permisos: [],
      feriados: [],
    });
    expect(plan).toEqual({ ausencias: [], sinSalida: [] });
  });

  it("nocturna: cierra la de ayer (ya terminó) y no la de hoy (aún no empieza)", () => {
    const plan = planificarCierre({
      fechas: FECHAS,
      ahora: AHORA,
      personas: [vigilante],
      registros: [],
      permisos: [],
      feriados: [],
    });
    expect(plan.ausencias.map((a) => a.fecha)).toEqual(["2026-10-08"]);
  });

  it("no cierra jornadas que no han terminado", () => {
    const plan = planificarCierre({
      fechas: ["2026-10-09"],
      ahora: new Date("2026-10-09T18:00:00Z"), // 14:00 local
      personas: [ana],
      registros: [],
      permisos: [],
      feriados: [],
    });
    expect(plan.ausencias).toHaveLength(0);
  });

  it("feriados, días libres y personal que aún no ingresaba no generan falta", () => {
    const plan = planificarCierre({
      fechas: FECHAS,
      ahora: AHORA,
      personas: [
        ana,
        {
          id: "libre",
          jornada: diurna,
          excepciones: [
            { diaSemana: 5, horaEntrada: "", horaSalida: "", toleranciaMin: null, libre: true },
          ],
        },
        { id: "nuevo", jornada: diurna, excepciones: [], fechaIngreso: "2026-10-12" },
        { id: "sin", jornada: null, excepciones: [] },
      ],
      registros: [],
      permisos: [],
      feriados: ["2026-10-08"],
    });
    expect(plan.ausencias.map((a) => `${a.personalId}|${a.fecha}`)).toEqual(["ana|2026-10-09"]);
  });

  it("entrada sin salida tras el margen → salida no registrada", () => {
    const base = {
      fechas: ["2026-10-09"],
      personas: [ana],
      registros: [
        {
          personalId: "ana",
          fecha: "2026-10-09",
          horaEntrada: "2026-10-09T11:04:00Z",
          horaSalida: null,
          salidaNoRegistrada: false,
        },
      ],
      permisos: [],
      feriados: [],
    };
    expect(planificarCierre({ ...base, ahora: AHORA }).sinSalida).toEqual([
      { personalId: "ana", fecha: "2026-10-09" },
    ]);
    // 16:30 local: dentro del margen de 60 min
    expect(
      planificarCierre({ ...base, ahora: new Date("2026-10-09T20:30:00Z") }).sinSalida,
    ).toEqual([]);
    // ya marcada antes → no se repite
    const marcado = { ...base, registros: [{ ...base.registros[0]!, salidaNoRegistrada: true }] };
    expect(planificarCierre({ ...marcado, ahora: AHORA }).sinSalida).toEqual([]);
  });
});
