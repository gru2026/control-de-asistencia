/** R13 · Generación del QR impreso (solo servidor, con la clave secreta). */
import QRCode from "qrcode";
import { clienteAdmin } from "@/lib/supabase/servidor";
import { generarCodigoQR, hashCodigoQR } from "@/lib/qr";

export interface QRGenerado {
  codigo: string;
  svg: string;
  id: string;
}

/** Revoca el QR activo y crea uno nuevo. Devuelve el código en claro una sola vez. */
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
