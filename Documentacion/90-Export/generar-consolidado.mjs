#!/usr/bin/env node
/**
 * Genera Documento-consolidado.md a partir de las notas del vault.
 * Uso: node generar-consolidado.mjs
 * Luego: pandoc Documento-consolidado.md -o Documento-Asistencia-UEN.docx
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const VAULT = join(dirname(fileURLToPath(import.meta.url)), "..");

const ORDEN = [
  "00-Inicio/Resumen ejecutivo.md",
  "01-Proyecto/Planteamiento-del-problema.md",
  "01-Proyecto/Justificacion-y-objetivos.md",
  "01-Proyecto/Alcance-y-beneficios.md",
  "01-Proyecto/Cronograma-4-semanas.md",
  "02-Requisitos/Requisitos-funcionales.md",
  "02-Requisitos/Requisitos-no-funcionales.md",
  "02-Requisitos/Roles-y-permisos.md",
  "03-Diseno/Registro-de-decisiones.md",
  "03-Diseno/Arquitectura-y-stack.md",
  "03-Diseno/Modelo-de-datos.md",
  "03-Diseno/Reglas-de-negocio.md",
  "03-Diseno/Mapa-de-pantallas.md",
  "03-Diseno/Estructura-de-carpetas.md",
  "03-Diseno/PWA-y-offline.md",
  "04-Desarrollo/Guia-de-entorno.md",
  "04-Desarrollo/Convenciones-y-calidad.md",
  "04-Desarrollo/Tareas-por-semana.md",
  "04-Desarrollo/Despliegue-Vercel-Supabase.md",
  "05-Entregables/Manual-de-usuario.md",
  "05-Entregables/Plan-de-pruebas.md",
  "05-Entregables/Presentacion-del-proyecto.md",
  "00-Inicio/Preguntas-para-el-colegio.md",
  "00-Inicio/Glosario.md",
];

function stripFrontmatter(md) {
  return md.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
}

function resolveWikilink(target) {
  const clean = target.split("#")[0].replace(/\.md$/, "");
  const parts = clean.split("/");
  return parts[parts.length - 1];
}

function convertLinks(md) {
  return md.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target, alias) =>
    alias ? alias : resolveWikilink(target)
  );
}

function convertCallouts(md) {
  return md.replace(/^> \[!\w+\]\s*(.*)$/gm, (_m, title) =>
    title.trim() ? `> **${title.trim()}**` : ">"
  );
}

let out = [];
out.push(
  "# Diseño de una aplicación web progresiva de control de asistencia para el personal docente y administrativo de la U.E.E. General Rafael Urdaneta",
  "",
  "**Servicio comunitario — Documentación completa del proyecto**",
  "",
  "Fecha de generación: " + new Date().toISOString().slice(0, 10),
  "",
  "---",
  ""
);

for (const rel of ORDEN) {
  const raw = readFileSync(join(VAULT, rel), "utf8");
  let md = stripFrontmatter(raw);
  md = convertLinks(md);
  md = convertCallouts(md);
  // Las tareas [ ] / [x] en docx quedan como texto plano
  out.push(md, "", "---", "");
}

const dest = join(VAULT, "90-Export", "Documento-consolidado.md");
writeFileSync(dest, out.join("\n"), "utf8");
console.log("OK ->", dest);
