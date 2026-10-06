---
titulo: Requisitos funcionales
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: requisitos
estado: activo
fecha: 2026-10-06
---

# Requisitos Funcionales

Prioridad: **MVP** (imprescindible) · **Importante** · **Diferible** (ver [[01-Proyecto/Cronograma-4-semanas|corte de emergencia]]). Decisiones de origen: [[03-Diseno/Registro-de-decisiones|Registro de decisiones]].

## RF — Acceso y usuarios

| ID | Requisito | Prioridad |
|---|---|---|
| RF-01 | Iniciar sesión con correo y contraseña (Supabase Auth). | MVP |
| RF-02 | Distinguir 3 roles: **directiva**, **secretaria**, **personal**. | MVP |
| RF-03 | Redirigir al login a todo usuario no autenticado. | MVP |
| RF-04 | Las políticas RLS impiden ver o editar datos fuera del rol. | MVP |
| RF-05 | La directiva crea, edita y desactiva cuentas de usuario. | MVP |

## RF — Gestión de personal y jornadas

| ID | Requisito | Prioridad |
|---|---|---|
| RF-06 | CRUD de personal: nombre, apellido, cédula, cargo, teléfono, fecha de ingreso, estado. Lista con búsqueda y paginación. | MVP |
| RF-07 | CRUD de **plantillas de jornada** (entrada, salida, tolerancia, pausa, días laborables). | MVP |
| RF-08 | Asignar una jornada a cada persona y excepciones por día (`horarios`). | MVP |
| RF-09 | Registrar **feriados** y días no laborables. | Importante |
| RF-10 | Importar personal desde CSV. | Diferible |

## RF — Configuración y QR

| ID | Requisito | Prioridad |
|---|---|---|
| RF-35 | Configurar ubicación del colegio (lat/lng), radio y precisión máxima de la geocerca. | MVP |
| RF-36 | Generar el **QR de marcación** con vista de impresión (logo, QR, instrucciones). | MVP |
| RF-37 | **Regenerar** el QR: el anterior queda revocado al instante. Solo un QR activo. | MVP |
| RF-38 | Caducidad opcional del QR (sin vencimiento o fecha de vencimiento). | Importante |
| RF-39 | Franjas horarias opcionales para marcar entrada/salida. | Diferible |

## RF — Dispositivos

| ID | Requisito | Prioridad |
|---|---|---|
| RF-40 | Registrar el celular al primer inicio de sesión (aprobado automáticamente). | MVP |
| RF-41 | Un celular distinto queda **pendiente** y no puede marcar. | MVP |
| RF-42 | Secretaría/directiva **aprueban o revocan** dispositivos desde el PC; máximo uno aprobado por cuenta. | MVP |
| RF-43 | Notificar a secretaría cuando hay un dispositivo pendiente. | Importante |

## RF — Marcación de asistencia

| ID | Requisito | Prioridad |
|---|---|---|
| RF-11 | Marcar **entrada** escaneando el QR dentro de la app + GPS, con fecha/hora del servidor. | MVP |
| RF-12 | Marcar **salida** con la misma validación (QR + GPS). | MVP |
| RF-44 | Bloquear la marcación fuera del radio del colegio o sin permiso de ubicación. | MVP |
| RF-45 | Permitir y **señalar** la marcación cuando la precisión GPS es baja. | MVP |
| RF-13 | Marcación **asistida** desde el PC: secretaría marca a una persona (`registrado_por`). | MVP |
| RF-46 | Marcación **autoservicio** en el PC (`/kiosco`) con cédula + PIN. | Importante |
| RF-47 | Asignar/restablecer el PIN de una persona (secretaría/directiva). | Importante |
| RF-14 | Cargar **permisos** (rango de fechas, motivo, observación). | MVP |
| RF-15 | Prevenir duplicados: segunda entrada, salida sin entrada, segunda salida. | MVP |
| RF-48 | Pantalla de **revisión de marcaciones señaladas** (marcar como revisada). | Importante |
| RF-16 | Marcación **offline** con cola local y sincronización. | Diferible (v2) |
| RF-17 | Cierre automático diario: genera **falta** a quien no marcó y no tiene permiso. | MVP |

## RF — Cálculos automáticos

| ID | Requisito | Prioridad |
|---|---|---|
| RF-18 | Calcular **horas trabajadas** (salida − entrada − pausa) y su acumulado. | MVP |
| RF-19 | Marcar **tarde** si la entrada supera hora esperada + tolerancia. | MVP |
| RF-20 | Clasificar cada día: presente, tarde, falta, permiso. | MVP |
| RF-21 | Calcular % de asistencia, tardanzas y faltas por período. | MVP |
| RF-22 | Horas extras según política institucional. | Diferible |

## RF — Reportes

| ID | Requisito | Prioridad |
|---|---|---|
| RF-23 | Reporte por **persona** con rango de fechas. | MVP |
| RF-24 | Reporte **general/mensual** de todo el personal. | MVP |
| RF-25 | Exportar a **PDF**. | MVP |
| RF-26 | Exportar a **Excel** (xlsx). | Importante |
| RF-27 | Dashboard con KPIs: presentes hoy, tardanzas del mes, faltas del mes, señaladas pendientes. | Importante |
| RF-28 | Gráficas de asistencia mensual (SVG). | Diferible |

## RF — Notificaciones

| ID | Requisito | Prioridad |
|---|---|---|
| RF-29 | Alerta in-app por falta, tardanza, marcación señalada o dispositivo pendiente. | Importante |
| RF-30 | Centro de notificaciones con leída/no leída. | Importante |
| RF-31 | Notificación por correo (si se decide). | Diferible |

## RF — PWA

| ID | Requisito | Prioridad |
|---|---|---|
| RF-32 | App **instalable** (manifest + iconos) en Android/iOS/escritorio. | MVP |
| RF-33 | La app abre sin conexión (app shell) y muestra "Sin conexión" al intentar marcar. | Importante |
| RF-34 | Interfaz **mobile-first** para la marcación; vistas de administración optimizadas para el PC. | MVP |

Ver: [[02-Requisitos/Requisitos-no-funcionales|No funcionales]] · [[02-Requisitos/Roles-y-permisos|Roles y permisos]]
