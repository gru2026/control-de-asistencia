-- 005 · Categorías de personal, vínculo, carga horaria, jornadas nocturnas,
--       datos de demostración y datos institucionales para la planilla oficial.
-- Decisiones: D-23 (categoría + vínculo), D-24 (jornada nocturna), D-25 (planilla oficial).

-- ── Jornadas nocturnas (cruzan la medianoche) ──────────────────
alter table public.jornadas add column nocturna bool not null default false;
alter table public.jornadas drop constraint jornadas_check;
alter table public.jornadas add constraint jornadas_horas_check check (
  (not nocturna and hora_salida > hora_entrada) or (nocturna and hora_salida < hora_entrada)
);

-- Jornadas de referencia (configurables desde /jornadas)
insert into public.jornadas (nombre, hora_entrada, hora_salida, tolerancia_min, pausa_min, dias_laborables, nocturna) values
  ('Docente tiempo completo', '07:00', '15:30', 15, 60, '{1,2,3,4,5}', false),
  ('Docente medio tiempo',    '07:00', '12:00', 15,  0, '{1,2,3,4,5}', false),
  ('Personal 40 h',           '07:00', '16:00', 15, 60, '{1,2,3,4,5}', false),
  ('Cocina',                  '06:00', '15:00', 10, 60, '{1,2,3,4,5}', false),
  ('Vigilancia diurna',       '06:00', '14:00', 10,  0, '{1,2,3,4,5}', false),
  ('Vigilancia nocturna',     '22:00', '06:00', 10,  0, '{7,1,2,3,4}', true)
on conflict (nombre) do nothing;

-- ── Categorías (oficio) ────────────────────────────────────────
create table public.categorias (
  id                   uuid primary key default gen_random_uuid(),
  nombre               text not null unique,
  planilla             text not null default 'personal' check (planilla in ('docentes', 'personal')),
  color                text not null default '#64748b' check (color ~ '^#[0-9a-fA-F]{6}$'),
  jornada_sugerida_id  uuid references public.jornadas (id) on delete set null,
  orden                int not null default 0,
  activa               bool not null default true
);

insert into public.categorias (nombre, planilla, color, orden, jornada_sugerida_id) values
  ('Docente',    'docentes', '#2563eb', 1, (select id from public.jornadas where nombre = 'Docente tiempo completo')),
  ('Secretaría', 'personal', '#7c3aed', 2, (select id from public.jornadas where nombre = 'Personal 40 h')),
  ('Cocina',     'personal', '#db2777', 3, (select id from public.jornadas where nombre = 'Cocina')),
  ('Obrero',     'personal', '#0891b2', 4, (select id from public.jornadas where nombre = 'Personal 40 h')),
  ('Vigilancia', 'personal', '#ca8a04', 5, (select id from public.jornadas where nombre = 'Vigilancia diurna')),
  ('Otro',       'personal', '#64748b', 9, null);

alter table public.categorias enable row level security;
create policy categorias_select on public.categorias for select to authenticated using (true);
create policy categorias_write on public.categorias for all to authenticated
  using (public.rol_actual() = 'directiva') with check (public.rol_actual() = 'directiva');

-- ── Personal: categoría, vínculo, carga horaria, origen ────────
alter table public.personal
  add column categoria_id  uuid references public.categorias (id),
  add column vinculo       text not null default 'fijo' check (vinculo in ('fijo', 'contratado', 'suplente')),
  add column carga_horaria int check (carga_horaria between 1 and 80),
  add column origen        text not null default 'manual' check (origen in ('manual', 'importado'));

update public.personal p
set categoria_id = (
  select id from public.categorias
  where nombre = case p.cargo when 'docente' then 'Docente' when 'administrativo' then 'Secretaría' else 'Otro' end
);
alter table public.personal alter column categoria_id set not null;
alter table public.personal drop column cargo;
create index idx_personal_categoria on public.personal (categoria_id);

-- La tabla personal usa permisos por columna (pin_hash oculto): conceder las nuevas.
grant select (categoria_id, vinculo, carga_horaria, origen) on public.personal to authenticated;

-- ── Marca de datos de demostración ─────────────────────────────
alter table public.registros_asistencia add column es_demo bool not null default false;
alter table public.permisos             add column es_demo bool not null default false;
create index idx_asistencia_demo on public.registros_asistencia (es_demo) where es_demo;

-- ── Datos institucionales (encabezado y firma de la planilla) ──
alter table public.configuracion
  add column encabezado      text not null default E'REPÚBLICA BOLIVARIANA DE VENEZUELA\nGOBIERNO BOLIVARIANO DE MIRANDA\nDIRECCIÓN GENERAL DE EDUCACIÓN',
  add column nombre_planilla text not null default 'U.E.E. "GRAL. RAFAEL URDANETA"',
  add column ubicacion       text not null default 'CÚA, EDO. BOLIVARIANO DE MIRANDA',
  add column cod_dea         text,
  add column firmante_nombre text,
  add column firmante_cedula text,
  add column firmante_cargo  text;
