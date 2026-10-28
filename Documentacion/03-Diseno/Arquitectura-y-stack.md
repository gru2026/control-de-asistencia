---
titulo: Arquitectura y stack
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: diseno
estado: activo
fecha: 2026-10-28
---

# Arquitectura y Stack

> [!note] Actualización 19/10/2026
> El **kiosco con cédula + PIN se descartó** (el colegio no tiene un equipo para eso, [[03-Diseno/Registro-de-decisiones|D-37]]): el respaldo es el registro del día en el PC de secretaría. El personal entra a la app con su **cédula** y la contraseña inicial **0000**, que cambia en el primer ingreso (D-42). Las menciones al kiosco y al PIN de esta nota quedan como historial.


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

Lista completa en [[03-Diseno/Registro-de-decisiones|Registro de decisiones]].

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
Asistido: secretaría → /panel/hoy → «Marcar entrada» en la fila (Ahora u Otra hora + motivo)
          → POST /api/acciones (JSON) → metodo = asistido, registrado_por; con otra hora queda señalada
```

(El kiosco con cédula + PIN se descartó: [[03-Diseno/Registro-de-decisiones|D-37]].)

## Interfaz: navegación y ventanas

- **Sin recarga** (D-46): Astro `ClientRouter` reemplaza solo el contenido; `scripts/precarga.ts` precarga pantallas al pasar el mouse (15 s) con la cabecera `X-Precarga`.
- **Ventana lateral** (D-49): un solo `<dialog id="ventana">` en `PanelLayout`. Se llena con un fragmento del servidor (`/ventanas/*`) o, en el panel, con un `<template>` de la misma página (vistazos, D-55). Los formularios `data-api` envían a `/api/acciones` y reciben `{ ok, mensaje, errores }`.
- **Caché del servidor** (D-47): perfil y categorías por 60 s; cabecera `Server-Timing` para medir.

## Panel de control: datos y niveles (D-53 a D-56)

```
/panel, /panel/*  → leerFiltros(url)  → periodo (semana|mes|30d|anterior) + categoría
                  → cargarPanel(sb, { hoy, filtros, categorias, esDirectiva })
                       · registros del período, del período anterior y de la última semana
                       · personal activo con su jornada · feriados · permisos de 7 días
                       · teléfonos pendientes · marcaciones por revisar
                       · con categoría: también el colegio completo (comparación)
                  → resumen, serie diaria, días de la semana, tramos de llegada,
                    categorías, personas, tareas pendientes y frases en palabras
```

- **Un solo cargador** (`src/lib/datos/panel.ts`) para el resumen, los vistazos y las seis secciones; «Hoy» usa siempre el día de hoy, sin depender del período.
- **Lectura** en palabras: `lecturaPorcentaje` → Bien (≥ 90 %), Atención (80–89 %), Bajo (< 80 %); el calendario usa los mismos umbrales.
- **Filtros en la URL**: `periodo` y `categoria` viajan entre secciones; los de cada sección (`dia`, `tramo`, `semana`, `ver`, `tipo`) no. Detalle en [[03-Diseno/Mapa-de-pantallas|Mapa de pantallas]].
- **Cada dato es un enlace** a su detalle (D-56): los componentes de `components/graficas/` aceptan un destino por barra, segmento, punto o tramo.
- **Animaciones** solo con `transform`, `opacity` y `clip-path`, sin rebote, y apagadas con «reducir movimiento» (D-54).

## Sin conexión

La app abre (app shell), pero **no marca**: muestra *"Sin conexión"*. Contingencia por secretaría desde el PC. Detalle en [[03-Diseno/PWA-y-offline|PWA y offline]].

Ver: [[03-Diseno/Modelo-de-datos|Modelo de datos]] · [[03-Diseno/Estructura-de-carpetas|Estructura de carpetas]]
