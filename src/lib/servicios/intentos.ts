/**
 * Límite de intentos de inicio de sesión (D-43). Todas las solicitudes llegan a
 * Supabase desde el servidor, así que el límite por IP de Supabase no distingue
 * personas: este lleva la cuenta por cédula o correo.
 */
import { clienteAdmin } from "@/lib/supabase/servidor";

export const MAX_INTENTOS = 5;
export const VENTANA_MIN = 15;

const desde = () => new Date(Date.now() - VENTANA_MIN * 60_000).toISOString();

export async function accesoBloqueado(identificador: string): Promise<boolean> {
  const { count } = await clienteAdmin()
    .from("intentos_acceso")
    .select("id", { count: "exact", head: true })
    .eq("identificador", identificador)
    .gte("fecha", desde());
  return (count ?? 0) >= MAX_INTENTOS;
}

export async function registrarFallo(identificador: string): Promise<void> {
  const sb = clienteAdmin();
  await sb.from("intentos_acceso").insert({ identificador });
  // Limpieza ocasional de intentos viejos
  if (Math.random() < 0.05) await sb.from("intentos_acceso").delete().lt("fecha", desde());
}

export async function limpiarIntentos(identificador: string): Promise<void> {
  await clienteAdmin().from("intentos_acceso").delete().eq("identificador", identificador);
}
