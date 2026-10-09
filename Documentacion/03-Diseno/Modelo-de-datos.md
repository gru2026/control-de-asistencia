---
titulo: Modelo de datos
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: diseno
estado: activo
fecha: 2026-10-06
---

# Modelo de Datos

Base de datos **PostgreSQL** en Supabase. Diez tablas. Decisiones de origen en [[03-Diseno/Registro-de-decisiones|Registro de decisiones]].

## Diagrama de relaciones (ERD simplificado)

```
auth.users (Supabase)
      │ 1:1
      ▼
  usuarios ───────────────┬──────────────┐
      │ 1:0..1            │ 1:N          │ 1:N
      ▼                   ▼              ▼
   personal ──N:1──► jornadas      notificaciones
      │ 1:N   │ 1:N
      ▼       ▼
  horarios  dispositivos
  (excepc.)
      │
  personal 1:N ──► registros_asistencia ──N:1──► codigos_qr
                         │ N:1                  
                         ▼                      
                    dispositivos                

  permisos ──N:1──► personal
  configuracion (1 fila) · feriados (independiente)
```

## Tablas

### `usuarios`
Extiende `auth.users` de Supabase.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | = `auth.users.id` |
| `nombre`, `apellido` | text | |
| `email` | text | Correo (login) |
| `rol` | text | `directiva` \| `secretaria` \| `personal` |
| `estado` | text | `activo` \| `inactivo` |
| `creado_en` | timestamptz | Default `now()` |

### `personal`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `usuario_id` | uuid FK → usuarios, unique, null | NULL si aún no tiene cuenta |
| `nombre`, `apellido` | text | |
| `cedula` | text unique | Usada también en el kiosco |
| `categoria_id` | uuid FK → categorias | Oficio (Docente, Secretaría, Cocina, Obrero, Vigilancia…) |
| `vinculo` | text | `fijo` \| `contratado` \| `suplente` |
| `carga_horaria` | int null | Horas semanales (columna de la planilla oficial) |
| `origen` | text | `manual` \| `importado` |
| `telefono` | text | Opcional |
| `jornada_id` | uuid FK → jornadas | Plantilla de horario asignada |
| `pin_hash` | text null | PIN del kiosco (hash, nunca en claro) |
| `pin_intentos` | int | Default 0 (bloqueo a los 5) |
| `pin_bloqueado_hasta` | timestamptz null | |
| `fecha_ingreso` | date | |
| `estado` | text | `activo` \| `inactivo` (nunca borrado físico) |
| `creado_en` | timestamptz | |

### `categorias`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `nombre` | text unique | Docente, Secretaría, Cocina, Obrero, Vigilancia, Otro |
| `planilla` | text | `docentes` \| `personal` (planilla oficial donde aparece) |
| `color` | text | Color en tablas y gráficas |
| `jornada_sugerida_id` | uuid FK → jornadas null | Se propone al registrar personal |
| `orden`, `activa` | int, bool | |

### `jornadas` (plantillas configurables)
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `nombre` | text unique | Ej. "Docente mañana", "Administrativo" |
| `hora_entrada` | time | Ej. 07:00 |
| `hora_salida` | time | Ej. 16:00 |
| `tolerancia_min` | int | Ej. 15 |
| `pausa_min` | int | Minutos de almuerzo a descontar (default 0) |
| `dias_laborables` | int[] | 1=lunes … 7=domingo. Default `{1,2,3,4,5}` |
| `activa` | bool | |
| `nocturna` | bool | La salida ocurre al día siguiente |

### `horarios` (excepciones por persona y día)
Opcional: sobrescribe la jornada para un día concreto de la semana.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `personal_id` | uuid FK → personal | |
| `dia_semana` | int | 1–7 |
| `hora_entrada`, `hora_salida` | time | |
| `tolerancia_min` | int null | NULL = usar la de la jornada |
| `libre` | bool | true = ese día no trabaja |

Unique `(personal_id, dia_semana)`.

### `configuracion` (una sola fila)
| Campo | Tipo | Default | Descripción |
|---|---|---|---|
| `id` | int PK | 1 | check `id = 1` |
| `nombre_institucion` | text | U.E.E. General Rafael Urdaneta | Encabezado de reportes |
| `colegio_lat`, `colegio_lng` | float8 | — | Centro de la geocerca |
| `radio_m` | int | 150 | Radio permitido |
| `precision_max_m` | int | 100 | Por encima → marcación señalada |
| `geocerca_activa` | bool | true | |
| `franja_entrada_desde`, `franja_entrada_hasta` | time null | null | Ventana opcional para marcar entrada |
| `franja_salida_desde`, `franja_salida_hasta` | time null | null | Ventana opcional para marcar salida |
| `kiosco_pin_activo` | bool | true | Autoservicio con PIN en el PC |
| `hora_cierre_diario` | time | 18:00 | Referencia del cron |
| `zona_horaria` | text | America/Caracas | |
| `actualizado_en`, `actualizado_por` | | | Auditoría |

