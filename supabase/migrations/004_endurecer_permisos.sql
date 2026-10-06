-- 004 · Defensa en profundidad sobre los privilegios por defecto de Supabase
--
-- Supabase concede ALL sobre las tablas de public a anon y authenticated.
-- RLS filtra filas, pero TRUNCATE no está cubierto por RLS y anon no necesita
-- ningún acceso (el login usa los endpoints de Auth, no las tablas).

revoke all on all tables    in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon;

revoke truncate, references, trigger on all tables in schema public from authenticated;

-- Tablas futuras: mismas reglas
alter default privileges in schema public revoke all on tables    from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke all on functions from anon;
alter default privileges in schema public revoke truncate, references, trigger on tables from authenticated;
