/**
 * Importación de personal desde CSV (lógica pura y testeable).
 * Columnas (encabezado obligatorio, sin importar mayúsculas ni acentos):
 *   nombre; apellido; cedula; categoria; carga_horaria; vinculo; jornada; telefono
 * Separador ";" o ",". Excel: "Guardar como → CSV".
 */
import { normalizarCedula } from "@/lib/validacion";
import { VINCULOS, type Vinculo } from "@/types";

export const COLUMNAS_IMPORTACION = [
  "nombre",
  "apellido",
  "cedula",
  "categoria",
  "carga_horaria",
  "vinculo",
  "jornada",
  "telefono",
] as const;

/** Minúsculas, sin acentos ni espacios extremos (para comparar nombres). */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** "ANA V. BELISARIO" → "Ana V. Belisario" */
export function nombrePropio(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/(^|[\s'-])(\p{L})/gu, (_m, sep: string, l: string) => sep + l.toUpperCase());
}

/** Parser CSV mínimo con comillas dobles. Detecta ";" o "," por la primera línea. */
export function parsearCsv(texto: string): string[][] {
  const limpio = texto.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const primera = limpio.split("\n", 1)[0] ?? "";
  const sep = (primera.match(/;/g)?.length ?? 0) >= (primera.match(/,/g)?.length ?? 0) ? ";" : ",";
  const filas: string[][] = [];
  let fila: string[] = [];
  let campo = "";
  let comillas = false;
  for (let i = 0; i < limpio.length; i++) {
    const c = limpio[i]!;
    if (comillas) {
      if (c === '"' && limpio[i + 1] === '"') {
        campo += '"';
        i++;
      } else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === sep) {
      fila.push(campo);
      campo = "";
    } else if (c === "\n") {
      fila.push(campo);
      filas.push(fila);
      fila = [];
      campo = "";
    } else campo += c;
  }
  if (campo !== "" || fila.length) {
    fila.push(campo);
    filas.push(fila);
  }
  return filas.filter((f) => f.some((v) => v.trim() !== ""));
}

export interface FilaImportada {
  linea: number;
  nombre: string;
  apellido: string;
  cedula: string;
  categoria_id: string;
  carga_horaria: number | null;
  vinculo: Vinculo;
  jornada_id: string | null;
  telefono: string | null;
}

export interface ResultadoImportacion {
  validas: FilaImportada[];
  errores: { linea: number; mensaje: string }[];
  duplicadas: { linea: number; cedula: string }[];
}

export interface Catalogos {
  /** nombre normalizado → id */
  categorias: Map<string, string>;
  jornadas: Map<string, string>;
  /** jornada sugerida por id de categoría */
  jornadaSugerida?: Map<string, string | null>;
  cedulasExistentes: Set<string>;
}

export function validarImportacion(texto: string, cat: Catalogos): ResultadoImportacion {
  const res: ResultadoImportacion = { validas: [], errores: [], duplicadas: [] };
  const filas = parsearCsv(texto);
  if (filas.length < 2) {
    res.errores.push({ linea: 1, mensaje: "El archivo no tiene filas de datos." });
    return res;
  }
  const ALIAS: Record<string, string> = {
    ci: "cedula",
    nombres: "nombre",
    apellidos: "apellido",
    cargo: "categoria",
  };
  const cab = filas[0]!.map((c) => {
    const k = normalizar(c).replace(/\./g, "").replace(/ /g, "_");
    return ALIAS[k] ?? k;
  });
  const idx = (col: string) => cab.indexOf(col);
  const faltan = ["nombre", "cedula", "categoria"].filter((c) => idx(c) < 0);
  if (faltan.length) {
    res.errores.push({ linea: 1, mensaje: `Faltan columnas obligatorias: ${faltan.join(", ")}.` });
    return res;
  }
  const vistas = new Set<string>();
  filas.slice(1).forEach((f, i) => {
    const linea = i + 2;
    const v = (col: string) => (idx(col) >= 0 ? (f[idx(col)] ?? "").trim() : "");
    const errores: string[] = [];

    const nombre = nombrePropio(v("nombre"));
    const apellido = nombrePropio(v("apellido"));
    if (!nombre) errores.push("falta el nombre");
    const cedula = normalizarCedula(v("cedula"));
    if (!cedula) errores.push(`cédula no válida («${v("cedula")}»)`);

    const categoria_id = cat.categorias.get(normalizar(v("categoria")));
    if (!categoria_id) errores.push(`categoría desconocida («${v("categoria")}»)`);

    const cargaTexto = v("carga_horaria");
    const carga = cargaTexto === "" ? null : Number(cargaTexto);
    if (carga !== null && (!Number.isInteger(carga) || carga < 1 || carga > 80)) {
      errores.push("carga horaria debe ser un entero entre 1 y 80");
    }

    const vinculoTexto = normalizar(v("vinculo") || "fijo") as Vinculo;
    if (!VINCULOS.includes(vinculoTexto)) errores.push(`vínculo no válido («${v("vinculo")}»)`);

    let jornada_id: string | null = null;
    if (v("jornada")) {
      jornada_id = cat.jornadas.get(normalizar(v("jornada"))) ?? null;
      if (!jornada_id) errores.push(`jornada desconocida («${v("jornada")}»)`);
    } else if (categoria_id) {
      jornada_id = cat.jornadaSugerida?.get(categoria_id) ?? null;
    }

    if (errores.length) {
      res.errores.push({ linea, mensaje: errores.join("; ") });
      return;
    }
    if (cat.cedulasExistentes.has(cedula!) || vistas.has(cedula!)) {
      res.duplicadas.push({ linea, cedula: cedula! });
      return;
    }
    vistas.add(cedula!);
    res.validas.push({
      linea,
      nombre,
      apellido: apellido || "—",
      cedula: cedula!,
      categoria_id: categoria_id!,
      carga_horaria: carga,
      vinculo: vinculoTexto,
      jornada_id,
      telefono: v("telefono") || null,
    });
  });
  return res;
}
