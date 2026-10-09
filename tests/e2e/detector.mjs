/**
 * Revisión de diseño con el detector de Impeccable sobre las páginas RENDERIZADAS.
 *
 * Las páginas requieren sesión, así que se guardan con Playwright (ya autenticado)
 * y se sirven en un puerto local para que el detector las analice en un navegador.
 * También analiza el código fuente (src/).
 *
 *   npm run dev                (en otra terminal)
 *   npm run diseno:revisar     (resumen)
 *   npm run diseno:revisar -- --json > hallazgos.json
 */
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { iniciar, URL_BASE as B } from "./utilidades.mjs";

const RAIZ = fileURLToPath(new URL("../../", import.meta.url));
const DETECTOR = `${RAIZ}.opencode/skills/impeccable/scripts/impeccable`;
const RUTAS = [
  "/login",
  "/panel",
  "/personal",
  "/reportes",
  "/jornadas",
  "/configuracion",
  "/configuracion/usuarios",
  "/asistencia",
];
const PUERTO = 4399;
const json = process.argv.includes("--json");

// 1) Guardar el HTML renderizado de cada ruta (con la sesión de directiva)
const { navegador, pagina } = await iniciar();
const paginas = new Map();
for (const ruta of RUTAS) {
  if (ruta === "/login") {
    const anon = await navegador.newPage();
    await anon.goto(B + ruta, { waitUntil: "networkidle" });
    paginas.set(ruta, await anon.content());
    await anon.close();
    continue;
  }
  await pagina.goto(B + ruta, { waitUntil: "networkidle" });
  paginas.set(ruta, await pagina.content());
}
await navegador.close();

// 2) Servirlo en un puerto local; los recursos (CSS, íconos) se piden al servidor de la app
const servidor = createServer((req, res) => {
  const ruta = (req.url ?? "/").split("?")[0];
  const html = paginas.get(ruta);
  if (!html) {
    res.writeHead(302, { Location: B + req.url });
    return res.end();
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(
    html
      .replace("<head>", `<head><base href="${B}/">`)
      .replace(/<script[^>]*@vite\/client[^>]*><\/script>/g, "")
      .replace(/<astro-dev-toolbar[\s\S]*?<\/astro-dev-toolbar>/g, ""),
  );
}).listen(PUERTO);

// 3) Detector: código fuente + páginas en PC y en celular
// El detector usa un Chromium para analizar las páginas: se le pasa el de Playwright.
const entorno = {
  ...process.env,
  IMPECCABLE_BROWSER: process.env.IMPECCABLE_BROWSER ?? chromium.executablePath(),
};
// Asíncrono: el servidor local debe seguir respondiendo mientras el detector navega.
const ejecutar = (args) =>
  new Promise((resolver) => {
    const p = spawn(DETECTOR, json ? ["detect", "--json", ...args] : ["detect", ...args], {
      cwd: RAIZ,
      env: entorno,
    });
    let stdout = "";
    let stderr = "";
    p.stdout.on("data", (d) => (stdout += d));
    p.stderr.on("data", (d) => (stderr += d));
    p.on("close", (status) => resolver({ status, stdout, stderr }));
  });
const urls = RUTAS.map((r) => `http://localhost:${PUERTO}${r}`);
const resultados = [
  { nombre: "código fuente", r: await ejecutar(["src/"]) },
  { nombre: "páginas (PC 1280×800)", r: await ejecutar(urls) },
  { nombre: "páginas (celular 390×844)", r: await ejecutar(["--viewport", "390x844", ...urls]) },
];
servidor.close();

let fallo = 0;
for (const { nombre, r } of resultados) {
  if (json) {
    console.log(JSON.stringify({ origen: nombre, hallazgos: JSON.parse(r.stdout || "[]") }));
  } else {
    console.log(`\n══ ${nombre}`);
    console.log((r.stderr || r.stdout).trim() || "Sin hallazgos.");
  }
  if (r.status === 1) fallo = 1;
  else if (r.status === 2 && !fallo) fallo = 2;
}
process.exitCode = fallo;
