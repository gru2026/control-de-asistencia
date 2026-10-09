import { describe, expect, it } from "vitest";
import {
  dentroDeFranja,
  evaluarUbicacion,
  fechaDeMarcacion,
  siguienteMarcacion,
  textoDistancia,
  validarOrden,
  type PuntoPermitido,
} from "@/lib/reglas/marcacion";
import type { ReglaDelDia } from "@/types";

const colegio: PuntoPermitido = {
  nombre: "Colegio",
  centro: { lat: 10.0, lng: -69.0 },
  radioM: 150,
  esPrueba: false,
};
const casa: PuntoPermitido = {
  nombre: "Casa de prueba",
  centro: { lat: 10.5, lng: -69.0 },
  radioM: 100,
  esPrueba: true,
};
const alNorte = (p: PuntoPermitido, m: number) => ({
  lat: p.centro.lat + m / 111_195,
  lng: p.centro.lng,
});

// 07:04 y 16:01 hora de Caracas (UTC-4)
const ENTRADA = "2026-10-09T11:04:00Z";
const SALIDA = "2026-10-09T20:01:00Z";

describe("R7 · duplicados y orden", () => {
  it("sin registro → toca entrada; salida rechazada", () => {
    expect(siguienteMarcacion(null)).toBe("entrada");
    expect(validarOrden("entrada", null)).toBeNull();
    expect(validarOrden("salida", null)).toBe("Primero debe marcar la entrada.");
  });

  it("segunda entrada rechazada con la hora local", () => {
    const reg = { horaEntrada: ENTRADA, horaSalida: null, estado: "presente" as const };
    expect(siguienteMarcacion(reg)).toBe("salida");
    expect(validarOrden("entrada", reg)).toBe("Ya registró su entrada hoy a las 07:04.");
    expect(validarOrden("salida", reg)).toBeNull();
  });

  it("segunda salida rechazada", () => {
    const reg = { horaEntrada: ENTRADA, horaSalida: SALIDA, estado: "presente" as const };
    expect(siguienteMarcacion(reg)).toBe("completa");
    expect(validarOrden("salida", reg)).toBe("Ya registró su salida hoy a las 16:01.");
  });

  it("día cerrado como falta no admite marcar", () => {
    const reg = { horaEntrada: null, horaSalida: null, estado: "falta" as const };
    expect(siguienteMarcacion(reg)).toBe("cerrada");
    expect(validarOrden("entrada", reg)).toMatch(/cerrado como falta/);
  });

  it("un registro de demostración no bloquea la marcación real", () => {
    const demo = {
      horaEntrada: ENTRADA,
      horaSalida: SALIDA,
      estado: "tarde" as const,
      esDemo: true,
    };
    expect(siguienteMarcacion(demo)).toBe("entrada");
    expect(validarOrden("entrada", demo)).toBeNull();
    expect(validarOrden("salida", demo)).toBe("Primero debe marcar la entrada.");
  });
});

describe("Franja horaria", () => {
  it("sin franja configurada siempre permite", () => {
    expect(dentroDeFranja(3 * 60, null, null)).toBe(true);
    expect(dentroDeFranja(3 * 60, "06:00", null)).toBe(true);
  });
  it("límites incluidos", () => {
    expect(dentroDeFranja(6 * 60, "06:00", "09:00")).toBe(true);
    expect(dentroDeFranja(9 * 60, "06:00", "09:00")).toBe(true);
    expect(dentroDeFranja(9 * 60 + 1, "06:00", "09:00")).toBe(false);
  });
  it("franja que cruza la medianoche", () => {
    expect(dentroDeFranja(23 * 60, "21:00", "02:00")).toBe(true);
    expect(dentroDeFranja(60, "21:00", "02:00")).toBe(true);
    expect(dentroDeFranja(12 * 60, "21:00", "02:00")).toBe(false);
  });
});

