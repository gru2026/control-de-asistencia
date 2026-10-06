---
titulo: Roles y permisos
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: requisitos
estado: activo
fecha: 2026-10-06
---

# Roles y Permisos

## Matriz de roles

| Capacidad | Directiva (admin) | Secretaría | Personal (docente / administrativo) |
|---|:---:|:---:|:---:|
| Iniciar sesión | ✅ | ✅ | ✅ |
| Marcar **su propia** entrada/salida (QR + GPS) | ✅ | ✅ | ✅ |
| Marcación **asistida** en el PC (por otros) | ✅ | ✅ | ❌ |
| Marcarse en el **kiosco** del PC (cédula + PIN) | ✅ | ✅ | ✅ |
| Cargar permisos | ✅ | ✅ | ❌ |
| Aprobar / revocar **dispositivos** | ✅ | ✅ | ❌ |
| Asignar / restablecer **PIN** | ✅ | ✅ | ❌ |
| Revisar marcaciones **señaladas** | ✅ | ✅ | ❌ |
| CRUD de personal | ✅ | 👁️ solo lectura | ❌ |
| Gestionar **jornadas**, tolerancias y feriados | ✅ | ❌ | ❌ |
| Generar / regenerar / imprimir el **QR** | ✅ | ❌ | ❌ |
| Configuración (geocerca, franjas, kiosco) | ✅ | ❌ | ❌ |
| Ver **reportes de todos** | ✅ | ✅ | ❌ |
| Ver **su propio historial** | ✅ | ✅ | ✅ |
| Dashboard / KPIs globales | ✅ | ✅ | ❌ |
| Centro de notificaciones | ✅ | ✅ | solo las suyas |
| Crear/editar usuarios y roles | ✅ | ❌ | ❌ |

## Definición de cada rol

### 🔷 Directiva (rol `directiva`)
La **administración real del colegio** (rectoría, coordinación o personalista). Acceso total: personal, jornadas, configuración, QR, usuarios y reportes. Trabaja desde el **PC del colegio**. Único rol que crea usuarios y genera el QR.

### 🔶 Secretaría (rol `secretaria`)
Encargada del registro diario desde el PC: marcación asistida, permisos, aprobación de cambios de teléfono, PIN del kiosco, revisión de marcaciones señaladas, reportes y dashboard. No administra usuarios ni configuración.

### 🟢 Personal (rol `personal`)
Docentes y personal administrativo. Marcan entrada/salida desde **su propio celular** (QR + GPS) o en el kiosco del PC, y consultan **únicamente** su historial.

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
