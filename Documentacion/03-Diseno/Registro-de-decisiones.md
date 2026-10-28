---
titulo: Registro de decisiones
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: diseno
estado: activo
fecha: 2026-10-06
---

# 🧭 Registro de decisiones (ADR)

Decisiones cerradas del proyecto. **Si algo cambia, se agrega una nueva fila** (no se borra la anterior: se marca como "Reemplazada").

> [!info] Regla
> Toda decisión que dependa de un dato del colegio y que pueda cambiar se implementa como **configuración** (en BD, editable desde el PC), nunca fija en el código.

## Resumen

| # | Fecha | Decisión | Estado |
|---|---|---|---|
| D-01 | 2026-10-06 | Alcance: solo personal **docente y administrativo** (no estudiantes) | ✅ Vigente |
| D-02 | 2026-10-06 | El **PC del colegio** es el centro de administración y respaldo de marcación | ✅ Vigente |
| D-03 | 2026-10-06 | Cada persona marca **desde su propio celular** escaneando un QR dentro de la app | ✅ Vigente |
| D-04 | 2026-10-06 | **QR impreso reutilizable**, un solo QR activo, regenerable, caducidad opcional | ✅ Vigente |
| D-05 | 2026-10-06 | Validación **QR + GPS + fecha/hora del servidor** en **entrada y salida** | ✅ Vigente |
| D-06 | 2026-10-06 | Geocerca: **fuera del radio = bloqueo**; GPS impreciso = permitir y **señalar** | ✅ Vigente |
| D-07 | 2026-10-06 | **Un celular por cuenta**; cambio de teléfono aprobado por secretaría desde el PC | ✅ Vigente |
| D-08 | 2026-10-06 | Respaldo sin teléfono en el PC: **secretaría marca** o **autoservicio cédula + PIN** | 🔁 Parcialmente reemplazada por D-37 (sin kiosco) |
| D-09 | 2026-10-06 | **Marcar requiere internet**; contingencia manual desde el PC. Offline real → v2 | ✅ Vigente |
| D-10 | 2026-10-06 | **Jornada y tolerancia configurables** (plantillas) + copia de la regla en cada registro | ✅ Vigente |
| D-11 | 2026-10-06 | Cantidad de personal **variable**: búsqueda + paginación, sin límites fijos | ✅ Vigente |
| D-12 | 2026-10-06 | Rol se escribe `secretaria` (sin tilde) en código y BD | ✅ Vigente |
| D-13 | 2026-10-01 | Service worker **propio** (sin Workbox ni `@vite-pwa`) | ✅ Vigente |
| D-14 | 2026-10-01 | Astro SSR + Supabase (Auth + RLS) + Vercel | ✅ Vigente |
| D-15 | 2026-10-01 | Cola offline con IndexedDB en el MVP | ❌ Reemplazada por D-09 |
| D-16 | 2026-10-06 | Sesión solo en el servidor: cookies `httpOnly`, sin cliente Supabase en el navegador | ✅ Vigente |
| D-17 | 2026-10-06 | Formularios HTML nativos con POST → redirect → GET (casi sin JavaScript) | ✅ Vigente |
| D-18 | 2026-10-06 | Secretos con `astro:env` (`access: secret`), leídos en tiempo de ejecución | ✅ Vigente |
| D-19 | 2026-10-06 | Migraciones aplicadas con `scripts/db.mjs` (API de gestión), registradas en `interno.migraciones` | ✅ Vigente |
| D-20 | 2026-10-08 | Nombre del producto: **GRU-system**; ícono con las iniciales "GRU" en la paleta del proyecto | ✅ Vigente |
| D-21 | 2026-10-08 | Escritorio = **PWA instalada desde Edge/Chrome** (Windows 10). Se descartan Electron y Tauri | ✅ Vigente |
| D-22 | 2026-10-08 | Interfaz: estilo Minimalismo/Swiss, íconos SVG de una sola familia (Lucide), sin emojis; fuentes del sistema | ✅ Vigente |
| D-23 | 2026-10-08 | Personal clasificado por **categoría** (oficio, configurable) y **vínculo** (fijo/contratado/suplente) + carga horaria | ✅ Vigente |
| D-24 | 2026-10-08 | **Jornadas nocturnas** (cruzan medianoche) para vigilancia | ✅ Vigente |
| D-25 | 2026-10-08 | Reportes PDF/Excel con el **formato de la planilla oficial**; sin columnas de firma (solo firma la dirección al pie) | ✅ Vigente |
| D-57 | 2026-10-28 | *Hoy* rediseñado: frase del día con barra de avance, semana de días tocables con su lectura, estados como botones con su cantidad y búsqueda al instante | ✅ Vigente |
| D-56 | 2026-10-27 | Todo dato que resume lleva a su detalle (barras, segmentos, puntos, días, tramos); vista de una categoría comparada con el colegio; pastillas de filtros, «Volver al vistazo», descargas con filtros, estados vacíos útiles y tendencia semanal en la ficha | ✅ Vigente |
| D-55 | 2026-10-27 | Panel de control en tres niveles: resumen (recuadros), vistazo (panel lateral con datos rápidos y «Ver todo») y seis secciones propias en el menú; el Registro del día pasa a ser Panel › Hoy; la secretaría entra a Pendientes | ✅ Vigente |
| D-54 | 2026-10-27 | Animaciones de intensidad media (entrada escalonada, cifras que cuentan, gráficas que se dibujan) y gráficas con color por lectura y franjas Bien/Atención/Bajo | ✅ Vigente |
| D-53 | 2026-10-25 | Panel en dos vistas: Resumen (módulos con frases y lectura Bien/Atención/Bajo) y Acción rápida (buscador, pendientes con botón); los datos en crudo pasan a una segunda capa | ✅ Vigente |
| D-52 | 2026-10-20 | Todas las pantallas a todo el ancho: formularios en rejilla de 12 columnas (cada campo según su dato) y columna lateral de apoyo (vista previa, resumen o estado) | ✅ Vigente |
| D-51 | 2026-10-20 | Botón **Acciones** en la barra (buscar persona, nuevo personal, permiso, cuentas, planillas); alta de personal y gestión de cuentas en ventanas; pantallas de una columna centradas | ✅ Vigente |
| D-50 | 2026-10-20 | Formularios sin estrés: «Ahora» por defecto, fechas y motivos con botones, buscador de persona, errores junto al campo | ✅ Vigente |
| D-49 | 2026-10-20 | **Ventanas**: panel lateral de la persona con acciones rápidas, formularios en ventana (`/api/acciones`) y confirmaciones propias | ✅ Vigente |
| D-48 | 2026-10-20 | Avisos en un **panel desplegable** desde la campana; mensajes de resultado abajo con **«Deshacer»** | ✅ Vigente |
| D-47 | 2026-10-20 | Caché en memoria por instancia (perfil y categorías, 60 s) y cabecera Server-Timing | ✅ Vigente |
| D-46 | 2026-10-20 | **Navegación de una sola página** (ClientRouter de Astro) con precarga; reemplaza la navegación parcial | ✅ Vigente |
| D-45 | 2026-10-19 | Aviso «Hay una versión nueva»: service worker con versión por publicación; recarga solo si la persona acepta | ✅ Vigente |
| D-44 | 2026-10-19 | **Puesta en marcha** como lista de verificación en Ajustes (no ejecuta nada) + `npm run db:respaldo`; la fecha la decide la coordinación | ✅ Vigente |
| D-43 | 2026-10-19 | Auditoría: CSP y HSTS, 5 intentos fallidos de inicio de sesión → 15 min, registro público de cuentas desactivado | ✅ Vigente |
| D-42 | 2026-10-19 | El personal entra con **cédula + contraseña**; contraseña inicial **0000** obligatoria de cambiar en el primer ingreso | ✅ Vigente |
| D-41 | 2026-10-19 | Avisos con campana en la barra superior y `/notificaciones`; historial personal por mes en `/historial` | ✅ Vigente |
| D-40 | 2026-10-19 | **Resumen del período** (R5) por persona con PDF y Excel; la planilla diaria se mantiene | ✅ Vigente |
| D-39 | 2026-10-19 | **Cambiar de teléfono** desde la ficha: el próximo teléfono con que la persona marque queda aprobado solo | ✅ Vigente |
| D-38 | 2026-10-19 | **Marca en secretaría** para quien no tiene teléfono; hora manual con motivo (directiva y secretaría) queda señalada | ✅ Vigente |
| D-37 | 2026-10-19 | **Sin kiosco ni PIN**: el colegio no tiene un equipo para eso; el respaldo es el registro del día en el PC de secretaría | ✅ Vigente |
| D-36 | 2026-10-09 | **Fecha de inicio del control**: mientras no se defina, el cierre diario no crea faltas | ✅ Vigente |
| D-35 | 2026-10-09 | Cierre diario **todos los días** a las 18:00 (incluye jornadas nocturnas y fines de semana); avisos agrupados por día; salida no registrada queda sin horas | ✅ Vigente |
| D-34 | 2026-10-09 | El teléfono se registra **al marcar por primera vez** (no al iniciar sesión); solo se conserva la solicitud pendiente más reciente | ✅ Vigente |
| D-33 | 2026-10-09 | Permisos con **página propia** (`/permisos`) y sección en la ficha; Jornadas pasa a Ajustes en el menú | ✅ Vigente |
| D-32 | 2026-10-09 | **Ubicaciones de prueba** además del colegio; lo marcado en ellas queda señalado | ✅ Vigente |
| D-31 | 2026-10-09 | Gráfica de tendencia: ejes y textos en HTML, posición por fecha real, días con poco personal programado no se grafican | ✅ Vigente |
| D-30 | 2026-10-09 | Columna lateral del panel: calendario del período, llegadas de hoy por categoría y ausentes de la semana | ✅ Vigente |
| D-29 | 2026-10-09 | Panel en tres niveles: Hoy + 4 indicadores · Requiere atención · Análisis en secciones plegables con su conclusión en el título | ✅ Vigente |
| D-28 | 2026-10-08 | Skill de diseño **Impeccable** (reemplaza a ui-ux-pro-max): tipografía Onest, tokens refinados, `DESIGN.md`/`PRODUCT.md` y revisión automática `npm run diseno:revisar` | ✅ Vigente |
| D-27 | 2026-10-08 | Filtros y paginación actualizan solo el contenido (navegación parcial); pruebas de navegador con Playwright | ✅ Vigente |
| D-26 | 2026-10-08 | Nómina real cargada por importación (`origen = importado`) y asistencia de **demostración** (`es_demo`), ambas eliminables desde Ajustes | ✅ Vigente |