describe("R10 · ubicaciones permitidas", () => {
  it("sin posición → pide activar la ubicación", () => {
    expect(evaluarUbicacion(null, [colegio], 100)).toMatchObject({
      permitido: false,
      motivo: "Active la ubicación para marcar.",
    });
  });

  it("sin ubicaciones configuradas → bloquea con aviso", () => {
    const r = evaluarUbicacion({ ...colegio.centro, precisionM: 10 }, [], 100);
    expect(r.permitido).toBe(false);
    expect(r.motivo).toMatch(/no está configurada/);
  });

  it("dentro del colegio con buena precisión → sin señal", () => {
    const r = evaluarUbicacion({ ...alNorte(colegio, 40), precisionM: 15 }, [colegio, casa], 100);
    expect(r).toMatchObject({ permitido: true, senalado: false, motivo: null });
    if (r.permitido) expect(r.punto.nombre).toBe("Colegio");
  });

  it("en la ubicación de prueba → permitido pero señalado", () => {
    const r = evaluarUbicacion({ ...alNorte(casa, 20), precisionM: 15 }, [colegio, casa], 100);
    expect(r).toMatchObject({ permitido: true, senalado: true });
    expect(r.motivo).toBe("Ubicación de prueba: Casa de prueba");
  });

  it("precisión baja en el colegio → señalado con motivo", () => {
    const r = evaluarUbicacion({ ...alNorte(colegio, 30), precisionM: 250 }, [colegio], 100);
    expect(r).toMatchObject({
      permitido: true,
      senalado: true,
      motivo: "Precisión GPS baja (250 m)",
    });
  });

  it("fuera de todas → bloquea indicando la distancia a la más cercana", () => {
    const r = evaluarUbicacion({ ...alNorte(colegio, 1200), precisionM: 10 }, [colegio, casa], 100);
    expect(r.permitido).toBe(false);
    expect(r.motivo).toBe("Debe estar en el colegio para marcar. Está a 1,2 km.");
  });

  it("texto de distancia", () => {
    expect(textoDistancia(349.6)).toBe("350 m");
    expect(textoDistancia(1250)).toBe("1,3 km");
    expect(textoDistancia(15_400)).toBe("15 km");
  });
});

describe("Fecha de la marcación (jornadas nocturnas)", () => {
  const nocturna: ReglaDelDia = {
    horaEntrada: "22:00",
    horaSalida: "06:00",
    toleranciaMin: 10,
    pausaMin: 0,
    nocturna: true,
  };
  const base = { fechaLocal: "2026-10-09", reglaAyer: nocturna };

  it("salida de madrugada pertenece a la jornada de ayer", () => {
    const registroAyer = {
      horaEntrada: "2026-10-09T02:00:00Z",
      horaSalida: null,
      estado: "presente" as const,
    };
    expect(fechaDeMarcacion({ ...base, minutosLocales: 6 * 60, registroAyer })).toBe("2026-10-08");
  });

  it("llegada tardía de madrugada sin registro también es de ayer", () => {
    expect(fechaDeMarcacion({ ...base, minutosLocales: 30, registroAyer: null })).toBe(
      "2026-10-08",
    );
  });

  it("si la jornada de ayer ya está completa, es de hoy", () => {
    const registroAyer = {
      horaEntrada: "2026-10-09T02:00:00Z",
      horaSalida: "2026-10-09T10:00:00Z",
      estado: "presente" as const,
    };
    expect(fechaDeMarcacion({ ...base, minutosLocales: 7 * 60, registroAyer })).toBe("2026-10-09");
  });

  it("por la tarde o sin jornada nocturna ayer, es de hoy", () => {
    expect(fechaDeMarcacion({ ...base, minutosLocales: 21 * 60 + 50, registroAyer: null })).toBe(
      "2026-10-09",
    );
    expect(
      fechaDeMarcacion({ ...base, reglaAyer: null, minutosLocales: 6 * 60, registroAyer: null }),
    ).toBe("2026-10-09");
  });
});
