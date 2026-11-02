import { describe, expect, it } from "vitest";
import { cifrarCodigoQR, descifrarCodigoQR, generarCodigoQR } from "@/lib/qr";

describe("QR cifrado para volver a mostrarlo (D-59)", () => {
  const secreto = "clave-de-prueba";

  it("descifra el mismo código con la misma clave", () => {
    const codigo = generarCodigoQR();
    const guardado = cifrarCodigoQR(codigo, secreto);
    expect(guardado).not.toContain(codigo);
    expect(descifrarCodigoQR(guardado, secreto)).toBe(codigo);
  });

  it("cada cifrado es distinto aunque el código sea el mismo", () => {
    const codigo = generarCodigoQR();
    expect(cifrarCodigoQR(codigo, secreto)).not.toBe(cifrarCodigoQR(codigo, secreto));
  });

  it("con otra clave o un dato alterado devuelve null", () => {
    const guardado = cifrarCodigoQR(generarCodigoQR(), secreto);
    expect(descifrarCodigoQR(guardado, "otra-clave")).toBeNull();
    const [iv, etiqueta, cifrado] = guardado.split(".");
    const alterado = [
      iv,
      etiqueta,
      cifrado.slice(0, -2) + (cifrado.endsWith("AA") ? "BB" : "AA"),
    ].join(".");
    expect(descifrarCodigoQR(alterado, secreto)).toBeNull();
    expect(descifrarCodigoQR("basura", secreto)).toBeNull();
  });
});
