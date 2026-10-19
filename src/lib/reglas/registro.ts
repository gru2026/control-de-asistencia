/**
 * Registro del día en el PC (R12 asistido y contingencia de R6).
 * Ver Documentacion/03-Diseno/Reglas-de-negocio.md
 */
import type { EstadoAsistencia, ReglaDelDia } from "@/types";
import type { TipoMarcacion } from "./marcacion";
import { horaAMinutos, horaEnZona, instanteLocal } from "./tiempo";

export type ClaveFila =
  "pendiente" | "presente" | "tarde" | "falta" | "permiso" | "sin_salida" | "no_programado";

export interface RegistroFila {
  horaEntrada: string | null;
  horaSalida: string | null;
  estado: EstadoAsistencia;
  salidaNoRegistrada?: boolean;
  esDemo?: boolean;
}

/** Estado que se muestra en la tabla y la marcación que se puede hacer desde el PC. */
export function estadoFila(p: {
  regla: ReglaDelDia | null;
  registro: RegistroFila | null | undefined;
  tienePermiso: boolean;
}): { clave: ClaveFila; accion: TipoMarcacion | null } {
  const reg = p.registro && !p.registro.esDemo ? p.registro : null;
  if (reg?.horaEntrada) {
    if (reg.horaSalida) return { clave: reg.estado as ClaveFila, accion: null };
    return {
      clave: reg.salidaNoRegistrada ? "sin_salida" : (reg.estado as ClaveFila),
      accion: "salida",
    };
  }
  // Día cerrado como falta o permiso: se puede corregir marcando la entrada.
  if (reg) return { clave: reg.estado as ClaveFila, accion: p.regla ? "entrada" : null };
  if (!p.regla) return { clave: "no_programado", accion: null };
  return { clave: p.tienePermiso ? "permiso" : "pendiente", accion: "entrada" };
}

/**
 * Instante de una hora escrita a mano para el día `fecha`. En jornadas nocturnas,
 * una hora de la mañana (antes de las 12:00) es del día siguiente.
 */
export function instanteManual(
  fecha: string,
  hora: string,
  regla: ReglaDelDia | null,
  desfaseUTC = -240,
): Date {
  const min = horaAMinutos(hora);
  const siguiente = !!regla?.nocturna && min < 12 * 60;
  return instanteLocal(fecha, min + (siguiente ? 24 * 60 : 0), desfaseUTC);
}

const MAX_JORNADA_MS = 20 * 60 * 60_000;

/** null si la hora es aceptable; si no, el mensaje para la persona que registra. */
export function validarInstante(p: {
  tipo: TipoMarcacion;
  instante: Date;
  ahora: Date;
  entrada?: Date | null;
}): string | null {
  if (p.instante.getTime() > p.ahora.getTime() + 60_000) {
    return "La hora no puede ser posterior a la actual.";
  }
  if (p.tipo === "salida" && p.entrada) {
    if (p.instante < p.entrada) {
      return `La salida no puede ser anterior a la entrada (${horaEnZona(p.entrada)}).`;
    }
    if (p.instante.getTime() - p.entrada.getTime() > MAX_JORNADA_MS) {
      return "Revise la hora: la jornada superaría 20 horas.";
    }
  }
  return null;
}

/** Motivo de la señal de una hora registrada a mano. */
export const motivoManual = (tipo: TipoMarcacion, observacion: string) =>
  `Hora de ${tipo} registrada a mano: ${observacion}`;
