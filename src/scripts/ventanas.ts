/**
 * Ventanas (D-49): abrir un fragmento en un <dialog> sin salir de la pantalla,
 * enviar sus formularios rápidos a /api/acciones y confirmar acciones con una
 * ventana propia (no el confirm() del navegador).
 *
 * - `[data-ventana="/ruta"]` (botón o enlace) abre el fragmento; `data-ventana-modo`
 *   es "cajon" (panel lateral, por defecto) o "centro".
 * - `a[data-persona="<id>"]` abre el resumen de la persona; con Ctrl o clic central
 *   se sigue el enlace normal a la ficha.
 * - `form[data-api]` se envía con fetch; responde JSON { ok, mensaje, errores }.
 *   Si sale bien se cierra la ventana y se actualiza la pantalla (el mensaje
 *   llega por la cookie flash); si no, los errores se muestran junto a cada campo.
 * - `form[data-confirmar="¿…?"]` pide confirmación antes de enviarse.
 *
 * Este módulo se importa primero en mejoras.ts: sus oyentes de envío corren
 * antes que los demás y antes que el router.
 */
import { navigate } from "astro:transitions/client";

const ESQUELETO =
  '<div class="v-cargando" aria-hidden="true"><span></span><span></span><span></span><span></span></div>';

function ventana(): HTMLDialogElement | null {
  return document.getElementById("ventana") as HTMLDialogElement | null;
}

export async function abrirVentana(url: string, modo: "cajon" | "centro" = "cajon") {
  const dialogo = ventana();
  const contenido = dialogo?.querySelector<HTMLElement>("[data-ventana-contenido]");
  if (!dialogo || !contenido) {
    location.href = url;
    return;
  }
  dialogo.className = `ventana ${modo}`;
  contenido.innerHTML = ESQUELETO;
  contenido.setAttribute("aria-busy", "true");
  if (!dialogo.open) dialogo.showModal();
  try {
    const res = await fetch(url, { headers: { "X-Ventana": "1" }, credentials: "same-origin" });
    const final = new URL(res.url);
    // Sesión vencida u otra respuesta inesperada: navegación normal
    if (
      !res.ok ||
      final.pathname === "/login" ||
      !res.headers.get("content-type")?.includes("text/html")
    ) {
      location.href = final.pathname === "/login" ? final.href : url;
      return;
    }
    const html = await res.text();
    if (!dialogo.open) return;
    contenido.innerHTML = html;
    contenido.removeAttribute("aria-busy");
    const titulo = contenido.querySelector<HTMLElement>("[data-ventana-titulo]");
    if (titulo?.id) dialogo.setAttribute("aria-labelledby", titulo.id);
    contenido.querySelector<HTMLElement>("[autofocus], .v-cabecera")?.focus?.();
  } catch {
    contenido.innerHTML =
      '<div class="v-cargando"><p class="v-mensaje-error">No se pudo cargar. Revise la conexión e intente de nuevo.</p></div>';
  }
}

export function cerrarVentana() {
  const d = ventana();
  if (d?.open) d.close();
}

// ── Abrir ───────────────────────────────────────────────────────
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
  const t = ev.target as HTMLElement;
  const disparador = t.closest<HTMLElement>("[data-ventana], a[data-persona]");
  if (disparador) {
    ev.preventDefault();
    const url = disparador.dataset.ventana ?? `/ventanas/persona/${disparador.dataset.persona}`;
    const modo = disparador.dataset.ventanaModo === "centro" ? "centro" : "cajon";
    void abrirVentana(url, modo);
    return;
  }
  if (t.closest("[data-cerrar-ventana]")) {
    cerrarVentana();
    return;
  }
  // Clic en el fondo oscuro (fuera del contenido) cierra
  const d = ventana();
  if (d?.open && t === d) cerrarVentana();
});
document.addEventListener("astro:before-preparation", () => cerrarVentana());

// ── Confirmación ────────────────────────────────────────────────
function confirmar(pregunta: string, textoSi: string): Promise<boolean> {
  const d = document.getElementById("confirmacion") as HTMLDialogElement | null;
  if (!d) return Promise.resolve(confirm(pregunta));
  d.querySelector<HTMLElement>("[data-pregunta]")!.textContent = pregunta;
  const si = d.querySelector<HTMLButtonElement>('button[value="si"]')!;
  si.textContent = textoSi;
  d.returnValue = "";
  d.showModal();
  si.focus();
  return new Promise((resolver) => {
    d.addEventListener("close", () => resolver(d.returnValue === "si"), { once: true });
  });
}

