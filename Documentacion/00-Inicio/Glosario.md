---
titulo: Glosario
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: referencia
estado: activo
fecha: 2026-10-06
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
| **ADR** | _Architecture Decision Record_: registro de decisiones (ver [[03-Diseno/Registro-de-decisiones]]). |
| **Jornada / Horario** | Horas de entrada y salida esperadas para una persona en un día. |
| **Falta** | Día laborable sin marcación de entrada y sin permiso justificado. |
| **Permiso justificado** | Ausencia autorizada que **no** cuenta como falta. |
| **Cierre diario** | Proceso automático de fin de jornada que consolida el día y genera faltas/alertas. |
| **MOC** | _Map of Content_: índice que enlaza toda la documentación (ver [[Inicio — MOC]]). |
| **Wikilink** | Enlace interno de Obsidian con formato `[[Nota]]`. |
| **Checklist** | Lista de verificación con casillas `[ ]` (ver [[04-Desarrollo/Tareas-por-semana]]). |
