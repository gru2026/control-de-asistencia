/**
 * Utilidades para las pruebas de navegador (Playwright).
 *
 * Configuración por variables de entorno (todas opcionales):
 *   E2E_URL     dirección de la app (por defecto http://localhost:4321)
 *   E2E_EMAIL   correo de una cuenta de directiva
 *   E2E_CLAVE   contraseña de esa cuenta
 * Si no se indican E2E_EMAIL/E2E_CLAVE, se leen de
 * Documentacion/_privado/Usuarios-de-prueba.md (archivo local, fuera de Git).
 */
import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const URL_BASE = (process.env.E2E_URL ?? "http://localhost:4321").replace(/\/$/, "");

const ARCHIVO_USUARIOS = fileURLToPath(
  new URL("../../Documentacion/_privado/Usuarios-de-prueba.md", import.meta.url),
);

/** Credenciales de una cuenta de prueba ("directiva", "secretaria" o "docente"). */
export function credenciales(rol = "directiva") {
  if (rol === "directiva" && process.env.E2E_EMAIL && process.env.E2E_CLAVE) {
    return { email: process.env.E2E_EMAIL, clave: process.env.E2E_CLAVE };
  }
  if (!existsSync(ARCHIVO_USUARIOS)) {
    throw new Error(
      "Defina E2E_EMAIL y E2E_CLAVE, o cree Documentacion/_privado/Usuarios-de-prueba.md",
    );
  }
  const linea = readFileSync(ARCHIVO_USUARIOS, "utf8")
    .split("\n")
    .find((l) => l.includes(`${rol}.prueba@`));
  const m = linea?.match(/(\S+@\S+)\s+·\s+`([^`]+)`/);
  if (!m) throw new Error(`No se encontró la cuenta de prueba «${rol}»`);
  return { email: m[1], clave: m[2] };
}

/** Registro de resultados: imprime cada verificación y resume al final. */
export function crearRegistro() {
  let fallos = 0;
  let total = 0;
  return {
    ok(nombre, condicion, detalle = "") {
      total++;
      if (!condicion) fallos++;
      console.log(`${condicion ? "✅" : "❌"} ${nombre}${detalle ? ` — ${detalle}` : ""}`);
    },
    seccion(titulo) {
      console.log(`\n── ${titulo}`);
    },
    terminar() {
      console.log(`\n${total - fallos}/${total} verificaciones correctas`);
      process.exitCode = fallos ? 1 : 0;
    },
  };
}

/** Abre el navegador e inicia sesión. Devuelve { navegador, pagina, errores }. */
export async function iniciar({
  rol = "directiva",
  ancho = 1280,
  alto = 900,
  visible = false,
} = {}) {
  const navegador = await chromium.launch({ headless: !visible && !process.env.E2E_VISIBLE });
  const pagina = await navegador.newPage({ viewport: { width: ancho, height: alto } });
  const errores = [];
  pagina.on("pageerror", (e) => errores.push(e.message));
  const { email, clave } = credenciales(rol);
  await pagina.goto(`${URL_BASE}/login`);
  await pagina.fill("#campo-email", email);
  await pagina.fill("#campo-password", clave);
  await Promise.all([
    pagina.waitForURL((u) => !u.pathname.startsWith("/login")),
    pagina.click("button[type=submit]"),
  ]);
  return { navegador, pagina, errores };
}

/** Espera a que termine una actualización parcial (esqueletos fuera). */
export function esperarDatos(pagina) {
  return pagina.waitForFunction(() => !document.documentElement.classList.contains("cargando"));
}

/** Marca la página para detectar si hubo una recarga completa. */
export const marcarPagina = (pagina) => pagina.evaluate(() => (window.__sinRecarga = true));
export const sinRecarga = (pagina) => pagina.evaluate(() => window.__sinRecarga === true);
