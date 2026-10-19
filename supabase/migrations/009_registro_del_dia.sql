-- 009 · Semana 3: registro del día en el PC, revisión de señaladas y teléfonos.
-- Decisiones: D-37 (sin kiosco ni PIN), D-38 (marca en secretaría), D-39 (cambio de teléfono).

-- ── Personal: quien no tiene teléfono marca en secretaría ─────
alter table public.personal
  add column marca_en_pc     bool not null default false,
  -- La directiva o secretaría autorizó un cambio: el próximo teléfono queda aprobado solo.
  add column cambio_telefono bool not null default false;
grant select (marca_en_pc, cambio_telefono) on public.personal to authenticated;

-- ── Registro: quién marcó la salida y revisión de señaladas ───
alter table public.registros_asistencia
  add column salida_registrada_por uuid references public.usuarios (id),
  add column revisado_en           timestamptz,
  add column nota_revision         text;
