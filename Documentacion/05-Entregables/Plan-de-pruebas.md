---
titulo: Plan de pruebas
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: entregable
estado: activo
fecha: 2026-10-06
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
| F22 | Hora escrita a mano con motivo (contingencia) | `metodo = manual`, queda en «Por revisar» |
| F23 | Hora manual futura o salida antes de la entrada | Rechazada con mensaje claro |
| F24 | «Cambiar de teléfono» y marcar desde otro teléfono | El nuevo queda aprobado; el anterior, revocado |
| F25 | Cargar permiso | Día = `permiso`, no cuenta como falta |
| F26 | Corregir una falta del cierre marcando la entrada | El día pasa a presente o tarde |
| F26b | Persona «marca en secretaría» intenta marcar con el teléfono | Rechazado: «Su asistencia la registra secretaría» |

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
| F37 | Lighthouse | Performance, A11y, Best practices ≥ 90; PWA instalable — ✅ 19/10 (ver [[05-Entregables/Informe-de-auditoria]]) |
| F38 | Primer ingreso con cédula y 0000 | Obliga a crear contraseña propia antes de usar la app |
| F39 | 5 contraseñas erróneas seguidas | Espera de 15 min; «Restablecer a 0000» la libera |
| F40 | Crear cuentas en lote e imprimir la hoja de claves | Una tira por persona con cédula y 0000 |
| F41 | Publicar una versión nueva con la app abierta | Aparece «Hay una versión nueva»; al tocar «Actualizar» recarga |

### Panel de control (D-53 a D-56)

| # | Paso | Esperado |
|---|---|---|
| F42 | Entrar como directiva / como secretaría | Directiva en el resumen del panel; secretaría en *Pendientes* |
| F43 | Tocar un recuadro del resumen | Se abre el vistazo a la derecha sin salir de la pantalla |
| F44 | En el vistazo, «Ver todo en …» | Abre la sección completa; arriba «Volver al vistazo» |
| F45 | Elegir «Últimos 30 días» y cambiar de sección desde el menú | El período se conserva |
| F46 | Tocar la barra de una categoría | Vista de esa categoría comparada con el colegio; pastilla «Viendo solo: …» |
| F47 | Tocar un día del calendario o un punto de la tendencia | *Hoy* de esa fecha |
| F48 | Tocar un tramo de llegada | Lista de esas llegadas |
| F49 | Tocar la ✕ de una pastilla | Se quita solo ese filtro |
| F50 | Elegir un filtro sin datos | Mensaje que explica por qué y ofrece cambiar el período o quitar el filtro |
| F51 | «Descargar en Excel» desde una sección filtrada | El archivo trae ese período y esa categoría |
| F52 | Entrar con «reducir movimiento» activado | Todo aparece al instante, sin animaciones |
| F53 | Abrir `/asistencia/registro` (enlace viejo) | Lleva a *Hoy* con el mismo filtro |
| F54 | En *Hoy*, tocar un día de la semana | Se ve ese día; el día queda resaltado |
| F55 | En *Hoy*, tocar «Tarde» | Solo quienes llegaron tarde; el botón muestra la misma cantidad que la lista |
| F56 | En *Hoy*, escribir parte de una cédula | La lista se filtra al instante |

## 2b. Pruebas en navegador (automatizadas)

`npm run test:e2e` (Playwright) verifica en Chromium real: filtros sin recarga, esqueletos de carga, búsqueda que conserva el foco, botón atrás, paginación, filtros en celular, sesión vencida, ventanas y formularios rápidos, y ausencia de errores de JavaScript. Para el **Panel de control** comprueba:

- el resumen (seis recuadros, sin tablas en la primera capa, menú con las seis secciones, «reducir movimiento»);
- el vistazo (abre sin recarga, tres cifras enlazadas, «Ver todo» lleva a la sección y cierra el vistazo);
- las secciones (período que se conserva, tabla ordenable, buscador, lecturas y acciones, redirección del Registro del día);
- cada dato a su detalle (barra de categoría → su vista con pastilla y comparación con el colegio, «Volver al vistazo», día del calendario → *Hoy*, filtro por día de la semana con ✕, tramo de llegada → sus llegadas).

`npm run diseno:revisar` pasa el detector de diseño en 27 pantallas (PC y celular). `npm run capturas` genera capturas para revisión visual. Contra producción: `E2E_URL=https://control-de-asistencia-vert.vercel.app npm run test:e2e`.

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
| 2026-10-28 | *Hoy* rediseñado (D-57) | Desarrollador (automatizado) | ✅ | 178 unitarias; 80/80 en navegador. Detector de diseño sin hallazgos. |
| 2026-10-27 | Cada dato a su detalle (D-56) y tendencia sin desbordes | Desarrollador (automatizado) | ✅ | 178 pruebas unitarias. 78/78 en navegador, en local y en producción. Detector de diseño sin hallazgos. |
| 2026-10-27 | Panel de control en tres niveles (D-55) | Desarrollador (automatizado) | ✅ | 177 unitarias; 71/71 en navegador (local y producción). Recorrido de usabilidad simulado: todas las tareas en 0–3 toques. |
| 2026-10-27 | Animaciones y gráficas (D-54) | Desarrollador (automatizado) | ✅ | 66/66 en navegador; «reducir movimiento» verificado; sin fotogramas largos en la entrada. |
| 2026-10-25 | Panel en palabras (D-53) | Desarrollador (automatizado) | ✅ | 176 unitarias; 64/64 en navegador. |
| 2026-10-20 | Sensación de app y ventanas (D-46 a D-52) | Desarrollador (automatizado) | ✅ | 173 unitarias; 59 → 65 verificaciones en navegador según se agregaron funciones. |
| 2026-10-08 | Refinamiento visual | Desarrollador (Impeccable + Playwright) | ✅ | Detector de diseño: 95 → 0 hallazgos (PC y celular). 22/22 en navegador. Corregido listado de jornadas/categorías. |
| 2026-10-08 | Navegación parcial | Desarrollador (Playwright) | ✅ | 20/20 verificaciones en navegador real. |
| 2026-10-06 | Semana 1 | Desarrollador (automatizado) | ✅ | 62 tests unitarios (R0, R1, R2, R5, R10, acceso, validación). E2E: F1–F5, CRUD de personal/jornadas/feriados/cuentas, CSRF, redirección abierta, cuenta desactivada. RLS probado contra la API real con anon, personal y secretaría. |
