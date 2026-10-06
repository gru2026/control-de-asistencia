import { describe, expect, it } from "vitest";
import { distanciaMetros, evaluarGeocerca, type ParametrosGeocerca } from "@/lib/reglas/geocerca";

// Punto de ejemplo (NO es la ubicación real del colegio)
const centro = { lat: 10.0, lng: -69.0 };
const params: ParametrosGeocerca = { centro, radioM: 150, precisionMaxM: 100 };

/** Desplaza hacia el norte n metros (1° de latitud ≈ 111 195 m). */
const alNorte = (m: number) => ({ lat: centro.lat + m / 111_195, lng: centro.lng });

describe("R10 · geocerca", () => {
  it("T17 mismo punto → 0 m, permitido", () => {
    const r = evaluarGeocerca({ ...centro, precisionM: 10 }, params);
    expect(r).toMatchObject({ permitido: true, distanciaM: 0, senalado: false });
  });

  it("T18 a 100 m con radio 150 → permitido", () => {
    const r = evaluarGeocerca({ ...alNorte(100), precisionM: 20 }, params);
    expect(r.permitido).toBe(true);
    expect(r.distanciaM).toBeGreaterThanOrEqual(99);
    expect(r.distanciaM).toBeLessThanOrEqual(101);
  });

  it("T19 a 200 m con radio 150 → bloqueado", () => {
    const r = evaluarGeocerca({ ...alNorte(200), precisionM: 20 }, params);
    expect(r.permitido).toBe(false);
  });

  it("T20 dentro del radio con precisión baja → permitido y señalado", () => {
    const r = evaluarGeocerca({ ...alNorte(50), precisionM: 180 }, params);
    expect(r).toMatchObject({ permitido: true, senalado: true });
  });

  it("T21 coordenadas inválidas → bloqueado", () => {
    expect(evaluarGeocerca({ lat: 200, lng: 0, precisionM: 5 }, params).permitido).toBe(false);
    expect(evaluarGeocerca({ lat: NaN, lng: 0, precisionM: 5 }, params).permitido).toBe(false);
    expect(() => distanciaMetros({ lat: 91, lng: 0 }, centro)).toThrow();
  });
});
