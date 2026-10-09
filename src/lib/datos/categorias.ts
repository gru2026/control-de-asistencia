/** Lectura de categorías de personal. */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Categoria } from "@/types";

export const COLUMNAS_CATEGORIA = "id, nombre, planilla, color, jornada_sugerida_id, orden, activa";

export async function listarCategorias(
  sb: SupabaseClient,
  soloActivas = false,
): Promise<Categoria[]> {
  let q = sb.from("categorias").select(COLUMNAS_CATEGORIA).order("orden").order("nombre");
  if (soloActivas) q = q.eq("activa", true);
  const { data } = await q;
  return (data ?? []) as Categoria[];
}

/** Lee todas las filas de una consulta paginando de 1000 en 1000 (límite de PostgREST). */
export async function traerTodo<T>(
  consulta: (
    desde: number,
    hasta: number,
  ) => PromiseLike<{ data: unknown[] | null; error: unknown }>,
  tamano = 1000,
): Promise<T[]> {
  const out: T[] = [];
  for (let desde = 0; ; desde += tamano) {
    const { data, error } = await consulta(desde, desde + tamano - 1);
    if (error) throw error;
    out.push(...((data ?? []) as T[]));
    if (!data || data.length < tamano) return out;
  }
}
