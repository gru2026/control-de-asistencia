# Diseño de una aplicación web progresiva de control de asistencia para el personal docente y administrativo de la U.E.E. General Rafael Urdaneta

**Servicio comunitario — Documentación completa del proyecto**

Fecha de generación: 2026-10-09

---

# Resumen ejecutivo

## Problema

En la U.E.E. General Rafael Urdaneta el registro y control de asistencia del personal docente y administrativo se realiza de forma **manual** (libros de actas y formatos físicos). Esto provoca:

- Lentitud en el registro diario.
- Errores humanos en la transcripción de datos.
- Deterioro o pérdida de los documentos físicos.
- Imposibilidad de generar reportes estadísticos rápidos para la directiva.

Resultado: un cuello de botella administrativo que consume horas de trabajo manual.

## Solución

Desarrollar una **aplicación web progresiva (PWA)** de control de asistencia que:

1. **Digitaliza** el registro de entrada y salida con hora automática.
2. **Automatiza** el cálculo de horas, tardanzas y faltas.
3. Ofrece **reportes** exportables (PDF/Excel) para la toma de decisiones.
4. Se instala en el celular del personal; cada marcación se valida con **QR impreso + GPS + hora del servidor**.
5. Usa el **PC del colegio** como centro de administración y respaldo (marcación asistida y kiosco con PIN).
6. Centraliza los datos **en tiempo real** con transparencia y disponibilidad inmediata.

## Stack tecnológico

| Capa | Elección | Motivo |
|---|---|---|
| Frontend + SSR | **Astro 7 + TypeScript** | Rápido, seguro (rutas protegidas), PWA-friendly |
| Estilos | **CSS puro** (variables, scoped CSS, Grid/Flex) | Sin dependencias pesadas |
| Backend / BDD / Auth | **Supabase** (Postgres + Auth + RLS) | Gratis, sin servidor propio |
| Hosting | **Vercel** (plan gratis) | Deploy automático desde Git |
| PWA | Manifest + Service Worker | Instalable; abre sin conexión |
| Reportes | SVG/CSS + jsPDF + SheetJS | Exportación sin frameworks pesados |

## Alcance clave

- **Roles:** directiva (administración del colegio), secretaria, personal (docentes y administrativos).
- **Módulos:** login, gestión de personal y jornadas configurables, QR imprimible, marcación con QR + GPS, aprobación de dispositivos, respaldo en el PC (asistido y kiosco), reportes PDF/Excel, dashboard y notificaciones.
- **Fuera de alcance:** asistencia de estudiantes (solo personal).

## Plan

4 semanas de desarrollo individual, por fases: (1) auth y personal, (2) marcación y reglas, (3) reportes y dashboard, (4) PWA, pulido y despliegue. Detalle en Cronograma.

## Estado

Decisiones principales cerradas con el colegio (2026-10-06) → Registro de decisiones. Repositorio y andamiaje creados. Pendientes: valores concretos de jornada, coordenadas y administrador inicial → Preguntas-para-el-colegio.

---

# Planteamiento del Problema

> **Texto base del proyecto**
> Redacción de lo general a lo específico: síntomas → causas → consecuencias → propuesta.

En la actualidad, la gestión administrativa en instituciones educativas requiere agilidad y precisión para garantizar un funcionamiento eficiente. Sin embargo, en la U.E.E. General Rafael Urdaneta, el proceso de registro y control de asistencia del personal docente y administrativo se realiza mediante métodos tradicionales y manuales (como libros de actas o formatos físicos).

Esta metodología presenta diversas deficiencias operativas. Entre ellas, la lentitud en el proceso de registro diario, la vulnerabilidad a errores humanos en la transcripción de datos, el deterioro o pérdida de los documentos físicos, y la dificultad para generar reportes estadísticos rápidos que permitan a la directiva tomar decisiones oportunas. Todo esto genera un cuello de botella administrativo, donde el personal invierte horas de trabajo manual que podrían optimizarse.

Como consecuencia, el colegio carece de un sistema centralizado y en tiempo real que garantice la transparencia y disponibilidad inmediata de los datos de asistencia. De continuar esta situación, la carga administrativa seguirá aumentando y los procesos de evaluación del personal seguirán siendo ineficientes.

Para solucionar esta problemática, surge la necesidad de desarrollar una aplicación web progresiva (PWA). Esta tecnología permite ofrecer una experiencia de usuario fluida, similar a la de una aplicación nativa, pero accesible desde cualquier navegador y dispositivo. Su implementación permitirá digitalizar el registro, automatizar el cálculo de horas y faltas, y proporcionar una interfaz gráfica intuitiva que facilite la adopción tecnológica por parte del personal, optimizando así toda la gestión administrativa del colegio.

---

## Desglose (síntomas → causas → consecuencias)

| Etapa | Contenido |
|---|---|
| **Síntomas** | Registro lento, errores de transcripción, documentos perdidos/deteriorados, reportes difíciles de obtener |
| **Causas** | Métodos manuales (libros de actas, formatos físicos), ausencia de sistema centralizado |
| **Consecuencias** | Cuello de botella administrativo, horas de trabajo manual, decisiones sin datos oportunos, evaluación ineficiente del personal |
| **Propuesta** | PWA que digitaliza el registro, automatiza cálculos y ofrece interfaz intuitiva |

## Preguntas de investigación

1. ¿Cuánto tiempo se invierte actualmente en el registro y consolidación de asistencia?
2. ¿Con qué frecuencia se cometen errores o se pierden registros físicos?
3. ¿Qué reportes necesita la directiva y con qué periodicidad?
4. ¿Qué tan rápida puede ser la adopción tecnológica del personal ante una PWA?

Ver también: Justificación y objetivos · Alcance y beneficiarios

---

# Justificación y Objetivos

## Justificación

El control de asistencia del personal es un insumo directo para la administración de recursos humanos del colegio: determina el cumplimiento de la jornada, respalda la evaluación del personal y sustenta decisiones de la directiva. Continuar con registros manuales implica pérdidas de tiempo, errores y falta de trazabilidad.

Una **aplicación web progresiva (PWA)** ofrece la oportunidad de resolver el problema con una solución de bajo costo (hosting y base de datos gratuitos), accesible desde cualquier dispositivo, instalable en los celulares del personal y funcional incluso con conectividad intermitente. Esto minimiza la barrera de adopción tecnológica y garantiza que la inversión de tiempo del equipo de desarrollo se traduzca en una herramienta sostenible para la institución.

## Objetivo general

Diseñar e implementar una aplicación web progresiva (PWA) que permita automatizar el registro y control de asistencia del personal docente y administrativo de la U.E.E. General Rafael Urdaneta, optimizando la gestión administrativa y la generación de reportes.

## Objetivos específicos

1. **Digitalizar** el registro diario de entrada y salida del personal con marca de tiempo automática.
2. **Implementar roles y autenticación** (directiva, secretaría y personal) con permisos diferenciados para garantizar el control de acceso.
3. **Automatizar el cálculo** de horas trabajadas, tardanzas, faltas y ausencias justificadas según las reglas institucionales.
4. **Desarrollar reportes** consultables y exportables (PDF/Excel) que permitan a la directiva tomar decisiones oportunas.
5. **Garantizar la autenticidad de cada marcación** mediante QR impreso, geolocalización y hora del servidor, con un solo teléfono por persona y respaldo en el PC del colegio.
6. **Proporcionar alertas** a la directiva sobre faltas y tardanzas, centralizando la información en tiempo real.

## Criterios de éxito

- Registro diario completo sin intervención de papel.
- Reporte mensual generado en menos de 1 minuto (antes: horas de trabajo manual).
- La app instalada y en uso por el personal en la primera semana del despliegue.
- Lighthouse ≥ 90 en PWA, rendimiento y accesibilidad.

Ver: Alcance y beneficiarios · Cronograma

---

# Alcance y Beneficiarios

## Dentro del alcance (v1)

- ✅ Autenticación con login y **roles**: directiva (admin), secretaria, personal (docentes y administrativos).
- ✅ **Gestión de personal** y **jornadas configurables** (horas, tolerancia, pausa, días laborables).
- ✅ **Marcación desde el celular propio** escaneando un **QR impreso** + **GPS** (geocerca) + hora del servidor, en entrada y salida.
- ✅ **Un celular por cuenta**, con aprobación de cambios de teléfono desde el PC.
- ✅ **PC del colegio** como centro de administración y respaldo: marcación asistida por secretaría y kiosco con cédula + PIN.
- ✅ **Cálculo automático**: horas trabajadas, tardanzas, faltas y permisos.
- ✅ **Reportes** con filtros exportables a **PDF y Excel**.
- ✅ **Dashboard** con KPIs y **notificaciones** in-app.
- ✅ **PWA instalable** que abre sin conexión (marcar requiere internet).
- ✅ Despliegue en internet (hosting gratuito).

## Fuera del alcance (v1)

- ❌ **Asistencia de estudiantes** (excluida — confirmado por el colegio el 2026-10-06).
- ❌ **Marcación sin internet** (cola offline) → v2.
- ❌ Notificaciones push.
- ❌ Control de acceso físico (puertas, biométrico, tarjetas).
- ❌ Nómina, pagos o cálculo de sueldos.
- ❌ Gestión de estudiantes, notas o académico.
- ❌ App nativa para tiendas (solo PWA instalable).
- ❌ Integración con correo electrónico externo (pendiente de decisión: ver pregunta 6).
- ❌ Múltiples sedes / multi-institución.

## Beneficiarios

| Beneficiario | Beneficio |
|---|---|
| **Directiva / Rectoría** | Reportes inmediatos, transparencia, datos en tiempo real para decisiones |
| **Personalista / Secretaría** | Menos trabajo manual, registro ágil, control centralizado del día |
| **Docentes y administrativos** | Marcaje rápido desde el celular, historial propio visible y claro |
| **Institución** | Reducción de errores, documentos digitales que no se pierden, base para futuras evaluaciones |

## Supuestos y restricciones

- El colegio provee los datos iniciales (personal, jornadas, correo del administrador).
- Se usan servicios con **plan gratuito** (Supabase, Vercel): límites de uso suficientes para una plantilla de escuela.
- Desarrollo a cargo de **una persona** con las funciones de diseño, desarrollo y pruebas.
- Plazo fijo: **4 semanas** (ver Cronograma-4-semanas).
- El colegio dispone de **un PC con internet**; cada miembro del personal tiene **teléfono con datos**.
- El QR se imprime y se pega en la entrada; la administración lo renueva cuando lo considere.

---

# 📅 Cronograma — 4 semanas

> **Modelo de trabajo**
> Desarrollo **individual**, por **funciones verticales completas**: cada fase entrega algo operable. Decisiones base en Registro de decisiones.

## Semana 1 — Cimientos, autenticación, personal y jornadas

| Día | Tarea | Entregable parcial |
|---|---|---|
| 1 | Repo Git, Astro + TypeScript (`output: server`), estructura, tokens CSS, ESLint/Prettier/Vitest | Andamiaje corriendo |
| 2 | Proyecto Supabase, migraciones (todas las tablas) + RLS + seed | Esquema en la nube |
| 3 | Login con Supabase Auth (`@supabase/ssr`), middleware por rol, usuarios de prueba | Login funcional |
| 4 | CRUD de personal (búsqueda + paginación) + cuentas | Gestión de personal |
| 5 | CRUD de jornadas + asignación + excepciones + `lib/reglas/jornada.ts` (R0) con tests | Jornadas configurables |

**Hito:** ✅ Login funcional, personal y jornadas configurables.

## Semana 2 — Marcación QR + GPS y reglas

| Día | Tarea | Entregable parcial |
|---|---|---|
| 1 | `/configuracion`: geocerca + `/configuracion/qr` (generar, regenerar, vencimiento, imprimir) | QR imprimible |
| 2 | Registro de dispositivos + aprobación/revocación en la ficha de personal | Un celular por cuenta |
| 3 | `/asistencia`: escáner QR + GPS + `/api/marcacion` (R10) + `geocerca.ts` con tests | Marcación por celular |
| 4 | `estados.ts` (R1) + `calculoHoras.ts` (R2) con tests; entrada/salida/duplicados (R7) | Motor de cálculo |
| 5 | Cierre diario (cron) + faltas + permisos + notificaciones in-app | Alertas automáticas |

**Hito:** ✅ Se marca un día completo con QR + GPS y el sistema calcula estados solo.

## Semana 3 — Respaldo en el PC, reportes y dashboard

| Día | Tarea | Entregable parcial |
|---|---|---|
| 1 | `/asistencia/registro`: tabla del día + marcación asistida + permisos + contingencia | Respaldo por secretaría |
| 2 | `/kiosco` (cédula + PIN, bloqueo) + gestión de PIN + `/asistencia/revision` | Kiosco y revisión |
| 3 | `/reportes` con filtros + `acumulados.ts` (R5) con tests | Consultas listas |
| 4 | Exportación **PDF** (jsPDF) y **Excel** (SheetJS) | Reportes descargables |
| 5 | `/panel` con KPIs + `/notificaciones` + `/historial` | Panel directivo |

**Hito:** ✅ La directiva obtiene reportes y el PC funciona como respaldo.

## Semana 4 — PWA, pulido y despliegue

| Día | Tarea | Entregable parcial |
|---|---|---|
| 1 | `manifest.webmanifest`, iconos, service worker (app shell), aviso de actualización | App instalable |
| 2 | Pruebas en celulares reales (Android + iPhone): cámara, GPS, instalación | UX móvil validada |
| 3 | Auditoría de seguridad/rendimiento/accesibilidad + correcciones | Calidad verificada |
| 4 | Deploy a Vercel, variables de entorno, cron, coordenadas reales, datos del colegio, QR impreso | App en línea |
| 5 | Manual de usuario + capacitación + entrega de la cuenta `directiva` | Proyecto entregado |

**Hito:** ✅ App en línea, instalada en los celulares y QR pegado en la entrada.

---

## Prioridades de corte (si se atrasa algo)

1. **MVP imprescindible:** login, personal, jornadas, QR + GPS, dispositivos, marcación entrada/salida, marcación asistida, estados/horas/faltas, reporte mensual PDF.
2. **Importante:** kiosco con PIN, revisión de señaladas, dashboard, notificaciones, Excel, feriados.
3. **Diferible:** gráficas SVG, franjas horarias, importación CSV, marcación offline (v2).

## Hitos resumidos

```
Semana 1 ──── Semana 2 ──── Semana 3 ──── Semana 4
  Auth +        QR + GPS +     PC respaldo +  PWA +
  Personal +    Reglas         Reportes       Deploy
  Jornadas
   [ ]           [ ]            [ ]           [ ]
```

Progreso real: Tareas por semana.

---

# Requisitos Funcionales

Prioridad: **MVP** (imprescindible) · **Importante** · **Diferible** (ver corte de emergencia). Decisiones de origen: Registro de decisiones.

## RF — Acceso y usuarios

| ID | Requisito | Prioridad |
|---|---|---|
| RF-01 | Iniciar sesión con correo y contraseña (Supabase Auth). | MVP |
| RF-02 | Distinguir 3 roles: **directiva**, **secretaria**, **personal**. | MVP |
| RF-03 | Redirigir al login a todo usuario no autenticado. | MVP |
| RF-04 | Las políticas RLS impiden ver o editar datos fuera del rol. | MVP |
| RF-05 | La directiva crea, edita y desactiva cuentas de usuario. | MVP |

## RF — Gestión de personal y jornadas

| ID | Requisito | Prioridad |
|---|---|---|
| RF-06 | CRUD de personal: nombre, apellido, cédula, cargo, teléfono, fecha de ingreso, estado. Lista con búsqueda y paginación. | MVP |
| RF-07 | CRUD de **plantillas de jornada** (entrada, salida, tolerancia, pausa, días laborables). | MVP |
| RF-08 | Asignar una jornada a cada persona y excepciones por día (`horarios`). | MVP |
| RF-09 | Registrar **feriados** y días no laborables. | Importante |
| RF-10 | Importar personal desde CSV. | Diferible |

## RF — Configuración y QR

