-- 001 · Esquema inicial
-- Fuente: Documentacion/03-Diseno/Modelo-de-datos.md

create extension if not exists pgcrypto;

-- ── usuarios (extiende auth.users) ─────────────────────────────
create table public.usuarios (
  id          uuid primary key references auth.users (id) on delete cascade,
  nombre      text not null,
  apellido    text not null,
  email       text not null,
  rol         text not null default 'personal'
              check (rol in ('directiva', 'secretaria', 'personal')),
  estado      text not null default 'activo' check (estado in ('activo', 'inactivo')),
  creado_en   timestamptz not null default now()
);

-- ── jornadas (plantillas configurables) ────────────────────────
create table public.jornadas (
  id               uuid primary key default gen_random_uuid(),
  nombre           text not null unique,
  hora_entrada     time not null,
  hora_salida      time not null,
  tolerancia_min   int  not null default 15 check (tolerancia_min >= 0),
  pausa_min        int  not null default 0  check (pausa_min >= 0),
  dias_laborables  int[] not null default '{1,2,3,4,5}'
                   check (dias_laborables <@ '{1,2,3,4,5,6,7}'::int[]),
  activa           bool not null default true,
  check (hora_salida > hora_entrada)
);

-- ── personal ───────────────────────────────────────────────────
create table public.personal (
  id                   uuid primary key default gen_random_uuid(),
  usuario_id           uuid unique references public.usuarios (id) on delete set null,
  nombre               text not null,
  apellido             text not null,
  cedula               text not null unique,
  cargo                text not null default 'docente'
                       check (cargo in ('docente', 'administrativo', 'otro')),
  telefono             text,
  jornada_id           uuid references public.jornadas (id),
  pin_hash             text,
  pin_intentos         int not null default 0,
  pin_bloqueado_hasta  timestamptz,
  fecha_ingreso        date,
  estado               text not null default 'activo' check (estado in ('activo', 'inactivo')),
  creado_en            timestamptz not null default now()
);

-- ── horarios (excepciones por persona y día) ───────────────────
create table public.horarios (
  id              uuid primary key default gen_random_uuid(),
  personal_id     uuid not null references public.personal (id) on delete cascade,
  dia_semana      int  not null check (dia_semana between 1 and 7),
  hora_entrada    time,
  hora_salida     time,
  tolerancia_min  int check (tolerancia_min >= 0),
  libre           bool not null default false,
  unique (personal_id, dia_semana),
  check (libre or (hora_entrada is not null and hora_salida is not null and hora_salida > hora_entrada))
);

-- ── configuracion (una sola fila) ──────────────────────────────
create table public.configuracion (
  id                    int primary key default 1 check (id = 1),
  nombre_institucion    text not null default 'U.E.E. General Rafael Urdaneta',
  colegio_lat           float8 check (colegio_lat between -90 and 90),
  colegio_lng           float8 check (colegio_lng between -180 and 180),
  radio_m               int not null default 150 check (radio_m > 0),
  precision_max_m       int not null default 100 check (precision_max_m > 0),
  geocerca_activa       bool not null default true,
  franja_entrada_desde  time,
  franja_entrada_hasta  time,
  franja_salida_desde   time,
  franja_salida_hasta   time,
  kiosco_pin_activo     bool not null default true,
  hora_cierre_diario    time not null default '18:00',
  zona_horaria          text not null default 'America/Caracas',
  actualizado_en        timestamptz not null default now(),
  actualizado_por       uuid references public.usuarios (id)
);

-- ── codigos_qr ─────────────────────────────────────────────────
create table public.codigos_qr (
  id             uuid primary key default gen_random_uuid(),
  token_hash     text not null unique,
  descripcion    text,
  activo         bool not null default true,
  vigente_hasta  date,
  creado_por     uuid references public.usuarios (id),
  creado_en      timestamptz not null default now(),
  revocado_en    timestamptz
);
-- Solo un QR activo a la vez
create unique index uq_un_qr_activo on public.codigos_qr (activo) where activo;