// ── Envío ───────────────────────────────────────────────────────
function limpiarErrores(form: HTMLFormElement) {
  form.querySelectorAll(".v-error").forEach((e) => e.remove());
  form.querySelectorAll("[aria-invalid]").forEach((e) => e.removeAttribute("aria-invalid"));
  const general = form.querySelector(".v-mensaje-error");
  if (general) general.textContent = "";
}

function mostrarErrores(form: HTMLFormElement, mensaje: string, errores: Record<string, string>) {
  let primero: HTMLElement | null = null;
  for (const [nombre, texto] of Object.entries(errores)) {
    const campo = form.querySelector<HTMLElement>(`[name="${CSS.escape(nombre)}"]`);
    const caja = campo?.closest(".v-campo");
    if (!campo || !caja) continue;
    const aviso = document.createElement("small");
    aviso.className = "v-error";
    aviso.textContent = texto;
    caja.append(aviso);
    campo.setAttribute("aria-invalid", "true");
    primero ??= campo;
  }
  let general = form.querySelector<HTMLElement>(".v-mensaje-error");
  if (!general) {
    general = document.createElement("p");
    general.className = "v-mensaje-error";
    general.setAttribute("role", "alert");
    form.prepend(general);
  }
  general.textContent = Object.keys(errores).length ? "Revise los campos marcados." : mensaje;
  (primero ?? general).focus?.();
}

async function enviarApi(form: HTMLFormElement, submitter: HTMLElement | null) {
  const boton = submitter instanceof HTMLButtonElement ? submitter : null;
  const textoBoton = boton?.innerHTML;
  if (boton) {
    boton.disabled = true;
    boton.textContent = boton.dataset.textoCargando ?? "Guardando…";
  }
  limpiarErrores(form);
  const datos = new FormData(form, submitter);
  datos.set("volver", location.pathname + location.search);
  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: datos,
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    });
    const r = (await res.json()) as {
      ok: boolean;
      mensaje?: string;
      errores?: Record<string, string>;
    };
    if (r.ok) {
      cerrarVentana();
      form.closest("dialog")?.close();
      // El mensaje de resultado llega en la cookie flash de esta pantalla
      await navigate(location.href, { history: "replace" });
      return;
    }
    mostrarErrores(form, r.mensaje ?? "No se pudo completar.", r.errores ?? {});
  } catch {
    mostrarErrores(form, "No se pudo contactar al servidor. Revise la conexión.", {});
  }
  if (boton) {
    boton.disabled = false;
    if (textoBoton !== undefined) boton.innerHTML = textoBoton;
  }
}

document.addEventListener("submit", (ev) => {
  const form = ev.target as HTMLFormElement;
  const submitter = (ev as SubmitEvent).submitter as HTMLElement | null;
  const pregunta = form.dataset.confirmar;
  if (pregunta && !form.dataset.confirmado) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    void confirmar(pregunta, form.dataset.confirmarSi ?? "Sí, continuar").then((ok) => {
      if (!ok) return;
      form.dataset.confirmado = "1";
      form.requestSubmit(submitter instanceof HTMLButtonElement ? submitter : undefined);
      delete form.dataset.confirmado;
    });
    return;
  }
  if (form.hasAttribute("data-api")) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    // Con novalidate, los mensajes los da el servidor (en español y junto al campo).
    if (!form.noValidate && !form.reportValidity()) return;
    void enviarApi(form, submitter);
  }
});

// ── Fechas con botones (Hoy · Mañana · Otras fechas) ────────────
document.addEventListener("change", (ev) => {
  const t = ev.target as HTMLInputElement;
  const form = t.form;
  if (!form) return;
  if (t.name === "cuando") {
    const fechas = form.querySelector<HTMLElement>("[data-fechas]");
    const desde = form.querySelector<HTMLInputElement>('input[name="fecha_desde"]');
    const hasta = form.querySelector<HTMLInputElement>('input[name="fecha_hasta"]');
    if (t.dataset.desde && desde && hasta) {
      desde.value = hasta.value = hasta.min = t.dataset.desde;
      if (fechas) fechas.hidden = true;
    } else if (fechas) {
      fechas.hidden = false;
      desde?.focus();
    }
  } else if (t.name === "fecha_desde") {
    const hasta = form.querySelector<HTMLInputElement>('input[name="fecha_hasta"]');
    if (!hasta) return;
    hasta.min = t.value;
    if (!hasta.value || hasta.value < t.value) hasta.value = t.value;
  }
});

// ── Buscador de persona (combobox accesible) ────────────────────
const normalizar = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

