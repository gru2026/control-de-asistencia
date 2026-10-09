---
titulo: Reglas de negocio
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: diseno
estado: activo
fecha: 2026-10-06
---

# Reglas de Negocio

> [!info] Valores configurables
> Jornada, tolerancia, pausa, radio de geocerca y franjas horarias **no están fijos en el código**: se leen de `jornadas`, `horarios` y `configuracion` (ver [[03-Diseno/Modelo-de-datos|Modelo de datos]]). Los ejemplos usan los valores por defecto: **07:00–16:00, tolerancia 15 min, radio 150 m**. Los marcados con 🔶 siguen pendientes con el colegio.

## R0 · Resolución de la jornada del día

```
1. ¿Es feriado?                         → día no laborable
2. ¿Hay excepción en horarios(persona, día_semana)?
      libre = true                      → día no laborable
      sino                              → usar sus horas (tolerancia NULL → la de la jornada)
3. ¿El día está en jornada.dias_laborables? → usar la jornada
4. Si no                                → día no laborable
```

Al marcar entrada, la regla resultante se **copia** en el registro (`hora_esperada_*`, `tolerancia_aplicada`, `pausa_aplicada`). Cambios posteriores de configuración **no alteran** días pasados.

## R1 · Clasificación al marcar entrada

```
si hora_entrada ≤ hora_esperada + tolerancia  →  "presente"
si hora_entrada >  hora_esperada + tolerancia →  "tarde"
si no marcó y tiene permiso (al cierre)       →  "permiso"
si no marcó y no tiene permiso (al cierre)    →  "falta"
```

| Hora real (esperada 07:00, tol. 15) | Resultado |
|---|---|
| 06:55 | presente |
| 07:15 | presente (límite exacto) |
| 07:16 | **tarde** |
| 09:30 | tarde (o bloqueada si hay franja de entrada configurada) |

## R2 · Horas trabajadas

```
horas_trabajadas = (hora_salida − hora_entrada − pausa_aplicada) en horas, 2 decimales
```

- Ejemplo: 07:03 → 16:00, pausa 0 → 8.95 h.
- Salida anterior a la entrada → error controlado (no se guarda).
- Sin salida al cierre → ver R3.

## R3 · Cierre automático diario (cron)

Se ejecuta una vez al día después de la jornada (`configuracion.hora_cierre_diario`):

1. Para cada persona **activa** con día laborable (R0) **sin registro**:
   - ¿Tiene permiso que cubre la fecha? → `permiso`.
   - Si no → `falta` + **notificación** a directiva y secretaría.
2. Registros con entrada pero **sin salida**: `salida_no_registrada = true`, `horas_trabajadas = null` y notificación a secretaría para completarla manualmente con observación 🔶 (política por confirmar).
3. Debe ser **idempotente**: ejecutarlo dos veces no duplica faltas ni notificaciones.
4. Corre **todos los días** a las 18:00 y revisa ayer y hoy: solo cierra jornadas que ya terminaron (las nocturnas que empezaron ayer terminan hoy a la madrugada).
5. Solo cierra días desde `configuracion.inicio_control`; sin esa fecha no crea faltas (D-36).
6. Avisos agrupados por día (uno con las faltas, otro con las salidas no registradas). Política elegida para la salida no registrada: queda sin horas y con aviso (D-35).

## R4 · Permisos

- Solo directiva/secretaría crean permisos (rango de fechas + motivo + observación).
- Un permiso hace que el día quede como `permiso` (no cuenta como falta).
- Si la persona ya tenía registro `falta` para ese día, al cargar el permiso pasa a `permiso`.
- Al eliminar o acortar un permiso, los días `permiso` sin entrada que ya no cubre ningún otro vuelven a `falta`.
- No se permiten dos permisos de la misma persona que se crucen.

## R5 · Acumulados por período

```
días_laborables  = días del período laborables según R0 (excluye feriados)
% asistencia     = (presente + tarde + permiso) / días_laborables × 100
total_horas      = Σ horas_trabajadas
total_tardanzas  = count(estado = "tarde")
total_faltas     = count(estado = "falta")
marcaciones_pc   = count(entrada_metodo ∈ {asistido, kiosco, manual})
```

- Período por defecto: mes actual; también rango libre.

## R6 · Conectividad (sin marcación offline en v1)

