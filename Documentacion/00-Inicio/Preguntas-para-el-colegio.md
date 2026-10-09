---
titulo: Preguntas para el colegio
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: pendientes
estado: en-progreso
fecha: 2026-10-01
---

# ❓ Preguntas para el colegio

Datos que debemos confirmar con la institución antes de cerrar el diseño. Marcar ✅ cuando se responda y **trasladar la respuesta a la nota correspondiente** (indicada en cada bloque).

> [!tip] Uso
> Llevar esta lista a la reunión con la directiva. Cada respuesta alimenta [[03-Diseno/Reglas-de-negocio|Reglas de negocio]], [[02-Requisitos/Requisitos-funcionales|Requisitos]] o el [[01-Proyecto/Cronograma-4-semanas|Cronograma]].

---

## 1. Jornada y horarios → *a [[03-Diseno/Reglas-de-negocio]]*

- [ ] Hora exacta de **entrada** y de **salida** del personal.
- [ ] ¿Los días laborables son lunes a viernes? ¿Hay jornada los sábados?
- [ ] ¿Existe pausa/almuerzo? ¿De cuánto tiempo y se descuenta de las horas?
- [ ] ¿Todos los departamentos tienen la misma jornada o varía (docentes vs. administrativos)?

**Respuesta:** 🟡 Parcial (2026-10-06)
> La jornada **cambia con frecuencia**, por lo que será **configurable desde el PC** (plantillas de jornada). Los valores concretos los carga la administración; por defecto 07:00–16:00, lunes a viernes.

## 2. Tolerancia para tardanzas → *a [[03-Diseno/Reglas-de-negocio]]*

- [ ] ¿Cuántos minutos de tolerancia antes de marcar **tarde**? (ej. 15 min)
- [ ] ¿Se permite marcación "tarde" hasta una hora límite? ¿Después de esa hora cuenta como falta?
- [ ] ¿Quién define esta política: rectoría, coordinación o personalista?

**Respuesta:** 🟡 Parcial (2026-10-06)
> La tolerancia es **configurable** (por plantilla de jornada). Valor por defecto: 15 min.

## 3. Proceso de marcación → *a [[03-Diseno/Mapa-de-pantallas]] y [[02-Requisitos/Requisitos-funcionales]]*

- [x] ¿Cada miembro del personal marca **su propia** entrada/salida (desde su celular o un computador)?
- [x] ¿O la **secretaría registra a todos** desde una pantalla central (marcación masiva)?
- [ ] ¿Se requiere además una ficha física o firma como respaldo?
- [x] ¿Se acepta marcación desde cualquier lugar (casa) o solo dentro del plantel (geolocalización/IP)?

**Respuesta:** ✅ (2026-10-06)
> - Cada persona marca **desde su propio celular**, escaneando un **QR impreso** en la entrada dentro de la app.
> - Validación en **entrada y salida**: QR activo + **GPS dentro del radio** del colegio + fecha/hora **del servidor**.
> - Fuera del radio → **bloqueado**. GPS impreciso → se permite y queda **señalado ⚠️** para revisión.
> - **Un solo celular por cuenta**; un cambio de teléfono lo aprueba secretaría desde el PC.
> - **Respaldo sin teléfono en el PC**: la secretaría marca a la persona **o** la persona se marca sola con cédula + PIN (ambas opciones).
> - Detalle en [[03-Diseno/Registro-de-decisiones|Registro de decisiones]].

## 4. Alcance del personal → *a [[03-Diseno/Modelo-de-datos]]*

- [x] ¿Cuántos **docentes** y cuántos **administrativos** hay aproximadamente?
- [ ] ¿Incluimos otros perfiles? (mantenimiento, seguridad, personal de servicio)
- [ ] ¿Hay personal con jornada parcial o por horas?

**Respuesta:** ✅ (2026-10-06)
> La cantidad es **variable** y no es definitoria: el sistema no asume un número fijo (búsqueda + paginación en listas). Participan **docentes y personal administrativo**.

## 5. Permisos y licencias → *a [[03-Diseno/Reglas-de-negocio]]*

- [ ] ¿Quién aprueba un permiso o licencia? (rectoría, personalista)
- [ ] ¿Cómo se registra en el sistema: la aprueba el jefe o la carga secretaría?
- [ ] ¿Cuáles causales **no cuentan como falta**? (enfermedad, duelo, comisión de servicio…)
- [ ] ¿Se exige adjuntar justificación (copia de licencia médica)?

**Respuesta:**
> _Por definir_

## 6. Notificaciones y alertas → *a [[03-Diseno/Mapa-de-pantallas]]*

- [ ] ¿Alertas **solo dentro de la app** (panel) o también por **correo electrónico**?
- [ ] ¿A quién llegan las alertas de faltas/tardanzas? (rectoría, personalista, coordinación)
- [ ] ¿Frecuencia: en el momento, resumen diario o resumen semanal?

**Respuesta:**
> _Por definir_

## 7. Reportes → *a [[05-Entregables/Manual-de-usuario]]*

- [ ] ¿Período del reporte: **mensual**, bimestral, por lapso escolar?
- [ ] ¿Qué columnas/debe incluir? (horas, tardanzas, faltas, permisos, % asistencia…)
- [ ] ¿Quién los firma o da visto bueno?
- [ ] ¿Formato preferido: **PDF**, **Excel** o ambos?

