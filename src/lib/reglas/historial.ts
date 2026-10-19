/** Historial personal: calendario del mes con el estado de cada día. */
import type { EstadoAsistencia } from "@/types";
import { diaSemanaISO, sumarDias } from "./tiempo";

export type EstadoDiaHistorial = EstadoAsistencia | "sin_registro" | "libre" | "feriado" | "futuro";

export interface DiaHistorial {
  fecha: string;
  dia: number;
  estado: EstadoDiaHistorial;
}

/** "2026-10" válido o el mes de hoy. */
export function mesValido(mes: string | null, hoy: string): string {
  return mes && /^\d{4}-(0[1-9]|1[0-2])$/.test(mes) && mes <= hoy.slice(0, 7)
    ? mes
    : hoy.slice(0, 7);
}

export function mesVecino(mes: string, delta: number): string {
  const [a, m] = mes.split("-").map(Number) as [number, number];
  const d = new Date(Date.UTC(a, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

export function diasDelMes(mes: string): { desde: string; hasta: string } {
  const desde = `${mes}-01`;
  return { desde, hasta: sumarDias(`${mesVecino(mes, 1)}-01`, -1) };
}

/** Semanas (lunes a domingo) del mes; las celdas fuera del mes son null. */
export function calendarioPersonal(p: {
  mes: string;
  hoy: string;
  estados: Map<string, EstadoAsistencia>;
  laborable: (fecha: string) => boolean;
  feriados: string[];
}): (DiaHistorial | null)[][] {
  const { desde, hasta } = diasDelMes(p.mes);
  const celdas: (DiaHistorial | null)[] = Array.from(
    { length: diaSemanaISO(desde) - 1 },
    () => null,
  );
  for (let f = desde; f <= hasta; f = sumarDias(f, 1)) {
    const registrado = p.estados.get(f);
    const estado: EstadoDiaHistorial = registrado
      ? registrado
      : f > p.hoy
        ? "futuro"
        : p.feriados.includes(f)
          ? "feriado"
          : p.laborable(f)
            ? "sin_registro"
            : "libre";
    celdas.push({ fecha: f, dia: Number(f.slice(8)), estado });
  }
  while (celdas.length % 7) celdas.push(null);
  const semanas: (DiaHistorial | null)[][] = [];
  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7));
  return semanas;
}
