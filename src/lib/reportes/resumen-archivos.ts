/** Resumen del período en PDF (carta horizontal) y Excel. Se generan en el servidor. */
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import ExcelJS from "exceljs";
import type { Institucion } from "./datos";
import type { Resumen } from "./resumen";
import { encabezadoPdf, piePdf } from "./pdf";
import { fechaCorta } from "@/lib/fecha";

const COLUMNAS = [
  "N°",
  "NOMBRES Y APELLIDOS",
  "C.I.",
  "CATEGORÍA",
  "DÍAS\nLABORABLES",
  "PRESENTE",
  "TARDE",
  "FALTA",
  "PERMISO",
  "SIN\nREGISTRO",
  "% ASIST.",
  "HORAS",
  "EN\nSECRETARÍA",
];

const decimal = (n: number, d = 1) => n.toFixed(d).replace(".", ",");

function filas(r: Resumen, categoria: (id: string) => string) {
  return r.filas.map((f, i) => [
    i + 1,
    f.nombre,
    f.cedula,
    categoria(f.categoriaId),
    f.diasLaborables,
    f.presentes,
    f.tardanzas,
    f.faltas,
    f.permisos,
    f.sinRegistro,
    f.diasLaborables ? `${Math.round(f.porcentajeAsistencia)} %` : "—",
    decimal(f.totalHoras),
    f.marcacionesPc,
  ]);
}

function filaTotales(r: Resumen) {
  const t = r.totales;
  return [
    "",
    "TOTAL",
    "",
    "",
    t.diasLaborables,
    t.presentes,
    t.tardanzas,
    t.faltas,
    t.permisos,
    t.sinRegistro,
    t.diasLaborables ? `${Math.round(t.porcentajeAsistencia)} %` : "—",
    decimal(t.totalHoras),
    t.marcacionesPc,
  ];
}

export const periodoTexto = (r: Resumen) => `DEL ${fechaCorta(r.desde)} AL ${fechaCorta(r.hasta)}`;

export function resumenPdf(
  r: Resumen,
  inst: Institucion,
  titulo: string,
  categoria: (id: string) => string,
  generado: string,
): ArrayBuffer {
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "landscape" });
  const ancho = doc.internal.pageSize.getWidth();
  let y = encabezadoPdf(doc, inst, titulo);
  y += 18;
  doc.setFontSize(9);
  doc.text(`PERÍODO: ${periodoTexto(r)}`, ancho - 30, y, { align: "right" });

  autoTable(doc, {
    startY: y + 8,
    head: [COLUMNAS],
    body: filas(r, categoria),
    foot: [filaTotales(r)],
    showFoot: "lastPage",
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
      halign: "center",
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      fontSize: 7,
    },
    footStyles: { fillColor: [241, 245, 249], textColor: [0, 0, 0], fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 24 },
      1: { halign: "left", cellWidth: 170 },
      2: { cellWidth: 66 },
      3: { cellWidth: 70, fontSize: 7 },
    },
  });
  piePdf(doc, inst, generado);
  return doc.output("arraybuffer");
}

const borde: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

export async function resumenExcel(
  r: Resumen,
  inst: Institucion,
  titulo: string,
  categoria: (id: string) => string,
  generado: string,
): Promise<ArrayBuffer> {
  const libro = new ExcelJS.Workbook();
  libro.creator = "GRU-system";
  const hoja = libro.addWorksheet("Resumen", {
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  hoja.columns = [5, 32, 13, 14, 11, 10, 8, 8, 9, 10, 9, 9, 11].map((width) => ({ width }));
  const n = COLUMNAS.length;
  const centrada = (texto: string, fuente: Partial<ExcelJS.Font> = {}) => {
    const fila = hoja.addRow([texto]);
    hoja.mergeCells(fila.number, 1, fila.number, n);
    fila.getCell(1).alignment = { horizontal: "center" };
    fila.getCell(1).font = { size: 9, ...fuente };
  };
  for (const l of [
    ...inst.encabezado,
    inst.nombre,
    inst.ubicacion,
    inst.codDea ? `COD. DEA: ${inst.codDea}` : "",
  ].filter(Boolean)) {
    centrada(l.toUpperCase());
  }
  hoja.addRow([]);
  centrada(titulo, { bold: true, size: 12, underline: true });
  centrada(`PERÍODO: ${periodoTexto(r)}`, { bold: true });
  hoja.addRow([]);

  const cabecera = hoja.addRow(COLUMNAS.map((c) => c.replace("\n", " ")));
  cabecera.height = 30;
  cabecera.eachCell((c) => {
    c.font = { bold: true, size: 8 };
    c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    c.border = borde;
  });
  hoja.views = [{ state: "frozen", ySplit: cabecera.number }];
  const estilo = (fila: ExcelJS.Row, negrita = false) =>
    fila.eachCell({ includeEmpty: true }, (c, col) => {
      c.border = borde;
      c.font = { size: 9, bold: negrita };
      c.alignment = { vertical: "middle", horizontal: col === 2 ? "left" : "center" };
    });
  // En Excel van números (no texto) para que se puedan sumar u ordenar.
  r.filas.forEach((f, i) =>
    estilo(
      hoja.addRow([
        i + 1,
        f.nombre,
        f.cedula,
        categoria(f.categoriaId),
        f.diasLaborables,
        f.presentes,
        f.tardanzas,
        f.faltas,
        f.permisos,
        f.sinRegistro,
        f.diasLaborables ? f.porcentajeAsistencia / 100 : null,
        f.totalHoras,
        f.marcacionesPc,
      ]),
    ),
  );
  const t = r.totales;
  estilo(
    hoja.addRow([
      "",
      "TOTAL",
      "",
      "",
      t.diasLaborables,
      t.presentes,
      t.tardanzas,
      t.faltas,
      t.permisos,
      t.sinRegistro,
      t.diasLaborables ? t.porcentajeAsistencia / 100 : null,
      t.totalHoras,
      t.marcacionesPc,
    ]),
    true,
  );
  hoja.getColumn(11).numFmt = "0%";
  hoja.getColumn(12).numFmt = "0.0";
  hoja.addRow([]);
  centrada(`Generado por GRU-system · ${generado}`, { size: 7, color: { argb: "FF6B7280" } });
  return (await libro.xlsx.writeBuffer()) as ArrayBuffer;
}
