-- 003 · Row Level Security
-- Fuente: Documentacion/02-Requisitos/Roles-y-permisos.md
--
-- Principio: las escrituras sensibles (marcaciones, QR, registro de dispositivos)
-- las hace SOLO el servidor con la clave secreta (service_role), que omite RLS.
-- Por eso esas tablas no tienen políticas de insert/update para el cliente.

alter table public.usuarios             enable row level security;
alter table public.jornadas             enable row level security;
alter table public.personal             enable row level security;
alter table public.horarios             enable row level security;
alter table public.configuracion        enable row level security;
alter table public.codigos_qr           enable row level security;
alter table public.dispositivos         enable row level security;
alter table public.registros_asistencia enable row level security;
alter table public.permisos             enable row level security;
alter table public.notificaciones       enable row level security;
alter table public.feriados             enable row level security;

-- ── usuarios ───────────────────────────────────────────────────
create policy usuarios_select on public.usuarios for select to authenticated
  using (id = auth.uid() or public.es_admin());
create policy usuarios_directiva_all on public.usuarios for all to authenticated
  using (public.rol_actual() = 'directiva') with check (public.rol_actual() = 'directiva');

-- ── jornadas / horarios / feriados: lectura autenticada, escritura directiva ──
create policy jornadas_select on public.jornadas for select to authenticated using (true);
create policy jornadas_write  on public.jornadas for all to authenticated
  using (public.rol_actual() = 'directiva') with check (public.rol_actual() = 'directiva');

create policy horarios_select on public.horarios for select to authenticated
  using (public.es_admin() or personal_id = public.personal_actual());
create policy horarios_write on public.horarios for all to authenticated
  using (public.rol_actual() = 'directiva') with check (public.rol_actual() = 'directiva');

create policy feriados_select on public.feriados for select to authenticated using (true);
create policy feriados_write  on public.feriados for all to authenticated
  using (public.rol_actual() = 'directiva') with check (public.rol_actual() = 'directiva');

-- ── personal ───────────────────────────────────────────────────
create policy personal_select on public.personal for select to authenticated
  using (public.es_admin() or usuario_id = auth.uid());
create policy personal_write on public.personal for all to authenticated
  using (public.rol_actual() = 'directiva') with check (public.rol_actual() = 'directiva');
-- pin_hash nunca debe llegar al navegador: se quita el SELECT de tabla y se
-- concede por columnas (un revoke por columna NO anula el grant de tabla).
-- Consecuencia: desde el cliente usar select explícito, nunca select('*').
revoke select on public.personal from authenticated, anon;
grant select (id, usuario_id, nombre, apellido, cedula, cargo, telefono, jornada_id,
              pin_intentos, pin_bloqueado_hasta, fecha_ingreso, estado, creado_en)
  on public.personal to authenticated;

-- ── configuracion ──────────────────────────────────────────────
create policy configuracion_select on public.configuracion for select to authenticated using (true);
create policy configuracion_update on public.configuracion for update to authenticated
  using (public.rol_actual() = 'directiva') with check (public.rol_actual() = 'directiva');

-- ── codigos_qr: solo directiva lee metadatos; escritura solo servidor ──
create policy qr_select on public.codigos_qr for select to authenticated
  using (public.rol_actual() = 'directiva');
revoke select on public.codigos_qr from authenticated, anon;
grant select (id, descripcion, activo, vigente_hasta, creado_por, creado_en, revocado_en)
  on public.codigos_qr to authenticated;

-- ── dispositivos ───────────────────────────────────────────────
create policy dispositivos_select on public.dispositivos for select to authenticated
  using (public.es_admin() or usuario_id = auth.uid());
-- aprobar / revocar desde el PC
create policy dispositivos_update_admin on public.dispositivos for update to authenticated
  using (public.es_admin()) with check (public.es_admin());

-- ── registros_asistencia: lectura; escritura solo servidor ─────
create policy registros_select on public.registros_asistencia for select to authenticated
  using (public.es_admin() or personal_id = public.personal_actual());

-- ── permisos ───────────────────────────────────────────────────
create policy permisos_select on public.permisos for select to authenticated
  using (public.es_admin() or personal_id = public.personal_actual());
create policy permisos_write on public.permisos for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

-- ── notificaciones ─────────────────────────────────────────────
create policy notif_select on public.notificaciones for select to authenticated
  using (usuario_destino = auth.uid());
create policy notif_marcar_leida on public.notificaciones for update to authenticated
  using (usuario_destino = auth.uid()) with check (usuario_destino = auth.uid());
