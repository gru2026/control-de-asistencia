/**
 * R5 · Acumulados por período.
 * Ver Documentacion/03-Diseno/Reglas-de-negocio.md
 */
import type { EstadoAsistencia, MetodoMarcacion } from "@/types";
import { redondear2 } from "./tiempo";

export interface RegistroResumen {
  estado: EstadoAsistencia;
  horasTrabajadas: number | null;
  entradaMetodo?: MetodoMarcacion | null;
}

export interface Acumulados {
  diasLaborables: number;
  presentes: number;
  tardanzas: number;
  faltas: number;
  permisos: number;
  totalHoras: number;
  porcentajeAsistencia: number;
  marcacionesPc: number;
}

/**
 * @param registros registros de los días laborables del período
 * @param diasLaborables cantidad de días laborables del período (R0, sin feriados)
 */
export function calcularAcumulados(
  registros: RegistroResumen[],
  diasLaborables: number,
): Acumulados {
  const contar = (e: EstadoAsistencia) => registros.filter((r) => r.estado === e).length;
  const presentes = contar("presente");
  const tardanzas = contar("tarde");
  const permisos = contar("permiso");
  const faltas = contar("falta");

  const asistidos = presentes + tardanzas + permisos;
  const porcentajeAsistencia =
    diasLaborables > 0 ? redondear2(Math.min(100, (asistidos / diasLaborables) * 100)) : 0;

  return {
    diasLaborables,
    presentes,
    tardanzas,
    faltas,
    permisos,
    totalHoras: redondear2(registros.reduce((s, r) => s + (r.horasTrabajadas ?? 0), 0)),
    porcentajeAsistencia,
    marcacionesPc: registros.filter((r) => r.entradaMetodo != null && r.entradaMetodo !== "qr")
      .length,
  };
}
