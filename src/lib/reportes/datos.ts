/** Carga los datos de una planilla diaria desde la BD (sesión de directiva o secretaría). */
import type { SupabaseClient } from "@supabase/supabase-js";
import { listarCategorias } from "@/lib/datos/categorias";
import { diferenciaMin } from "@/lib/reglas/estados";
import { horaEnZona } from "@/lib/reglas/tiempo";
import type { EstadoAsistencia } from "@/types";
import {
  categoriasDelTipo,
  construirPlanilla,
  type MarcaPlanilla,
  type PersonaPlanilla,
  type Planilla,
  type TipoPlanilla,
} from "./planilla";

export interface Institucion {
  encabezado: string[];
  nombre: string;
  ubicacion: string;
  codDea: string | null;
  firmante: { nombre: string | null; cedula: string | null; cargo: string | null };
}

export async function cargarInstitucion(sb: SupabaseClient): Promise<Institucion> {
  const { data } = await sb
    .from("configuracion")
    .select(
      "encabezado, nombre_planilla, ubicacion, cod_dea, firmante_nombre, firmante_cedula, firmante_cargo",
    )
    .eq("id", 1)
    .single();
  const c = (data ?? {}) as Record<string, string | null>;
  return {
    encabezado: (c.encabezado ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
    nombre: c.nombre_planilla ?? "",
    ubicacion: c.ubicacion ?? "",
    codDea: c.cod_dea ?? null,
    firmante: {
      nombre: c.firmante_nombre ?? null,
      cedula: c.firmante_cedula ?? null,
      cargo: c.firmante_cargo ?? null,
    },
  };
}

export async function cargarPlanilla(
  sb: SupabaseClient,
  tipo: TipoPlanilla,
  fecha: string,
): Promise<Planilla> {
  const categorias = await listarCategorias(sb);
  const ids = categoriasDelTipo(tipo, categorias).map((c) => c.id);
  if (!ids.length) return construirPlanilla(tipo, fecha, categorias, [], new Map());

  const [{ data: per }, { data: regs }] = await Promise.all([
    sb
      .from("personal")
      .select(
        "id, nombre, apellido, cedula, carga_horaria, categoria_id, estado, jornadas(nocturna)",
      )
      .in("categoria_id", ids)
      .limit(2000),
    sb
      .from("registros_asistencia")
      .select("personal_id, estado, hora_entrada, hora_salida, hora_esperada_entrada, observacion")
      .eq("fecha", fecha)
      .limit(2000),
  ]);
  const marcas = new Map<string, MarcaPlanilla>();
  for (const r of (regs ?? []) as {
    personal_id: string;
    estado: EstadoAsistencia;
    hora_entrada: string | null;
    hora_salida: string | null;
    hora_esperada_entrada: string | null;
    observacion: string | null;
  }[]) {
    const he = r.hora_entrada ? horaEnZona(r.hora_entrada) : null;
    marcas.set(r.personal_id, {
      horaEntrada: he,
      horaSalida: r.hora_salida ? horaEnZona(r.hora_salida) : null,
      estado: r.estado,
      diferenciaMin:
        he && r.hora_esperada_entrada
          ? diferenciaMin(he, r.hora_esperada_entrada.slice(0, 5))
          : null,
      observacion: r.observacion,
    });
  }
  // Activos, más los inactivos que tengan registro ese día.
  const personas: PersonaPlanilla[] = (
    (per ?? []) as unknown as (Omit<PersonaPlanilla, "nocturna"> & {
      estado: string;
      jornadas: { nocturna: boolean } | null;
    })[]
  )
    .filter((p) => p.estado === "activo" || marcas.has(p.id))
    .map((p) => ({ ...p, nocturna: p.jornadas?.nocturna ?? false }));
  return construirPlanilla(tipo, fecha, categorias, personas, marcas);
}
