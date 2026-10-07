---
titulo: Equipo y reparto de tareas
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: servicio-comunitario
estado: activo
fecha: 2026-10-07
---

# 👥 Equipo y reparto de tareas

> [!important] Regla del registro
> Cada persona anota **solo lo que hizo**, con fecha, horas reales y **evidencia** (commit, archivo, foto, acta o lista de asistencia). Meta: **5 h/día · 25 h/semana**. Registro y firmas: [[06-Servicio-comunitario/Registro-de-horas|Registro de horas]].

## Integrantes

| # | Nombre | Rol en el proyecto |
|---|---|---|
| 1 | Schormeiker Lugo | Coordinación y desarrollo |
| 2 | Hector Diaz | Pruebas y calidad (QA) |
| 3 | Rebeca Nexans | Documentación y manual de usuario |
| 4 | Antonio Gonzalez | Enlace con el colegio y datos |
| 5 | Liz Espinoza | Investigación (antecedentes y diagnóstico) |
| 6 | Mariansel Herrera | Capacitación, presentación y difusión |

*(Los roles son una propuesta. Ajústenlos entre todos.)*

---

## Semana 1 — Planificación, decisiones y base del sistema (01/10 – 07/10/2026) · en curso

| Responsable | Actividad | Horas | Entregable / evidencia |
|---|---|---|---|
| **Schormeiker** | Coordinación de sesiones: problema, objetivos, alcance y requisitos | 6 | Documentación del proyecto (vault) |
| | Modelo de datos, reglas de negocio, arquitectura y parte académica | 7 | Notas de diseño, Método FODA |
| | Registro de decisiones con el equipo | 2 | [[03-Diseno/Registro-de-decisiones]] |
| | Desarrollo: base de datos, login, roles, personal, jornadas y feriados | 6 | Commit `ff28b59` en GitHub |
| | Cuentas de servicios, pruebas, publicación y reparto de tareas | 4 | Repositorio, este documento |
| **Hector** | Sesiones de equipo: problema, objetivos, requisitos y arquitectura | 7 | Asistencia a sesiones |
| | Plan de pruebas (casos T y F) | 3 | [[05-Entregables/Plan-de-pruebas]] |
| | Análisis de riesgos de seguridad (fotos del QR, ubicación falsa) | 3 | Registro de decisiones (D-05, D-06) |
| | Sesión de decisiones: QR + GPS y un celular por cuenta | 3 | Registro de decisiones |
| | Revisión de casos de geocerca y duplicados | 2 | Plan de pruebas |
| | Seguimiento de pruebas de login, roles, CRUD y permisos (RLS) | 7 | Registro de resultados |
| **Rebeca** | Sesiones de equipo: problema, requisitos, roles y parte académica | 8 | Asistencia a sesiones |
| | Revisión de redacción: planteamiento, justificación, glosario y resumen | 7 | Notas corregidas |
| | Sesión de decisiones: QR impreso y respaldo en el PC | 2 | Registro de decisiones |
| | Revisión del registro de decisiones y del manual de usuario | 3 | [[05-Entregables/Manual-de-usuario]] |
| | Seguimiento del desarrollo y actualización del tablero de tareas | 5 | [[04-Desarrollo/Tareas-por-semana]] |
| **Antonio** | Sesiones de equipo: problema, requisitos, jornada y tolerancia | 5 | Asistencia a sesiones |
| | Preparación de las preguntas para el colegio | 3 | [[00-Inicio/Preguntas-para-el-colegio]] |
| | Revisión de reglas de negocio (tardanza, faltas, permisos) | 2 | [[03-Diseno/Reglas-de-negocio]] |
| | Recursos del colegio (PC, internet, teléfonos) y análisis de viabilidad | 5 | Sección de recursos (Método FODA) |
| | Sesión de decisiones y registro de respuestas del colegio | 5 | Preguntas para el colegio |
| | Seguimiento del desarrollo y datos necesarios del personal | 5 | Lista de datos a recolectar |
| **Liz** | Sesiones de equipo: problema, requisitos y método FODA | 8 | Asistencia a sesiones |
| | Desglose síntomas → causas → consecuencias | 2 | [[01-Proyecto/Planteamiento-del-problema]] |
| | Investigación de tecnologías PWA y geolocalización | 3 | Notas de investigación |
| | Análisis FODA y estrategias | 2 | [[Metodo foda]] |
| | Sesión de decisiones y comparación de alternativas de control de ubicación | 5 | Registro de decisiones |
| | Seguimiento del desarrollo y plan de búsqueda de antecedentes | 5 | Plantilla de antecedentes |
| **Mariansel** | Sesiones de equipo: problema, requisitos, pantallas y parte académica | 8 | Asistencia a sesiones |
| | Revisión de la población beneficiada | 2 | Método FODA |
| | Revisión de la experiencia de uso en celular (mobile-first) | 2 | [[03-Diseno/Mapa-de-pantallas]] |
| | Estructura de la presentación del proyecto | 3 | [[05-Entregables/Presentacion-del-proyecto]] |
| | Sesión de decisiones: flujo de marcación con QR y mensajes al usuario | 5 | Manual de usuario |
| | Seguimiento del desarrollo e ideas para el cartel del QR y la capacitación | 5 | Notas |

