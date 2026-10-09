/**
 * Reglas de acceso por ruta y rol (lógica pura, probada en tests/auth).
 * Ver Documentacion/03-Diseno/Mapa-de-pantallas.md y Roles-y-permisos.md
 */
import type { Rol } from "@/types";

const ADMIN: Rol[] = ["directiva", "secretaria"];
const TODOS: Rol[] = ["directiva", "secretaria", "personal"];

/** Rutas públicas (no requieren sesión). */
const PUBLICAS = ["/login"];

/** Orden: de lo más específico a lo más general. */
const REGLAS: ReadonlyArray<readonly [string, Rol[]]> = [
  ["/configuracion", ["directiva"]],
  ["/jornadas", ["directiva"]],
  ["/personal/nuevo", ["directiva"]],
  ["/personal/importar", ["directiva"]],
  ["/personal", ADMIN],
  ["/permisos", ADMIN],
  ["/panel", ADMIN],
  ["/asistencia/registro", ADMIN],
  ["/asistencia/revision", ADMIN],
  ["/reportes", ADMIN],
  ["/asistencia", TODOS],
  ["/historial", TODOS],
  ["/notificaciones", TODOS],
];

export type DecisionAcceso =
  | { tipo: "permitir" }
  | { tipo: "login" }
  | { tipo: "prohibido" }
  | { tipo: "redirigir"; destino: string };

const coincide = (ruta: string, prefijo: string) =>
  ruta === prefijo || ruta.startsWith(prefijo + "/");

/** Página de inicio de cada rol. */
export function inicioPorRol(rol: Rol): string {
  return rol === "personal" ? "/asistencia" : "/panel";
}

/** Roles que pueden ver una ruta (null = pública). */
export function rolesDeRuta(ruta: string): Rol[] | null {
  if (PUBLICAS.some((p) => coincide(ruta, p))) return null;
  return REGLAS.find(([p]) => coincide(ruta, p))?.[1] ?? TODOS;
}

export function puedeVer(ruta: string, rol: Rol): boolean {
  const roles = rolesDeRuta(ruta);
  return roles === null || roles.includes(rol);
}

export function decidirAcceso(ruta: string, rol: Rol | null): DecisionAcceso {
  if (ruta === "/")
    return rol ? { tipo: "redirigir", destino: inicioPorRol(rol) } : { tipo: "login" };

  const roles = rolesDeRuta(ruta);
  if (roles === null) {
    // Usuario ya autenticado que abre /login → a su inicio
    return rol && coincide(ruta, "/login")
      ? { tipo: "redirigir", destino: inicioPorRol(rol) }
      : { tipo: "permitir" };
  }
  if (!rol) return { tipo: "login" };
  return roles.includes(rol) ? { tipo: "permitir" } : { tipo: "prohibido" };
}

/** Valida el parámetro ?volver= para evitar redirecciones abiertas. */
export function destinoSeguro(volver: string | null, rol: Rol): string {
  if (
    volver &&
    volver.startsWith("/") &&
    !volver.startsWith("//") &&
    !volver.includes("\\") &&
    !coincide(volver.split("?")[0] ?? "", "/login") &&
    puedeVer(volver.split("?")[0] ?? "", rol)
  ) {
    return volver;
  }
  return inicioPorRol(rol);
}