---

## Detalle

### D-16 a D-19 · Decisiones técnicas de la Semana 1
- **D-16:** el navegador nunca recibe el token de Supabase legible por JavaScript (mitiga XSS). Todas las lecturas pasan por páginas SSR con el cliente de sesión (RLS). La clave secreta solo se usa para Auth admin, siempre después de verificar el rol.
- **D-17:** cada acción es un `<form method="post">`; tras guardar se redirige (303) con un mensaje "flash" en cookie. Astro verifica el `Origin` (protección CSRF).
- **D-18:** `import.meta.env` incrustaba la clave secreta en el build; con `astro:env` queda fuera del artefacto.
- **D-19:** `TOKEN_ACCESS` (token personal de Supabase) es **solo local**; nunca se configura en Vercel.

### D-21 · App de escritorio sin Electron ni Tauri
- La app depende del servidor (login, QR, GPS, reportes); un contenedor nativo no agrega funciones y sí peso (Electron: +150 MB y ~250 MB de RAM) y mantenimiento (compilar y redistribuir cada versión).
- Edge viene en Windows 10 y permite **Instalar este sitio como aplicación**: ventana propia, ícono en Inicio/escritorio y actualización automática con cada despliegue.
- Reconsiderar solo si se necesita hardware local (impresora térmica, lector biométrico).

