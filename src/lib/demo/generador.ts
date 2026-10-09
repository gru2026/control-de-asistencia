/**
 * Generador de asistencia de DEMOSTRACIÓN (determinista, puro).
 * Produce registros con patrones realistas para mostrar el comportamiento del panel:
 * más faltas los lunes, algunas personas con tardanza frecuente, permisos ocasionales.
 * Todos los registros llevan es_demo = true y se eliminan desde Configuración.
 */
import type { EstadoAsistencia, ExcepcionHorario, Jornada, MetodoMarcacion } from "@/types";
import { resolverJornada } from "@/lib/reglas/jornada";
import { estadoAlMarcarEntrada } from "@/lib/reglas/estados";
import { horasTrabajadas } from "@/lib/reglas/calculoHoras";
import {
  diaSemanaISO,
  horaAMinutos,
  instanteLocal,
  minutosAHora,
  rangoFechas,
} from "@/lib/reglas/tiempo";

export interface PersonaDemo {
  id: string;
  jornada: Jornada | null;
  excepciones?: ExcepcionHorario[];
}

export interface OpcionesDemo {
  desde: string;
  hasta: string; // normalmente "hoy"
  feriados?: string[];
  semilla?: number;
  /** Minutos locales "ahora" (para el día `hasta`): no se generan marcas futuras. */
  ahoraMin?: number;
  registradoPor?: string | null;
}

export interface RegistroDemo {
  personal_id: string;
  fecha: string;
  hora_entrada: string | null;
  hora_salida: string | null;
  hora_esperada_entrada: string;
  hora_esperada_salida: string;
  tolerancia_aplicada: number;
  pausa_aplicada: number;
  estado: EstadoAsistencia;
  horas_trabajadas: number | null;
  entrada_metodo: MetodoMarcacion | null;
  salida_metodo: MetodoMarcacion | null;
  senalado: boolean;
  motivo_senal: string | null;
  observacion: string | null;
  registrado_por: string | null;
  es_demo: true;
}

export interface PermisoDemo {
  personal_id: string;
  fecha_desde: string;
  fecha_hasta: string;
  motivo: string;
  es_demo: true;
}

/** PRNG determinista (mulberry32). */
export function crearAzar(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MOTIVOS = ["Reposo médico", "Diligencia personal", "Comisión de servicio", "Cita médica"];

export function generarAsistenciaDemo(personas: PersonaDemo[], o: OpcionesDemo) {
  const azar = crearAzar(o.semilla ?? 20261008);
  const entre = (min: number, max: number) => Math.round(min + azar() * (max - min));
  const fechas = rangoFechas(o.desde, o.hasta);
  const registros: RegistroDemo[] = [];
  const permisos: PermisoDemo[] = [];

  for (const p of personas) {
    // Perfil estable por persona: ~20 % con tardanza frecuente, ~10 % con más ausencias.
    const tardona = azar() < 0.2;
    const ausente = azar() < 0.1;
    let diasPermiso = 0;

    for (const fecha of fechas) {
      const regla = resolverJornada({
        fecha,
        jornada: p.jornada,
        excepciones: p.excepciones,
        feriados: o.feriados,
      });
      if (!regla) continue;

      const esHoy = fecha === o.hasta;
      const entradaEsp = horaAMinutos(regla.horaEntrada);
      let salidaEsp = horaAMinutos(regla.horaSalida);
      if (regla.nocturna) salidaEsp += 1440;

      const base = {
        personal_id: p.id,
        fecha,
        hora_esperada_entrada: regla.horaEntrada,
        hora_esperada_salida: regla.horaSalida,
        tolerancia_aplicada: regla.toleranciaMin,
        pausa_aplicada: regla.pausaMin,
        registrado_por: null,
        es_demo: true as const,
      };

      // Permisos en bloque (1–3 días)
      if (diasPermiso > 0 || (!esHoy && azar() < 0.012)) {
        if (diasPermiso === 0) {
          diasPermiso = entre(1, 3);
          permisos.push({
            personal_id: p.id,
            fecha_desde: fecha,
            fecha_hasta: fecha,
            motivo: MOTIVOS[entre(0, MOTIVOS.length - 1)]!,
            es_demo: true,
          });
        }
        permisos[permisos.length - 1]!.fecha_hasta = fecha;
        diasPermiso--;
        registros.push({
          ...base,
          hora_entrada: null,
          hora_salida: null,
          estado: "permiso",
          horas_trabajadas: null,
          entrada_metodo: null,
          salida_metodo: null,
          senalado: false,
          motivo_senal: null,
          observacion: permisos[permisos.length - 1]!.motivo,
        });
        continue;
      }

      // Hoy: quien aún no debía llegar, o un 12 % que todavía no marca, queda pendiente.
      if (esHoy && (o.ahoraMin === undefined || o.ahoraMin < entradaEsp || azar() < 0.12)) continue;

      const probFalta = (diaSemanaISO(fecha) === 1 ? 0.09 : 0.03) + (ausente ? 0.08 : 0);
      if (!esHoy && azar() < probFalta) {
        registros.push({
          ...base,
          hora_entrada: null,
          hora_salida: null,
          estado: "falta",
          horas_trabajadas: null,
          entrada_metodo: null,
          salida_metodo: null,
          senalado: false,
          motivo_senal: null,
          observacion: null,
        });
        continue;
      }

      const tarde = azar() < (tardona ? 0.4 : 0.07);
      const llegada = tarde
        ? entradaEsp + regla.toleranciaMin + entre(1, azar() < 0.8 ? 25 : 70)
        : entradaEsp + entre(-20, regla.toleranciaMin);
      if (esHoy && o.ahoraMin !== undefined && llegada > o.ahoraMin) continue;

      const salida = salidaEsp + entre(-10, 25);
      const salidaOcurrio = !esHoy || (o.ahoraMin !== undefined && salida <= o.ahoraMin);
      const entradaInst = instanteLocal(fecha, llegada);
      const salidaInst = salidaOcurrio ? instanteLocal(fecha, salida) : null;

      const r = azar();
      const metodo: MetodoMarcacion = r < 0.9 ? "qr" : r < 0.96 ? "asistido" : "kiosco";
      const senalado = metodo === "qr" && azar() < 0.03;
      const estado = estadoAlMarcarEntrada(
        minutosAHora(llegada),
        regla.horaEntrada,
        regla.toleranciaMin,
      );

      registros.push({
        ...base,
        hora_entrada: entradaInst.toISOString(),
        hora_salida: salidaInst?.toISOString() ?? null,
        estado,
        horas_trabajadas: salidaInst
          ? horasTrabajadas(entradaInst, salidaInst, regla.pausaMin)
          : null,
        entrada_metodo: metodo,
        salida_metodo: salidaInst ? metodo : null,
        senalado,
        motivo_senal: senalado ? `Precisión GPS baja (${entre(110, 220)} m)` : null,
        observacion: metodo === "asistido" ? "Registrado por secretaría" : null,
        registrado_por: metodo === "qr" ? null : (o.registradoPor ?? null),
      });
    }
  }
  return { registros, permisos };
}
