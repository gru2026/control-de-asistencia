/**
 * Navegación parcial: cuando un filtro, orden, paginación o período cambia
 * dentro de la MISMA página, se pide la página al servidor en segundo plano y
 * solo se reemplaza el contenido de <main id="contenido">. La barra superior,
 * el menú, la posición de desplazamiento y el campo de búsqueda (con su foco y
 * lo que se está escribiendo) se conservan.
 *
 * Si algo falla (sin conexión, sesión vencida, error del servidor) se hace una
 * navegación normal: la app sigue funcionando igual que sin JavaScript.
 *
 * Exclusión: agregar data-recarga a un enlace o formulario.
 */

type AlActualizar = (raiz: HTMLElement) => void;

let controlador: AbortController | null = null;
let alActualizar: AlActualizar = () => {};

const raiz = document.documentElement;

function contenido() {
  return document.getElementById("contenido");
}

function anunciar(texto: string) {
  const zona = document.getElementById("anuncio");
  if (!zona) return;
  zona.textContent = "";
  // Pequeña espera para que el lector de pantalla detecte el cambio
  setTimeout(() => (zona.textContent = texto), 50);
}

function iniciarCarga() {
  raiz.classList.add("navegando", "cargando");
  contenido()?.setAttribute("aria-busy", "true");
}

function terminarCarga() {
  raiz.classList.remove("navegando", "cargando");
  contenido()?.removeAttribute("aria-busy");
}

/** ¿El destino es la misma página con otros parámetros? */
export function esMismaPagina(url: URL): boolean {
  return (
    url.origin === location.origin &&
    url.pathname === location.pathname &&
    !url.pathname.startsWith("/api/") &&
    url.search !== location.search
  );
}

/** Copia al contenido nuevo el estado de interfaz que el servidor no conoce. Devuelve cómo restaurar el foco. */
function conservarEstado(
  viejo: HTMLElement,
  nuevo: HTMLElement,
  conservarFoco: boolean,
): () => void {
  // Filtros desplegados en el celular
  const formsViejos = viejo.querySelectorAll<HTMLFormElement>("form[data-autoenviar]");
  const formsNuevos = nuevo.querySelectorAll<HTMLFormElement>("form[data-autoenviar]");
  formsViejos.forEach((f, i) => {
    const n = formsNuevos[i];
    if (n && f.classList.contains("abierto")) {
      n.classList.add("abierto");
      n.querySelector("[data-alternar-filtros]")?.setAttribute("aria-expanded", "true");
    }
  });
  // Secciones <details> abiertas ("Ver datos")
  const detViejos = viejo.querySelectorAll("details");
  const detNuevos = nuevo.querySelectorAll("details");
  if (detViejos.length === detNuevos.length) {
    detViejos.forEach((d, i) => {
      if (d.open) detNuevos[i]!.open = true;
    });
  }
  // Campo con foco (p. ej. la búsqueda): se traslada el elemento real para
  // conservar foco, cursor y lo que el usuario siguió escribiendo.
  const activo = document.activeElement;
  if (conservarFoco && activo instanceof HTMLInputElement && activo.id && viejo.contains(activo)) {
    const destino = nuevo.querySelector(`#${CSS.escape(activo.id)}`);
    if (destino) {
      const [ini, fin] = [activo.selectionStart, activo.selectionEnd];
      destino.replaceWith(activo); // mover el nodo le quita el foco: se devuelve después
      return () => {
        activo.focus({ preventScroll: true });
        if (ini !== null && fin !== null) activo.setSelectionRange(ini, fin);
      };
    }
  }
  return () => {};
}

