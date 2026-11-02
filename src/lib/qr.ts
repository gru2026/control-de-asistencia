/**
 * R13 · Código QR impreso. El código es aleatorio (144 bits). En la base de datos
 * se valida por su hash SHA-256 y, para volver a mostrarlo a la directiva (D-59),
 * se guarda además cifrado con AES-256-GCM.
 */
import { createCipheriv, createDecipheriv, createHash, hkdfSync, randomBytes } from "node:crypto";

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

function claveQR(secreto: string): Buffer {
  return Buffer.from(hkdfSync("sha256", secreto, "gru-system", "codigo-qr", 32));
}

/** Cifra el código para guardarlo: «iv.etiqueta.cifrado» en base64url. */
export function cifrarCodigoQR(codigo: string, secreto: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", claveQR(secreto), iv);
  const cifrado = Buffer.concat([c.update(codigo, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), cifrado].map((b) => b.toString("base64url")).join(".");
}

/** Devuelve el código en claro, o null si no se puede descifrar (otra clave o dato alterado). */
export function descifrarCodigoQR(guardado: string, secreto: string): string | null {
  try {
    const [iv, etiqueta, cifrado] = guardado.split(".").map((p) => Buffer.from(p, "base64url"));
    if (!iv || !etiqueta || !cifrado) return null;
    const d = createDecipheriv("aes-256-gcm", claveQR(secreto), iv);
    d.setAuthTag(etiqueta);
    const codigo = Buffer.concat([d.update(cifrado), d.final()]).toString("utf8");
    return formatoQRValido(codigo) ? codigo : null;
  } catch {
    return null;
  }
}
