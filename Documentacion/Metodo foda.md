---
titulo: Método FODA y taller del servicio comunitario
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: academico
estado: borrador
fecha: 2026-10-06
---

## Apuntes de clase

1. que pretendemos alcanzar con el servicio comunitario.
2. Como comprobar el proyecto con relacion a recursos.
3. Objetivos especificos.
4.  Distingir los objetivos sobre las actividades.
5. justifiacion del porque se debe resolver ese problema y que afecta en la administracion.
6.  Revisar los antecedentes de otros trabajos y ver si nos podria ayudar en la solucion de problemas.
7. poblacion beneficiada.

### Taller (enunciado)

1. Cual es el objetivo genera.
2. senalar dos objetivos especificos.
3. a cada objetivo especifico le vamos agregar dos actividades para alcancazar los dos objetivos especificos.
4. que poblacion se va a beneficiar con su trabajo.
	1. la poblacion beneficiada es la administracion del colegio en automatizar el proceso de asistencias de su personal interno y docente,  Centraliza los datos **en tiempo real** con transparencia y disponibilidad inmediata.
5. Justificacion de cual es la importancia de ese proyecto.

---

# Respuestas del taller

> [!tip] Diferencia clave (apunte 4)
> Un **objetivo** dice *qué* se quiere lograr (resultado, verbo en infinitivo). Una **actividad** dice *cómo* se logra (acción concreta, verificable, con fecha).

## 1. Objetivo general

Implementar una aplicación web progresiva (PWA) para el registro y control de la asistencia del personal docente y administrativo de la U.E.E. General Rafael Urdaneta, que permita digitalizar la marcación diaria mediante código QR y geolocalización, y generar reportes automáticos que optimicen la gestión administrativa de la institución.

## 2. Objetivos específicos y 3. actividades

### Objetivo específico 1
**Digitalizar el registro diario de entrada y salida del personal** mediante la marcación desde el teléfono con código QR, geolocalización y hora del servidor, garantizando la autenticidad de cada registro.

| # | Actividad | Indicador / evidencia |
|---|---|---|
| 1.1 | Diagnosticar con la directiva el proceso actual de asistencia y definir las reglas institucionales (jornada, tolerancia, validación por QR y GPS). | Registro de decisiones y preguntas respondidas |
| 1.2 | Desarrollar e instalar en los teléfonos del personal el módulo de marcación (escáner QR + GPS), el QR impreso en la entrada y el respaldo en el PC del colegio. | App en línea; QR colocado; personal marcando |

### Objetivo específico 2
**Automatizar el cálculo de horas trabajadas, tardanzas y faltas** y la generación de reportes exportables (PDF/Excel) para apoyar la toma de decisiones de la directiva.

| # | Actividad | Indicador / evidencia |
|---|---|---|
| 2.1 | Programar las reglas de cálculo (estados, horas, cierre diario de faltas) y validarlas con pruebas comparadas contra el cálculo manual. | Pruebas aprobadas; reporte de un mes coincide con el manual |
| 2.2 | Elaborar el módulo de reportes y capacitar a la directiva y secretaría en su uso, entregando el manual de usuario. | Reporte mensual en < 1 min; acta/lista de asistencia a la capacitación |

> Objetivos complementarios (si el profesor permite más de dos): implementar roles y seguridad de acceso; proporcionar alertas de faltas y tardanzas. Ver [[01-Proyecto/Justificacion-y-objetivos]].

## 4. Población beneficiada

| Tipo | Población | Beneficio |
|---|---|---|
| **Directa** | **Directiva** (rectoría, coordinación, personalista) | Reportes inmediatos y datos confiables para decisiones y evaluación del personal |
| **Directa** | **Secretaría / administración** | Elimina la transcripción manual, los libros de actas y las horas de consolidación |
| **Directa** | **Docentes y personal administrativo** | Marcan en segundos desde su teléfono y consultan su propio historial con transparencia |
| **Indirecta** | **Estudiantes y representantes** | Una administración más eficiente y un mejor control del cumplimiento de la jornada docente |
| **Indirecta** | **Comunidad educativa / institución** | Información histórica digital que no se pierde ni se deteriora |

*(Agregar la cantidad aproximada de personal cuando el colegio la suministre; la cantidad es variable.)*

## 5. Justificación (importancia del proyecto)

El control de asistencia del personal es un insumo directo de la gestión de recursos humanos del colegio: determina el cumplimiento de la jornada, respalda la evaluación del personal y sustenta las decisiones de la directiva. Actualmente este proceso se realiza en libros de actas y formatos físicos, lo que genera lentitud en el registro, errores de transcripción, pérdida o deterioro de los documentos y dificultad para obtener reportes oportunos; en consecuencia, el personal administrativo invierte horas de trabajo manual y la directiva decide sin datos actualizados.

