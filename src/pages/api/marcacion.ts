/**
 * POST /api/marcacion · Marcación por celular con QR + GPS.
 * Valida en el orden de R10 (Documentacion/03-Diseno/Reglas-de-negocio.md);
 * el primer fallo detiene el proceso. La hora es siempre la del servidor.
 */
import type { APIRoute } from "astro";
import { clienteAdmin } from "@/lib/supabase/servidor";
import { hoyEnZona } from "@/lib/fecha";
import { formatoQRValido, hashCodigoQR, qrVigente } from "@/lib/qr";
import { motivoDispositivo, uidValido } from "@/lib/reglas/dispositivos";
import {
  dentroDeFranja,
  evaluarUbicacion,
  validarOrden,
  type TipoMarcacion,
} from "@/lib/reglas/marcacion";
import { estadoAlMarcarEntrada, minutosDeRetraso } from "@/lib/reglas/estados";
import { horasTrabajadas } from "@/lib/reglas/calculoHoras";
import { leerConfigMarcacion, puntosPermitidos, type FilaUbicacion } from "@/lib/datos/marcacion";
import { aRegistroDelDia, cargarFicha, contextoDelDia } from "@/lib/servicios/marcacion";
import { marcarUso, obtenerORegistrar } from "@/lib/servicios/dispositivos";
import { notificarRoles } from "@/lib/servicios/notificaciones";
import { horaCorta } from "@/lib/fecha";
import { textoDuracion } from "@/lib/formato";

export const prerender = false;

type Respuesta =
  | {
      ok: true;
      tipo: TipoMarcacion;
      estado: string;
      hora: string;
      mensaje: string;
      detalle: string | null;
      senalado: boolean;
    }
  | { ok: false; codigo: string; mensaje: string };

