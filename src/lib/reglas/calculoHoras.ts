/**
 * R2 · Horas trabajadas.
 * Ver Documentacion/03-Diseno/Reglas-de-negocio.md
 */
import { redondear2 } from "./tiempo";

/**
 * Horas trabajadas = (salida − entrada − pausa), 2 decimales.
 * Devuelve null si aún no hay salida.
 */
export function horasTrabajadas(entrada: Date, salida: Date | null, pausaMin = 0): number | null {
  if (salida === null) return null;
  const ms = salida.getTime() - entrada.getTime();
  if (Number.isNaN(ms)) throw new Error("Fechas inválidas");
  if (ms < 0) throw new Error("La salida no puede ser anterior a la entrada");
  const minutos = Math.max(0, ms / 60_000 - pausaMin);
  return redondear2(minutos / 60);
}
