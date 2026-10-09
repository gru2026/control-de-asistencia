/**
 * Mejoras progresivas de interfaz. Todo funciona sin JavaScript;
 * esto solo agrega comodidad. Se activa por atributos data-*.
 */
import { activarNavegacionParcial } from "./navegacion-parcial";

document.documentElement.classList.add("js");

// Primero: así sus preventDefault() se respetan en los demás listeners de clic/envío.
activarNavegacionParcial((raiz) => inicializar(raiz));

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
  if (form.method.toLowerCase() !== "post") return;
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

// ── Estados de carga para navegaciones completas (otra página, guardar) ──
// Los cambios dentro de la misma página (filtros) los maneja navegacion-parcial.ts.
function iniciarCarga() {
  document.documentElement.classList.add("navegando");
}

document.addEventListener("submit", (ev) => {
  if (!ev.defaultPrevented) iniciarCarga();
});

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
  if (!a || a.target || a.hasAttribute("download")) return;
  const destino = new URL(a.href, location.href);
  if (destino.origin !== location.origin || destino.pathname.startsWith("/api/")) return;
  if (destino.pathname === location.pathname && destino.search === location.search) return; // solo ancla
  iniciarCarga();
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
// Los select se aplican al cambiar; la búsqueda, con una pausa al escribir.
document.addEventListener("change", (ev) => {
  const t = ev.target;
  if (t instanceof HTMLSelectElement && t.form?.hasAttribute("data-autoenviar"))
    t.form.requestSubmit();
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

/** Inicializaciones que dependen de elementos concretos (se repiten tras cada reemplazo). */
function inicializar(raiz: ParentNode) {
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

  // Avisos de éxito: se ocultan solos
  raiz.querySelectorAll<HTMLElement>("[data-autocerrar]").forEach((el) => {
    setTimeout(() => {
      el.style.transition = "opacity 300ms";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 320);
    }, 6000);
  });
}

inicializar(document);
