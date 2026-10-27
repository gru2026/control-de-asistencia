/**
 * Cifras que cuentan desde 0 (D-54): `<span data-contar="96" data-sufijo=" %">96 %</span>`.
 * El texto final ya viene escrito desde el servidor; aquí solo se anima. Respeta
 * «reducir movimiento» y no se repite en elementos dentro de `.quieto`.
 */
import { enCadaPantalla } from "./pantalla";

const formato = new Intl.NumberFormat("es-VE", { maximumFractionDigits: 0 });
const DURACION = 800;

function contar(el: HTMLElement) {
  const final = Number(el.dataset.contar);
  const sufijo = el.dataset.sufijo ?? "";
  if (!Number.isFinite(final) || final <= 0) return;
  const inicio = performance.now();
  const paso = (t: number) => {
    const p = Math.min(1, (t - inicio) / DURACION);
    const suave = 1 - Math.pow(1 - p, 3);
    el.textContent = `${formato.format(Math.round(final * suave))}${sufijo}`;
    if (p < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

enCadaPantalla(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document
    .querySelectorAll<HTMLElement>("[data-contar]")
    .forEach((el) => !el.closest(".quieto") && contar(el));
});
