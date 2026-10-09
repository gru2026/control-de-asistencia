/**
 * Contexto del día para marcar (lo usan la página /asistencia y /api/marcacion).
 * Resuelve a qué fecha pertenece la marcación (jornadas nocturnas), la regla
 * del día (R0) y el registro existente.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { EstadoAsistencia, ReglaDelDia } from "@/types";
import { hoyEnZona } from "@/lib/fecha";
import {
  aExcepcion,
  aJornada,
  COLUMNAS_JORNADA,
  type FilaHorario,
  type FilaJornada,
} from "@/lib/datos/jornadas";
import { resolverJornada } from "@/lib/reglas/jornada";
import {
  fechaDeMarcacion,
  siguienteMarcacion,
  type RegistroDelDia,
  type Siguiente,
} from "@/lib/reglas/marcacion";
import { horaAMinutos, horaEnZona, sumarDias } from "@/lib/reglas/tiempo";

export interface FichaMarcacion {
  id: string;
  nombre: string;
  apellido: string;
  estado: "activo" | "inactivo";
  jornadas: FilaJornada | null;
  horarios: FilaHorario[];
}

export interface FilaRegistroDia {
  id: string;
  fecha: string;
  estado: EstadoAsistencia;
  hora_entrada: string | null;
  hora_salida: string | null;
  hora_esperada_entrada: string | null;
  hora_esperada_salida: string | null;
  tolerancia_aplicada: number | null;
  pausa_aplicada: number | null;
  horas_trabajadas: number | null;
  senalado: boolean;
  motivo_senal: string | null;
  es_demo: boolean;
}

const COLUMNAS_REGISTRO =
  "id, fecha, estado, hora_entrada, hora_salida, hora_esperada_entrada, hora_esperada_salida, tolerancia_aplicada, pausa_aplicada, horas_trabajadas, senalado, motivo_senal, es_demo";

export interface ContextoDia {
  ficha: FichaMarcacion;
  ahora: Date;
  /** Hora local del colegio "HH:MM" y en minutos. */
  horaLocal: string;
  minutosLocales: number;
  /** Fecha a la que pertenece la marcación (puede ser ayer en jornadas nocturnas). */
  fecha: string;
  feriado: string | null;
  regla: ReglaDelDia | null;
  registro: FilaRegistroDia | null;
  siguiente: Siguiente;
}

export const aRegistroDelDia = (r: FilaRegistroDia | null): RegistroDelDia | null =>
  r
    ? {
        horaEntrada: r.hora_entrada,
        horaSalida: r.hora_salida,
        estado: r.estado,
        esDemo: r.es_demo,
      }
    : null;

export async function cargarFicha(
  sb: SupabaseClient,
  usuarioId: string,
): Promise<FichaMarcacion | null> {
  const { data } = await sb
    .from("personal")
    .select(
      `id, nombre, apellido, estado, jornadas(${COLUMNAS_JORNADA}), horarios(dia_semana, hora_entrada, hora_salida, tolerancia_min, libre)`,
    )
    .eq("usuario_id", usuarioId)
    .maybeSingle<FichaMarcacion>();
  return data ?? null;
}

export async function contextoDelDia(
  sb: SupabaseClient,
  ficha: FichaMarcacion,
  ahora = new Date(),
): Promise<ContextoDia> {
  const hoy = hoyEnZona(undefined, ahora);
  const ayer = sumarDias(hoy, -1);
  const horaLocal = horaEnZona(ahora);
  const minutosLocales = horaAMinutos(horaLocal);

  const [{ data: regs }, { data: fers }] = await Promise.all([
    sb
      .from("registros_asistencia")
      .select(COLUMNAS_REGISTRO)
      .eq("personal_id", ficha.id)
      .in("fecha", [ayer, hoy]),
    sb.from("feriados").select("fecha, descripcion").in("fecha", [ayer, hoy]),
  ]);
  const registros = (regs ?? []) as FilaRegistroDia[];
  const feriados = (fers ?? []) as { fecha: string; descripcion: string }[];
  const jornada = ficha.jornadas ? aJornada(ficha.jornadas) : null;
  const excepciones = ficha.horarios.map(aExcepcion);
  const regla = (fecha: string) =>
    resolverJornada({ fecha, jornada, excepciones, feriados: feriados.map((f) => f.fecha) });
  const registroDe = (fecha: string) => registros.find((r) => r.fecha === fecha) ?? null;

  const fecha = fechaDeMarcacion({
    fechaLocal: hoy,
    minutosLocales,
    reglaAyer: regla(ayer),
    registroAyer: aRegistroDelDia(registroDe(ayer)),
  });
  const registro = registroDe(fecha);
  return {
    ficha,
    ahora,
    horaLocal,
    minutosLocales,
    fecha,
    feriado: feriados.find((f) => f.fecha === fecha)?.descripcion ?? null,
    regla: regla(fecha),
    registro,
    siguiente: siguienteMarcacion(aRegistroDelDia(registro)),
  };
}
