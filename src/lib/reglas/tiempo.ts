import type { DiaSemana, HoraTexto } from "@/types";

/** Convierte "HH:MM" (o "HH:MM:SS") en minutos desde medianoche. */
export function horaAMinutos(hora: HoraTexto): number {
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(hora.trim());
  if (!m) throw new Error(`Hora inválida: "${hora}"`);
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new Error(`Hora fuera de rango: "${hora}"`);
  return h * 60 + min;
}

/** Día de la semana ISO (1 = lunes … 7 = domingo) de una fecha "AAAA-MM-DD". */
export function diaSemanaISO(fecha: string): DiaSemana {
  const d = fechaUTC(fecha).getUTCDay(); // 0 = domingo
  return (d === 0 ? 7 : d) as DiaSemana;
}

/** Interpreta "AAAA-MM-DD" como fecha a medianoche UTC (sin efectos de zona horaria). */
export function fechaUTC(fecha: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) throw new Error(`Fecha inválida: "${fecha}"`);
  const d = new Date(`${fecha}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) throw new Error(`Fecha inválida: "${fecha}"`);
  return d;
}

/** Lista de fechas "AAAA-MM-DD" entre desde y hasta (ambas inclusive). */
export function rangoFechas(desde: string, hasta: string): string[] {
  const out: string[] = [];
  const fin = fechaUTC(hasta).getTime();
  for (let t = fechaUTC(desde).getTime(); t <= fin; t += 86_400_000) {
    out.push(new Date(t).toISOString().slice(0, 10));
  }
  return out;
}

export function redondear2(n: number): number {
  return Math.round(n * 100) / 100;
}
