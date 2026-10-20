/**
 * POST /api/acciones · Acciones rápidas desde las ventanas (D-49).
 * Recibe un formulario y responde JSON { ok, mensaje, errores }. Si sale bien,
 * deja el mensaje en la cookie flash: la pantalla se actualiza y lo muestra.
 */
import type { APIRoute } from "astro";
import { esUuid, texto, validarPermiso } from "@/lib/validacion";
import { ponerFlash } from "@/lib/flash";
import { hoyEnZona, fechaCorta } from "@/lib/fecha";
import { plural } from "@/lib/formato";
import { CLAVE_INICIAL } from "@/lib/auth/cedula";
import { crearCuentaCedula, restablecerClaveInicial } from "@/lib/servicios/cuentas";
import { limpiarIntentos } from "@/lib/servicios/intentos";
import {
  aprobarDispositivo,
  autorizarCambioTelefono,
  cambiarMarcaEnPc,
} from "@/lib/servicios/dispositivos";
import { marcarAsistido } from "@/lib/servicios/asistido";
import { guardarPermiso } from "@/lib/servicios/permisos";
import { NOMBRE_ROL, ROLES, type Rol } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { validarClave, validarCuenta, validarPersonal } from "@/lib/validacion";
import {
  cambiarEstadoCuenta,
  cambiarRol,
  crearCuenta,
  restablecerClave,
} from "@/lib/servicios/cuentas";
import { crearPersonal } from "@/lib/servicios/personal";
import { esCuentaCedula } from "@/lib/auth/cedula";
import { listarCategorias } from "@/lib/datos/categorias";

export const prerender = false;

