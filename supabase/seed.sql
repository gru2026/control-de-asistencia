-- Datos iniciales. Ejecutar después de las migraciones.

-- Configuración por defecto.
-- TODO: reemplazar NULL por las coordenadas reales de la entrada del colegio.
insert into public.configuracion (id, colegio_lat, colegio_lng, radio_m, precision_max_m)
values (1, null, null, 150, 100)
on conflict (id) do nothing;

-- Jornada por defecto (configurable desde /jornadas)
insert into public.jornadas (nombre, hora_entrada, hora_salida, tolerancia_min, pausa_min, dias_laborables)
values ('General', '07:00', '16:00', 15, 0, '{1,2,3,4,5}')
on conflict (nombre) do nothing;

-- Feriados nacionales de Venezuela (fecha fija) — revisar y completar
-- (Carnaval y Semana Santa cambian cada año: cargarlos desde /jornadas).
insert into public.feriados (fecha, descripcion) values
  ('2026-10-12', 'Día de la Resistencia Indígena'),
  ('2026-12-24', 'Nochebuena'),
  ('2026-12-25', 'Navidad'),
  ('2026-12-31', 'Fin de año'),
  ('2027-01-01', 'Año Nuevo'),
  ('2027-04-19', 'Declaración de la Independencia'),
  ('2027-05-01', 'Día del Trabajador'),
  ('2027-06-24', 'Batalla de Carabobo'),
  ('2027-07-05', 'Día de la Independencia'),
  ('2027-07-24', 'Natalicio del Libertador')
on conflict (fecha) do nothing;

-- ── Usuarios de prueba ─────────────────────────────────────────
-- 1. Crear las cuentas en Supabase → Authentication → Users → "Add user"
--    (ej. directiva@prueba.local, secretaria@prueba.local, docente@prueba.local).
-- 2. Luego, en SQL Editor, registrar su perfil y rol:
--
-- insert into public.usuarios (id, nombre, apellido, email, rol)
-- select id, 'Dir', 'Prueba', email, 'directiva'  from auth.users where email = 'directiva@prueba.local';
-- insert into public.usuarios (id, nombre, apellido, email, rol)
-- select id, 'Sec', 'Prueba', email, 'secretaria' from auth.users where email = 'secretaria@prueba.local';
-- insert into public.usuarios (id, nombre, apellido, email, rol)
-- select id, 'Doc', 'Prueba', email, 'personal'   from auth.users where email = 'docente@prueba.local';
--
-- insert into public.personal (usuario_id, nombre, apellido, cedula, cargo, jornada_id)
-- select u.id, u.nombre, u.apellido, 'V-00000001', 'docente', (select id from public.jornadas where nombre = 'General')
-- from public.usuarios u where u.email = 'docente@prueba.local';
