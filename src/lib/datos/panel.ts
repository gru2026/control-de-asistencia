/**
 * Datos del Panel de control (D-55): un solo cargador para el resumen, los
 * vistazos y las secciones. Los filtros (período y categoría) viajan en la URL
 * y se conservan al pasar de una sección a otra.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { NombreIcono } from "@/components/ui/Icono.astro";
import { cargarRegistros, rangoPeriodo, type Periodo } from "@/lib/datos/asistencia";
import { aExcepcion, aJornada, type FilaHorario, type FilaJornada } from "@/lib/datos/jornadas";
import { resolverJornada } from "@/lib/reglas/jornada";
import { sumarDias } from "@/lib/reglas/tiempo";
import {
  calendarioPeriodo,
  conclusiones,
  contar,
  histogramaLlegadas,
  hoyPorCategoria,
  personasCriticas,
  porCategoria,
  porDiaSemana,
  resumir,
  serieDiaria,
  serieRepresentativa,
} from "@/lib/reglas/estadisticas";
import { numero, plural } from "@/lib/formato";
import type { Categoria } from "@/types";

export const PERIODOS: Periodo[] = ["semana", "mes", "30d", "anterior"];
export const NOMBRE_PERIODO: Record<Periodo, string> = {
  semana: "Esta semana",
  mes: "Este mes",
  "30d": "Últimos 30 días",
  anterior: "Mes anterior",
};

export interface FiltrosPanel {
  periodo: Periodo;
  categoriaId: string | null;
}

export function leerFiltros(url: URL, categorias: Categoria[]): FiltrosPanel {
  const p = url.searchParams;
  const periodo = PERIODOS.find((x) => x === p.get("periodo")) ?? "mes";
  const cat = p.get("categoria");
  return { periodo, categoriaId: categorias.some((c) => c.id === cat) ? cat : null };
}

/** Enlace a una ruta del panel conservando los filtros (y agregando otros parámetros). */
export function enlacePanel(
  ruta: string,
  f: FiltrosPanel,
  extra: Record<string, string | null> = {},
): string {
  const u = new URLSearchParams();
  if (f.periodo !== "mes") u.set("periodo", f.periodo);
  if (f.categoriaId) u.set("categoria", f.categoriaId);
  for (const [k, v] of Object.entries(extra)) {
    if (v === null) u.delete(k);
    else u.set(k, v);
  }
  const q = u.toString();
  return q ? `${ruta}?${q}` : ruta;
}

/** Secciones del Panel de control (menú lateral y pestañas en el celular). */
export const SECCIONES_PANEL: { href: string; texto: string; icono: NombreIcono }[] = [
  { href: "/panel", texto: "Resumen", icono: "panel" },
  { href: "/panel/hoy", texto: "Hoy", icono: "reloj" },
  { href: "/panel/asistencia", texto: "Asistencia", icono: "tendencia" },
  { href: "/panel/puntualidad", texto: "Puntualidad", icono: "reloj" },
  { href: "/panel/ausencias", texto: "Ausencias y permisos", icono: "permiso" },
  { href: "/panel/categorias", texto: "Por categoría", icono: "usuarios" },
  { href: "/panel/pendientes", texto: "Pendientes", icono: "campana" },
];

// ── Formato corto de fechas ──
const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES_CORTOS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];
/** "20 oct" */
export const dd = (f: string) =>
  `${Number(f.slice(8, 10))} ${MESES_CORTOS[Number(f.slice(5, 7)) - 1]}`;
/** "mar 20 oct" */
export const diaTexto = (f: string) =>
  `${DIAS_CORTOS[new Date(`${f}T00:00:00Z`).getUTCDay()]} ${dd(f)}`;
export const iniciales = (n: string) =>
  n
    .split(" ")
    .slice(0, 2)
    .map((x) => x[0] ?? "")
    .join("");

export interface FilaPersona {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  categoria_id: string;
  usuario_id: string | null;
  marca_en_pc: boolean;
  jornada_id: string | null;
  jornadas: FilaJornada | null;
  horarios: FilaHorario[];
}