### D-22 · Sistema de diseño
- Definido con la skill *ui-ux-pro-max* (`.opencode/skills/`): estilo Minimalismo/Swiss, recomendado para paneles administrativos.
- Tokens en `src/styles/tokens.css`; íconos en `src/components/ui/Icono.astro` (trazo 2, contorno).
- Accesibilidad: contraste ≥ 4.5:1, foco visible, controles ≥ 44 px, respeto de `prefers-reduced-motion`, áreas seguras del iPhone.

### D-23 a D-26 · Nómina real, reportes y demostración
- Las planillas del colegio muestran 5 cargos: Docente, Secretaría, Cocina, Obrero y Vigilancia. Son **categorías** configurables (color, planilla oficial donde aparecen, jornada sugerida).
- "Contratista" no es un oficio: es el **vínculo**. Separarlos permite cruzar filtros ("Cocina + Contratado").
- La **carga horaria** semanal es una columna de la planilla oficial.
- Vigilancia trabaja de noche: la jornada nocturna termina al día siguiente; una marca de madrugada pertenece a la jornada que empezó la noche anterior.
- La planilla oficial no lleva firmas por persona (el sistema registra la hora). Solo se imprime y firma si la dirección lo desea.
- La nómina real (51 personas) se cargó desde un CSV **privado** (no está en el repositorio). La asistencia de demostración es simulada; el panel lo indica con un aviso.

### D-46 a D-50 · Que se sienta como una app
Motivo: cada acción cargaba una pantalla nueva (1 a 2,6 s desde el colegio) y sacaba a la persona de lo que estaba haciendo. El personal no está acostumbrado a interfaces modernas: menos saltos, menos campos y datos por capas.
- **D-46 · Navegación de una sola página.** `<ClientRouter />` de Astro: la barra y el menú quedan fijos y solo el contenido cambia con un fundido de 120 ms. Precarga al pasar el mouse y, en el celular, al tocar el enlace. `transiciones.ts` reemplaza a `navegacion-parcial.ts`: en la misma pantalla muestra esqueletos y conserva búsqueda (con su foco), filtros abiertos, secciones y desplazamiento; avisa de cambios sin guardar. Los scripts de página son delegados o usan `enCadaPantalla` (con limpieza: Mi asistencia libera reloj y cámara).
- **D-47 · Servidor.** Cada consulta a Supabase cuesta ~70 ms aunque estén en la misma región. El perfil (con si tiene ficha) y las categorías se guardan 60 s en memoria por instancia; otra instancia puede tardar hasta 60 s en ver un cambio de rol o de categoría. Las cuentas que deben cambiar la contraseña nunca se guardan. Cabecera `Server-Timing` (sesión, perfil, página) para medir.
- **D-48 · Avisos y mensajes.** La campana abre un panel (en el celular, desde abajo) con los avisos sin leer, en la misma consulta que el contador. Los resultados de las acciones aparecen abajo y se cierran solos; los reversibles ofrecen **Deshacer** (marcación asistida de los últimos 15 min, revisión, aviso leído). Las acciones graves siguen pidiendo confirmación.
- **D-49 · Ventanas.** Tocar un nombre abre el **panel lateral** de la persona (hoy, mes, permisos, teléfono, cuenta) con acciones: marcar, cargar permiso, aprobar o cambiar teléfono, «no tiene teléfono», crear cuenta, restablecer a 0000. Los formularios en ventana van a `/api/acciones` (JSON); si sale bien se cierra y se actualiza la pantalla; si no, los errores quedan junto al campo. Confirmaciones con una ventana propia. El contenido llega como fragmento y usa `ventanas.css` (clases `v-`). La ficha completa queda a un toque, por capas (pestañas).
- **D-50 · Formularios sin estrés.** Marcar empieza en «Ahora»; «Otra hora» pide hora y motivo con botones. Permiso: buscador de persona (escribir nombre o cédula), fecha con botones (Hoy · Mañana · Otras fechas) y motivo con botones. En el celular, las tablas muestran solo lo esencial. Guía de prueba con personas reales: [[05-Entregables/Prueba-de-usabilidad]].

