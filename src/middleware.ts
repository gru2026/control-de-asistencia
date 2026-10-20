/**
 * Sesión + roles + redirecciones para TODAS las rutas del servidor.
 * El rol se lee de la base de datos con la sesión verificada; nunca del navegador.
 */
import { defineMiddleware } from "astro:middleware";
import { crearClienteSesion } from "@/lib/supabase/servidor";
import { decidirAcceso } from "@/lib/auth/acceso";
import { tomarFlash } from "@/lib/flash";
import type { Perfil } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { guardarEnCache, leerCache } from "@/lib/datos/cache";

/** Perfil y si tiene ficha de personal activa, en una sola consulta. */
async function cargarPerfil(sb: SupabaseClient, uid: string): Promise<Perfil | null> {
  const { data } = await sb
    .from("usuarios")
    .select("id, nombre, apellido, email, rol, estado, debe_cambiar_clave, personal(id, estado)")
    .eq("id", uid)
    .maybeSingle<Perfil & { personal: { id: string; estado: string } | null }>();
  if (!data) return null;
  const { personal, ...perfil } = data;
  return { ...perfil, tiene_ficha: personal?.estado === "activo" };
}

const ESTATICO = /^\/(_astro|icons)\/|\.(svg|png|ico|webmanifest|js|css|txt|html|woff2?)$/;

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self' blob:",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

function cabecerasSeguridad(res: Response, privada: boolean): Response {
  const h = res.headers;
  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "DENY");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("Permissions-Policy", "camera=(self), geolocation=(self), microphone=()");
  if (import.meta.env.PROD) {
    // Solo recursos propios; el navegador nunca habla directo con Supabase (D-16).
    // 'unsafe-inline' sigue siendo necesario por los scripts y estilos en línea de Astro (D-43).
    h.set("Content-Security-Policy", CSP);
    h.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  // Tras cerrar sesión, el botón "atrás" no debe mostrar datos privados (F5).
  if (privada) h.set("Cache-Control", "private, no-store");
  return res;
}

export const onRequest = defineMiddleware(async (ctx, next) => {
  const ruta = ctx.url.pathname.replace(/\/+$/, "") || "/";
  if (ctx.isPrerendered || ESTATICO.test(ruta)) return next();

  const supabase = crearClienteSesion(ctx.request, ctx.cookies);
  ctx.locals.supabase = supabase;
  ctx.locals.perfil = null;
  // Una precarga no debe «gastar» el mensaje de la acción anterior.
  const precarga = ctx.request.headers.get("X-Precarga") === "1";
  ctx.locals.flash = ctx.request.method === "GET" && !precarga ? tomarFlash(ctx.cookies) : null;

  // Tiempos del servidor (cabecera Server-Timing) para medir dónde se va la espera.
  const t0 = performance.now();
  // getClaims verifica la firma del JWT (y refresca la sesión si hace falta).
  const { data } = await supabase.auth.getClaims();
  const tClaims = performance.now();
  const uid = data?.claims?.sub;

  let tPerfil = tClaims;
  if (uid) {
    const perfil = leerCache<Perfil>(`perfil:${uid}`) ?? (await cargarPerfil(supabase, uid));
    tPerfil = performance.now();
    if (perfil?.estado === "activo") {
      // Las cuentas que deben cambiar la contraseña no se guardan: el cambio se ve al instante.
      if (!perfil.debe_cambiar_clave) guardarEnCache(`perfil:${uid}`, perfil, 60_000);
      ctx.locals.perfil = perfil;
    } else {
      // Sesión válida pero cuenta inactiva o sin perfil: se cierra.
      await supabase.auth.signOut();
    }
  }

  // Cuenta con contraseña inicial: antes de cualquier otra cosa debe crear la suya (D-42).
  if (ctx.locals.perfil?.debe_cambiar_clave && ruta !== "/cambiar-clave" && ruta !== "/api/salir") {
    if (ruta.startsWith("/api/")) {
      return cabecerasSeguridad(
        new Response(
          JSON.stringify({ ok: false, codigo: "clave", mensaje: "Primero cree su contraseña." }),
          { status: 403, headers: { "Content-Type": "application/json; charset=utf-8" } },
        ),
        true,
      );
    }
    return ctx.redirect("/cambiar-clave");
  }

  // Los endpoints /api validan por su cuenta (algunos usan secretos propios, ej. cron).
  if (ruta.startsWith("/api/")) return cabecerasSeguridad(await next(), true);

  const decision = decidirAcceso(ruta, ctx.locals.perfil?.rol ?? null);
  switch (decision.tipo) {
    case "login": {
      const volver = ruta === "/" ? "" : `?volver=${encodeURIComponent(ruta + ctx.url.search)}`;
      return ctx.redirect(`/login${volver}`);
    }
    case "prohibido":
      return ctx.rewrite("/sin-permiso");
    case "redirigir":
      return ctx.redirect(decision.destino);
  }

  const res = cabecerasSeguridad(await next(), ctx.locals.perfil !== null);
  const fin = performance.now();
  res.headers.set(
    "Server-Timing",
    `sesion;dur=${(tClaims - t0).toFixed(0)}, perfil;dur=${(tPerfil - tClaims).toFixed(0)}, pagina;dur=${(fin - tPerfil).toFixed(0)}`,
  );
  return res;
});