- **Marcar requiere internet.** Sin conexión la app informa y no guarda nada localmente.
- Toda marcación usa **hora del servidor**.
- Contingencia por caída de internet: secretaría registra desde el PC (`metodo = manual`, observación *"falla de conexión"*). Al ser registro de tercero, la hora puede indicarse manualmente y queda `registrado_por`.
- v2: cola offline (ver [[03-Diseno/Registro-de-decisiones|D-09]]).

## R7 · Duplicados y orden

- Un solo registro por `(personal_id, fecha)`.
- Segunda **entrada** el mismo día → rechazada: *"Ya registró su entrada hoy a las 07:04."*
- **Salida** sin entrada → rechazada.
- Segunda **salida** → rechazada.

## R8 · Horas extras 🔶

- Diferible. Minutos fuera de la jornada esperada se podrán reportar aparte si el colegio lo define.

## R9 · Seguridad de roles

- Quien marca por otro queda en `registrado_por`.
- Ninguna escritura sin sesión válida (middleware + RLS). Las marcaciones se escriben **solo desde el servidor** (endpoint), nunca directo desde el navegador a la tabla.

## R10 · Validación de la marcación por celular (entrada y salida)

Orden de verificación en el servidor; el primer fallo detiene el proceso:

| # | Verificación | Si falla |
|---|---|---|
| 1 | Sesión válida y persona activa | 401 / *"Su cuenta está inactiva."* |
| 2 | Dispositivo `aprobado` para la cuenta | *"Este teléfono está pendiente de aprobación por secretaría."* |
| 3 | Código QR = QR activo y no vencido (hash) | *"Código QR no válido. Escanee el QR vigente de la entrada."* |
| 4 | Día laborable (R0) | *"Hoy no es día laborable para usted."* |
| 5 | Franja horaria (si está configurada) | *"Fuera del horario permitido para marcar."* |
| 6 | Ubicación recibida | *"Active la ubicación para marcar."* |
| 7 | Distancia al colegio ≤ `radio_m` | ❌ *"Debe estar en el colegio para marcar."* |
| 8 | Precisión ≤ `precision_max_m` | ✅ se permite, pero `senalado = true` |
| 9 | R7 (duplicados/orden) | Mensaje de R7 |

Distancia: fórmula de **Haversine** entre (lat, lng) recibidos y (`colegio_lat`, `colegio_lng`) o cualquier **ubicación de prueba** activa (tabla `ubicaciones`); en estas últimas la marcación queda señalada (D-32). Con la geocerca desactivada no se exige ubicación, pero se guarda si llega.

Franja horaria (paso 5): solo se aplica a jornadas diurnas.

Jornadas nocturnas: de madrugada (antes de las 12:00), si la jornada de ayer era nocturna y no está completa, la marcación pertenece a ayer.

Si pasa todo → se guarda con hora del servidor, evidencia (lat, lng, precisión, qr_id, dispositivo_id) y estado según R1.

## R11 · Dispositivos

- El teléfono se registra **al intentar marcar** por primera vez (D-34).
- Primer celular de una cuenta → `aprobado` automáticamente.
- Celular distinto → `pendiente` + notificación a secretaría y directiva. Solo se conserva la solicitud pendiente más reciente.
- Al aprobar uno nuevo, el anterior pasa a `revocado` (máximo **uno** aprobado).
- Solo directiva/secretaría aprueban o revocan.

## R12 · Marcación en el PC (respaldo)

- **Asistido:** secretaría/directiva marca a la persona → `metodo = asistido`, sin QR ni GPS, con `registrado_por`.
- **Kiosco (autoservicio):** cédula + PIN en `/kiosco` desde el dispositivo de tipo `kiosco` aprobado → `metodo = kiosco`.
  - 5 PIN erróneos → bloqueo de 15 min.
  - Aplica R0, R1, R7 igual que el celular.

## R13 · Código QR

- Solo un QR activo. Generar uno nuevo revoca el anterior.
- `vigente_hasta` opcional; al vencer, deja de validar y se notifica a directiva.
- El código es aleatorio (≥ 128 bits); en BD solo su hash SHA-256.

---

**Implementación:** funciones puras en `src/lib/reglas/` (`jornada.ts`, `estados.ts`, `calculoHoras.ts`, `acumulados.ts`, `geocerca.ts`, `marcacion.ts`, `dispositivos.ts`, `permisos.ts`, `cierre.ts`) con pruebas Vitest — ver [[05-Entregables/Plan-de-pruebas]].
