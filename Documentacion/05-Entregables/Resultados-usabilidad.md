---
titulo: Resultados de usabilidad
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: entregable
estado: activo
fecha: 2026-10-25
---

# Resultados de usabilidad

## 2026-10-27 · Recorrido simulado del Panel de control en tres niveles (D-55)

> [!warning] Tampoco reemplaza la prueba con personas
> Mismo método que el anterior: cuenta toques y comprueba que la respuesta aparece.

| Tarea | Toques | Cómo |
|---|---|---|
| D1 · ¿Cuántos faltan por llegar hoy? | 0 | Recuadro Hoy |
| D2 · ¿La asistencia del mes va bien o mal? | 0 | «Bien» en el recuadro del mes |
| D3 · ¿Quién llega tarde más seguido? | 1 | Vistazo de Puntualidad |
| D4 · Docentes, mes anterior | 3 | Menú › Panel de control › Asistencia › Mes anterior › Docente |
| D5 · Ver lo pendiente (lo de secretaría) | 1 | Menú › Pendientes |
| D6 · Del vistazo a la sección completa | 2 | Recuadro › «Ver todo en …» |
| S0 · ¿Dónde entra la secretaría? | 0 | Directo en Pendientes |
| S7 · Buscar a Daniel y cargarle un permiso | 3 | Buscador › su panel › Cargar permiso |
| S8 · ¿Cuántos por llegar hoy? | 0 | Tarjeta «Hoy» de Pendientes |
| S9 · Planilla de hoy | 0 | Accesos de Pendientes |

**A observar con personas:** si el botón «Ver todo en …» se entiende como «más detalle», si las subsecciones del menú se descubren solas y si la secretaría echa de menos el «Registro del día» con ese nombre (ahora es *Hoy*).

## 2026-10-25 · Recorrido simulado del nuevo panel (antes de probar con personas)

> [!note] Historial
> Este recorrido es de la versión con selector «Resumen / Acción rápida» (D-53). Ese selector se quitó el 27/10: «Acción rápida» es ahora la sección *Pendientes* (ver el recorrido de arriba).

> [!warning] No reemplaza la prueba con personas
> Es un recorrido automático de las tareas D1–D5 y S7–S9 de la [[Prueba-de-usabilidad|guía]]: mide cuántos toques hacen falta y si la respuesta se encuentra. No mide dudas ni comprensión. La prueba con la directiva y secretaría queda para la visita al colegio.

| Tarea | Toques | Respuesta encontrada |
|---|---|---|
| D1 · ¿Cuántos faltan por llegar hoy? | 0 | «2 personas aún sin marcar» (módulo Hoy) |
| D2 · ¿La asistencia del mes va bien o mal? | 0 | «Bien» (módulo Este mes) |
| D3 · ¿Quién llega tarde más seguido? | 1 | Lista en el detalle de Puntualidad |
| D4 · Docentes, mes anterior | 3 | Este mes › Mes anterior › Docente |
| D5 · Ver la vista de secretaría | 1 | «Acción rápida» |
| S7 · Buscar a Daniel y cargar permiso | 3 | Buscador › su panel › Cargar permiso |
| S8 · ¿Cuántos por llegar hoy? | 0 | Línea «Hoy:» |
| S9 · Planilla de hoy | 0 | Botón visible en la primera pantalla |

**Cambio que salió del recorrido:** «quién llega tarde más seguido» solo estaba dentro de *Por categoría*, donde nadie lo buscaría. Se agregó también al detalle de *Puntualidad*.

**A observar con personas:** si entienden que el módulo completo se toca (el texto «Ver detalle» ayuda), si «Acción rápida» es un nombre claro para secretaría y si el filtro de categoría dentro del detalle se descubre solo.
