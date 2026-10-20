/**
 * Precarga propia (D-46). Las páginas privadas se sirven con «no-store» (al
 * cerrar sesión, «atrás» no debe mostrar datos), así que la precarga del
 * navegador no se puede reutilizar. Aquí se pide la pantalla al pasar el mouse
 * o tocar el enlace y se guarda unos segundos en memoria; el router la usa al
 * navegar y el panel lateral la usa al abrirse.
 */
const TTL_MS = 15_000;
type Precarga = { vence: number; respuesta: Promise<{ html: string; url: string } | null> };
const precargas = new Map<string, Precarga>();

const clave = (href: string) => {
  const u = new URL(href, location.href);
  u.hash = "";
  return u.href;
};

/** Rutas que no conviene guardar: el reloj de Mi asistencia usa la hora de la respuesta. */
function sePuedePrecargar(u: URL): boolean {
  return (
    u.origin === location.origin &&
    !u.pathname.startsWith("/api/") &&
    u.pathname !== "/asistencia" &&
    u.pathname !== "/login" &&
    !(u.pathname === location.pathname && u.search === location.search)
  );
}

export function precargar(href: string, cabeceras: Record<string, string> = {}): void {
  const u = new URL(href, location.href);
  if (!sePuedePrecargar(u)) return;
  const k = clave(href);
  const actual = precargas.get(k);
  if (actual && actual.vence > Date.now()) return;
  const respuesta = fetch(u.href, {
    credentials: "same-origin",
    headers: { "X-Precarga": "1", ...cabeceras },
  })
    .then(async (r) =>
      r.ok && r.headers.get("content-type")?.includes("text/html")
        ? { html: await r.text(), url: r.url }
        : null,
    )
    .catch(() => null);
  precargas.set(k, { vence: Date.now() + TTL_MS, respuesta });
}

/** Toma (y descarta) la precarga vigente de esa dirección, si existe. */
export function tomarPrecarga(href: string): Precarga["respuesta"] | null {
  const k = clave(href);
  const p = precargas.get(k);
  precargas.delete(k);
  return p && p.vence > Date.now() ? p.respuesta : null;
}

/** Tras guardar algo, lo precargado puede estar viejo. */
export function olvidarPrecargas(): void {
  precargas.clear();
}

// ── Disparadores: mouse (tras una breve pausa), dedo y teclado ──
function enlace(ev: Event): HTMLAnchorElement | null {
  const a = (ev.target as HTMLElement).closest?.<HTMLAnchorElement>("a[href]");
  if (!a || a.target || a.hasAttribute("download") || a.dataset.astroReload !== undefined)
    return null;
  return a;
}
function precargarEnlace(a: HTMLAnchorElement) {
  if (a.dataset.persona) precargar(`/ventanas/persona/${a.dataset.persona}`, { "X-Ventana": "1" });
  else precargar(a.href);
}
let espera: number | undefined;
document.addEventListener("mouseover", (ev) => {
  const a = enlace(ev);
  if (!a) return;
  clearTimeout(espera);
  espera = window.setTimeout(() => precargarEnlace(a), 60);
});
document.addEventListener("mouseout", () => clearTimeout(espera));
document.addEventListener(
  "touchstart",
  (ev) => {
    const a = enlace(ev);
    if (a) precargarEnlace(a);
  },
  { passive: true },
);
document.addEventListener("focusin", (ev) => {
  const a = enlace(ev);
  if (a) precargarEnlace(a);
});