**Total por integrante: 25 h.** Detalle día por día y firmas en [[06-Servicio-comunitario/Registro-de-horas|Registro de horas]].

## Semana 2 — Marcación QR + GPS

| Responsable | Actividad | Horas est. | Entregable / evidencia |
|---|---|---|---|
| **Schormeiker** | Desarrollo: QR, geocerca, dispositivos, marcación, cierre diario | 25 | Commits en GitHub |
| **Hector** | Estudiar el [[05-Entregables/Plan-de-pruebas]] y preparar casos F6–F20 | 5 | Casos listos |
| | Probar login, roles y CRUD de la Semana 1 en el PC y en 2 celulares | 8 | Registro de resultados |
| | Reportar fallas encontradas (descripción + captura) | 4 | Lista de incidencias |
| | Probar la marcación QR/GPS a medida que se entrega | 8 | Resultados F13–F20 |
| **Rebeca** | Revisar y corregir la redacción de todo el vault | 8 | Notas corregidas |
| | Capturas de pantalla de la Semana 1 para el [[05-Entregables/Manual-de-usuario]] | 6 | Capturas en el manual |
| | Redactar el manual: login, personal y jornadas | 8 | Secciones del manual |
| | Acta de las reuniones del equipo | 3 | Actas |
| **Antonio** | Reunión con la directiva: preguntas pendientes (#1, 2, 5–9, 11, 12) | 5 | Acta firmada por el colegio |
| | Tomar las coordenadas de la entrada y medir el radio en sitio | 3 | Coordenadas + fotos |
| | Recolectar la lista del personal (nombre, cédula, cargo, correo, horario) | 10 | Plantilla CSV completa |
| | Recolectar jornadas reales y el calendario de feriados | 4 | Datos entregados |
| | Pasar las respuestas a [[00-Inicio/Preguntas-para-el-colegio]] | 3 | Nota actualizada |
| **Liz** | Buscar 4 antecedentes (tesis o artículos) y llenar la plantilla de [[Metodo foda]] | 12 | 4 fichas de antecedentes |
| | Diagnóstico: entrevistar a secretaría sobre el tiempo que toma hoy el registro manual | 6 | Entrevista + resultados |
| | Redactar el marco teórico breve (PWA, QR, geolocalización, control de asistencia) | 7 | Documento |
| **Mariansel** | Diseñar el cartel del QR (formato A4 con instrucciones) | 6 | Diseño en PDF |
| | Guion y diapositivas iniciales de la [[05-Entregables/Presentacion-del-proyecto]] | 10 | Borrador de diapositivas |
| | Encuesta al personal: tipo de teléfono, sistema operativo y datos móviles | 6 | Encuesta + resultados |
| | Material de difusión: aviso al personal sobre la nueva app | 3 | Aviso |

## Semana 3 — Respaldo en el PC y reportes

| Responsable | Actividad | Horas est. |
|---|---|---|
| **Schormeiker** | Desarrollo: kiosco, PIN, registro del día, reportes PDF/Excel, panel | 25 |
| **Hector** | Probar el kiosco, el PIN, los reportes, y comparar un reporte contra un cálculo manual (F21–F34) | 25 |
| **Rebeca** | Manual: marcación, kiosco, reportes; guía rápida de 1 página para el personal | 25 |
| **Antonio** | Cargar al personal real y las jornadas en la plataforma; verificar los datos con secretaría | 25 |
| **Liz** | Análisis de resultados del diagnóstico; capítulo de metodología del informe | 25 |
| **Mariansel** | Plan de capacitación (agenda y material); video tutorial corto de marcación | 25 |

## Semana 4 — Despliegue y entrega

| Responsable | Actividad | Horas est. |
|---|---|---|
| **Schormeiker** | PWA, despliegue en Vercel, correcciones, entrega de la cuenta a la directiva | 25 |
| **Hector** | Pruebas en celulares reales del personal (Android/iPhone), Lighthouse, informe de pruebas | 25 |
| **Rebeca** | Manual final con capturas; informe final del servicio comunitario | 25 |
| **Antonio** | Imprimir y colocar el QR; autorizar el PC; acompañamiento en el colegio los primeros días | 25 |
| **Liz** | Conclusiones y recomendaciones; medición de resultados (tiempo antes y después) | 25 |
| **Mariansel** | Ejecutar la capacitación; registrar la asistencia a la capacitación; exposición final | 25 |

> Las horas estimadas son una guía. En el [[06-Servicio-comunitario/Registro-de-horas|registro]] va **lo que realmente se trabajó**.
