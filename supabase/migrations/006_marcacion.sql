-- 006 · Marcación con QR + GPS, ubicaciones de prueba, cierre diario idempotente.
-- Decisiones: D-32 (ubicaciones adicionales), D-33 (cierre diario), D-34 (dispositivos).

-- ── Corrección: Venezuela está al oeste de Greenwich (longitud negativa) ──
update public.configuracion
set colegio_lng = -colegio_lng
where colegio_lng > 0 and colegio_lat between 0 and 13;

-- ── Ubicaciones adicionales donde se permite marcar ────────────
-- La ubicación principal sigue siendo configuracion.colegio_lat/lng.
-- Las de prueba sirven para ensayar el sistema fuera del colegio; las
-- marcaciones hechas en ellas quedan señaladas para revisión.
create table public.ubicaciones (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null check (length(nombre) between 1 and 80),
  lat         float8 not null check (lat between -90 and 90),
  lng         float8 not null check (lng between -180 and 180),
  radio_m     int not null default 150 check (radio_m between 30 and 2000),
  es_prueba   bool not null default true,
  activa      bool not null default true,
  creado_por  uuid references public.usuarios (id),
  creado_en   timestamptz not null default now()
);
alter table public.ubicaciones enable row level security;
create policy ubicaciones_select on public.ubicaciones for select to authenticated
  using (public.es_admin());
create policy ubicaciones_write on public.ubicaciones for all to authenticated
  using (public.rol_actual() = 'directiva') with check (public.rol_actual() = 'directiva');

-- ── Evidencia adicional de la marcación ────────────────────────
alter table public.registros_asistencia
  add column entrada_distancia_m int,
  add column salida_distancia_m  int,
  add column entrada_ubicacion   text,
  add column salida_ubicacion    text;

-- ── Notificaciones: clave para no duplicar avisos (cierre idempotente) ──
alter table public.notificaciones add column clave text;
create unique index uq_notif_clave on public.notificaciones (usuario_destino, clave)
  where clave is not null;
alter table public.notificaciones drop constraint notificaciones_tipo_check;
alter table public.notificaciones add constraint notificaciones_tipo_check
  check (tipo in ('falta', 'tarde', 'senalado', 'dispositivo', 'salida', 'qr', 'permiso', 'sistema'));

-- ── Registro de ejecuciones del cierre diario ──────────────────
create table public.cierres_diarios (
  id            uuid primary key default gen_random_uuid(),
  ejecutado_en  timestamptz not null default now(),
  origen        text not null check (origen in ('cron', 'manual')),
  ejecutado_por uuid references public.usuarios (id),
  resumen       jsonb not null default '{}'::jsonb
);
alter table public.cierres_diarios enable row level security;
create policy cierres_select on public.cierres_diarios for select to authenticated
  using (public.es_admin());

-- ── Dispositivos: datos legibles para aprobar ──────────────────
-- (descripcion ya existe; se guarda el navegador/sistema detectado)
create index idx_dispositivos_pendientes on public.dispositivos (estado) where estado = 'pendiente';
