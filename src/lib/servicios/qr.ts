/** R13 · Generación del QR impreso (solo servidor, con la clave secreta). */
import QRCode from "qrcode";
import { getSecret } from "astro:env/server";
import { clienteAdmin } from "@/lib/supabase/servidor";
import { cifrarCodigoQR, descifrarCodigoQR, generarCodigoQR, hashCodigoQR } from "@/lib/qr";

function secreto(): string {
  const clave = getSecret("SUPABASE_SECRET_KEY");
  if (!clave) throw new Error("Falta SUPABASE_SECRET_KEY");
  return clave;
}

export interface QRGenerado {
  codigo: string;
  svg: string;
  id: string;
}

/** Revoca el QR activo y crea uno nuevo; el código queda guardado cifrado para volver a mostrarlo. */
export async function generarNuevoQR(p: {
  creadoPor: string;
  descripcion: string | null;
  vigenteHasta: string | null;
}): Promise<QRGenerado> {
  const sb = clienteAdmin();
  const codigo = generarCodigoQR();

  const { error: e1 } = await sb
    .from("codigos_qr")
    .update({ activo: false, revocado_en: new Date().toISOString() })
    .eq("activo", true);
  if (e1) throw new Error(`No se pudo revocar el QR anterior: ${e1.message}`);

  const { data, error } = await sb
    .from("codigos_qr")
    .insert({
      token_hash: hashCodigoQR(codigo),
      codigo_cifrado: cifrarCodigoQR(codigo, secreto()),
      descripcion: p.descripcion,
      vigente_hasta: p.vigenteHasta,
      creado_por: p.creadoPor,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(`No se pudo crear el QR: ${error?.message}`);

  return { codigo, svg: await svgQR(codigo), id: data.id as string };
}

/** SVG del QR con corrección de errores alta (soporta manchas o dobleces del papel). */
export function svgQR(codigo: string): Promise<string> {
  return QRCode.toString(codigo, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    color: { dark: "#0f172a" },
  });
}

/** Desactiva el QR activo sin crear otro (por ejemplo, si se perdió la hoja). */
export async function desactivarQR(): Promise<void> {
  const { error } = await clienteAdmin()
    .from("codigos_qr")
    .update({ activo: false, revocado_en: new Date().toISOString() })
    .eq("activo", true);
  if (error) throw new Error(error.message);
}

/**
 * El QR activo para volver a verlo o imprimirlo (D-59). null si no hay QR activo o
 * se generó antes de guardarse cifrado (en ese caso hay que generar uno nuevo una vez).
 */
export async function verQRActivo(): Promise<{ id: string; svg: string } | null> {
  const { data, error } = await clienteAdmin()
    .from("codigos_qr")
    .select("id, codigo_cifrado")
    .eq("activo", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data?.codigo_cifrado) return null;
  const codigo = descifrarCodigoQR(data.codigo_cifrado as string, secreto());
  return codigo ? { id: data.id as string, svg: await svgQR(codigo) } : null;
}