**Respuesta:**
> _Por definir_

## 8. Horas extras y anticipaciones → *a [[03-Diseno/Reglas-de-negocio]]*

- [ ] ¿Las horas antes de la hora de entrada o después de la salida se consideran **horas extras**?
- [ ] ¿Se compensan con tiempo o con pago? (afecta cómo las reporta el sistema)
- [ ] ¿Quién autoriza las horas extras?

**Respuesta:**
> _Por definir_

## 9. Feriados y días no laborables → *a [[03-Diseno/Modelo-de-datos]]*

- [ ] ¿Quién carga los feriados en el sistema?
- [ ] ¿Se maneja calendario escolar oficial (días de descanso del personal)?

**Respuesta:**
> _Por definir_

## 10. Dispositivos y conectividad → *a [[03-Diseno/PWA-y-offline]]*

- [x] ¿Hay un **computador en la oficina** para las marcaciones?
- [x] ¿El personal usará sus **celulares** (¿cuántos con smartphone)?
- [x] ¿Hay internet estable en la escuela? ¿Proveedores móviles? (define la importancia del modo offline)

**Respuesta:** ✅ (2026-10-06)
> - Hay **un PC** en el colegio: desde ahí se **administra todo el sistema** y sirve de **respaldo** para marcar sin teléfono.
> - Cada docente y miembro del personal debe tener **teléfono con internet**.
> - El colegio tiene internet. **Marcar requiere conexión**; si se cae, secretaría registra desde el PC con observación "falla de conexión". Marcación offline real → versión 2.

## 11. Datos personales y privacidad → *a [[02-Requisitos/Requisitos-no-funcionales]]*

- [ ] ¿Qué datos se registran del personal? (cédula, teléfono, correo…)
- [ ] ¿Quién puede ver los reportes de cada persona? (principio de mínimo privilegio)
- [ ] ¿Hay alguna indicación institucional sobre protección de datos?

**Respuesta:**
> _Por definir_

## 12. Cuentas y administración → *a [[04-Desarrollo/Despliegue-Vercel-Supabase]]*

- [x] ¿Quién es el **administrador inicial** del sistema? (nombre y correo)
- [ ] ¿Con qué correo/dominio se crean las cuentas del personal? (¿correo institucional?)
- [x] ¿Quién podrá dar de alta/baja usuarios en el futuro?

**Respuesta:** 🟡 Parcial (2026-10-06)
> El administrador será **la administración real del colegio** (rol `directiva`), no el desarrollador. Pendiente: **nombre y correo** de esa persona y dominio de correos del personal.

## 13. Confirmar fuera de alcance

- [x] ¿Confirmamos que el sistema es **solo para personal** (docentes y administrativos) y **NO** para asistencia de estudiantes?

**Respuesta:** ✅ (2026-10-06)
> Confirmado: **solo personal administrativo y profesores**. Estudiantes fuera de alcance.

## 14. Ubicación del colegio (geocerca) → *a [[03-Diseno/Registro-de-decisiones]]*

- [ ] Coordenadas (latitud, longitud) o enlace de Google Maps de la **entrada principal**.
- [ ] Radio permitido (sugerido: 150 m).

**Respuesta:** 🟡 El equipo ya tiene la ubicación; falta cargarla en la configuración.

---

## 15. Material pendiente para el jueves → *a [[03-Diseno/Registro-de-decisiones]] D-25*

- [ ] **Logo del colegio** en buena calidad (PNG o SVG).
- [ ] **Escudo del estado** en buena calidad (PNG o SVG).
- [ ] Confirmar horarios reales: docentes, personal de 40 h, cocina y vigilancia (diurna y nocturna).
- [ ] Revisar la transcripción de la nómina (orden nombre/apellido y la fila 08 «…Ingris Rivas», tapada en la foto).

**Respuesta:** 🟡 Se piden en el colegio el próximo jueves.

## Registro de respuestas

| # | Tema | ¿Resuelto? | Fecha | Respuesta resumida |
|---|---|---|---|---|
| 1 | Jornada | 🟡 | 2026-10-06 | Configurable desde el PC; valores concretos pendientes |
| 2 | Tolerancia | 🟡 | 2026-10-06 | Configurable; default 15 min |
| 3 | Marcación | ✅ | 2026-10-06 | Celular propio + QR impreso + GPS; respaldo en PC (secretaría o PIN) |
| 4 | Personal | ✅ | 2026-10-06 | Cantidad variable; docentes + administrativos |
| 5 | Permisos | ⬜ | | |
| 6 | Notificaciones | ⬜ | | |
| 7 | Reportes | ⬜ | | |
| 8 | Horas extras | ⬜ | | |
| 9 | Feriados | ⬜ | | |
| 10 | Dispositivos | ✅ | 2026-10-06 | 1 PC central + celular propio con internet |
| 11 | Privacidad | ⬜ | | |
| 12 | Cuentas | 🟡 | 2026-10-06 | Admin = administración del colegio; falta nombre/correo |
| 13 | Alcance | ✅ | 2026-10-06 | Solo personal y profesores |
| 14 | Ubicación | 🟡 | 2026-10-06 | Coordenadas disponibles; falta cargarlas |
