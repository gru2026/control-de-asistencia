import { describe, expect, it } from "vitest";
import {
  describirDispositivo,
  estadoParaNuevoCelular,
  motivoDispositivo,
  uidValido,
} from "@/lib/reglas/dispositivos";
import {
  diasDelPermiso,
  faltasCubiertas,
  permisoCubre,
  permisoSolapado,
  permisosQueVuelvenAFalta,
  vigenciaPermiso,
} from "@/lib/reglas/permisos";
import { formatoQRValido, generarCodigoQR, hashCodigoQR, qrVigente } from "@/lib/qr";

describe("R11 · dispositivos", () => {
  it("primer celular aprobado; los siguientes pendientes", () => {
    expect(estadoParaNuevoCelular([])).toBe("aprobado");
    expect(
      estadoParaNuevoCelular([{ dispositivoUid: "a", estado: "revocado", tipo: "celular" }]),
    ).toBe("pendiente");
    expect(
      estadoParaNuevoCelular([{ dispositivoUid: "k", estado: "aprobado", tipo: "kiosco" }]),
    ).toBe("aprobado");
  });

  it("solo un aprobado puede marcar", () => {
    expect(motivoDispositivo("aprobado")).toBeNull();
    expect(motivoDispositivo("pendiente")).toMatch(/pendiente de aprobación/);
    expect(motivoDispositivo("revocado")).toMatch(/ya no está autorizado/);
    expect(motivoDispositivo(null)).toMatch(/no está registrado/);
  });

  it("valida el identificador UUID v4", () => {
    expect(uidValido("3f1c2a9e-1b2c-4d5e-8f90-1234567890ab")).toBe(true);
    expect(uidValido("no-es-uuid")).toBe(false);
    expect(uidValido(42)).toBe(false);
  });

  it("describe el teléfono a partir del agente de usuario", () => {
    expect(
      describirDispositivo(
        "Mozilla/5.0 (Linux; Android 14; SM-A145M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36",
      ),
    ).toBe("Android · Chrome");
    expect(
      describirDispositivo(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      ),
    ).toBe("iPhone · Safari");
    expect(describirDispositivo(null)).toBe("Desconocido");
  });
});

describe("R4 · permisos", () => {
  const permisos = [{ id: "p1", personalId: "A", desde: "2026-10-05", hasta: "2026-10-07" }];

  it("cubre solo a la persona y dentro del rango", () => {
    expect(permisoCubre(permisos, "A", "2026-10-05")).toBe(true);
    expect(permisoCubre(permisos, "A", "2026-10-07")).toBe(true);
    expect(permisoCubre(permisos, "A", "2026-10-08")).toBe(false);
    expect(permisoCubre(permisos, "B", "2026-10-06")).toBe(false);
  });

  it("detecta solapes, pero no consigo mismo al editar", () => {
    expect(
      permisoSolapado({ personalId: "A", desde: "2026-10-07", hasta: "2026-10-09" }, permisos)?.id,
    ).toBe("p1");
    expect(
      permisoSolapado({ personalId: "A", desde: "2026-10-08", hasta: "2026-10-09" }, permisos),
    ).toBeUndefined();
    expect(
      permisoSolapado(
        { id: "p1", personalId: "A", desde: "2026-10-04", hasta: "2026-10-06" },
        permisos,
      ),
    ).toBeUndefined();
  });

  it("vigencia y duración", () => {
    expect(vigenciaPermiso("2026-10-05", "2026-10-07", "2026-10-04")).toBe("proximo");
    expect(vigenciaPermiso("2026-10-05", "2026-10-07", "2026-10-07")).toBe("vigente");
    expect(vigenciaPermiso("2026-10-05", "2026-10-07", "2026-10-08")).toBe("pasado");
    expect(diasDelPermiso("2026-10-05", "2026-10-07")).toBe(3);
    expect(diasDelPermiso("2026-10-30", "2026-11-02")).toBe(4);
  });

  it("las faltas sin entrada del rango pasan a permiso", () => {
    const regs = [
      { fecha: "2026-10-05", estado: "falta", horaEntrada: null },
      { fecha: "2026-10-06", estado: "tarde", horaEntrada: "2026-10-06T12:00:00Z" },
      { fecha: "2026-10-09", estado: "falta", horaEntrada: null },
    ];
    expect(faltasCubiertas(regs, "2026-10-05", "2026-10-07")).toEqual(["2026-10-05"]);
  });

  it("al eliminar un permiso, los días sin otro permiso vuelven a falta", () => {
    const regs = [
      { fecha: "2026-10-05", estado: "permiso", horaEntrada: null },
      { fecha: "2026-10-06", estado: "permiso", horaEntrada: null },
    ];
    const otro = [{ personalId: "A", desde: "2026-10-06", hasta: "2026-10-06" }];
    expect(permisosQueVuelvenAFalta(regs, "A", otro)).toEqual(["2026-10-05"]);
  });
});

describe("R13 · código QR", () => {
  it("genera códigos únicos con formato válido", () => {
    const a = generarCodigoQR();
    const b = generarCodigoQR();
    expect(a).not.toBe(b);
    expect(formatoQRValido(a)).toBe(true);
    expect(formatoQRValido("https://ejemplo.com")).toBe(false);
    expect(formatoQRValido(null)).toBe(false);
  });

  it("el hash es SHA-256 estable e ignora espacios", () => {
    const c = generarCodigoQR();
    expect(hashCodigoQR(c)).toMatch(/^[0-9a-f]{64}$/);
    expect(hashCodigoQR(` ${c}\n`)).toBe(hashCodigoQR(c));
  });

  it("vigencia: activo y sin vencer (el día de vencimiento todavía vale)", () => {
    expect(qrVigente({ activo: true, vigente_hasta: null }, "2026-10-09")).toBe(true);
    expect(qrVigente({ activo: true, vigente_hasta: "2026-10-09" }, "2026-10-09")).toBe(true);
    expect(qrVigente({ activo: true, vigente_hasta: "2026-10-08" }, "2026-10-09")).toBe(false);
    expect(qrVigente({ activo: false, vigente_hasta: null }, "2026-10-09")).toBe(false);
    expect(qrVigente(null, "2026-10-09")).toBe(false);
  });
});
