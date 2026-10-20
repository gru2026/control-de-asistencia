-- 011 · Auditoría de seguridad de la Semana 4 (D-43).

-- Intentos fallidos de inicio de sesión: 5 en 15 minutos bloquean esa cédula o correo.
-- Solo el servidor (clave secreta) la usa: RLS activo y sin políticas.
create table public.intentos_acceso (
  id             bigint generated always as identity primary key,
  identificador  text not null,
  fecha          timestamptz not null default now()
);
create index idx_intentos_acceso on public.intentos_acceso (identificador, fecha);
alter table public.intentos_acceso enable row level security;
revoke all on public.intentos_acceso from anon, authenticated;

-- Función de Supabase para eventos: nadie debe poder llamarla por la API.
do $$
begin
  if exists (select 1 from pg_proc where proname = 'rls_auto_enable' and pronamespace = 'public'::regnamespace) then
    revoke execute on function public.rls_auto_enable() from anon, authenticated, public;
  end if;
end $$;

-- search_path fijo en la función del disparador (recomendación del asesor de Supabase).
alter function public.tocar_actualizado_en() set search_path = public;
