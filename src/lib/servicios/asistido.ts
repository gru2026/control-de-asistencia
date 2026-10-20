/**
 * R12 · Marcación asistida desde el PC (secretaría o directiva) y contingencia
 * con hora escrita a mano. Solo servidor; verificar el rol antes de llamar.
 */
import { clienteAdmin } from "@/lib/supabase/servidor";
import {
  aExcepcion,
  aJornada,
  COLUMNAS_JORNADA,
  type FilaHorario,
  type FilaJornada,
} from "@/lib/datos/jornadas";
import { resolverJornada } from "@/lib/reglas/jornada";
import { estadoAlMarcarEntrada } from "@/lib/reglas/estados";
import { horasTrabajadas } from "@/lib/reglas/calculoHoras";
import { horaEnZona } from "@/lib/reglas/tiempo";
import { instanteManual, motivoManual, validarInstante } from "@/lib/reglas/registro";
import type { TipoMarcacion } from "@/lib/reglas/marcacion";

export type ResultadoAsistido =
  { ok: true; mensaje: string; deshacible: boolean } | { ok: false; mensaje: string };

export async function marcarAsistido(p: {
  personalId: string;
  fecha: string;
  tipo: TipoMarcacion;
  /** "HH:MM" escrita a mano; vacío = hora actual del servidor. */
  horaManual: string | null;
  observacion: string | null;
  usuarioId: string;
  ahora?: Date;
}): Promise<ResultadoAsistido> {
  const sb = clienteAdmin();
  const ahora = p.ahora ?? new Date();

  const [{ data: persona }, { data: fer }, { data: reg }] = await Promise.all([
    sb
      .from("personal")
      .select(
        `id, nombre, apellido, estado, jornadas(${COLUMNAS_JORNADA}), horarios(dia_semana, hora_entrada, hora_salida, tolerancia_min, libre)`,
      )
      .eq("id", p.personalId)
      .maybeSingle<{
        id: string;
        nombre: string;
        apellido: string;
        estado: string;
        jornadas: FilaJornada | null;
        horarios: FilaHorario[];
      }>(),
    sb.from("feriados").select("fecha").eq("fecha", p.fecha).maybeSingle(),
    sb
      .from("registros_asistencia")
      .select(
        "id, estado, hora_entrada, hora_salida, pausa_aplicada, senalado, motivo_senal, es_demo, observacion",
      )
      .eq("personal_id", p.personalId)
      .eq("fecha", p.fecha)
      .maybeSingle(),
  ]);
  if (!persona) return { ok: false, mensaje: "La persona no existe." };
  if (persona.estado !== "activo") return { ok: false, mensaje: "La persona está inactiva." };
  const nombre = `${persona.nombre} ${persona.apellido}`;

  const regla = resolverJornada({
    fecha: p.fecha,
    jornada: persona.jornadas ? aJornada(persona.jornadas) : null,
    excepciones: persona.horarios.map(aExcepcion),
    feriados: fer ? [p.fecha] : [],
  });

  const manual = !!p.horaManual;
  if (manual && !p.observacion) {
    return {
      ok: false,
      mensaje: "Escriba el motivo de la hora manual (por ejemplo, «falla de conexión»).",
    };
  }
  if (!manual && p.fecha !== fechaDeHoy(ahora, regla?.nocturna ?? false)) {
    return { ok: false, mensaje: "Para un día anterior, escriba la hora a mano." };
  }
  const instante = manual ? instanteManual(p.fecha, p.horaManual!, regla) : ahora;
  const real = reg && !reg.es_demo ? reg : null;
  const metodo = manual ? "manual" : "asistido";
  const senal = manual ? motivoManual(p.tipo, p.observacion!) : null;
  const unir = (...m: (string | null | undefined)[]) => m.filter(Boolean).join(" · ") || null;

  if (p.tipo === "entrada") {
    if (!regla) return { ok: false, mensaje: `${nombre} no tiene jornada ese día.` };
    if (real?.hora_entrada) {
      return {
        ok: false,
        mensaje: `${nombre} ya registró la entrada a las ${horaEnZona(real.hora_entrada)}.`,
      };
    }
    const error = validarInstante({ tipo: "entrada", instante, ahora });
    if (error) return { ok: false, mensaje: error };
    const estado = estadoAlMarcarEntrada(
      horaEnZona(instante),
      regla.horaEntrada,
      regla.toleranciaMin,
    );
    const datos = {
      personal_id: p.personalId,
      fecha: p.fecha,
      hora_entrada: instante.toISOString(),
      hora_esperada_entrada: regla.horaEntrada,
      hora_esperada_salida: regla.horaSalida,
      tolerancia_aplicada: regla.toleranciaMin,
      pausa_aplicada: regla.pausaMin,
      estado,
      entrada_metodo: metodo,
      registrado_por: p.usuarioId,
      senalado: manual || !!real?.senalado,
      motivo_senal: unir(real?.motivo_senal, senal),
      observacion: unir(real?.observacion, p.observacion),
      es_demo: false,
    };
    // Un registro de demostración cede su lugar; una falta o permiso se corrige.
    if (reg?.es_demo) await sb.from("registros_asistencia").delete().eq("id", reg.id);
    const { error: e } = real
      ? await sb
          .from("registros_asistencia")
          .update(datos)
          .eq("id", real.id)
          .is("hora_entrada", null)
      : await sb.from("registros_asistencia").insert(datos);
    if (e) {
      if (e.code === "23505")
        return { ok: false, mensaje: `${nombre} ya tiene un registro ese día.` };
      throw new Error(e.message);
    }
    return {
      ok: true,
      mensaje: `Entrada de ${nombre} registrada a las ${horaEnZona(instante)} (${estado === "presente" ? "a tiempo" : "tarde"}).`,
      // Una falta o permiso corregido no se deshace automáticamente.
      deshacible: !real,
    };
  }

  // Salida
  if (!real?.hora_entrada) return { ok: false, mensaje: `${nombre} no tiene entrada ese día.` };
  if (real.hora_salida) {
    return {
      ok: false,
      mensaje: `${nombre} ya registró la salida a las ${horaEnZona(real.hora_salida)}.`,
    };
  }
  const entrada = new Date(real.hora_entrada);
  const error = validarInstante({ tipo: "salida", instante, ahora, entrada });
  if (error) return { ok: false, mensaje: error };
  const horas = horasTrabajadas(entrada, instante, real.pausa_aplicada ?? 0);
  const { data: hecho, error: e } = await sb
    .from("registros_asistencia")
    .update({
      hora_salida: instante.toISOString(),
      horas_trabajadas: horas,
      salida_no_registrada: false,
      salida_metodo: metodo,
      salida_registrada_por: p.usuarioId,
      senalado: real.senalado || manual,
      motivo_senal: unir(real.motivo_senal, senal),
      observacion: unir(real.observacion, p.observacion),
    })
    .eq("id", real.id)
    .is("hora_salida", null)
    .select("id");
  if (e) throw new Error(e.message);
  if (!hecho?.length) return { ok: false, mensaje: `${nombre} ya registró la salida.` };
  return {
    ok: true,
    mensaje: `Salida de ${nombre} registrada a las ${horaEnZona(instante)}.`,
    deshacible: true,
  };
}

