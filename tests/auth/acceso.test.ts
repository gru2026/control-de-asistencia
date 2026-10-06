import { describe, expect, it } from "vitest";
import { decidirAcceso, destinoSeguro, inicioPorRol } from "@/lib/auth/acceso";

describe("decidirAcceso", () => {
  it("F3 sin sesión → login", () => {
    expect(decidirAcceso("/panel", null)).toEqual({ tipo: "login" });
    expect(decidirAcceso("/asistencia", null)).toEqual({ tipo: "login" });
    expect(decidirAcceso("/", null)).toEqual({ tipo: "login" });
  });

  it("/login es pública; con sesión redirige al inicio del rol", () => {
    expect(decidirAcceso("/login", null)).toEqual({ tipo: "permitir" });
    expect(decidirAcceso("/login", "personal")).toEqual({
      tipo: "redirigir",
      destino: "/asistencia",
    });
    expect(decidirAcceso("/login", "secretaria")).toEqual({ tipo: "redirigir", destino: "/panel" });
  });

  it("F4 personal no entra a rutas de administración", () => {
    for (const r of [
      "/personal",
      "/personal/abc",
      "/panel",
      "/jornadas",
      "/configuracion/usuarios",
    ]) {
      expect(decidirAcceso(r, "personal")).toEqual({ tipo: "prohibido" });
    }
    expect(decidirAcceso("/asistencia", "personal")).toEqual({ tipo: "permitir" });
  });

  it("secretaria: lee personal pero no crea ni configura", () => {
    expect(decidirAcceso("/personal", "secretaria").tipo).toBe("permitir");
    expect(decidirAcceso("/personal/123", "secretaria").tipo).toBe("permitir");
    expect(decidirAcceso("/personal/nuevo", "secretaria").tipo).toBe("prohibido");
    expect(decidirAcceso("/jornadas", "secretaria").tipo).toBe("prohibido");
    expect(decidirAcceso("/configuracion", "secretaria").tipo).toBe("prohibido");
  });

  it("directiva accede a todo", () => {
    for (const r of [
      "/panel",
      "/personal/nuevo",
      "/jornadas",
      "/configuracion/usuarios",
      "/asistencia",
    ]) {
      expect(decidirAcceso(r, "directiva").tipo).toBe("permitir");
    }
  });

  it("no confunde prefijos parecidos", () => {
    expect(decidirAcceso("/panelx", "personal").tipo).toBe("permitir"); // ruta desconocida → 404 normal
    expect(decidirAcceso("/login-falso", null).tipo).toBe("login");
  });
});

describe("destinoSeguro", () => {
  it("acepta rutas internas permitidas para el rol", () => {
    expect(destinoSeguro("/personal?q=ana", "directiva")).toBe("/personal?q=ana");
  });
  it("rechaza redirecciones abiertas y rutas sin permiso", () => {
    expect(destinoSeguro("//evil.com", "directiva")).toBe("/panel");
    expect(destinoSeguro("https://evil.com", "directiva")).toBe("/panel");
    expect(destinoSeguro("/\\evil.com", "directiva")).toBe("/panel");
    expect(destinoSeguro("/panel", "personal")).toBe(inicioPorRol("personal"));
    expect(destinoSeguro("/login", "directiva")).toBe("/panel");
    expect(destinoSeguro(null, "secretaria")).toBe("/panel");
  });
});
