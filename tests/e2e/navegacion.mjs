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

  r.seccion("Panel: niveles de lectura");
  r.ok("cuatro indicadores", (await pag.$$(".kpis .kpi")).length === 4);
  r.ok("sección «Requiere atención» presente", Boolean(await pag.$("#titulo-atencion")));
  const resumenes = await pag.$$eval("details.seccion .resumen", (e) =>
    e.map((x) => x.textContent?.trim()),
  );
  r.ok(
    "cada sección muestra su conclusión cerrada",
    resumenes.length === 5 && resumenes.every(Boolean),
    resumenes[1],
  );
  await pag.click("#seccion-llegadas summary");
  r.ok("abrir una sección", await pag.$eval("#seccion-llegadas", (d) => d.open));
  await pag.click('.segmentado a:has-text("Este mes")');
  await pag.waitForFunction(() => location.search.includes("periodo=mes"));
  await esperarDatos(pag);
  r.ok(
    "la sección sigue abierta tras filtrar",
    await pag.$eval("#seccion-llegadas", (d) => d.open),
  );
  await pag.reload();
  r.ok("la sección se recuerda al recargar", await pag.$eval("#seccion-llegadas", (d) => d.open));
  await pag.click("#seccion-llegadas summary");

  r.seccion("Panel: columna lateral");
  const diasCal = await pag.$$eval("aside.lateral .calendario .dia", (d) => d.length);
  r.ok("calendario con los días del período", diasCal > 0, `${diasCal} días`);
  r.ok(
    "tarjeta de ausentes presente",
    Boolean(await pag.$('aside.lateral h2:has-text("Ausentes")')),
  );
  const enlaceDia = await pag.$("aside.lateral a.dia");
  if (enlaceDia) {
    const destino = await enlaceDia.getAttribute("href");
    r.ok(
      "un día del calendario lleva a su planilla",
      /\/reportes\?fecha=\d{4}-\d{2}-\d{2}$/.test(destino ?? ""),
      destino,
    );
  }
  await pag.click('.segmentado a:has-text("30 días")');
  await pag.waitForFunction(() => location.search.includes("periodo=30d"));
  await esperarDatos(pag);
  r.ok(
    "el calendario se actualiza con el período",
    (await pag.$$eval("aside.lateral .calendario .dia", (d) => d.length)) === 30,
  );

  r.seccion("Otras pantallas");
  await marcarPagina(pag);
  await pag.click('nav.nav a:has-text("Reportes")');
  await pag.waitForURL("**/reportes");
  r.ok(
    "ir a otra sección no recarga la app (navegación de una sola página)",
    await sinRecarga(pag),
  );
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

  r.seccion("Listados con conteos");
  await pag.goto(`${B}/jornadas`);
  const filasJornadas = await pag.$$eval("#jornadas tbody tr", (f) => f.length);
  const filasCategorias = await pag.$$eval("#categorias tbody tr", (f) => f.length);
  r.ok("jornadas listadas", filasJornadas > 0, `${filasJornadas} jornadas`);
  r.ok("categorías listadas", filasCategorias > 0, `${filasCategorias} categorías`);

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

  r.seccion("Marcación, QR y permisos");
  await pag.goto(`${B}/configuracion/marcacion`);
  r.ok(
    "ajustes de marcación: colegio en Venezuela (longitud negativa)",
    Number(await pag.inputValue("#g-lng")) < 0,
  );
  r.ok("cierre diario visible", (await pag.locator("#cierre").count()) === 1);
  await pag.goto(`${B}/configuracion/qr`);
  r.ok("página del QR", (await pag.locator("h1:has-text('Código QR')").count()) === 1);
  await pag.goto(`${B}/permisos`);
  await marcarPagina(pag);
  await pag.selectOption("#filtro-vigencia", "todos");
  await pag.waitForFunction(() => location.search.includes("vigencia=todos"));
  await esperarDatos(pag);
  r.ok("permisos: filtro sin recarga", await sinRecarga(pag));
  const api = await pag.evaluate(async () => {
    const enviar = (cuerpo) =>
      fetch("/api/marcacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
      }).then(async (x) => [x.status, (await x.json()).codigo]);
    return {
      formato: await enviar({}),
      sinFicha: await enviar({ tipo: "entrada", codigo: "x" }),
      cron: (await fetch("/api/cierre-diario")).status,
    };
  });
  r.ok("API de marcación rechaza solicitudes mal formadas", api.formato[0] === 400);
  // Sin ficha de personal → «ficha»; con ficha, sin identificador de teléfono → «dispositivo».
  r.ok(
    "API de marcación rechaza sin ficha o sin teléfono identificado",
    ["ficha", "dispositivo"].includes(api.sinFicha[1]),
    api.sinFicha[1],
  );
  r.ok("cierre diario exige la clave del cron", api.cron === 401);

  r.seccion("Semana 3: registro del día, revisión, resumen y avisos");
  await pag.goto(`${B}/asistencia/registro`);
  await marcarPagina(pag);
  r.ok("registro del día con personal programado", (await pag.locator("tbody tr").count()) > 0);
  await pag.selectOption("#filtro-ver", "pendientes");
  await pag.waitForFunction(() => location.search.includes("ver=pendientes"));
  await esperarDatos(pag);
  r.ok("registro del día: filtro sin recarga", await sinRecarga(pag));
  await pag.locator("[data-marcar-persona]").first().click();
  r.ok(
    "el diálogo de marcar muestra a la persona",
    (await pag.locator("#modal-marcar[open] [data-campo=texto]").innerText()).length > 10,
  );
  await pag.keyboard.press("Escape");
  await pag.goto(`${B}/asistencia/revision`);
  r.ok(
    "página de revisión",
    (await pag.locator("nav.pestanas a[aria-current=page]").innerText()).includes("revisar"),
  );
  await pag.goto(`${B}/reportes/resumen`);
  await marcarPagina(pag);
  r.ok("resumen del período con filas", (await pag.locator("tbody tr").count()) > 0);
  await pag.click('th a.orden:has-text("Faltas")');
  await esperarDatos(pag);
  r.ok(
    "resumen: ordenar sin recarga",
    (await sinRecarga(pag)) && pag.url().includes("orden=faltas"),
  );
  const descarga = await pag.evaluate(async () => {
    const x = await fetch("/api/reportes/resumen?formato=xlsx");
    return [x.status, x.headers.get("content-type")];
  });
  r.ok("resumen en Excel", descarga[0] === 200 && String(descarga[1]).includes("spreadsheet"));
  await pag.goto(`${B}/notificaciones`);
  r.ok("página de avisos", (await pag.locator("h1:has-text('Avisos')").count()) === 1);
  await pag.goto(`${B}/historial`);
  r.ok("historial con calendario", (await pag.locator("table.calendario .dia").count()) >= 28);

  r.seccion("Semana 4: cuentas, puesta en marcha y seguridad");
  await pag.goto(`${B}/personal/cuentas`);
  r.ok(
    "cuentas del personal: aviso de la contraseña 0000",
    (await pag.locator(".aviso", { hasText: "0000" }).count()) > 0,
  );
  await pag.goto(`${B}/configuracion/puesta-en-marcha`);
  r.ok("puesta en marcha con sus pasos", (await pag.locator("ol.pasos li").count()) === 9);
  await pag.goto(`${B}/cambiar-clave`);
  r.ok(
    "cambiar contraseña pide la actual fuera del primer ingreso",
    (await pag.locator("#campo-actual").count()) === 1,
  );
  const anonimo = await navegador.newPage();
  await anonimo.goto(`${B}/login`);
  await anonimo.fill("#campo-usuario", "abc");
  await anonimo.fill("#campo-password", "x");
  await Promise.all([anonimo.waitForLoadState("load"), anonimo.click("button[type=submit]")]);
  r.ok(
    "el inicio de sesión explica cómo escribir la cédula",
    (await anonimo.locator(".aviso").innerText()).includes("cédula"),
  );
  await anonimo.close();

  r.seccion("Semana 4: sensación de app (ventanas, avisos, pestañas)");
  await pag.goto(`${B}/personal`);
  await marcarPagina(pag);
  await pag.locator("a[data-persona]").first().click();
  await pag.waitForSelector("#ventana[open] .v-titulo", { timeout: 15000 });
  r.ok("tocar un nombre abre el panel de la persona sin salir", await sinRecarga(pag));
  r.ok(
    "el panel ofrece abrir la ficha completa",
    (await pag.locator("#ventana a:has-text('Abrir ficha completa')").count()) === 1,
  );
  await pag.keyboard.press("Escape");
  r.ok("Escape cierra el panel", (await pag.locator("#ventana[open]").count()) === 0);
  await pag.click("[data-alternar-avisos]");
  r.ok(
    "la campana abre los avisos encima de la pantalla",
    await pag.locator("#panel-avisos").isVisible(),
  );
  await pag.keyboard.press("Escape");
  r.ok("los avisos se cierran con Escape", !(await pag.locator("#panel-avisos").isVisible()));
  await pag.goto(`${B}/permisos`);
  await pag.click("a:has-text('Nuevo permiso')");
  await pag.waitForSelector("#ventana[open] #permiso-persona", { timeout: 15000 });
  await pag.click("#ventana button:has-text('Guardar permiso')");
  await pag.waitForSelector("#ventana .v-error", { timeout: 15000 });
  r.ok(
    "permiso en ventana: los errores aparecen junto al campo",
    (await pag.locator("#ventana .v-error").count()) >= 2,
  );
  await pag.keyboard.press("Escape");
  await pag.goto(`${B}/personal`);
  const ficha = await pag.locator("a[data-persona]").first().getAttribute("href");
  await pag.goto(`${B}${ficha}#dispositivo`);
  r.ok(
    "la ficha abre la pestaña del ancla (#dispositivo → Teléfono y cuenta)",
    (await pag.locator("[data-panel='acceso'].activo").count()) === 1,
  );

  r.seccion("Acciones rápidas y formularios en ventanas");
  await pag.goto(`${B}/panel`);
  await pag.click(".acciones-rapidas");
  await pag.waitForSelector("#ventana[open] .v-mosaico", { timeout: 15000 });
  r.ok(
    "el botón Acciones abre el menú de acciones rápidas",
    (await pag.locator(".v-mosaico li").count()) >= 5,
  );
  await pag.click("#ventana button:has-text('Nuevo personal')");
  await pag.waitForSelector("#np-nombre", { timeout: 15000 });
  await pag.click("#ventana button:has-text('Registrar')");
  await pag.waitForSelector("#ventana .v-error", { timeout: 15000 });
  r.ok(
    "nuevo personal en ventana valida junto al campo",
    (await pag.locator("#ventana .v-error").count()) >= 3,
  );
  await pag.keyboard.press("Escape");
  await pag.goto(`${B}/configuracion/usuarios`);
  await pag.locator("td.acciones a:has-text('Gestionar')").first().click();
  await pag.waitForSelector("#ventana[open] #ventana-titulo-cuenta", { timeout: 15000 });
  r.ok("gestionar una cuenta abre una ventana", true);
  await pag.keyboard.press("Escape");
  await pag.goto(`${B}/personal/nuevo`);
  const caja = await pag.$eval("main", (m) => {
    const b = m.getBoundingClientRect();
    return Math.abs(b.left - 240 - (innerWidth - b.right));
  });
  r.ok("los formularios de una columna quedan centrados", caja < 4, `${caja}px`);

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
