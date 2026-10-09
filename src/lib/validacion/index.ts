/**
 * Validación de formularios (pura y testeable). Mensajes en español para el usuario final.
 */
import { ROLES, VINCULOS, type DiaSemana, type Rol, type Vinculo } from "@/types";
import { duracionJornadaMin } from "@/lib/reglas/jornada";
import { horaAMinutos } from "@/lib/reglas/tiempo";

export type Errores = Record<string, string>;
export type Resultado<T> = { ok: true; datos: T } | { ok: false; errores: Errores };

/** Lectura cómoda de FormData u objetos simples. */
export type Entrada = FormData | Record<string, string | string[] | undefined>;

export function texto(e: Entrada, campo: string): string {
  const v = e instanceof FormData ? e.get(campo) : e[campo];
  return typeof v === "string" ? v.trim() : Array.isArray(v) ? (v[0] ?? "").trim() : "";
}

export function lista(e: Entrada, campo: string): string[] {
  if (e instanceof FormData)
    return e.getAll(campo).filter((v): v is string => typeof v === "string");
  const v = e[campo];
  return Array.isArray(v) ? v : typeof v === "string" ? [v] : [];
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const esUuid = (v: string) => UUID.test(v);

/** Normaliza la cédula venezolana: "12.345.678" → "V-12345678", "e 1234567" → "E-1234567". */
export function normalizarCedula(valor: string): string | null {
  const limpio = valor.toUpperCase().replace(/[\s.]/g, "");
  const m = /^([VE])?-?(\d{5,9})$/.exec(limpio);
  if (!m) return null;
  return `${m[1] ?? "V"}-${m[2]}`;
}

function nombrePropio(e: Entrada, campo: string, etiqueta: string, errores: Errores): string {
  const v = texto(e, campo).replace(/\s+/g, " ");
  if (!v) errores[campo] = `${etiqueta} es obligatorio.`;
  else if (v.length > 80) errores[campo] = `${etiqueta} no puede superar 80 caracteres.`;
  return v;
}

// ── Personal ───────────────────────────────────────────────────

export interface DatosPersonal {
  nombre: string;
  apellido: string;
  cedula: string;
  categoria_id: string;
  vinculo: Vinculo;
  carga_horaria: number | null;
  telefono: string | null;
  jornada_id: string | null;
  fecha_ingreso: string | null;
}

export function validarPersonal(e: Entrada): Resultado<DatosPersonal> {
  const errores: Errores = {};
  const nombre = nombrePropio(e, "nombre", "El nombre", errores);
  const apellido = nombrePropio(e, "apellido", "El apellido", errores);

  const cedulaTexto = texto(e, "cedula");
  const cedula = normalizarCedula(cedulaTexto);
  if (!cedulaTexto) errores.cedula = "La cédula es obligatoria.";
  else if (!cedula) errores.cedula = "Cédula no válida. Ejemplo: V-12345678.";

  const categoria = texto(e, "categoria_id");
  if (!esUuid(categoria)) errores.categoria_id = "Seleccione una categoría.";

  const vinculo = (texto(e, "vinculo") || "fijo") as Vinculo;
  if (!VINCULOS.includes(vinculo)) errores.vinculo = "Seleccione un vínculo.";

  const cargaTexto = texto(e, "carga_horaria");
  const carga = cargaTexto === "" ? null : Number(cargaTexto);
  if (carga !== null && (!Number.isInteger(carga) || carga < 1 || carga > 80)) {
    errores.carga_horaria = "Entre 1 y 80 horas semanales.";
  }

  const telefono = texto(e, "telefono");
  if (telefono && !/^\+?[\d\s()-]{7,20}$/.test(telefono)) {
    errores.telefono = "Teléfono no válido. Ejemplo: 0414-1234567.";
  }

  const jornada = texto(e, "jornada_id");
  if (jornada && !esUuid(jornada)) errores.jornada_id = "Jornada no válida.";

  const fecha = texto(e, "fecha_ingreso");
  if (fecha && (!FECHA.test(fecha) || Number.isNaN(Date.parse(fecha)))) {
    errores.fecha_ingreso = "Fecha no válida.";
  }

  if (Object.keys(errores).length) return { ok: false, errores };
  return {
    ok: true,
    datos: {
      nombre,
      apellido,
      cedula: cedula!,
      categoria_id: categoria,
      vinculo,
      carga_horaria: carga,
      telefono: telefono || null,
      jornada_id: jornada || null,
      fecha_ingreso: fecha || null,
    },
  };
}

// ── Cuenta de acceso ───────────────────────────────────────────

export interface DatosCuenta {
  email: string;
  password: string;
  rol: Rol;
}

export function validarClave(clave: string): string | null {
  if (clave.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (clave.length > 72) return "La contraseña no puede superar 72 caracteres.";
  if (!/[A-Za-z]/.test(clave) || !/\d/.test(clave)) return "Use letras y números.";
  return null;
}

export function validarCuenta(e: Entrada): Resultado<DatosCuenta> {
  const errores: Errores = {};
  const email = texto(e, "email").toLowerCase();
  if (!EMAIL.test(email)) errores.email = "Correo no válido.";
  const password = texto(e, "password");
  const errClave = validarClave(password);
  if (errClave) errores.password = errClave;
  const rol = (texto(e, "rol") || "personal") as Rol;
  if (!ROLES.includes(rol)) errores.rol = "Rol no válido.";
  if (Object.keys(errores).length) return { ok: false, errores };
  return { ok: true, datos: { email, password, rol } };
}

// ── Jornadas ───────────────────────────────────────────────────

export interface DatosJornada {
  nombre: string;
  hora_entrada: string;
  hora_salida: string;
  tolerancia_min: number;
  pausa_min: number;
  dias_laborables: DiaSemana[];
  activa: boolean;
  nocturna: boolean;
}

function entero(
  e: Entrada,
  campo: string,
  min: number,
  max: number,
  errores: Errores,
  msg: string,
) {
  const t = texto(e, campo);
  const n = Number(t === "" ? "0" : t);
  if (!Number.isInteger(n) || n < min || n > max) errores[campo] = msg;
  return n;
}

export function validarJornada(e: Entrada): Resultado<DatosJornada> {
  const errores: Errores = {};
  const nombre = texto(e, "nombre").replace(/\s+/g, " ");
  if (!nombre) errores.nombre = "El nombre es obligatorio.";
  else if (nombre.length > 60) errores.nombre = "Máximo 60 caracteres.";

  const entrada = texto(e, "hora_entrada");
  const salida = texto(e, "hora_salida");
  if (!HORA.test(entrada)) errores.hora_entrada = "Hora no válida.";
  if (!HORA.test(salida)) errores.hora_salida = "Hora no válida.";

  const tolerancia = entero(e, "tolerancia_min", 0, 180, errores, "Entre 0 y 180 minutos.");
  const pausa = entero(e, "pausa_min", 0, 240, errores, "Entre 0 y 240 minutos.");

  const nocturna = texto(e, "nocturna") === "si";
  if (!errores.hora_entrada && !errores.hora_salida) {
    const cruza = horaAMinutos(salida) < horaAMinutos(entrada);
    const duracion = duracionJornadaMin(entrada, salida);
    if (entrada === salida) errores.hora_salida = "La salida debe ser distinta de la entrada.";
    else if (cruza && !nocturna) {
      errores.hora_salida =
        "La salida es anterior a la entrada. Marque «Jornada nocturna» si termina al día siguiente.";
    } else if (!cruza && nocturna) {
      errores.hora_salida =
        "Una jornada nocturna debe terminar al día siguiente (salida menor que la entrada).";
    } else if (!errores.pausa_min && pausa >= duracion) {
      errores.pausa_min = "La pausa no puede ser mayor que la jornada.";
    }
  }

  const dias = [...new Set(lista(e, "dias_laborables").map(Number))]
    .filter((d) => Number.isInteger(d) && d >= 1 && d <= 7)
    .sort() as DiaSemana[];
  if (!dias.length) errores.dias_laborables = "Seleccione al menos un día.";

  if (Object.keys(errores).length) return { ok: false, errores };
  return {
    ok: true,
    datos: {
      nombre,
      hora_entrada: entrada,
      hora_salida: salida,
      tolerancia_min: tolerancia,
      pausa_min: pausa,
      dias_laborables: dias,
      activa: texto(e, "activa") !== "no",
      nocturna,
    },
  };
}

// ── Excepciones de horario por día ─────────────────────────────

export type TipoDia = "normal" | "especial" | "libre";

export interface DatosExcepcion {
  dia_semana: DiaSemana;
  libre: boolean;
  hora_entrada: string | null;
  hora_salida: string | null;
  tolerancia_min: number | null;
}

/**
 * Lee los 7 días del formulario (campos tipo_N, entrada_N, salida_N, tolerancia_N).
 * Devuelve solo los días con excepción; los "normal" se eliminan.
 */
export function validarExcepciones(e: Entrada): Resultado<DatosExcepcion[]> {
  const errores: Errores = {};
  const out: DatosExcepcion[] = [];
  for (let d = 1 as DiaSemana; d <= 7; d = (d + 1) as DiaSemana) {
    const tipo = (texto(e, `tipo_${d}`) || "normal") as TipoDia;
    if (tipo === "normal") continue;
    if (tipo === "libre") {
      out.push({
        dia_semana: d,
        libre: true,
        hora_entrada: null,
        hora_salida: null,
        tolerancia_min: null,
      });
      continue;
    }
    if (tipo !== "especial") {
      errores[`tipo_${d}`] = "Opción no válida.";
      continue;
    }
    const entrada = texto(e, `entrada_${d}`);
    const salida = texto(e, `salida_${d}`);
    const tolTexto = texto(e, `tolerancia_${d}`);
    if (!HORA.test(entrada)) errores[`entrada_${d}`] = "Hora no válida.";
    if (!HORA.test(salida)) errores[`salida_${d}`] = "Hora no válida.";
    else if (HORA.test(entrada) && horaAMinutos(salida) <= horaAMinutos(entrada)) {
      errores[`salida_${d}`] = "Debe ser posterior a la entrada.";
    }
    const tol = tolTexto === "" ? null : Number(tolTexto);
    if (tol !== null && (!Number.isInteger(tol) || tol < 0 || tol > 180)) {
      errores[`tolerancia_${d}`] = "Entre 0 y 180.";
    }
    out.push({
      dia_semana: d,
      libre: false,
      hora_entrada: entrada,
      hora_salida: salida,
      tolerancia_min: tol,
    });
  }
  if (Object.keys(errores).length) return { ok: false, errores };
  return { ok: true, datos: out };
}

// ── Feriados ───────────────────────────────────────────────────

export function validarFeriado(e: Entrada): Resultado<{ fecha: string; descripcion: string }> {
  const errores: Errores = {};
  const fecha = texto(e, "fecha");
  const descripcion = texto(e, "descripcion").replace(/\s+/g, " ");
  if (!FECHA.test(fecha) || Number.isNaN(Date.parse(fecha))) errores.fecha = "Fecha no válida.";
  if (!descripcion) errores.descripcion = "La descripción es obligatoria.";
  else if (descripcion.length > 100) errores.descripcion = "Máximo 100 caracteres.";
  if (Object.keys(errores).length) return { ok: false, errores };
  return { ok: true, datos: { fecha, descripcion } };
}

/** Limpia un texto de búsqueda para usarlo en filtros ilike de PostgREST. */
export function terminosBusqueda(q: string): string[] {
  return q
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);
}
