-- 010 · Cuentas del personal con cédula y contraseña inicial (D-42).
-- La persona debe crear su propia contraseña en el primer ingreso.
alter table public.usuarios add column debe_cambiar_clave bool not null default false;
