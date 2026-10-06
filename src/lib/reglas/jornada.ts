/**
 * R0 · Resolución de la jornada de un día.
 * Ver Documentacion/03-Diseno/Reglas-de-negocio.md
 */
import type { ExcepcionHorario, Jornada, ReglaDelDia } from "@/types";
import { diaSemanaISO } from "./tiempo";

export interface EntradaResolverJornada {
  fecha: string; // "AAAA-MM-DD"
  jornada: Jornada | null;
  excepciones?: ExcepcionHorario[];
  feriados?: string[]; // fechas "AAAA-MM-DD"
}

/** Devuelve la regla efectiva del día, o null si el día no es laborable. */
export function resolverJornada({
  fecha,
  jornada,
  excepciones = [],
  feriados = [],
}: EntradaResolverJornada): ReglaDelDia | null {
  if (feriados.includes(fecha)) return null;

  const dia = diaSemanaISO(fecha);
  const excepcion = excepciones.find((e) => e.diaSemana === dia);

  if (excepcion) {
    if (excepcion.libre) return null;
    return {
      horaEntrada: excepcion.horaEntrada,
      horaSalida: excepcion.horaSalida,
      toleranciaMin: excepcion.toleranciaMin ?? jornada?.toleranciaMin ?? 0,
      pausaMin: jornada?.pausaMin ?? 0,
    };
  }

  if (!jornada || !jornada.diasLaborables.includes(dia)) return null;

  return {
    horaEntrada: jornada.horaEntrada,
    horaSalida: jornada.horaSalida,
    toleranciaMin: jornada.toleranciaMin,
    pausaMin: jornada.pausaMin,
  };
}
