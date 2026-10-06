#!/usr/bin/env node
/**
 * Utilidades de base de datos vía la API de gestión de Supabase.
 * Requiere en .env: PUBLIC_SUPABASE_URL y TOKEN_ACCESS (token personal sbp_...).
 *
 *   npm run db:migrar            aplica las migraciones pendientes de supabase/migrations
 *   npm run db:seed              ejecuta supabase/seed.sql
 *   npm run db:sql -- "select 1" ejecuta una consulta suelta
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const { PUBLIC_SUPABASE_URL, TOKEN_ACCESS } = process.env;

if (!PUBLIC_SUPABASE_URL || !TOKEN_ACCESS) {
  console.error("Faltan PUBLIC_SUPABASE_URL o TOKEN_ACCESS en .env");
  process.exit(1);
}
const REF = new URL(PUBLIC_SUPABASE_URL).hostname.split(".")[0];

export async function sql(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN_ACCESS}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const cuerpo = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${cuerpo}`);
  return cuerpo ? JSON.parse(cuerpo) : [];
}

async function migrar() {
  await sql(`
    create schema if not exists interno;
    create table if not exists interno.migraciones (
      nombre text primary key,
      aplicada_en timestamptz not null default now()
    );`);
  const aplicadas = new Set(
    (await sql("select nombre from interno.migraciones")).map((r) => r.nombre),
  );
  const dir = join(RAIZ, "supabase", "migrations");
  const archivos = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  let n = 0;
  for (const f of archivos) {
    if (aplicadas.has(f)) continue;
    const contenido = readFileSync(join(dir, f), "utf8");
    const nombre = f.replace(/'/g, "''");
    // Cada migración en una transacción: o se aplica completa o nada.
    await sql(
      `begin;\n${contenido}\ninsert into interno.migraciones (nombre) values ('${nombre}');\ncommit;`,
    );
    console.log("✓ aplicada", f);
    n++;
  }
  console.log(n ? `${n} migración(es) aplicada(s).` : "Sin migraciones pendientes.");
}

const [, , comando, ...resto] = process.argv;
try {
  if (comando === "migrar") await migrar();
  else if (comando === "seed") {
    await sql(readFileSync(join(RAIZ, "supabase", "seed.sql"), "utf8"));
    console.log("✓ seed ejecutado");
  } else if (comando === "sql") console.log(JSON.stringify(await sql(resto.join(" ")), null, 2));
  else {
    console.error("Uso: node scripts/db.mjs <migrar|seed|sql> [consulta]");
    process.exit(1);
  }
} catch (e) {
  console.error("✗", e.message);
  process.exit(1);
}
