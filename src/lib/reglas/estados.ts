/**
 * R1 · Clasificación del día.
 * Ver Documentacion/03-Diseno/Reglas-de-negocio.md
 */
import type { EstadoAsistencia, HoraTexto } from "@/types";
import { horaAMinutos } from "./tiempo";

const DIA = 24 * 60;

/**
 * Minutos entre la hora esperada y la real (negativo = llegó antes).
 * Se normaliza a ±12 h para que una llegada a las 00:15 en una jornada de 22:00
 * cuente como 135 min tarde y no como 21 h antes.
 */
export function diferenciaMin(horaReal: HoraTexto, horaEsperada: HoraTexto): number {
  let d = horaAMinutos(horaReal) - horaAMinutos(horaEsperada);
  if (d > DIA / 2) d -= DIA;
  if (d < -DIA / 2) d += DIA;
  return d;
}

/**
 * Estado al marcar entrada.
 * @param horaReal hora local del colegio "HH:MM"
 * @param horaEsperada hora de entrada esperada "HH:MM"
 * @param toleranciaMin minutos de tolerancia (≥ 0)
 */
export function estadoAlMarcarEntrada(
  horaReal: HoraTexto,
  horaEsperada: HoraTexto,
  toleranciaMin: number,
): Extract<EstadoAsistencia, "presente" | "tarde"> {
  if (!Number.isFinite(toleranciaMin) || toleranciaMin < 0) {
    throw new Error("La tolerancia debe ser un número ≥ 0");
  }
  return diferenciaMin(horaReal, horaEsperada) <= toleranciaMin ? "presente" : "tarde";
}

/** Estado asignado en el cierre diario a quien no marcó entrada. */
export function estadoSinMarcacion(
  tienePermiso: boolean,
): Extract<EstadoAsistencia, "permiso" | "falta"> {
  return tienePermiso ? "permiso" : "falta";
}

/** Minutos de retraso respecto a la hora esperada (0 si llegó a tiempo o antes). */
export function minutosDeRetraso(horaReal: HoraTexto, horaEsperada: HoraTexto): number {
  return Math.max(0, diferenciaMin(horaReal, horaEsperada));
}
