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
| 2026-10-08 | Navegación parcial | Desarrollador (Playwright) | ✅ | 20/20 verificaciones en navegador real. |
| 2026-10-06 | Semana 1 | Desarrollador (automatizado) | ✅ | 62 tests unitarios (R0, R1, R2, R5, R10, acceso, validación). E2E: F1–F5, CRUD de personal/jornadas/feriados/cuentas, CSRF, redirección abierta, cuenta desactivada. RLS probado contra la API real con anon, personal y secretaría. |
