/** Envío de notificaciones internas (solo servidor). */
import { clienteAdmin } from "@/lib/supabase/servidor";
import type { Rol } from "@/types";

export type TipoNotificacion =
  "falta" | "tarde" | "senalado" | "dispositivo" | "salida" | "qr" | "permiso" | "sistema";

export interface NuevaNotificacion {
  tipo: TipoNotificacion;
  mensaje: string;
  enlace?: string | null;
  /** Identificador estable: la misma clave no se envía dos veces al mismo destinatario. */
  clave: string;
}

/** Envía la notificación a todas las cuentas activas de los roles indicados. Devuelve cuántas se crearon. */
export async function notificarRoles(roles: Rol[], n: NuevaNotificacion): Promise<number> {
  const sb = clienteAdmin();
  const { data: destinos, error } = await sb
    .from("usuarios")
    .select("id")
    .in("rol", roles)
    .eq("estado", "activo");
  if (error) throw new Error(error.message);
  if (!destinos?.length) return 0;
  const { data, error: e2 } = await sb
    .from("notificaciones")
    .upsert(
      destinos.map((d) => ({
        usuario_destino: d.id,
        tipo: n.tipo,
        mensaje: n.mensaje,
        enlace: n.enlace ?? null,
        clave: n.clave,
      })),
      { onConflict: "usuario_destino,clave", ignoreDuplicates: true },
    )
    .select("id");
  if (e2) throw new Error(e2.message);
  return data?.length ?? 0;
}
