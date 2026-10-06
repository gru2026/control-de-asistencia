---
titulo: Requisitos no funcionales
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: requisitos
estado: activo
fecha: 2026-10-06
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
| RNF-05 | La app debe **abrirse sin internet** (app shell cacheada) y avisar claramente que marcar requiere conexión. Marcación offline → v2 (ver [[03-Diseno/Registro-de-decisiones|D-09]]). |
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
| RNF-22 | Solo se almacenan los datos personales estrictamente necesarios (a confirmar, ver [[00-Inicio/Preguntas-para-el-colegio|Preguntas]]). |
| RNF-23 | Los reportes solo son visibles para roles autorizados (directiva/secretaría). |
| RNF-24 | Respaldo: exportación periódica de la base de datos (plan manual o pg_dump). |

## Compatibilidad

| ID | Requisito |
|---|---|
| RNF-25 | Navegadores: Chrome/Edge/Firefox actuales y Safari (iOS ≥ 16). |
| RNF-26 | Tamaños de pantalla: 360 px → 1920 px. |
| RNF-31 | Cámara y GPS requieren **HTTPS** y permiso del usuario (Vercel provee HTTPS). |