type Opcion = { v: string; t: string; c: string };
function partesBuscador(input: HTMLInputElement) {
  const caja = input.closest<HTMLElement>("[data-buscador]");
  if (!caja) return null;
  return {
    caja,
    lista: caja.querySelector<HTMLUListElement>('[role="listbox"]')!,
    oculto: caja.querySelector<HTMLInputElement>('input[type="hidden"]')!,
    opciones: JSON.parse(caja.dataset.opciones ?? "[]") as Opcion[],
  };
}
function cerrarLista(input: HTMLInputElement, lista: HTMLUListElement) {
  lista.hidden = true;
  input.setAttribute("aria-expanded", "false");
  input.removeAttribute("aria-activedescendant");
}
function elegir(input: HTMLInputElement, li: HTMLElement) {
  const p = partesBuscador(input);
  if (!p) return;
  p.oculto.value = li.dataset.v ?? "";
  input.value = li.dataset.t ?? "";
  cerrarLista(input, p.lista);
  p.caja.querySelector(".v-error")?.remove();
}
document.addEventListener("input", (ev) => {
  const input = ev.target as HTMLInputElement;
  const p = input.matches?.("[data-buscador] input[type=search]") ? partesBuscador(input) : null;
  if (!p) return;
  p.oculto.value = "";
  const q = normalizar(input.value.trim());
  const terminos = q.split(/\s+/).filter(Boolean);
  const encontradas = terminos.length
    ? p.opciones
        .filter((o) => terminos.every((t) => normalizar(`${o.t} ${o.c}`).includes(t)))
        .slice(0, 8)
    : [];
  p.lista.innerHTML = "";
  encontradas.forEach((o, i) => {
    const li = document.createElement("li");
    li.id = `${p.lista.id}-${i}`;
    li.setAttribute("role", "option");
    li.dataset.v = o.v;
    li.dataset.t = o.t;
    li.innerHTML = `<strong></strong><span class="v-nota"></span>`;
    li.querySelector("strong")!.textContent = o.t;
    li.querySelector("span")!.textContent = o.c;
    p.lista.append(li);
  });
  if (encontradas.length === 0) {
    if (terminos.length) {
      const li = document.createElement("li");
      li.className = "v-sin-resultados";
      li.textContent = "Nadie coincide. Pruebe con el apellido o la cédula.";
      p.lista.append(li);
      p.lista.hidden = false;
      input.setAttribute("aria-expanded", "true");
    } else cerrarLista(input, p.lista);
    return;
  }
  p.lista.hidden = false;
  input.setAttribute("aria-expanded", "true");
});
document.addEventListener("keydown", (ev) => {
  const input = ev.target as HTMLInputElement;
  const p = input.matches?.("[data-buscador] input[type=search]") ? partesBuscador(input) : null;
  if (!p || p.lista.hidden) return;
  const items = [...p.lista.querySelectorAll<HTMLElement>('[role="option"]')];
  if (!items.length) return;
  const actual = items.findIndex((li) => li.getAttribute("aria-selected") === "true");
  if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
    ev.preventDefault();
    const sig =
      ev.key === "ArrowDown" ? Math.min(items.length - 1, actual + 1) : Math.max(0, actual - 1);
    items.forEach((li, i) => li.setAttribute("aria-selected", String(i === sig)));
    input.setAttribute("aria-activedescendant", items[sig]!.id);
    items[sig]!.scrollIntoView({ block: "nearest" });
  } else if (ev.key === "Enter") {
    ev.preventDefault();
    elegir(input, items[Math.max(0, actual)]!);
  } else if (ev.key === "Escape") {
    ev.preventDefault();
    ev.stopPropagation();
    cerrarLista(input, p.lista);
  }
});
document.addEventListener("click", (ev) => {
  const li = (ev.target as HTMLElement).closest<HTMLElement>('[data-buscador] [role="option"]');
  if (!li) return;
  const input = li
    .closest("[data-buscador]")
    ?.querySelector<HTMLInputElement>("input[type=search]");
  if (input) elegir(input, li);
});

// Al corregir un campo, su error desaparece
function quitarError(ev: Event) {
  const campo = (ev.target as HTMLElement).closest?.(".v-campo");
  if (!campo) return;
  campo.querySelectorAll(".v-error").forEach((e) => e.remove());
  campo.querySelectorAll("[aria-invalid]").forEach((e) => e.removeAttribute("aria-invalid"));
}
document.addEventListener("input", quitarError);
document.addEventListener("change", quitarError);
