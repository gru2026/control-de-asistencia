-- 012 · QR que se puede volver a mostrar (D-59).
-- El código se guarda cifrado (AES-256-GCM, clave derivada de la clave secreta del
-- servidor); el hash sigue siendo lo único que se usa para validar la marcación.
-- La columna no se concede a "authenticated": solo el servidor la lee.
alter table public.codigos_qr add column if not exists codigo_cifrado text;
