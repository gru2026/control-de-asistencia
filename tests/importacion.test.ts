import { describe, expect, it } from "vitest";
import { nombrePropio, normalizar, parsearCsv, validarImportacion } from "@/lib/importacion";

const cat = {
  categorias: new Map([
    ["docente", "c-doc"],
    ["secretaria", "c-sec"],
  ]),
  jornadas: new Map([["personal 40 h", "j-40"]]),
  jornadaSugerida: new Map<string, string | null>([["c-doc", "j-doc"]]),
  cedulasExistentes: new Set(["V-99999999"]),
};

describe("importación de personal", () => {
  it("parsea CSV con ; y comillas", () => {
    expect(parsearCsv('a;b\n"x;1";"di""ce"\n\n')).toEqual([
      ["a", "b"],
      ["x;1", 'di"ce'],
    ]);
    expect(parsearCsv("a,b\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
  it("normaliza nombres y textos", () => {
    expect(nombrePropio("ANA V. BELISARIO")).toBe("Ana V. Belisario");
    expect(nombrePropio("josé  peña")).toBe("José Peña");
    expect(normalizar(" Secretaría ")).toBe("secretaria");
  });
  it("valida filas, aplica la jornada sugerida y detecta duplicados", () => {
    const csv = [
      "Nombre;Apellido;C.I.;Categoría;Carga_horaria;Vínculo;Jornada",
      "ROSA;PEÑA;V7000001;Docente;54;;",
      "Ana;Belisario;6341198;secretaría;40;contratado;Personal 40 h",
      "X;Y;V99999999;Docente;40;;",
      "Z;W;V7000001;Docente;40;;",
      "Malo;Dato;abc;Cocinero;99;jefe;Noche",
    ].join("\n");
    const r = validarImportacion(csv, cat);
    expect(r.validas).toHaveLength(2);
    expect(r.validas[0]).toMatchObject({
      nombre: "Rosa",
      apellido: "Peña",
      cedula: "V-7000001",
      jornada_id: "j-doc",
      carga_horaria: 54,
      vinculo: "fijo",
    });
    expect(r.validas[1]).toMatchObject({
      categoria_id: "c-sec",
      jornada_id: "j-40",
      vinculo: "contratado",
    });
    expect(r.duplicadas.map((d) => d.linea)).toEqual([4, 5]);
    expect(r.errores).toHaveLength(1);
    expect(r.errores[0]!.mensaje).toMatch(/cédula.*categoría.*carga.*vínculo.*jornada/);
  });
  it("informa columnas faltantes", () => {
    expect(validarImportacion("nombre;apellido\nA;B", cat).errores[0]!.mensaje).toMatch(/cedula/);
  });
});
