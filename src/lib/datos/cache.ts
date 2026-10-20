/**
 * Caché en memoria por instancia del servidor (D-47). Cada consulta a Supabase
 * cuesta ~70 ms; los datos que casi no cambian (perfil, categorías) se reutilizan
 * unos segundos. Otra instancia puede tardar hasta `ttl` en ver un cambio.
 */
const almacen = new Map<string, { valor: unknown; vence: number }>();

export async function conCache<T>(
  clave: string,
  ttlMs: number,
  cargar: () => Promise<T>,
): Promise<T> {
  const ahora = Date.now();
  const guardado = almacen.get(clave);
  if (guardado && guardado.vence > ahora) return guardado.valor as T;
  const valor = await cargar();
  almacen.set(clave, { valor, vence: ahora + ttlMs });
  return valor;
}

export function guardarEnCache(clave: string, valor: unknown, ttlMs: number): void {
  almacen.set(clave, { valor, vence: Date.now() + ttlMs });
}

export function leerCache<T>(clave: string): T | undefined {
  const g = almacen.get(clave);
  return g && g.vence > Date.now() ? (g.valor as T) : undefined;
}

/** Descarta las entradas cuya clave empieza con el prefijo (tras guardar cambios). */
export function olvidar(prefijo: string): void {
  for (const k of almacen.keys()) if (k.startsWith(prefijo)) almacen.delete(k);
}
