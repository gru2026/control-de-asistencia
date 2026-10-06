import { describe, expect, it } from "vitest";
import {
  normalizarCedula,
  terminosBusqueda,
  validarClave,
  validarCuenta,
  validarExcepciones,
  validarFeriado,
  validarJornada,
  validarPersonal,
} from "@/lib/validacion";

describe("normalizarCedula", () => {
  it.each([
    ["12.345.678", "V-12345678"],
    ["V-12345678", "V-12345678"],
    ["v12345678", "V-12345678"],
    ["e 1234567", "E-1234567"],
  ])("%s → %s", (entrada, esperado) => expect(normalizarCedula(entrada)).toBe(esperado));

  it.each(["", "abc", "X-123456", "123", "V-1234567890"])("rechaza %s", (v) =>
    expect(normalizarCedula(v)).toBeNull(),
  );
});

describe("validarPersonal", () => {
  const base = {
    nombre: " Ana  María ",
    apellido: "Pérez",
    cedula: "12.345.678",
    cargo: "docente",
  };

  it("acepta datos válidos y normaliza", () => {
    const r = validarPersonal(base);
    expect(r).toEqual({
      ok: true,
      datos: {
        nombre: "Ana María",
        apellido: "Pérez",
        cedula: "V-12345678",
        cargo: "docente",
        telefono: null,
        jornada_id: null,
        fecha_ingreso: null,
      },
    });
  });

  it("informa todos los errores", () => {
    const r = validarPersonal({ cedula: "x", cargo: "rector", telefono: "abc", jornada_id: "1" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errores).sort()).toEqual(
        ["apellido", "cargo", "cedula", "jornada_id", "nombre", "telefono"].sort(),
      );
    }
  });

  it("funciona con FormData", () => {
    const f = new FormData();
    Object.entries(base).forEach(([k, v]) => f.set(k, v));
    expect(validarPersonal(f).ok).toBe(true);
  });
});

describe("validarCuenta / validarClave", () => {
  it("acepta una cuenta válida y normaliza el correo", () => {
    const r = validarCuenta({
      email: "Ana@Colegio.edu.ve",
      password: "clave1234",
      rol: "personal",
    });
    expect(r).toEqual({
      ok: true,
      datos: { email: "ana@colegio.edu.ve", password: "clave1234", rol: "personal" },
    });
  });
  it("rechaza contraseñas débiles y roles inválidos", () => {
    expect(validarClave("corta1")).not.toBeNull();
    expect(validarClave("soloLetras")).not.toBeNull();
    expect(validarCuenta({ email: "x", password: "clave1234", rol: "admin" }).ok).toBe(false);
  });
});

describe("validarJornada", () => {
  const f = (extra: Record<string, string | string[]> = {}) => ({
    nombre: "General",
    hora_entrada: "07:00",
    hora_salida: "16:00",
    tolerancia_min: "15",
    pausa_min: "0",
    dias_laborables: ["1", "2", "3", "4", "5"],
    ...extra,
  });

  it("acepta una jornada válida", () => {
    const r = validarJornada(f());
    expect(r.ok && r.datos.dias_laborables).toEqual([1, 2, 3, 4, 5]);
  });
  it("salida anterior a la entrada", () => {
    const r = validarJornada(f({ hora_salida: "06:00" }));
    expect(!r.ok && r.errores.hora_salida).toBeTruthy();
  });
  it("pausa mayor que la jornada", () => {
    const r = validarJornada(f({ hora_salida: "08:00", pausa_min: "90" }));
    expect(!r.ok && r.errores.pausa_min).toBeTruthy();
  });
  it("sin días y tolerancia inválida", () => {
    const r = validarJornada(f({ dias_laborables: [], tolerancia_min: "-5" }));
    expect(!r.ok && Object.keys(r.errores).sort()).toEqual(["dias_laborables", "tolerancia_min"]);
  });
});

describe("validarExcepciones", () => {
  it("ignora días normales y lee especiales y libres", () => {
    const r = validarExcepciones({
      tipo_1: "especial",
      entrada_1: "13:00",
      salida_1: "18:00",
      tolerancia_1: "",
      tipo_3: "libre",
    });
    expect(r).toEqual({
      ok: true,
      datos: [
        {
          dia_semana: 1,
          libre: false,
          hora_entrada: "13:00",
          hora_salida: "18:00",
          tolerancia_min: null,
        },
        { dia_semana: 3, libre: true, hora_entrada: null, hora_salida: null, tolerancia_min: null },
      ],
    });
  });
  it("valida horas del día especial", () => {
    const r = validarExcepciones({ tipo_2: "especial", entrada_2: "10:00", salida_2: "09:00" });
    expect(!r.ok && r.errores.salida_2).toBeTruthy();
  });
});

describe("validarFeriado y búsqueda", () => {
  it("feriado válido e inválido", () => {
    expect(validarFeriado({ fecha: "2026-12-25", descripcion: "Navidad" }).ok).toBe(true);
    expect(validarFeriado({ fecha: "25/12", descripcion: "" }).ok).toBe(false);
  });
  it("limpia caracteres especiales de PostgREST", () => {
    expect(terminosBusqueda("  Pérez,(a)*  V-123 ")).toEqual(["Pérez", "a", "V-123"]);
  });
});