### D-57 · Hoy, como el resto del panel
- **Motivo:** la pantalla tenía una fecha suelta con flechas, cifras en una esquina, un desplegable «Mostrar» y un botón «Aplicar»: distinta del panel y lenta de usar.
- **Frase del día** en palabras («32 de 54 ya llegaron» / «… vinieron» en días pasados), detalle (por llegar, tarde, faltas, permiso) y **barra de avance**.
- **Semana tocable:** los siete días de la semana del día elegido, cada uno con su porcentaje y color de lectura (solo marcaciones reales, sin demostración); flechas de semana anterior/siguiente, «Otra fecha» y «Volver a hoy».
- **Estados como botones con su cantidad** (Todos, Por llegar, Llegaron, Tarde, Sin salida, Faltas, Permiso, En secretaría, Sin jornada); se muestran los que tienen personas. Reemplazan al desplegable «Mostrar».
- **Búsqueda al instante** en el navegador (también por cédula, con `data-buscar`), sin «Aplicar»; categoría que se aplica sola.
- En días pasados, quien no tiene registro dice **«Sin registro»**, no «Por llegar».
- **Orden visual (28/10, tras revisión):** dos grupos claros en lugar de seis bloques apilados. (1) **Tarjeta del día**: a la izquierda la fecha con la etiqueta «Hoy», la frase, la barra con su porcentaje y el detalle; a la derecha la semana y «Otra fecha». (2) **Tarjeta de la lista**: los botones de estado encabezan la búsqueda y la tabla que filtran. Sin subtítulo duplicado; 24 px entre grupos.
- **Elegir fecha (28/10):** el campo de fecha suelto bajo la semana se reemplaza por una **cabecera de la semana**: el mes a la izquierda («Octubre 2026» u «Oct – Nov 2026») y, a la derecha, los botones **«Hoy»** (si se ve otro día) y **«📅 Elegir fecha»**, del mismo estilo. El botón abre el calendario del sistema (`showPicker`; el campo real queda invisible bajo el botón).

### D-56 · Cada dato lleva a su detalle
- **Regla:** cada barra, segmento, punto, día o cifra que agrupa registros es un enlace real a esos registros con el filtro puesto (lista de comprobación en `DESIGN.md`).
- **Destinos:** barra o fila de categoría → *Por categoría* con esa categoría activa; segmento o leyenda de la barra de hoy → *Hoy* con `ver=llegaron|tarde|faltas|permisos|pendientes` (nuevo `ver=tarde`); llegadas por categoría → *Hoy* filtrado; punto de la tendencia y día del calendario → *Hoy* de esa fecha (antes: la planilla); día de la semana → *Asistencia* con `dia=1..7`; tramo de llegada → *Puntualidad* con `tramo=` y la lista de esas llegadas; semana de faltas → *Ausencias* con `semana=`.
- **Vista de una categoría:** frase con el colegio de referencia, cifras «N puntos por encima/debajo del colegio», tendencia con la línea del colegio, sus personas de menor a mayor asistencia, y accesos a las demás categorías.
- **Comparación con el colegio** siempre que hay una categoría elegida (Asistencia, Puntualidad, Por categoría): `cargarPanel` carga además el período completo sin filtro.
- **Pastillas de filtros** («Viendo solo: Cocina ✕») que conservan los demás filtros; **«Volver al vistazo»** (`volver=`) que reabre el vistazo de origen; **descargas** con período y categoría; **estado vacío** que explica qué filtro dejó la pantalla sin datos y ofrece «Ver los últimos 30 días» o «Quitar filtros».
- **Ficha de la persona:** lectura Bien/Atención/Bajo junto a su asistencia y barras «semana a semana» de las últimas 8 semanas.

### D-55 · Panel de control en tres niveles
- **Nivel 1 · Resumen** (`/panel`): los seis recuadros (D-53). **Nivel 2 · Vistazo:** al tocar un recuadro se abre el panel lateral con la misma estructura siempre: frase con su lectura, tres cifras (cada una lleva a la sección ya filtrada), una gráfica, lo más importante (hasta 5, con «Ver los N»), una o dos acciones y el botón fijo **«Ver todo en …»**. Al abrirlo se precarga la sección. **Nivel 3 · Sección:** `/panel/hoy`, `/panel/asistencia`, `/panel/puntualidad`, `/panel/ausencias`, `/panel/categorias`, `/panel/pendientes`, con filtros, cifras, gráfica completa, tabla ordenable con buscador y acciones (exportar, cargar permiso…).
- **Menú:** «Panel de control» con sus seis secciones en la PC; en el celular, pestañas deslizables dentro del panel. **Filtros** (período y categoría) en la URL: se conservan al cambiar de sección y desde el menú.
- **Período nuevo «Esta semana»** (lunes a hoy), comparado con los mismos días de la semana anterior.
- **Registro del día → Panel › Hoy:** `/asistencia/registro` redirige (301) con su consulta. El ítem del menú «Asistencia» pasa a ser **«Permisos»** (Permisos y Por revisar).
- **Sin selector de vistas:** «Acción rápida» pasa a ser la sección *Pendientes* (buscador, pendientes por tipo con su botón, estado de hoy y accesos). La secretaría entra ahí; la directiva al resumen.
- Datos en `src/lib/datos/panel.ts` (`cargarPanel`): un solo cargador para los tres niveles; «Hoy» siempre es el día de hoy, sin depender del período.
- **Corrección de paso:** la clase global `.campos` (D-52) chocaba con la barra de filtros y ponía cada filtro en una fila; la barra usa ahora `.filtros-campos`.

