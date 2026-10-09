/**
 * Indicadores del panel de la directiva (lógica pura, sin BD).
 * La entrada es una lista compacta de registros ya consolidados por día.
 */
import type { DiaSemana, EstadoAsistencia } from "@/types";
import { diaSemanaISO, redondear2 } from "./tiempo";

export interface RegistroEstadistica {
  fecha: string;
  personalId: string;
  categoriaId: string;
  estado: EstadoAsistencia;
  /** Minutos entre la llegada y la hora esperada (negativo = antes). null si no marcó. */
  diferenciaMin: number | null;
  horas: number | null;
}

export interface Conteo {
  total: number;
  presente: number;
  tarde: number;
  falta: number;
  permiso: number;
}

const vacio = (): Conteo => ({ total: 0, presente: 0, tarde: 0, falta: 0, permiso: 0 });

export function contar(registros: Iterable<RegistroEstadistica>): Conteo {
  const c = vacio();
  for (const r of registros) {
    c.total++;
    c[r.estado]++;
  }
  return c;
}

/** % de días con asistencia (presente + tarde + permiso) sobre el total. */
export function porcentajeAsistencia(c: Conteo): number {
  return c.total ? redondear2(((c.presente + c.tarde + c.permiso) / c.total) * 100) : 0;
}

/** % de llegadas a tiempo sobre las llegadas (presente + tarde). */
export function porcentajePuntualidad(c: Conteo): number {
  const llegadas = c.presente + c.tarde;
  return llegadas ? redondear2((c.presente / llegadas) * 100) : 0;
}

export interface Resumen {
  conteo: Conteo;
  asistencia: number;
  puntualidad: number;
  retrasoPromedioMin: number;
  horasTotales: number;
  personas: number;
}

export function resumir(registros: RegistroEstadistica[]): Resumen {
  const conteo = contar(registros);
  const tardes = registros.filter((r) => r.estado === "tarde" && r.diferenciaMin !== null);
  const retraso = tardes.length
    ? tardes.reduce((s, r) => s + (r.diferenciaMin ?? 0), 0) / tardes.length
    : 0;
  return {
    conteo,
    asistencia: porcentajeAsistencia(conteo),
    puntualidad: porcentajePuntualidad(conteo),
    retrasoPromedioMin: Math.round(retraso),
    horasTotales: redondear2(registros.reduce((s, r) => s + (r.horas ?? 0), 0)),
    personas: new Set(registros.map((r) => r.personalId)).size,
  };
}

/** Diferencia en puntos porcentuales (actual − anterior), o null si no hay período anterior. */
export function variacion(actual: number, anterior: number | null): number | null {
  return anterior === null ? null : redondear2(actual - anterior);
}

function agrupar<K>(registros: RegistroEstadistica[], clave: (r: RegistroEstadistica) => K) {
  const m = new Map<K, RegistroEstadistica[]>();
  for (const r of registros) {
    const k = clave(r);
    const lista = m.get(k);
    if (lista) lista.push(r);
    else m.set(k, [r]);
  }
  return m;
}

export interface PuntoSerie {
  clave: string;
  valor: number;
  conteo: Conteo;
}

/** % de asistencia por día, en orden cronológico. */
export function serieDiaria(registros: RegistroEstadistica[]): PuntoSerie[] {
  return [...agrupar(registros, (r) => r.fecha)]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, lista]) => {
      const c = contar(lista);
      return { clave: fecha, valor: porcentajeAsistencia(c), conteo: c };
    });
}

/** % de asistencia y de tardanza por día de la semana (solo días con datos). */
export function porDiaSemana(registros: RegistroEstadistica[]) {
  const grupos = agrupar(registros, (r) => diaSemanaISO(r.fecha));
  return ([1, 2, 3, 4, 5, 6, 7] as DiaSemana[])
    .filter((d) => grupos.has(d))
    .map((d) => {
      const c = contar(grupos.get(d)!);
      return {
        dia: d,
        asistencia: porcentajeAsistencia(c),
        tardanza: c.total ? redondear2((c.tarde / c.total) * 100) : 0,
        faltas: c.falta,
        conteo: c,
      };
    });
}

