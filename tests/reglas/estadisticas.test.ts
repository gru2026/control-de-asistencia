import { describe, expect, it } from "vitest";
import {
  histogramaLlegadas,
  personasCriticas,
  porCategoria,
  porDiaSemana,
  resumir,
  serieDiaria,
  variacion,
  type RegistroEstadistica,
} from "@/lib/reglas/estadisticas";

const r = (
  fecha: string,
  personalId: string,
  estado: RegistroEstadistica["estado"],
  diferenciaMin: number | null = null,
  categoriaId = "doc",
): RegistroEstadistica => ({
  fecha,
  personalId,
  categoriaId,
  estado,
  diferenciaMin,
  horas: estado === "falta" || estado === "permiso" ? null : 8,
});

// 2026-10-05 lunes, 2026-10-06 martes
const datos = [
  r("2026-10-05", "a", "presente", -5),
  r("2026-10-05", "b", "tarde", 20),
  r("2026-10-05", "c", "falta"),
  r("2026-10-05", "d", "permiso"),
  r("2026-10-06", "a", "presente", 3),
  r("2026-10-06", "b", "tarde", 40, "sec"),
  r("2026-10-06", "c", "falta"),
  r("2026-10-06", "d", "presente", 0),
];

describe("estadísticas del panel", () => {
  it("resumen general", () => {
    const s = resumir(datos);
    expect(s.conteo).toEqual({ total: 8, presente: 3, tarde: 2, falta: 2, permiso: 1 });
    expect(s.asistencia).toBe(75); // 6 de 8
    expect(s.puntualidad).toBe(60); // 3 de 5 llegadas
    expect(s.retrasoPromedioMin).toBe(30);
    expect(s.horasTotales).toBe(40);
    expect(s.personas).toBe(4);
  });
  it("sin datos no divide por cero", () => {
    const s = resumir([]);
    expect([s.asistencia, s.puntualidad, s.retrasoPromedioMin]).toEqual([0, 0, 0]);
  });
  it("serie diaria ordenada", () => {
    expect(serieDiaria([...datos].reverse()).map((p) => [p.clave, p.valor])).toEqual([
      ["2026-10-05", 75],
      ["2026-10-06", 75],
    ]);
  });
  it("por día de la semana", () => {
    const d = porDiaSemana(datos);
    expect(d.map((x) => x.dia)).toEqual([1, 2]);
    expect(d[0]).toMatchObject({ asistencia: 75, tardanza: 25, faltas: 1 });
  });
  it("histograma de llegadas por tramos", () => {
    const h = Object.fromEntries(histogramaLlegadas(datos).map((t) => [t.clave, t.valor]));
    expect(h).toMatchObject({ antes: 2, "0-5": 1, "6-15": 0, "16-30": 1, "31-60": 1, "60+": 0 });
  });
  it("por categoría", () => {
    const c = Object.fromEntries(porCategoria(datos).map((x) => [x.categoriaId, x]));
    expect(c.sec!.conteo.total).toBe(1);
    expect(c.doc!.personas).toBe(4);
  });
  it("personas críticas: faltas pesan doble", () => {
    expect(personasCriticas(datos).map((p) => p.personalId)).toEqual(["c", "b"]);
  });
  it("variación en puntos", () => {
    expect(variacion(80, 75.5)).toBe(4.5);
    expect(variacion(80, null)).toBeNull();
  });
});

import { hallazgos } from "@/lib/reglas/estadisticas";
import { rangoPeriodo } from "@/lib/datos/asistencia";

describe("hallazgos", () => {
  it("no opina con pocos datos", () => {
    expect(hallazgos(datos, () => "X")).toEqual([]);
  });
  it("detecta el día con menor asistencia y faltas acumuladas", () => {
    const muchos: RegistroEstadistica[] = [];
    // 4 semanas, 10 personas; los lunes faltan 3, el resto del tiempo todos presentes
    const lunes = ["2026-09-07", "2026-09-14", "2026-09-21", "2026-09-28"];
    const martes = lunes.map((l) =>
      l.replace(/(\d\d)$/, (d) => String(Number(d) + 1).padStart(2, "0")),
    );
    for (const f of [...lunes, ...martes]) {
      for (let p = 0; p < 10; p++) {
        const falta = lunes.includes(f) && p < 3;
        muchos.push(r(f, `p${p}`, falta ? "falta" : "presente", falta ? null : 0));
      }
    }
    // un tercer día para tener 3 días con datos
    for (let p = 0; p < 10; p++) muchos.push(r("2026-09-09", `p${p}`, "presente", 0));
    const h = hallazgos(muchos, () => "X");
    expect(h[0]).toMatch(/lunes/);
    expect(h.some((t) => /3 personas acumulan/.test(t))).toBe(true);
  });
});

describe("rangoPeriodo", () => {
  it("mes actual, mes anterior y 30 días con su período de comparación", () => {
    expect(rangoPeriodo("mes", "2026-10-08")).toMatchObject({
      desde: "2026-10-01",
      hasta: "2026-10-08",
      anterior: { desde: "2026-09-23", hasta: "2026-09-30" },
    });
    expect(rangoPeriodo("anterior", "2026-10-08")).toMatchObject({
      desde: "2026-09-01",
      hasta: "2026-09-30",
      etiqueta: "septiembre 2026",
    });
    expect(rangoPeriodo("30d", "2026-10-08")).toMatchObject({
      desde: "2026-09-09",
      hasta: "2026-10-08",
    });
  });
});

import { conclusiones } from "@/lib/reglas/estadisticas";

describe("conclusiones", () => {
  it("sin datos", () => {
    expect(conclusiones([], () => "X").tendencia).toBe("Sin datos en el período");
  });
  it("frases cortas a partir de los datos", () => {
    const regs: RegistroEstadistica[] = [];
    const lunes = ["2026-09-07", "2026-09-14", "2026-09-21", "2026-09-28"];
    for (const l of lunes) {
      const martes = l.replace(/(\d\d)$/, (d) => String(Number(d) + 1).padStart(2, "0"));
      for (let p = 0; p < 10; p++) {
        regs.push(
          r(l, `p${p}`, p < 3 ? "falta" : "presente", p < 3 ? null : 0, p < 5 ? "doc" : "vig"),
        );
        regs.push(
          r(
            martes,
            `p${p}`,
            p === 9 ? "tarde" : "presente",
            p === 9 ? 20 : 0,
            p < 5 ? "doc" : "vig",
          ),
        );
      }
    }
    const c = conclusiones(regs, (id) => (id === "vig" ? "Vigilancia" : "Docente"));
    expect(c.dias).toMatch(/^Los lunes, la más baja/);
    expect(c.personas).toBe("3 personas con 3 o más faltas");
    expect(c.llegadas).toMatch(/% a la hora · \d+ % tarde$/);
    expect(c.tendencia).toMatch(/promedio \d+ %$/);
  });
});
