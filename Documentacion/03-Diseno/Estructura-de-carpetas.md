---
titulo: Estructura de carpetas
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: diseno
estado: activo
fecha: 2026-10-28
---

# Estructura de Carpetas del Repositorio

> [!note] Actualización 28/10/2026
> Árbol revisado contra el repositorio publicado. Lo más reciente: el **Panel de control** vive en `src/pages/panel/` con su plantilla `PanelSeccionLayout` y su cargador de datos `src/lib/datos/panel.ts` (D-55, D-56); el antiguo `asistencia/registro.astro` es ahora `panel/hoy.astro` y deja una redirección. El kiosco con PIN se descartó (D-37) y ya no tiene archivos.

```
servicio comunitario/              # raíz del repositorio
├── astro.config.mjs               # output: server, adaptador Vercel, sin prefetch de Astro (D-46)
├── vercel.json                    # cron diario → /api/cierre-diario
├── package.json                   # scripts: dev, build, lint, check, test, test:e2e, diseno:revisar, docs
├── DESIGN.md                      # sistema de diseño y reglas de interfaz (fuente de verdad visual)
├── PRODUCT.md                     # para quién es y qué debe sentirse
├── README.md
│
├── public/
│   ├── manifest.webmanifest       # instalable
│   ├── sw.js                      # service worker (app shell)
│   ├── offline.html               # pantalla sin conexión
│   ├── fuentes/                   # Onest, autoalojada
│   └── icons/
│
├── supabase/migrations/           # 001_esquema … 011_auditoria (esquema, RLS, funciones)
├── scripts/                       # db.mjs (SQL), respaldo.mjs, crear-usuario.mjs
│
├── src/
│   ├── middleware.ts              # sesión, rol, caché de perfil, Server-Timing
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro       # html base, navegación sin recarga (ClientRouter)
│   │   ├── AuthLayout.astro       # login y cambio de clave
│   │   ├── PanelLayout.astro      # barra superior, menú (con subsecciones del panel),
│   │   │                          # ventana lateral #ventana, confirmación, mensajes, avisos
│   │   └── PanelSeccionLayout.astro  # plantilla de las secciones del Panel de control (D-55)
│   │
│   ├── pages/
│   │   ├── login.astro · cambiar-clave.astro · index.astro · 404.astro · sin-permiso.astro
│   │   ├── panel/                 # Panel de control (D-53…D-56)
│   │   │   ├── index.astro        # resumen: 6 recuadros + vistazos en <template>
│   │   │   ├── hoy.astro          # antes Registro del día: marcación asistida, hora manual
│   │   │   ├── asistencia.astro · puntualidad.astro · ausencias.astro
│   │   │   ├── categorias.astro   # comparación o vista de una categoría
│   │   │   └── pendientes.astro   # entrada de la secretaría
│   │   ├── asistencia/
│   │   │   ├── index.astro        # 📱 marcación QR + GPS
│   │   │   ├── revision.astro     # marcaciones señaladas
│   │   │   └── registro.astro     # redirección 301 → /panel/hoy
│   │   ├── personal/              # index, [id] (ficha por pestañas), nuevo, cuentas, importar
│   │   ├── permisos/              # index, [id]
│   │   ├── reportes.astro · reportes/resumen.astro
│   │   ├── jornadas.astro · historial.astro · notificaciones.astro
│   │   ├── configuracion/         # index, marcacion, qr, usuarios, puesta-en-marcha
│   │   ├── ventanas/              # fragmentos para la ventana lateral (D-49, D-51)
│   │   │   ├── persona/[id].astro · permiso.astro · acciones.astro
│   │   │   ├── personal-nuevo.astro · cuenta/[id].astro · cuenta-nueva.astro
│   │   └── api/
│   │       ├── marcacion.ts       # POST entrada/salida (QR + GPS + dispositivo)
│   │       ├── acciones.ts        # acciones rápidas en JSON (marcar, permiso, teléfono, cuentas…)
│   │       ├── cierre-diario.ts   # usado por el cron
│   │       ├── salir.ts
│   │       └── reportes/          # planilla.ts, resumen.ts (PDF y Excel)
│   │
│   ├── components/
│   │   ├── ui/                    # Boton, Tarjeta, Tabla, Modal, Input, Select, Badge, Icono,
│   │   │                          # BarraFiltros, Pestanas, Paginacion, Mensaje, Alerta…
│   │   ├── graficas/              # GraficaLinea, BarrasHorizontales, BarraApilada,
│   │   │                          # DistribucionLlegadas, Figura (todas aceptan destino al tocar)
│   │   ├── panel/                 # Modulo, Anillo, MiniLinea, Contador, SubnavPanel,
│   │   │                          # CalendarioPeriodo, HoyPorCategoria, ListaAusentes
│   │   ├── personal/              # CamposPersonal, CamposCuenta
│   │   ├── asistencia/            # PestanasAsistencia (Permisos · Por revisar)
│   │   └── avisos/                # PanelAvisos (campana)
│   │
│   ├── lib/
│   │   ├── reglas/                # ⭐ lógica pura y probada: jornada, estados, horas, cierre,
│   │   │                          # geocerca, permisos, registro, estadisticas (lectura 90/80,
│   │   │                          # tramos de llegada)…
│   │   ├── datos/                 # lecturas de la base: asistencia (rangoPeriodo), categorias,
│   │   │                          # jornadas, marcacion, cache, panel (cargarPanel y filtros)
│   │   ├── servicios/             # escrituras: marcación, asistido, permisos, cuentas, personal,
│   │   │                          # dispositivos, qr, cierre, notificaciones…
│   │   ├── reportes/              # planilla y resumen en PDF y Excel
│   │   ├── auth/                  # acceso.ts (reglas por ruta y rol, inicio por rol), cedula.ts
│   │   ├── validacion/            # validación de formularios
│   │   ├── supabase/servidor.ts · fecha.ts · formato.ts (números a la venezolana) · flash.ts
│   │   └── avisos.ts · importacion.ts · qr.ts · demo/
│   │
│   ├── scripts/                   # JavaScript del navegador
│   │   ├── mejoras.ts             # punto de entrada
│   │   ├── transiciones.ts · precarga.ts · pantalla.ts   # navegación sin recarga (D-46)
│   │   ├── ventanas.ts            # ventana lateral, vistazos locales, envío a /api/acciones,
│   │   │                          # confirmación, buscador de personas, filtro de listas
│   │   ├── tablas.ts              # tablas ordenables y «Ver todos» (D-55)
│   │   ├── animaciones.ts         # cifras que cuentan desde 0 (D-54)
│   │   └── marcar.ts · dispositivo.ts
│   │
│   ├── styles/
│   │   ├── tokens.css             # colores, tipografía, espaciado, movimiento, lectura
│   │   ├── global.css             # base, rejilla de formularios, animaciones compartidas
│   │   ├── ventanas.css           # ventana lateral y sus piezas (v-)
│   │   └── panel.css              # piezas de las secciones del panel
│   │
│   └── types/index.ts
│
├── tests/
│   ├── reglas/ · auth/ · validacion/ · *.test.ts   # pruebas unitarias (Vitest)
│   └── e2e/
│       ├── navegacion.mjs         # pruebas de navegador (Playwright)
│       ├── detector.mjs           # revisión de diseño automática
│       └── capturas.mjs           # capturas para el manual impreso
│
└── Documentacion/                 # este vault de Obsidian (fuente de verdad)
```

## Convenciones

- **`.astro`** para páginas y componentes con HTML; **`.ts`** para lógica.
- `lib/reglas/` **nunca** importa de la interfaz ni de Supabase: funciones puras, fáciles de probar.
- `lib/datos/` lee; `lib/servicios/` escribe. Las páginas no consultan tablas directamente salvo lecturas simples.
- Los scripts de página no se ejecutan dos veces con la navegación sin recarga: usar oyentes delegados en `document` o `enCadaPantalla` (`scripts/pantalla.ts`).
- Nombres en español, consistentes entre archivos, rutas y textos ([[04-Desarrollo/Convenciones-y-calidad]]).

Ver: [[03-Diseno/Arquitectura-y-stack|Arquitectura]] · [[03-Diseno/Mapa-de-pantallas|Mapa de pantallas]] · [[04-Desarrollo/Guia-de-entorno|Guía de entorno]]