async function cargar(
  url: URL,
  opciones: { historial: "push" | "replace" | "ninguno"; desplazar?: boolean },
) {
  const main = contenido();
  if (!main) {
    location.href = url.href;
    return;
  }
  const sucio = main.querySelector("form[data-avisar-cambios][data-sucio]");
  if (sucio && !confirm("Hay cambios sin guardar. ¿Desea continuar sin guardarlos?")) return;

  controlador?.abort();
  controlador = new AbortController();
  const propio = controlador;
  iniciarCarga();

  try {
    const res = await fetch(url.href, {
      headers: { "X-Navegacion": "parcial" },
      credentials: "same-origin",
      signal: propio.signal,
    });
    const final = new URL(res.url);
    // Redirección a otra página (sesión vencida, sin permiso…) o error: navegación normal
    if (
      !res.ok ||
      final.pathname !== url.pathname ||
      !res.headers.get("content-type")?.includes("text/html")
    ) {
      location.href = final.pathname === url.pathname ? url.href : final.href;
      return;
    }
    const html = await res.text();
    if (propio !== controlador) return; // llegó una respuesta más nueva
    const doc = new DOMParser().parseFromString(html, "text/html");
    const nuevo = doc.getElementById("contenido");
    if (!nuevo) {
      location.href = url.href;
      return;
    }

    // Con atrás/adelante se muestra lo que trae la URL, no lo que había en el campo.
    const restaurarFoco = conservarEstado(main, nuevo, opciones.historial !== "ninguno");
    main.replaceChildren(...Array.from(nuevo.childNodes));
    restaurarFoco();
    if (doc.title) document.title = doc.title;

    if (opciones.historial === "push") history.pushState({ parcial: true }, "", url.href);
    else if (opciones.historial === "replace")
      history.replaceState({ parcial: true }, "", url.href);

    alActualizar(main);
    terminarCarga();

    if (url.hash) document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView();
    else if (opciones.desplazar) main.scrollIntoView({ block: "start" });

    const total = main.querySelector(".total")?.textContent?.trim();
    anunciar(total ? `Resultados actualizados: ${total}` : "Contenido actualizado");
  } catch (e) {
    if ((e as Error).name === "AbortError") return;
    location.href = url.href; // sin conexión u otro error: el navegador decide
  }
}

/** Activa la navegación parcial. `inicializar` se ejecuta tras cada reemplazo. */
export function activarNavegacionParcial(inicializar: AlActualizar) {
  alActualizar = inicializar;
  history.replaceState({ parcial: true }, "", location.href);

  // Enlaces: filtros activos, orden de columnas, paginación, período…
  document.addEventListener("click", (ev) => {
    if (
      ev.defaultPrevented ||
      ev.button !== 0 ||
      ev.metaKey ||
      ev.ctrlKey ||
      ev.shiftKey ||
      ev.altKey
    )
      return;
    const a = (ev.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
    if (!a || a.target || a.hasAttribute("download") || a.hasAttribute("data-recarga")) return;
    const url = new URL(a.href, location.href);
    if (!esMismaPagina(url)) return;
    ev.preventDefault();
    void cargar(url, { historial: "push", desplazar: Boolean(a.closest(".paginacion")) });
  });

  // Formularios GET (filtros): se interceptan antes de que el navegador recargue
  document.addEventListener("submit", (ev) => {
    if (ev.defaultPrevented) return;
    const form = ev.target as HTMLFormElement;
    if (form.method.toLowerCase() !== "get" || form.hasAttribute("data-recarga")) return;
    const url = new URL(form.action || location.href, location.href);
    if (url.pathname !== location.pathname) return;
    const datos = new FormData(form);
    // Sin parámetros vacíos: URLs más limpias (el servidor usa los valores por defecto).
    url.search = new URLSearchParams(
      [...datos.entries()].filter(
        (e): e is [string, string] => typeof e[1] === "string" && e[1] !== "",
      ),
    ).toString();
    ev.preventDefault();
    if (url.search === location.search) return;
    void cargar(url, { historial: "push" });
  });

  // Botones atrás / adelante del navegador
  addEventListener("popstate", (ev) => {
    if (!(ev.state as { parcial?: boolean } | null)?.parcial) return;
    void cargar(new URL(location.href), { historial: "ninguno" });
  });
}
