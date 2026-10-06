---
titulo: Cronograma 4 semanas
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: proyecto
estado: activo
fecha: 2026-10-06
---

# 📅 Cronograma — 4 semanas

> [!info] Modelo de trabajo
> Desarrollo **individual**, por **funciones verticales completas**: cada fase entrega algo operable. Decisiones base en [[03-Diseno/Registro-de-decisiones|Registro de decisiones]].

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

Progreso real: [[04-Desarrollo/Tareas-por-semana|Tareas por semana]].