### `codigos_qr`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `token_hash` | text unique | SHA-256 del código impreso |
| `descripcion` | text | Ej. "Entrada principal — oct 2026" |
| `activo` | bool | **Solo uno activo** (índice único parcial) |
| `vigente_hasta` | date null | NULL = sin vencimiento |
| `creado_por` | uuid FK → usuarios | |
| `creado_en`, `revocado_en` | timestamptz | |

```sql
create unique index uq_un_qr_activo on codigos_qr (activo) where activo;
```

### `dispositivos`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `usuario_id` | uuid FK → usuarios | |
| `dispositivo_uid` | text | uuid generado en el navegador |
| `tipo` | text | `celular` \| `kiosco` |
| `descripcion` | text | User-agent resumido ("Android · Chrome") |
| `estado` | text | `aprobado` \| `pendiente` \| `revocado` |
| `aprobado_por` | uuid FK → usuarios null | |
| `creado_en`, `aprobado_en`, `ultimo_uso` | timestamptz | |

Regla: **máximo un `celular` aprobado por usuario** (índice único parcial).

```sql
create unique index uq_un_celular_aprobado
  on dispositivos (usuario_id) where estado = 'aprobado' and tipo = 'celular';
```

### `registros_asistencia`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `personal_id` | uuid FK → personal | |
| `fecha` | date | Día (zona horaria del colegio) |
| `hora_entrada` | timestamptz null | **Hora del servidor** |
| `hora_salida` | timestamptz null | **Hora del servidor** |
| `hora_esperada_entrada` | time | Copia de la regla aplicada ese día |
| `hora_esperada_salida` | time | Copia |
| `tolerancia_aplicada` | int | Copia (minutos) |
| `pausa_aplicada` | int | Copia (minutos) |
| `estado` | text | `presente` \| `tarde` \| `falta` \| `permiso` |
| `horas_trabajadas` | numeric(5,2) | Calculado al marcar salida / cierre |
| `salida_no_registrada` | bool | true si el cierre la completó |
| **Evidencia entrada** | | |
| `entrada_metodo` | text | `qr` \| `asistido` \| `kiosco` \| `manual` |
| `entrada_lat`, `entrada_lng` | float8 null | |
| `entrada_precision_m` | int null | |
| `entrada_qr_id` | uuid FK → codigos_qr null | |
| `entrada_dispositivo_id` | uuid FK → dispositivos null | |
| **Evidencia salida** | | (mismos campos con prefijo `salida_`) |
| `senalado` | bool | Requiere revisión (GPS impreciso, etc.) |
| `motivo_senal` | text null | Ej. "precisión GPS 180 m" |
| `revisado_por` | uuid null | Directiva/secretaría que revisó |
| `observacion` | text | Notas, "falla de conexión", etc. |
| `registrado_por` | uuid FK → usuarios | Quién registró (propio o tercero) |
| `creado_en`, `actualizado_en` | timestamptz | |

**Restricción:** unique `(personal_id, fecha)` — un registro por persona por día.

### `permisos`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `personal_id` | uuid FK → personal | |
| `fecha_desde`, `fecha_hasta` | date | Rango del permiso |
| `motivo` | text | Enfermedad, duelo, comisión… |
| `observacion` | text | |
| `creado_por` | uuid FK → usuarios | Directiva/secretaría |
| `creado_en` | timestamptz | |

### `notificaciones`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `usuario_destino` | uuid FK → usuarios | |
| `tipo` | text | `falta` \| `tarde` \| `senalado` \| `dispositivo` \| `sistema` |
| `mensaje` | text | Ej. "Juan Pérez no registró entrada el 03/10" |
| `enlace` | text null | Ruta relacionada |
| `leida` | bool | Default false |
| `fecha` | timestamptz | Default `now()` |

### `feriados`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid PK | |
| `fecha` | date unique | |
| `descripcion` | text | |

## Índices recomendados

```sql
create index idx_asistencia_fecha       on registros_asistencia (fecha);
create index idx_asistencia_senalado    on registros_asistencia (senalado) where senalado;
create index idx_permisos_personal      on permisos (personal_id, fecha_desde, fecha_hasta);
create index idx_dispositivos_usuario   on dispositivos (usuario_id, estado);
create index idx_notif_destino          on notificaciones (usuario_destino, leida);
```

## Enumeraciones

- **Rol:** `directiva` · `secretaria` · `personal`
- **Cargo:** `docente` · `administrativo` · `otro`
- **Estado asistencia:** `presente` · `tarde` · `falta` · `permiso`
- **Método de marcación:** `qr` · `asistido` · `kiosco` · `manual`
- **Estado dispositivo:** `aprobado` · `pendiente` · `revocado`

> [!note] Resolución de la jornada de un día
> `horarios` (excepción del día) → si no hay, `jornadas` de la persona → si el día no está en `dias_laborables` o es feriado → **no laborable**.

Ver: [[03-Diseno/Reglas-de-negocio|Reglas de negocio]] · [[02-Requisitos/Roles-y-permisos|Roles y permisos (RLS)]]
