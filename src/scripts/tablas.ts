/**
 * Tablas ordenables sin recargar (D-55): `<th><button class="ordenar">Columna</button></th>`.
 * Cada `<td>` puede traer `data-valor` (número o texto) para ordenar; si no, se usa su texto.
 */
document.addEventListener("click", (ev) => {
  const boton = (ev.target as HTMLElement).closest<HTMLButtonElement>("th .ordenar");
  if (!boton) return;
  const th = boton.closest("th")!;
  const tabla = th.closest("table");
  const cuerpo = tabla?.tBodies[0];
  if (!tabla || !cuerpo) return;
  const col = [...th.parentElement!.children].indexOf(th);
  const asc = th.getAttribute("aria-sort") !== "ascending";
  tabla.querySelectorAll("th[aria-sort]").forEach((x) => x.removeAttribute("aria-sort"));
  th.setAttribute("aria-sort", asc ? "ascending" : "descending");
  const valor = (tr: HTMLTableRowElement) => {
    const td = tr.cells[col];
    return td?.dataset.valor ?? td?.textContent?.trim() ?? "";
  };
  const filas = [...cuerpo.rows].sort((a, b) => {
    const x = valor(a);
    const y = valor(b);
    const nx = Number(x);
    const ny = Number(y);
    const r = x !== "" && y !== "" && !isNaN(nx) && !isNaN(ny) ? nx - ny : x.localeCompare(y, "es");
    return asc ? r : -r;
  });
  cuerpo.append(...filas);
});

// «Ver todos»: muestra el resto de una lista limitada (data-limitada)
document.addEventListener("click", (ev) => {
  const boton = (ev.target as HTMLElement).closest<HTMLButtonElement>(".ver-todos");
  const lista = boton?.previousElementSibling;
  if (!boton || !lista?.hasAttribute("data-limitada")) return;
  lista.classList.add("ver-todo");
});
