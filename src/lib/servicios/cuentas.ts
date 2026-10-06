/**
 * Gestión de cuentas de acceso. Solo para la directiva (verificar el rol antes de llamar).
 * - Supabase Auth (crear, bloquear, cambiar clave) → cliente admin (clave secreta).
 * - Tabla usuarios → cliente de sesión, para que RLS vuelva a verificar el permiso.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { clienteAdmin } from "@/lib/supabase/servidor";
import type { Rol } from "@/types";

export type ResultadoCuenta = { ok: true; id: string } | { ok: false; mensaje: string };

const BLOQUEO_INDEFINIDO = "876000h"; // ~100 años

function mensajeAuth(error: { code?: string; message: string }): string {
  if (error.code === "email_exists" || /already|registered/i.test(error.message)) {
    return "Ya existe una cuenta con ese correo.";
  }
  if (error.code === "weak_password") return "La contraseña es demasiado débil.";
  if (error.code === "email_address_invalid") return "Correo no válido.";
  console.error("[cuentas] Auth:", error);
  return "No se pudo crear la cuenta. Intente de nuevo.";
}

export async function crearCuenta(
  sb: SupabaseClient,
  datos: { email: string; password: string; rol: Rol; nombre: string; apellido: string },
): Promise<ResultadoCuenta> {
  const admin = clienteAdmin();
  const { data, error } = await admin.auth.admin.createUser({
    email: datos.email,
    password: datos.password,
    email_confirm: true,
  });
  if (error || !data.user) return { ok: false, mensaje: mensajeAuth(error ?? { message: "" }) };

  const id = data.user.id;
  const { error: e2 } = await sb.from("usuarios").insert({
    id,
    email: datos.email,
    nombre: datos.nombre,
    apellido: datos.apellido,
    rol: datos.rol,
  });
  if (e2) {
    await admin.auth.admin.deleteUser(id); // no dejar cuentas huérfanas
    console.error("[cuentas] perfil:", e2);
    return { ok: false, mensaje: "No se pudo registrar el perfil de la cuenta." };
  }
  return { ok: true, id };
}

/** Evita que la institución se quede sin ninguna directiva activa. */
async function esUltimaDirectiva(sb: SupabaseClient, id: string): Promise<boolean> {
  const { data } = await sb
    .from("usuarios")
    .select("id")
    .eq("rol", "directiva")
    .eq("estado", "activo");
  const ids = (data ?? []).map((u: { id: string }) => u.id);
  return ids.length <= 1 && ids.includes(id);
}

export async function cambiarEstadoCuenta(
  sb: SupabaseClient,
  id: string,
  activo: boolean,
  actorId: string,
): Promise<ResultadoCuenta> {
  if (!activo && id === actorId)
    return { ok: false, mensaje: "No puede desactivar su propia cuenta." };
  if (!activo && (await esUltimaDirectiva(sb, id))) {
    return { ok: false, mensaje: "Debe quedar al menos una cuenta de directiva activa." };
  }
  const { error } = await sb
    .from("usuarios")
    .update({ estado: activo ? "activo" : "inactivo" })
    .eq("id", id);
  if (error) return { ok: false, mensaje: "No se pudo actualizar la cuenta." };

  // Bloquea/desbloquea también el inicio de sesión en Auth (y cierra sesiones al refrescar).
  const { error: e2 } = await clienteAdmin().auth.admin.updateUserById(id, {
    ban_duration: activo ? "none" : BLOQUEO_INDEFINIDO,
  });
  if (e2) console.error("[cuentas] ban:", e2);
  return { ok: true, id };
}

export async function restablecerClave(id: string, password: string): Promise<ResultadoCuenta> {
  const { error } = await clienteAdmin().auth.admin.updateUserById(id, { password });
  if (error) return { ok: false, mensaje: mensajeAuth(error) };
  return { ok: true, id };
}

export async function cambiarRol(
  sb: SupabaseClient,
  id: string,
  rol: Rol,
  actorId: string,
): Promise<ResultadoCuenta> {
  if (id === actorId && rol !== "directiva") {
    return { ok: false, mensaje: "No puede quitarse a sí mismo el rol de directiva." };
  }
  if (rol !== "directiva" && (await esUltimaDirectiva(sb, id))) {
    return { ok: false, mensaje: "Debe quedar al menos una cuenta de directiva activa." };
  }
  const { error } = await sb.from("usuarios").update({ rol }).eq("id", id);
  if (error) return { ok: false, mensaje: "No se pudo cambiar el rol." };
  return { ok: true, id };
}

/** Sugerencia de contraseña temporal legible (sin caracteres confusos). */
export function generarClaveTemporal(): string {
  const letras = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  const numeros = "23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  const parte = Array.from(bytes.slice(0, 7), (b) => letras[b % letras.length]).join("");
  const nums = Array.from(bytes.slice(7), (b) => numeros[b % numeros.length]).join("");
  return parte + nums;
}
