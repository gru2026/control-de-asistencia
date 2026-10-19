/**
 * R5 · Resumen del período por persona (función pura).
 * Días laborables según R0, desde el ingreso y nunca después de hoy.
 */
import type { EstadoAsistencia, ExcepcionHorario, Jornada, MetodoMarcacion } from "@/types";
import { resolverJornada } from "@/lib/reglas/jornada";
import { calcularAcumulados, type Acumulados } from "@/lib/reglas/acumulados";
import { rangoFechas, redondear2 } from "@/lib/reglas/tiempo";

export interface PersonaResumen {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  categoriaId: string;
  fechaIngreso: string | null;
  jornada: Jornada | null;
  excepciones: ExcepcionHorario[];
}

export interface RegistroPeriodo {
  personalId: string;
  fecha: string;
  estado: EstadoAsistencia;
  horasTrabajadas: number | null;
  entradaMetodo: MetodoMarcacion | null;
}

export interface FilaResumen extends Acumulados {
  personalId: string;
  nombre: string;
  cedula: string;
  categoriaId: string;
  /** Días laborables sin ningún registro (cierre en pausa o día en curso). */
  sinRegistro: number;
}

export interface Resumen {
  desde: string;
  hasta: string;
  filas: FilaResumen[];
  totales: Omit<FilaResumen, "personalId" | "nombre" | "cedula" | "categoriaId">;
}

export type OrdenResumen = "nombre" | "asistencia" | "faltas" | "tardanzas" | "horas";

export function construirResumen(p: {
  desde: string;
  hasta: string;
  hoy: string;
  personas: PersonaResumen[];
  registros: RegistroPeriodo[];
  feriados: string[];
}): Resumen {
  const fin = p.hasta < p.hoy ? p.hasta : p.hoy;
  const fechas = p.desde <= fin ? rangoFechas(p.desde, fin) : [];
  const porPersona = new Map<string, Map<string, RegistroPeriodo>>();
  for (const r of p.registros) {
    if (r.fecha < p.desde || r.fecha > p.hasta) continue;
    if (!porPersona.has(r.personalId)) porPersona.set(r.personalId, new Map());
    porPersona.get(r.personalId)!.set(r.fecha, r);
  }

  const filas = p.personas.map((x): FilaResumen => {
    const laborables = fechas.filter(
      (f) =>
        (!x.fechaIngreso || f >= x.fechaIngreso) &&
        resolverJornada({
          fecha: f,
          jornada: x.jornada,
          excepciones: x.excepciones,
          feriados: p.feriados,
        }),
    );
    const suyos = porPersona.get(x.id) ?? new Map<string, RegistroPeriodo>();
    const delPeriodo = laborables.flatMap((f) => (suyos.has(f) ? [suyos.get(f)!] : []));
    const acc = calcularAcumulados(
      delPeriodo.map((r) => ({
        estado: r.estado,
        horasTrabajadas: r.horasTrabajadas,
        entradaMetodo: r.entradaMetodo,
      })),
      laborables.length,
    );
    return {
      personalId: x.id,
      nombre: `${x.apellido}, ${x.nombre}`,
      cedula: x.cedula,
      categoriaId: x.categoriaId,
      ...acc,
      sinRegistro: laborables.length - delPeriodo.length,
    };
  });

  const suma = (k: keyof Acumulados | "sinRegistro") =>
    filas.reduce((s, f) => s + (f[k] as number), 0);
  const diasLaborables = suma("diasLaborables");
  const asistidos = suma("presentes") + suma("tardanzas") + suma("permisos");
  return {
    desde: p.desde,
    hasta: fin,
    filas,
    totales: {
      diasLaborables,
      presentes: suma("presentes"),
      tardanzas: suma("tardanzas"),
      faltas: suma("faltas"),
      permisos: suma("permisos"),
      totalHoras: redondear2(suma("totalHoras")),
      porcentajeAsistencia: diasLaborables ? redondear2((asistidos / diasLaborables) * 100) : 0,
      marcacionesPc: suma("marcacionesPc"),
      sinRegistro: suma("sinRegistro"),
    },
  };
}

export function ordenarResumen(filas: FilaResumen[], orden: OrdenResumen, dir: "asc" | "desc") {
  const clave: Record<OrdenResumen, (f: FilaResumen) => number | string> = {
    nombre: (f) => f.nombre,
    asistencia: (f) => f.porcentajeAsistencia,
    faltas: (f) => f.faltas,
    tardanzas: (f) => f.tardanzas,
    horas: (f) => f.totalHoras,
  };
  const k = clave[orden];
  const signo = dir === "asc" ? 1 : -1;
  return [...filas].sort((a, b) => {
    const va = k(a);
    const vb = k(b);
    const c = typeof va === "string" ? va.localeCompare(vb as string, "es") : va - (vb as number);
    return c * signo || a.nombre.localeCompare(b.nombre, "es");
  });
}

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

/** Rango pedido por URL: por defecto el mes en curso; se ordena y se limita a un año. */
export function rangoResumen(
  desde: string | null,
  hasta: string | null,
  hoy: string,
): { desde: string; hasta: string } {
  let d = desde && FECHA.test(desde) ? desde : `${hoy.slice(0, 8)}01`;
  let h = hasta && FECHA.test(hasta) ? hasta : hoy;
  if (h < d) [d, h] = [h, d];
  const limite = `${Number(h.slice(0, 4)) - 1}${h.slice(4)}`;
  if (d < limite) d = limite;
  return { desde: d, hasta: h };
}
