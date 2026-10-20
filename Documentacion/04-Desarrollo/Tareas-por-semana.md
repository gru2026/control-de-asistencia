---
titulo: Tareas por semana
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: tablero
estado: en-progreso
fecha: 2026-10-06
---

# ✅ Tareas por semana (tablero de progreso)

> Marcar `[x]` al terminar. **Único** tablero de control del desarrollo.
> Cronograma: [[01-Proyecto/Cronograma-4-semanas]] · Decisiones: [[03-Diseno/Registro-de-decisiones]].
> "Terminado" = lint ✅ + tests ✅ + probado en móvil/PC ✅.

## Semana 0 — Preparación

- [x] Definir decisiones con el colegio (marcación, QR, GPS, dispositivos, PC)
- [x] Registro de decisiones y documentación actualizada
- [x] Repositorio Git inicializado + `.gitignore`
- [x] Andamiaje Astro + TypeScript + Vitest + ESLint/Prettier
- [x] Migraciones SQL iniciales (borrador) + seed
- [x] Cargar coordenadas del colegio en el seed/configuración
- [ ] Obtener nombre y correo del administrador (directiva)

## Semana 1 — Cimientos, auth, personal y jornadas ✅

- [x] Design tokens + `global.css` + componentes UI (Boton, Tarjeta, Tabla, Input, Select, Modal, Badge, Alerta, Paginacion)
- [x] Proyecto Supabase + migraciones 001–004 aplicadas (`npm run db:migrar`) + RLS verificado contra la API real
- [x] Login con Supabase Auth (`@supabase/ssr`, cookies httpOnly) + `AuthLayout`
- [x] `middleware.ts`: sesión + roles + redirecciones + cabeceras de seguridad
- [x] CRUD de personal con búsqueda, filtros y paginación (desactivar, nunca borrar)
- [x] Gestión de cuentas de usuario (crear, rol, contraseña, activar/desactivar)
- [x] CRUD de jornadas + asignación + excepciones por día + feriados
- [x] `lib/reglas/jornada.ts` (R0) + tests · `lib/auth/acceso.ts` + tests · `lib/validacion` + tests (62 tests)
- [x] Usuarios de prueba (directiva, secretaría, 2 personal) — credenciales en `_privado/`
- [x] Pruebas E2E manuales de login, roles, CRUD y RLS (ver [[05-Entregables/Plan-de-pruebas]])

**🏁 Hito:** ✅ login, personal y jornadas configurables (2026-10-06).

## Extra — Interfaz, nómina real y panel directivo (2026-10-08) ✅

- [x] PWA instalable «GRU-system» (manifest, íconos, service worker, iOS a pantalla completa)
- [x] Íconos SVG y sistema de diseño (skill ui-ux-pro-max)
- [x] Categorías, vínculo, carga horaria y jornadas nocturnas (migración 005)
- [x] Filtros, orden y vista de tarjetas en Personal, Usuarios, Jornadas y Feriados
- [x] Formularios: secciones, validación al salir del campo, «Guardando…», mostrar/copiar contraseña, aviso de cambios sin guardar
- [x] Panel con KPIs, comparación con el período anterior, 5 gráficas y lectura rápida
- [x] Reportes PDF/Excel con la planilla oficial (adelanto de la Semana 3)
- [x] Importador de personal (CSV) y nómina real cargada (51 personas)
- [x] Datos de demostración y botones de limpieza en Ajustes
- [ ] Logo y escudo para el encabezado (pendiente: jueves)

## Semana 2 — Marcación QR + GPS y reglas ✅

- [x] `/configuracion/marcacion`: geocerca (coordenadas, radio, precisión, activa), «usar mi ubicación», ubicaciones de prueba, franjas
- [x] `/configuracion/qr`: generar, desactivar, vencimiento, historial, hoja A4 para imprimir
- [x] Registro de teléfono al marcar + aprobación/revocación en la ficha (R11)
- [x] Escáner QR (`BarcodeDetector` + `jsQR`) + captura GPS a pantalla completa
- [x] `/api/marcacion` con validación R10 (entrada y salida), jornadas nocturnas
- [x] `lib/reglas/geocerca.ts` + `marcacion.ts` (ubicaciones, franja, R7, fecha nocturna) + tests
- [x] `lib/reglas/estados.ts` (R1) + tests
- [x] `lib/reglas/calculoHoras.ts` (R2) + tests
- [x] Prevención de duplicados (R7)
- [x] Permisos (R4): `/permisos` + sección en la ficha
- [x] Cierre diario (Vercel Cron → `/api/cierre-diario`) + faltas + notificaciones
- [x] Coordenadas del colegio cargadas (corregido el signo de la longitud)
- [ ] Prueba en celulares reales (Android + iPhone) — Hector, casos F13–F20
- [ ] Definir la fecha de inicio del control de asistencia (Ajustes › Marcación)

