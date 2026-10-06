// Variables de entorno: ver el esquema "env" en astro.config.mjs (módulo astro:env/server).

declare namespace App {
  interface Locals {
    /** Cliente Supabase con la sesión del usuario (respeta RLS). */
    supabase: import("@supabase/supabase-js").SupabaseClient;
    /** Perfil del usuario autenticado y activo; null si no hay sesión. */
    perfil: import("@/types").Perfil | null;
    /** Mensaje de la acción anterior (patrón POST → redirect → GET). */
    flash: import("@/lib/flash").Flash | null;
  }
}
