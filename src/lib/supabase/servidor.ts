/**
 * Clientes Supabase para el servidor. NUNCA importar desde código del navegador.
 */
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AstroCookies } from "astro";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "astro:env/server";
import { getSecret } from "astro:env/server";

const URL_SUPABASE = PUBLIC_SUPABASE_URL;
const CLAVE_PUBLICA = PUBLIC_SUPABASE_ANON_KEY;

/** Cliente con la sesión del usuario (cookies). Respeta RLS. */
export function crearClienteSesion(request: Request, cookies: AstroCookies): SupabaseClient {
  return createServerClient(URL_SUPABASE, CLAVE_PUBLICA, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "").map(({ name, value }) => ({
          name,
          value: value ?? "",
        }));
      },
      setAll(lista) {
        for (const { name, value, options } of lista) {
          cookies.set(name, value, {
            path: "/",
            maxAge: options?.maxAge,
            expires: options?.expires,
            // Solo el servidor usa la sesión: la cookie no se expone a JavaScript.
            httpOnly: true,
            secure: import.meta.env.PROD,
            sameSite: "lax",
          });
        }
      },
    },
  });
}

let admin: SupabaseClient | null = null;

/**
 * Cliente con la clave secreta (omite RLS). Usar SOLO para operaciones que lo
 * requieren (Auth admin, marcaciones) y siempre después de verificar el rol.
 */
export function clienteAdmin(): SupabaseClient {
  const clave = getSecret("SUPABASE_SECRET_KEY");
  if (!clave) throw new Error("Falta SUPABASE_SECRET_KEY");
  admin ??= createClient(URL_SUPABASE, clave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
