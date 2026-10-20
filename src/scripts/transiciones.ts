/**
 * Navegación de una sola página (D-46). El ClientRouter de Astro pide cada
 * pantalla en segundo plano y reemplaza el contenido sin recargar: la barra
 * superior y el menú no parpadean. Este módulo agrega lo propio de la app:
 *
 * - Misma pantalla con otros filtros, orden o página: esqueletos sobre los
 *   datos, se conserva el desplazamiento, la búsqueda (con su foco y lo que se
 *   sigue escribiendo), los filtros desplegados y las secciones abiertas.
 * - Otra pantalla: barra de progreso superior.
 * - Aviso de cambios sin guardar antes de salir de un formulario.
 *
 * Si algo falla (sin conexión, respuesta que no es HTML), el router hace una
 * navegación normal: la app sigue funcionando igual que sin JavaScript.
 */
import type {
  TransitionBeforePreparationEvent,
  TransitionBeforeSwapEvent,
} from "astro:transitions/client";

type AlCargar = (raiz: ParentNode) => void;

const raiz = document.documentElement;
let mismaPantalla = false;
let desplazamiento = 0;
let alPaginar = false;
let haciaAtras = false;
let restaurarFoco: () => void = () => {};

function anunciar(texto: string) {
  const zona = document.getElementById("anuncio");
  if (!zona) return;
  zona.textContent = "";
  setTimeout(() => (zona.textContent = texto), 50);
}

/** Copia al contenido nuevo el estado de interfaz que el servidor no conoce. */
function conservarEstado(viejo: Element, nuevo: Element, conservarFoco: boolean): () => void {
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
  // Secciones <details> abiertas («Ver datos»)
  const detViejos = viejo.querySelectorAll("details");
  const detNuevos = nuevo.querySelectorAll("details");
  if (detViejos.length === detNuevos.length) {
    detViejos.forEach((d, i) => {
      if (d.open) detNuevos[i]!.setAttribute("open", "");
    });
  }
  // Campo con foco (la búsqueda): se traslada el elemento real para conservar
  // foco, cursor y lo que la persona siguió escribiendo.
  const activo = document.activeElement;
  // Con atrás/adelante se muestra lo que trae la URL, no lo que había en el campo.
  if (conservarFoco && activo instanceof HTMLInputElement && activo.id && viejo.contains(activo)) {
    const destino = nuevo.querySelector(`#${CSS.escape(activo.id)}`);
    if (destino) {
      const [ini, fin] = [activo.selectionStart, activo.selectionEnd];
      destino.replaceWith(activo);
      return () => {
        activo.focus({ preventScroll: true });
        if (ini !== null && fin !== null) activo.setSelectionRange(ini, fin);
      };
    }
  }
  return () => {};
}

export function activarTransiciones(alCargar: AlCargar) {
  document.addEventListener("astro:before-preparation", (ev) => {
    const e = ev as TransitionBeforePreparationEvent;
    const sucio = document.querySelector("form[data-avisar-cambios][data-sucio]");
    if (
      sucio &&
      e.navigationType !== "traverse" &&
      !confirm("Hay cambios sin guardar. ¿Desea continuar sin guardarlos?")
    ) {
      e.preventDefault();
      return;
    }
    // Misma pantalla: filtros (GET) o una acción que vuelve a ella (POST → redirección)
    mismaPantalla = e.to.pathname === location.pathname;
    const esAccion = e.formData !== undefined;
    haciaAtras = e.navigationType === "traverse";
    desplazamiento = scrollY;
    alPaginar = !!(e.sourceElement as Element | undefined)?.closest?.(".paginacion");
    raiz.classList.add("navegando");
    if (mismaPantalla && !esAccion) {
      raiz.classList.add("cargando");
      document.getElementById("contenido")?.setAttribute("aria-busy", "true");
    }
  });

  document.addEventListener("astro:before-swap", (ev) => {
    const e = ev as TransitionBeforeSwapEvent;
    restaurarFoco = () => {};
    // Lo que no cambia de una pantalla a otra no se anima
    if (mismaPantalla) {
      const viejo = document.getElementById("contenido");
      const nuevo = e.newDocument.getElementById("contenido");
      if (viejo && nuevo) restaurarFoco = conservarEstado(viejo, nuevo, !haciaAtras);
    }
  });

  document.addEventListener("astro:after-swap", () => {
    // El router copia los atributos de <html> de la pantalla nueva: se repone la marca de JS.
    raiz.classList.add("js");
    if (mismaPantalla && !alPaginar && !haciaAtras && !location.hash) {
      scrollTo({ top: desplazamiento, behavior: "instant" });
    } else if (alPaginar) {
      document.getElementById("contenido")?.scrollIntoView({ block: "start" });
    }
    restaurarFoco();
  });

  document.addEventListener("astro:page-load", () => {
    raiz.classList.remove("navegando", "cargando");
    document.getElementById("contenido")?.removeAttribute("aria-busy");
    alCargar(document);
    if (mismaPantalla) {
      const total = document.querySelector(".total")?.textContent?.trim();
      anunciar(total ? `Resultados actualizados: ${total}` : "Contenido actualizado");
    }
    mismaPantalla = false;
  });
}
