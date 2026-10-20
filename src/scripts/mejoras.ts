/**
 * Mejoras progresivas de interfaz. Todo funciona sin JavaScript;
 * esto solo agrega comodidad. Se activa por atributos data-*.
 */
// Primero: sus oyentes de envío (confirmación, formularios rápidos) deben correr antes.
import "./ventanas";
import { navigate } from "astro:transitions/client";
import "./precarga";
import { activarTransiciones } from "./transiciones";

document.documentElement.classList.add("js");

// Este módulo se carga antes que el ClientRouter: sus preventDefault() se respetan.
activarTransiciones((raiz) => inicializar(raiz));

const MENSAJES = {
  requerido: "Este campo es obligatorio.",
  email: "Escriba un correo válido, por ejemplo nombre@colegio.com.",
  numero: "Revise el número indicado.",
  cedula: "Cédula no válida. Ejemplo: V-12345678.",
};

/** Cédula: "12.345.678" → "V-12345678" */
function formatearCedula(v: string): string {
  const limpio = v.toUpperCase().replace(/[\s.]/g, "");
  const m = /^([VE])?-?(\d{5,9})$/.exec(limpio);
  return m ? `${m[1] ?? "V"}-${m[2]}` : v.trim();
}

function mensajeError(
  campo: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
): string | null {
  const v = campo.value.trim();
  if (campo.required && v === "") return MENSAJES.requerido;
  if (v === "") return null;
  if (campo instanceof HTMLInputElement) {
    if (campo.dataset.formato === "cedula" && !/^[VE]-\d{5,9}$/.test(v)) return MENSAJES.cedula;
    if (campo.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return MENSAJES.email;
    if (campo.type === "number" && !campo.checkValidity()) {
      const min = campo.min,
        max = campo.max;
      return min && max ? `Debe estar entre ${min} y ${max}.` : MENSAJES.numero;
    }
  }
  return null;
}

/** Muestra u oculta el error de cliente junto al campo (sin pisar el del servidor). */
function validarCampo(campo: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  const contenedor = campo.closest(".campo") ?? campo.parentElement;
  if (!contenedor) return true;
  let aviso = contenedor.querySelector<HTMLElement>(".error-cliente");
  const servidor = contenedor.querySelector(".error:not(.error-cliente)");
  const msg = mensajeError(campo);
  if (msg && !servidor) {
    if (!aviso) {
      aviso = document.createElement("small");
      aviso.className = "error error-cliente";
      aviso.id = `${campo.id || campo.name}-error-cliente`;
      contenedor.append(aviso);
    }
    aviso.textContent = msg;
    campo.setAttribute("aria-invalid", "true");
    campo.setAttribute(
      "aria-describedby",
      [campo.getAttribute("aria-describedby"), aviso.id].filter(Boolean).join(" "),
    );
  } else if (!msg) {
    aviso?.remove();
    if (!servidor) campo.removeAttribute("aria-invalid");
  }
  return !msg;
}

document.addEventListener("focusout", (ev) => {
  const t = ev.target;
  if (!(
    t instanceof HTMLInputElement ||
    t instanceof HTMLSelectElement ||
    t instanceof HTMLTextAreaElement
  ))
    return;
  if (!t.form || t.form.method.toLowerCase() !== "post" || t.type === "hidden") return;
  if (t instanceof HTMLInputElement && t.dataset.formato === "cedula")
    t.value = formatearCedula(t.value);
  validarCampo(t);
});

document.addEventListener("input", (ev) => {
  const t = ev.target;
  if (t instanceof HTMLElement && t.getAttribute("aria-invalid") === "true" && "value" in t) {
    validarCampo(t as HTMLInputElement);
  }
  const form = (t as HTMLInputElement).form;
  if (form?.hasAttribute("data-avisar-cambios")) form.dataset.sucio = "1";
});

// Envío: validar, evitar doble envío y mostrar "Guardando…"
document.addEventListener("submit", (ev) => {
  const form = ev.target as HTMLFormElement;
  if (ev.defaultPrevented || form.method.toLowerCase() !== "post") return;
  const campos = [
    ...form.querySelectorAll<HTMLInputElement>("input:not([type=hidden]), select, textarea"),
  ].filter((c) => !c.disabled && !c.closest("[hidden]"));
  campos.forEach((c) => {
    if (c instanceof HTMLInputElement && c.dataset.formato === "cedula")
      c.value = formatearCedula(c.value);
  });
  const invalidos = campos.filter((c) => !validarCampo(c));
  if (invalidos.length) {
    ev.preventDefault();
    invalidos[0]!.focus();
    return;
  }
  if (form.dataset.enviando) {
    ev.preventDefault();
    return;
  }
  form.dataset.enviando = "1";
  delete form.dataset.sucio;
  const boton = (ev as SubmitEvent).submitter as HTMLButtonElement | null;
  if (boton && boton.type === "submit") {
    boton.setAttribute("aria-busy", "true");
    boton.dataset.textoOriginal = boton.innerHTML;
    boton.disabled = true;
    boton.innerHTML = `<span class="girando" aria-hidden="true"></span>${boton.dataset.textoCargando ?? "Guardando…"}`;
    // Algunos navegadores no envían el name/value del botón deshabilitado: se conserva.
    if (boton.name) {
      const h = document.createElement("input");
      h.type = "hidden";
      h.name = boton.name;
      h.value = boton.value;
      form.append(h);
    }
  }
});

// Restaurar botones si se vuelve con "atrás" (caché del navegador)
addEventListener("pageshow", () => {
  document.documentElement.classList.remove("navegando", "cargando");
  document.getElementById("contenido")?.removeAttribute("aria-busy");
  document.querySelectorAll<HTMLFormElement>("form[data-enviando]").forEach((f) => {
    delete f.dataset.enviando;
    f.querySelectorAll<HTMLButtonElement>("button[aria-busy]").forEach((b) => {
      b.disabled = false;
      b.removeAttribute("aria-busy");
      if (b.dataset.textoOriginal) b.innerHTML = b.dataset.textoOriginal;
    });
  });
});

// Aviso de cambios sin guardar
addEventListener("beforeunload", (ev) => {
  if (document.querySelector("form[data-avisar-cambios][data-sucio]")) ev.preventDefault();
});

function cerrarMensaje(el: HTMLElement) {
  if (!el.isConnected) return;
  el.style.transition = "opacity 200ms";
  el.style.opacity = "0";
  setTimeout(() => el.remove(), 220);
}
document.addEventListener("click", (ev) => {
  const b = (ev.target as HTMLElement).closest("[data-cerrar-mensaje]");
  const m = b?.closest<HTMLElement>(".mensaje");
  if (m) cerrarMensaje(m);
});

// Panel de avisos de la campana: abrir, cerrar (clic afuera, Escape, al navegar)
function panelAvisos(abrir: boolean) {
  const raizAvisos = document.querySelector<HTMLElement>("[data-avisos]");
  if (!raizAvisos) return;
  const boton = raizAvisos.querySelector<HTMLButtonElement>("[data-alternar-avisos]");
  const panel = raizAvisos.querySelector<HTMLElement>(".panel");
  const velo = raizAvisos.querySelector<HTMLElement>(".velo");
  if (!boton || !panel || !velo) return;
  const estaba = !panel.hidden;
  panel.hidden = !abrir;
  velo.hidden = !abrir;
  boton.setAttribute("aria-expanded", String(abrir));
  if (abrir) panel.focus({ preventScroll: true });
  else if (estaba) boton.focus({ preventScroll: true });
}
document.addEventListener("click", (ev) => {
  const t = ev.target as HTMLElement;
  if (t.closest("[data-alternar-avisos]")) {
    const panel = document.getElementById("panel-avisos");
    panelAvisos(!!panel?.hidden);
  } else if (t.closest("[data-cerrar-avisos]")) panelAvisos(false);
});
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape" && !document.getElementById("panel-avisos")?.hidden) panelAvisos(false);
});
document.addEventListener("astro:before-preparation", () => panelAvisos(false));

