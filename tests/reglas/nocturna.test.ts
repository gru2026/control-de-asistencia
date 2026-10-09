import { describe, expect, it } from "vitest";
import {
  duracionJornadaMin,
  esNocturna,
  fechaDeJornada,
  resolverJornada,
} from "@/lib/reglas/jornada";
import { diferenciaMin, estadoAlMarcarEntrada } from "@/lib/reglas/estados";
import { horasTrabajadas } from "@/lib/reglas/calculoHoras";
import { horaEnZona, instanteLocal, minutosAHora, sumarDias } from "@/lib/reglas/tiempo";
import type { Jornada } from "@/types";

const noche: Jornada = {
  horaEntrada: "22:00",
  horaSalida: "06:00",
  toleranciaMin: 10,
  pausaMin: 0,
  diasLaborables: [7, 1, 2, 3, 4],
  nocturna: true,
};

describe("Jornada nocturna", () => {
  it("se detecta y su duración cruza la medianoche", () => {
    expect(esNocturna("22:00", "06:00")).toBe(true);
    expect(esNocturna("07:00", "16:00")).toBe(false);
    expect(duracionJornadaMin("22:00", "06:00")).toBe(480);
  });
  it("resolverJornada conserva la marca nocturna (domingo 2026-10-04)", () => {
    expect(resolverJornada({ fecha: "2026-10-04", jornada: noche })?.nocturna).toBe(true);
    expect(resolverJornada({ fecha: "2026-10-09", jornada: noche })).toBeNull(); // viernes
  });
  it("llegar 00:15 a una jornada de 22:00 es tarde (+135 min)", () => {
    expect(diferenciaMin("00:15", "22:00")).toBe(135);
    expect(estadoAlMarcarEntrada("00:15", "22:00", 10)).toBe("tarde");
    expect(estadoAlMarcarEntrada("21:55", "22:00", 10)).toBe("presente");
  });
  it("horas trabajadas de 22:00 a 06:00 del día siguiente = 8", () => {
    expect(
      horasTrabajadas(instanteLocal("2026-10-05", 1320), instanteLocal("2026-10-05", 1800)),
    ).toBe(8);
  });
  it("una marca de madrugada pertenece a la jornada del día anterior", () => {
    expect(fechaDeJornada("2026-10-06", 360, true)).toBe("2026-10-05");
    expect(fechaDeJornada("2026-10-06", 360, false)).toBe("2026-10-06");
    expect(fechaDeJornada("2026-10-06", 1320, true)).toBe("2026-10-06");
  });
});

describe("Utilidades de tiempo", () => {
  it("minutosAHora, sumarDias, instanteLocal y horaEnZona", () => {
    expect(minutosAHora(450)).toBe("07:30");
    expect(minutosAHora(1500)).toBe("01:00");
    expect(sumarDias("2026-10-31", 1)).toBe("2026-11-01");
    const i = instanteLocal("2026-10-05", 7 * 60 + 4);
    expect(i.toISOString()).toBe("2026-10-05T11:04:00.000Z");
    expect(horaEnZona(i)).toBe("07:04");
  });
});
