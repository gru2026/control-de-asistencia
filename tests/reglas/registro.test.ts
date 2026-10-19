import { describe, expect, it } from "vitest";
import { estadoFila, instanteManual, motivoManual, validarInstante } from "@/lib/reglas/registro";
import type { ReglaDelDia } from "@/types";

const diurna: ReglaDelDia = {
  horaEntrada: "07:00",
  horaSalida: "16:00",
  toleranciaMin: 15,
  pausaMin: 60,
  nocturna: false,
};
const nocturna: ReglaDelDia = {
  ...diurna,
  horaEntrada: "22:00",
  horaSalida: "06:00",
  nocturna: true,
};

describe("Registro del día · estado de cada fila", () => {
  it("sin registro: por llegar (o permiso) y se puede marcar la entrada", () => {
    expect(estadoFila({ regla: diurna, registro: null, tienePermiso: false })).toEqual({
      clave: "pendiente",
      accion: "entrada",
    });
    expect(estadoFila({ regla: diurna, registro: null, tienePermiso: true }).clave).toBe("permiso");
  });

  it("sin jornada ese día: no se marca", () => {
    expect(estadoFila({ regla: null, registro: null, tienePermiso: false })).toEqual({
      clave: "no_programado",
      accion: null,
    });
  });

  it("con entrada: toca la salida; sin salida tras el cierre se indica", () => {
    const reg = { horaEntrada: "2026-10-19T11:05:00Z", horaSalida: null, estado: "tarde" as const };
    expect(estadoFila({ regla: diurna, registro: reg, tienePermiso: false })).toEqual({
      clave: "tarde",
      accion: "salida",
    });
    expect(
      estadoFila({
        regla: diurna,
        registro: { ...reg, salidaNoRegistrada: true },
        tienePermiso: false,
      }).clave,
    ).toBe("sin_salida");
  });

  it("día completo: sin acción", () => {
    const reg = {
      horaEntrada: "2026-10-19T11:00:00Z",
      horaSalida: "2026-10-19T20:00:00Z",
      estado: "presente" as const,
    };
    expect(estadoFila({ regla: diurna, registro: reg, tienePermiso: false })).toEqual({
      clave: "presente",
      accion: null,
    });
  });

  it("una falta del cierre se puede corregir marcando la entrada", () => {
    const reg = { horaEntrada: null, horaSalida: null, estado: "falta" as const };
    expect(estadoFila({ regla: diurna, registro: reg, tienePermiso: false })).toEqual({
      clave: "falta",
      accion: "entrada",
    });
  });

  it("un registro de demostración no cuenta", () => {
    const demo = {
      horaEntrada: "2026-10-19T11:00:00Z",
      horaSalida: null,
      estado: "presente" as const,
      esDemo: true,
    };
    expect(estadoFila({ regla: diurna, registro: demo, tienePermiso: false }).clave).toBe(
      "pendiente",
    );
  });
});

describe("Registro del día · hora escrita a mano", () => {
  it("hora local del colegio (UTC-4)", () => {
    expect(instanteManual("2026-10-19", "07:10", diurna).toISOString()).toBe(
      "2026-10-19T11:10:00.000Z",
    );
  });

  it("en jornada nocturna, la madrugada es del día siguiente", () => {
    expect(instanteManual("2026-10-19", "06:05", nocturna).toISOString()).toBe(
      "2026-10-20T10:05:00.000Z",
    );
    expect(instanteManual("2026-10-19", "22:10", nocturna).toISOString()).toBe(
      "2026-10-20T02:10:00.000Z",
    );
  });

  it("rechaza horas futuras, salidas antes de la entrada y jornadas de más de 20 h", () => {
    const ahora = new Date("2026-10-19T15:00:00Z");
    const entrada = new Date("2026-10-19T11:04:00Z");
    expect(
      validarInstante({ tipo: "entrada", instante: new Date("2026-10-19T16:00:00Z"), ahora }),
    ).toMatch(/posterior a la actual/);
    expect(
      validarInstante({
        tipo: "salida",
        instante: new Date("2026-10-19T10:00:00Z"),
        ahora,
        entrada,
      }),
    ).toBe("La salida no puede ser anterior a la entrada (07:04).");
    expect(
      validarInstante({
        tipo: "salida",
        instante: new Date("2026-10-20T09:00:00Z"),
        ahora: new Date("2026-10-21T00:00:00Z"),
        entrada,
      }),
    ).toMatch(/20 horas/);
    expect(validarInstante({ tipo: "salida", instante: ahora, ahora, entrada })).toBeNull();
  });

  it("motivo de la señal", () => {
    expect(motivoManual("entrada", "Falla de conexión")).toBe(
      "Hora de entrada registrada a mano: Falla de conexión",
    );
  });
});
