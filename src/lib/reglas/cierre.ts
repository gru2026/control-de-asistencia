/**
 * R3 · Cierre diario. Función pura: recibe el estado actual y devuelve qué
 * escribir. Es idempotente porque solo actúa sobre lo que aún no está cerrado.
 * Ver Documentacion/03-Diseno/Reglas-de-negocio.md
 */
import type { ExcepcionHorario, Jornada, ReglaDelDia } from "@/types";
import { resolverJornada } from "./jornada";
import { estadoSinMarcacion } from "./estados";
import { permisoCubre, type PermisoRango } from "./permisos";
import { horaAMinutos, instanteLocal } from "./tiempo";

export interface PersonaCierre {
  id: string;
  fechaIngreso?: string | null;
  jornada: Jornada | null;
  excepciones: ExcepcionHorario[];
}

export interface RegistroCierre {
  personalId: string;
  fecha: string;
  horaEntrada: string | null;
  horaSalida: string | null;
  salidaNoRegistrada: boolean;
}

export interface Ausencia {
  personalId: string;
  fecha: string;
  estado: "falta" | "permiso";
  regla: ReglaDelDia;
}

export interface PlanCierre {
  ausencias: Ausencia[];
  sinSalida: { personalId: string; fecha: string }[];
}

/** Instante en que termina la jornada de un día (las nocturnas terminan al día siguiente). */
export function finDeJornada(fecha: string, regla: ReglaDelDia, desfaseUTC = -240): Date {
  const fin = horaAMinutos(regla.horaSalida) + (regla.nocturna ? 24 * 60 : 0);
  return instanteLocal(fecha, fin, desfaseUTC);
}

/**
 * @param fechas días a revisar (normalmente ayer y hoy)
 * @param margenSalidaMin tiempo de gracia tras la salida esperada antes de dar la salida por no registrada
 */
export function planificarCierre(p: {
  fechas: string[];
  ahora: Date;
  personas: PersonaCierre[];
  registros: RegistroCierre[];
  permisos: PermisoRango[];
  feriados: string[];
  margenSalidaMin?: number;
}): PlanCierre {
  const margen = (p.margenSalidaMin ?? 60) * 60_000;
  const porClave = new Map(p.registros.map((r) => [`${r.personalId}|${r.fecha}`, r]));
  const plan: PlanCierre = { ausencias: [], sinSalida: [] };

  for (const fecha of p.fechas) {
    for (const persona of p.personas) {
      if (persona.fechaIngreso && persona.fechaIngreso > fecha) continue;
      const regla = resolverJornada({
        fecha,
        jornada: persona.jornada,
        excepciones: persona.excepciones,
        feriados: p.feriados,
      });
      if (!regla) continue;
      const fin = finDeJornada(fecha, regla).getTime();
      if (fin > p.ahora.getTime()) continue; // la jornada aún no termina

      const reg = porClave.get(`${persona.id}|${fecha}`);
      if (!reg) {
        const estado = estadoSinMarcacion(permisoCubre(p.permisos, persona.id, fecha));
        plan.ausencias.push({ personalId: persona.id, fecha, estado, regla });
      } else if (
        reg.horaEntrada &&
        !reg.horaSalida &&
        !reg.salidaNoRegistrada &&
        fin + margen <= p.ahora.getTime()
      ) {
        plan.sinSalida.push({ personalId: persona.id, fecha });
      }
    }
  }
  return plan;
}
