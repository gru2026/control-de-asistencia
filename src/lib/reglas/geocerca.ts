/**
 * R10 · Validación de ubicación (geocerca).
 * Ver Documentacion/03-Diseno/Reglas-de-negocio.md y Registro-de-decisiones (D-06)
 */

export interface Coordenada {
  lat: number;
  lng: number;
}

export interface ParametrosGeocerca {
  centro: Coordenada;
  radioM: number;
  precisionMaxM: number;
}

export type ResultadoGeocerca =
  | { permitido: true; distanciaM: number; senalado: boolean; motivo: string | null }
  | { permitido: false; distanciaM: number | null; motivo: string };

const RADIO_TIERRA_M = 6_371_000;

function esCoordenadaValida({ lat, lng }: Coordenada): boolean {
  return (
    Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
  );
}

/** Distancia en metros entre dos coordenadas (fórmula de Haversine). */
export function distanciaMetros(a: Coordenada, b: Coordenada): number {
  if (!esCoordenadaValida(a) || !esCoordenadaValida(b)) {
    throw new Error("Coordenadas inválidas");
  }
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * RADIO_TIERRA_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Fuera del radio → bloquea. Dentro del radio con precisión baja → permite y señala.
 */
export function evaluarGeocerca(
  posicion: Coordenada & { precisionM: number },
  params: ParametrosGeocerca,
): ResultadoGeocerca {
  if (!esCoordenadaValida(posicion) || !Number.isFinite(posicion.precisionM)) {
    return { permitido: false, distanciaM: null, motivo: "Ubicación no válida" };
  }
  const distanciaM = Math.round(distanciaMetros(posicion, params.centro));

  if (distanciaM > params.radioM) {
    return { permitido: false, distanciaM, motivo: "Debe estar en el colegio para marcar." };
  }

  const senalado = posicion.precisionM > params.precisionMaxM;
  return {
    permitido: true,
    distanciaM,
    senalado,
    motivo: senalado ? `Precisión GPS baja (${Math.round(posicion.precisionM)} m)` : null,
  };
}
