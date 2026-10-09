/** Lectura de registros de asistencia para el panel y los reportes. */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { EstadoAsistencia } from "@/types";
import type { RegistroEstadistica } from "@/lib/reglas/estadisticas";
import { diferenciaMin } from "@/lib/reglas/estados";
import { horaEnZona, sumarDias, fechaUTC } from "@/lib/reglas/tiempo";
import { traerTodo } from "./categorias";

export type Periodo = "mes" | "anterior" | "30d";

export interface Rango {
  desde: string;
  hasta: string;
  etiqueta: string;
  anterior: { desde: string; hasta: string };
}

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** Rango de fechas de un período y el período anterior de igual duración (para comparar). */
export function rangoPeriodo(periodo: Periodo, hoy: string): Rango {
  const [a, m] = hoy.split("-").map(Number) as [number, number];
  const inicioMes = `${a}-${String(m).padStart(2, "0")}-01`;
  let desde: string, hasta: string, etiqueta: string;
  if (periodo === "anterior") {
    hasta = sumarDias(inicioMes, -1);
    desde = hasta.slice(0, 8) + "01";
    etiqueta = `${MESES[Number(hasta.slice(5, 7)) - 1]} ${hasta.slice(0, 4)}`;
  } else if (periodo === "30d") {
    desde = sumarDias(hoy, -29);
    hasta = hoy;
    etiqueta = "últimos 30 días";
  } else {
    desde = inicioMes;
    hasta = hoy;
    etiqueta = `${MESES[m - 1]} ${a}`;
  }
  const dias = Math.round((fechaUTC(hasta).getTime() - fechaUTC(desde).getTime()) / 86_400_000) + 1;
  return {
    desde,
    hasta,
    etiqueta,
    anterior: { desde: sumarDias(desde, -dias), hasta: sumarDias(desde, -1) },
  };
}

interface FilaRegistro {
  fecha: string;
  personal_id: string;
  estado: EstadoAsistencia;
  hora_entrada: string | null;
  hora_salida: string | null;
  hora_esperada_entrada: string | null;
  horas_trabajadas: number | string | null;
  senalado: boolean;
  revisado_por: string | null;
  entrada_metodo: string | null;
  observacion: string | null;
  es_demo: boolean;
  personal: { categoria_id: string };
}

export interface RegistroCompleto extends RegistroEstadistica {
  horaEntrada: string | null;
  horaSalida: string | null;
  senaladoPendiente: boolean;
  metodo: string | null;
  observacion: string | null;
  esDemo: boolean;
}

export async function cargarRegistros(
  sb: SupabaseClient,
  desde: string,
  hasta: string,
  categoriaId?: string | null,
): Promise<RegistroCompleto[]> {
  const filas = await traerTodo<FilaRegistro>((i, f) => {
    let q = sb
      .from("registros_asistencia")
      .select(
        "fecha, personal_id, estado, hora_entrada, hora_salida, hora_esperada_entrada, horas_trabajadas, senalado, revisado_por, entrada_metodo, observacion, es_demo, personal!inner(categoria_id)",
      )
      .gte("fecha", desde)
      .lte("fecha", hasta)
      .order("fecha")
      .order("id");
    if (categoriaId) q = q.eq("personal.categoria_id", categoriaId);
    return q.range(i, f);
  });
  return filas.map((r) => {
    const horaEntrada = r.hora_entrada ? horaEnZona(r.hora_entrada) : null;
    return {
      fecha: r.fecha,
      personalId: r.personal_id,
      categoriaId: r.personal.categoria_id,
      estado: r.estado,
      diferenciaMin:
        horaEntrada && r.hora_esperada_entrada
          ? diferenciaMin(horaEntrada, r.hora_esperada_entrada.slice(0, 5))
          : null,
      horas: r.horas_trabajadas === null ? null : Number(r.horas_trabajadas),
      horaEntrada,
      horaSalida: r.hora_salida ? horaEnZona(r.hora_salida) : null,
      senaladoPendiente: r.senalado && !r.revisado_por,
      metodo: r.entrada_metodo,
      observacion: r.observacion,
      esDemo: r.es_demo,
    };
  });
}
