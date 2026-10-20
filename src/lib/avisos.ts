/** Presentación de los avisos (campana y página de avisos). */
import type { NombreIcono } from "@/components/ui/Icono.astro";
import { fechaCorta, hoyEnZona } from "@/lib/fecha";
import { horaEnZona } from "@/lib/reglas/tiempo";

export interface Aviso {
  id: string;
  tipo: string;
  mensaje: string;
  enlace: string | null;
  leida: boolean;
  fecha: string;
}

export const COLUMNAS_AVISO = "id, tipo, mensaje, enlace, leida, fecha";

export const ICONO_AVISO: Record<string, NombreIcono> = {
  falta: "alerta",
  tarde: "reloj",
  senalado: "alerta",
  dispositivo: "telefono",
  salida: "reloj",
  qr: "qr",
  permiso: "permiso",
  sistema: "info",
};

/** "Hoy · 07:15" o "16/10/2026 · 18:00" */
export function cuandoAviso(iso: string): string {
  const dia = hoyEnZona(undefined, new Date(iso));
  return `${dia === hoyEnZona() ? "Hoy" : fechaCorta(dia)} · ${horaEnZona(iso)}`;
}
