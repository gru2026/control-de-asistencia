/**
 * Cuentas por cédula (D-42). El personal inicia sesión con su cédula y una
 * contraseña; internamente la cuenta de Supabase usa un correo técnico que la
 * persona nunca ve. La contraseña inicial es 0000 y se cambia en el primer ingreso.
 */
import { normalizarCedula } from "@/lib/validacion";

export const DOMINIO_CEDULA = "cedula.gru-system.local";
export const CLAVE_INICIAL = "0000";
/** Supabase exige al menos 6 caracteres: a las cuentas por cédula se les agrega este sufijo fijo. */
const SUFIJO = "@GRU";

/** "V-12345678" → "v12345678@cedula.gru-system.local" */
export function emailDeCedula(cedula: string): string {
  return `${cedula.replace("-", "").toLowerCase()}@${DOMINIO_CEDULA}`;
}

export function esCuentaCedula(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase().endsWith(`@${DOMINIO_CEDULA}`);
}

/** "v12345678@cedula…" → "V-12345678"; otros correos se muestran tal cual. */
export function usuarioVisible(email: string): string {
  if (!esCuentaCedula(email)) return email;
  const local = email.split("@")[0]!.toUpperCase();
  return `${local[0]}-${local.slice(1)}`;
}

/** Contraseña que se guarda en Supabase para lo que escribe la persona. */
export function claveInterna(clave: string, email: string): string {
  return esCuentaCedula(email) ? clave + SUFIJO : clave;
}

export type Identificador = { tipo: "email"; email: string } | { tipo: "cedula"; cedula: string };

/** Lo que se escribe en «Cédula o correo». */
export function leerIdentificador(texto: string): Identificador | null {
  const t = texto.trim();
  if (!t) return null;
  if (t.includes("@")) return { tipo: "email", email: t.toLowerCase() };
  const cedula = normalizarCedula(t);
  return cedula ? { tipo: "cedula", cedula } : null;
}

/** Reglas de la contraseña propia de una cuenta por cédula (fácil de escribir en el teléfono). */
export function validarClavePropia(clave: string, cedula: string | null): string | null {
  if (clave.length < 6) return "Use al menos 6 caracteres.";
  if (clave.length > 64) return "Máximo 64 caracteres.";
  if (/^(\d)\1+$/.test(clave) || clave === "123456" || clave === "654321")
    return "Es demasiado fácil de adivinar. Elija otra.";
  if (cedula && clave.replace(/\D/g, "") === cedula.replace(/\D/g, ""))
    return "No use su número de cédula como contraseña.";
  return null;
}
