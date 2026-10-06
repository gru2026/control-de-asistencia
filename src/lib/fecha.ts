/** Fechas en la zona horaria del colegio (el servidor de Vercel corre en UTC). */

export const ZONA_COLEGIO = "America/Caracas";

/** Fecha "AAAA-MM-DD" de hoy en la zona indicada. */
export function hoyEnZona(zona = ZONA_COLEGIO, ahora = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: zona,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(ahora);
}

/** "lunes, 5 de octubre de 2026" */
export function fechaLarga(fecha: string): string {
  return new Intl.DateTimeFormat("es-VE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${fecha}T00:00:00Z`));
}

/** "05/10/2026" */
export function fechaCorta(fecha: string): string {
  const [a, m, d] = fecha.split("-");
  return `${d}/${m}/${a}`;
}

/** "07:00:00" → "07:00" */
export function horaCorta(hora: string | null | undefined): string {
  return hora ? hora.slice(0, 5) : "";
}
