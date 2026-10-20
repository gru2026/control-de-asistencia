import { describe, expect, it } from "vitest";
import {
  claveInterna,
  emailDeCedula,
  esCuentaCedula,
  leerIdentificador,
  usuarioVisible,
  validarClavePropia,
} from "@/lib/auth/cedula";

describe("Cuentas por cédula (D-42)", () => {
  it("correo técnico y usuario visible", () => {
    const email = emailDeCedula("V-12345678");
    expect(email).toBe("v12345678@cedula.gru-system.local");
    expect(esCuentaCedula(email)).toBe(true);
    expect(esCuentaCedula("ana@colegio.com")).toBe(false);
    expect(usuarioVisible(email)).toBe("V-12345678");
    expect(usuarioVisible("ana@colegio.com")).toBe("ana@colegio.com");
  });

  it("la contraseña interna cumple el mínimo de Supabase solo en cuentas por cédula", () => {
    expect(claveInterna("0000", emailDeCedula("V-1234567"))).toBe("0000@GRU");
    expect(claveInterna("Clave123", "ana@colegio.com")).toBe("Clave123");
  });

  it("acepta cédula con o sin letra y puntos, o un correo", () => {
    expect(leerIdentificador("12.345.678")).toEqual({ tipo: "cedula", cedula: "V-12345678" });
    expect(leerIdentificador("e 1234567")).toEqual({ tipo: "cedula", cedula: "E-1234567" });
    expect(leerIdentificador(" Ana@Colegio.com ")).toEqual({
      tipo: "email",
      email: "ana@colegio.com",
    });
    expect(leerIdentificador("abc")).toBeNull();
  });

  it("contraseña propia: mínimo 6, no trivial, distinta de la cédula", () => {
    expect(validarClavePropia("0000", null)).toMatch(/6 caracteres/);
    expect(validarClavePropia("111111", null)).toMatch(/fácil/);
    expect(validarClavePropia("12345678", "V-12345678")).toMatch(/cédula/);
    expect(validarClavePropia("gato2026", "V-12345678")).toBeNull();
  });
});