// Mostrar / ocultar contraseña y copiar al portapapeles
document.addEventListener("click", async (ev) => {
  const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-mostrar-clave], [data-copiar]");
  if (!el) return;
  const destino = document.getElementById(
    el.dataset.mostrarClave ?? el.dataset.copiar ?? "",
  ) as HTMLInputElement | null;
  if (!destino) return;
  if (el.dataset.mostrarClave !== undefined) {
    const mostrar = destino.type === "password";
    destino.type = mostrar ? "text" : "password";
    el.setAttribute("aria-pressed", String(mostrar));
    el.setAttribute("aria-label", mostrar ? "Ocultar contraseña" : "Mostrar contraseña");
  } else {
    try {
      await navigator.clipboard.writeText(destino.value);
      const original = el.textContent;
      el.textContent = "Copiada";
      setTimeout(() => (el.textContent = original), 1800);
    } catch {
      destino.select();
    }
  }
});

// Filtros (delegado: sigue funcionando tras reemplazar el contenido)
// Los select y fechas se aplican al cambiar; la búsqueda, con una pausa al escribir.
document.addEventListener("change", (ev) => {
  const t = ev.target;
  if (
    (t instanceof HTMLSelectElement || (t instanceof HTMLInputElement && t.type === "date")) &&
    t.form?.hasAttribute("data-autoenviar")
  )
    t.form.requestSubmit();
});