La implementación de una PWA resuelve este problema con un **costo de infraestructura nulo** (servicios en planes gratuitos), aprovechando recursos que la institución ya posee: **el PC del colegio, la conexión a internet y los teléfonos del personal**. La validación con código QR, geolocalización y hora del servidor aporta **confiabilidad** a cada registro, y los reportes automáticos reducen el tiempo de consolidación mensual de horas a minutos. Desde la perspectiva del servicio comunitario, el proyecto transfiere una herramienta tecnológica sostenible a una institución educativa pública, fortaleciendo su capacidad administrativa más allá de la duración del servicio.

## 6. Antecedentes (apunte 6) — por completar

> [!warning] Pendiente de investigación
> Buscar **2 a 4 trabajos reales** (tesis o proyectos de servicio comunitario de universidades venezolanas o latinoamericanas, artículos) sobre: *sistemas de control de asistencia de personal*, *aplicaciones web progresivas*, *marcación con código QR y geolocalización*. Fuentes sugeridas: repositorios institucionales de universidades, Google Académico, SciELO, Redalyc.

Plantilla por antecedente:

| Campo | Contenido |
|---|---|
| Autor(es) y año | |
| Título | |
| Institución / revista | |
| Objetivo del trabajo | |
| Metodología / tecnología | |
| Resultados | |
| **Aporte a nuestro proyecto** | (qué idea tomamos o qué problema nos ayuda a evitar) |

## 7. Recursos (apunte 2: cómo comprobar el proyecto con relación a recursos)

| Tipo | Recurso | Disponibilidad | Costo |
|---|---|---|---|
| Humano | 1 desarrollador (diseño, desarrollo, pruebas, capacitación) | ✅ | — |
| Humano | Directiva y secretaría (datos, validación, uso) | ✅ | — |
| Tecnológico | PC del colegio con internet | ✅ (confirmado) | Existente |
| Tecnológico | Teléfonos del personal con datos | ✅ (confirmado) | Existente |
| Tecnológico | Supabase (BD + auth), Vercel (hosting), GitHub | Plan gratuito | $0 |
| Material | Impresión del QR (1 hoja, renovable) | ✅ | Mínimo |
| Tiempo | 4 semanas de desarrollo + capacitación | Planificado | — |

**Comprobación:** el proyecto es viable porque todos los recursos necesarios existen en la institución o son gratuitos; el único costo material es la impresión periódica del código QR.

---

# Análisis FODA

| | **Positivo** | **Negativo** |
|---|---|---|
| **Interno** (proyecto/equipo) | **Fortalezas** | **Debilidades** |
| | F1. Costo de infraestructura $0 (planes gratuitos). | D1. Un solo desarrollador: riesgo si se atrasa o enferma. |
| | F2. Aprovecha recursos existentes (PC, internet, teléfonos). | D2. Plazo corto (4 semanas). |
| | F3. Marcación verificable: QR + GPS + hora del servidor + un teléfono por cuenta. | D3. Dependencia de servicios externos gratuitos (límites del plan). |
| | F4. Configurable (jornada, tolerancia, radio) sin tocar código. | D4. Sin marcación offline en la primera versión. |
| | F5. Reportes automáticos en PDF/Excel en segundos. | D5. Valores institucionales aún por confirmar. |
| **Externo** (colegio/entorno) | **Oportunidades** | **Amenazas** |
| | O1. Apoyo de la directiva al proyecto. | A1. Fallas de internet o electricidad en la institución/zona. |
| | O2. Personal con teléfono y datos. | A2. Resistencia al cambio de parte del personal. |
| | O3. Base para futuros módulos (estudiantes, notificaciones por correo, multi-sede). | A3. Teléfonos antiguos o con GPS impreciso. |
| | O4. Modelo replicable en otras escuelas de la zona. | A4. Intentos de evadir el control (fotos del QR, ubicación falsa). |
| | O5. Digitalización alineada con la modernización de la gestión educativa. | A5. Cambios de personal directivo o de políticas. |

## Estrategias derivadas

| Tipo | Estrategia |
|---|---|
| **FO** (usar fortalezas para aprovechar oportunidades) | Presentar los reportes automáticos a la directiva como herramienta de evaluación; documentar el proyecto para replicarlo en otras escuelas. |
| **DO** (superar debilidades con oportunidades) | Trabajar por cortes verticales (MVP primero) y validar semanalmente con la directiva para cerrar los valores pendientes. |
| **FA** (usar fortalezas contra amenazas) | Geocerca + regeneración del QR + un teléfono por cuenta contra la evasión; respaldo en el PC ante teléfonos sin GPS o fallas. |
| **DA** (minimizar debilidades y amenazas) | Contingencia de registro manual en el PC ante caídas de internet; capacitación breve y manual sencillo contra la resistencia al cambio; respaldo periódico de la base de datos. |
