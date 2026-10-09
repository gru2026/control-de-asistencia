import { describe, expect, it } from "vitest";
import { calendarioPeriodo, hoyPorCategoria, nivelAsistencia } from "@/lib/reglas/estadisticas";

describe("calendario del período", () => {
  // octubre 2026: el 1 es jueves
  const serie = [
    { clave: "2026-10-01", valor: 97, conteo: { total: 1, presente: 1, tarde: 0, falta: 0, permiso: 0 } },
    { clave: "2026-10-02", valor: 90, conteo: { total: 1, presente: 1, tarde: 0, falta: 0, permiso: 0 } },
    { clave: "2026-10-05", valor: 80, conteo: { total: 1, presente: 1, tarde: 0, falta: 0, permiso: 0 } },
  ];
  const sem = calendarioPeriodo("2026-10-01", "2026-10-09", serie, ["2026-10-06"], "2026-10-07");

  it("semanas de lunes a domingo, con huecos fuera del período", () => {
    expect(sem).toHaveLength(2);
    expect(sem.every((s) => s.length === 7)).toBe(true);
    expect(sem[0]!.slice(0, 3)).toEqual([null, null, null]);
    expect(sem[0]![3]!.fecha).toBe("2026-10-01");
    expect(sem[1]![6]).toBeNull();
  });
  it("niveles", () => {
    const n = Object.fromEntries(sem.flat().filter(Boolean).map((c) => [c!.dia, c!.nivel]));
    expect(n).toMatchObject({ 1: "alto", 2: "medio", 3: "no-laborable", 4: "no-laborable", 5: "bajo", 6: "no-laborable", 7: "sin-datos", 8: "futuro" });
  });
  it("umbrales", () => {
    expect([nivelAsistencia(95), nivelAsistencia(94.9), nivelAsistencia(85), nivelAsistencia(84.9)]).toEqual(["alto", "medio", "medio", "bajo"]);
  });
});

describe("hoy por categoría", () => {
  it("cuenta llegadas (presente o tarde) sobre esperados", () => {
    const r = hoyPorCategoria(
      [
        { personalId: "a", categoriaId: "doc" },
        { personalId: "b", categoriaId: "doc" },
        { personalId: "c", categoriaId: "coc" },
      ],
      [
        { personalId: "a", estado: "tarde" },
        { personalId: "b", estado: "permiso" },
        { personalId: "c", estado: "presente" },
        { personalId: "z", estado: "presente" },
      ],
    );
    expect(r).toEqual([
      { categoriaId: "doc", llegaron: 1, esperados: 2 },
      { categoriaId: "coc", llegaron: 1, esperados: 1 },
    ]);
  });
});