// Formularios GET (filtros): URL sin parámetros vacíos y navegación sin recargar.
document.addEventListener("submit", (ev) => {
  const form = ev.target as HTMLFormElement;
  if (ev.defaultPrevented || form.method.toLowerCase() !== "get") return;
  if (form.dataset.astroReload !== undefined) return;
  const url = new URL(form.getAttribute("action") || location.href, location.href);
  if (url.origin !== location.origin || url.pathname.startsWith("/api/")) return;
  url.search = new URLSearchParams(
    [...new FormData(form).entries()].filter(
      (e): e is [string, string] => typeof e[1] === "string" && e[1] !== "",
    ),
  ).toString();
  ev.preventDefault();
  if (url.pathname === location.pathname && url.search === location.search) return;
  void navigate(url.href);
});

// Imprimir (hoja del QR, hoja de claves…)
document.addEventListener("click", (ev) => {
  if ((ev.target as HTMLElement).closest("[data-imprimir]")) window.print();
});
let esperaBusqueda: number | undefined;
document.addEventListener("input", (ev) => {
  const t = ev.target;
  if (
    !(t instanceof HTMLInputElement) ||
    t.type !== "search" ||
    !t.form?.hasAttribute("data-autoenviar")
  )
    return;
  clearTimeout(esperaBusqueda);
  const form = t.form;
  esperaBusqueda = window.setTimeout(() => {
    if (t.value.length === 0 || t.value.trim().length >= 2) form.requestSubmit();
  }, 400);
});

// Mostrar / ocultar filtros en el celular
document.addEventListener("click", (ev) => {
  const b = (ev.target as HTMLElement).closest<HTMLButtonElement>("[data-alternar-filtros]");
  if (!b) return;
  const abierto = b.form?.classList.toggle("abierto") ?? false;
  b.setAttribute("aria-expanded", String(abierto));
});

// Secciones plegables: recordar abiertas/cerradas en este navegador
const CLAVE_SECCIONES = "gru:secciones";
function leerSecciones(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SECCIONES) ?? "{}");
  } catch {
    return {};
  }
}
document.addEventListener(
  "toggle",
  (ev) => {
    const d = ev.target;
    if (!(d instanceof HTMLDetailsElement) || !d.dataset.recordar) return;
    const estado = leerSecciones();
    estado[d.dataset.recordar] = d.open;
    try {
      localStorage.setItem(CLAVE_SECCIONES, JSON.stringify(estado));
    } catch {
      /* almacenamiento no disponible: no se recuerda */
    }
  },
  true,
);
// Un enlace a una sección plegable (p. ej. «Requiere atención» → #seccion-personas) la abre
function abrirSeccionDelAncla() {
  const destino =
    location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (destino instanceof HTMLDetailsElement) {
    destino.open = true;
    destino.scrollIntoView({ block: "start" });
  }
}
addEventListener("hashchange", abrirSeccionDelAncla);