### D-54 · Animaciones y acabado de las gráficas
- **Intensidad media** (entre sutil y vistosa): recuadros que entran escalonados (460 ms, 60 ms entre uno y otro), la cifra principal de cada recuadro cuenta desde 0 (800 ms), el anillo se llena, las líneas se dibujan de izquierda a derecha y las barras crecen. Al pasar el mouse el recuadro sube 3 px, la pastilla del ícono gira un poco y la flecha avanza.
- **Sin rebote:** se probó una curva con sobrepaso, pero el detector de diseño la marca como *bounce* (prohibido en `DESIGN.md`); se usa una salida rápida `cubic-bezier(0.22, 1, 0.36, 1)` con más recorrido y escala.
- Solo `transform`, `opacity` y `clip-path`; sin librerías. Con «reducir movimiento» todo aparece al instante (también se anulan los retrasos). Al volver tras cambiar un filtro (`?abrir=`) los recuadros no se repiten (`.quieto`). Las gráficas del detalle se animan cada vez que se abre.
- **Gráficas:** tendencia con curva monótona (no inventa picos), franjas de fondo Bien/Atención/Bajo, línea guía al pasar el mouse y puntos coloreados por lectura; barras por categoría y por día coloreadas por lectura con el color de la categoría como punto; segmentos de llegadas redondeados; anillo con degradado; mini línea con escala ajustada y valor final; avatares superpuestos.
- **Umbrales unificados:** el calendario pasa de 95/85 % a 90/80 %, igual que la lectura del panel, y su leyenda dice «Bien / Atención / Bajo».

### D-53 · Panel en dos vistas y datos en segunda capa
- **Motivo:** la administración tenía dificultad para leer cifras sueltas (indicadores con variación en puntos, cinco gráficas a la vez).
- **Resumen** (por defecto para directiva): seis módulos —Hoy, Pendientes, Este mes, Puntualidad, Ausentes, Por categoría— con una frase en palabras, una mini gráfica sin ejes y una lectura: **Bien** (≥ 90 %), **Atención** (80–89 %), **Bajo** (< 80 %), siempre con texto, no solo color (`lecturaPorcentaje`).
- **Segunda capa:** cada módulo abre un cajón ancho con las gráficas completas, filtros de período y categoría y listas con buscador. El contenido viaja en `<template>` dentro de la página (`data-ventana-local`): abre al instante y conserva los estilos de las gráficas, que los fragmentos de `/ventanas` no traen. Al cambiar un filtro, `?abrir=` vuelve a abrir el detalle.
- **Acción rápida** (por defecto para secretaría; la directiva también puede verla): buscador de persona, línea «Hoy:» con enlaces al Registro del día, accesos cortos y pendientes con su botón en la misma fila (aprobar teléfono, cargar permiso por una falta, salida sin marcar, revisión, sin jornada, sin cuenta).
- La vista elegida se recuerda por equipo (cookie `panel_vista`). El análisis completo y las descargas siguen en Reportes (tercera capa).
- Recorrido simulado de tareas en `05-Entregables/Resultados-usabilidad.md`; la prueba con personas queda para la visita al colegio.

### D-52 · Formularios a todo el ancho
- Se retira el ancho angosto de D-51: todas las pantallas usan el ancho del panel (96 rem).
- **`.dos-zonas`** (global): formulario a la izquierda (2/3) y columna de apoyo a la derecha (1/3, fija al desplazarse; `.libre` para listas largas). En celular, una debajo de la otra.
- **`.campos`**: rejilla de 12 columnas; `c-mini` (2), `c-corto` (3: cédula, fecha, número), `c-medio` (4), `c-largo` (6), `c-ancho` (8), `c-completo`. Categoría, vínculo, motivo y tipo de cuenta con botones.
- Columna de apoyo por pantalla: Nuevo personal (cuenta y jornada propuesta), Ficha (De un vistazo: hoy, jornada, teléfono, cuenta), Permiso (duración en vivo, faltas que cubre, otros permisos), Ajustes (vista previa del encabezado de la planilla y mantenimiento), Marcación (punto del colegio y cierre diario), QR (QR actual e historial), Avisos (sin leer por tipo, con filtro), Historial y Mi asistencia (días registrados), Puesta en marcha (avance), Cuentas (instrucciones y sin activar).