const responder = (cuerpo: Respuesta, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
const rechazar = (codigo: string, mensaje: string, status = 422) =>
  responder({ ok: false, codigo, mensaje }, status);

interface Cuerpo {
  tipo?: unknown;
  codigo?: unknown;
  lat?: unknown;
  lng?: unknown;
  precision?: unknown;
  dispositivo_uid?: unknown;
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

export const POST: APIRoute = async ({ request, locals, url }) => {
  // Solo desde la propia aplicación.
  const origen = request.headers.get("Origin");
  if (origen && origen !== url.origin) return rechazar("origen", "Solicitud no permitida.", 403);

  // 1 · Sesión válida y persona activa
  const perfil = locals.perfil;
  if (!perfil) return rechazar("sesion", "Su sesión expiró. Vuelva a iniciar sesión.", 401);

  let cuerpo: Cuerpo;
  try {
    cuerpo = (await request.json()) as Cuerpo;
  } catch {
    return rechazar("formato", "Solicitud no válida.", 400);
  }
  const tipo = cuerpo.tipo === "salida" ? "salida" : cuerpo.tipo === "entrada" ? "entrada" : null;
  if (!tipo) return rechazar("formato", "Solicitud no válida.", 400);

  const sb = clienteAdmin();
  try {
    const ficha = await cargarFicha(sb, perfil.id);
    if (!ficha)
      return rechazar(
        "ficha",
        "Su cuenta no tiene una ficha de personal. Consulte con la directiva.",
        403,
      );
    if (ficha.estado !== "activo") return rechazar("inactivo", "Su cuenta está inactiva.", 403);
    const nombre = `${ficha.nombre} ${ficha.apellido}`;

    // 2 · Dispositivo aprobado (R11)
    if (!uidValido(cuerpo.dispositivo_uid)) {
      return rechazar("dispositivo", "No se pudo identificar este teléfono. Recargue la página.");
    }
    const { dispositivo } = await obtenerORegistrar({
      usuarioId: perfil.id,
      uid: cuerpo.dispositivo_uid,
      userAgent: request.headers.get("User-Agent"),
      nombrePersona: nombre,
      personalId: ficha.id,
    });
    const motivoDisp = motivoDispositivo(dispositivo.estado);
    if (motivoDisp) return rechazar(`dispositivo_${dispositivo.estado}`, motivoDisp);

    // 3 · Código QR vigente (R13)
    const hoy = hoyEnZona();
    const invalido = "Código QR no válido. Escanee el QR vigente de la entrada.";
    if (!formatoQRValido(cuerpo.codigo)) return rechazar("qr", invalido);
    const { data: qr } = await sb
      .from("codigos_qr")
      .select("id, activo, vigente_hasta")
      .eq("token_hash", hashCodigoQR(cuerpo.codigo))
      .maybeSingle();
    if (!qrVigente(qr, hoy)) {
      if (qr?.activo && qr.vigente_hasta) {
        await notificarRoles(["directiva"], {
          tipo: "qr",
          mensaje:
            "El código QR de la entrada venció y el personal no puede marcar. Genere uno nuevo.",
          enlace: "/configuracion/qr",
          clave: `qr-vencido:${qr.id}`,
        }).catch(() => {});
        return rechazar("qr_vencido", "El código QR venció. Avise a la directiva.");
      }
      return rechazar("qr", invalido);
    }

    // 4 · Día laborable (R0) y registro del día
    const ctx = await contextoDelDia(sb, ficha);
    if (tipo === "entrada" && !ctx.regla) {
      return rechazar(
        "no_laborable",
        ctx.feriado ? `Hoy es feriado (${ctx.feriado}).` : "Hoy no es día laborable para usted.",
      );
    }

    // 5 · Franja horaria (solo jornadas diurnas)
    const cfg = await leerConfigMarcacion(sb);
    if (ctx.regla && !ctx.regla.nocturna) {
      const desde = tipo === "entrada" ? cfg.franja_entrada_desde : cfg.franja_salida_desde;
      const hasta = tipo === "entrada" ? cfg.franja_entrada_hasta : cfg.franja_salida_hasta;
      if (!dentroDeFranja(ctx.minutosLocales, desde, hasta)) {
        return rechazar(
          "franja",
          `Fuera del horario permitido para marcar la ${tipo} (${horaCorta(desde)} a ${horaCorta(hasta)}).`,
        );
      }
    }

    // 6–8 · Ubicación (geocerca)
    const lat = num(cuerpo.lat);
    const lng = num(cuerpo.lng);
    const precision = num(cuerpo.precision);
    const posicion =
      lat !== null && lng !== null && precision !== null
        ? { lat, lng, precisionM: precision }
        : null;
    let ubicacion: {
      nombre: string | null;
      distanciaM: number | null;
      senalado: boolean;
      motivo: string | null;
    } = {
      nombre: null,
      distanciaM: null,
      senalado: false,
      motivo: null,
    };
    if (cfg.geocerca_activa) {
      const { data: ubis } = await sb
        .from("ubicaciones")
        .select("id, nombre, lat, lng, radio_m, es_prueba, activa");
      const r = evaluarUbicacion(
        posicion,
        puntosPermitidos(cfg, (ubis ?? []) as FilaUbicacion[]),
        cfg.precision_max_m,
      );
      if (!r.permitido) return rechazar(posicion ? "fuera" : "sin_ubicacion", r.motivo);
      ubicacion = {
        nombre: r.punto.nombre,
        distanciaM: r.distanciaM,
        senalado: r.senalado,
        motivo: r.motivo,
      };
    }

    // 9 · Duplicados y orden (R7)
    const errorOrden = validarOrden(tipo, aRegistroDelDia(ctx.registro));
    if (errorOrden) return rechazar("orden", errorOrden, 409);

    const ahoraIso = ctx.ahora.toISOString();
    const evidencia = {
      lat,
      lng,
      precision_m: precision === null ? null : Math.round(precision),
      qr_id: qr!.id as string,
      dispositivo_id: dispositivo.id,
      distancia_m: ubicacion.distanciaM,
      ubicacion: ubicacion.nombre,
    };
    const prefijar = (p: "entrada" | "salida") =>
      Object.fromEntries(
        Object.entries({ metodo: "qr", ...evidencia }).map(([k, v]) => [`${p}_${k}`, v]),
      );

    if (tipo === "entrada") {
      const regla = ctx.regla!;
      // Un registro de demostración del mismo día cede su lugar al real.
      if (ctx.registro?.es_demo) {
        await sb
          .from("registros_asistencia")
          .delete()
          .eq("id", ctx.registro.id)
          .eq("es_demo", true);
      }
      const estado = estadoAlMarcarEntrada(ctx.horaLocal, regla.horaEntrada, regla.toleranciaMin);
      const { error } = await sb.from("registros_asistencia").insert({
        personal_id: ficha.id,
        fecha: ctx.fecha,
        hora_entrada: ahoraIso,
        hora_esperada_entrada: regla.horaEntrada,
        hora_esperada_salida: regla.horaSalida,
        tolerancia_aplicada: regla.toleranciaMin,
        pausa_aplicada: regla.pausaMin,
        estado,
        ...prefijar("entrada"),
        senalado: ubicacion.senalado,
        motivo_senal: ubicacion.motivo,
        registrado_por: perfil.id,
      });
      if (error) {
        if (error.code === "23505") return rechazar("orden", "Ya registró su entrada hoy.", 409);
        throw error;
      }
      await marcarUso(dispositivo.id);
      const retraso = minutosDeRetraso(ctx.horaLocal, regla.horaEntrada);
      return responder({
        ok: true,
        tipo,
        estado,
        hora: ctx.horaLocal,
        mensaje:
          estado === "presente" ? "Entrada registrada a tiempo" : "Entrada registrada con retraso",
        detalle:
          estado === "tarde"
            ? `${textoDuracion(retraso)} después de las ${regla.horaEntrada}`
            : null,
        senalado: ubicacion.senalado,
      });
    }

    // Salida
    const reg = ctx.registro!;
    const horas = horasTrabajadas(new Date(reg.hora_entrada!), ctx.ahora, reg.pausa_aplicada ?? 0);
    const motivos = [reg.motivo_senal, ubicacion.motivo].filter(Boolean).join(" · ") || null;
    const { data: actualizado, error } = await sb
      .from("registros_asistencia")
      .update({
        hora_salida: ahoraIso,
        horas_trabajadas: horas,
        salida_no_registrada: false,
        ...prefijar("salida"),
        senalado: reg.senalado || ubicacion.senalado,
        motivo_senal: motivos,
      })
      .eq("id", reg.id)
      .is("hora_salida", null)
      .select("id");
    if (error) throw error;
    if (!actualizado?.length) return rechazar("orden", "Ya registró su salida.", 409);
    await marcarUso(dispositivo.id);
    return responder({
      ok: true,
      tipo,
      estado: reg.estado,
      hora: ctx.horaLocal,
      mensaje: "Salida registrada",
      detalle: horas === null ? null : `${horas.toFixed(1).replace(".", ",")} h trabajadas hoy`,
      senalado: ubicacion.senalado,
    });
  } catch (e) {
    console.error("[api/marcacion]", e);
    return rechazar("servidor", "No se pudo registrar. Intente de nuevo en un momento.", 500);
  }
};
