/** Lecturas de la configuración de marcación (geocerca, ubicaciones, franjas, QR). */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PuntoPermitido } from "@/lib/reglas/marcacion";

export interface ConfigMarcacion {
  nombre_institucion: string;
  nombre_planilla: string;
  colegio_lat: number | null;
  colegio_lng: number | null;
  radio_m: number;
  precision_max_m: number;
  geocerca_activa: boolean;
  franja_entrada_desde: string | null;
  franja_entrada_hasta: string | null;
  franja_salida_desde: string | null;
  franja_salida_hasta: string | null;
  hora_cierre_diario: string;
  zona_horaria: string;
  inicio_control: string | null;
}

export const COLUMNAS_CONFIG_MARCACION =
  "nombre_institucion, nombre_planilla, colegio_lat, colegio_lng, radio_m, precision_max_m, geocerca_activa, franja_entrada_desde, franja_entrada_hasta, franja_salida_desde, franja_salida_hasta, hora_cierre_diario, zona_horaria, inicio_control";

export interface FilaUbicacion {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  radio_m: number;
  es_prueba: boolean;
  activa: boolean;
  creado_en: string;
}

export async function leerConfigMarcacion(sb: SupabaseClient): Promise<ConfigMarcacion> {
  const { data, error } = await sb
    .from("configuracion")
    .select(COLUMNAS_CONFIG_MARCACION)
    .eq("id", 1)
    .single<ConfigMarcacion>();
  if (error || !data) throw new Error(`No se pudo leer la configuración: ${error?.message}`);
  return data;
}

/** El colegio (si tiene coordenadas) más las ubicaciones activas. */
export function puntosPermitidos(
  cfg: ConfigMarcacion,
  ubicaciones: FilaUbicacion[],
): PuntoPermitido[] {
  const puntos: PuntoPermitido[] = [];
  if (cfg.colegio_lat !== null && cfg.colegio_lng !== null) {
    puntos.push({
      nombre: "Colegio",
      centro: { lat: cfg.colegio_lat, lng: cfg.colegio_lng },
      radioM: cfg.radio_m,
      esPrueba: false,
    });
  }
  for (const u of ubicaciones) {
    if (!u.activa) continue;
    puntos.push({
      nombre: u.nombre,
      centro: { lat: u.lat, lng: u.lng },
      radioM: u.radio_m,
      esPrueba: u.es_prueba,
    });
  }
  return puntos;
}

export const enlaceMapa = (lat: number, lng: number) =>
  `https://www.google.com/maps?q=${lat},${lng}`;
