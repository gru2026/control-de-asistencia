import { describe, expect, it } from "vitest";
import { construirResumen, ordenarResumen, rangoResumen } from "@/lib/reportes/resumen";
import type { Jornada } from "@/types";

const lav: Jornada = {
  horaEntrada: "07:00",
  horaSalida: "16:00",
  toleranciaMin: 15,
  pausaMin: 60,
  diasLaborables: [1, 2, 3, 4, 5],
};
const persona = (id: string, extra = {}) => ({
  id,
  nombre: id,
  apellido: "Prueba",
  cedula: `V-${id}`,
  categoriaId: "c",
  fechaIngreso: null,
  jornada: lav,
  excepciones: [],
  ...extra,
});

// Lunes 5 a domingo 11 de octubre de 2026: 5 días laborables
const base = { desde: "2026-10-05", hasta: "2026-10-11", hoy: "2026-10-19", feriados: [] };

describe("Resumen del período (R5)", () => {
  it("cuenta días laborables, estados, horas y marcaciones en secretaría", () => {
    const r = construirResumen({
      ...base,
      personas: [persona("ana")],
      registros: [
        {
          personalId: "ana",
          fecha: "2026-10-05",
          estado: "presente",
          horasTrabajadas: 8,
          entradaMetodo: "qr",
        },
        {
          personalId: "ana",
          fecha: "2026-10-06",
          estado: "tarde",
          horasTrabajadas: 7.5,
          entradaMetodo: "asistido",
        },
        {
          personalId: "ana",
          fecha: "2026-10-07",
          estado: "falta",
          horasTrabajadas: null,
          entradaMetodo: null,
        },
        {
          personalId: "ana",
          fecha: "2026-10-08",
          estado: "permiso",
          horasTrabajadas: null,
          entradaMetodo: null,
        },
        // sábado: no es laborable, no cuenta
        {
          personalId: "ana",
          fecha: "2026-10-10",
          estado: "presente",
          horasTrabajadas: 4,
          entradaMetodo: "qr",
        },
      ],
    });
    expect(r.filas[0]).toMatchObject({
      diasLaborables: 5,
      presentes: 1,
      tardanzas: 1,
      faltas: 1,
      permisos: 1,
      sinRegistro: 1,
      totalHoras: 15.5,
      porcentajeAsistencia: 60,
      marcacionesPc: 1,
    });
  });

  it("excluye feriados, días antes del ingreso y días futuros", () => {
    const r = construirResumen({
      ...base,
      hasta: "2026-10-23",
      hoy: "2026-10-07",
      feriados: ["2026-10-06"],
      personas: [persona("ana"), persona("luis", { fechaIngreso: "2026-10-07" })],
      registros: [],
    });
    expect(r.hasta).toBe("2026-10-07");
    expect(r.filas.map((f) => f.diasLaborables)).toEqual([2, 1]);
    expect(r.totales).toMatchObject({ diasLaborables: 3, sinRegistro: 3, porcentajeAsistencia: 0 });
  });

  it("ordena por faltas y luego por nombre", () => {
    const r = construirResumen({
      ...base,
      personas: [persona("b"), persona("a"), persona("c")],
      registros: [
        {
          personalId: "c",
          fecha: "2026-10-05",
          estado: "falta",
          horasTrabajadas: null,
          entradaMetodo: null,
        },
      ],
    });
    expect(ordenarResumen(r.filas, "faltas", "desc").map((f) => f.personalId)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  it("rango por defecto: el mes en curso; se ordena y se limita a un año", () => {
    expect(rangoResumen(null, null, "2026-10-19")).toEqual({
      desde: "2026-10-01",
      hasta: "2026-10-19",
    });
    expect(rangoResumen("2026-10-10", "2026-10-01", "2026-10-19")).toEqual({
      desde: "2026-10-01",
      hasta: "2026-10-10",
    });
    expect(rangoResumen("2020-01-01", "2026-10-19", "2026-10-19").desde).toBe("2025-10-19");
  });
});