| ID | Requisito | Prioridad |
|---|---|---|
| RF-35 | Configurar ubicación del colegio (lat/lng), radio y precisión máxima de la geocerca. | MVP |
| RF-36 | Generar el **QR de marcación** con vista de impresión (logo, QR, instrucciones). | MVP |
| RF-37 | **Regenerar** el QR: el anterior queda revocado al instante. Solo un QR activo. | MVP |
| RF-38 | Caducidad opcional del QR (sin vencimiento o fecha de vencimiento). | Importante |
| RF-39 | Franjas horarias opcionales para marcar entrada/salida. | Diferible |

## RF — Dispositivos

| ID | Requisito | Prioridad |
|---|---|---|
| RF-40 | Registrar el celular al primer inicio de sesión (aprobado automáticamente). | MVP |
| RF-41 | Un celular distinto queda **pendiente** y no puede marcar. | MVP |
| RF-42 | Secretaría/directiva **aprueban o revocan** dispositivos desde el PC; máximo uno aprobado por cuenta. | MVP |
| RF-43 | Notificar a secretaría cuando hay un dispositivo pendiente. | Importante |

## RF — Marcación de asistencia

| ID | Requisito | Prioridad |
|---|---|---|
| RF-11 | Marcar **entrada** escaneando el QR dentro de la app + GPS, con fecha/hora del servidor. | MVP |
| RF-12 | Marcar **salida** con la misma validación (QR + GPS). | MVP |
| RF-44 | Bloquear la marcación fuera del radio del colegio o sin permiso de ubicación. | MVP |
| RF-45 | Permitir y **señalar** la marcación cuando la precisión GPS es baja. | MVP |
| RF-13 | Marcación **asistida** desde el PC: secretaría marca a una persona (`registrado_por`). | MVP |
| RF-46 | Marcación **autoservicio** en el PC (`/kiosco`) con cédula + PIN. | Importante |
| RF-47 | Asignar/restablecer el PIN de una persona (secretaría/directiva). | Importante |
| RF-14 | Cargar **permisos** (rango de fechas, motivo, observación). | MVP |
| RF-15 | Prevenir duplicados: segunda entrada, salida sin entrada, segunda salida. | MVP |
| RF-48 | Pantalla de **revisión de marcaciones señaladas** (marcar como revisada). | Importante |
| RF-16 | Marcación **offline** con cola local y sincronización. | Diferible (v2) |
| RF-17 | Cierre automático diario: genera **falta** a quien no marcó y no tiene permiso. | MVP |

## RF — Cálculos automáticos

| ID | Requisito | Prioridad |
|---|---|---|
| RF-18 | Calcular **horas trabajadas** (salida − entrada − pausa) y su acumulado. | MVP |
| RF-19 | Marcar **tarde** si la entrada supera hora esperada + tolerancia. | MVP |
| RF-20 | Clasificar cada día: presente, tarde, falta, permiso. | MVP |
| RF-21 | Calcular % de asistencia, tardanzas y faltas por período. | MVP |
| RF-22 | Horas extras según política institucional. | Diferible |

## RF — Reportes

| ID | Requisito | Prioridad |
|---|---|---|
| RF-23 | Reporte por **persona** con rango de fechas. | MVP |
| RF-24 | Reporte **general/mensual** de todo el personal. | MVP |
| RF-25 | Exportar a **PDF**. | MVP |
| RF-26 | Exportar a **Excel** (xlsx). | Importante |
| RF-27 | Dashboard con KPIs: presentes hoy, tardanzas del mes, faltas del mes, señaladas pendientes. | Importante |
| RF-28 | Gráficas de asistencia mensual (SVG). | Diferible |

## RF — Notificaciones

| ID | Requisito | Prioridad |
|---|---|---|
| RF-29 | Alerta in-app por falta, tardanza, marcación señalada o dispositivo pendiente. | Importante |
| RF-30 | Centro de notificaciones con leída/no leída. | Importante |
| RF-31 | Notificación por correo (si se decide). | Diferible |

## RF — PWA

| ID | Requisito | Prioridad |
|---|---|---|
| RF-32 | App **instalable** (manifest + iconos) en Android/iOS/escritorio. | MVP |
| RF-33 | La app abre sin conexión (app shell) y muestra "Sin conexión" al intentar marcar. | Importante |
| RF-34 | Interfaz **mobile-first** para la marcación; vistas de administración optimizadas para el PC. | MVP |

Ver: No funcionales · Roles y permisos

---

# Requisitos No Funcionales

## Rendimiento

| ID | Requisito | Meta |
|---|---|---|
| RNF-01 | Tiempo de carga de la app (primera visita, 4G) | < 3 s |
| RNF-02 | Respuesta de la marcación (confirmación visible) | < 1 s |
| RNF-03 | Generación de reporte mensual | < 5 s |
| RNF-04 | Lighthouse: rendimiento, accesibilidad, PWA | ≥ 90 |

## Disponibilidad y offline

| ID | Requisito |
|---|---|
| RNF-05 | La app debe **abrirse sin internet** (app shell cacheada) y avisar claramente que marcar requiere conexión. Marcación offline → v2 (ver D-09). |
| RNF-06 | Ninguna marcación se duplica: unique `(personal_id, fecha)` y el endpoint de marcación es idempotente ante reintentos. |
| RNF-07 | Hosting con disponibilidad del plan Vercel; plan gratis de Supabase suficiente para la plantilla. |

## Seguridad

| ID | Requisito |
|---|---|
| RNF-08 | Todas las rutas privadas protegidas por middleware de sesión. |
| RNF-09 | Acceso a datos gobernado por **RLS** (mínimo privilegio por rol). |
| RNF-10 | Contraseñas manejadas por Supabase Auth (nunca en texto plano ni en el cliente). |
| RNF-11 | Claves (`SUPABASE_SECRET_KEY`, `CRON_SECRET`) solo en variables de entorno, jamás en el repo. |
| RNF-12 | La hora de marcación se toma del **servidor**, no del reloj del dispositivo (evita trampas). |
| RNF-13 | Registrar quién marcó por tercero (campo `registrado_por`). |
| RNF-27 | El código QR y los PIN se guardan solo como **hash**; el QR es aleatorio de ≥ 128 bits. |
| RNF-28 | La validación de QR, geocerca y dispositivo ocurre **en el servidor**; el cliente solo envía datos. |
| RNF-29 | El PIN del kiosco se bloquea 15 min tras 5 intentos fallidos. |
| RNF-30 | La ubicación se guarda solo al marcar (no hay rastreo continuo) y solo la ven directiva/secretaría. |

## Usabilidad y accesibilidad

| ID | Requisito |
|---|---|
| RNF-14 | Interfaz en **español**, sin jerga técnica visible para el usuario final. |
| RNF-15 | Mobile-first: botones grandes, contraste suficiente, funciona con un solo pulgar. |
| RNF-16 | Cumplir WCAG 2.1 nivel AA básico (contraste, etiquetas de formulario, navegación por teclado). |
| RNF-17 | Adopción simple: abrir la app → "Marcar" → escanear QR → confirmación (≤ 3 toques, < 10 s). |

## Mantenibilidad

| ID | Requisito |
|---|---|
| RNF-18 | ESLint + Prettier activos desde el inicio; código sin errores de lint en CI. |
| RNF-19 | Reglas de negocio en módulos puros (`lib/reglas/`) con **pruebas unitarias** (Vitest). |
| RNF-20 | Componentes reutilizables UI (botón, tabla, modal) y estilos con CSS variables centralizadas. |
| RNF-21 | Documentación actualizada en este vault; README en el repositorio. |

## Datos y privacidad

| ID | Requisito |
|---|---|
| RNF-22 | Solo se almacenan los datos personales estrictamente necesarios (a confirmar, ver Preguntas). |
| RNF-23 | Los reportes solo son visibles para roles autorizados (directiva/secretaría). |
| RNF-24 | Respaldo: exportación periódica de la base de datos (plan manual o pg_dump). |

## Compatibilidad

| ID | Requisito |
|---|---|
| RNF-25 | Navegadores: Chrome/Edge/Firefox actuales y Safari (iOS ≥ 16). |
| RNF-26 | Tamaños de pantalla: 360 px → 1920 px. |
| RNF-31 | Cámara y GPS requieren **HTTPS** y permiso del usuario (Vercel provee HTTPS). |

---

# Roles y Permisos

## Matriz de roles

| Capacidad | Directiva (admin) | Secretaría | Personal (docente / administrativo) |
|---|:---:|:---:|:---:|
| Iniciar sesión | ✅ | ✅ | ✅ |
| Marcar **su propia** entrada/salida (QR + GPS) | ✅ | ✅ | ✅ |
| Marcación **asistida** en el PC (por otros) | ✅ | ✅ | ❌ |
| Marcarse en el **kiosco** del PC (cédula + PIN) | ✅ | ✅ | ✅ |
| Cargar permisos | ✅ | ✅ | ❌ |
| Aprobar / revocar **dispositivos** | ✅ | ✅ | ❌ |
| Asignar / restablecer **PIN** | ✅ | ✅ | ❌ |
| Revisar marcaciones **señaladas** | ✅ | ✅ | ❌ |
| CRUD de personal | ✅ | 👁️ solo lectura | ❌ |
| Gestionar **jornadas**, tolerancias y feriados | ✅ | ❌ | ❌ |
| Generar / regenerar / imprimir el **QR** | ✅ | ❌ | ❌ |
| Configuración (geocerca, franjas, kiosco) | ✅ | ❌ | ❌ |
| Ver **reportes de todos** | ✅ | ✅ | ❌ |
| Ver **su propio historial** | ✅ | ✅ | ✅ |
| Dashboard / KPIs globales | ✅ | ✅ | ❌ |
| Centro de notificaciones | ✅ | ✅ | solo las suyas |
| Crear/editar usuarios y roles | ✅ | ❌ | ❌ |

## Definición de cada rol

### 🔷 Directiva (rol `directiva`)
La **administración real del colegio** (rectoría, coordinación o personalista). Acceso total: personal, jornadas, configuración, QR, usuarios y reportes. Trabaja desde el **PC del colegio**. Único rol que crea usuarios y genera el QR.

### 🔶 Secretaría (rol `secretaria`)
Encargada del registro diario desde el PC: marcación asistida, permisos, aprobación de cambios de teléfono, PIN del kiosco, revisión de marcaciones señaladas, reportes y dashboard. No administra usuarios ni configuración.

### 🟢 Personal (rol `personal`)
Docentes y personal administrativo. Marcan entrada/salida desde **su propio celular** (QR + GPS) o en el kiosco del PC, y consultan **únicamente** su historial.

> **El desarrollador no es administrador en producción**
> Tras el despliegue, la cuenta `directiva` pertenece al colegio. El desarrollador conserva acceso técnico a Supabase solo para soporte.

## Implementación (Supabase RLS)

Función auxiliar: `public.rol_actual()` → lee `usuarios.rol` de `auth.uid()`.

| Tabla | Lectura | Escritura |
|---|---|---|
| `usuarios` | directiva, secretaria · cada uno su perfil | directiva |
| `personal` | directiva, secretaria · personal: el suyo | directiva |
| `jornadas`, `horarios`, `feriados` | todos los autenticados | directiva |
| `configuracion` | todos los autenticados (sin datos secretos) | directiva |
| `codigos_qr` | directiva (sin `token_hash` expuesto al cliente) | solo servidor (endpoint) |
| `dispositivos` | directiva, secretaria · personal: los suyos | solo servidor (registro) · directiva/secretaria (aprobar/revocar) |
| `registros_asistencia` | directiva, secretaria · personal: los suyos | **solo servidor** (endpoint de marcación con clave de servicio); nadie borra |
| `permisos` | directiva, secretaria · personal: los suyos | directiva, secretaria |
| `notificaciones` | destinatario | servidor · destinatario (marcar leída) |

> **Regla de oro**
> El cliente **nunca** decide el rol, la hora, ni si el QR/GPS es válido. Todo se valida en el servidor (endpoint + RLS con `auth.uid()`). Las marcaciones no se insertan directo desde el navegador.

Ver: Arquitectura · Requisitos funcionales

---

# 🧭 Registro de decisiones (ADR)

Decisiones cerradas del proyecto. **Si algo cambia, se agrega una nueva fila** (no se borra la anterior: se marca como "Reemplazada").

> **Regla**
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
| D-20 | 2026-10-08 | Nombre del producto: **GRU-system**; ícono con las iniciales "GRU" en la paleta del proyecto | ✅ Vigente |
| D-21 | 2026-10-08 | Escritorio = **PWA instalada desde Edge/Chrome** (Windows 10). Se descartan Electron y Tauri | ✅ Vigente |
| D-22 | 2026-10-08 | Interfaz: estilo Minimalismo/Swiss, íconos SVG de una sola familia (Lucide), sin emojis; fuentes del sistema | ✅ Vigente |
| D-23 | 2026-10-08 | Personal clasificado por **categoría** (oficio, configurable) y **vínculo** (fijo/contratado/suplente) + carga horaria | ✅ Vigente |
| D-24 | 2026-10-08 | **Jornadas nocturnas** (cruzan medianoche) para vigilancia | ✅ Vigente |
| D-25 | 2026-10-08 | Reportes PDF/Excel con el **formato de la planilla oficial**; sin columnas de firma (solo firma la dirección al pie) | ✅ Vigente |
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

Ver: Modelo de datos · Reglas de negocio · Preguntas

---

# Arquitectura y Stack

## Diagrama general

```
┌──────────────────────────────┐   ┌──────────────────────────────┐
│ 📱 CELULAR del personal      │   │ 🖥️ PC DEL COLEGIO            │
│ PWA instalada                │   │ Administración (directiva /  │
│ · Escáner QR (cámara)        │   │   secretaria)                │
│ · GPS                        │   │ · Marcación asistida         │
│ · dispositivo_uid            │   │ · Kiosco cédula + PIN        │
└──────────────┬───────────────┘   └──────────────┬───────────────┘
               │ HTTPS                             │ HTTPS
               └────────────────┬──────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────┐
│  VERCEL — Astro (SSR / output: server)                      │
│  · middleware.ts: sesión + roles (rutas protegidas)         │
│  · /api/marcacion: valida QR + GPS + dispositivo + reglas   │
│  · /api/kiosco: valida cédula + PIN                         │
│  · Cron diario: cierre de jornada + faltas + alertas        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS (cliente oficial)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  SUPABASE (nube)                                            │
│  · PostgreSQL · Auth · RLS por rol                          │
└─────────────────────────────────────────────────────────────┘

🖨️ QR impreso en la entrada (código fijo, regenerable)
```

## Stack elegido y por qué

| Capa | Tecnología | Justificación |
|---|---|---|
| Framework | **Astro 7 + TypeScript** | SSR para proteger rutas, rápido, zero-JS por defecto |
| Adaptador | **@astrojs/vercel** | Despliegue serverless en Vercel |
| Estilos | **CSS puro** (variables + scoped CSS + Grid/Flex) | Sin frameworks pesados |
| Base de datos | **Supabase (PostgreSQL)** | Plan gratis, sin servidor propio |
| Autenticación | **Supabase Auth** + `@supabase/ssr` | Sesión por cookies, compatible con SSR |
| Seguridad | **RLS** + validación en endpoints | El cliente nunca decide rol, hora ni validez |
| Hosting | **Vercel** (plan gratis) | Deploy desde Git, HTTPS automático, cron diario |
| PWA | Manifest + Service Worker propio | Instalable, app shell offline |
| QR | `qrcode` (generar) · `BarcodeDetector` / `jsQR` (leer) | Ligeras, sin servicios externos |
| Reportes | jsPDF (PDF) + SheetJS (Excel) | Exportación en el navegador |
| Pruebas | **Vitest** | Unitarias de `lib/reglas/` |

## Decisiones técnicas clave

Lista completa en Registro de decisiones.

1. **SSR** → proteger rutas con sesión real desde el servidor.
2. **Supabase** en lugar de backend propio → plazo de 4 semanas.
3. **CSS puro** → design tokens + componentes UI reutilizables.
4. **Service worker propio** → app pequeña, control total.
5. **Hora del servidor** para toda marcación.
6. **Validación QR + GPS + dispositivo en el servidor**.
7. **Módulos de reglas puros** (`lib/reglas/`) → testeables sin UI ni BD.