export interface Tarea {
  icono: NombreIcono;
  texto: string;
  boton: string;
  tipo: "telefono" | "revision" | "salida" | "falta" | "jornada" | "cuenta";
  /** Acción en ventana, panel de persona, enlace o aprobación directa */
  ventana?: string;
  persona?: string;
  href?: string;
  aprobar?: { personalId: string; dispositivoId: string };
}

export const porApellido = (a: FilaPersona, b: FilaPersona) =>
  a.apellido.localeCompare(b.apellido, "es") || a.nombre.localeCompare(b.nombre, "es");

export async function cargarPanel(
  sb: SupabaseClient,
  opciones: {
    hoy: string;
    filtros: FiltrosPanel;
    categorias: Categoria[];
    esDirectiva: boolean;
  },
) {
  const { hoy, filtros, categorias, esDirectiva } = opciones;
  const { periodo, categoriaId } = filtros;
  const catPorId = new Map(categorias.map((c) => [c.id, c]));
  const rango = rangoPeriodo(periodo, hoy);

  let qPersonal = sb
    .from("personal")
    .select(
      "id, nombre, apellido, cedula, categoria_id, usuario_id, marca_en_pc, jornada_id, jornadas(id, nombre, hora_entrada, hora_salida, tolerancia_min, pausa_min, dias_laborables, activa, nocturna), horarios(dia_semana, hora_entrada, hora_salida, tolerancia_min, libre)",
    )
    .eq("estado", "activo");
  if (categoriaId) qPersonal = qPersonal.eq("categoria_id", categoriaId);

  let qPermisos = sb
    .from("permisos")
    .select(
      "personal_id, motivo, fecha_desde, fecha_hasta, personal!inner(nombre, apellido, categoria_id, estado)",
      { count: "exact" },
    )
    .lte("fecha_desde", sumarDias(hoy, 7))
    .gte("fecha_hasta", hoy)
    .eq("personal.estado", "activo")
    .order("fecha_desde")
    .limit(100);
  if (categoriaId) qPermisos = qPermisos.eq("personal.categoria_id", categoriaId);

  const [
    registros,
    anteriores,
    semanaReciente,
    { data: personalData },
    { data: feriadoHoy },
    { data: feriadosPeriodo },
    { data: proximoFeriado },
    { data: permisosData, count: totalAusentes },
    { data: pedidosData },
    { count: porRevisar },
  ] = await Promise.all([
    cargarRegistros(sb, rango.desde, rango.hasta, categoriaId),
    cargarRegistros(sb, rango.anterior.desde, rango.anterior.hasta, categoriaId),
    cargarRegistros(sb, sumarDias(hoy, -7), hoy, categoriaId),
    qPersonal.limit(1000),
    sb
      .from("feriados")
      .select("descripcion")
      .eq("fecha", hoy)
      .maybeSingle<{ descripcion: string }>(),
    sb.from("feriados").select("fecha").gte("fecha", rango.desde).lte("fecha", rango.hasta),
    sb
      .from("feriados")
      .select("fecha, descripcion")
      .gt("fecha", hoy)
      .order("fecha")
      .limit(1)
      .maybeSingle<{ fecha: string; descripcion: string }>(),
    qPermisos,
    sb
      .from("dispositivos")
      .select("id, usuario_id, descripcion")
      .eq("estado", "pendiente")
      .order("creado_en")
      .limit(10),
    sb
      .from("registros_asistencia")
      .select("id", { count: "exact", head: true })
      .eq("senalado", true)
      .is("revisado_por", null),
  ]);
  const personas = (personalData ?? []) as unknown as FilaPersona[];
  const personaPorId = new Map(personas.map((x) => [x.id, x]));
  const nombreDe = (id: string) => {
    const x = personaPorId.get(id);
    return x ? `${x.nombre} ${x.apellido}` : "Alguien";
  };

  // ── Período ──
  const resumen = resumir(registros);
  const resumenAnt = anteriores.length ? resumir(anteriores) : null;
  const hayDatos = resumen.conteo.total > 0;
  const esDemo = registros.some((r) => r.esDemo) || semanaReciente.some((r) => r.esDemo);
  const serie = serieDiaria(registros);
  const serieTendencia = serieRepresentativa(serie);
  const semanas = calendarioPeriodo(
    rango.desde,
    rango.hasta,
    serie,
    ((feriadosPeriodo ?? []) as { fecha: string }[]).map((f) => f.fecha),
    hoy,
  );
  const dias = porDiaSemana(registros);
  const peorDia = dias.length ? Math.min(...dias.map((d) => d.asistencia)) : null;
  const llegadas = histogramaLlegadas(registros);
  const cats = porCategoria(registros)
    .map((c) => ({ ...c, cat: catPorId.get(c.categoriaId) }))
    .sort((a, b) => (a.cat?.orden ?? 99) - (b.cat?.orden ?? 99));
  const catsOrden = [...cats].sort((a, b) => a.asistencia - b.asistencia);
  const porPersona = personasCriticas(registros, 10_000);
  const criticas = porPersona.slice(0, 6);
  const masTarde = porPersona
    .filter((c) => c.tardanzas > 0)
    .sort((a, b) => b.tardanzas - a.tardanzas);
  const masFaltas = porPersona.filter((c) => c.faltas > 0).sort((a, b) => b.faltas - a.faltas);
  const UMBRAL_FALTAS = 3;
  const concl = conclusiones(
    registros,
    (id) => catPorId.get(id)?.nombre ?? "Una categoría",
    UMBRAL_FALTAS,
  );
  const difAsistencia =
    hayDatos && resumenAnt?.conteo.total ? resumen.asistencia - resumenAnt.asistencia : null;
  const difPuntualidad =
    hayDatos && resumenAnt?.conteo.total ? resumen.puntualidad - resumenAnt.puntualidad : null;
  // Retraso promedio por persona (minutos de quienes llegan tarde)
  const retrasoPorPersona = new Map<string, { suma: number; n: number }>();
  for (const r of registros) {
    if (r.estado !== "tarde" || r.diferenciaMin === null) continue;
    const x = retrasoPorPersona.get(r.personalId) ?? { suma: 0, n: 0 };
    x.suma += r.diferenciaMin;
    x.n++;
    retrasoPorPersona.set(r.personalId, x);
  }
  const faltasPeriodo = registros
    .filter((r) => r.estado === "falta")
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  // Faltas por semana (lunes de cada semana)
  const lunes = (f: string) => sumarDias(f, -((new Date(`${f}T00:00:00Z`).getUTCDay() + 6) % 7));
  const faltasPorSemana = new Map<string, number>();
  for (const r of faltasPeriodo)
    faltasPorSemana.set(lunes(r.fecha), (faltasPorSemana.get(lunes(r.fecha)) ?? 0) + 1);
  const semanasFaltas = [...faltasPorSemana].sort((a, b) => a[0].localeCompare(b[0]));

  // ── Hoy (siempre el día de hoy, sea cual sea el período) ──
  const deHoy = semanaReciente.filter((r) => r.fecha === hoy);
  const hoyConteo = contar(deHoy);
  const esperadosHoy = feriadoHoy
    ? []
    : personas
        .filter((x) =>
          resolverJornada({
            fecha: hoy,
            jornada: x.jornadas ? aJornada(x.jornadas) : null,
            excepciones: x.horarios.map(aExcepcion),
          }),
        )
        .map((x) => ({ personalId: x.id, categoriaId: x.categoria_id }));
  const laborablesHoy = esperadosHoy.length;
  const pendientesHoy = Math.max(0, laborablesHoy - hoyConteo.total);
  const llegaronHoy = hoyConteo.presente + hoyConteo.tarde;
  const hayJornadaHoy = laborablesHoy > 0 && !feriadoHoy;
  const conRegistroHoy = new Set(deHoy.map((r) => r.personalId));
  const sinMarcarHoy = esperadosHoy
    .filter((e) => !conRegistroHoy.has(e.personalId))
    .map((e) => personaPorId.get(e.personalId))
    .filter((x): x is FilaPersona => Boolean(x))
    .sort(porApellido);
  const progresoHoy = hoyPorCategoria(esperadosHoy, deHoy)
    .map((p) => ({ ...p, cat: catPorId.get(p.categoriaId) }))
    .sort((a, b) => (a.cat?.orden ?? 99) - (b.cat?.orden ?? 99))
    .map((p) => ({
      nombre: p.cat?.nombre ?? "—",
      color: p.cat?.color ?? "#64748b",
      llegaron: p.llegaron,
      esperados: p.esperados,
    }));
  const hoySegmentos = [
    { etiqueta: "Presentes", valor: hoyConteo.presente, clase: "presente" as const },
    { etiqueta: "Tarde", valor: hoyConteo.tarde, clase: "tarde" as const },
    { etiqueta: "Permiso", valor: hoyConteo.permiso, clase: "permiso" as const },
    { etiqueta: "Falta", valor: hoyConteo.falta, clase: "falta" as const },
    { etiqueta: "Sin marcar", valor: pendientesHoy, clase: "pendiente" as const },
  ];
  const tardeHoy = deHoy
    .filter((r) => r.estado === "tarde")
    .map((r) => ({ persona: personaPorId.get(r.personalId), hora: r.horaEntrada }))
    .filter((x): x is { persona: FilaPersona; hora: string | null } => Boolean(x.persona));

  // ── Ausencias (permisos de hoy y los próximos 7 días) ──
  interface FilaPermiso {
    personal_id: string;
    motivo: string;
    fecha_desde: string;
    fecha_hasta: string;
    personal: { nombre: string; apellido: string; categoria_id: string };
  }
  const ausentes = ((permisosData ?? []) as unknown as FilaPermiso[]).map((p) => ({
    personalId: p.personal_id,
    nombre: `${p.personal.nombre} ${p.personal.apellido}`,
    color: catPorId.get(p.personal.categoria_id)?.color ?? "#64748b",
    motivo: p.motivo,
    desde: p.fecha_desde,
    hasta: p.fecha_hasta,
  }));
  const totalAus = totalAusentes ?? ausentes.length;
  const permisosHoy = ausentes.filter((a) => a.desde <= hoy).length;

  // ── Pendientes (cada uno con su botón) ──
  const pedidos = (pedidosData ?? []) as {
    id: string;
    usuario_id: string;
    descripcion: string | null;
  }[];
  const { data: fichasTelefono } = pedidos.length
    ? await sb
        .from("personal")
        .select("id, nombre, apellido, usuario_id")
        .in(
          "usuario_id",
          pedidos.map((x) => x.usuario_id),
        )
    : { data: [] };
  const telefonos = pedidos
    .map((d) => ({
      dispositivo: d,
      ficha: (fichasTelefono ?? []).find((f) => f.usuario_id === d.usuario_id) as
        { id: string; nombre: string; apellido: string } | undefined,
    }))
    .filter((x) => x.ficha);
  const salidasPendientes = semanaReciente.filter(
    (r) => r.fecha < hoy && r.horaEntrada && !r.horaSalida,
  );
  const faltasRecientes = semanaReciente
    .filter((r) => r.estado === "falta")
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  const sinCuenta = personas.filter((x) => !x.usuario_id && !x.marca_en_pc).length;
  const sinJornada = personas.filter((x) => !x.jornada_id).length;
  const tareas: Tarea[] = [
    ...telefonos.map(({ dispositivo, ficha }) => ({
      tipo: "telefono" as const,
      icono: "telefono" as NombreIcono,
      texto: `${ficha!.nombre} ${ficha!.apellido} pide aprobar su teléfono${dispositivo.descripcion ? ` (${dispositivo.descripcion})` : ""}`,
      boton: "Aprobar",
      aprobar: { personalId: ficha!.id, dispositivoId: dispositivo.id },
    })),
    ...(porRevisar
      ? [
          {
            tipo: "revision" as const,
            icono: "escudo" as NombreIcono,
            texto: plural(porRevisar, "marcación por revisar", "marcaciones por revisar"),
            boton: "Revisar",
            href: "/asistencia/revision",
          },
        ]
      : []),
    ...salidasPendientes.map((r) => ({
      tipo: "salida" as const,
      icono: "reloj" as NombreIcono,
      texto: `${nombreDe(r.personalId)} no marcó la salida el ${diaTexto(r.fecha)}`,
      boton: "Ver",
      persona: r.personalId,
    })),
    ...faltasRecientes.map((r) => ({
      tipo: "falta" as const,
      icono: "alerta" as NombreIcono,
      texto: `${nombreDe(r.personalId)} faltó el ${diaTexto(r.fecha)}`,
      boton: "Cargar permiso",
      ventana: `/ventanas/permiso?persona=${r.personalId}&desde=${r.fecha}`,
    })),
    ...(sinJornada
      ? [
          {
            tipo: "jornada" as const,
            icono: "calendario" as NombreIcono,
            texto: `${plural(sinJornada, "persona", "personas")} sin jornada asignada`,
            boton: "Ver",
            href: "/personal?jornada=no",
          },
        ]
      : []),
    ...(sinCuenta
      ? [
          {
            tipo: "cuenta" as const,
            icono: "usuarios" as NombreIcono,
            texto: `${plural(sinCuenta, "persona", "personas")} sin cuenta de acceso`,
            boton: esDirectiva ? "Crear" : "Ver",
            href: esDirectiva ? "/personal/cuentas" : "/personal?cuenta=no",
          },
        ]
      : []),
  ];

  // ── Frases en palabras (primera capa) ──
  const fraseHoy = feriadoHoy
    ? "Hoy es feriado"
    : laborablesHoy === 0
      ? "Hoy no hay jornada"
      : `${numero(llegaronHoy)} de ${numero(laborablesHoy)} ya llegaron`;
  const detalleHoy = feriadoHoy
    ? feriadoHoy.descripcion
    : laborablesHoy === 0
      ? undefined
      : pendientesHoy
        ? `${plural(pendientesHoy, "persona aún sin marcar", "personas aún sin marcar")}${hoyConteo.tarde ? ` · ${numero(hoyConteo.tarde)} tarde` : ""}`
        : "Todos marcaron";
  const comparacion = (dif: number | null, mejor: string, igual: string, peor: string) =>
    dif === null ? undefined : Math.abs(dif) < 1 ? igual : dif > 0 ? mejor : peor;
  const comparacionAsistencia = comparacion(
    difAsistencia,
    "Mejor que el período anterior",
    "Igual que el período anterior",
    "Más baja que el período anterior",
  );
  const frasePuntualidad = !hayDatos
    ? "Sin registros todavía"
    : (comparacion(
        difPuntualidad,
        "Las tardanzas bajaron",
        "Las tardanzas se mantienen",
        "Las tardanzas subieron",
      ) ?? plural(resumen.conteo.tarde, "llegada tarde", "llegadas tarde"));
  const peorCat = catsOrden[0];
  const mejorCat = catsOrden[catsOrden.length - 1];
  const fraseCategoria = !peorCat
    ? "Sin registros todavía"
    : cats.length > 1
      ? `Más baja: ${peorCat.cat?.nombre ?? "—"}`
      : `${peorCat.cat?.nombre ?? "—"}`;

  return {
    rango,
    catPorId,
    personas,
    personaPorId,
    nombreDe,
    registros,
    resumen,
    resumenAnt,
    hayDatos,
    esDemo,
    serie,
    serieTendencia,
    omitidosTendencia: serie.length - serieTendencia.length,
    semanas,
    dias,
    peorDia,
    llegadas,
    totalLlegadas: llegadas.reduce((s, l) => s + l.valor, 0),
    cats,
    catsOrden,
    peorCat,
    mejorCat,
    criticas,
    masTarde,
    masFaltas,
    retrasoPorPersona,
    faltasPeriodo,
    semanasFaltas,
    concl,
    UMBRAL_FALTAS,
    // hoy
    feriadoHoy,
    proximoFeriado,
    deHoy,
    hoyConteo,
    laborablesHoy,
    pendientesHoy,
    llegaronHoy,
    hayJornadaHoy,
    sinMarcarHoy,
    tardeHoy,
    progresoHoy,
    hoySegmentos,
    // ausencias
    ausentes,
    totalAus,
    permisosHoy,
    // pendientes
    tareas,
    porRevisar: porRevisar ?? 0,
    // frases
    fraseHoy,
    detalleHoy,
    comparacionAsistencia,
    frasePuntualidad,
    fraseCategoria,
  };
}

export type DatosPanel = Awaited<ReturnType<typeof cargarPanel>>;
