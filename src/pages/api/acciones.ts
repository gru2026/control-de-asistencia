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
import { ROLES, type Rol } from "@/types";

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
        const r = await marcarAsistido({
          personalId: ficha!.id,
          fecha: hoyEnZona(),
          tipo,
          horaManual: null,
          observacion: null,
          usuarioId: perfil.id,
        });
        if (!r.ok) return fallo(r.mensaje);
        return exito(
          r.mensaje,
          r.deshacible
            ? {
                accion: "deshacer",
                datos: { personal_id: ficha!.id, tipo, volver },
                ruta: "/asistencia/registro",
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
