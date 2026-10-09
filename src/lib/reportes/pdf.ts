/** Planilla oficial en PDF (carta, vertical). Se genera en el servidor. */
import { jsPDF } from "jspdf";
import { autoTable, type RowInput } from "jspdf-autotable";
import type { Planilla } from "./planilla";
import type { Institucion } from "./datos";

const COLUMNAS = [
  "N°",
  "NOMBRES Y APELLIDOS",
  "C.I.",
  "CARGA\nHORARIA",
  "CARGO",
  "HORA DE\nLLEGADA",
  "HORA DE\nSALIDA",
  "OBSERVACIÓN",
];

export function planillaPdf(p: Planilla, inst: Institucion, generado: string): ArrayBuffer {
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const ancho = doc.internal.pageSize.getWidth();
  const centro = ancho / 2;
  let y = 40;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const lineas = [
    ...inst.encabezado,
    inst.nombre,
    inst.ubicacion,
    inst.codDea ? `COD. DEA: ${inst.codDea}` : "",
  ].filter(Boolean);
  for (const l of lineas) {
    doc.text(l.toUpperCase(), centro, y, { align: "center" });
    y += 11;
  }

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(p.titulo, centro, y, { align: "center" });
  const anchoTitulo = doc.getTextWidth(p.titulo);
  doc.setLineWidth(0.8);
  doc.line(centro - anchoTitulo / 2, y + 2, centro + anchoTitulo / 2, y + 2);

  y += 18;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`DÍA: ${p.dia}`, ancho - 230, y);
  doc.text(`FECHA: ${p.fecha}`, ancho - 40, y, { align: "right" });

  const cuerpo: RowInput[] = [];
  p.grupos.forEach((g, i) => {
    if (i > 0)
      cuerpo.push([
        { content: "", colSpan: 8, styles: { minCellHeight: 8, fillColor: [255, 255, 255] } },
      ]);
    for (const f of g.filas) {
      cuerpo.push([f.n, f.nombre, f.cedula, f.carga, f.cargo, f.llegada, f.salida, f.observacion]);
    }
  });

  autoTable(doc, {
    startY: y + 8,
    head: [COLUMNAS],
    body: cuerpo,
    theme: "grid",
    margin: { left: 30, right: 30, bottom: 90 },
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.5,
      textColor: [0, 0, 0],
      valign: "middle",
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      halign: "center",
      fontSize: 7.5,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 24 },
      1: { cellWidth: 140 },
      2: { cellWidth: 66 },
      3: { halign: "center", cellWidth: 40 },
      4: { halign: "center", cellWidth: 70, fontSize: 7 },
      5: { halign: "center", cellWidth: 48 },
      6: { halign: "center", cellWidth: 48 },
      7: { fontSize: 7 },
    },
  });

  // Pie: firma de la dirección (al final) y numeración (todas las páginas)
  const altura = doc.internal.pageSize.getHeight();
  const paginas = doc.getNumberOfPages();
  const f = inst.firmante;
  doc.setPage(paginas);
  if (f.nombre) {
    const yf = altura - 70;
    doc.setLineWidth(0.6);
    doc.line(centro - 80, yf - 12, centro + 80, yf - 12);
    doc.setFontSize(10);
    doc.text(f.nombre, centro, yf, { align: "center" });
    if (f.cedula)
      doc.text(`V.- ${f.cedula.replace(/^V-?/i, "")}`, centro, yf + 12, { align: "center" });
    if (f.cargo) doc.text(f.cargo, centro, yf + 24, { align: "center" });
  }
  for (let i = 1; i <= paginas; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(110);
    doc.text(`Generado por GRU-system · ${generado}`, 30, altura - 18);
    doc.text(`Página ${i} de ${paginas}`, ancho - 30, altura - 18, { align: "right" });
    doc.setTextColor(0);
  }
  return doc.output("arraybuffer");
}