export const TRAMOS_LLEGADA = [
  { clave: "antes", etiqueta: "Antes de hora", desde: -Infinity, hasta: 0 },
  { clave: "0-5", etiqueta: "0–5 min", desde: 0, hasta: 5 },
  { clave: "6-15", etiqueta: "6–15 min", desde: 5, hasta: 15 },
  { clave: "16-30", etiqueta: "16–30 min", desde: 15, hasta: 30 },
  { clave: "31-60", etiqueta: "31–60 min", desde: 30, hasta: 60 },
  { clave: "60+", etiqueta: "Más de 60", desde: 60, hasta: Infinity },
] as const;

/** Distribución de llegadas según los minutos respecto a la hora de entrada. */
export function histogramaLlegadas(registros: RegistroEstadistica[]) {
  const conteos = TRAMOS_LLEGADA.map((t) => ({ clave: t.clave, etiqueta: t.etiqueta, valor: 0 }));
  for (const r of registros) {
    if (r.diferenciaMin === null) continue;
    const d = r.diferenciaMin;
    const i = TRAMOS_LLEGADA.findIndex((t) =>
      d <= 0 ? t.clave === "antes" : d > t.desde && d <= t.hasta,
    );
    if (i >= 0) conteos[i]!.valor++;
  }
  return conteos;
}

/** Asistencia y tardanzas por categoría. */
export function porCategoria(registros: RegistroEstadistica[]) {
  return [...agrupar(registros, (r) => r.categoriaId)].map(([categoriaId, lista]) => {
    const c = contar(lista);
    return {
      categoriaId,
      asistencia: porcentajeAsistencia(c),
      puntualidad: porcentajePuntualidad(c),
      personas: new Set(lista.map((r) => r.personalId)).size,
      conteo: c,
    };
  });
}

/** Personas con más faltas y tardanzas (para seguimiento individual). */
export function personasCriticas(registros: RegistroEstadistica[], limite = 5) {
  return [...agrupar(registros, (r) => r.personalId)]
    .map(([personalId, lista]) => {
      const c = contar(lista);
      return {
        personalId,
        faltas: c.falta,
        tardanzas: c.tarde,
        asistencia: porcentajeAsistencia(c),
      };
    })
    .filter((p) => p.faltas + p.tardanzas > 0)
    .sort((a, b) => b.faltas * 2 + b.tardanzas - (a.faltas * 2 + a.tardanzas))
    .slice(0, limite);
}

