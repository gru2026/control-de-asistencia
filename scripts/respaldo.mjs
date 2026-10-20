#!/usr/bin/env node
/**
 * Respaldo de la base de datos (RNF-24) en Documentacion/_privado/respaldos/AAAA-MM-DD_HHMM/.
 * Una copia JSON por tabla de `public` y la lista de cuentas de acceso (sin contraseñas).
 * La carpeta _privado no se sube a GitHub: contiene cédulas.
 *
 *   npm run db:respaldo
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const { PUBLIC_SUPABASE_URL, TOKEN_ACCESS } = process.env;
if (!PUBLIC_SUPABASE_URL || !TOKEN_ACCESS) {
  console.error("Faltan PUBLIC_SUPABASE_URL o TOKEN_ACCESS en .env");
  process.exit(1);
}
const REF = new URL(PUBLIC_SUPABASE_URL).hostname.split(".")[0];

async function sql(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN_ACCESS}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const cuerpo = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${cuerpo}`);
  return JSON.parse(cuerpo);
}

const sello = new Date().toISOString().slice(0, 16).replace("T", "_").replace(":", "");
const dir = join(RAIZ, "Documentacion", "_privado", "respaldos", sello);
mkdirSync(dir, { recursive: true });

try {
  const tablas = (
    await sql(
      "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by 1",
    )
  ).map((t) => t.table_name);
  const resumen = {};
  for (const t of tablas) {
    const [{ filas }] = await sql(
      `select coalesce(json_agg(x), '[]'::json) as filas from public."${t.replace(/"/g, "")}" x`,
    );
    writeFileSync(join(dir, `${t}.json`), JSON.stringify(filas, null, 1));
    resumen[t] = filas.length;
  }
  const [{ filas: cuentas }] = await sql(
    "select coalesce(json_agg(x), '[]'::json) as filas from (select id, email, created_at, last_sign_in_at, banned_until from auth.users) x",
  );
  writeFileSync(join(dir, "auth_users.json"), JSON.stringify(cuentas, null, 1));
  resumen.auth_users = cuentas.length;
  writeFileSync(
    join(dir, "resumen.json"),
    JSON.stringify({ fecha: new Date().toISOString(), filas: resumen }, null, 2),
  );
  console.log(`✓ respaldo en ${dir}`);
  for (const [t, n] of Object.entries(resumen)) console.log(`  ${t}: ${n}`);
} catch (e) {
  console.error("✗", e.message);
  process.exit(1);
}
