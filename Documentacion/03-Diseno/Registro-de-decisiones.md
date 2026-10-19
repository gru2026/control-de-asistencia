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
