/**
 * Marcación desde el celular: ubicación + cámara (escáner QR) + envío al servidor.
 * El escáner usa BarcodeDetector cuando existe (Chrome en Android) y, si no,
 * jsQR (iPhone y otros), que se descarga solo cuando hace falta.
 */
import { obtenerUidDispositivo } from "./dispositivo";

type Posicion = { lat: number; lng: number; precision: number } | null;
type Respuesta =
  | {
      ok: true;
      tipo: "entrada" | "salida";
      estado: string;
      hora: string;
      mensaje: string;
      detalle: string | null;
      senalado: boolean;
    }
  | { ok: false; codigo: string; mensaje: string };

const PREFIJO_QR = "GRU1-";

const ICONOS = {
  exito: '<path d="M20 6 9 17l-5-5"/>',
  tarde: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  error: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};
const svg = (ruta: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ruta}</svg>`;

/** Reloj con la hora del servidor (no depende de que el teléfono esté en hora). */
function iniciarReloj() {
  const reloj = document.querySelector<HTMLElement>("[data-reloj]");
  if (!reloj) return;
  const desfase = Number(reloj.dataset.servidor) - Date.now();
  const formato = new Intl.DateTimeFormat("es-VE", {
    timeZone: "America/Caracas",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const pintar = () => (reloj.textContent = formato.format(new Date(Date.now() + desfase)));
  pintar();
  setInterval(pintar, 1000);
}

function iniciarAvisoConexion() {
  const aviso = document.querySelector<HTMLElement>("[data-sin-conexion]");
  const boton = document.querySelector<HTMLButtonElement>("[data-marcar]");
  const actualizar = () => {
    if (aviso) aviso.hidden = navigator.onLine;
    if (boton) boton.disabled = !navigator.onLine;
  };
  addEventListener("online", actualizar);
  addEventListener("offline", actualizar);
  actualizar();
}

function pedirUbicacion(): Promise<Posicion | { error: string }> {
  return new Promise((resolver) => {
    if (!("geolocation" in navigator))
      return resolver({ error: "Este teléfono no permite obtener la ubicación." });
    navigator.geolocation.getCurrentPosition(
      (p) =>
        resolver({ lat: p.coords.latitude, lng: p.coords.longitude, precision: p.coords.accuracy }),
      (e) =>
        resolver({
          error:
            e.code === e.PERMISSION_DENIED
              ? "Active la ubicación para marcar: permita el acceso a la ubicación para esta app en los ajustes del teléfono y vuelva a intentarlo."
              : "No se pudo obtener su ubicación. Active el GPS e inténtelo de nuevo, si es posible cerca de una ventana o puerta.",
        }),
      { enableHighAccuracy: true, timeout: 20_000, maximumAge: 10_000 },
    );
  });
}

type Lector = (video: HTMLVideoElement) => Promise<string | null>;

async function crearLector(): Promise<Lector> {
  type Detector = { detect: (s: CanvasImageSource) => Promise<{ rawValue: string }[]> };
  type ClaseDetector = {
    new (o: { formats: string[] }): Detector;
    getSupportedFormats?: () => Promise<string[]>;
  };
  const BD = (window as unknown as { BarcodeDetector?: ClaseDetector }).BarcodeDetector;
  const formatos = BD ? await BD.getSupportedFormats?.().catch(() => []) : [];
  if (BD && formatos?.includes("qr_code")) {
    const detector = new BD({ formats: ["qr_code"] });
    return async (video) => (await detector.detect(video))[0]?.rawValue ?? null;
  }
  const { default: jsQR } = await import("jsqr");
  const lienzo = document.createElement("canvas");
  const ctx = lienzo.getContext("2d", { willReadFrequently: true })!;
  return async (video) => {
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return null;
    // Reducir para que el análisis sea rápido en teléfonos modestos
    const escala = Math.min(1, 640 / Math.max(w, h));
    lienzo.width = Math.round(w * escala);
    lienzo.height = Math.round(h * escala);
    ctx.drawImage(video, 0, 0, lienzo.width, lienzo.height);
    const img = ctx.getImageData(0, 0, lienzo.width, lienzo.height);
    return jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" })?.data ?? null;
  };
}

export function iniciarMarcacion() {
  iniciarReloj();
  iniciarAvisoConexion();
  // Escribe la cookie del teléfono para que el servidor muestre su estado.
  obtenerUidDispositivo();

  const boton = document.querySelector<HTMLButtonElement>("[data-marcar]");
  const dialogo = document.querySelector<HTMLDialogElement>("[data-escaner]");
  if (!boton || !dialogo) return;

  const $ = <T extends HTMLElement>(sel: string) => dialogo.querySelector<T>(sel)!;
  const video = $<HTMLVideoElement>("[data-video]");
  const estado = $("[data-estado]");
  const vistaCamara = $('[data-vista="camara"]');
  const vistaResultado = $('[data-vista="resultado"]');
  const tipo = boton.dataset.marcar as "entrada" | "salida";
  const exigeUbicacion = boton.dataset.geocerca === "1";

  let flujo: MediaStream | null = null;
  let activo = false;
  let exito = false;

  const detenerCamara = () => {
    activo = false;
    flujo?.getTracks().forEach((t) => t.stop());
    flujo = null;
    video.srcObject = null;
  };

  const mostrarResultado = (r: {
    titulo: string;
    hora?: string;
    detalle?: string | null;
    tipo: "exito" | "tarde" | "error";
  }) => {
    detenerCamara();
    vistaCamara.hidden = true;
    vistaResultado.hidden = false;
    const sello = $("[data-sello]");
    sello.innerHTML = svg(ICONOS[r.tipo]);
    sello.style.setProperty(
      "--c",
      r.tipo === "exito" ? "#15803d" : r.tipo === "tarde" ? "#b45309" : "#b91c1c",
    );
    $("[data-res-titulo]").textContent = r.titulo;
    $("[data-res-hora]").textContent = r.hora ?? "";
    $("[data-res-detalle]").textContent = r.detalle ?? "";
    $("[data-reintentar]").hidden = r.tipo !== "error";
    $<HTMLButtonElement>("[data-aceptar]").textContent = r.tipo === "error" ? "Cerrar" : "Listo";
    $<HTMLButtonElement>(r.tipo === "error" ? "[data-reintentar]" : "[data-aceptar]").focus();
    if (r.tipo !== "error" && "vibrate" in navigator) navigator.vibrate(120);
  };

  const enviar = async (codigo: string, posicion: Posicion) => {
    estado.textContent = "Registrando…";
    try {
      const res = await fetch("/api/marcacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          codigo,
          lat: posicion?.lat ?? null,
          lng: posicion?.lng ?? null,
          precision: posicion?.precision ?? null,
          dispositivo_uid: obtenerUidDispositivo(),
        }),
      });
      const r = (await res.json()) as Respuesta;
      if (r.ok) {
        exito = true;
        mostrarResultado({
          tipo: r.estado === "tarde" && r.tipo === "entrada" ? "tarde" : "exito",
          titulo: r.mensaje,
          hora: r.hora,
          detalle: [r.detalle, r.senalado ? "Quedó señalada para revisión por la ubicación." : null]
            .filter(Boolean)
            .join(" "),
        });
      } else {
        mostrarResultado({ tipo: "error", titulo: "No se registró", detalle: r.mensaje });
      }
    } catch {
      mostrarResultado({
        tipo: "error",
        titulo: "Sin conexión",
        detalle: "No se pudo contactar al servidor. Verifique su internet o diríjase a secretaría.",
      });
    }
  };

  const iniciar = async () => {
    exito = false;
    vistaCamara.hidden = false;
    vistaResultado.hidden = true;
    estado.textContent = "Abriendo la cámara…";
    if (!dialogo.open) dialogo.showModal();

    // La ubicación se obtiene mientras la persona apunta al código.
    const ubicacion = pedirUbicacion();

    if (!navigator.mediaDevices?.getUserMedia) {
      return mostrarResultado({
        tipo: "error",
        titulo: "Cámara no disponible",
        detalle:
          "Este navegador no permite usar la cámara. Abra la app instalada o use Chrome o Safari.",
      });
    }
    try {
      flujo = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });
    } catch (e) {
      const negado = (e as DOMException)?.name === "NotAllowedError";
      return mostrarResultado({
        tipo: "error",
        titulo: "No se pudo abrir la cámara",
        detalle: negado
          ? "Permita el acceso a la cámara para esta app en los ajustes del teléfono y vuelva a intentarlo."
          : "Cierre otras apps que estén usando la cámara e inténtelo de nuevo.",
      });
    }
    video.srcObject = flujo;
    await video.play().catch(() => {});
    estado.textContent = "Apunte al código QR dentro del recuadro.";

    const leer = await crearLector();
    activo = true;
    let avisoOtro = 0;
    while (activo) {
      const valor = await leer(video).catch(() => null);
      if (valor && valor.startsWith(PREFIJO_QR)) {
        activo = false;
        if ("vibrate" in navigator) navigator.vibrate(40);
        estado.textContent = "Código leído. Verificando su ubicación…";
        const pos = await ubicacion;
        if (pos && "error" in pos) {
          if (exigeUbicacion)
            return mostrarResultado({
              tipo: "error",
              titulo: "Ubicación necesaria",
              detalle: pos.error,
            });
          return enviar(valor, null);
        }
        return enviar(valor, pos);
      }
      if (valor && Date.now() - avisoOtro > 2500) {
        avisoOtro = Date.now();
        estado.textContent =
          "Ese no es el código de asistencia. Busque el QR pegado en la entrada.";
      }
      await new Promise((r) => setTimeout(r, 120));
    }
  };

  const cerrar = () => {
    detenerCamara();
    if (dialogo.open) dialogo.close();
    if (exito) location.reload();
  };

  boton.addEventListener("click", () => {
    if (!navigator.onLine) return;
    void iniciar();
  });
  $("[data-cerrar]").addEventListener("click", cerrar);
  $("[data-aceptar]").addEventListener("click", cerrar);
  $("[data-reintentar]").addEventListener("click", () => void iniciar());
  dialogo.addEventListener("close", () => {
    detenerCamara();
    if (exito) location.reload();
  });
  // Si la app pasa a segundo plano, se libera la cámara.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && activo) cerrar();
  });
}