### D-51 · Acciones rápidas y orden visual
- **Acciones** (barra superior, directiva y secretaría): buscador de persona (abre su panel lateral) y accesos a Registro del día, Cargar permiso, Nuevo personal, Crear cuentas, Planilla de hoy (PDF) y Resumen del mes (Excel).
- **Nuevo personal en ventana:** nombre, apellido, cédula, categoría y vínculo con botones, y «Crear su cuenta ahora» (cédula + 0000) marcada por defecto. La jornada sale de la categoría. El formulario completo sigue en `/personal/nuevo`.
- **Cuentas en ventana:** desde Ajustes › Usuarios o desde el panel de la persona («Gestionar cuenta»): tipo de cuenta con botones, contraseña (restablecer a 0000 o una sugerida para cuentas con correo) y activar/desactivar con confirmación. «Nueva cuenta» (sin ficha) también en ventana. Acciones `cuenta_*` y `personal_nuevo` de `/api/acciones`, solo directiva.
- **Pantallas de una columna** (formularios, ajustes, QR, avisos, historial, Mi asistencia): `PanelLayout ancho="medio|angosto"` las centra junto al menú.

### D-42 a D-45 · Semana 4: cuentas, auditoría y puesta en marcha
- **D-42 · Cuentas por cédula.** El personal escribe su cédula (solo números; se acepta con letra y puntos) y su contraseña. Internamente la cuenta de Supabase usa un correo técnico `v12345678@cedula.gru-system.local` que la persona nunca ve; la administración puede seguir entrando con su correo. Toda cuenta nueva o restablecida tiene la contraseña **0000** y `usuarios.debe_cambiar_clave`: el middleware lleva a `/cambiar-clave` antes de cualquier otra pantalla. La contraseña propia exige al menos 6 caracteres, no trivial y distinta de la cédula. Como Supabase pide un mínimo de 6 caracteres (no se puede bajar), a las cuentas por cédula se les agrega un sufijo fijo internamente. Creación en lote en **Personal › Cuentas** con hoja de claves recortable; secretaría puede **restablecer a 0000**. Riesgo aceptado: hasta el primer ingreso, quien conozca la cédula puede entrar; se mitiga creando las cuentas el día de la capacitación.
- **D-43 · Auditoría.** Lighthouse ≥ 96 en rendimiento y 100 en accesibilidad y buenas prácticas en las pantallas principales. `Content-Security-Policy` (solo recursos propios; `'unsafe-inline'` por Astro) y HSTS en producción. Límite propio de 5 intentos fallidos en 15 minutos por cédula o correo (tabla `intentos_acceso`), porque todas las solicitudes llegan a Supabase desde la IP del servidor. Registro público de cuentas desactivado en Supabase. Detalle y riesgos aceptados en [[05-Entregables/Informe-de-auditoria]].
- **D-44 · Puesta en marcha.** Ajustes › Puesta en marcha muestra 9 pasos con su estado en vivo (demostración, cuentas y ubicaciones de prueba, QR, cuentas del personal, directiva real, planilla, inicio del control) y enlaza a cada pantalla. `npm run db:respaldo` guarda una copia JSON en `_privado`. La fecha de inicio la decide la coordinación; hasta entonces se mantienen los datos de demostración. Guía: [[04-Desarrollo/Puesta-en-marcha]].
- **D-45 · Actualizaciones.** `/sw.js?v=<commit>`: cada publicación tiene su caché. La versión nueva espera hasta que la persona toque «Actualizar» en el aviso; la primera instalación no recarga la página.

