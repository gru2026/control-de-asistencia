/**
 * Planilla diaria de asistencia con el formato oficial del colegio
 * (ASISTENCIA DOCENTES / ASISTENCIA PERSONAL). Lógica pura y testeable.
 * Columnas: N° · Nombres y apellidos · C.I. · Carga horaria · Cargo · Hora de llegada ·
 *           Hora de salida · Observación   (sin columnas de firma: D-25)
 */
import type { Categoria, EstadoAsistencia } from "@/types";
import { diaSemanaISO } from "@/lib/reglas/tiempo";

export type TipoPlanilla = "docentes" | "personal" | `categoria:${string}`;

export interface PersonaPlanilla {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  carga_horaria: number | null;
  categoria_id: string;
  nocturna: boolean;
}

export interface MarcaPlanilla {
  horaEntrada: string | null;
  horaSalida: string | null;
  estado: EstadoAsistencia;
  diferenciaMin: number | null;
  observacion: string | null;
}

export interface FilaPlanilla {
  n: string;
  nombre: string;
  cedula: string;
  carga: string;
  cargo: string;
  llegada: string;
  salida: string;
  observacion: string;
  estado: EstadoAsistencia | "sin_registro";
}

export interface GrupoPlanilla {
  nombre: string | null;
  filas: FilaPlanilla[];
}

export interface Planilla {
  titulo: string;
  dia: string;
  fecha: string; // dd/mm/aaaa
  grupos: GrupoPlanilla[];
  totales: Record<EstadoAsistencia | "sin_registro", number>;
}

export const DIAS = ["", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO", "DOMINGO"];

const numCedula = (c: string) => Number(c.replace(/\D/g, "")) || 0;

export function observacionDe(m: MarcaPlanilla | undefined): string {
  if (!m) return "Sin registro";
  switch (m.estado) {
    case "tarde":
      return [`Tarde${m.diferenciaMin ? ` (+${m.diferenciaMin} min)` : ""}`, m.observacion]
        .filter(Boolean)
        .join(" · ");
    case "falta":
      return ["Falta", m.observacion].filter(Boolean).join(" · ");
    case "permiso":
      return `Permiso${m.observacion ? `: ${m.observacion}` : ""}`;
    default:
      return m.observacion ?? "";
  }
}

export function categoriasDelTipo(tipo: TipoPlanilla, categorias: Categoria[]): Categoria[] {
  const orden = [...categorias].sort(
    (a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre),
  );
  if (tipo.startsWith("categoria:")) return orden.filter((c) => c.id === tipo.slice(10));
  return orden.filter((c) => c.planilla === tipo);
}

export function tituloDe(tipo: TipoPlanilla, categorias: Categoria[]): string {
  if (tipo === "docentes") return "ASISTENCIA DOCENTES";
  if (tipo === "personal") return "ASISTENCIA PERSONAL";
  const c = categorias.find((x) => x.id === tipo.slice(10));
  return `ASISTENCIA ${c?.nombre.toUpperCase() ?? ""}`.trim();
}

export function construirPlanilla(
  tipo: TipoPlanilla,
  fecha: string,
  categorias: Categoria[],
  personas: PersonaPlanilla[],
  marcas: Map<string, MarcaPlanilla>,
): Planilla {
  const cats = categoriasDelTipo(tipo, categorias);
  const totales = { presente: 0, tarde: 0, falta: 0, permiso: 0, sin_registro: 0 };
  const agrupar = tipo === "personal"; // la planilla de personal separa por cargo

  const grupos: GrupoPlanilla[] = [];
  for (const c of cats) {
    const delGrupo = personas
      .filter((p) => p.categoria_id === c.id)
      .sort((a, b) => numCedula(a.cedula) - numCedula(b.cedula));
    if (!delGrupo.length) continue;
    const filas = delGrupo.map((p): FilaPlanilla => {
      const m = marcas.get(p.id);
      const estado = m?.estado ?? "sin_registro";
      totales[estado]++;
      return {
        n: "",
        nombre: `${p.nombre}, ${p.apellido}`.toUpperCase(),
        cedula: p.cedula,
        carga: p.carga_horaria ? String(p.carga_horaria) : "",
        cargo: (c.nombre + (p.nocturna ? " / NOC" : "")).toUpperCase(),
        llegada: m?.horaEntrada ?? "",
        salida: m?.horaSalida ?? "",
        observacion: observacionDe(m),
        estado,
      };
    });
    if (agrupar || !grupos.length) grupos.push({ nombre: agrupar ? c.nombre : null, filas });
    else grupos[0]!.filas.push(...filas);
  }
  // Numeración: por grupo en la planilla de personal (01, 02…), corrida en las demás.
  for (const g of grupos) g.filas.forEach((f, i) => (f.n = String(i + 1).padStart(2, "0")));

  const [a, m, d] = fecha.split("-");
  return {
    titulo: tituloDe(tipo, categorias),
    dia: DIAS[diaSemanaISO(fecha)]!,
    fecha: `${d}/${m}/${a}`,
    grupos,
    totales,
  };
}