// Volver a la pantalla actual después de una acción (sin recargar la app).
export function recargarPantalla() {
  return navigate(location.href, { history: "replace" });
}

// Pestañas de la ficha: una sección a la vez; el ancla (#permisos, #dispositivo…) elige la suya
function mostrarPestana(nav: HTMLElement, id: string, desplazar = false) {
  const contenedor = nav.parentElement;
  if (!contenedor) return;
  const paneles = [...contenedor.querySelectorAll<HTMLElement>("[data-panel]")];
  const panel =
    paneles.find((p) => p.dataset.panel === id) ??
    paneles.find((p) => p.querySelector(`#${CSS.escape(id)}`));
  if (!panel) return;
  paneles.forEach((p) => p.classList.toggle("activo", p === panel));
  nav.querySelectorAll<HTMLAnchorElement>("[data-tab]").forEach((a) => {
    if (a.dataset.tab === panel.dataset.panel) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  if (desplazar) {
    const destino = panel.dataset.panel === id ? null : panel.querySelector(`#${CSS.escape(id)}`);
    (destino ?? nav).scrollIntoView({ block: "start" });
  }
}
document.addEventListener("click", (ev) => {
  const a = (ev.target as HTMLElement).closest<HTMLAnchorElement>(
    "[data-pestanas-ficha] a[data-tab]",
  );
  if (!a) return;
  ev.preventDefault();
  const nav = a.closest<HTMLElement>("[data-pestanas-ficha]")!;
  mostrarPestana(nav, a.dataset.tab!);
  history.replaceState(history.state, "", `#${a.dataset.tab}`);
});

addEventListener("hashchange", () => {
  const nav = document.querySelector<HTMLElement>("[data-pestanas-ficha]");
  if (nav && location.hash) mostrarPestana(nav, decodeURIComponent(location.hash.slice(1)), true);
});

/** Inicializaciones que dependen de elementos concretos (se repiten tras cada reemplazo). */
function inicializar(raiz: ParentNode) {
  const navFicha = raiz.querySelector<HTMLElement>("[data-pestanas-ficha]");
  if (navFicha && location.hash)
    mostrarPestana(navFicha, decodeURIComponent(location.hash.slice(1)), true);
  const estado = leerSecciones();
  raiz.querySelectorAll<HTMLDetailsElement>("details[data-recordar]").forEach((d) => {
    const guardado = estado[d.dataset.recordar!];
    if (guardado !== undefined) d.open = guardado;
  });
  abrirSeccionDelAncla();

  // Al elegir categoría, proponer su jornada (si el usuario no eligió otra)
  raiz.querySelectorAll<HTMLSelectElement>("select[data-jornada-sugerida]").forEach((cat) => {
    const jornada = document.getElementById(
      cat.dataset.jornadaSugerida ?? "",
    ) as HTMLSelectElement | null;
    if (!jornada) return;
    let tocada = jornada.value !== "";
    jornada.addEventListener("change", () => (tocada = true));
    cat.addEventListener("change", () => {
      const sugerida = cat.selectedOptions[0]?.dataset.jornada;
      if (sugerida && !tocada) jornada.value = sugerida;
    });
  });

  // Mensajes de éxito: se ocultan solos (más tarde si ofrecen «Deshacer»)
  raiz.querySelectorAll<HTMLElement>("[data-autocerrar]").forEach((el) => {
    setTimeout(() => cerrarMensaje(el), Number(el.dataset.autocerrar) || 6000);
  });
}

// La primera carga y cada navegación disparan «astro:page-load» (ver transiciones.ts).
