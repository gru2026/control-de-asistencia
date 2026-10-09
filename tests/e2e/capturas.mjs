/**
 * Capturas de pantalla de las secciones principales, en PC y en celular.
 * Sirven para revisar el diseño, el manual de usuario y la presentación.
 *
 *   npm run capturas                     (todas)
 *   npm run capturas -- /panel /reportes (solo esas rutas)
 *
 * Resultado: tests/e2e/capturas/<ruta>-<pc|movil>.png (carpeta ignorada por Git).
 */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { iniciar, URL_BASE as B } from "./utilidades.mjs";

const CARPETA = fileURLToPath(new URL("./capturas/", import.meta.url));
const RUTAS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "/panel",
      "/personal",
      "/reportes",
      "/jornadas",
      "/configuracion",
      "/configuracion/usuarios",
      "/asistencia",
    ];
const TAMANOS = [
  { nombre: "pc", width: 1366, height: 900 },
  { nombre: "movil", width: 390, height: 844 },
];

mkdirSync(CARPETA, { recursive: true });
const { navegador, pagina } = await iniciar();
const sesion = await pagina.context().storageState();

for (const t of TAMANOS) {
  const p = await navegador.newPage({
    viewport: { width: t.width, height: t.height },
    storageState: sesion,
  });
  for (const ruta of RUTAS) {
    await p.goto(B + ruta, { waitUntil: "networkidle" });
    const archivo = `${CARPETA}${ruta.replace(/^\//, "").replace(/[/?=&]+/g, "_") || "inicio"}-${t.nombre}.png`;
    await p.screenshot({ path: archivo, fullPage: true });
    console.log("✓", archivo.replace(CARPETA, "tests/e2e/capturas/"));
  }
}
await navegador.close();
