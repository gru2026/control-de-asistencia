/**
 * Prueba de navegador: filtros, orden, paginación y período se actualizan
 * SIN recargar la página (navegación parcial), con esqueletos mientras cargan.
 *
 *   npm run dev          (en otra terminal)
 *   npm run test:e2e
 */
import {
  esperarDatos,
  iniciar,
  marcarPagina,
  sinRecarga,
  crearRegistro,
  URL_BASE as B,
} from "./utilidades.mjs";

const r = crearRegistro();
const { navegador, pagina: pag, errores } = await iniciar();
const cargando = () => pag.evaluate(() => document.documentElement.classList.contains("cargando"));

try {
  r.seccion("Personal");
  await pag.goto(`${B}/personal`);
  await marcarPagina(pag);
  await pag.evaluate(() => window.scrollTo(0, 300));
  const categorias = await pag.$$eval("#filtro-categoria option", (os) =>
    os.map((o) => [o.value, o.textContent]),
  );
  const [idCat, nombreCat] = categorias.find(([v]) => v) ?? [];
  const vioEsqueleto = pag
    .waitForFunction(() => document.documentElement.classList.contains("cargando"), null, {
      timeout: 3000,
    })
    .then(() => true)
    .catch(() => false);
  const t0 = Date.now();
  await pag.selectOption("#filtro-categoria", idCat);
  r.ok("esqueleto visible durante la carga", await vioEsqueleto);
  await esperarDatos(pag);
  r.ok(
    `filtro por categoría (${nombreCat}) sin recarga`,
    await sinRecarga(pag),
    `${Date.now() - t0} ms`,
  );
  r.ok(
    "URL actualizada y sin parámetros vacíos",
    pag.url().includes(`categoria=${idCat}`) && !/=&|=$/.test(pag.url()),
    pag.url(),
  );
  r.ok("posición de desplazamiento conservada", (await pag.evaluate(() => scrollY)) > 0);

  await pag.click(".chips a.chip");
  await esperarDatos(pag);
  r.ok("quitar filtro con el chip", (await sinRecarga(pag)) && !pag.url().includes("categoria="));

  await pag.click('th a.orden:has-text("Cédula")');
  await esperarDatos(pag);
  r.ok("ordenar por columna", (await sinRecarga(pag)) && pag.url().includes("orden=cedula"));

  r.seccion("Búsqueda");
  await pag.click("#filtro-q");
  await pag.keyboard.type("mira", { delay: 60 });
  await pag.waitForFunction(() => location.search.includes("q=mira"), null, { timeout: 5000 });
  await esperarDatos(pag);
  r.ok("búsqueda sin recarga", await sinRecarga(pag));
  r.ok(
    "el campo conserva el foco",
    (await pag.evaluate(() => document.activeElement?.id)) === "filtro-q",
  );
  await pag.keyboard.type("bal");
  await pag.waitForFunction(() => location.search.includes("q=mirabal"), null, { timeout: 5000 });
  await esperarDatos(pag);
  r.ok("se puede seguir escribiendo", (await pag.inputValue("#filtro-q")) === "mirabal");

  await pag.goBack();
  await pag.waitForFunction(() => !location.search.includes("mirabal"));
  await esperarDatos(pag);
  r.ok(
    "botón atrás restaura el estado anterior",
    (await sinRecarga(pag)) && (await pag.inputValue("#filtro-q")) !== "mirabal",
  );

  r.seccion("Paginación");
  await pag.goto(`${B}/personal`);
  await marcarPagina(pag);
  if (await pag.$('.paginacion a:has-text("Siguiente")')) {
    await pag.click('.paginacion a:has-text("Siguiente")');
    await pag.waitForFunction(() => location.search.includes("pagina=2"));
    await esperarDatos(pag);
    r.ok(
      "página siguiente sin recarga",
      await sinRecarga(pag),
      (await pag.textContent(".paginacion span")).trim(),
    );
  } else r.ok("paginación (hay menos de una página de datos)", true);

  r.seccion("Panel");
  await pag.goto(`${B}/panel`);
  await marcarPagina(pag);
  const t1 = Date.now();
  await pag.click('.segmentado a:has-text("Mes anterior")');
  await pag.waitForFunction(() => location.search.includes("periodo=anterior"));
  await esperarDatos(pag);
  r.ok("cambiar período sin recarga", await sinRecarga(pag), `${Date.now() - t1} ms`);
  const catPanel = await pag.$eval("#panel-cat option:nth-child(2)", (o) => o.value);
  await pag.selectOption("#panel-cat", catPanel);
  await pag.waitForFunction((c) => location.search.includes(c), catPanel);
  await esperarDatos(pag);
  r.ok(
    "filtrar categoría conservando el período",
    (await sinRecarga(pag)) && pag.url().includes("periodo=anterior"),
  );

  r.seccion("Otras pantallas");
  await pag.click('nav.nav a:has-text("Reportes")');
  await pag.waitForURL("**/reportes");
  r.ok("ir a otra sección es una carga completa", !(await sinRecarga(pag)));
  await marcarPagina(pag);
  await pag.click('a[aria-label="Día anterior"]');
  await pag.waitForFunction(() => location.search.includes("fecha="));
  await esperarDatos(pag);
  r.ok("reportes: cambiar de día sin recarga", await sinRecarga(pag));

  await pag.goto(`${B}/configuracion/usuarios`);
  await marcarPagina(pag);
  await pag.selectOption("#filtro-rol", "directiva");
  await pag.waitForFunction(() => location.search.includes("rol=directiva"));
  await esperarDatos(pag);
  r.ok("usuarios: filtro por rol sin recarga", await sinRecarga(pag));

  r.seccion("Celular");
  const movil = await navegador.newPage({
    viewport: { width: 390, height: 844 },
    storageState: await pag.context().storageState(),
  });
  await movil.goto(`${B}/personal`);
  await movil.click("[data-alternar-filtros]");
  await movil.selectOption("#filtro-vinculo", "contratado");
  await movil.waitForFunction(() => location.search.includes("vinculo=contratado"));
  await esperarDatos(movil);
  r.ok(
    "los filtros desplegados siguen abiertos",
    await movil.$eval("form[data-autoenviar]", (f) => f.classList.contains("abierto")),
  );

  r.seccion("Errores");
  await pag.goto(`${B}/personal`);
  await pag.context().clearCookies();
  await pag.selectOption("#filtro-estado", "todos");
  await pag.waitForURL("**/login**", { timeout: 8000 });
  r.ok("sesión vencida → va al login", pag.url().includes("/login"));
  r.ok("no quedó en estado de carga", !(await cargando()));
  r.ok("sin errores de JavaScript", errores.length === 0, errores.join(" | "));
} catch (e) {
  r.ok("la prueba terminó sin excepciones", false, e.message.split("\n")[0]);
} finally {
  await navegador.close();
  r.terminar();
}
