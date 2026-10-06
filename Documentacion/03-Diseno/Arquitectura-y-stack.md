---
titulo: Arquitectura y stack
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: diseno
estado: activo
fecha: 2026-10-06
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
Asistido: secretaria → /asistencia/registro → "Marcar" en la fila
          → POST /api/marcacion-asistida → metodo = asistido, registrado_por

Kiosco:   persona → /kiosco → cédula + PIN
          → POST /api/kiosco → verifica dispositivo kiosco + PIN (hash, bloqueo)
          → metodo = kiosco
```

## Sin conexión

La app abre (app shell), pero **no marca**: muestra *"Sin conexión"*. Contingencia por secretaría desde el PC. Detalle en [[03-Diseno/PWA-y-offline|PWA y offline]].

Ver: [[03-Diseno/Modelo-de-datos|Modelo de datos]] · [[03-Diseno/Estructura-de-carpetas|Estructura de carpetas]]