type Respuesta = { ok: true } | { ok: false; mensaje: string; errores?: Record<string, string> };
const json = (r: Respuesta, status = 200) =>
  new Response(JSON.stringify(r), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
const fallo = (mensaje: string, errores?: Record<string, string>, status = 422) =>
  json({ ok: false, mensaje, errores }, status);

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const perfil = locals.perfil;
  if (!perfil) return fallo("Su sesión expiró. Vuelva a iniciar sesión.", undefined, 401);
  if (perfil.rol === "personal") return fallo("No tiene permiso para esta acción.", undefined, 403);
  const esDirectiva = perfil.rol === "directiva";
  const sb = locals.supabase;

  const f = await request.formData();
  const accion = texto(f, "accion");
  const personalId = texto(f, "personal_id");
  const volver = texto(f, "volver");
  const exito = (mensaje: string, deshacer?: Parameters<typeof ponerFlash>[3]) => {
    ponerFlash(cookies, "exito", mensaje, deshacer);
    return json({ ok: true });
  };

  try {
    // Acciones sobre una cuenta (por su id de usuario) o que crean algo nuevo
    if (accion.startsWith("cuenta_") || accion === "personal_nuevo") {
      if (!esDirectiva)
        return fallo("Solo la directiva gestiona cuentas y personal.", undefined, 403);
      return await accionDirectiva(accion, f, sb, perfil.id, exito);
    }
    // Acciones sobre una persona: se lee su ficha y su cuenta
    const necesitaPersona = accion !== "permiso";
    type Ficha = {
      id: string;
      nombre: string;
      apellido: string;
      cedula: string;
      estado: string;
      usuarios: { id: string; email: string } | null;
    };
    let ficha: Ficha | null = null;
    if (necesitaPersona) {
      if (!esUuid(personalId)) return fallo("Solicitud no válida.", undefined, 400);
      const { data } = await sb
        .from("personal")
        .select("id, nombre, apellido, cedula, estado, usuarios(id, email)")
        .eq("id", personalId)
        .maybeSingle<Ficha>();
      if (!data) return fallo("La persona no existe.", undefined, 404);
      ficha = data;
    }
    const nombre = ficha ? `${ficha.nombre} ${ficha.apellido}` : "";

    switch (accion) {
      case "crear_cuenta": {
        if (!esDirectiva) return fallo("Solo la directiva crea cuentas.", undefined, 403);
        if (ficha!.usuarios) return fallo(`${nombre} ya tiene una cuenta.`);
        const rol = texto(f, "rol") as Rol;
        const r = await crearCuentaCedula(sb, ficha!, ROLES.includes(rol) ? rol : "personal");
        if (!r.ok) return fallo(r.mensaje);
        return exito(
          `Cuenta creada. ${nombre} entra con su cédula ${ficha!.cedula} y la contraseña ${CLAVE_INICIAL}.`,
        );
      }
      case "clave_inicial": {
        if (!ficha!.usuarios) return fallo(`${nombre} no tiene cuenta.`);
        const r = await restablecerClaveInicial(ficha!.usuarios.id, ficha!.usuarios.email);
        if (!r.ok) return fallo(r.mensaje);
        await limpiarIntentos(ficha!.cedula);
        return exito(`Contraseña de ${nombre} restablecida a ${CLAVE_INICIAL}.`);
      }
      case "tel_cambio": {
        if (!ficha!.usuarios) return fallo(`${nombre} no tiene cuenta.`);
        await autorizarCambioTelefono(ficha!.id, ficha!.usuarios.id);
        return exito(
          `Listo: el próximo teléfono con que ${ficha!.nombre} marque quedará aprobado.`,
        );
      }
      case "disp_aprobar": {
        const dispId = texto(f, "dispositivo_id");
        if (!esUuid(dispId) || !ficha!.usuarios)
          return fallo("Solicitud no válida.", undefined, 400);
        const { data: propio } = await sb
          .from("dispositivos")
          .select("id")
          .eq("id", dispId)
          .eq("usuario_id", ficha!.usuarios.id)
          .maybeSingle();
        if (!propio) return fallo("El teléfono no pertenece a esta persona.");
        const r = await aprobarDispositivo(sb, dispId, perfil.id);
        if (!r.ok) return fallo(r.mensaje);
        return exito(`Teléfono de ${nombre} aprobado.`);
      }
      case "marca_pc": {
        const valor = texto(f, "valor") === "si";
        await cambiarMarcaEnPc(ficha!.id, valor);
        return exito(
          valor ? `${nombre} marca en secretaría.` : `${nombre} vuelve a marcar con su teléfono.`,
        );
      }
      case "marcar": {
        const tipo = texto(f, "tipo");
        if (tipo !== "entrada" && tipo !== "salida")
          return fallo("Solicitud no válida.", undefined, 400);
        const hoy = hoyEnZona();
        const fechaTexto = texto(f, "fecha");
        const fecha =
          /^\d{4}-\d{2}-\d{2}$/.test(fechaTexto) && fechaTexto <= hoy ? fechaTexto : hoy;
        // «Ahora» (hoy) o una hora escrita a mano con su motivo (contingencia)
        const aMano = texto(f, "momento") === "otra" || fecha !== hoy;
        const hora = aMano ? texto(f, "hora") : "";
        const motivo = texto(f, "motivo_manual");
        const observacion = (motivo === "Otro" ? texto(f, "observacion") : motivo).slice(0, 300);
        const errores: Record<string, string> = {};
        if (aMano && !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) errores.hora = "Escriba la hora.";
        if (aMano && !motivo) errores.motivo_manual = "Elija el motivo.";
        else if (aMano && !observacion) errores.observacion = "Escriba el motivo.";
        if (Object.keys(errores).length) return fallo("Revise los campos marcados.", errores);
        const r = await marcarAsistido({
          personalId: ficha!.id,
          fecha,
          tipo,
          horaManual: aMano ? hora : null,
          observacion: aMano ? observacion : null,
          usuarioId: perfil.id,
        });
        if (!r.ok) return fallo(r.mensaje);
        return exito(
          r.mensaje,
          r.deshacible
            ? {
                accion: "deshacer",
                datos: { personal_id: ficha!.id, tipo, volver },
                ruta: `/asistencia/registro?fecha=${fecha}`,
              }
            : undefined,
        );
      }
      case "permiso": {
        const v = validarPermiso(f);
        if (!v.ok) return fallo("Revise los campos marcados.", v.errores);
        const r = await guardarPermiso(sb, v.datos, perfil.id);
        if (!r.ok) {
          return r.campo ? fallo(r.mensaje, { [r.campo]: r.mensaje }) : fallo(r.mensaje);
        }
        const rango =
          v.datos.fecha_desde === v.datos.fecha_hasta
            ? `el ${fechaCorta(v.datos.fecha_desde)}`
            : `del ${fechaCorta(v.datos.fecha_desde)} al ${fechaCorta(v.datos.fecha_hasta)}`;
        return exito(
          `Permiso cargado ${rango}.${r.cambios ? ` ${plural(r.cambios, "falta pasó", "faltas pasaron")} a permiso.` : ""}`,
        );
      }
      default:
        return fallo("Acción no reconocida.", undefined, 400);
    }
  } catch (e) {
    console.error("[api/acciones]", accion, e);
    return fallo("Ocurrió un error. Intente de nuevo.", undefined, 500);
  }
};