## Flujo de una marcación por celular

```
Usuario toca "Marcar entrada"
   → app: comprueba conexión → pide GPS → abre cámara → lee el QR
   → POST /api/marcacion { tipo, codigo_qr, lat, lng, precision, dispositivo_uid }
   → middleware: sesión válida
   → servidor (R10):
        dispositivo aprobado? → hash(codigo) = QR activo y vigente?
        día laborable? → franja? → distancia ≤ radio? → precisión ok? (si no: señalar)
        duplicado?
   → hora = ahora (servidor) · aplica R0/R1 · guarda registro + evidencia
   → respuesta → UI: "Entrada 07:04 ✓ Presente"
```

## Flujo en el PC (respaldo)

```
Asistido: secretaria → /asistencia/registro → "Marcar" en la fila
          → POST /api/marcacion-asistida → metodo = asistido, registrado_por

Kiosco:   persona → /kiosco → cédula + PIN
          → POST /api/kiosco → verifica dispositivo kiosco + PIN (hash, bloqueo)
          → metodo = kiosco
```

## Sin conexión

La app abre (app shell), pero **no marca**: muestra *"Sin conexión"*. Contingencia por secretaría desde el PC. Detalle en PWA y offline.

Ver: Modelo de datos · Estructura de carpetas

---

# Modelo de Datos

Base de datos **PostgreSQL** en Supabase. Diez tablas. Decisiones de origen en Registro de decisiones.

## Diagrama de relaciones (ERD simplificado)

```
auth.users (Supabase)
      │ 1:1
      ▼
  usuarios ───────────────┬──────────────┐
      │ 1:0..1            │ 1:N          │ 1:N
      ▼                   ▼              ▼
   personal ──N:1──► jornadas      notificaciones
      │ 1:N   │ 1:N
      ▼       ▼
  horarios  dispositivos
  (excepc.)
      │
  personal 1:N ──► registros_asistencia ──N:1──► codigos_qr
                         │ N:1                  
                         ▼                      
                    dispositivos                

  permisos ──N:1──► personal
  configuracion (1 fila) · feriados (independiente)
```

## Tablas

### `usuarios`
Extiende `auth.users` de Supabase.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | = `auth.users.id` |
| `nombre`, `apellido` | text | |
| `email` | text | Correo (login) |
| `rol` | text | `directiva` \| `secretaria` \| `personal` |
| `estado` | text | `activo` \| `inactivo` |
| `creado_en` | timestamptz | Default `now()` |

### `personal`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `usuario_id` | uuid FK → usuarios, unique, null | NULL si aún no tiene cuenta |
| `nombre`, `apellido` | text | |
| `cedula` | text unique | Usada también en el kiosco |
| `categoria_id` | uuid FK → categorias | Oficio (Docente, Secretaría, Cocina, Obrero, Vigilancia…) |
| `vinculo` | text | `fijo` \| `contratado` \| `suplente` |
| `carga_horaria` | int null | Horas semanales (columna de la planilla oficial) |
| `origen` | text | `manual` \| `importado` |
| `telefono` | text | Opcional |
| `jornada_id` | uuid FK → jornadas | Plantilla de horario asignada |
| `pin_hash` | text null | PIN del kiosco (hash, nunca en claro) |
| `pin_intentos` | int | Default 0 (bloqueo a los 5) |
| `pin_bloqueado_hasta` | timestamptz null | |
| `fecha_ingreso` | date | |
| `estado` | text | `activo` \| `inactivo` (nunca borrado físico) |
| `creado_en` | timestamptz | |

### `categorias`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `nombre` | text unique | Docente, Secretaría, Cocina, Obrero, Vigilancia, Otro |
| `planilla` | text | `docentes` \| `personal` (planilla oficial donde aparece) |
| `color` | text | Color en tablas y gráficas |
| `jornada_sugerida_id` | uuid FK → jornadas null | Se propone al registrar personal |
| `orden`, `activa` | int, bool | |

### `jornadas` (plantillas configurables)
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `nombre` | text unique | Ej. "Docente mañana", "Administrativo" |
| `hora_entrada` | time | Ej. 07:00 |
| `hora_salida` | time | Ej. 16:00 |
| `tolerancia_min` | int | Ej. 15 |
| `pausa_min` | int | Minutos de almuerzo a descontar (default 0) |
| `dias_laborables` | int[] | 1=lunes … 7=domingo. Default `{1,2,3,4,5}` |
| `activa` | bool | |
| `nocturna` | bool | La salida ocurre al día siguiente |

### `horarios` (excepciones por persona y día)
Opcional: sobrescribe la jornada para un día concreto de la semana.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `personal_id` | uuid FK → personal | |
| `dia_semana` | int | 1–7 |
| `hora_entrada`, `hora_salida` | time | |
| `tolerancia_min` | int null | NULL = usar la de la jornada |
| `libre` | bool | true = ese día no trabaja |

Unique `(personal_id, dia_semana)`.

### `configuracion` (una sola fila)
| Campo | Tipo | Default | Descripción |
|---|---|---|---|
| `id` | int PK | 1 | check `id = 1` |
| `nombre_institucion` | text | U.E.E. General Rafael Urdaneta | Encabezado de reportes |
| `colegio_lat`, `colegio_lng` | float8 | — | Centro de la geocerca |
| `radio_m` | int | 150 | Radio permitido |
| `precision_max_m` | int | 100 | Por encima → marcación señalada |
| `geocerca_activa` | bool | true | |
| `franja_entrada_desde`, `franja_entrada_hasta` | time null | null | Ventana opcional para marcar entrada |
| `franja_salida_desde`, `franja_salida_hasta` | time null | null | Ventana opcional para marcar salida |
| `kiosco_pin_activo` | bool | true | Autoservicio con PIN en el PC |
| `hora_cierre_diario` | time | 18:00 | Referencia del cron |
| `zona_horaria` | text | America/Caracas | |
| `actualizado_en`, `actualizado_por` | | | Auditoría |

### `codigos_qr`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `token_hash` | text unique | SHA-256 del código impreso |
| `descripcion` | text | Ej. "Entrada principal — oct 2026" |
| `activo` | bool | **Solo uno activo** (índice único parcial) |
| `vigente_hasta` | date null | NULL = sin vencimiento |
| `creado_por` | uuid FK → usuarios | |
| `creado_en`, `revocado_en` | timestamptz | |

```sql
create unique index uq_un_qr_activo on codigos_qr (activo) where activo;
```

### `dispositivos`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `usuario_id` | uuid FK → usuarios | |
| `dispositivo_uid` | text | uuid generado en el navegador |
| `tipo` | text | `celular` \| `kiosco` |
| `descripcion` | text | User-agent resumido ("Android · Chrome") |
| `estado` | text | `aprobado` \| `pendiente` \| `revocado` |
| `aprobado_por` | uuid FK → usuarios null | |
| `creado_en`, `aprobado_en`, `ultimo_uso` | timestamptz | |

Regla: **máximo un `celular` aprobado por usuario** (índice único parcial).

```sql
create unique index uq_un_celular_aprobado
  on dispositivos (usuario_id) where estado = 'aprobado' and tipo = 'celular';
```

### `registros_asistencia`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `personal_id` | uuid FK → personal | |
| `fecha` | date | Día (zona horaria del colegio) |
| `hora_entrada` | timestamptz null | **Hora del servidor** |
| `hora_salida` | timestamptz null | **Hora del servidor** |
| `hora_esperada_entrada` | time | Copia de la regla aplicada ese día |
| `hora_esperada_salida` | time | Copia |
| `tolerancia_aplicada` | int | Copia (minutos) |
| `pausa_aplicada` | int | Copia (minutos) |
| `estado` | text | `presente` \| `tarde` \| `falta` \| `permiso` |
| `horas_trabajadas` | numeric(5,2) | Calculado al marcar salida / cierre |
| `salida_no_registrada` | bool | true si el cierre la completó |
| **Evidencia entrada** | | |
| `entrada_metodo` | text | `qr` \| `asistido` \| `kiosco` \| `manual` |
| `entrada_lat`, `entrada_lng` | float8 null | |
| `entrada_precision_m` | int null | |
| `entrada_qr_id` | uuid FK → codigos_qr null | |
| `entrada_dispositivo_id` | uuid FK → dispositivos null | |
| **Evidencia salida** | | (mismos campos con prefijo `salida_`) |
| `senalado` | bool | Requiere revisión (GPS impreciso, etc.) |
| `motivo_senal` | text null | Ej. "precisión GPS 180 m" |
| `revisado_por` | uuid null | Directiva/secretaría que revisó |
| `observacion` | text | Notas, "falla de conexión", etc. |
| `registrado_por` | uuid FK → usuarios | Quién registró (propio o tercero) |
| `creado_en`, `actualizado_en` | timestamptz | |

**Restricción:** unique `(personal_id, fecha)` — un registro por persona por día.

### `permisos`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `personal_id` | uuid FK → personal | |
| `fecha_desde`, `fecha_hasta` | date | Rango del permiso |
| `motivo` | text | Enfermedad, duelo, comisión… |
| `observacion` | text | |
| `creado_por` | uuid FK → usuarios | Directiva/secretaría |
| `creado_en` | timestamptz | |

### `notificaciones`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `usuario_destino` | uuid FK → usuarios | |
| `tipo` | text | `falta` \| `tarde` \| `senalado` \| `dispositivo` \| `sistema` |
| `mensaje` | text | Ej. "Juan Pérez no registró entrada el 03/10" |
| `enlace` | text null | Ruta relacionada |
| `leida` | bool | Default false |
| `fecha` | timestamptz | Default `now()` |

### `feriados`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `fecha` | date unique | |
| `descripcion` | text | |

## Índices recomendados

```sql
create index idx_asistencia_fecha       on registros_asistencia (fecha);
create index idx_asistencia_senalado    on registros_asistencia (senalado) where senalado;
create index idx_permisos_personal      on permisos (personal_id, fecha_desde, fecha_hasta);
create index idx_dispositivos_usuario   on dispositivos (usuario_id, estado);
create index idx_notif_destino          on notificaciones (usuario_destino, leida);
```

## Enumeraciones

- **Rol:** `directiva` · `secretaria` · `personal`
- **Cargo:** `docente` · `administrativo` · `otro`
- **Estado asistencia:** `presente` · `tarde` · `falta` · `permiso`
- **Método de marcación:** `qr` · `asistido` · `kiosco` · `manual`
- **Estado dispositivo:** `aprobado` · `pendiente` · `revocado`

> **Resolución de la jornada de un día**
> `horarios` (excepción del día) → si no hay, `jornadas` de la persona → si el día no está en `dias_laborables` o es feriado → **no laborable**.

Ver: Reglas de negocio · Roles y permisos (RLS)

---

# Reglas de Negocio

> **Valores configurables**
> Jornada, tolerancia, pausa, radio de geocerca y franjas horarias **no están fijos en el código**: se leen de `jornadas`, `horarios` y `configuracion` (ver Modelo de datos). Los ejemplos usan los valores por defecto: **07:00–16:00, tolerancia 15 min, radio 150 m**. Los marcados con 🔶 siguen pendientes con el colegio.

## R0 · Resolución de la jornada del día

```
1. ¿Es feriado?                         → día no laborable
2. ¿Hay excepción en horarios(persona, día_semana)?
      libre = true                      → día no laborable
      sino                              → usar sus horas (tolerancia NULL → la de la jornada)
3. ¿El día está en jornada.dias_laborables? → usar la jornada
4. Si no                                → día no laborable
```

Al marcar entrada, la regla resultante se **copia** en el registro (`hora_esperada_*`, `tolerancia_aplicada`, `pausa_aplicada`). Cambios posteriores de configuración **no alteran** días pasados.

## R1 · Clasificación al marcar entrada

```
si hora_entrada ≤ hora_esperada + tolerancia  →  "presente"
si hora_entrada >  hora_esperada + tolerancia →  "tarde"
si no marcó y tiene permiso (al cierre)       →  "permiso"
si no marcó y no tiene permiso (al cierre)    →  "falta"
```

| Hora real (esperada 07:00, tol. 15) | Resultado |
|---|---|
| 06:55 | presente |
| 07:15 | presente (límite exacto) |
| 07:16 | **tarde** |
| 09:30 | tarde (o bloqueada si hay franja de entrada configurada) |

## R2 · Horas trabajadas

```
horas_trabajadas = (hora_salida − hora_entrada − pausa_aplicada) en horas, 2 decimales
```

- Ejemplo: 07:03 → 16:00, pausa 0 → 8.95 h.
- Salida anterior a la entrada → error controlado (no se guarda).
- Sin salida al cierre → ver R3.

## R3 · Cierre automático diario (cron)

Se ejecuta una vez al día después de la jornada (`configuracion.hora_cierre_diario`):

1. Para cada persona **activa** con día laborable (R0) **sin registro**:
   - ¿Tiene permiso que cubre la fecha? → `permiso`.
   - Si no → `falta` + **notificación** a directiva y secretaría.
2. Registros con entrada pero **sin salida**: `salida_no_registrada = true`, `horas_trabajadas = null` y notificación a secretaría para completarla manualmente con observación 🔶 (política por confirmar).
3. Debe ser **idempotente**: ejecutarlo dos veces no duplica faltas ni notificaciones.

## R4 · Permisos

- Solo directiva/secretaría crean permisos (rango de fechas + motivo + observación).
- Un permiso hace que el día quede como `permiso` (no cuenta como falta).
- Si la persona ya tenía registro `falta` para ese día, al cargar el permiso pasa a `permiso`.

## R5 · Acumulados por período

```
días_laborables  = días del período laborables según R0 (excluye feriados)
% asistencia     = (presente + tarde + permiso) / días_laborables × 100
total_horas      = Σ horas_trabajadas
total_tardanzas  = count(estado = "tarde")
total_faltas     = count(estado = "falta")
marcaciones_pc   = count(entrada_metodo ∈ {asistido, kiosco, manual})
```

- Período por defecto: mes actual; también rango libre.

## R6 · Conectividad (sin marcación offline en v1)

- **Marcar requiere internet.** Sin conexión la app informa y no guarda nada localmente.
- Toda marcación usa **hora del servidor**.
- Contingencia por caída de internet: secretaría registra desde el PC (`metodo = manual`, observación *"falla de conexión"*). Al ser registro de tercero, la hora puede indicarse manualmente y queda `registrado_por`.
- v2: cola offline (ver D-09).

## R7 · Duplicados y orden

- Un solo registro por `(personal_id, fecha)`.
- Segunda **entrada** el mismo día → rechazada: *"Ya registró su entrada hoy a las 07:04."*
- **Salida** sin entrada → rechazada.
- Segunda **salida** → rechazada.

## R8 · Horas extras 🔶

- Diferible. Minutos fuera de la jornada esperada se podrán reportar aparte si el colegio lo define.

## R9 · Seguridad de roles

- Quien marca por otro queda en `registrado_por`.
- Ninguna escritura sin sesión válida (middleware + RLS). Las marcaciones se escriben **solo desde el servidor** (endpoint), nunca directo desde el navegador a la tabla.

## R10 · Validación de la marcación por celular (entrada y salida)

Orden de verificación en el servidor; el primer fallo detiene el proceso:

| # | Verificación | Si falla |
|---|---|---|
| 1 | Sesión válida y persona activa | 401 / *"Su cuenta está inactiva."* |
| 2 | Dispositivo `aprobado` para la cuenta | *"Este teléfono está pendiente de aprobación por secretaría."* |
| 3 | Código QR = QR activo y no vencido (hash) | *"Código QR no válido. Escanee el QR vigente de la entrada."* |
| 4 | Día laborable (R0) | *"Hoy no es día laborable para usted."* |
| 5 | Franja horaria (si está configurada) | *"Fuera del horario permitido para marcar."* |
| 6 | Ubicación recibida | *"Active la ubicación para marcar."* |
| 7 | Distancia al colegio ≤ `radio_m` | ❌ *"Debe estar en el colegio para marcar."* |
| 8 | Precisión ≤ `precision_max_m` | ✅ se permite, pero `senalado = true` |
| 9 | R7 (duplicados/orden) | Mensaje de R7 |

