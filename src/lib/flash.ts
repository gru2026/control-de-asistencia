/** Mensajes de una sola lectura entre un POST y la página a la que redirige. */
import type { AstroCookies } from "astro";

export interface Flash {
  tipo: "exito" | "error" | "info";
  mensaje: string;
}

const NOMBRE = "flash";

export function ponerFlash(cookies: AstroCookies, tipo: Flash["tipo"], mensaje: string): void {
  cookies.set(NOMBRE, JSON.stringify({ tipo, mensaje }), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    maxAge: 60,
  });
}

/** Lee el mensaje y lo elimina. */
export function tomarFlash(cookies: AstroCookies): Flash | null {
  const c = cookies.get(NOMBRE);
  if (!c) return null;
  cookies.delete(NOMBRE, { path: "/" });
  try {
    const v = c.json() as Partial<Flash>;
    if (
      (v.tipo === "exito" || v.tipo === "error" || v.tipo === "info") &&
      typeof v.mensaje === "string"
    ) {
      return { tipo: v.tipo, mensaje: v.mensaje.slice(0, 300) };
    }
  } catch {
    /* cookie corrupta: se ignora */
  }
  return null;
}
