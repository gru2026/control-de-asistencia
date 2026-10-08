/* GRU-system · Service worker
 * - Guarda en caché solo recursos públicos (íconos, página sin conexión).
 * - Las páginas siempre se piden a la red: nunca se guardan datos privados.
 * - Sin conexión, las navegaciones muestran /offline.html.
 */
const VERSION = "gru-v1";
const PRECACHE = [
  "/offline.html",
  "/manifest.webmanifest",
  "/favicon-32.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navegación: red primero; si falla, página sin conexión.
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("/offline.html")));
    return;
  }

  // Recursos estáticos versionados e íconos: caché primero.
  if (url.pathname.startsWith("/_astro/") || url.pathname.startsWith("/icons/") || PRECACHE.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then(
        (enCache) =>
          enCache ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copia = res.clone();
              caches.open(VERSION).then((c) => c.put(req, copia));
            }
            return res;
          }),
      ),
    );
  }
  // Todo lo demás (API, datos): sin intervención, va directo a la red.
});
