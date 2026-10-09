-- 008 · Fecha desde la que rige el control de asistencia.
-- Mientras sea NULL, el cierre diario no crea faltas: evita marcar ausente a
-- todo el personal antes de que el colegio empiece a usar la app.
alter table public.configuracion add column inicio_control date;
