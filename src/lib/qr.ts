/**
 * R13 · Código QR impreso. El código es aleatorio (144 bits) y en la base de
 * datos solo se guarda su hash SHA-256.
 */
import { createHash, randomBytes } from "node:crypto";

const PREFIJO = "GRU1-";
const FORMATO = /^GRU1-[A-Za-z0-9_-]{24}$/;

export function generarCodigoQR(): string {
  return PREFIJO + randomBytes(18).toString("base64url");
}

export function formatoQRValido(codigo: unknown): codigo is string {
  return typeof codigo === "string" && FORMATO.test(codigo.trim());
}

export function hashCodigoQR(codigo: string): string {
  return createHash("sha256").update(codigo.trim()).digest("hex");
}

/** Activo y no vencido (vigente_hasta inclusive, en fecha local del colegio). */
export function qrVigente(
  qr: { activo: boolean; vigente_hasta: string | null } | null | undefined,
  hoy: string,
): boolean {
  return !!qr && qr.activo && (!qr.vigente_hasta || hoy <= qr.vigente_hasta);
}
