#!/usr/bin/env node
/**
 * Crea una cuenta (Auth + perfil en public.usuarios). Útil para el primer
 * administrador, ya que antes de él nadie puede crear usuarios desde la app.
 *
 *   npm run crear-usuario -- <email> <rol> <nombre> <apellido> [contraseña]
 *
 * rol: directiva | secretaria | personal. Si no se da contraseña, se genera una.
 * Para rol "personal" también crea su ficha en public.personal (pide --cedula=V-123).
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const { PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!PUBLIC_SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Faltan PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en .env");
  process.exit(1);
}

const args = process.argv.slice(2);
const opciones = Object.fromEntries(
  args.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")),
);
const [email, rol, nombre, apellido, clave] = args.filter((a) => !a.startsWith("--"));

if (!email || !["directiva", "secretaria", "personal"].includes(rol) || !nombre || !apellido) {
  console.error(
    "Uso: npm run crear-usuario -- <email> <rol> <nombre> <apellido> [contraseña] [--cedula=V-123]",
  );
  process.exit(1);
}

const admin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const password = clave ?? randomBytes(9).toString("base64url");
const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});
if (error) {
  console.error("✗ Auth:", error.message);
  process.exit(1);
}

const id = data.user.id;
const { error: e2 } = await admin.from("usuarios").insert({ id, nombre, apellido, email, rol });
if (e2) {
  await admin.auth.admin.deleteUser(id);
  console.error("✗ Perfil:", e2.message);
  process.exit(1);
}

if (rol === "personal" || opciones.cedula) {
  const cedula = opciones.cedula ?? `PRUEBA-${id.slice(0, 8)}`;
  const { data: jornada } = await admin
    .from("jornadas")
    .select("id")
    .eq("nombre", "General")
    .maybeSingle();
  const { error: e3 } = await admin.from("personal").insert({
    usuario_id: id,
    nombre,
    apellido,
    cedula,
    cargo: opciones.cargo ?? "docente",
    jornada_id: jornada?.id ?? null,
  });
  if (e3) console.error("⚠ Ficha de personal no creada:", e3.message);
}

console.log(`✓ ${rol} creado: ${email}`);
if (!clave) console.log(`  Contraseña temporal: ${password}`);
