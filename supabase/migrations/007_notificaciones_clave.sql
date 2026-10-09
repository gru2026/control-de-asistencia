-- 007 · El índice parcial no sirve para ON CONFLICT desde la API (PostgREST no
-- envía el predicado). Un índice único normal funciona igual: los NULL no chocan.
drop index if exists public.uq_notif_clave;
create unique index uq_notif_clave on public.notificaciones (usuario_destino, clave);
