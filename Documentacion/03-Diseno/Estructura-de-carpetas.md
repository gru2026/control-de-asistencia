---
titulo: Estructura de carpetas
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: diseno
estado: activo
fecha: 2026-10-06
---

# Estructura de Carpetas del Repositorio

> [!note] Actualización 19/10/2026
> El **kiosco con cédula + PIN se descartó** (el colegio no tiene un equipo para eso, [[03-Diseno/Registro-de-decisiones|D-37]]): el respaldo es el registro del día en el PC de secretaría. El personal entra a la app con su **cédula** y la contraseña inicial **0000**, que cambia en el primer ingreso (D-42). Las menciones al kiosco y al PIN de esta nota quedan como historial.


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
- Archivos en español para nombres de usuario/pantallas; en inglés para código interno si se prefiere — **consistencia por encima de todo** (definir en [[04-Desarrollo/Convenciones-y-calidad]]).

Ver: [[03-Diseno/Arquitectura-y-stack|Arquitectura]] · [[04-Desarrollo/Guia-de-entorno|Guía de entorno]]
