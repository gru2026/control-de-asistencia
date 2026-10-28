---
titulo: Roles y permisos
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: requisitos
estado: activo
fecha: 2026-10-06
---

# Roles y Permisos

> [!note] Actualización 28/10/2026
> - **Página de inicio:** directiva → `/panel` (resumen del Panel de control); secretaría → `/panel/pendientes`; personal → `/asistencia` ([[03-Diseno/Registro-de-decisiones|D-55]]).
> - El **Panel de control** (resumen y sus seis secciones) es de directiva y secretaría. Ambas ven lo mismo; las acciones de administración (alta de personal, cuentas) siguen siendo solo de la directiva.
> - Las filas de **kiosco** y **PIN** de la matriz quedan tachadas: se descartaron (D-37).

> [!note] Actualización 19/10/2026
> El **kiosco con cédula + PIN se descartó** (el colegio no tiene un equipo para eso, [[03-Diseno/Registro-de-decisiones|D-37]]): el respaldo es el registro del día en el PC de secretaría. El personal entra a la app con su **cédula** y la contraseña inicial **0000**, que cambia en el primer ingreso (D-42). Las menciones al kiosco y al PIN de esta nota quedan como historial.


## Matriz de roles

| Capacidad | Directiva (admin) | Secretaría | Personal (docente / administrativo) |
|---|:---:|:---:|:---:|
| Iniciar sesión | ✅ | ✅ | ✅ |
| Marcar **su propia** entrada/salida (QR + GPS) | ✅ | ✅ | ✅ |
| Marcación **asistida** en el PC (por otros) | ✅ | ✅ | ❌ |
| ~~Marcarse en el kiosco del PC (cédula + PIN)~~ *(descartado, D-37)* | — | — | — |
| Cargar permisos | ✅ | ✅ | ❌ |
| Aprobar / revocar **dispositivos** | ✅ | ✅ | ❌ |
| ~~Asignar / restablecer PIN~~ *(descartado, D-37)* | — | — | — |
| Restablecer la contraseña a **0000** (cuentas por cédula) | ✅ | ✅ | ❌ |
| Revisar marcaciones **señaladas** | ✅ | ✅ | ❌ |
| CRUD de personal (incluye el alta rápida en ventana) | ✅ | 👁️ solo lectura | ❌ |
| Crear cuentas en lote / gestionar cuentas en ventana | ✅ | ❌ | ❌ |
| Gestionar **jornadas**, tolerancias y feriados | ✅ | ❌ | ❌ |
| Generar / regenerar / imprimir el **QR** | ✅ | ❌ | ❌ |
| Configuración (ubicación del colegio, franjas, cierre diario, institución) | ✅ | ❌ | ❌ |
| Ver **reportes de todos** | ✅ | ✅ | ❌ |
| Ver **su propio historial** | ✅ | ✅ | ✅ |
| **Panel de control**: resumen, vistazos y secciones (Hoy, Asistencia, Puntualidad, Ausencias, Por categoría, Pendientes) | ✅ | ✅ | ❌ |
| Descargar planillas y resúmenes (PDF/Excel) | ✅ | ✅ | ❌ |
| Centro de notificaciones | ✅ | ✅ | solo las suyas |
| Crear/editar usuarios y roles | ✅ | ❌ | ❌ |

## Definición de cada rol

### 🔷 Directiva (rol `directiva`)
La **administración real del colegio** (rectoría, coordinación o personalista). Acceso total: personal, jornadas, configuración, QR, usuarios y reportes. Trabaja desde el **PC del colegio**. Único rol que crea usuarios y genera el QR.

### 🔶 Secretaría (rol `secretaria`)
Encargada del registro diario desde el PC: entra a **Pendientes** (teléfonos por aprobar, faltas, salidas sin marcar), marca en **Hoy** a quien no tiene teléfono, carga permisos, revisa marcaciones señaladas, restablece contraseñas a 0000 y consulta el Panel de control y los reportes. No administra usuarios ni configuración.

### 🟢 Personal (rol `personal`)
Docentes, personal administrativo, obrero, cocina y vigilancia. Marcan entrada/salida desde **su propio celular** (QR + GPS); quien no tiene teléfono es marcado por secretaría en *Hoy*. Consultan **únicamente** su historial y sus avisos.

> [!note] El desarrollador no es administrador en producción
> Tras el despliegue, la cuenta `directiva` pertenece al colegio. El desarrollador conserva acceso técnico a Supabase solo para soporte.

## Implementación (Supabase RLS)

Función auxiliar: `public.rol_actual()` → lee `usuarios.rol` de `auth.uid()`.

| Tabla | Lectura | Escritura |
|---|---|---|
| `usuarios` | directiva, secretaria · cada uno su perfil | directiva |
| `personal` | directiva, secretaria · personal: el suyo | directiva |
| `jornadas`, `horarios`, `feriados` | todos los autenticados | directiva |
| `configuracion` | todos los autenticados (sin datos secretos) | directiva |
| `codigos_qr` | directiva (sin `token_hash` expuesto al cliente) | solo servidor (endpoint) |
| `dispositivos` | directiva, secretaria · personal: los suyos | solo servidor (registro) · directiva/secretaria (aprobar/revocar) |
| `registros_asistencia` | directiva, secretaria · personal: los suyos | **solo servidor** (endpoint de marcación con clave de servicio); nadie borra |
| `permisos` | directiva, secretaria · personal: los suyos | directiva, secretaria |
| `notificaciones` | destinatario | servidor · destinatario (marcar leída) |

> [!warning] Regla de oro
> El cliente **nunca** decide el rol, la hora, ni si el QR/GPS es válido. Todo se valida en el servidor (endpoint + RLS con `auth.uid()`). Las marcaciones no se insertan directo desde el navegador.

Ver: [[03-Diseno/Arquitectura-y-stack|Arquitectura]] · [[02-Requisitos/Requisitos-funcionales|Requisitos funcionales]]