/** Día de la jornada en curso: de madrugada, una jornada nocturna es la de ayer. */
function fechaDeHoy(ahora: Date, nocturna: boolean): string {
  const local = new Date(ahora.getTime() - 4 * 3_600_000);
  if (nocturna && local.getUTCHours() < 12) local.setUTCDate(local.getUTCDate() - 1);
  return local.toISOString().slice(0, 10);
}

/**
 * Revierte una marcación asistida recién hecha por la misma persona (botón
 * «Deshacer» del mensaje). La entrada solo se borra si aún no tiene salida.
 */
export async function deshacerAsistido(p: {
  personalId: string;
  fecha: string;
  tipo: TipoMarcacion;
  usuarioId: string;
}): Promise<boolean> {
  const sb = clienteAdmin();
  const hace = new Date(Date.now() - 15 * 60_000).toISOString();
  if (p.tipo === "entrada") {
    const { data } = await sb
      .from("registros_asistencia")
      .delete()
      .eq("personal_id", p.personalId)
      .eq("fecha", p.fecha)
      .eq("registrado_por", p.usuarioId)
      .in("entrada_metodo", ["asistido", "manual"])
      .is("hora_salida", null)
      .gte("creado_en", hace)
      .select("id");
    return !!data?.length;
  }
  const { data } = await sb
    .from("registros_asistencia")
    .update({
      hora_salida: null,
      horas_trabajadas: null,
      salida_metodo: null,
      salida_registrada_por: null,
    })
    .eq("personal_id", p.personalId)
    .eq("fecha", p.fecha)
    .eq("salida_registrada_por", p.usuarioId)
    .gte("actualizado_en", hace)
    .select("id");
  return !!data?.length;
}