/** Cuentas (rol, estado, contraseña, alta sin ficha) y alta rápida de personal. Solo directiva. */
async function accionDirectiva(
  accion: string,
  f: FormData,
  sb: SupabaseClient,
  actorId: string,
  exito: (mensaje: string) => Response,
): Promise<Response> {
  if (accion === "personal_nuevo") {
    // Lo mínimo: nombre, apellido, cédula y categoría; la jornada sale de la categoría.
    const categorias = await listarCategorias(sb);
    const cat = categorias.find((c) => c.id === texto(f, "categoria_id"));
    if (!f.get("jornada_id") && cat?.jornada_sugerida_id)
      f.set("jornada_id", cat.jornada_sugerida_id);
    const v = validarPersonal(f);
    if (!v.ok) return fallo("Revise los campos marcados.", v.errores);
    const r = await crearPersonal(sb, v.datos, null);
    if (!r.ok) return fallo(r.mensaje, r.errores);
    const persona = `${v.datos.nombre} ${v.datos.apellido}`;
    if (texto(f, "con_cuenta") !== "si") return exito(`${persona} registrado.`);
    const c = await crearCuentaCedula(sb, { id: r.id, ...v.datos });
    if (!c.ok) return exito(`${persona} registrado, pero no se creó la cuenta: ${c.mensaje}`);
    return exito(
      `${persona} registrado. Entra con su cédula ${v.datos.cedula} y la contraseña ${CLAVE_INICIAL}.`,
    );
  }

  if (accion === "cuenta_crear") {
    const rc = validarCuenta(f);
    const nombre = texto(f, "nombre");
    const apellido = texto(f, "apellido");
    const errores: Record<string, string> = rc.ok ? {} : { ...rc.errores };
    if (!nombre) errores.nombre = "Escriba el nombre.";
    if (!apellido) errores.apellido = "Escriba el apellido.";
    if (!rc.ok || Object.keys(errores).length) return fallo("Revise los campos marcados.", errores);
    const r = await crearCuenta(sb, { ...rc.datos, nombre, apellido });
    if (!r.ok) return fallo(r.mensaje, { email: r.mensaje });
    return exito(`Cuenta de ${nombre} ${apellido} creada (${NOMBRE_ROL[rc.datos.rol]}).`);
  }

  const id = texto(f, "usuario_id");
  if (!esUuid(id)) return fallo("Solicitud no válida.", undefined, 400);
  const { data: u } = await sb
    .from("usuarios")
    .select("id, nombre, apellido, email, rol, estado")
    .eq("id", id)
    .maybeSingle<{
      id: string;
      nombre: string;
      apellido: string;
      email: string;
      rol: Rol;
      estado: string;
    }>();
  if (!u) return fallo("La cuenta no existe.", undefined, 404);
  const quien = `${u.nombre} ${u.apellido}`;

  switch (accion) {
    case "cuenta_rol": {
      const rol = texto(f, "rol") as Rol;
      if (!ROLES.includes(rol))
        return fallo("Elija el tipo de cuenta.", { rol: "Elija el tipo de cuenta." });
      if (rol === u.rol) return exito(`${quien} ya es ${NOMBRE_ROL[rol]}.`);
      const r = await cambiarRol(sb, id, rol, actorId);
      if (!r.ok) return fallo(r.mensaje);
      return exito(`${quien} ahora es ${NOMBRE_ROL[rol]}.`);
    }
    case "cuenta_estado": {
      const activar = texto(f, "valor") === "activar";
      const r = await cambiarEstadoCuenta(sb, id, activar, actorId);
      if (!r.ok) return fallo(r.mensaje);
      return exito(activar ? `Cuenta de ${quien} activada.` : `Cuenta de ${quien} desactivada.`);
    }
    case "cuenta_clave": {
      if (esCuentaCedula(u.email)) {
        const r = await restablecerClaveInicial(id, u.email);
        if (!r.ok) return fallo(r.mensaje);
        return exito(`Contraseña de ${quien} restablecida a ${CLAVE_INICIAL}.`);
      }
      const clave = texto(f, "password");
      const err = validarClave(clave);
      if (err) return fallo("Revise los campos marcados.", { password: err });
      const r = await restablecerClave(id, clave);
      if (!r.ok) return fallo(r.mensaje);
      return exito(`Contraseña de ${quien} cambiada. Entréguele la nueva.`);
    }
    default:
      return fallo("Acción no reconocida.", undefined, 400);
  }
}