Distancia: fórmula de **Haversine** entre (lat, lng) recibidos y (`colegio_lat`, `colegio_lng`).

Si pasa todo → se guarda con hora del servidor, evidencia (lat, lng, precisión, qr_id, dispositivo_id) y estado según R1.

## R11 · Dispositivos

- Primer celular de una cuenta → `aprobado` automáticamente.
- Celular distinto → `pendiente` + notificación a secretaría.
- Al aprobar uno nuevo, el anterior pasa a `revocado` (máximo **uno** aprobado).
- Solo directiva/secretaría aprueban o revocan.

## R12 · Marcación en el PC (respaldo)

- **Asistido:** secretaría/directiva marca a la persona → `metodo = asistido`, sin QR ni GPS, con `registrado_por`.
- **Kiosco (autoservicio):** cédula + PIN en `/kiosco` desde el dispositivo de tipo `kiosco` aprobado → `metodo = kiosco`.
  - 5 PIN erróneos → bloqueo de 15 min.
  - Aplica R0, R1, R7 igual que el celular.

## R13 · Código QR

- Solo un QR activo. Generar uno nuevo revoca el anterior.
- `vigente_hasta` opcional; al vencer, deja de validar y se notifica a directiva.
- El código es aleatorio (≥ 128 bits); en BD solo su hash SHA-256.

---

**Implementación:** funciones puras en `src/lib/reglas/` (`jornada.ts`, `estados.ts`, `calculoHoras.ts`, `acumulados.ts`, `geocerca.ts`) con pruebas Vitest — ver Plan-de-pruebas.

---

# Mapa de Pantallas

Dos contextos de uso:
- 📱 **Celular** del personal → marcar y ver su historial (mobile-first).
- 🖥️ **PC del colegio** → administración y respaldo de marcación (escritorio).

## Árbol de rutas

```
/login                          Autenticación (pública)

📱 Celular
/asistencia                     Marcar entrada/salida (escáner QR + GPS)
/historial                      Su asistencia personal

🖥️ PC (directiva / secretaria)
/panel                          Dashboard con KPIs
/asistencia/registro            Tabla del día + marcación asistida + permisos
/asistencia/revision            Marcaciones señaladas ⚠️
/personal                       Lista de personal (búsqueda + paginación)
/personal/nuevo                 [directiva] Alta
/personal/[id]                  Ficha: datos, jornada, dispositivos, PIN, resumen
/jornadas                       [directiva] Plantillas de jornada + feriados
/reportes                       Reportes + exportación PDF/Excel
/notificaciones                 Centro de alertas
/configuracion                  [directiva] Institución, geocerca, franjas, kiosco
/configuracion/qr               [directiva] Generar / regenerar / imprimir QR
/configuracion/usuarios         [directiva] Cuentas y roles

🖥️ Kiosco (solo en el PC autorizado)
/kiosco                         Autoservicio: cédula + PIN → entrada/salida
```

> **Protección**
> Todo excepto `/login` pasa por `middleware.ts`: sin sesión → `/login`; sin permiso → 403 amigable. `/kiosco` exige además que el navegador sea un dispositivo tipo `kiosco` aprobado.

## Detalle por pantalla

### `/login`
- Correo + contraseña, mensaje de error claro.
- Redirige según rol: directiva/secretaria → `/panel`; personal → `/asistencia`.
- Al entrar, registra el dispositivo (ver D-07).

### `/asistencia` — Marcación ⭐ (celular)
- Saludo + fecha + hora en vivo + jornada del día ("Entrada 07:00 · tolerancia 15 min").
- **Botón grande** según estado:
  - Sin entrada → verde **"Marcar entrada"**
  - Con entrada → muestra la hora + naranja **"Marcar salida"**
  - Ambas → resumen ("Entrada 07:04 · Salida 16:01 ✓")
- Al tocar: pide **ubicación** → abre **cámara** con visor → al leer el QR envía al servidor → confirmación grande (✅ Presente / 🟨 Tarde) o error claro.
- Estados especiales:
  - 📵 Sin conexión: *"Conéctese para marcar o diríjase a secretaría."*
  - ⏳ Teléfono pendiente de aprobación.
  - 📍 Ubicación desactivada (con pasos para activarla).
- Últimos 5 días con su estado.

### `/historial` (celular)
- Lista/calendario del mes con estados y totales. Solo lo propio.

### `/panel` — Dashboard (PC)
- KPIs: presentes hoy · tardanzas del mes · faltas del mes · **señaladas por revisar** · **teléfonos pendientes**.
- Últimas alertas. Accesos rápidos.

### `/asistencia/registro` — Tabla del día (PC)
- Todo el personal activo con estado: pendiente / presente / tarde / permiso, hora y método (📱 QR / 🖥️ PC).
- Botón **Marcar** por fila (asistido; queda `registrado_por`).
- **Cargar permiso** (rango de fechas, motivo, observación).
- Completar salida no registrada / contingencia "falla de conexión".
- Filtros por cargo y estado; búsqueda.

### `/asistencia/revision` (PC)
- Marcaciones con ⚠️ (motivo: precisión GPS, etc.), con mapa/distancia.
- Acción: **Marcar como revisada** (+ observación).

### `/personal` y `/personal/[id]` (PC)
- Lista: nombre, cédula, cargo, jornada, estado. Búsqueda + filtros + paginación.
- Ficha:
  - Datos personales y cuenta asociada.
  - Jornada asignada + excepciones por día.
  - **Dispositivos**: aprobado actual, pendientes → *Aprobar* / *Revocar*.
  - **PIN de kiosco**: asignar / restablecer / desbloquear.
  - Resumen del último mes.

### `/jornadas` (PC, directiva)
- CRUD de plantillas (entrada, salida, tolerancia, pausa, días).
- Feriados.

### `/configuracion` (PC, directiva)
- Institución (nombre, logo para reportes).
- **Geocerca:** coordenadas del colegio (pegar enlace/coordenadas o elegir en mapa), radio, precisión máxima, activa/inactiva.
- Franjas horarias opcionales.
- Kiosco: activar PIN; **"Autorizar este PC como kiosco"**.

### `/configuracion/qr` (PC, directiva)
- QR activo: descripción, fecha de creación, vencimiento.
- **Generar nuevo** (pide confirmación: *"El QR actual dejará de funcionar"*), con vencimiento opcional.
- **Imprimir**: hoja A4 con logo, QR grande, nombre del colegio e instrucciones ("Abra la app Asistencia UEN → Marcar → escanee este código").
- El código solo se muestra en el momento de generarlo/imprimir.

### `/kiosco` (PC autorizado)
- Pantalla simple, sin menú: cédula + PIN (teclado numérico en pantalla).
- Muestra nombre y estado → botón **Entrada** / **Salida** → confirmación → vuelve a inicio en 5 s.

### `/reportes`, `/notificaciones`, `/configuracion/usuarios`
- Reportes: filtros (rango, persona/todos), tabla (horas, tardanzas, faltas, permisos, % asistencia, marcaciones por PC), **PDF** y **Excel**.
- Notificaciones: lista con marcar leída; filtro no leídas.
- Usuarios: crear cuenta, asignar rol, desactivar.

## Navegación

```
🖥️ PC: header (logo · 🔔 · 👤) + nav lateral
   Panel · Registro del día · Revisión · Personal · Jornadas · Reportes · Configuración

📱 Celular: bottom bar
   Marcar · Historial · 🔔 · Perfil
```

---

# Estructura de Carpetas del Repositorio

```
servicio comunitario/            # raíz del repositorio
├── astro.config.mjs              # output: server, adaptador Vercel
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .env.local                    # claves Supabase (NO se commitea)
├── .env.example                  # plantilla de variables
├── .gitignore                    # node_modules, .env*, dist, _privado/
├── .prettierrc                   # formato
├── eslint.config.js              # lint
├── vercel.json                   # cron diario (cierre de jornada)
├── README.md
│
├── public/
│   ├── manifest.webmanifest      # nombre, iconos, colores (instalable)
│   ├── icons/                    # 192, 512, maskable, apple-touch
│   ├── sw.js                     # service worker (app shell)
│   └── favicon.svg
│
├── supabase/
│   ├── migrations/               # 001_esquema.sql, 002_funciones.sql,
│   │                             # 003_rls.sql
│   └── seed.sql                  # jornada por defecto, configuración, feriados
│
├── src/
│   ├── middleware.ts              # sesión + roles → redirecciones
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro      # html base, meta, manifest, sw
│   │   ├── AuthLayout.astro      # pantalla de login
│   │   └── PanelLayout.astro     # header + nav lateral/bottom
│   │
│   ├── pages/
│   │   ├── index.astro           # redirect → /login o /panel
│   │   ├── login.astro
│   │   ├── panel.astro
│   │   ├── asistencia/
│   │   │   ├── index.astro       # 📱 marcación QR + GPS
│   │   │   ├── registro.astro    # 🖥️ tabla del día + asistida + permisos
│   │   │   └── revision.astro    # 🖥️ marcaciones señaladas
│   │   ├── personal/
│   │   │   ├── index.astro
│   │   │   ├── nuevo.astro
│   │   │   └── [id].astro        # ficha + dispositivos + PIN
│   │   ├── jornadas.astro        # plantillas + feriados
│   │   ├── reportes.astro
│   │   ├── historial.astro
│   │   ├── notificaciones.astro
│   │   ├── kiosco.astro          # autoservicio cédula + PIN (PC)
│   │   ├── configuracion/
│   │   │   ├── index.astro       # institución, geocerca, franjas, kiosco
│   │   │   ├── qr.astro          # generar / regenerar / imprimir
│   │   │   └── usuarios.astro
│   │   └── api/                  # endpoints server (Astro)
│   │       ├── marcacion.ts      # POST entrada/salida (QR + GPS)
│   │       ├── marcacion-asistida.ts
│   │       ├── kiosco.ts         # POST cédula + PIN
│   │       ├── dispositivos.ts   # registrar / aprobar / revocar
│   │       ├── qr.ts             # generar / revocar
│   │       ├── cierre-diario.ts  # usado por cron
│   │       └── reportes.ts
│   │
│   ├── components/
│   │   ├── ui/                   # Atómicos reutilizables
│   │   │   ├── Boton.astro
│   │   │   ├── Tarjeta.astro
│   │   │   ├── Tabla.astro
│   │   │   ├── Modal.astro
│   │   │   ├── Input.astro
│   │   │   └── Badge.astro       # estados presente/tarde/falta
│   │   ├── asistencia/
│   │   │   ├── BotonMarca.astro
│   │   │   ├── EscanerQR.client.ts # cámara + BarcodeDetector/jsQR
│   │   │   ├── TablaDelDia.astro
│   │   │   └── EstadoDia.astro
│   │   ├── reportes/
│   │   │   ├── FiltrosReporte.astro
│   │   │   ├── TablaReporte.astro
│   │   │   └── Exportador.client.ts
│   │   └── dashboard/
│   │       ├── Kpi.astro
│   │       └── GraficaMensual.astro
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client-browser.ts
│   │   │   └── client-server.ts
│   │   ├── reglas/               # ⭐ lógica pura testeable
│   │   │   ├── jornada.ts        # R0 resolución de la jornada del día
│   │   │   ├── estados.ts        # R1 clasificación
│   │   │   ├── calculoHoras.ts   # R2 horas
│   │   │   ├── acumulados.ts     # R5 porcentajes
│   │   │   └── geocerca.ts       # R10 distancia Haversine + precisión
│   │   ├── seguridad/
│   │   │   └── hash.ts           # hash de QR y PIN
│   │   ├── export/
│   │   │   ├── pdf.ts            # jsPDF
│   │   │   └── excel.ts          # SheetJS
│   │   └── dispositivo.ts        # dispositivo_uid en el navegador
│   │
│   ├── styles/
│   │   ├── tokens.css            # variables: colores, tipografía, espaciado
│   │   └── global.css            # reset, base, utilidades
│   │
│   └── types/
│       └── index.ts              # tipos compartidos (Usuario, Registro...)
│
├── tests/
│   └── reglas/
│       ├── jornada.test.ts
│       ├── estados.test.ts
│       ├── calculoHoras.test.ts
│       ├── acumulados.test.ts
│       └── geocerca.test.ts
│
└── Documentacion/                # este vault de Obsidian (fuente de verdad)
```

## Convenciones

- **`.astro`** para páginas/componentes con HTML; **`.ts`** para lógica pura.
- Los `*.client.ts` son los pocos con JS en el navegador (interactividad).
- `lib/reglas/` **nunca** importa de UI ni de Supabase (pure functions → fáciles de testear).
- Archivos en español para nombres de usuario/pantallas; en inglés para código interno si se prefiere — **consistencia por encima de todo** (definir en Convenciones-y-calidad).

Ver: Arquitectura · Guía de entorno

---

# PWA y Modo Offline

> **Alcance v1 (decisión D-09)**
> La app **se instala** y **abre sin internet**, pero **marcar requiere conexión** (la validación de QR, GPS y hora ocurre en el servidor). La marcación offline real queda para **v2**.

## ¿Por qué PWA?

- Se **instala** en el celular del personal (ícono, pantalla completa, sin tiendas).
- Acceso a **cámara** (escáner QR) y **GPS** desde el navegador (requiere HTTPS).
- Abre al instante gracias a la caché, incluso con señal débil.
- Distribución sencilla: un enlace o QR de instalación.

## Componentes

### 1. `manifest.webmanifest`