### D-37 a D-41 · Semana 3: respaldo en el PC, reportes y avisos
- **D-37 · Sin kiosco ni PIN.** El colegio no tiene un equipo para dejar como kiosco; secretaría maneja el sistema en su PC. Se descartan `/kiosco` y el PIN (los campos `pin_*` quedan sin uso). D-08 se mantiene solo en su modo asistido.
- **D-38 · Registro del día y marca en secretaría.** `/asistencia/registro` lista al personal programado del día (R0) con su estado: por llegar, presente, tarde, falta, permiso o sin salida. Directiva y secretaría marcan entrada o salida con la hora del servidor (`metodo = asistido`) o escriben la hora con un motivo obligatorio (`metodo = manual`, queda señalada). Para días anteriores la hora es obligatoria. Una falta del cierre se corrige marcando la entrada. La salida guarda `salida_registrada_por`. La casilla `personal.marca_en_pc` identifica a quien no tiene teléfono: aparece primero en el registro del día, no puede marcar desde la app y no cuenta como «sin cuenta» en el panel.
- **D-39 · Cambio de teléfono.** En la ficha, «Cambiar de teléfono» revoca el aprobado y los pendientes y activa `personal.cambio_telefono`; el próximo teléfono con que la persona marque queda aprobado y la marca se apaga. Aprobar o revocar a mano sigue disponible.
- **Revisión.** `/asistencia/revision` muestra lo señalado (GPS impreciso, ubicación de prueba, hora manual) con distancia, precisión y mapa; «Revisada» guarda `revisado_por` y `revisado_en`. El menú agrupa Registro del día · Por revisar · Permisos bajo «Asistencia» para no pasar de 5 botones en el celular; «Mi asistencia» de la directiva pasa a la barra superior.
- **D-40 · Resumen del período.** `/reportes/resumen`: rango (por defecto el mes en curso, máximo un año), categoría y orden por columna. Por persona: días laborables (R0, desde el ingreso, hasta hoy), presente, tarde, faltas, permisos, sin registro, % de asistencia (R5), horas y marcaciones en secretaría. PDF carta horizontal con el encabezado oficial y la firma; Excel con números. El formato oficial del colegio (pregunta #7) se ajustará cuando lo entreguen.
- **D-41 · Avisos e historial.** Campana con el número sin leer; `/notificaciones` permite abrir el aviso (lo marca leído y lleva a su pantalla) o marcarlos como leídos. Los avisos de faltas y salidas del cierre llevan al registro de ese día filtrado. `/historial` muestra a cada persona su mes en calendario, con totales, permisos y días registrados.

### D-31 a D-36 · Semana 2: marcación QR + GPS
- **D-31 · Gráfica de tendencia.** Solo la línea y el área son SVG; ejes, promedio y globos son HTML con la tipografía del sistema (13 px). Los puntos se ubican por fecha real. Escala de 3 marcas redondeadas a múltiplos de 5. Se omiten los días con menos del 30 % del personal de un día normal (mínimo 3), por ejemplo los domingos con solo vigilancia; la descripción lo indica.
- **D-32 · Ubicaciones de prueba.** La ubicación principal sigue en `configuracion` (colegio). La tabla `ubicaciones` agrega lugares adicionales con su radio y un interruptor. Toda marcación hecha en una ubicación de prueba queda `senalado` con el motivo «Ubicación de prueba: …». Las coordenadas se validan dentro de Venezuela (la longitud es negativa); así se detectó y corrigió la del colegio, que estaba con el signo cambiado.
- **D-33 · Permisos.** `/permisos` (directiva y secretaría) con filtros por vigencia, categoría y motivo; formulario propio para crear, editar y eliminar; sección «Permisos» en la ficha. Motivos predefinidos («Otro» exige observación). No se permiten permisos que se crucen para la misma persona. R4 se aplica en los dos sentidos: al cargar, las faltas sin entrada pasan a permiso; al eliminar o acortar, vuelven a falta. Para no pasar de 5 ítems en la barra del celular, Jornadas pasa a Ajustes.
- **D-34 · Registro del teléfono.** Se registra al intentar marcar, no al iniciar sesión: así el PC donde secretaría inicia sesión no ocupa el lugar del celular. El identificador (UUID) vive en `localStorage` y en la cookie `gru_disp` (para que la página muestre si está pendiente). Un teléfono nuevo deja pendiente solo la última solicitud. Secretaría y directiva aprueban o revocan en la ficha; el aviso del panel lleva a esa ficha.
- **D-35 · Cierre diario.** Vercel Cron llama a `/api/cierre-diario` todos los días a las 22:00 UTC (18:00 de Caracas) con `CRON_SECRET`. Revisa ayer y hoy y solo cierra jornadas ya terminadas, por lo que cubre las nocturnas y los fines de semana. Avisos agrupados: uno por día con las faltas (directiva y secretaría) y otro con las salidas no registradas. Política de R3 elegida: la salida no registrada queda sin horas y con aviso. También avisa si el QR venció o vence en 3 días. Cada ejecución queda en `cierres_diarios`; la clave única de `notificaciones` evita duplicados. Botón «Ejecutar cierre ahora» en Ajustes › Marcación.
- **D-36 · Inicio del control.** `configuracion.inicio_control`: sin fecha, el cierre no crea faltas. Evita marcar ausente a toda la nómina mientras el colegio aún no usa la app.
- **Escáner:** `BarcodeDetector` donde existe; `jsQR` se descarga solo si hace falta. El QR contiene `GRU1-` + 144 bits aleatorios; solo se guarda su SHA-256. La hora y el estado salen del servidor; la marcación real reemplaza un registro de demostración del mismo día.
- **Franjas horarias:** opcionales y solo para jornadas diurnas.

### D-29 · Panel con divulgación progresiva
- **Nivel 1 (de un vistazo):** barra de Hoy (leyenda solo con valores > 0) y 4 indicadores redondeados (Asistencia, Puntualidad, Faltas, Permisos) con flecha de variación. El detalle aparece al pasar el mouse o al tocar.
- **Nivel 2 (qué hacer):** «Requiere atención» lista solo lo pendiente con enlace directo; si no hay nada, «Todo al día».
- **Nivel 3 (análisis):** 5 secciones plegables (`<details>`) cuyo título incluye la conclusión, de modo que casi nunca hace falta abrirlas. El estado abierto se recuerda por navegador y se conserva al filtrar.
- Se eliminó la tarjeta «Lectura rápida» (sus frases pasan a los títulos), la nómina y los indicadores de horas y retraso (pasan a su sección).
- Formato venezolano: coma decimal, porcentajes enteros en la vista general; decimales solo en «Ver datos» y en el detalle.

### D-28 · Refinamiento visual con Impeccable
- ui-ux-pro-max queda archivada en `.opencode/skills-archivo/`; la skill activa es Impeccable (Apache 2.0), modo *Operate*.
- Línea base del detector: **95 hallazgos** (borde lateral de color, tarjetas anidadas, texto de 11 px, contraste 3.1:1 y 4.2:1, espaciado monótono, jerarquía plana). Después: **0**.
- Tipografía Onest autoalojada (34 KB) con respaldo de métricas ajustadas.
- Una superficie usa borde o sombra, nunca ambos; sin tarjetas dentro de tarjetas.
- Panel con una cifra principal y secundarias en una sola superficie.
- Sistema documentado en `DESIGN.md`; contexto del producto en `PRODUCT.md` (raíz).
- Durante la revisión se encontró y corrigió un error real: los listados de jornadas y categorías no cargaban por un conteo sobre `personal` sin permiso de tabla.

### D-02 · El PC del colegio
- Desde el PC, **directiva y secretaría** administran: personal, jornadas, configuración, QR, dispositivos, reportes.
- El PC también es el **punto de respaldo** para marcar sin teléfono (ver D-08).
- El PC **no** necesita mostrar el QR en pantalla (el QR es impreso, D-04).

### D-03 · Marcación desde el celular
- El escáner de QR está **dentro de la app** (cámara en vivo, no se permite subir imágenes).
- Motivo: en iPhone, la cámara nativa abre Safari, que no comparte sesión con la app instalada.
- El QR contiene **solo un código**, no una URL.

### D-04 · QR impreso
- La directiva genera el QR en `/configuracion/qr` → vista de impresión (logo + QR + instrucciones) → se pega en la entrada.
- **Un solo QR activo.** Al regenerar, el anterior queda **revocado al instante**.
- **Caducidad opcional:** "sin vencimiento" o "vence el dd/mm/aaaa". Ambas opciones disponibles.
- En BD se guarda el **hash** del código, nunca el código en claro.
- Recomendación operativa: regenerar cada mes o cada lapso escolar.

### D-05 · Validación de cada marcación (entrada y salida)
1. Sesión válida.
2. Dispositivo **aprobado** para esa cuenta (D-07).
3. Código QR **existe, activo y no vencido**.
4. GPS dentro del radio (D-06).
5. Sin duplicado (no dos entradas; no salida sin entrada).
6. Fecha y hora → **del servidor**.
7. (Opcional, configurable) dentro de la franja horaria permitida.

Se guarda evidencia: `lat`, `lng`, `precision_m`, `metodo`, `qr_id`, `dispositivo_id`.

### D-06 · Geocerca
| Situación | Acción |
|---|---|
| Distancia > radio | ❌ Bloquea: *"Debe estar en el colegio para marcar."* |
| Precisión GPS > umbral (ej. 100 m) pero dentro del radio | ✅ Permite + ⚠️ `senalado = true` |
| Permiso de ubicación denegado | ❌ Bloquea con instrucciones; alternativa: marcar en el PC |

Parámetros en `configuracion`: `colegio_lat`, `colegio_lng`, `radio_m` (default 150), `precision_max_m` (default 100).

### D-07 · Un celular por cuenta
- Al primer login la app genera un `dispositivo_id` (uuid guardado en el navegador) y lo registra.
- Primer dispositivo de la cuenta → **aprobado automáticamente**.
- Dispositivo nuevo → estado `pendiente`: puede ver la app, **no puede marcar**. Mensaje: *"Este teléfono está pendiente de aprobación por secretaría."*
- Secretaría/directiva en `/personal/[id]` → **Dispositivos** → *Aprobar* (el anterior queda `revocado`).
- Limitación conocida: borrar datos del navegador o usar Safari en lugar de la app instalada = "teléfono nuevo".

### D-08 · Respaldo sin teléfono (PC)
| Modo | Cómo | Registro |
|---|---|---|
| **Asistido** | Secretaría busca a la persona en `/asistencia/registro` → *Marcar* | `metodo = 'asistido'`, `registrado_por = secretaria` |
| **Autoservicio** | En `/kiosco` la persona escribe **cédula + PIN** (4–6 dígitos) | `metodo = 'kiosco'` |

- El PIN se guarda con hash; lo asigna/restablece secretaría o directiva.
- `/kiosco` solo funciona en el PC autorizado (dispositivo marcado como `kiosco` en la tabla `dispositivos`).
- Bloqueo temporal tras 5 PIN erróneos.
- Los reportes muestran cuántas marcaciones de cada persona fueron por PC.

### D-09 · Internet obligatorio para marcar
- La app **abre** sin internet (app shell cacheada) y muestra el último estado, pero **no marca**.
- Mensaje: *"Sin conexión. Conéctese para marcar o diríjase a secretaría."*
- Contingencia (caída de internet del colegio): secretaría registra luego desde el PC con observación *"falla de conexión"* (`metodo = 'manual'`).
- Resuelve la contradicción anterior entre R6 (hora del dispositivo) y RNF-12 (hora del servidor): **toda marcación usa hora del servidor**.
- **v2:** cola offline guardando código QR + GPS + hora del teléfono, sincronizada y señalada para revisión.

### D-10 · Jornadas configurables
- Tabla `jornadas` (plantillas: "Docente mañana", "Administrativo"…) con entrada, salida, tolerancia, pausa y días laborables.
- Cada persona tiene una `jornada_id`; excepciones por día en `horarios`.
- Cada registro guarda **`hora_esperada` y `tolerancia_aplicada`** al marcar → cambiar la configuración **no altera** reportes pasados.

Ver: [[03-Diseno/Modelo-de-datos|Modelo de datos]] · [[03-Diseno/Reglas-de-negocio|Reglas de negocio]] · [[00-Inicio/Preguntas-para-el-colegio|Preguntas]]
