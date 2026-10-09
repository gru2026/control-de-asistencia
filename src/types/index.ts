/** Tipos compartidos del dominio. Ver Documentacion/03-Diseno/Modelo-de-datos.md */

export type Rol = "directiva" | "secretaria" | "personal";
export type Vinculo = "fijo" | "contratado" | "suplente";
export type EstadoAsistencia = "presente" | "tarde" | "falta" | "permiso";
export type MetodoMarcacion = "qr" | "asistido" | "kiosco" | "manual";
export type EstadoDispositivo = "aprobado" | "pendiente" | "revocado";

/** Día de la semana ISO: 1 = lunes … 7 = domingo. */
export type DiaSemana = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Hora del día en formato "HH:MM" (24 h). */
export type HoraTexto = string;

export const ROLES: readonly Rol[] = ["directiva", "secretaria", "personal"];
export const VINCULOS: readonly Vinculo[] = ["fijo", "contratado", "suplente"];

export const NOMBRE_ROL: Record<Rol, string> = {
  directiva: "Directiva",
  secretaria: "Secretaría",
  personal: "Personal",
};

export const NOMBRE_VINCULO: Record<Vinculo, string> = {
  fijo: "Fijo",
  contratado: "Contratado",
  suplente: "Suplente",
};

export const NOMBRE_ESTADO: Record<EstadoAsistencia, string> = {
  presente: "Presente",
  tarde: "Tarde",
  falta: "Falta",
  permiso: "Permiso",
};

/** Categoría de personal (oficio). Configurable por la directiva. */
export interface Categoria {
  id: string;
  nombre: string;
  planilla: "docentes" | "personal";
  color: string;
  jornada_sugerida_id: string | null;
  orden: number;
  activa: boolean;
}

export const NOMBRE_DIA: Record<DiaSemana, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

/** Usuario autenticado (fila de public.usuarios). */
export interface Perfil {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  estado: "activo" | "inactivo";
}

export interface Jornada {
  horaEntrada: HoraTexto;
  horaSalida: HoraTexto;
  toleranciaMin: number;
  pausaMin: number;
  diasLaborables: DiaSemana[];
  /** La salida ocurre al día siguiente (cruza la medianoche). */
  nocturna?: boolean;
}

export interface ExcepcionHorario {
  diaSemana: DiaSemana;
  horaEntrada: HoraTexto;
  horaSalida: HoraTexto;
  /** null = usar la tolerancia de la jornada. */
  toleranciaMin: number | null;
  libre: boolean;
}

/** Regla efectiva de un día concreto (se copia en el registro al marcar). */
export interface ReglaDelDia {
  horaEntrada: HoraTexto;
  horaSalida: HoraTexto;
  toleranciaMin: number;
  pausaMin: number;
  nocturna: boolean;
}
