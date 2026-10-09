import { describe, expect, it } from "vitest";
import { generarAsistenciaDemo, type PersonaDemo } from "@/lib/demo/generador";

const dia = {
  horaEntrada: "07:00",
  horaSalida: "15:00",
  toleranciaMin: 15,
  pausaMin: 0,
  diasLaborables: [1, 2, 3, 4, 5] as const,
};
const personas: PersonaDemo[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `p${i}`,
    jornada: { ...dia, diasLaborables: [...dia.diasLaborables] },
  })),
  {
    id: "noche",
    jornada: {
      horaEntrada: "22:00",
      horaSalida: "06:00",
      toleranciaMin: 10,
      pausaMin: 0,
      diasLaborables: [1, 2, 3, 4, 5],
      nocturna: true,
    },
  },
  { id: "sin", jornada: null },
];
const opc = {
  desde: "2026-09-07",
  hasta: "2026-10-08",
  feriados: ["2026-10-12"],
  ahoraMin: 9 * 60,
};

describe("generador de demostración", () => {
  const { registros, permisos } = generarAsistenciaDemo(personas, opc);

  it("es determinista", () => {
    expect(generarAsistenciaDemo(personas, opc).registros).toEqual(registros);
  });
  it("un registro por persona y día, solo días laborables, todos marcados demo", () => {
    const claves = registros.map((r) => `${r.personal_id}|${r.fecha}`);
    expect(new Set(claves).size).toBe(claves.length);
    expect(registros.every((r) => r.es_demo)).toBe(true);
    expect(registros.some((r) => r.personal_id === "sin")).toBe(false);
    expect(
      registros.every((r) => ![0, 6].includes(new Date(r.fecha + "T00:00:00Z").getUTCDay())),
    ).toBe(true);
  });
  it("produce los cuatro estados y permisos coherentes", () => {
    const estados = new Set(registros.map((r) => r.estado));
    expect([...estados].sort()).toEqual(["falta", "permiso", "presente", "tarde"]);
    expect(permisos.length).toBeGreaterThan(0);
    for (const p of permisos) expect(p.fecha_hasta >= p.fecha_desde).toBe(true);
  });
  it("hoy no genera marcas futuras ni salidas antes de que ocurran", () => {
    const hoy = registros.filter((r) => r.fecha === "2026-10-08");
    expect(hoy.length).toBeGreaterThan(0);
    for (const r of hoy) {
      expect(r.hora_salida).toBeNull();
      expect(new Date(r.hora_entrada!).getTime()).toBeLessThanOrEqual(
        new Date("2026-10-08T13:00:00Z").getTime(),
      );
    }
  });
  it("la jornada nocturna sale al día siguiente con 8 h aprox.", () => {
    const n = registros.find(
      (r) => r.personal_id === "noche" && r.hora_salida && r.estado !== "falta",
    );
    expect(n).toBeDefined();
    expect(n!.hora_salida! > n!.hora_entrada!).toBe(true);
    expect(n!.horas_trabajadas!).toBeGreaterThan(7);
  });
});
