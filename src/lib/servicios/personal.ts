/** Alta/edición de personal. Llamar solo tras verificar que el actor es directiva. */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DatosCuenta, DatosPersonal, Errores } from "@/lib/validacion";
import { clienteAdmin } from "@/lib/supabase/servidor";
import { cambiarEstadoCuenta, crearCuenta } from "./cuentas";

export type ResultadoPersonal =
  { ok: true; id: string } | { ok: false; mensaje: string; errores?: Errores };

function errorBD(error: { code?: string; message: string }): ResultadoPersonal {
  if (error.code === "23505" && /cedula/.test(error.message)) {
    return {
      ok: false,
      mensaje: "Ya existe una persona con esa cédula.",
      errores: { cedula: "Esta cédula ya está registrada." },
    };
  }
  console.error("[personal]", error);
  return { ok: false, mensaje: "No se pudo guardar. Intente de nuevo." };
}

/** Crea la cuenta y la vincula a la ficha. Si falla la vinculación, revierte la cuenta. */
export async function vincularCuentaNueva(
  sb: SupabaseClient,
  personalId: string,
  persona: { nombre: string; apellido: string },
  cuenta: DatosCuenta,
): Promise<ResultadoPersonal> {
  const r = await crearCuenta(sb, { ...cuenta, ...persona });
  if (!r.ok) return { ok: false, mensaje: r.mensaje, errores: { email: r.mensaje } };

  const { error } = await sb.from("personal").update({ usuario_id: r.id }).eq("id", personalId);
  if (error) {
    await clienteAdmin().auth.admin.deleteUser(r.id);
    return errorBD(error);
  }
  return { ok: true, id: personalId };
}

export async function crearPersonal(
  sb: SupabaseClient,
  datos: DatosPersonal,
  cuenta: DatosCuenta | null,
): Promise<ResultadoPersonal> {
  const { data, error } = await sb
    .from("personal")
    .insert(datos)
    .select("id")
    .single<{ id: string }>();
  if (error || !data) return errorBD(error ?? { message: "sin datos" });

  if (cuenta) {
    const r = await vincularCuentaNueva(sb, data.id, datos, cuenta);
    if (!r.ok) {
      // La ficha queda creada; se informa que la cuenta no pudo crearse.
      return {
        ok: false,
        mensaje: `La ficha se guardó, pero no se creó la cuenta: ${r.mensaje}`,
        errores: r.errores,
      };
    }
  }
  return { ok: true, id: data.id };
}

export async function actualizarPersonal(
  sb: SupabaseClient,
  id: string,
  datos: DatosPersonal,
): Promise<ResultadoPersonal> {
  const { error } = await sb.from("personal").update(datos).eq("id", id);
  return error ? errorBD(error) : { ok: true, id };
}

/** Activa/desactiva la ficha (nunca se borra) y bloquea/desbloquea su cuenta si la tiene. */
export async function cambiarEstadoPersonal(
  sb: SupabaseClient,
  id: string,
  activo: boolean,
  actorId: string,
): Promise<ResultadoPersonal> {
  const { data: ficha } = await sb
    .from("personal")
    .select("usuario_id")
    .eq("id", id)
    .maybeSingle<{ usuario_id: string | null }>();
  if (!ficha) return { ok: false, mensaje: "No se encontró la persona." };

  if (ficha.usuario_id) {
    const r = await cambiarEstadoCuenta(sb, ficha.usuario_id, activo, actorId);
    if (!r.ok) return { ok: false, mensaje: r.mensaje };
  }
  const { error } = await sb
    .from("personal")
    .update({ estado: activo ? "activo" : "inactivo" })
    .eq("id", id);
  return error ? errorBD(error) : { ok: true, id };
}
