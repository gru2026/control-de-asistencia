/**
 * R3 · Cierre diario. Lo ejecuta Vercel Cron (todos los días a las 18:00 de
 * Caracas) o la directiva desde Ajustes. Revisa ayer y hoy: cierra las jornadas
 * ya terminadas (incluidas las nocturnas que empezaron ayer). Es idempotente.
 */
import { clienteAdmin } from "@/lib/supabase/servidor";
import { hoyEnZona } from "@/lib/fecha";
import {
  aExcepcion,
  aJornada,
  COLUMNAS_JORNADA,
  type FilaHorario,
  type FilaJornada,
} from "@/lib/datos/jornadas";
import { planificarCierre, type PersonaCierre, type RegistroCierre } from "@/lib/reglas/cierre";
import { sumarDias } from "@/lib/reglas/tiempo";
import { plural } from "@/lib/formato";
import { notificarRoles } from "./notificaciones";

export interface ResumenCierre {
  fechas: string[];
  faltas: number;
  permisos: number;
  sinSalida: number;
  avisos: number;
  /** Sin fecha de inicio del control, el cierre no crea faltas. */
  desactivado?: boolean;
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
function fechaBreve(f: string): string {
  const d = new Date(`${f}T00:00:00Z`);
  return `${DIAS[d.getUTCDay()]} ${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`;
}

function listaNombres(nombres: string[], max = 4): string {
  if (nombres.length <= max) return nombres.join(", ");
  return `${nombres.slice(0, max).join(", ")} y ${nombres.length - max} más`;
}

export async function ejecutarCierre(p: {
  origen: "cron" | "manual";
  usuarioId?: string | null;
  ahora?: Date;
}): Promise<ResumenCierre> {
  const sb = clienteAdmin();
  const ahora = p.ahora ?? new Date();
  const hoy = hoyEnZona(undefined, ahora);
  const ayer = sumarDias(hoy, -1);
  const { data: cfg } = await sb
    .from("configuracion")
    .select("inicio_control")
    .eq("id", 1)
    .single();
  const inicio = (cfg?.inicio_control as string | null) ?? null;
  // Solo se cierran días desde el inicio del control de asistencia.
  const fechas = inicio ? [ayer, hoy].filter((f) => f >= inicio) : [];

  type FilaPersona = {
    id: string;
    nombre: string;
    apellido: string;
    fecha_ingreso: string | null;
    jornadas: FilaJornada | null;
    horarios: FilaHorario[];
  };
  const [gente, regs, perms, fers] = await Promise.all([
    sb
      .from("personal")
      .select(
        `id, nombre, apellido, fecha_ingreso, jornadas(${COLUMNAS_JORNADA}), horarios(dia_semana, hora_entrada, hora_salida, tolerancia_min, libre)`,
      )
      .eq("estado", "activo"),
    sb
      .from("registros_asistencia")
      .select("personal_id, fecha, hora_entrada, hora_salida, salida_no_registrada")
      .in("fecha", fechas),
    sb
      .from("permisos")
      .select("personal_id, fecha_desde, fecha_hasta")
      .lte("fecha_desde", hoy)
      .gte("fecha_hasta", ayer),
    sb.from("feriados").select("fecha").in("fecha", fechas),
  ]);
  for (const r of [gente, regs, perms, fers]) if (r.error) throw new Error(r.error.message);

  const filas = (gente.data ?? []) as unknown as FilaPersona[];
  const nombrePorId = new Map(filas.map((f) => [f.id, `${f.nombre} ${f.apellido}`]));
  const personas: PersonaCierre[] = filas.map((f) => ({
    id: f.id,
    fechaIngreso: f.fecha_ingreso,
    jornada: f.jornadas ? aJornada(f.jornadas) : null,
    excepciones: f.horarios.map(aExcepcion),
  }));
  const registros: RegistroCierre[] = (regs.data ?? []).map((r) => ({
    personalId: r.personal_id,
    fecha: r.fecha,
    horaEntrada: r.hora_entrada,
    horaSalida: r.hora_salida,
    salidaNoRegistrada: r.salida_no_registrada,
  }));

  const plan = planificarCierre({
    fechas,
    ahora,
    personas,
    registros,
    permisos: (perms.data ?? []).map((x) => ({
      personalId: x.personal_id,
      desde: x.fecha_desde,
      hasta: x.fecha_hasta,
    })),
    feriados: (fers.data ?? []).map((f) => f.fecha),
  });

  // 1 · Faltas y permisos de quien no marcó (ignora si otro proceso ya los creó)
  let insertados: { personal_id: string; fecha: string; estado: string }[] = [];
  if (plan.ausencias.length) {
    const { data, error } = await sb
      .from("registros_asistencia")
      .upsert(
        plan.ausencias.map((a) => ({
          personal_id: a.personalId,
          fecha: a.fecha,
          estado: a.estado,
          hora_esperada_entrada: a.regla.horaEntrada,
          hora_esperada_salida: a.regla.horaSalida,
          tolerancia_aplicada: a.regla.toleranciaMin,
          pausa_aplicada: a.regla.pausaMin,
          observacion: "Cierre automático: sin marcación",
        })),
        { onConflict: "personal_id,fecha", ignoreDuplicates: true },
      )
      .select("personal_id, fecha, estado");
    if (error) throw new Error(error.message);
    insertados = data ?? [];
  }

  // 2 · Entradas sin salida
  for (const s of plan.sinSalida) {
    const { error } = await sb
      .from("registros_asistencia")
      .update({ salida_no_registrada: true, horas_trabajadas: null })
      .eq("personal_id", s.personalId)
      .eq("fecha", s.fecha)
      .is("hora_salida", null);
    if (error) throw new Error(error.message);
  }

  // 3 · Avisos (uno por día y tipo; la clave evita repetirlos)
  let avisos = 0;
  for (const fecha of fechas) {
    const faltas = insertados.filter((r) => r.fecha === fecha && r.estado === "falta");
    if (faltas.length) {
      avisos += await notificarRoles(["directiva", "secretaria"], {
        tipo: "falta",
        mensaje: `${plural(faltas.length, "falta", "faltas")} el ${fechaBreve(fecha)}: ${listaNombres(faltas.map((f) => nombrePorId.get(f.personal_id) ?? "—"))}.`,
        enlace: "/panel",
        clave: `faltas:${fecha}`,
      });
    }
    const sinSalida = plan.sinSalida.filter((s) => s.fecha === fecha);
    if (sinSalida.length) {
      avisos += await notificarRoles(["secretaria", "directiva"], {
        tipo: "salida",
        mensaje: `${plural(sinSalida.length, "persona no marcó", "personas no marcaron")} la salida el ${fechaBreve(fecha)}: ${listaNombres(sinSalida.map((s) => nombrePorId.get(s.personalId) ?? "—"))}. Complete la hora de salida.`,
        enlace: "/panel",
        clave: `salida:${fecha}`,
      });
    }
  }

  // 4 · QR vencido o por vencer
  const { data: qr } = await sb
    .from("codigos_qr")
    .select("id, vigente_hasta")
    .eq("activo", true)
    .maybeSingle();
  if (qr?.vigente_hasta) {
    if (qr.vigente_hasta < hoy) {
      avisos += await notificarRoles(["directiva"], {
        tipo: "qr",
        mensaje:
          "El código QR de la entrada venció y el personal no puede marcar. Genere uno nuevo.",
        enlace: "/configuracion/qr",
        clave: `qr-vencido:${qr.id}`,
      });
    } else if (qr.vigente_hasta <= sumarDias(hoy, 3)) {
      avisos += await notificarRoles(["directiva"], {
        tipo: "qr",
        mensaje: `El código QR de la entrada vence el ${fechaBreve(qr.vigente_hasta)}. Prepare uno nuevo.`,
        enlace: "/configuracion/qr",
        clave: `qr-por-vencer:${qr.id}`,
      });
    }
  }

  const resumen: ResumenCierre = {
    ...(inicio ? {} : { desactivado: true }),
    fechas,
    faltas: insertados.filter((r) => r.estado === "falta").length,
    permisos: insertados.filter((r) => r.estado === "permiso").length,
    sinSalida: plan.sinSalida.length,
    avisos,
  };
  await sb.from("cierres_diarios").insert({
    origen: p.origen,
    ejecutado_por: p.usuarioId ?? null,
    resumen,
  });
  return resumen;
}
