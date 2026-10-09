/** Lecturas de jornadas/horarios/feriados y conversión al formato de las reglas puras. */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DiaSemana, ExcepcionHorario, Jornada } from "@/types";
import { horaCorta } from "@/lib/fecha";

export interface FilaJornada {
  id: string;
  nombre: string;
  hora_entrada: string;
  hora_salida: string;
  tolerancia_min: number;
  pausa_min: number;
  dias_laborables: number[];
  activa: boolean;
  nocturna: boolean;
}

export interface FilaHorario {
  dia_semana: number;
  hora_entrada: string | null;
  hora_salida: string | null;
  tolerancia_min: number | null;
  libre: boolean;
}

export const COLUMNAS_JORNADA =
  "id, nombre, hora_entrada, hora_salida, tolerancia_min, pausa_min, dias_laborables, activa, nocturna";

export async function listarJornadas(sb: SupabaseClient, soloActivas = false) {
  let q = sb.from("jornadas").select(COLUMNAS_JORNADA).order("nombre");
  if (soloActivas) q = q.eq("activa", true);
  const { data } = await q;
  return (data ?? []) as FilaJornada[];
}

export function aJornada(f: FilaJornada): Jornada {
  return {
    horaEntrada: horaCorta(f.hora_entrada),
    horaSalida: horaCorta(f.hora_salida),
    toleranciaMin: f.tolerancia_min,
    pausaMin: f.pausa_min,
    diasLaborables: f.dias_laborables as DiaSemana[],
    nocturna: f.nocturna,
  };
}

export function aExcepcion(f: FilaHorario): ExcepcionHorario {
  return {
    diaSemana: f.dia_semana as DiaSemana,
    horaEntrada: horaCorta(f.hora_entrada),
    horaSalida: horaCorta(f.hora_salida),
    toleranciaMin: f.tolerancia_min,
    libre: f.libre,
  };
}

const ABREV = ["", "L", "M", "X", "J", "V", "S", "D"];
/** [1,2,3,4,5] → "L a V"; [1,3,5] → "L, X, V" */
export function resumenDias(dias: number[]): string {
  const d = [...dias].sort();
  const consecutivos = d.length > 2 && d.every((v, i) => i === 0 || v === (d[i - 1] ?? 0) + 1);
  if (consecutivos) return `${ABREV[d[0]!]} a ${ABREV[d[d.length - 1]!]}`;
  return d.map((v) => ABREV[v]).join(", ");
}
