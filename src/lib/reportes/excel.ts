/** Planilla oficial en Excel (.xlsx), lista para imprimir en tamaño carta. */
import ExcelJS from "exceljs";
import type { Planilla } from "./planilla";
import type { Institucion } from "./datos";

const COLUMNAS = [
  { titulo: "N°", ancho: 5 },
  { titulo: "NOMBRES Y APELLIDOS", ancho: 30 },
  { titulo: "C.I.", ancho: 13 },
  { titulo: "CARGA HORARIA", ancho: 9 },
  { titulo: "CARGO", ancho: 16 },
  { titulo: "HORA DE LLEGADA", ancho: 10 },
  { titulo: "HORA DE SALIDA", ancho: 10 },
  { titulo: "OBSERVACIÓN", ancho: 32 },
];

const borde: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

export async function planillaExcel(
  p: Planilla,
  inst: Institucion,
  generado: string,
): Promise<ArrayBuffer> {
  const libro = new ExcelJS.Workbook();
  libro.creator = "GRU-system";
  const hoja = libro.addWorksheet(p.titulo.slice(0, 31), {
    pageSetup: {
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.6, header: 0.3, footer: 0.3 },
    },
  });
  hoja.columns = COLUMNAS.map((c) => ({ width: c.ancho }));
  const n = COLUMNAS.length;

  const centrada = (texto: string, opciones: Partial<ExcelJS.Font> = {}) => {
    const fila = hoja.addRow([texto]);
    hoja.mergeCells(fila.number, 1, fila.number, n);
    fila.getCell(1).alignment = { horizontal: "center" };
    fila.getCell(1).font = { size: 9, ...opciones };
    return fila;
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
  centrada(p.titulo, { bold: true, size: 12, underline: true });
  const filaDia = hoja.addRow(["", "", "", "", "", `DÍA: ${p.dia}`, "", `FECHA: ${p.fecha}`]);
  filaDia.font = { size: 9, bold: true };
  hoja.addRow([]);

  const cabecera = hoja.addRow(COLUMNAS.map((c) => c.titulo));
  cabecera.height = 30;
  cabecera.eachCell((c) => {
    c.font = { bold: true, size: 8 };
    c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    c.border = borde;
  });
  hoja.views = [{ state: "frozen", ySplit: cabecera.number }];
  hoja.pageSetup.printTitlesRow = `${cabecera.number}:${cabecera.number}`;

  p.grupos.forEach((g, i) => {
    if (i > 0) {
      const sep = hoja.addRow([]);
      for (let c = 1; c <= n; c++) sep.getCell(c).border = borde;
    }
    for (const f of g.filas) {
      const fila = hoja.addRow([
        f.n,
        f.nombre,
        f.cedula,
        f.carga ? Number(f.carga) : "",
        f.cargo,
        f.llegada,
        f.salida,
        f.observacion,
      ]);
      fila.eachCell({ includeEmpty: true }, (c, col) => {
        c.border = borde;
        c.font = { size: 9 };
        c.alignment = {
          vertical: "middle",
          horizontal: [1, 4, 5, 6, 7].includes(col) ? "center" : "left",
          wrapText: col === 8,
        };
      });
    }
  });

  const f = inst.firmante;
  if (f.nombre) {
    hoja.addRow([]);
    hoja.addRow([]);
    centrada("______________________________");
    centrada(f.nombre, { size: 10 });
    if (f.cedula) centrada(`V.- ${f.cedula.replace(/^V-?/i, "")}`, { size: 10 });
    if (f.cargo) centrada(f.cargo, { size: 10 });
  }
  hoja.addRow([]);
  centrada(`Generado por GRU-system · ${generado}`, { size: 7, color: { argb: "FF6B7280" } });

  return (await libro.xlsx.writeBuffer()) as ArrayBuffer;
}
