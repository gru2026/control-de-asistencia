/**
 * R7 (duplicados y orden), R10 (ubicación y franja) y fecha de la marcación.
 * Ver Documentacion/03-Diseno/Reglas-de-negocio.md
 */
import type { EstadoAsistencia, ReglaDelDia } from "@/types";
import { evaluarGeocerca, type Coordenada } from "./geocerca";
import { horaAMinutos, horaEnZona, sumarDias } from "./tiempo";

export type TipoMarcacion = "entrada" | "salida";

/** Registro del día tal como importa para decidir la siguiente marcación. */
export interface RegistroDelDia {
  horaEntrada: string | null;
  horaSalida: string | null;
  estado: EstadoAsistencia;
  /** Los datos de demostración no bloquean una marcación real. */
  esDemo?: boolean;
}

export type Siguiente = TipoMarcacion | "completa" | "cerrada";

/** Qué le toca marcar a la persona con el registro actual del día. */
export function siguienteMarcacion(reg: RegistroDelDia | null | undefined): Siguiente {
  if (!reg || reg.esDemo) return "entrada";
  if (!reg.horaEntrada) return "cerrada";
  return reg.horaSalida ? "completa" : "salida";
}

/** R7 · Devuelve el mensaje de rechazo, o null si la marcación es válida. */
export function validarOrden(
  tipo: TipoMarcacion,
  reg: RegistroDelDia | null | undefined,
): string | null {
  const real = reg && !reg.esDemo ? reg : null;
  if (tipo === "entrada") {
    if (!real) return null;
    if (real.horaEntrada) {
      return `Ya registró su entrada hoy a las ${horaEnZona(real.horaEntrada)}.`;
    }
    return `El día ya quedó cerrado como ${real.estado}. Diríjase a secretaría.`;
  }
  if (!real?.horaEntrada) return "Primero debe marcar la entrada.";
  if (real.horaSalida) return `Ya registró su salida hoy a las ${horaEnZona(real.horaSalida)}.`;
  return null;
}

/**
 * Franja horaria opcional. Sin límites configurados, siempre se permite.
 * Admite franjas que cruzan la medianoche (desde > hasta).
 */
export function dentroDeFranja(
  minutos: number,
  desde: string | null | undefined,
  hasta: string | null | undefined,
): boolean {
  if (!desde || !hasta) return true;
  const d = horaAMinutos(desde);
  const h = horaAMinutos(hasta);
  return d <= h ? minutos >= d && minutos <= h : minutos >= d || minutos <= h;
}

/** Lugar donde se permite marcar: el colegio o una ubicación de prueba. */
export interface PuntoPermitido {
  nombre: string;
  centro: Coordenada;
  radioM: number;
  esPrueba: boolean;
}

export type ResultadoUbicacion =
  | {
      permitido: true;
      punto: PuntoPermitido;
      distanciaM: number;
      senalado: boolean;
      motivo: string | null;
    }
  | { permitido: false; distanciaM: number | null; motivo: string };

/** "350 m" · "1,2 km" */
export function textoDistancia(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  const km = m / 1000;
  return `${(km < 10 ? km.toFixed(1) : Math.round(km).toString()).replace(".", ",")} km`;
}

/**
 * R10 pasos 6–8 con varias ubicaciones permitidas. Elige la más cercana que
 * contenga la posición. Marcar en una ubicación de prueba siempre queda señalado.
 */
export function evaluarUbicacion(
  posicion: (Coordenada & { precisionM: number }) | null | undefined,
  puntos: PuntoPermitido[],
  precisionMaxM: number,
): ResultadoUbicacion {
  if (!posicion)
    return { permitido: false, distanciaM: null, motivo: "Active la ubicación para marcar." };
  if (puntos.length === 0) {
    return {
      permitido: false,
      distanciaM: null,
      motivo: "La ubicación del colegio no está configurada. Avise a la directiva.",
    };
  }

  let mejor: Extract<ResultadoUbicacion, { permitido: true }> | null = null;
  let masCerca: number | null = null;
  for (const punto of puntos) {
    const r = evaluarGeocerca(posicion, {
      centro: punto.centro,
      radioM: punto.radioM,
      precisionMaxM,
    });
    if (r.distanciaM === null)
      return { permitido: false, distanciaM: null, motivo: "Ubicación no válida." };
    if (masCerca === null || r.distanciaM < masCerca) masCerca = r.distanciaM;
    if (r.permitido && (!mejor || r.distanciaM < mejor.distanciaM)) {
      const motivos = [
        punto.esPrueba ? `Ubicación de prueba: ${punto.nombre}` : null,
        r.motivo,
      ].filter(Boolean);
      mejor = {
        permitido: true,
        punto,
        distanciaM: r.distanciaM,
        senalado: punto.esPrueba || r.senalado,
        motivo: motivos.length ? motivos.join(" · ") : null,
      };
    }
  }
  if (mejor) return mejor;
  return {
    permitido: false,
    distanciaM: masCerca,
    motivo: `Debe estar en el colegio para marcar. Está a ${textoDistancia(masCerca ?? 0)}.`,
  };
}

/**
 * Día al que pertenece una marcación. De madrugada, si ayer empezó una jornada
 * nocturna que aún no está completa, la marcación es de ayer.
 */
export function fechaDeMarcacion(p: {
  fechaLocal: string;
  minutosLocales: number;
  reglaAyer: ReglaDelDia | null;
  registroAyer: RegistroDelDia | null;
  limiteMadrugada?: number;
}): string {
  const limite = p.limiteMadrugada ?? 12 * 60;
  if (!p.reglaAyer?.nocturna || p.minutosLocales >= limite) return p.fechaLocal;
  const sig = siguienteMarcacion(p.registroAyer);
  return sig === "entrada" || sig === "salida" ? sumarDias(p.fechaLocal, -1) : p.fechaLocal;
}
