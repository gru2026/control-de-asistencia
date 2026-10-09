import { describe, expect, it } from "vitest";
import {
  dentroDeVenezuela,
  validarFranjas,
  validarGeocerca,
  validarNuevoQR,
  validarPermiso,
  validarUbicacion,
} from "@/lib/validacion";

const PERSONA = "3f1c2a9e-1b2c-4d5e-8f90-1234567890ab";

describe("Geocerca y ubicaciones", () => {
  it("Cúa está en Venezuela; con la longitud positiva no", () => {
    expect(dentroDeVenezuela(10.17043, -66.88341)).toBe(true);
    expect(dentroDeVenezuela(10.17043, 66.88341)).toBe(false);
  });

  it("rechaza la longitud positiva con un mensaje que explica el signo", () => {
    const r = validarGeocerca({
      lat: "10.17043",
      lng: "66.88341",
      radio_m: "150",
      precision_max_m: "100",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.lng).toMatch(/debe ser negativa/);
  });

  it("acepta coma decimal y el par pegado desde Google Maps", () => {
    const r = validarGeocerca({
      lat: "10.17043, -66.88341",
      lng: "",
      radio_m: "150",
      precision_max_m: "100",
      geocerca_activa: "si",
    });
    expect(r).toEqual({
      ok: true,
      datos: {
        lat: 10.17043,
        lng: -66.88341,
        radio_m: 150,
        precision_max_m: 100,
        geocerca_activa: true,
      },
    });
    const c = validarUbicacion({ nombre: "Casa", lat: "10,2", lng: "-66,9", radio_m: "100" });
    expect(c.ok && c.datos.lat).toBe(10.2);
  });

  it("valida radio y nombre", () => {
    const r = validarUbicacion({ nombre: "", lat: "10.2", lng: "-66.9", radio_m: "10" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errores).sort()).toEqual(["nombre", "radio_m"]);
  });
});

describe("Franjas", () => {
  it("vacías → sin límite", () => {
    expect(validarFranjas({})).toEqual({
      ok: true,
      datos: {
        franja_entrada_desde: null,
        franja_entrada_hasta: null,
        franja_salida_desde: null,
        franja_salida_hasta: null,
      },
    });
  });
  it("exige ambas horas del par", () => {
    const r = validarFranjas({ franja_entrada_desde: "06:00" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.franja_entrada_hasta).toMatch(/ambas/);
  });
});

describe("QR y permisos", () => {
  it("vencimiento opcional, no en el pasado", () => {
    expect(validarNuevoQR({}, "2026-10-09")).toEqual({
      ok: true,
      datos: { descripcion: null, vigente_hasta: null },
    });
    expect(validarNuevoQR({ vence: "si", vigente_hasta: "2026-10-01" }, "2026-10-09").ok).toBe(
      false,
    );
    expect(
      validarNuevoQR({ vence: "si", vigente_hasta: "2026-12-15" }, "2026-10-09"),
    ).toMatchObject({
      ok: true,
      datos: { vigente_hasta: "2026-12-15" },
    });
  });

  it("permiso de un día si no hay fecha final", () => {
    const r = validarPermiso({
      personal_id: PERSONA,
      fecha_desde: "2026-10-09",
      motivo: "Cita médica",
    });
    expect(r).toMatchObject({ ok: true, datos: { fecha_hasta: "2026-10-09", observacion: null } });
  });

  it("rechaza rangos invertidos y «Otro» sin explicación", () => {
    const r = validarPermiso({
      personal_id: PERSONA,
      fecha_desde: "2026-10-09",
      fecha_hasta: "2026-10-01",
      motivo: "Otro",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errores).sort()).toEqual(["fecha_hasta", "observacion"]);
  });
});
