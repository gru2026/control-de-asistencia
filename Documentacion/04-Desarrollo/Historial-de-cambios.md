---
titulo: Historial de cambios
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: desarrollo
estado: activo
fecha: 2026-10-28
---

# Historial de cambios

Qué cambió en la app después del cierre del desarrollo (19/10/2026), en palabras simples. El porqué técnico de cada cambio está en el [[03-Diseno/Registro-de-decisiones|Registro de decisiones]]; cómo se usa, en el [[05-Entregables/Manual-de-usuario|Manual de usuario]].

> [!info] Lo más importante para el colegio
> 1. El **Registro del día** ahora se llama **Hoy** y está dentro de **Panel de control**.
> 2. La **secretaría entra a *Pendientes***: lo que espera una acción, cada cosa con su botón.
> 3. El panel **dice en palabras** cómo vamos (Bien / Atención / Bajo) y **todo se puede tocar** para ver el detalle.
> 4. En el menú, «Asistencia» pasó a llamarse **«Permisos»** (con la pestaña *Por revisar*).

## 27/10/2026 — Cada dato lleva a su detalle (D-56)

- Las barras, los segmentos, los puntos de las gráficas, los días del calendario, los tramos de llegada y las semanas de faltas se pueden tocar y llevan a su lista con el filtro puesto.
- **Vista de una categoría:** comparada con el colegio («8 puntos por debajo del colegio»), con su tendencia y sus personas.
- Arriba se ve lo que se está filtrando («Viendo solo: Cocina ✕») y se quita con la ✕.
- **«Volver al vistazo»** cuando se llega a una sección desde el panel lateral.
- Las descargas en Excel salen con el período y la categoría que se están viendo.
- Si un filtro deja la pantalla sin datos, el panel explica por qué y ofrece otra opción.
- La ficha de cada persona muestra su lectura y **cómo le ha ido semana a semana**.
- Corrección: la gráfica de tendencia ya no se sale de su tarjeta (el promedio pasó a la leyenda).

Commits `f794b36`, `303fe29`.

## 27/10/2026 — Panel de control en tres niveles (D-55)

- **Resumen → vistazo → sección:** el recuadro abre un panel a la derecha con lo esencial y el botón **«Ver todo en …»** abre la página completa.
- **Seis secciones** en el menú: Hoy, Asistencia, Puntualidad, Ausencias y permisos, Por categoría, Pendientes. En el celular, como pestañas arriba.
- El **Registro del día** pasa a ser *Hoy*; los enlaces viejos llevan solos.
- Se quitó el selector «Resumen / Acción rápida»: su contenido es la sección *Pendientes*.
- Nuevo período **«Esta semana»**; el período y la categoría se conservan al cambiar de sección.
- Tablas que se ordenan tocando el encabezado, con buscador y «Ver todos».
- Corrección: los filtros de Personal, Hoy y otras listas volvieron a quedar en una fila.

Commits `7bc01ae`, `d42cf18`.

## 27/10/2026 — Animaciones y gráficas (D-54)

- Los recuadros entran uno tras otro, la cifra principal cuenta desde 0, el anillo se llena y las líneas se dibujan.
- Gráficas más claras: curva suave, franjas de fondo Bien/Atención/Bajo y barras coloreadas por su lectura.
- El calendario usa los mismos límites que el resto (90 % y 80 %).
- Con «reducir movimiento» activado en el equipo, todo aparece sin animación.

Commit `4d73b18`.

## 26/10/2026 — Panel en palabras (D-53)

- La primera pantalla dice en palabras cómo vamos («32 de 45 ya llegaron», «96 % de asistencia · Bien») en lugar de cifras sueltas; los gráficos completos pasaron a una segunda capa.
- Recorrido de usabilidad simulado → [[05-Entregables/Resultados-usabilidad]].

Commit `ff5575d`.

## 20/10/2026 — Formularios y orden visual (D-51, D-52)

- Botón **Acciones** en la barra superior: buscar a una persona, nuevo personal, cargar permiso, cuentas y descargas.
- **Nuevo personal** y **gestión de cuentas** en ventanas, sin salir de la pantalla.
- Todas las pantallas al mismo ancho; formularios con los campos del tamaño de su dato y una columna de ayuda a la derecha (por ejemplo, la vista previa del encabezado de la planilla).

Commits `b0a5bf5`, `2341bca`, `2f6a8c2`.

## 20/10/2026 — Sensación de app (D-46 a D-50)

- La app ya no se recarga al cambiar de pantalla y las pantallas se precargan.
- Tocar el nombre de una persona abre su resumen a la derecha.
- Mensajes con **«Deshacer»** después de cada acción rápida.
- Avisos en un panel desde la campana.
- Marcar con «Ahora» u «Otra hora» y motivos con botones; ficha de la persona por pestañas.

Commits `3ba44c2` a `7bfdce4`.

## Pendiente

- Prueba en teléfonos reales (Android y iPhone).
- Prueba de usabilidad con personas del colegio → [[05-Entregables/Prueba-de-usabilidad]].
- Volver a medir con Lighthouse el panel nuevo → [[05-Entregables/Informe-de-auditoria]].
- Puesta en marcha y capacitación.