**🏁 Hito:** ✅ se marca un día completo con QR + GPS y el sistema calcula estados solo (2026-10-09, probado con cámara y GPS simulados).

## Semana 3 — PC de respaldo, reportes y dashboard ✅

- [x] `/asistencia/registro`: tabla del día + marcación asistida + hora manual (contingencia) + días anteriores
- [x] ~~`/kiosco` cédula + PIN~~ → descartado (D-37); en su lugar «Marca en secretaría» y «Cambiar de teléfono» en la ficha
- [x] `/asistencia/revision`: marcaciones señaladas
- [x] `/reportes/resumen` con filtros + `acumulados.ts` (R5) + tests
- [x] Export **PDF** (jsPDF) — planilla oficial y resumen del período
- [x] Export **Excel** (ExcelJS) — planilla oficial y resumen del período
- [x] `/panel` con KPIs y gráficas
- [x] `/notificaciones` (campana en la barra) y `/historial`

**🏁 Hito:** ✅ reportes listos y PC operativo como respaldo (2026-10-19).

## Semana 4 — PWA, pulido y despliegue

- [x] `manifest.webmanifest` + iconos (192, 512, maskable, apple-touch) + acceso directo «Marcar»
- [x] `sw.js` (app shell + red primero en HTML; API sin caché) + aviso de actualización (D-45)
- [x] Cuentas por cédula, contraseña inicial 0000 con cambio obligatorio y creación en lote (D-42)
- [x] Auditoría: seguridad (checklist RNF), rendimiento, accesibilidad → [[05-Entregables/Informe-de-auditoria]]
- [x] Deploy a Vercel + variables de entorno + cron
- [x] Lista de puesta en marcha en Ajustes + respaldo `npm run db:respaldo` (D-44)
- [x] `README.md` del repo
- [x] [[05-Entregables/Manual-de-usuario|Manual de usuario]] final + guías rápidas (personal y secretaría)
- [ ] Prueba en celulares reales: cámara, GPS, instalación (Android + iPhone) — Hector, F13–F20 y F35–F41
- [ ] Puesta en marcha: borrar demostración, QR definitivo, cuentas del personal, inicio del control — **lo decide la coordinación**
- [ ] Capacitación + entrega de la cuenta `directiva`
- [ ] Logo del colegio y escudo para el encabezado (pendiente del colegio)

- [x] Sensación de app (D-46 a D-50): navegación de una sola página, precarga, avisos en panel, panel lateral de la persona, acciones en ventanas con «Deshacer», formularios con botones, ficha por capas
- [ ] Prueba de usabilidad con personas del colegio → [[05-Entregables/Prueba-de-usabilidad]]

**🏁 Hito:** desarrollo listo (2026-10-19); falta la prueba en teléfonos reales, la puesta en marcha y la capacitación.

---

## Decisiones pendientes

| Decisión | Estado | Nota |
|---|---|---|
| Jornada y tolerancia concretas | 🟡 Configurable, valores pendientes | [[00-Inicio/Preguntas-para-el-colegio]] #1-2 |
| Coordenadas del colegio | 🟢 Cargadas | #14 |
| Administrador inicial | 🟡 Falta nombre/correo (paso 4 de la puesta en marcha) | #12 |
| Canal de notificaciones | ⬜ Pendiente | #6 |
| Formato de reportes | 🟡 Planilla oficial + resumen del período; se ajusta si el colegio entrega otro formato | #7 |
| Política de salida no registrada | 🟢 Sin horas + aviso a secretaría (D-35) | [[03-Diseno/Reglas-de-negocio]] R3 |

## Semáforo general

| Semana | Estado |
|---|---|
| 0 | 🟢 Terminada |
| 1 | 🟢 Terminada |
| 2 | 🟢 Terminada (falta prueba en celulares reales) |
| 3 | 🟢 Terminada |
| 4 | 🟡 Desarrollo terminado; faltan pruebas reales, puesta en marcha y capacitación |
