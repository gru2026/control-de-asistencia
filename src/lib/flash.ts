/** Mensajes de una sola lectura entre un POST y la página a la que redirige. */
import type { AstroCookies } from "astro";

/** Acción que revierte la anterior: se envía por POST a la misma pantalla. */
export interface Deshacer {
  accion: string;
  datos?: Record<string, string>;
}

export interface Flash {
  tipo: "exito" | "error" | "info";
  mensaje: string;
  deshacer?: Deshacer;
}

const NOMBRE = "flash";

export function ponerFlash(
  cookies: AstroCookies,
  tipo: Flash["tipo"],
  mensaje: string,
  deshacer?: Deshacer,
): void {
  cookies.set(NOMBRE, JSON.stringify({ tipo, mensaje, deshacer }), {
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
      const d = v.deshacer;
      const deshacer =
        d && typeof d.accion === "string"
          ? {
              accion: d.accion.slice(0, 40),
              datos: Object.fromEntries(
                Object.entries(d.datos ?? {})
                  .filter(([, x]) => typeof x === "string")
                  .slice(0, 10)
                  .map(([k, x]) => [k.slice(0, 40), String(x).slice(0, 200)]),
              ),
            }
          : undefined;
      return { tipo: v.tipo, mensaje: v.mensaje.slice(0, 300), deshacer };
    }
  } catch {
    /* cookie corrupta: se ignora */
  }
  return null;
}
