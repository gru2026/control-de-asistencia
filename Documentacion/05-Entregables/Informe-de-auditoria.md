---
titulo: Informe de auditoría (seguridad, rendimiento y accesibilidad)
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: entregable
estado: activo
fecha: 2026-10-19
---

# Informe de auditoría — Semana 4

Revisión hecha el 19/10/2026 sobre la versión publicada en https://control-de-asistencia-vert.vercel.app. Decisión asociada: [[03-Diseno/Registro-de-decisiones|D-43]].

## 1. Rendimiento, accesibilidad y buenas prácticas (Lighthouse 12)

Medido en producción con sesión iniciada. «Celular» es el perfil móvil de Lighthouse (4G lenta simulada); «PC» es el perfil de escritorio.

| Pantalla | Rendimiento (celular / PC) | Accesibilidad | Buenas prácticas |
|---|---|---|---|
| Inicio de sesión | 100 | 100 | 100 |
| Panel | 96 / 99 | 100 | 100 |
| Mi asistencia (marcar) | 99 / 99 | 100 | 100 |
| Asistencia › Registro del día | 99 / 99 | 100 | 100 |
| Reportes › Resumen del período | 98 / 99 | 100 | 100 |
| Personal | 99 / 98 | 100 | 100 |

Corregido durante la auditoría:
- **Panel (accesibilidad 96 → 100):** los indicadores tenían `role="tooltip"` dentro de una lista de definiciones, y los días del calendario tenían un nombre accesible que no incluía el número visible.
- **Personal en celular (salto de diseño 0,15 → 0):** los filtros plegables se ocultaban después del primer pintado. Ahora la clase `js` se agrega antes.
- **Primer ingreso con la app nueva:** la primera instalación del service worker recargaba la página mientras la persona escribía. Ahora solo se recarga al tocar «Actualizar».

RNF-01 (< 3 s en 4G): se cumple; la primera pintura de contenido ocurre en ≈ 1 s en el perfil móvil. RNF-04 (≥ 90): se cumple en todas las pantallas medidas.

Además, el detector de diseño (`npm run diseno:revisar`) no reporta hallazgos en las 18 pantallas, ni en PC ni en celular.

## 2. Seguridad

| Requisito | Estado | Cómo se cumple |
|---|---|---|
| RNF-08 Rutas privadas protegidas | ✅ | `middleware.ts` verifica la sesión y el rol en cada página; las API validan por su cuenta |
| RNF-09 RLS con mínimo privilegio | ✅ | RLS en todas las tablas; las escrituras sensibles (marcaciones, QR, teléfonos, intentos) solo desde el servidor |
| RNF-10 Contraseñas en Supabase Auth | ✅ | Nunca se guardan en la app. Cuentas por cédula: ver nota sobre 0000 |
| RNF-11 Claves fuera del repositorio | ✅ | Variables de entorno en Vercel; `.env` y `Documentacion/_privado/` en `.gitignore` |
| RNF-12 Hora del servidor | ✅ | La marcación y el reloj de la pantalla usan la hora del servidor |
| RNF-13 Quién marcó por otro | ✅ | `registrado_por` y `salida_registrada_por` |
| RNF-27 QR solo como hash | ✅ | 144 bits aleatorios; en la base solo su SHA-256 |
| RNF-28 Validación en el servidor | ✅ | `/api/marcacion` valida QR, ubicación, teléfono, jornada y duplicados |
| RNF-29 Bloqueo por intentos | ✅ (adaptado) | Sin kiosco ni PIN (D-37). El inicio de sesión se bloquea 15 min tras 5 intentos fallidos por cédula o correo |
| RNF-30 Ubicación solo al marcar | ✅ | No hay rastreo; la ven solo directiva y secretaría |

Medidas agregadas en esta auditoría:
- **Cabeceras:** `Content-Security-Policy` (solo recursos propios, sin marcos, formularios solo hacia la app) y `Strict-Transport-Security`, además de las que ya existían (`X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`).
- **Registro público de cuentas desactivado** en Supabase: las cuentas solo se crean desde la app (directiva).
- **Asesor de seguridad de Supabase:** se revocó el acceso por la API a la función de eventos `rls_auto_enable` y se fijó el `search_path` de `tocar_actualizado_en` (migración 011).

Riesgos aceptados o pendientes:
- **Contraseña inicial 0000.** Mientras una persona no entra por primera vez, cualquiera que conozca su cédula puede hacerlo y registrar su propio teléfono. Mitigación: crear las cuentas cerca de la capacitación, revisar en Personal › Cuentas quién sigue «sin activar», y usar «Restablecer a 0000» y «Cambiar de teléfono» si hubo un problema.
- **Sufijo interno de las contraseñas por cédula.** Supabase exige al menos 6 caracteres. A las cuentas por cédula se les agrega un sufijo fijo; no agrega ni quita seguridad, porque la protección real es la contraseña que elige la persona (mínimo 6 caracteres, no trivial, distinta de la cédula).
- **`'unsafe-inline'` en la política de contenido.** Lo exigen los scripts y estilos en línea de Astro; la política igual bloquea scripts de otros sitios.
- **`npm audit`: 3 alertas altas** en `path-to-regexp`, dependencia de `@astrojs/vercel`. Se usa al construir las rutas de Vercel, no con datos del usuario. La «solución» de npm sería bajar el adaptador a una versión vieja e incompatible. Se revisará cuando el adaptador publique una actualización.
- **Contraseñas filtradas (HaveIBeenPwned):** Supabase solo lo ofrece en el plan pago.

## 3. Otros requisitos

| Requisito | Estado |
|---|---|
| RNF-05 Abre sin internet y avisa | ✅ Página sin conexión; aviso en Mi asistencia |
| RNF-06 Sin duplicados | ✅ Única por `(personal_id, fecha)` y R7 en el servidor |
| RNF-16 WCAG 2.1 AA básico | ✅ Accesibilidad 100 en Lighthouse; contraste revisado por el detector |
| RNF-18 Lint sin errores | ✅ |
| RNF-19 Pruebas de reglas | ✅ Vitest |
| RNF-24 Respaldo de la base | ✅ `npm run db:respaldo` (ver [[04-Desarrollo/Puesta-en-marcha]]) |
| RNF-25/26 Navegadores y pantallas | 🟡 Probado en Chromium (PC y celular simulado). Falta la prueba en Android y iPhone reales |
