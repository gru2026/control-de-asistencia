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
| D-08 | 2026-10-06 | Respaldo sin teléfono en el PC: **secretaría marca** o **autoservicio cédula + PIN** | ✅ Vigente |
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

---

## Detalle

### D-16 a D-19 · Decisiones técnicas de la Semana 1
- **D-16:** el navegador nunca recibe el token de Supabase legible por JavaScript (mitiga XSS). Todas las lecturas pasan por páginas SSR con el cliente de sesión (RLS). La clave secreta solo se usa para Auth admin, siempre después de verificar el rol.
- **D-17:** cada acción es un `<form method="post">`; tras guardar se redirige (303) con un mensaje "flash" en cookie. Astro verifica el `Origin` (protección CSRF).
- **D-18:** `import.meta.env` incrustaba la clave secreta en el build; con `astro:env` queda fuera del artefacto.
- **D-19:** `TOKEN_ACCESS` (token personal de Supabase) es **solo local**; nunca se configura en Vercel.

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