```json
{
  "name": "Control de Asistencia — U.E.E. Gral. Rafael Urdaneta",
  "short_name": "Asistencia UEN",
  "start_url": "/asistencia",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "lang": "es",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### 2. Service Worker propio (`public/sw.js`)

| Recurso | Estrategia | Detalle |
|---|---|---|
| App shell (CSS/JS/iconos/fuentes) | **Cache first** + actualización en segundo plano | Abre al instante |
| Páginas HTML | **Network first** con fallback a caché / página "Sin conexión" | Siempre datos frescos si hay red |
| `/api/*` (marcación, datos) | **Solo red** (no se cachea) | Nunca se muestra una confirmación falsa |

**Ciclo de vida:** `install` precachea el shell → `activate` limpia cachés de versiones viejas → el cliente detecta nueva versión y muestra *"Hay una actualización, recargar"*.

### 3. Comportamiento sin conexión

```
Usuario toca "Marcar entrada"
  ├─ navigator.onLine = false  → mensaje: "Sin conexión. Conéctese para marcar
  │                               o diríjase a secretaría." (no se guarda nada)
  └─ online → pide GPS → escanea QR → POST /api/marcacion
                 ├─ respuesta OK  → confirmación
                 └─ falla de red  → "No se pudo enviar. Intente de nuevo."
                                    (reintentar es seguro: el servidor rechaza duplicados)
```

**Contingencia (cae el internet del colegio):** secretaría registra luego desde el PC con observación *"falla de conexión"* (`metodo = manual`).

### 4. Escáner QR y GPS

- Escáner: API `BarcodeDetector` donde exista (Chrome Android) y librería ligera de respaldo (ej. `jsQR`) para iOS/otros.
- Solo cámara **en vivo**; no se permite subir imágenes.
- GPS: `navigator.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 })`. Se envían `lat`, `lng` y `accuracy`; **el servidor decide**.
- El permiso de cámara/ubicación se pide en el primer uso, con una pantalla previa explicando por qué.

### 5. Identificador de dispositivo

- Al primer login se genera un `dispositivo_uid` (uuid) guardado en `localStorage` + IndexedDB.
- Se envía en cada marcación; el servidor comprueba que esté **aprobado** (R11).

## Instalabilidad

- Meta tags en `BaseLayout`: `theme-color`, `apple-mobile-web-app-capable`, link al manifest, `apple-touch-icon`.
- Íconos **maskable** para Android.

> **iPhone: usar siempre la app instalada**
> En iOS, Safari y la app instalada tienen almacenamiento separado: abrir en Safari se ve como **otro teléfono** (requeriría nueva aprobación). El manual lo explica.

## Pruebas (checklist)

- [ ] "Instalar app" aparece en Chrome Android y "Agregar a inicio" funciona en Safari iOS.
- [ ] Sin datos → la app abre desde el ícono y muestra "Sin conexión" al intentar marcar.
- [ ] Cámara y GPS funcionan en la app instalada (Android e iOS).
- [ ] Con red intermitente, reintentar no duplica la marcación.
- [ ] Al publicar una versión nueva aparece el aviso de actualización.

## v2 — Marcación offline (futuro)

Guardar en IndexedDB `{ id_unico, codigo_qr, lat, lng, precision, hora_telefono, dispositivo_uid }` y enviarlo al reconectar; el servidor valida QR/GPS, usa la hora del teléfono y marca el registro como **señalado** para revisión. Requiere ampliar el modelo (`sincronizado_desde`, `id_unico`).

## Límites conocidos

- Login requiere conexión.
- Notificaciones push: **no** en v1 (solo in-app).
- iOS: validar cámara/GPS dentro de la app instalada en Semana 4.

Ver: Arquitectura · RNF

---

# Guía de Entorno (desarrollo local)

## Requisitos previos

| Software | Versión | Verificar con |
|---|---|---|
| Node.js | 20 LTS o superior | `node -v` |
| npm | incluido con Node | `npm -v` |
| Git | cualquiera | `git --version` |
| Cuenta Supabase | plan gratis | https://supabase.com |
| Cuenta GitHub | gratis | para el repo |
| Cuenta Vercel | gratis | para deploy (Semana 4) |

## 1. Clonar e instalar

```bash
git clone <url-del-repo> "servicio comunitario"
cd "servicio comunitario"
npm install
```

## 2. Andamiaje

El proyecto ya está creado (Astro + TypeScript estricto + adaptador Vercel + Vitest + ESLint/Prettier). La PWA se hace con **manifest + service worker propios** en `public/` (sin integraciones de terceros, ver D-13).

## 3. Variables de entorno

Crear `.env` en la raíz a partir de `.env.example` (ya está en `.gitignore`):

```bash
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=...     # clave pública "anon" / "publishable" (puede ir al navegador)
SUPABASE_SECRET_KEY=...          # clave "service_role" / "secret" (SOLO servidor)
CRON_SECRET=...                  # protege /api/cierre-diario
TOKEN_ACCESS=sbp_...             # SOLO scripts locales (npm run db:*). Nunca en Vercel.
```

Cómo obtenerlas: Supabase → Project → **Settings → API Keys**. `SUPABASE_SECRET_KEY` es la que Supabase llama **service_role** (claves heredadas) o **secret key** (claves nuevas). En Astro, solo las variables con prefijo `PUBLIC_` llegan al navegador.

> **Regla de seguridad**
> `SUPABASE_SECRET_KEY` **nunca** se sube a Git ni se usa en código de navegador. Si se filtra: rotarla desde Supabase de inmediato.

Plantilla: `.env.example` en el repo (sin valores reales).

## 4. Base de datos

```bash
npm run db:migrar     # aplica las migraciones pendientes de supabase/migrations
npm run db:seed       # configuración, jornada "General" y feriados
npm run db:sql -- "select count(*) from personal"
npm run crear-usuario -- correo@x.com directiva Nombre Apellido   # primer administrador
```

Las migraciones aplicadas se registran en `interno.migraciones`. Para cambiar el esquema, crear un archivo nuevo (`005_...sql`); nunca editar uno ya aplicado.

El seed crea: configuración por defecto, jornada "General" (07:00–16:00, tol. 15) y feriados nacionales. Los usuarios de prueba se crean en **Authentication → Users** y luego se les asigna rol (instrucciones en `supabase/seed.sql`).

> **Cámara y GPS en desarrollo**
> `localhost` cuenta como contexto seguro en el PC. Para probar en el **celular** hace falta HTTPS: usar un Preview de Vercel o un túnel (ej. `cloudflared tunnel --url http://localhost:4321`).

## 5. Levantar en local

```bash
npm run dev          # http://localhost:4321
npm run build        # build de producción
npm run preview      # previsualizar el build
npm run lint         # ESLint
npm run format       # Prettier
npm test             # Vitest (reglas de negocio)
```

## 6. Estructura del día a día

1. `git pull` / crear rama: `git checkout -b feat/marcacion-entrada`
2. Desarrollar → `npm run lint` + `npm test` antes de commitear
3. Commit convencional (ver Convenciones-y-calidad)
4. Push → PR → merge a `main`

## Pruebas en navegador (Playwright)

Herramienta para verificar la app como lo haría una persona, en un navegador real.

```bash
npm run e2e:instalar     # solo la primera vez: descarga Chromium
npm run dev              # en otra terminal
npm run test:e2e         # filtros, búsqueda, paginación, panel, celular, sesión vencida
npm run capturas         # capturas en PC y celular → tests/e2e/capturas/
npm run capturas -- /panel /reportes
```

- Credenciales: se leen de `Documentacion/_privado/Usuarios-de-prueba.md` o de `E2E_EMAIL` / `E2E_CLAVE`.
- Otra dirección (por ejemplo, producción): `E2E_URL=https://… npm run test:e2e`.
- Ver el navegador mientras prueba: `E2E_VISIBLE=1 npm run test:e2e`.
- Para agregar pruebas: copiar el esquema de `tests/e2e/navegacion.mjs` y usar las utilidades de `tests/e2e/utilidades.mjs`.

## Revisión de diseño (Impeccable)

```bash
npm run dev                # en otra terminal
npm run diseno:revisar     # detector sobre src/ y sobre las páginas renderizadas (PC y celular)
```

- Debe terminar con «Sin hallazgos». Usa el Chromium de Playwright (`npm run e2e:instalar`).
- Reglas del sistema visual: `DESIGN.md`. Contexto del producto: `PRODUCT.md`.
- Con OpenCode: `/impeccable polish`, `/impeccable audit`, `/impeccable critique <ruta>`, etc.

## Problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| Error 401 con Supabase | Claves mal copiadas o RLS sin select | Revisar `.env.local` y políticas RLS |
| `middleware` no redirige | Ruta no incluida en matcher | Revisar config del middleware |
| SW no se registra | Estás en `dev` sin HTTPS/localhost permitido | Probar con `npm run build && npm run preview` |
| Puerto ocupado | Otro proceso en 4321 | `npm run dev -- --port 4322` |

---

# Convenciones y Calidad

## Código

- **TypeScript estricto** en todo el proyecto (sin `any` sin justificación).
- **ESLint + Prettier**: formateo automático al guardar; CI bloquea errores de lint.
- **CSS puro**: variables en `styles/tokens.css`; CSS scoped de Astro por componente.
  - Colores semánticos: `--color-exito`, `--color-alerta`, `--color-error`, `--color-info`.
  - Nada de valores mágicos: todo pasa por tokens.
- Nombres en **español** para archivos/pantallas orientados al usuario; identificadores internos en inglés si se prefiere — **elegir uno y mantenerlo**.

## Componentes

- Primero buscar en `components/ui/` antes de crear uno nuevo.
- Un componente = un archivo; lógica compleja → `lib/`.
- `lib/reglas/` es **puro**: sin fetch, sin DOM, sin Supabase.

## Ramas y commits (Convención Conventional Commits)

```
main          ← siempre desplegable
 └─ feat/asistencia-marcaje
 └─ fix/reporte-fechas
 └─ docs/manual-usuario
 └─ chore/config-eslint
```

Tipos: `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore`.

Ejemplos:
```
feat: marcación de entrada con hora del servidor
fix: cálculo de horas descuenta pausa mal
docs: agrega manual de usuario
test: casos de tardanza con tolerancia 15 min
```

## Pruebas

- **Unitarias (Vitest)** para `lib/reglas/`: estados, cálculo de horas, acumulados. Obligatorio en Semana 2.
- **Checklist manual** por pantalla (ver Plan-de-pruebas).
- Criterio de "terminado": lint ✅ + tests ✅ + probado en móvil ✅.

## Calidad de interfaz

- **Mobile-first**: diseñar a 360 px primero, luego subir.
- Contraste mínimo WCAG AA; etiquetas en todos los formularios.
- Estados vacíos amigables ("Aún no hay registros hoy").
- Mensajes de error claros en español, sin tecnicismos.

## Seguridad (checklist permanente)

- [ ] Nada de claves en el repo (`.env.local` ignorado).
- [ ] Toda ruta privada protegida por `middleware.ts`.
- [ ] Toda tabla con políticas RLS (nunca "RLS off").
- [ ] Hora de marcación tomada del servidor.
- [ ] Datos personales solo visibles a roles autorizados.

## Documentación

- Este vault se actualiza cuando cambia diseño/alcance.
- `README.md` en el repo con: qué es, cómo correrlo, cómo desplegarlo.
- Las respuestas del colegio se trasladan de Preguntas-para-el-colegio a la nota correspondiente.

## Rendimiento

- Imágenes comprimidas (iconos ≤ 50 KB, maskable incluida).
- JS mínimo en el navegador: cargar por `client:*` de Astro solo donde hay interactividad.
- Meta tags y `og:` listos (ver Presentacion-del-proyecto si se comparte enlazando).

---

# ✅ Tareas por semana (tablero de progreso)

> Marcar `[x]` al terminar. **Único** tablero de control del desarrollo.
> Cronograma: Cronograma-4-semanas · Decisiones: Registro-de-decisiones.
> "Terminado" = lint ✅ + tests ✅ + probado en móvil/PC ✅.

## Semana 0 — Preparación

- [x] Definir decisiones con el colegio (marcación, QR, GPS, dispositivos, PC)
- [x] Registro de decisiones y documentación actualizada
- [x] Repositorio Git inicializado + `.gitignore`
- [x] Andamiaje Astro + TypeScript + Vitest + ESLint/Prettier
- [x] Migraciones SQL iniciales (borrador) + seed
- [ ] Cargar coordenadas del colegio en el seed/configuración
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
- [x] Pruebas E2E manuales de login, roles, CRUD y RLS (ver Plan-de-pruebas)

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

## Semana 2 — Marcación QR + GPS y reglas

- [ ] `/configuracion`: geocerca (coordenadas, radio, precisión)
- [ ] `/configuracion/qr`: generar, regenerar, vencimiento, vista de impresión
- [ ] Registro de dispositivo al login + aprobación/revocación (R11)
- [ ] Escáner QR (`BarcodeDetector` + `jsQR`) + captura GPS
- [ ] `/api/marcacion` con validación R10 (entrada y salida)
- [ ] `lib/reglas/geocerca.ts` + tests
- [ ] `lib/reglas/estados.ts` (R1) + tests
- [ ] `lib/reglas/calculoHoras.ts` (R2) + tests
- [ ] Prevención de duplicados (R7)
- [ ] Permisos (R4)
- [ ] Cierre diario (Vercel Cron → `/api/cierre-diario`) + faltas + notificaciones

**🏁 Hito:** se marca un día completo con QR + GPS y el sistema calcula estados solo.

## Semana 3 — PC de respaldo, reportes y dashboard

- [ ] `/asistencia/registro`: tabla del día + marcación asistida + contingencia
- [ ] `/kiosco` cédula + PIN (bloqueo 5 intentos) + gestión de PIN
- [ ] `/asistencia/revision`: marcaciones señaladas
- [ ] `/reportes` con filtros + `acumulados.ts` (R5) + tests
- [x] Export **PDF** (jsPDF) — planilla oficial
- [x] Export **Excel** (ExcelJS) — planilla oficial
- [x] `/panel` con KPIs y gráficas
- [ ] `/notificaciones` y `/historial`

**🏁 Hito:** reportes listos y PC operativo como respaldo.

## Semana 4 — PWA, pulido y despliegue

- [ ] `manifest.webmanifest` + iconos (192, 512, maskable, apple-touch)
- [ ] `sw.js` (app shell + network first en HTML; API sin caché) + aviso de actualización
- [ ] Prueba en celulares reales: cámara, GPS, instalación (Android + iPhone)
- [ ] Auditoría: seguridad (checklist RNF), rendimiento, accesibilidad
- [ ] Deploy a Vercel + variables de entorno + cron
- [ ] Cargar datos reales (personal, jornadas, coordenadas) + imprimir QR
- [ ] Autorizar el PC del colegio como kiosco
- [ ] `README.md` del repo
- [ ] Manual de usuario final
- [ ] Capacitación + entrega de la cuenta `directiva`

**🏁 Hito:** app en línea e instalada.

---

## Decisiones pendientes

| Decisión | Estado | Nota |
|---|---|---|
| Jornada y tolerancia concretas | 🟡 Configurable, valores pendientes | Preguntas-para-el-colegio #1-2 |
| Coordenadas del colegio | 🟡 Disponibles, falta cargar | #14 |
| Administrador inicial | 🟡 Falta nombre/correo | #12 |
| Canal de notificaciones | ⬜ Pendiente | #6 |
| Formato de reportes | ⬜ Pendiente | #7 |
| Política de salida no registrada | ⬜ Pendiente | Reglas-de-negocio R3 |

## Semáforo general

| Semana | Estado |
|---|---|
| 0 | 🟢 Terminada |
| 1 | 🟢 Terminada |
| 2 | ⬜ No iniciada |
| 3 | ⬜ No iniciada |
| 4 | ⬜ No iniciada |

---

# Despliegue — Vercel + Supabase

## Visión

```
GitHub (repo) ──push──► Vercel (build automático) ──► https://asistencia-uen.vercel.app
                                   │
                                   ├── PUBLIC_SUPABASE_URL / ANON / SECRET / CRON (env vars)
                                   ▼
                          Supabase (Postgres + Auth + RLS)
```

## 1. Supabase (Semana 1, se usa desde local)

1. Crear cuenta → **New project** (plan Free): nombre `asistencia-uen`, región más cercana, contraseña de BD guardada.
2. Aplicar migraciones (`supabase/migrations/*.sql`) en **SQL Editor** o con Supabase CLI.
3. Ejecutar `seed.sql`.
4. Copiar de **Settings → API**: `Project URL`, `anon key`, `service_role key`.
5. **Authentication → Providers**: Email activado (default).
6. (Opcional Semana 4) Authentication → URL Configuration: poner la URL de Vercel en *Site URL* y *Redirect URLs* para que el login redirija bien.

## 2. Repositorio

```bash
git init
git add .
git commit -m "feat: proyecto inicial"
git branch -M main
git remote add origin <url GitHub>
git push -u origin main
```

## 3. Vercel

1. Login en https://vercel.com con GitHub → **Add New → Project** → importar el repo.
2. Framework preset: **Astro** (auto-detectado).
3. **Environment Variables** (todas las de `.env.local`):

| Nombre | Valor | Ambiente |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Production + Preview |
| `PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Production + Preview |
| `CRON_SECRET` | cadena aleatoria larga | Production |
| `SUPABASE_SECRET_KEY` | `eyJ...` | Production + Preview |

4. **Deploy**. En minutos queda en `https://<proyecto>-<usuario>.vercel.app`.
5. Dominio: Settings → Domains → usar el sugerido o apuntar un dominio propio.

## 4. Cron diario (cierre de jornada)

En `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cierre-diario", "schedule": "30 22 * * 1-5" }
  ]
}
```

- Ajustar la hora a la **salida real** del colegio + margen (hora UTC — recordar la conversión, VZLA = UTC-4).
- El endpoint valida un secreto (`CRON_SECRET`) para que nadie más lo llame.

## 5. Checklist de producción

- [ ] Variables de entorno configuradas en Vercel (no en el repo)
- [ ] Site URL de Supabase apuntando a Vercel (redirecciones de login)
- [ ] RLS activo en **todas** las tablas
- [ ] `npm run build` y `npm run preview` pasan en local antes del push
- [ ] HTTPS activo (Vercel lo da por defecto) → el SW funciona
- [ ] Manifest e iconos accesibles: `/.well-known/` y `/manifest.webmanifest`
- [ ] Probar en un celular real: login + marcación + instalar app
- [ ] Datos reales cargados (personal + horarios)
- [ ] Respaldo de BD programado (Supabase → Database → Backups / pg_dump)

## 6. Después del despliegue

1. Compartir el enlace con la directiva.
2. Generar cuentas del personal (o enlace de registro según política).
3. Capacitar con el Manual-de-usuario.
4. Monitorear: Vercel → Logs, Supabase → Logs.

## Rollback

- Vercel guarda cada deploy: **Deployments → redeploy** de la versión anterior (reversión en segundos).
- Migraciones de BD: siempre versionadas en `supabase/migrations/`; nunca editar tablas a mano en producción.

---

# 📖 Manual de Usuario — Control de Asistencia U.E.E. Gral. Rafael Urdaneta

> **Para quién es**
> Guía para el personal del colegio. Sin tecnicismos: paso a paso con capturas (pendientes de agregar al final del desarrollo).

## 1. ¿Qué es esta aplicación?

Es una **aplicación de asistencia** que se instala en su celular. Con ella:

- Marca su **entrada y salida** escaneando el **código QR** de la entrada del colegio.
- Consulta sus horas, tardanzas y faltas.
- La directiva obtiene reportes automáticos, sin libros ni papeles.

Para marcar necesita: **internet**, **estar en el colegio** (la app verifica la ubicación) y **su propio teléfono** registrado.

## 2. Instalar la app en su celular

1. Abra el enlace de la app en el navegador del celular (Chrome en Android, Safari en iPhone).
2. **Android:** menú ⋮ → *"Instalar aplicación"*.
3. **iPhone:** botón compartir ⬆ → *"Agregar a pantalla de inicio"*.
4. Aparecerá el ícono **Asistencia UEN**. **Ábrala siempre desde ese ícono.**

> **iPhone**
> No use la app desde Safari después de instalarla: el sistema lo verá como otro teléfono y tendrá que pedir aprobación a secretaría.

## 3. Iniciar sesión

1. Abra la app, escriba su **correo** y **contraseña** y toque **Iniciar sesión**.
2. La primera vez, su teléfono queda **registrado** como su teléfono de marcación.
3. ¿Olvidó la contraseña? Solicítela a la administración.

> Los usuarios los crea la administración. No se autoregistre.

## 4. Marcar su asistencia

1. Al llegar, abra la app y toque **"Marcar entrada"**.
2. La primera vez, **permita la ubicación y la cámara** (son necesarias para marcar).
3. Apunte la cámara al **código QR** pegado en la entrada.
4. Verá la confirmación: *"Entrada 07:04 ✓ Presente"* (o *Tarde*).
5. Al salir, repita: **"Marcar salida"** → escanee el mismo QR.

| Color | Significado |
|---|---|
| 🟩 Verde | Presente |
| 🟨 Amarillo | Tarde |
| 🟥 Rojo | Falta |
| ⬜ Gris | Permiso |

### Mensajes que puede ver

| Mensaje | Qué hacer |
|---|---|
| *Sin conexión* | Active datos o Wi-Fi. Si no puede, vaya a secretaría. |
| *Debe estar en el colegio para marcar* | Acérquese a la entrada e intente de nuevo. |
| *Active la ubicación* | Encienda la ubicación del teléfono y dé permiso a la app. |
| *Código QR no válido* | El QR fue cambiado: escanee el QR **vigente** de la entrada. |
| *Teléfono pendiente de aprobación* | Cambió de teléfono: pida a secretaría que lo apruebe. |
| *Ya registró su entrada hoy* | No hace falta marcar de nuevo. |

## 5. Si no tiene su teléfono

Diríjase al **PC del colegio**:
- **Opción 1:** pida a secretaría que registre su entrada/salida.
- **Opción 2 (kiosco):** en la pantalla de autoservicio escriba su **cédula** y su **PIN** → toque **Entrada** o **Salida**. El PIN se lo asigna secretaría.

## 6. Cambié de teléfono

1. Instale la app en el nuevo teléfono e inicie sesión.
2. Verá *"Teléfono pendiente de aprobación"*.
3. Avise a secretaría: lo aprueban desde el PC y el teléfono anterior queda desactivado.

---

## Para directiva y secretaría (PC del colegio)

### 7. Registro del día
1. **Asistencia → Registro del día**: todo el personal con su estado.
2. **Marcar** en la fila de quien no pudo hacerlo (queda constancia de quién lo registró).
3. **Cargar permiso**: elija fechas y motivo, agregue observación → **Guardar**.
4. Si falló el internet del colegio: registre con la observación *"falla de conexión"*.

### 8. Revisión de marcaciones señaladas ⚠️
Marcaciones con ubicación imprecisa aparecen en **Asistencia → Revisión**. Verifique y toque **Marcar como revisada**.

### 9. Dispositivos y PIN
En **Personal →** (persona) **→ Dispositivos**: aprobar o revocar teléfonos. En **PIN**: asignar, restablecer o desbloquear.

### 10. Código QR (directiva)
1. **Configuración → Código QR → Generar nuevo** (opcional: fecha de vencimiento).
2. **Imprimir** y pegar en la entrada. Puede reutilizarlo todos los días.
3. Si sospecha que el código circula por fotos, **genere uno nuevo**: el anterior deja de funcionar al instante. Recomendado: renovarlo cada mes.

### 11. Jornadas y configuración (directiva)
- **Jornadas:** horas de entrada/salida, tolerancia, pausa y días laborables. Los cambios **no alteran** los días ya registrados.
- **Configuración:** ubicación del colegio y radio permitido, kiosco, datos de la institución.
- **Usuarios:** crear cuentas y asignar roles.

### 12. Reportes
1. **Reportes** → elija rango de fechas y persona (o todos) → **Generar**.
2. Descargue **PDF** (imprimir/firmar) o **Excel** (analizar).

Incluye: horas trabajadas, tardanzas, faltas, permisos, % de asistencia y marcaciones hechas en el PC.

### 13. Panel
Presentes hoy, tardanzas y faltas del mes, marcaciones por revisar, teléfonos pendientes y alertas 🔔.

## 14. Preguntas frecuentes

| Pregunta | Respuesta |
|---|---|
| Llegué tarde, ¿qué hago? | Marque igual; quedará como **tarde**. |
| Olvidé marcar la salida | Avise a secretaría: la registran con observación. |
| No tengo internet | Conéctese o marque en el PC del colegio. |
| ¿La app me rastrea? | No. La ubicación solo se toma en el momento de marcar. |
| ¿Puedo marcar con una foto del QR? | No: hay que escanear con la cámara **y** estar en el colegio. |
| ¿Puedo ver las faltas de otros? | No, solo directiva y secretaría. |
| ¿Se puede borrar un registro? | No; las correcciones las hace la administración con observación. |

---

*Manual v1 — pendiente: capturas de pantalla reales y datos definitivos de jornada.*

---

# 🧪 Plan de Pruebas

## 1. Pruebas unitarias (Vitest) — `lib/reglas/`

### Jornada del día (R0) — `jornada.test.ts`

| # | Caso | Resultado |
|---|---|---|
| T0a | Lunes con jornada L–V | usa la jornada |
| T0b | Sábado con jornada L–V | no laborable |
| T0c | Feriado | no laborable |
| T0d | Excepción del día con otra hora | usa la excepción |
| T0e | Excepción `libre = true` | no laborable |
| T0f | Excepción con tolerancia NULL | hereda la de la jornada |

### Estados (R1) — `estados.test.ts`

| # | Caso | Resultado |
|---|---|---|
| T1 | Entra 06:55 (esperada 07:00) | `presente` |
| T2 | Entra 07:10, tolerancia 15 | `presente` |
| T3 | Entra 07:16, tolerancia 15 | `tarde` |
| T4 | Entra 07:15 exacto, tolerancia 15 | `presente` |
| T5 | Sin marcación + permiso | `permiso` |
| T6 | Sin marcación + sin permiso | `falta` |
| T7 | Tolerancia 0, entra 07:01 | `tarde` |

### Cálculo de horas (R2) — `calculoHoras.test.ts`

| # | Caso | Resultado |
|---|---|---|
| T8 | 07:00 → 16:00, pausa 0 | 9.00 h |
| T9 | 07:00 → 16:00, pausa 60 | 8.00 h |
| T10 | Sin salida | `null` |
| T11 | 07:00 → 15:47 | 8.78 h |
| T12 | Salida antes que entrada | error controlado |

### Acumulados (R5) — `acumulados.test.ts`

| # | Caso | Resultado |
|---|---|---|
| T13 | 20 días laborables, 2 faltas | 90 % |
| T14 | Los permisos no cuentan como falta | % correcto |
| T15 | Feriado excluido del denominador | % correcto |
| T16 | 0 días laborables | 0 % sin dividir por cero |

### Geocerca (R10) — `geocerca.test.ts`

| # | Caso | Resultado |
|---|---|---|
| T17 | Mismo punto que el colegio | 0 m · permitido |
| T18 | A 100 m, radio 150 | permitido |
| T19 | A 200 m, radio 150 | **bloqueado** |
| T20 | Dentro del radio, precisión 180 m (máx 100) | permitido + **señalado** |
| T21 | Coordenadas inválidas | error controlado |

## 2. Pruebas funcionales (manual)

### Login, roles y dispositivos

| # | Paso | Esperado |
|---|---|---|
| F1 | Login con credenciales válidas | Redirige según rol |
| F2 | Contraseña incorrecta | Mensaje claro |
| F3 | `/panel` sin sesión | Redirige a `/login` |
| F4 | Rol `personal` entra a `/personal` | 403 amigable |
| F5 | Cerrar sesión + botón atrás | No ve datos privados |
| F6 | Primer login desde un celular | Dispositivo aprobado automáticamente |
| F7 | Login desde un segundo celular | Puede entrar, **no** puede marcar ("pendiente") |
| F8 | Secretaría aprueba el nuevo celular | El nuevo marca; el anterior queda revocado |

### QR

| # | Paso | Esperado |
|---|---|---|
| F9 | Directiva genera QR e imprime | Hoja legible con logo e instrucciones |
| F10 | Regenerar QR y escanear el anterior | *"Código QR no válido"* |
| F11 | QR con vencimiento ya pasado | Rechazado |
| F12 | Intentar subir una foto del QR | No existe la opción (solo cámara en vivo) |

### Marcación por celular

| # | Paso | Esperado |
|---|---|---|
| F13 | Marcar entrada en el colegio | Hora del servidor, estado presente/tarde |
| F14 | Marcar entrada dos veces | Rechazado con la hora de la primera |
| F15 | Marcar salida sin entrada | Rechazado |
| F16 | Marcar desde fuera del radio | **Bloqueado** |
| F17 | Ubicación denegada | Bloqueado con instrucciones |
| F18 | GPS impreciso dentro del radio | Marca + aparece en `/asistencia/revision` |
| F19 | Sin conexión | *"Sin conexión…"*, no guarda nada |
| F20 | Red cae durante el envío y se reintenta | Un solo registro |

### PC (respaldo)

| # | Paso | Esperado |
|---|---|---|
| F21 | Secretaría marca a una persona | `metodo = asistido`, `registrado_por` correcto |
| F22 | Kiosco con cédula + PIN correctos | Marca `metodo = kiosco` |
| F23 | 5 PIN erróneos | Bloqueo 15 min |
| F24 | Abrir `/kiosco` en un equipo no autorizado | Acceso denegado |
| F25 | Cargar permiso | Día = `permiso`, no cuenta como falta |
| F26 | Contingencia "falla de conexión" | Registro manual con observación |

### Reportes, dashboard y cierre

| # | Paso | Esperado |
|---|---|---|
| F27 | Reporte mensual | Totales correctos vs. cálculo manual |
| F28 | Filtro por persona | Solo esa persona |
| F29 | Exportar PDF | Abre, legible, encabezado del colegio |
| F30 | Exportar Excel | Números como números |
| F31 | Rango sin datos | Estado vacío amigable |
| F32 | KPIs del día | Coinciden con la tabla del día |
| F33 | Cierre diario (cron) | Faltas + notificaciones; ejecutarlo 2 veces no duplica |
| F34 | Cambiar tolerancia y revisar mes anterior | Reporte pasado **no cambia** |

### PWA

| # | Paso | Esperado |
|---|---|---|
| F35 | Instalar en Chrome Android | Ícono, abre standalone |
| F36 | Agregar a inicio en iPhone | Funciona; cámara y GPS operan en la app |
| F37 | Lighthouse | Performance, A11y, Best practices ≥ 90; PWA instalable |

## 2b. Pruebas en navegador (automatizadas)

`npm run test:e2e` (Playwright) verifica en Chromium real: filtros sin recarga, esqueletos de carga, búsqueda que conserva el foco, botón atrás, paginación, período del panel, filtros en celular, sesión vencida y ausencia de errores de JavaScript. `npm run capturas` genera capturas para revisión visual.

## 3. Pruebas de seguridad

- [ ] Sin sesión: toda ruta privada redirige.
- [ ] RLS: con la `anon key` sin login no se lee ninguna fila.
- [ ] Un usuario `personal` no lee registros de otro.
- [ ] Un usuario `personal` no puede insertar en `registros_asistencia` directamente desde el cliente.
- [ ] `codigos_qr.token_hash` y `personal.pin_hash` nunca llegan al navegador.
- [ ] Enviar lat/lng falsos "dentro del radio" con un QR revocado → rechazado.
- [ ] `.env.local` y `Documentacion/_privado/` no están en Git.
- [ ] La clave secreta no aparece en el bundle (`grep` en `dist/` / `.vercel/output`).
- [ ] `/api/cierre-diario` sin `CRON_SECRET` → 401.

## 4. Entornos

| Entorno | Uso |
|---|---|
| Local (`npm run dev`) | desarrollo (cámara/GPS: `localhost` es contexto seguro) |
| Preview de Vercel | pruebas en celular real (HTTPS) |
| Producción | datos reales, capacitación |

## Registro de resultados

| Fecha | Versión | Ejecutado por | Aprobado | Observaciones |
|---|---|---|---|---|
| 2026-10-08 | Refinamiento visual | Desarrollador (Impeccable + Playwright) | ✅ | Detector de diseño: 95 → 0 hallazgos (PC y celular). 22/22 en navegador. Corregido listado de jornadas/categorías. |
| 2026-10-08 | Navegación parcial | Desarrollador (Playwright) | ✅ | 20/20 verificaciones en navegador real. |
| 2026-10-06 | Semana 1 | Desarrollador (automatizado) | ✅ | 62 tests unitarios (R0, R1, R2, R5, R10, acceso, validación). E2E: F1–F5, CRUD de personal/jornadas/feriados/cuentas, CSRF, redirección abierta, cuenta desactivada. RLS probado contra la API real con anon, personal y secretaría. |

---

# 🎤 Presentación del Proyecto (estructura de exposición)

Estructura sugerida para exponer ante el docente y el equipo (10-12 minutos + demo).

## Diapositiva 1 — Portada

- Título: *Diseño de una aplicación web progresiva de control de asistencia para el personal docente y administrativo de la U.E.E. General Rafael Urdaneta*
- Servicio comunitario · Integrantes · Fecha

## Diapositiva 2 — El problema

- Registro manual con libros de actas y formatos físicos.
- Síntomas: lentitud, errores, pérdida de documentos, reportes difíciles.
- Consecuencia: cuello de botella administrativo (cita de Planteamiento-del-problema).

## Diapositiva 3 — Solución propuesta

- **PWA**: se instala en el celular, funciona con y sin internet.
- Digitaliza el registro · automatiza cálculos · reportes inmediatos.
- Mockup o captura de la pantalla de marcación.

## Diapositiva 4 — Objetivos

- Objetivo general + los 6 objetivos específicos (ver Justificacion-y-objetivos).

## Diapositiva 5 — Alcance

- Dentro de: asistencia del **personal** (docentes y administrativos).
- Fuera de: asistencia de estudiantes, nómina, biométrico.

## Diapositiva 6 — Usuarios y roles

- Directiva / Secretaría / Personal — mini matriz de permisos.

## Diapositiva 7 — Cómo funciona (arquitectura)

- Diagrama simple: celular → Vercel (Astro) → Supabase.
- Puntos clave: seguridad por roles (RLS), QR + GPS + hora del servidor, un teléfono por cuenta.

## Diapositiva 8 — Reglas automáticas

- Ejemplo visual: 07:10 con tolerancia 15 → presente; 07:16 → tarde.
- Cierre automático genera faltas + alertas.

## Diapositiva 9 — Cronograma

- Tabla de 4 semanas con hitos (ver Cronograma-4-semanas).

## Diapositiva 10 — Demo en vivo

1. Login como directiva → dashboard con KPIs.
2. Marcar entrada/salida (celular).
3. Tabla del día + marcación asistida y kiosco en el PC.
4. Generar reporte mensual → exportar PDF.
5. (Bonus) Instalar la app / intentar marcar fuera del colegio → bloqueado.

## Diapositiva 11 — Resultados y métricas

- Lighthouse (capturas), pruebas ejecutadas, tiempo de generación de reporte.

## Diapositiva 12 — Conclusiones

- Problema resuelto, beneficios cuantificables (horas ahorradas/semana).
- Lecciones aprendidas y mejoras futuras (notificaciones por correo, multi-sede…).

## Diapositiva 13 — Preguntas

---

## Guion breve (para hablar)

> "El colegio registra la asistencia en libros de actas: eso genera errores, pérdidas y horas de trabajo manual. Diseñamos una PWA que se instala en el celular del personal, permite marcar entrada y salida con un toque —incluso sin internet— y calcula automáticamente horas, tardanzas y faltas. La directiva obtiene reportes en PDF en segundos en lugar de horas. Se desarrolló en 4 semanas con Astro y Supabase, con hosting gratuito."

**Métricas para impresionar:**
- Tiempo de reporte: horas manuales → < 1 minuto.
- Cero pérdida de documentos (todo digital y centralizado).
- Marcación verificada: QR + ubicación + hora del servidor.
- Costo de infraestructura: $0 (planes gratuitos).

---

# 👥 Equipo y reparto de tareas

> **Regla del registro**
> Cada persona anota **solo lo que hizo**, con fecha, horas reales y **evidencia** (commit, archivo, foto, acta o lista de asistencia). Meta: **5 h/día · 25 h/semana**. Registro y firmas: Registro de horas.

## Integrantes

| # | Nombre | Rol en el proyecto |
|---|---|---|
| 1 | Schormeiker Lugo | Coordinación y desarrollo |
| 2 | Hector Diaz | Pruebas y calidad (QA) |
| 3 | Rebeca Nexans | Documentación y manual de usuario |
| 4 | Antonio Gonzalez | Enlace con el colegio y datos |
| 5 | Liz Espinoza | Investigación (antecedentes y diagnóstico) |
| 6 | Mariansel Herrera | Capacitación, presentación y difusión |

*(Los roles son una propuesta. Ajústenlos entre todos.)*

---

## Semana 1 — Planificación, decisiones y base del sistema (01/10 – 07/10/2026) · en curso

| Responsable | Actividad | Horas | Entregable / evidencia |
|---|---|---|---|
| **Schormeiker** | Coordinación de sesiones: problema, objetivos, alcance y requisitos | 6 | Documentación del proyecto (vault) |
| | Modelo de datos, reglas de negocio, arquitectura y parte académica | 7 | Notas de diseño, Método FODA |
| | Registro de decisiones con el equipo | 2 | Registro-de-decisiones |
| | Desarrollo: base de datos, login, roles, personal, jornadas y feriados | 6 | Commit `ff28b59` en GitHub |
| | Cuentas de servicios, pruebas, publicación y reparto de tareas | 4 | Repositorio, este documento |
| **Hector** | Sesiones de equipo: problema, objetivos, requisitos y arquitectura | 7 | Asistencia a sesiones |
| | Plan de pruebas (casos T y F) | 3 | Plan-de-pruebas |
| | Análisis de riesgos de seguridad (fotos del QR, ubicación falsa) | 3 | Registro de decisiones (D-05, D-06) |
| | Sesión de decisiones: QR + GPS y un celular por cuenta | 3 | Registro de decisiones |
| | Revisión de casos de geocerca y duplicados | 2 | Plan de pruebas |
| | Seguimiento de pruebas de login, roles, CRUD y permisos (RLS) | 7 | Registro de resultados |
| **Rebeca** | Sesiones de equipo: problema, requisitos, roles y parte académica | 8 | Asistencia a sesiones |
| | Revisión de redacción: planteamiento, justificación, glosario y resumen | 7 | Notas corregidas |
| | Sesión de decisiones: QR impreso y respaldo en el PC | 2 | Registro de decisiones |
| | Revisión del registro de decisiones y del manual de usuario | 3 | Manual-de-usuario |
| | Seguimiento del desarrollo y actualización del tablero de tareas | 5 | Tareas-por-semana |
| **Antonio** | Sesiones de equipo: problema, requisitos, jornada y tolerancia | 5 | Asistencia a sesiones |
| | Preparación de las preguntas para el colegio | 3 | Preguntas-para-el-colegio |
| | Revisión de reglas de negocio (tardanza, faltas, permisos) | 2 | Reglas-de-negocio |
| | Recursos del colegio (PC, internet, teléfonos) y análisis de viabilidad | 5 | Sección de recursos (Método FODA) |
| | Sesión de decisiones y registro de respuestas del colegio | 5 | Preguntas para el colegio |
| | Seguimiento del desarrollo y datos necesarios del personal | 5 | Lista de datos a recolectar |
| **Liz** | Sesiones de equipo: problema, requisitos y método FODA | 8 | Asistencia a sesiones |
| | Desglose síntomas → causas → consecuencias | 2 | Planteamiento-del-problema |
| | Investigación de tecnologías PWA y geolocalización | 3 | Notas de investigación |
| | Análisis FODA y estrategias | 2 | Metodo foda |
| | Sesión de decisiones y comparación de alternativas de control de ubicación | 5 | Registro de decisiones |
| | Seguimiento del desarrollo y plan de búsqueda de antecedentes | 5 | Plantilla de antecedentes |
| **Mariansel** | Sesiones de equipo: problema, requisitos, pantallas y parte académica | 8 | Asistencia a sesiones |
| | Revisión de la población beneficiada | 2 | Método FODA |
| | Revisión de la experiencia de uso en celular (mobile-first) | 2 | Mapa-de-pantallas |
| | Estructura de la presentación del proyecto | 3 | Presentacion-del-proyecto |
| | Sesión de decisiones: flujo de marcación con QR y mensajes al usuario | 5 | Manual de usuario |
| | Seguimiento del desarrollo e ideas para el cartel del QR y la capacitación | 5 | Notas |

**Total por integrante: 25 h.** Detalle día por día y firmas en Registro de horas.

## Semana 2 — Marcación QR + GPS

| Responsable | Actividad | Horas est. | Entregable / evidencia |
|---|---|---|---|
| **Schormeiker** | Desarrollo: QR, geocerca, dispositivos, marcación, cierre diario | 25 | Commits en GitHub |
| **Hector** | Estudiar el Plan-de-pruebas y preparar casos F6–F20 | 5 | Casos listos |
| | Probar login, roles y CRUD de la Semana 1 en el PC y en 2 celulares | 8 | Registro de resultados |
| | Reportar fallas encontradas (descripción + captura) | 4 | Lista de incidencias |
| | Probar la marcación QR/GPS a medida que se entrega | 8 | Resultados F13–F20 |
| **Rebeca** | Revisar y corregir la redacción de todo el vault | 8 | Notas corregidas |
| | Capturas de pantalla de la Semana 1 para el Manual-de-usuario | 6 | Capturas en el manual |
| | Redactar el manual: login, personal y jornadas | 8 | Secciones del manual |
| | Acta de las reuniones del equipo | 3 | Actas |
| **Antonio** | Reunión con la directiva: preguntas pendientes (#1, 2, 5–9, 11, 12) | 5 | Acta firmada por el colegio |
| | Tomar las coordenadas de la entrada y medir el radio en sitio | 3 | Coordenadas + fotos |
| | Recolectar la lista del personal (nombre, cédula, cargo, correo, horario) | 10 | Plantilla CSV completa |
| | Recolectar jornadas reales y el calendario de feriados | 4 | Datos entregados |
| | Pasar las respuestas a Preguntas-para-el-colegio | 3 | Nota actualizada |
| **Liz** | Buscar 4 antecedentes (tesis o artículos) y llenar la plantilla de Metodo foda | 12 | 4 fichas de antecedentes |
| | Diagnóstico: entrevistar a secretaría sobre el tiempo que toma hoy el registro manual | 6 | Entrevista + resultados |
| | Redactar el marco teórico breve (PWA, QR, geolocalización, control de asistencia) | 7 | Documento |
| **Mariansel** | Diseñar el cartel del QR (formato A4 con instrucciones) | 6 | Diseño en PDF |
| | Guion y diapositivas iniciales de la Presentacion-del-proyecto | 10 | Borrador de diapositivas |
| | Encuesta al personal: tipo de teléfono, sistema operativo y datos móviles | 6 | Encuesta + resultados |
| | Material de difusión: aviso al personal sobre la nueva app | 3 | Aviso |

## Semana 3 — Respaldo en el PC y reportes

| Responsable | Actividad | Horas est. |
|---|---|---|
| **Schormeiker** | Desarrollo: kiosco, PIN, registro del día, reportes PDF/Excel, panel | 25 |
| **Hector** | Probar el kiosco, el PIN, los reportes, y comparar un reporte contra un cálculo manual (F21–F34) | 25 |
| **Rebeca** | Manual: marcación, kiosco, reportes; guía rápida de 1 página para el personal | 25 |
| **Antonio** | Cargar al personal real y las jornadas en la plataforma; verificar los datos con secretaría | 25 |
| **Liz** | Análisis de resultados del diagnóstico; capítulo de metodología del informe | 25 |
| **Mariansel** | Plan de capacitación (agenda y material); video tutorial corto de marcación | 25 |

## Semana 4 — Despliegue y entrega

| Responsable | Actividad | Horas est. |
|---|---|---|
| **Schormeiker** | PWA, despliegue en Vercel, correcciones, entrega de la cuenta a la directiva | 25 |
| **Hector** | Pruebas en celulares reales del personal (Android/iPhone), Lighthouse, informe de pruebas | 25 |
| **Rebeca** | Manual final con capturas; informe final del servicio comunitario | 25 |
| **Antonio** | Imprimir y colocar el QR; autorizar el PC; acompañamiento en el colegio los primeros días | 25 |
| **Liz** | Conclusiones y recomendaciones; medición de resultados (tiempo antes y después) | 25 |
| **Mariansel** | Ejecutar la capacitación; registrar la asistencia a la capacitación; exposición final | 25 |

> Las horas estimadas son una guía. En el registro va **lo que realmente se trabajó**.

---

# 🕒 Registro de horas del servicio comunitario

**Proyecto:** Diseño de una aplicación web progresiva de control de asistencia para el personal docente y administrativo de la U.E.E. General Rafael Urdaneta.

**Instrucciones**
1. Cada integrante llena **su propia** tabla al final de cada día: actividad concreta, horas reales y evidencia.
2. Al cerrar la semana, suma el total y firma. El coordinador y el tutor verifican con las evidencias.
3. No se registran horas sin evidencia (commit, archivo, foto, acta, lista de asistencia).

Tareas asignadas: Equipo y reparto de tareas.

---

## Plantilla semanal (copiar una por integrante y por semana)

**Integrante:** ______________________ **Semana:** ___ (del ___/___ al ___/___)

| Fecha | Actividad realizada | Horas | Evidencia |
|---|---|---|---|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |
| | **Total semana** | **0** | |

Firma del integrante: ______________________  Firma del coordinador: ______________________

---

## Semana 1 (01/10 – 07/10/2026)

> **Borrador para revisión**
> Actividades de las sesiones de trabajo del equipo de la Semana 1. Cada integrante revisa **sus** filas, corrige lo que no coincida con su participación y firma.
> Evidencias comunes: documentación del proyecto (`Documentacion/`), Registro de decisiones, repositorio en GitHub (commit `ff28b59`).

### Schormeiker Lugo · Coordinación y desarrollo

| Fecha | Actividad | Horas |
|---|---|---|
| Jue 01/10 | Coordinación de la sesión: planteamiento del problema, objetivos y alcance | 3 |
|  | Estructura de la documentación del proyecto (vault) | 2 |
| Vie 02/10 | Requisitos funcionales y no funcionales, roles y permisos | 3 |
|  | Modelo de datos y reglas de negocio | 2 |
| Lun 05/10 | Creación de cuentas de servicios (Supabase, GitHub, Vercel) | 2 |
|  | Arquitectura y stack; parte académica (objetivos, FODA) | 3 |
| Mar 06/10 | Registro de decisiones con el equipo (QR, GPS, PC de respaldo, offline v2) | 2 |
|  | Andamiaje del proyecto y migraciones de base de datos | 3 |
| Mié 07/10 | Desarrollo: login, roles, personal, jornadas y feriados | 3 |
|  | Pruebas, publicación en GitHub y reparto de tareas | 2 |
| | **Total semana 1** | **25** |

Firma: ______________________


### Hector Diaz · Pruebas y calidad

| Fecha | Actividad | Horas |
|---|---|---|
| Jue 01/10 | Sesión de equipo: planteamiento del problema y objetivos | 3 |
|  | Revisión del alcance y criterios de éxito | 2 |
| Vie 02/10 | Sesión de equipo: requisitos funcionales y no funcionales | 2 |
|  | Elaboración y revisión del plan de pruebas (casos T y F) | 3 |
| Lun 05/10 | Sesión de equipo: arquitectura y stack | 2 |
|  | Análisis de riesgos de seguridad (fotos del QR, ubicación falsa) | 3 |
| Mar 06/10 | Sesión de decisiones: validación QR + GPS y un celular por cuenta | 3 |
|  | Revisión de casos de prueba de geocerca y duplicados | 2 |
| Mié 07/10 | Seguimiento de las pruebas de login, roles y CRUD | 3 |
|  | Verificación de permisos por rol (RLS) y cierre de sesión | 2 |
| | **Total semana 1** | **25** |

Firma: ______________________


### Rebeca Nexans · Documentación

| Fecha | Actividad | Horas |
|---|---|---|
| Jue 01/10 | Sesión de equipo: planteamiento del problema | 3 |
|  | Revisión de redacción: planteamiento y justificación | 2 |
| Vie 02/10 | Sesión de equipo: requisitos y roles | 2 |
|  | Revisión del glosario y del resumen ejecutivo | 3 |
| Lun 05/10 | Sesión de equipo: parte académica (objetivos, actividades, población) | 3 |
|  | Redacción y revisión de la justificación | 2 |
| Mar 06/10 | Sesión de decisiones: QR impreso y respaldo en el PC | 2 |
|  | Revisión del registro de decisiones y del manual de usuario | 3 |
| Mié 07/10 | Seguimiento del desarrollo de la Semana 1 | 3 |
|  | Actualización de la documentación y del tablero de tareas | 2 |
| | **Total semana 1** | **25** |

Firma: ______________________


### Antonio Gonzalez · Enlace con el colegio

| Fecha | Actividad | Horas |
|---|---|---|
| Jue 01/10 | Sesión de equipo: planteamiento del problema | 2 |
|  | Preparación de las preguntas para el colegio | 3 |
| Vie 02/10 | Sesión de equipo: requisitos, jornada y tolerancia | 3 |
|  | Revisión de las reglas de negocio (tardanza, faltas, permisos) | 2 |
| Lun 05/10 | Sesión de equipo: recursos disponibles en el colegio (PC, internet, teléfonos) | 2 |
|  | Análisis de recursos para la viabilidad del proyecto | 3 |
| Mar 06/10 | Sesión de decisiones: marcación desde el celular y respaldo en el PC | 3 |
|  | Registro de las respuestas en «Preguntas para el colegio» | 2 |
| Mié 07/10 | Seguimiento del desarrollo: gestión de personal y jornadas | 3 |
|  | Revisión de los datos necesarios del personal para la carga | 2 |
| | **Total semana 1** | **25** |

Firma: ______________________


### Liz Espinoza · Investigación

| Fecha | Actividad | Horas |
|---|---|---|
| Jue 01/10 | Sesión de equipo: planteamiento del problema | 3 |
|  | Desglose síntomas → causas → consecuencias | 2 |
| Vie 02/10 | Sesión de equipo: requisitos | 2 |
|  | Investigación de tecnologías PWA y geolocalización | 3 |
| Lun 05/10 | Sesión de equipo: método FODA y taller académico | 3 |
|  | Elaboración del análisis FODA y estrategias | 2 |
| Mar 06/10 | Sesión de decisiones: opciones de control de ubicación | 2 |
|  | Comparación de alternativas (QR, GPS, Wi-Fi, kiosco, biometría) | 3 |
| Mié 07/10 | Seguimiento del desarrollo de la Semana 1 | 3 |
|  | Plan de búsqueda de antecedentes | 2 |
| | **Total semana 1** | **25** |

Firma: ______________________


### Mariansel Herrera · Capacitación y presentación

| Fecha | Actividad | Horas |
|---|---|---|
| Jue 01/10 | Sesión de equipo: planteamiento del problema | 3 |
|  | Revisión de la población beneficiada | 2 |
| Vie 02/10 | Sesión de equipo: requisitos y mapa de pantallas | 3 |
|  | Revisión de la experiencia de uso en celular (mobile-first) | 2 |
| Lun 05/10 | Sesión de equipo: parte académica | 2 |
|  | Estructura de la presentación del proyecto | 3 |
| Mar 06/10 | Sesión de decisiones: flujo de marcación con QR | 3 |
|  | Revisión de mensajes al usuario en el manual | 2 |
| Mié 07/10 | Seguimiento del desarrollo: pantallas de login y panel | 3 |
|  | Ideas para el cartel del QR y la capacitación | 2 |
| | **Total semana 1** | **25** |

Firma: ______________________

## Resumen acumulado

| Integrante | Sem. 1 | Sem. 2 | Sem. 3 | Sem. 4 | Total |
|---|---|---|---|---|---|
| Schormeiker Lugo | 25 | | | | 25 |
| Hector Diaz | 25 | | | | 25 |
| Rebeca Nexans | 25 | | | | 25 |
| Antonio Gonzalez | 25 | | | | 25 |
| Liz Espinoza | 25 | | | | 25 |
| Mariansel Herrera | 25 | | | | 25 |

---

# ❓ Preguntas para el colegio

Datos que debemos confirmar con la institución antes de cerrar el diseño. Marcar ✅ cuando se responda y **trasladar la respuesta a la nota correspondiente** (indicada en cada bloque).

> **Uso**
> Llevar esta lista a la reunión con la directiva. Cada respuesta alimenta Reglas de negocio, Requisitos o el Cronograma.

---

## 1. Jornada y horarios → *a Reglas-de-negocio*

- [ ] Hora exacta de **entrada** y de **salida** del personal.
- [ ] ¿Los días laborables son lunes a viernes? ¿Hay jornada los sábados?
- [ ] ¿Existe pausa/almuerzo? ¿De cuánto tiempo y se descuenta de las horas?
- [ ] ¿Todos los departamentos tienen la misma jornada o varía (docentes vs. administrativos)?

**Respuesta:** 🟡 Parcial (2026-10-06)
> La jornada **cambia con frecuencia**, por lo que será **configurable desde el PC** (plantillas de jornada). Los valores concretos los carga la administración; por defecto 07:00–16:00, lunes a viernes.

## 2. Tolerancia para tardanzas → *a Reglas-de-negocio*

- [ ] ¿Cuántos minutos de tolerancia antes de marcar **tarde**? (ej. 15 min)
- [ ] ¿Se permite marcación "tarde" hasta una hora límite? ¿Después de esa hora cuenta como falta?
- [ ] ¿Quién define esta política: rectoría, coordinación o personalista?

**Respuesta:** 🟡 Parcial (2026-10-06)
> La tolerancia es **configurable** (por plantilla de jornada). Valor por defecto: 15 min.

## 3. Proceso de marcación → *a Mapa-de-pantallas y Requisitos-funcionales*

- [x] ¿Cada miembro del personal marca **su propia** entrada/salida (desde su celular o un computador)?
- [x] ¿O la **secretaría registra a todos** desde una pantalla central (marcación masiva)?
- [ ] ¿Se requiere además una ficha física o firma como respaldo?
- [x] ¿Se acepta marcación desde cualquier lugar (casa) o solo dentro del plantel (geolocalización/IP)?

**Respuesta:** ✅ (2026-10-06)
> - Cada persona marca **desde su propio celular**, escaneando un **QR impreso** en la entrada dentro de la app.
> - Validación en **entrada y salida**: QR activo + **GPS dentro del radio** del colegio + fecha/hora **del servidor**.
> - Fuera del radio → **bloqueado**. GPS impreciso → se permite y queda **señalado ⚠️** para revisión.
> - **Un solo celular por cuenta**; un cambio de teléfono lo aprueba secretaría desde el PC.
> - **Respaldo sin teléfono en el PC**: la secretaría marca a la persona **o** la persona se marca sola con cédula + PIN (ambas opciones).
> - Detalle en Registro de decisiones.

## 4. Alcance del personal → *a Modelo-de-datos*

- [x] ¿Cuántos **docentes** y cuántos **administrativos** hay aproximadamente?
- [ ] ¿Incluimos otros perfiles? (mantenimiento, seguridad, personal de servicio)
- [ ] ¿Hay personal con jornada parcial o por horas?

**Respuesta:** ✅ (2026-10-06)
> La cantidad es **variable** y no es definitoria: el sistema no asume un número fijo (búsqueda + paginación en listas). Participan **docentes y personal administrativo**.

## 5. Permisos y licencias → *a Reglas-de-negocio*

- [ ] ¿Quién aprueba un permiso o licencia? (rectoría, personalista)
- [ ] ¿Cómo se registra en el sistema: la aprueba el jefe o la carga secretaría?
- [ ] ¿Cuáles causales **no cuentan como falta**? (enfermedad, duelo, comisión de servicio…)
- [ ] ¿Se exige adjuntar justificación (copia de licencia médica)?

**Respuesta:**
> _Por definir_

## 6. Notificaciones y alertas → *a Mapa-de-pantallas*

- [ ] ¿Alertas **solo dentro de la app** (panel) o también por **correo electrónico**?
- [ ] ¿A quién llegan las alertas de faltas/tardanzas? (rectoría, personalista, coordinación)
- [ ] ¿Frecuencia: en el momento, resumen diario o resumen semanal?

**Respuesta:**
> _Por definir_

## 7. Reportes → *a Manual-de-usuario*

- [ ] ¿Período del reporte: **mensual**, bimestral, por lapso escolar?
- [ ] ¿Qué columnas/debe incluir? (horas, tardanzas, faltas, permisos, % asistencia…)
- [ ] ¿Quién los firma o da visto bueno?
- [ ] ¿Formato preferido: **PDF**, **Excel** o ambos?

**Respuesta:**
> _Por definir_

## 8. Horas extras y anticipaciones → *a Reglas-de-negocio*

- [ ] ¿Las horas antes de la hora de entrada o después de la salida se consideran **horas extras**?
- [ ] ¿Se compensan con tiempo o con pago? (afecta cómo las reporta el sistema)
- [ ] ¿Quién autoriza las horas extras?

**Respuesta:**
> _Por definir_

## 9. Feriados y días no laborables → *a Modelo-de-datos*

- [ ] ¿Quién carga los feriados en el sistema?
- [ ] ¿Se maneja calendario escolar oficial (días de descanso del personal)?

**Respuesta:**
> _Por definir_

## 10. Dispositivos y conectividad → *a PWA-y-offline*

- [x] ¿Hay un **computador en la oficina** para las marcaciones?
- [x] ¿El personal usará sus **celulares** (¿cuántos con smartphone)?
- [x] ¿Hay internet estable en la escuela? ¿Proveedores móviles? (define la importancia del modo offline)

**Respuesta:** ✅ (2026-10-06)
> - Hay **un PC** en el colegio: desde ahí se **administra todo el sistema** y sirve de **respaldo** para marcar sin teléfono.
> - Cada docente y miembro del personal debe tener **teléfono con internet**.
> - El colegio tiene internet. **Marcar requiere conexión**; si se cae, secretaría registra desde el PC con observación "falla de conexión". Marcación offline real → versión 2.

## 11. Datos personales y privacidad → *a Requisitos-no-funcionales*

- [ ] ¿Qué datos se registran del personal? (cédula, teléfono, correo…)
- [ ] ¿Quién puede ver los reportes de cada persona? (principio de mínimo privilegio)
- [ ] ¿Hay alguna indicación institucional sobre protección de datos?

**Respuesta:**
> _Por definir_

## 12. Cuentas y administración → *a Despliegue-Vercel-Supabase*

- [x] ¿Quién es el **administrador inicial** del sistema? (nombre y correo)
- [ ] ¿Con qué correo/dominio se crean las cuentas del personal? (¿correo institucional?)
- [x] ¿Quién podrá dar de alta/baja usuarios en el futuro?

**Respuesta:** 🟡 Parcial (2026-10-06)
> El administrador será **la administración real del colegio** (rol `directiva`), no el desarrollador. Pendiente: **nombre y correo** de esa persona y dominio de correos del personal.

## 13. Confirmar fuera de alcance

- [x] ¿Confirmamos que el sistema es **solo para personal** (docentes y administrativos) y **NO** para asistencia de estudiantes?

**Respuesta:** ✅ (2026-10-06)
> Confirmado: **solo personal administrativo y profesores**. Estudiantes fuera de alcance.

## 14. Ubicación del colegio (geocerca) → *a Registro-de-decisiones*

- [ ] Coordenadas (latitud, longitud) o enlace de Google Maps de la **entrada principal**.
- [ ] Radio permitido (sugerido: 150 m).

**Respuesta:** 🟡 El equipo ya tiene la ubicación; falta cargarla en la configuración.

---

## 15. Material pendiente para el jueves → *a Registro-de-decisiones D-25*

- [ ] **Logo del colegio** en buena calidad (PNG o SVG).
- [ ] **Escudo del estado** en buena calidad (PNG o SVG).
- [ ] Confirmar horarios reales: docentes, personal de 40 h, cocina y vigilancia (diurna y nocturna).
- [ ] Revisar la transcripción de la nómina (orden nombre/apellido y la fila 08 «…Ingris Rivas», tapada en la foto).

**Respuesta:** 🟡 Se piden en el colegio el próximo jueves.

## Registro de respuestas

| # | Tema | ¿Resuelto? | Fecha | Respuesta resumida |
|---|---|---|---|---|
| 1 | Jornada | 🟡 | 2026-10-06 | Configurable desde el PC; valores concretos pendientes |
| 2 | Tolerancia | 🟡 | 2026-10-06 | Configurable; default 15 min |
| 3 | Marcación | ✅ | 2026-10-06 | Celular propio + QR impreso + GPS; respaldo en PC (secretaría o PIN) |
| 4 | Personal | ✅ | 2026-10-06 | Cantidad variable; docentes + administrativos |
| 5 | Permisos | ⬜ | | |
| 6 | Notificaciones | ⬜ | | |
| 7 | Reportes | ⬜ | | |
| 8 | Horas extras | ⬜ | | |
| 9 | Feriados | ⬜ | | |
| 10 | Dispositivos | ✅ | 2026-10-06 | 1 PC central + celular propio con internet |
| 11 | Privacidad | ⬜ | | |
| 12 | Cuentas | 🟡 | 2026-10-06 | Admin = administración del colegio; falta nombre/correo |
| 13 | Alcance | ✅ | 2026-10-06 | Solo personal y profesores |
| 14 | Ubicación | 🟡 | 2026-10-06 | Coordenadas disponibles; falta cargarlas |

---

# 📖 Glosario

Términos técnicos usados en la documentación.

| Término | Significado |
|---|---|
| **PWA** | _Progressive Web App_: aplicación web que se instala en el celular/escritorio y funciona como una app nativa, incluso sin internet. |
| **SSR** | _Server-Side Rendering_: el servidor genera el HTML de la página (Astro en modo servidor), lo que permite proteger rutas con sesión. |
| **SPA** | _Single Page Application_: sitio que todo se resuelve en el navegador con un solo HTML (no es nuestro caso principal). |
| **Service Worker** | Script que corre en segundo plano del navegador: cachea la app para que abra rápido y sin conexión. |
| **Manifest** | Archivo `manifest.webmanifest` que define nombre, iconos y colores de la app para poder **instalarla**. |
| **IndexedDB** | Base de datos del navegador. Guarda el identificador del dispositivo (y en v2, marcaciones offline). |
| **Supabase** | Plataforma en la nube que provee base de datos **PostgreSQL**, **autenticación** y seguridad por filas (RLS), con plan gratis. |
| **PostgreSQL (Postgres)** | Sistema de gestión de base de datos relacional (las "tablas" del sistema). |
| **RLS** | _Row Level Security_: políticas en Postgres que definen **qué fila ve o edita cada usuario** según su rol. |
| **Auth / Autenticación** | Proceso de inicio de sesión (login) que identifica al usuario. |
| **Autorización** | Qué puede hacer cada usuario una vez identificado (rol → permisos). |
| **CRUD** | Crear, Leer, Actualizar y Eliminar (operaciones básicas sobre los datos). |
| **Astro** | Framework web que usamos para construir la aplicación (rápido, con soporte PWA y SSR). |
| **TypeScript** | JavaScript con tipos: evita errores tontos antes de ejecutar. |
| **Vercel** | Plataforma de alojamiento (hosting) gratuita donde queda publicada la app. |
| **Deploy** | Proceso de publicar la aplicación en internet. |
| **KPI** | _Key Performance Indicator_: indicador clave, ej. "presentes hoy", "tardanzas del mes". |
| **Offline** | Sin conexión a internet. En v1 la app abre sin conexión pero **no marca**; la marcación offline queda para v2. |
| **Tolerancia** | Minutos permitidos después de la hora de entrada antes de contar como **tarde**. Configurable por jornada (default 15). |
| **Código QR** | Código impreso en la entrada que se escanea con la app para marcar. Solo hay uno activo; se puede regenerar. |
| **Geocerca** | Círculo virtual alrededor del colegio (radio configurable). Fuera de él no se puede marcar. |
| **GPS / Geolocalización** | Ubicación del teléfono tomada solo al momento de marcar. |
| **Precisión GPS** | Margen de error de la ubicación en metros; si es muy alto, la marcación queda **señalada**. |
| **Marcación señalada ⚠️** | Marcación permitida pero que requiere revisión de directiva/secretaría. |
| **Dispositivo aprobado** | El único teléfono autorizado para marcar con una cuenta. |
| **Kiosco** | Pantalla de autoservicio en el PC del colegio para marcar con cédula + PIN. |
| **Marcación asistida** | Marcación que secretaría hace en nombre de otra persona desde el PC. |
| **Jornada (plantilla)** | Conjunto configurable de horas de entrada/salida, tolerancia, pausa y días laborables. |
| **Hash** | Transformación irreversible usada para guardar QR y PIN sin almacenarlos en claro. |
| **Haversine** | Fórmula para calcular la distancia entre dos coordenadas GPS. |
| **ADR** | _Architecture Decision Record_: registro de decisiones (ver Registro-de-decisiones). |
| **Jornada / Horario** | Horas de entrada y salida esperadas para una persona en un día. |
| **Falta** | Día laborable sin marcación de entrada y sin permiso justificado. |
| **Permiso justificado** | Ausencia autorizada que **no** cuenta como falta. |
| **Cierre diario** | Proceso automático de fin de jornada que consolida el día y genera faltas/alertas. |
| **MOC** | _Map of Content_: índice que enlaza toda la documentación (ver Inicio — MOC). |
| **Wikilink** | Enlace interno de Obsidian con formato `Nota`. |
| **Checklist** | Lista de verificación con casillas `[ ]` (ver Tareas-por-semana). |

---
