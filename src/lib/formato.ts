/** Formato numérico venezolano (coma decimal, punto de miles). */

const entero = new Intl.NumberFormat("es-VE", { maximumFractionDigits: 0 });
const unDecimal = new Intl.NumberFormat("es-VE", { maximumFractionDigits: 1 });

/** 2128 → "2.128" */
export function numero(n: number): string {
  return entero.format(n);
}

/** 94.97 → "95 %" · con decimales: "94,97 %" */
export function porcentaje(n: number, decimales = 0): string {
  const f = new Intl.NumberFormat("es-VE", {
    maximumFractionDigits: decimales,
    minimumFractionDigits: 0,
  });
  return `${f.format(n)} %`;
}

/** Variación en puntos porcentuales, con signo: 1.26 → "+1,3"; −0.13 → "−0,1"; 0 → "0" */
export function variacionPuntos(v: number): string {
  const r = Math.round(v * 10) / 10;
  if (r === 0) return "0";
  return `${r > 0 ? "+" : "−"}${unDecimal.format(Math.abs(r))}`;
}

/** "1 falta" / "3 faltas" */
export function plural(n: number, uno: string, varios: string): string {
  return `${numero(n)} ${n === 1 ? uno : varios}`;
}

/** 45 → "45 min" · 60 → "1 h" · 583 → "9 h 43 min" */
export function textoDuracion(minutos: number): string {
  const m = Math.max(0, Math.round(minutos));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
}
