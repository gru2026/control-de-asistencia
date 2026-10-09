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

/** 450 → "07:30" (acepta valores fuera de 0–1439 y los ajusta al día). */
export function minutosAHora(minutos: number): HoraTexto {
  const m = ((Math.round(minutos) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** Suma (o resta) días a una fecha "AAAA-MM-DD". */
export function sumarDias(fecha: string, dias: number): string {
  const d = fechaUTC(fecha);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

/**
 * Instante (Date) de una hora local del colegio. `minutos` puede superar 1440
 * para horas del día siguiente (jornadas nocturnas).
 * @param desfaseUTC desfase de la zona en minutos (Venezuela: -240, sin horario de verano)
 */
export function instanteLocal(fecha: string, minutos: number, desfaseUTC = -240): Date {
  return new Date(fechaUTC(fecha).getTime() + (minutos - desfaseUTC) * 60_000);
}

/** Hora local "HH:MM" de un instante, en la zona indicada. */
export function horaEnZona(instante: Date | string, zona = "America/Caracas"): HoraTexto {
  const d = typeof instante === "string" ? new Date(instante) : instante;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: zona,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(d);
}