const NOMBRE_DIA_CORTO = [
  "",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

/**
 * Frases de "lectura rápida" para la directiva, derivadas de los datos.
 * Solo se emiten cuando hay datos suficientes y la diferencia es relevante.
 */
export function hallazgos(
  registros: RegistroEstadistica[],
  nombreCategoria: (id: string) => string,
  minimoRegistros = 30,
): string[] {
  if (registros.length < minimoRegistros) return [];
  const out: string[] = [];
  const general = resumir(registros);

  const dias = porDiaSemana(registros).filter((d) => d.conteo.total >= 5);
  if (dias.length >= 3) {
    const peor = dias.reduce((a, b) => (b.asistencia < a.asistencia ? b : a));
    if (general.asistencia - peor.asistencia >= 3) {
      out.push(
        `Los ${NOMBRE_DIA_CORTO[peor.dia]} tienen la asistencia más baja (${peor.asistencia}% frente a ${general.asistencia}% general).`,
      );
    }
  }

  const cats = porCategoria(registros).filter((c) => c.conteo.presente + c.conteo.tarde >= 10);
  if (cats.length >= 2) {
    const peor = cats.reduce((a, b) => (b.puntualidad < a.puntualidad ? b : a));
    if (general.puntualidad - peor.puntualidad >= 5) {
      out.push(
        `${nombreCategoria(peor.categoriaId)} es la categoría con menor puntualidad (${peor.puntualidad}%).`,
      );
    }
  }

  const h = histogramaLlegadas(registros);
  const llegadas = h.reduce((s, x) => s + x.valor, 0);
  const justoTolerancia = h.filter((x) => x.clave === "6-15").reduce((s, x) => s + x.valor, 0);
  if (llegadas && justoTolerancia / llegadas >= 0.2) {
    out.push(
      `${Math.round((justoTolerancia / llegadas) * 100)}% de las llegadas ocurre entre 6 y 15 minutos después de la hora: el personal usa la tolerancia con frecuencia.`,
    );
  }

  const criticas = personasCriticas(registros, 100).filter((p) => p.faltas >= 3);
  if (criticas.length) {
    out.push(
      `${criticas.length} ${criticas.length === 1 ? "persona acumula" : "personas acumulan"} 3 o más faltas en el período.`,
    );
  }
  return out;
}

// ── Conclusiones de una línea para los títulos de las secciones del panel ──

const DIAS_LARGOS = [
  "",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábados",
  "domingos",
];
const redondo = (n: number) => `${Math.round(n)} %`;

export interface Conclusiones {
  tendencia: string;
  dias: string;
  llegadas: string;
  categorias: string;
  personas: string;
}

/**
 * Resume cada análisis en una frase corta, para que la sección se entienda sin abrirla.
 * Solo afirma una diferencia cuando es relevante (≥ 3 puntos) y hay datos suficientes.
 */
export function conclusiones(
  registros: RegistroEstadistica[],
  nombreCategoria: (id: string) => string,
  umbralFaltas = 3,
): Conclusiones {
  const general = resumir(registros);
  const sinDatos = "Sin datos en el período";
  if (!registros.length) {
    return {
      tendencia: sinDatos,
      dias: sinDatos,
      llegadas: sinDatos,
      categorias: sinDatos,
      personas: sinDatos,
    };
  }

  // Tendencia: compara la primera y la segunda mitad del período
  const serie = serieDiaria(registros);
  let tendencia = `Promedio ${redondo(general.asistencia)}`;
  if (serie.length >= 4) {
    const mitad = Math.floor(serie.length / 2);
    const prom = (xs: PuntoSerie[]) => xs.reduce((s, p) => s + p.valor, 0) / xs.length;
    const cambio = prom(serie.slice(mitad)) - prom(serie.slice(0, mitad));
    const estado = cambio >= 2 ? "En alza" : cambio <= -2 ? "En baja" : "Estable";
    tendencia = `${estado} · promedio ${redondo(general.asistencia)}`;
  }

  // Día de la semana
  const ds = porDiaSemana(registros).filter((d) => d.conteo.total >= 5);
  let dias = "Sin diferencias entre días";
  if (ds.length >= 2) {
    const peor = ds.reduce((a, b) => (b.asistencia < a.asistencia ? b : a));
    if (general.asistencia - peor.asistencia >= 2) {
      dias = `Los ${DIAS_LARGOS[peor.dia]}, la más baja (${redondo(peor.asistencia)})`;
    }
  }

  // Llegadas
  const h = histogramaLlegadas(registros);
  const total = h.reduce((s, x) => s + x.valor, 0);
  const pct = (claves: string[]) =>
    total
      ? (h.filter((x) => claves.includes(x.clave)).reduce((s, x) => s + x.valor, 0) / total) * 100
      : 0;
  const llegadas = total
    ? `${redondo(pct(["antes", "0-5"]))} a la hora · ${redondo(pct(["16-30", "31-60", "60+"]))} tarde`
    : "Sin llegadas registradas";

  // Categorías
  const cs = porCategoria(registros).filter((c) => c.conteo.presente + c.conteo.tarde >= 10);
  let categorias = "Sin diferencias relevantes";
  if (cs.length >= 2) {
    const peor = cs.reduce((a, b) => (b.puntualidad < a.puntualidad ? b : a));
    if (general.puntualidad - peor.puntualidad >= 3) {
      categorias = `${nombreCategoria(peor.categoriaId)}, la menos puntual (${redondo(peor.puntualidad)})`;
    }
  }

  // Personas
  const muchas = personasCriticas(registros, 1000).filter((p) => p.faltas >= umbralFaltas).length;
  const personas = muchas
    ? `${muchas} ${muchas === 1 ? "persona" : "personas"} con ${umbralFaltas} o más faltas`
    : "Nadie con faltas repetidas";

  return { tendencia, dias, llegadas, categorias, personas };
}
