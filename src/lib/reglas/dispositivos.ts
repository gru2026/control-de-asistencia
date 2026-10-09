/**
 * R11 · Dispositivos. Ver Documentacion/03-Diseno/Reglas-de-negocio.md
 */
import type { EstadoDispositivo } from "@/types";

export interface DispositivoResumen {
  dispositivoUid: string;
  estado: EstadoDispositivo;
  tipo: "celular" | "kiosco";
}

/** El primer celular de una cuenta se aprueba solo; los siguientes quedan pendientes. */
export function estadoParaNuevoCelular(existentes: DispositivoResumen[]): EstadoDispositivo {
  return existentes.some((d) => d.tipo === "celular") ? "pendiente" : "aprobado";
}

/** Identificador generado en el navegador (UUID v4). */
export function uidValido(uid: unknown): uid is string {
  return (
    typeof uid === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uid)
  );
}

/** R10 paso 2 · null si el dispositivo puede marcar; si no, el mensaje para la persona. */
export function motivoDispositivo(estado: EstadoDispositivo | null | undefined): string | null {
  switch (estado) {
    case "aprobado":
      return null;
    case "pendiente":
      return "Este teléfono está pendiente de aprobación por secretaría.";
    case "revocado":
      return "Este teléfono ya no está autorizado para marcar. Diríjase a secretaría.";
    default:
      return "Este teléfono no está registrado. Cierre sesión y vuelva a entrar.";
  }
}

/** "Android · Chrome", "iPhone · Safari", "Windows · Edge"… a partir del agente de usuario. */
export function describirDispositivo(ua: string | null | undefined): string {
  const t = ua ?? "";
  const so = /iPhone/.test(t)
    ? "iPhone"
    : /iPad/.test(t)
      ? "iPad"
      : /Android/.test(t)
        ? "Android"
        : /Windows/.test(t)
          ? "Windows"
          : /Mac OS X/.test(t)
            ? "Mac"
            : /Linux/.test(t)
              ? "Linux"
              : "Desconocido";
  const nav = /Edg\//.test(t)
    ? "Edge"
    : /SamsungBrowser/.test(t)
      ? "Samsung Internet"
      : /OPR\//.test(t)
        ? "Opera"
        : /Firefox\/|FxiOS/.test(t)
          ? "Firefox"
          : /Chrome\/|CriOS/.test(t)
            ? "Chrome"
            : /Safari\//.test(t)
              ? "Safari"
              : "";
  return nav ? `${so} · ${nav}` : so;
}
