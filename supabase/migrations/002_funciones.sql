-- 002 · Funciones auxiliares y triggers

-- Rol del usuario autenticado (security definer: evita recursión en RLS de usuarios)
create or replace function public.rol_actual()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select rol from public.usuarios where id = auth.uid() and estado = 'activo'
$$;

create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.rol_actual() in ('directiva', 'secretaria'), false)
$$;

-- id de personal del usuario autenticado
create or replace function public.personal_actual()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.personal where usuario_id = auth.uid()
$$;

-- Mantiene actualizado_en
create or replace function public.tocar_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en := now();
  return new;
end
$$;

create trigger trg_registros_actualizado
  before update on public.registros_asistencia
  for each row execute function public.tocar_actualizado_en();

create trigger trg_configuracion_actualizado
  before update on public.configuracion
  for each row execute function public.tocar_actualizado_en();

-- Las funciones solo deben ejecutarlas usuarios autenticados
revoke execute on function public.rol_actual()      from public, anon;
revoke execute on function public.es_admin()        from public, anon;
revoke execute on function public.personal_actual() from public, anon;
grant  execute on function public.rol_actual()      to authenticated;
grant  execute on function public.es_admin()        to authenticated;
grant  execute on function public.personal_actual() to authenticated;
