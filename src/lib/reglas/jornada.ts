/**
 * R0 · Resolución de la jornada de un día.
 * Ver Documentacion/03-Diseno/Reglas-de-negocio.md
 */
import type { ExcepcionHorario, Jornada, ReglaDelDia } from "@/types";
import { diaSemanaISO, horaAMinutos } from "./tiempo";

export interface EntradaResolverJornada {
  fecha: string; // "AAAA-MM-DD" (día en que INICIA la jornada)
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
      nocturna: esNocturna(excepcion.horaEntrada, excepcion.horaSalida),
    };
  }

  if (!jornada || !jornada.diasLaborables.includes(dia)) return null;

  return {
    horaEntrada: jornada.horaEntrada,
    horaSalida: jornada.horaSalida,
    toleranciaMin: jornada.toleranciaMin,
    pausaMin: jornada.pausaMin,
    nocturna: jornada.nocturna ?? esNocturna(jornada.horaEntrada, jornada.horaSalida),
  };
}

/** Una jornada es nocturna cuando la salida es anterior a la entrada (cruza la medianoche). */
export function esNocturna(entrada: string, salida: string): boolean {
  return horaAMinutos(salida) < horaAMinutos(entrada);
}

/** Duración de la jornada en minutos (considera el cruce de medianoche). */
export function duracionJornadaMin(entrada: string, salida: string): number {
  const d = horaAMinutos(salida) - horaAMinutos(entrada);
  return d > 0 ? d : d + 24 * 60;
}

/**
 * Fecha a la que pertenece una marcación hecha a una hora local dada.
 * Una marcación de madrugada (antes de `limiteMadrugada`) de una jornada nocturna
 * pertenece al día anterior, porque la jornada comenzó la noche previa.
 */
export function fechaDeJornada(
  fechaLocal: string,
  minutosLocales: number,
  jornadaNocturnaAyer: boolean,
  limiteMadrugada = 12 * 60,
): string {
  if (jornadaNocturnaAyer && minutosLocales < limiteMadrugada) {
    const d = new Date(`${fechaLocal}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  }
  return fechaLocal;
}
