/**
 * R4 · Permisos. Ver Documentacion/03-Diseno/Reglas-de-negocio.md
 */
import { fechaUTC } from "./tiempo";

export interface PermisoRango {
  id?: string;
  personalId: string;
  desde: string;
  hasta: string;
}

export type VigenciaPermiso = "proximo" | "vigente" | "pasado";

/** ¿Algún permiso de la persona cubre la fecha? */
export function permisoCubre(permisos: PermisoRango[], personalId: string, fecha: string): boolean {
  return permisos.some((p) => p.personalId === personalId && p.desde <= fecha && fecha <= p.hasta);
}

/** Primer permiso de la misma persona que se solapa con el nuevo (excluye el que se edita). */
export function permisoSolapado(
  nuevo: PermisoRango,
  existentes: PermisoRango[],
): PermisoRango | undefined {
  return existentes.find(
    (p) =>
      p.personalId === nuevo.personalId &&
      (nuevo.id === undefined || p.id !== nuevo.id) &&
      p.desde <= nuevo.hasta &&
      nuevo.desde <= p.hasta,
  );
}

export function vigenciaPermiso(desde: string, hasta: string, hoy: string): VigenciaPermiso {
  if (hoy < desde) return "proximo";
  if (hoy > hasta) return "pasado";
  return "vigente";
}

/** Días naturales que abarca el permiso (ambos extremos incluidos). */
export function diasDelPermiso(desde: string, hasta: string): number {
  return Math.round((fechaUTC(hasta).getTime() - fechaUTC(desde).getTime()) / 86_400_000) + 1;
}

export interface RegistroSinMarcar {
  fecha: string;
  estado: string;
  horaEntrada: string | null;
}

/** Faltas (sin entrada) dentro del rango que pasan a permiso al cargarlo (R4). */
export function faltasCubiertas(
  registros: RegistroSinMarcar[],
  desde: string,
  hasta: string,
): string[] {
  return registros
    .filter((r) => r.estado === "falta" && !r.horaEntrada && r.fecha >= desde && r.fecha <= hasta)
    .map((r) => r.fecha);
}

/**
 * Al eliminar o acortar un permiso: días que estaban como «permiso» sin entrada
 * y que ya no cubre ningún otro permiso → vuelven a «falta».
 */
export function permisosQueVuelvenAFalta(
  registros: RegistroSinMarcar[],
  personalId: string,
  restantes: PermisoRango[],
): string[] {
  return registros
    .filter(
      (r) =>
        r.estado === "permiso" && !r.horaEntrada && !permisoCubre(restantes, personalId, r.fecha),
    )
    .map((r) => r.fecha);
}
