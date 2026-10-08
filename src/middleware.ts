/**
 * Sesión + roles + redirecciones para TODAS las rutas del servidor.
 * El rol se lee de la base de datos con la sesión verificada; nunca del navegador.
 */
import { defineMiddleware } from "astro:middleware";
import { crearClienteSesion } from "@/lib/supabase/servidor";
import { decidirAcceso } from "@/lib/auth/acceso";
import { tomarFlash } from "@/lib/flash";
import type { Perfil } from "@/types";

const ESTATICO = /^\/(_astro|icons)\/|\.(svg|png|ico|webmanifest|js|css|txt|html|woff2?)$/;

function cabecerasSeguridad(res: Response, privada: boolean): Response {
  const h = res.headers;
  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "DENY");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("Permissions-Policy", "camera=(self), geolocation=(self), microphone=()");
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
  ctx.locals.flash = ctx.request.method === "GET" ? tomarFlash(ctx.cookies) : null;

  // getClaims verifica la firma del JWT (y refresca la sesión si hace falta).
  const { data } = await supabase.auth.getClaims();
  const uid = data?.claims?.sub;

  if (uid) {
    const { data: perfil } = await supabase
      .from("usuarios")
      .select("id, nombre, apellido, email, rol, estado")
      .eq("id", uid)
      .maybeSingle<Perfil>();
    if (perfil?.estado === "activo") {
      ctx.locals.perfil = perfil;
    } else {
      // Sesión válida pero cuenta inactiva o sin perfil: se cierra.
      await supabase.auth.signOut();
    }
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

  return cabecerasSeguridad(await next(), ctx.locals.perfil !== null);
});
