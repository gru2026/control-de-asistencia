---
titulo: Prueba de usabilidad
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: entregable
estado: activo
fecha: 2026-10-20
---

# Prueba de usabilidad con personas del colegio

> [!info] Para qué sirve
> Comprobar que personas poco acostumbradas a las aplicaciones modernas logran las tareas principales **solas, rápido y sin estrés**, antes de la capacitación. Responsables: Hector (conduce) y Mariansel (anota). Duración: 20 minutos por persona.

## Participantes

- 1 o 2 personas de **secretaría** (usarán el PC).
- 2 personas del **personal** (docente u obrero) con su propio teléfono, idealmente una con Android y otra con iPhone, y al menos una que diga que «no es buena con el teléfono».

Usar las cuentas de prueba (`Documentacion/_privado/Usuarios-de-prueba.md`). No usar datos de personas reales para las tareas que cambian datos.

## Cómo conducirla

1. Explicar: «Estamos probando la app, no a usted. Si algo no sale, es culpa de la app».
2. Dar cada tarea en voz alta, tal como está escrita. **No ayudar** salvo que la persona se rinda; anotar dónde dudó.
3. Pedir que piense en voz alta («¿qué está buscando ahora?»).
4. Cronometrar desde que termina la consigna hasta que la tarea queda hecha.

## Tareas

### Personal (teléfono)

| # | Consigna | Éxito | Meta |
|---|---|---|---|
| P1 | «Entre a la app con su cédula y la contraseña que le dimos» (0000) | Crea su contraseña y llega a Mi asistencia | < 2 min |
| P2 | «Marque su entrada» (con el QR de prueba) | Ve «Entrada registrada» | < 30 s |
| P3 | «¿Cuántas veces llegó tarde este mes?» | Lo encuentra en Historial | < 1 min |
| P4 | «Revise si tiene algún aviso» | Abre la campana | < 20 s |

### Secretaría (PC)

| # | Consigna | Éxito | Meta |
|---|---|---|---|
| S1 | «Daniel llegó sin teléfono. Regístrele la entrada» | Panel de control › Hoy › Marcar entrada › Registrar | < 45 s |
| S2 | «Ayer se cayó el internet y Daniel llegó a las 7:10. Regístrelo» | Día anterior, hora y motivo | < 1,5 min |
| S3 | «Daniel trae un reposo de 3 días desde mañana. Cárguelo» | Permiso con fechas y motivo | < 1 min |
| S4 | «Daniel cambió de teléfono» | Tocar su nombre › Cambiar de teléfono | < 45 s |
| S5 | «Descargue el resumen de este mes en Excel» | Reportes › Resumen › Excel | < 45 s |
| S6 | «Equivocó una marcación: deshágala» | Usa «Deshacer» del mensaje | < 20 s |

### Directiva y secretaría: panel (D-53)

Se prueba que la administración **lee el panel sin interpretar cifras** y que llega al detalle buscando.

| # | Consigna | Éxito | Meta |
|---|---|---|---|
| D1 | «¿Cuántas personas faltan por llegar hoy?» | Lo dice el módulo Hoy, sin tocar nada | < 15 s |
| D2 | «¿La asistencia de este mes va bien o mal?» | Lee «Bien / Atención / Bajo» en Este mes | < 15 s |
| D3 | «¿Quién llega tarde más seguido?» | Toca Puntualidad y lee la lista | < 30 s |
| D4 | «Vea cómo les fue a los docentes el mes anterior» | Este mes › Mes anterior › Categoría Docente | < 1 min |
| D5 | (Directiva) «Ahora vea lo que tiene pendiente la secretaría» | Menú › Panel de control › Pendientes | < 20 s |
| D6 | «Vea todas las faltas del mes» | Recuadro de Ausencias › «Ver todo en Ausencias» | < 30 s |
| S7 | «Busque a Daniel y cárguele un permiso» | Buscador › su panel › Cargar permiso | < 45 s |
| S8 | «¿Cuántos están por llegar hoy?» | Lo lee en la línea «Hoy:» | < 15 s |
| S9 | «Abra la planilla de hoy» | Botón «Planilla PDF» | < 20 s |

## Qué anotar

| Persona | Tarea | Tiempo | ¿Lo logró sola? (sí / con ayuda / no) | Dónde dudó o qué dijo |
|---|---|---|---|---|
| | | | | |

Al final, tres preguntas:
1. Del 1 al 5, ¿qué tan fácil le pareció? 
2. ¿Qué fue lo más confuso?
3. ¿Hay alguna palabra que no entendió?

## Después

- Toda tarea que no se logró sola o pasó la meta se convierte en un cambio de la app o del manual.
- Resultados en una nota nueva: `05-Entregables/Resultados-usabilidad.md`.
