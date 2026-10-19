/** R11 · Registro, aprobación y revocación de teléfonos. */
import type { SupabaseClient } from "@supabase/supabase-js";
import { clienteAdmin } from "@/lib/supabase/servidor";
import { describirDispositivo, estadoParaNuevoCelular } from "@/lib/reglas/dispositivos";
import { notificarRoles } from "./notificaciones";
import type { EstadoDispositivo } from "@/types";

export interface FilaDispositivo {
  id: string;
  usuario_id: string;
  dispositivo_uid: string;
  tipo: "celular" | "kiosco";
  descripcion: string | null;
  estado: EstadoDispositivo;
  creado_en: string;
  aprobado_en: string | null;
  ultimo_uso: string | null;
}

export const COLUMNAS_DISPOSITIVO =
  "id, usuario_id, dispositivo_uid, tipo, descripcion, estado, creado_en, aprobado_en, ultimo_uso";

/**
 * Devuelve el dispositivo de la cuenta con ese identificador; si no existe, lo
 * registra (el primer celular queda aprobado, los demás pendientes y se avisa).
 */
export async function obtenerORegistrar(p: {
  usuarioId: string;
  uid: string;
  userAgent: string | null;
  nombrePersona: string;
  personalId: string | null;
  /** Secretaría o directiva autorizó un cambio de teléfono (D-39). */
  cambioAutorizado?: boolean;
}): Promise<{ dispositivo: FilaDispositivo; nuevo: boolean }> {
  const sb = clienteAdmin();
  const { data: lista, error } = await sb
    .from("dispositivos")
    .select(COLUMNAS_DISPOSITIVO)
    .eq("usuario_id", p.usuarioId);
  if (error) throw new Error(error.message);
  const existentes = (lista ?? []) as FilaDispositivo[];
  const actual = existentes.find((d) => d.dispositivo_uid === p.uid);
  if (actual && !(p.cambioAutorizado && actual.estado !== "aprobado")) {
    return { dispositivo: actual, nuevo: false };
  }

  const estado = estadoParaNuevoCelular(
    existentes.map((d) => ({ dispositivoUid: d.dispositivo_uid, estado: d.estado, tipo: d.tipo })),
    p.cambioAutorizado,
  );
  const ahora = new Date().toISOString();
  // Solo se conserva la solicitud más reciente: los pendientes anteriores nunca marcaron.
  if (estado === "pendiente" && !actual) {
    await sb.from("dispositivos").delete().eq("usuario_id", p.usuarioId).eq("estado", "pendiente");
  }
  const { data, error: e2 } = await sb
    .from("dispositivos")
    .upsert(
      {
        usuario_id: p.usuarioId,
        dispositivo_uid: p.uid,
        tipo: "celular",
        descripcion: describirDispositivo(p.userAgent),
        estado,
        aprobado_en: estado === "aprobado" ? ahora : null,
        aprobado_por: null,
      },
      { onConflict: "usuario_id,dispositivo_uid" },
    )
    .select(COLUMNAS_DISPOSITIVO)
    .single();
  if (e2 || !data) throw new Error(e2?.message ?? "No se pudo registrar el dispositivo");
  const dispositivo = data as FilaDispositivo;

  if (p.cambioAutorizado && p.personalId) {
    // El cambio se usa una sola vez: el anterior queda revocado.
    await sb
      .from("dispositivos")
      .update({ estado: "revocado" })
      .eq("usuario_id", p.usuarioId)
      .eq("tipo", "celular")
      .eq("estado", "aprobado")
      .neq("id", dispositivo.id);
    await sb.from("personal").update({ cambio_telefono: false }).eq("id", p.personalId);
  }

  if (estado === "pendiente") {
    await notificarRoles(["directiva", "secretaria"], {
      tipo: "dispositivo",
      mensaje: `${p.nombrePersona} intenta marcar desde un teléfono nuevo (${dispositivo.descripcion}). Apruébelo si es suyo.`,
      enlace: p.personalId ? `/personal/${p.personalId}#dispositivo` : null,
      clave: `dispositivo:${dispositivo.id}`,
    }).catch((e) => console.error("[dispositivos] aviso", e));
  }
  return { dispositivo, nuevo: true };
}

export async function marcarUso(id: string): Promise<void> {
  await clienteAdmin()
    .from("dispositivos")
    .update({ ultimo_uso: new Date().toISOString() })
    .eq("id", id);
}

/** Aprueba un celular y revoca el que estuviera aprobado (máximo uno por cuenta). */
export async function aprobarDispositivo(
  sb: SupabaseClient,
  id: string,
  aprobadorId: string,
): Promise<{ ok: true } | { ok: false; mensaje: string }> {
  const { data: d } = await sb
    .from("dispositivos")
    .select("id, usuario_id, tipo")
    .eq("id", id)
    .maybeSingle();
  if (!d) return { ok: false, mensaje: "El teléfono no existe." };
  const { error: e1 } = await sb
    .from("dispositivos")
    .update({ estado: "revocado" })
    .eq("usuario_id", d.usuario_id)
    .eq("tipo", d.tipo)
    .eq("estado", "aprobado")
    .neq("id", id);
  if (e1) return { ok: false, mensaje: "No se pudo revocar el teléfono anterior." };
  const { error } = await sb
    .from("dispositivos")
    .update({
      estado: "aprobado",
      aprobado_por: aprobadorId,
      aprobado_en: new Date().toISOString(),
    })
    .eq("id", id);
  return error ? { ok: false, mensaje: "No se pudo aprobar el teléfono." } : { ok: true };
}

export async function revocarDispositivo(
  sb: SupabaseClient,
  id: string,
): Promise<{ ok: true } | { ok: false; mensaje: string }> {
  const { error } = await sb.from("dispositivos").update({ estado: "revocado" }).eq("id", id);
  return error ? { ok: false, mensaje: "No se pudo revocar el teléfono." } : { ok: true };
}

/**
 * Cambio de teléfono (D-39): revoca el aprobado y descarta pendientes; el
 * próximo teléfono con que la persona marque queda aprobado solo.
 */
export async function autorizarCambioTelefono(
  personalId: string,
  usuarioId: string,
): Promise<void> {
  const sb = clienteAdmin();
  const { error } = await sb
    .from("personal")
    .update({ cambio_telefono: true })
    .eq("id", personalId);
  if (error) throw new Error(error.message);
  await sb
    .from("dispositivos")
    .update({ estado: "revocado" })
    .eq("usuario_id", usuarioId)
    .eq("tipo", "celular")
    .in("estado", ["aprobado", "pendiente"]);
}

export async function cancelarCambioTelefono(personalId: string): Promise<void> {
  const { error } = await clienteAdmin()
    .from("personal")
    .update({ cambio_telefono: false })
    .eq("id", personalId);
  if (error) throw new Error(error.message);
}

/** Quien no tiene teléfono marca en secretaría (D-38). */
export async function cambiarMarcaEnPc(personalId: string, valor: boolean): Promise<void> {
  const { error } = await clienteAdmin()
    .from("personal")
    .update({ marca_en_pc: valor })
    .eq("id", personalId);
  if (error) throw new Error(error.message);
}
