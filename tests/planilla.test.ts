import { describe, expect, it } from "vitest";
import {
  construirPlanilla,
  observacionDe,
  type MarcaPlanilla,
  type PersonaPlanilla,
} from "@/lib/reportes/planilla";
import type { Categoria } from "@/types";

const cat = (
  id: string,
  nombre: string,
  planilla: "docentes" | "personal",
  orden: number,
): Categoria => ({
  id,
  nombre,
  planilla,
  orden,
  color: "#000000",
  jornada_sugerida_id: null,
  activa: true,
});
const categorias = [
  cat("d", "Docente", "docentes", 1),
  cat("c", "Cocina", "personal", 3),
  cat("v", "Vigilancia", "personal", 5),
];
const per = (
  id: string,
  nombre: string,
  cedula: string,
  categoria_id: string,
  nocturna = false,
): PersonaPlanilla => ({
  id,
  nombre,
  apellido: "Pérez",
  cedula,
  carga_horaria: 40,
  categoria_id,
  nocturna,
});
const personas = [
  per("1", "Rosa", "V-7000002", "d"),
  per("2", "Luis", "V-6000001", "d"),
  per("3", "Eva", "V-10000003", "c"),
  per("4", "Raúl", "V-20000004", "v", true),
];
const marcas = new Map<string, MarcaPlanilla>([
  [
    "2",
    {
      horaEntrada: "07:04",
      horaSalida: "15:31",
      estado: "presente",
      diferenciaMin: 4,
      observacion: null,
    },
  ],
  [
    "1",
    {
      horaEntrada: "07:20",
      horaSalida: null,
      estado: "tarde",
      diferenciaMin: 20,
      observacion: null,
    },
  ],
  [
    "3",
    {
      horaEntrada: null,
      horaSalida: null,
      estado: "permiso",
      diferenciaMin: null,
      observacion: "Reposo médico",
    },
  ],
]);

describe("planilla oficial", () => {
  it("docentes: ordenada por cédula, numerada y con título y día", () => {
    const p = construirPlanilla("docentes", "2026-10-05", categorias, personas, marcas);
    expect(p.titulo).toBe("ASISTENCIA DOCENTES");
    expect(p).toMatchObject({ dia: "LUNES", fecha: "05/10/2026" });
    expect(p.grupos).toHaveLength(1);
    expect(p.grupos[0]!.filas.map((f) => [f.n, f.nombre, f.cargo])).toEqual([
      ["01", "LUIS, PÉREZ", "DOCENTE"],
      ["02", "ROSA, PÉREZ", "DOCENTE"],
    ]);
    expect(p.grupos[0]!.filas[1]!.observacion).toBe("Tarde (+20 min)");
  });
  it("personal: agrupado por cargo, vigilante nocturno y sin registro", () => {
    const p = construirPlanilla("personal", "2026-10-05", categorias, personas, marcas);
    expect(p.grupos.map((g) => g.nombre)).toEqual(["Cocina", "Vigilancia"]);
    expect(p.grupos[1]!.filas[0]).toMatchObject({
      n: "01",
      cargo: "VIGILANCIA / NOC",
      observacion: "Sin registro",
    });
    expect(p.totales).toMatchObject({ permiso: 1, sin_registro: 1 });
  });
  it("una categoría específica", () => {
    const p = construirPlanilla("categoria:v", "2026-10-05", categorias, personas, marcas);
    expect(p.titulo).toBe("ASISTENCIA VIGILANCIA");
  });
  it("observaciones", () => {
    expect(observacionDe(undefined)).toBe("Sin registro");
    expect(
      observacionDe({
        horaEntrada: null,
        horaSalida: null,
        estado: "falta",
        diferenciaMin: null,
        observacion: null,
      }),
    ).toBe("Falta");
    expect(
      observacionDe({
        horaEntrada: "07:00",
        horaSalida: null,
        estado: "presente",
        diferenciaMin: 0,
        observacion: "Registrado por secretaría",
      }),
    ).toBe("Registrado por secretaría");
  });
});