-- ── dispositivos ───────────────────────────────────────────────
create table public.dispositivos (
  id               uuid primary key default gen_random_uuid(),
  usuario_id       uuid not null references public.usuarios (id) on delete cascade,
  dispositivo_uid  text not null,
  tipo             text not null default 'celular' check (tipo in ('celular', 'kiosco')),
  descripcion      text,
  estado           text not null default 'pendiente'
                   check (estado in ('aprobado', 'pendiente', 'revocado')),
  aprobado_por     uuid references public.usuarios (id),
  creado_en        timestamptz not null default now(),
  aprobado_en      timestamptz,
  ultimo_uso       timestamptz,
  unique (usuario_id, dispositivo_uid)
);
-- Máximo un celular aprobado por usuario
create unique index uq_un_celular_aprobado
  on public.dispositivos (usuario_id) where estado = 'aprobado' and tipo = 'celular';

-- ── registros_asistencia ───────────────────────────────────────
create table public.registros_asistencia (
  id                      uuid primary key default gen_random_uuid(),
  personal_id             uuid not null references public.personal (id),
  fecha                   date not null,
  hora_entrada            timestamptz,
  hora_salida             timestamptz,
  -- copia de la regla aplicada (los cambios de configuración no alteran el pasado)
  hora_esperada_entrada   time,
  hora_esperada_salida    time,
  tolerancia_aplicada     int,
  pausa_aplicada          int,
  estado                  text not null check (estado in ('presente', 'tarde', 'falta', 'permiso')),
  horas_trabajadas        numeric(5, 2),
  salida_no_registrada    bool not null default false,
  -- evidencia de entrada
  entrada_metodo          text check (entrada_metodo in ('qr', 'asistido', 'kiosco', 'manual')),
  entrada_lat             float8,
  entrada_lng             float8,
  entrada_precision_m     int,
  entrada_qr_id           uuid references public.codigos_qr (id),
  entrada_dispositivo_id  uuid references public.dispositivos (id),
  -- evidencia de salida
  salida_metodo           text check (salida_metodo in ('qr', 'asistido', 'kiosco', 'manual')),
  salida_lat              float8,
  salida_lng              float8,
  salida_precision_m      int,
  salida_qr_id            uuid references public.codigos_qr (id),
  salida_dispositivo_id   uuid references public.dispositivos (id),
  -- revisión
  senalado                bool not null default false,
  motivo_senal            text,
  revisado_por            uuid references public.usuarios (id),
  observacion             text,
  registrado_por          uuid references public.usuarios (id),
  creado_en               timestamptz not null default now(),
  actualizado_en          timestamptz not null default now(),
  unique (personal_id, fecha),
  check (hora_salida is null or hora_entrada is not null),
  check (hora_salida is null or hora_salida >= hora_entrada)
);

-- ── permisos ───────────────────────────────────────────────────
create table public.permisos (
  id           uuid primary key default gen_random_uuid(),
  personal_id  uuid not null references public.personal (id),
  fecha_desde  date not null,
  fecha_hasta  date not null,
  motivo       text not null,
  observacion  text,
  creado_por   uuid references public.usuarios (id),
  creado_en    timestamptz not null default now(),
  check (fecha_hasta >= fecha_desde)
);

-- ── notificaciones ─────────────────────────────────────────────
create table public.notificaciones (
  id               uuid primary key default gen_random_uuid(),
  usuario_destino  uuid not null references public.usuarios (id) on delete cascade,
  tipo             text not null check (tipo in ('falta', 'tarde', 'senalado', 'dispositivo', 'sistema')),
  mensaje          text not null,
  enlace           text,
  leida            bool not null default false,
  fecha            timestamptz not null default now()
);

-- ── feriados ───────────────────────────────────────────────────
create table public.feriados (
  id           uuid primary key default gen_random_uuid(),
  fecha        date not null unique,
  descripcion  text not null
);

-- ── índices ────────────────────────────────────────────────────
create index idx_asistencia_fecha     on public.registros_asistencia (fecha);
create index idx_asistencia_senalado  on public.registros_asistencia (senalado) where senalado;
create index idx_permisos_personal    on public.permisos (personal_id, fecha_desde, fecha_hasta);
create index idx_dispositivos_usuario on public.dispositivos (usuario_id, estado);
create index idx_notif_destino        on public.notificaciones (usuario_destino, leida);
create index idx_personal_jornada     on public.personal (jornada_id);
