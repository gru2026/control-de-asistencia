---
titulo: Mapa de pantallas
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: diseno
estado: activo
fecha: 2026-10-28
---

# Mapa de Pantallas

> [!note] Actualización 28/10/2026
> Este mapa describe la app **tal como está publicada**. Cambios desde la versión anterior:
> - El **Panel de control** se lee en tres niveles (resumen → vistazo → sección) y tiene **seis secciones propias** en el menú ([[03-Diseno/Registro-de-decisiones|D-53 a D-56]]).
> - El **Registro del día** pasó a ser **Panel de control › Hoy** (`/panel/hoy`); `/asistencia/registro` redirige allí.
> - El ítem de menú «Asistencia» ahora se llama **«Permisos»** (Permisos y Por revisar).
> - La **secretaría entra a Pendientes**; la directiva, al resumen del panel.
> - El **kiosco con cédula + PIN se descartó** (D-37): el respaldo es *Hoy* en el PC de secretaría. El personal entra con su **cédula** y la contraseña inicial **0000** (D-42).

Dos contextos de uso:
- 📱 **Celular** del personal → marcar y ver su historial (mobile-first).
- 🖥️ **PC del colegio** → administración, panel de control y respaldo de la marcación.

## Árbol de rutas

```
/login                              Autenticación (pública)
/cambiar-clave                      Crear la contraseña propia (obligatorio en el primer ingreso)

📱 Personal
/asistencia                         Marcar entrada/salida (QR + GPS) y últimos días
/historial                          Su asistencia mes a mes (calendario y días)
/notificaciones                     Sus avisos

🖥️ Directiva y secretaría
/panel                              Panel de control · resumen (6 recuadros + vistazos)
/panel/hoy                          Hoy: personal del día, marcación asistida, hora manual, permisos
/panel/asistencia                   Asistencia del período: tendencia, calendario, día por día
/panel/puntualidad                  Hora de llegada, días de la semana, quién llega tarde
/panel/ausencias                    Faltas del período, faltas por semana, permisos de la semana
/panel/categorias                   Comparación entre categorías · con ?categoria=: vista de una categoría
/panel/pendientes                   Lo que espera una acción, buscador, estado de hoy, accesos
/permisos                           Permisos (listado + filtros) · /permisos/[id] crear/editar
/asistencia/revision                Marcaciones señaladas (pestaña «Por revisar» de Permisos)
/personal                           Lista de personal (búsqueda, filtros, paginación)
/personal/[id]                      Ficha por pestañas: resumen, datos, horario, teléfono y cuenta, estado
/personal/nuevo                     [directiva] Alta completa (también hay alta rápida en ventana)
/personal/cuentas                   [directiva] Crear cuentas en lote + hoja de claves
/personal/importar                  [directiva] Importar desde CSV
/reportes                           Planilla diaria oficial (PDF/Excel)
/reportes/resumen                   Resumen del período por persona (PDF/Excel)
/jornadas                           [directiva] Jornadas, feriados y categorías
/configuracion                      [directiva] Accesos, institución (con vista previa), demostración
/configuracion/marcacion            [directiva] Ubicación del colegio, ubicaciones de prueba, franjas, cierre diario
/configuracion/qr                   [directiva] Generar / imprimir / desactivar el QR
/configuracion/usuarios             [directiva] Cuentas y roles
/configuracion/puesta-en-marcha     [directiva] Lista para empezar el uso real

/asistencia/registro                Redirección permanente → /panel/hoy (conserva la consulta)

Fragmentos de ventana (se abren sin salir de la pantalla; no se navega a ellos)
/ventanas/persona/[id]              Panel lateral de una persona
/ventanas/permiso                   Cargar un permiso
/ventanas/acciones                  Menú «Acciones» de la barra superior
/ventanas/personal-nuevo            [directiva] Alta rápida de personal
/ventanas/cuenta/[id]               [directiva] Gestionar una cuenta
/ventanas/cuenta-nueva              [directiva] Cuenta sin ficha de personal
```

> [!info] Protección
> Todo excepto `/login` pasa por `middleware.ts` y las reglas de `src/lib/auth/acceso.ts`: sin sesión → `/login`; sin permiso → 403 amigable. `/panel/*`, `/permisos`, `/personal`, `/reportes` y `/ventanas/*` son de directiva y secretaría; `/configuracion`, `/jornadas` y el alta de personal, solo de directiva.

## Página de inicio por rol

| Rol | Entra a |
|---|---|
| Directiva | `/panel` (resumen) |
| Secretaría | `/panel/pendientes` |
| Personal | `/asistencia` |

## Panel de control en tres niveles

```
Nivel 1 · Resumen (/panel)          seis recuadros en palabras, con su lectura
   │  tocar un recuadro
   ▼
Nivel 2 · Vistazo (panel lateral)   frase · tres cifras enlazadas · gráfica ·
   │                                hasta 5 elementos · 1–2 acciones ·
   │  «Ver todo en …»               botón fijo «Ver todo en …»
   ▼
Nivel 3 · Sección (/panel/…)        filtros · cifras · gráfica completa ·
                                    tabla ordenable con buscador · acciones
```

- **Recuadros:** Hoy · Pendientes · Asistencia del período · Puntualidad · Ausencias y permisos · Por categoría.
- **Lectura** en palabras y color: **Bien** (≥ 90 %), **Atención** (80–89 %), **Bajo** (< 80 %).
- **Vistazo:** su contenido viaja en la propia página (`<template>`), por eso abre al instante; al abrirse, la sección completa empieza a **precargarse**.
- **Secciones:** misma plantilla (`PanelSeccionLayout`): ruta «Panel de control › …», frase de lectura, filtros, pastillas de filtros activos, datos a la izquierda y resumen/acciones a la derecha.

### Filtros

| Parámetro | Dónde | Viaja entre secciones |
|---|---|---|
| `periodo` = `semana` · `mes` · `30d` · `anterior` | Todas las secciones con datos del período | Sí |
| `categoria` = id | Todas | Sí |
| `ver` = `pendientes` · `llegaron` · `tarde` · `salida` · `faltas` · `permisos` · `secretaria` · `libres` | Hoy | No |
| `fecha` = AAAA-MM-DD | Hoy | No |
| `dia` = 1–7 (lunes a domingo) | Asistencia | No |
| `tramo` = `antes` · `0-5` · `6-15` · `16-30` · `31-60` · `60+` | Puntualidad | No |
| `semana` = lunes AAAA-MM-DD | Ausencias | No |
| `tipo` = `telefono` · `falta` · `salida` · `revision` · `jornada` · `cuenta` | Pendientes | No |
| `volver` = nombre del vistazo | Cualquier sección | No (muestra «Volver al vistazo») |
| `abrir` = nombre del vistazo | Resumen | No (abre ese vistazo al llegar) |

### Cada dato lleva a su detalle (D-56)

| Se toca | Lleva a |
|---|---|
| Barra o fila de una categoría | `/panel/categorias?categoria=…` (vista de la categoría) |
| Segmento o leyenda de la barra de hoy | `/panel/hoy?ver=…` |
| Fila de «llegadas por categoría» | `/panel/hoy?categoria=…` |
| Punto de la tendencia · día del calendario | `/panel/hoy?fecha=…` |
| Barra de un día de la semana | `/panel/asistencia?dia=…` |
| Tramo de la hora de llegada | `/panel/puntualidad?tramo=…` |
| Barra de una semana de faltas | `/panel/ausencias?semana=…` |
| Cifra de un vistazo | La sección con ese filtro |
| Nombre de una persona | Su panel lateral |

## Detalle por pantalla

### `/login`
- Cédula o correo + contraseña, mensaje de error claro.
- Redirige según el rol (tabla de arriba). Si la cuenta tiene la contraseña inicial, pasa por `/cambiar-clave`.

### `/asistencia` — Marcación ⭐ (celular)
- Saludo, fecha, reloj y jornada del día. Botón grande **Marcar entrada / Marcar salida**.
- Al tocar: ubicación → cámara → lee el QR → confirmación grande (Presente / Tarde) o error claro.
- Estados especiales: sin conexión, teléfono pendiente, ubicación desactivada, marca en secretaría.
- En la PC: el reloj a la izquierda y los últimos días a la derecha.

### `/historial` (celular)
- Calendario del mes con colores, cifras del mes y la lista de días; permisos del mes.

### `/panel` — Resumen
Seis recuadros con frase, cifra que cuenta desde 0, mini gráfica y lectura. Cada uno abre su vistazo. Barra de período y categoría arriba.

### `/panel/hoy` — Hoy (antes Registro del día, rediseñado en D-57)
- Frase del día con barra de avance; **semana tocable** (siete días con su lectura), flechas de semana, otra fecha y «Volver a hoy».
- **Estados como botones con su cantidad** (`?ver=`), búsqueda al instante por nombre o cédula, categoría que se aplica sola.
- Todo el personal programado ese día, con estado, horas y método.
- **Marcar entrada / salida** con «Ahora» u «Otra hora» + motivo (queda señalada). Días anteriores con las flechas.
- Cargar permiso desde la fila. En días pasados, quien no marcó figura como «Sin registro».

### `/panel/asistencia`
Cifras (con el colegio como referencia si hay categoría), tendencia, calendario, tabla día por día con filtro por día de la semana; descargas.

### `/panel/puntualidad`
Cifras (a tiempo, tolerancia, tarde, retraso promedio), hora de llegada por tramos (tocables), lista de llegadas de un tramo, asistencia por día de la semana, tabla de quién llega tarde.

### `/panel/ausencias`
Cifras (faltas, personas con 3 o más, permisos hoy y próximos), faltas por semana, tabla de faltas con «Cargar permiso», quiénes faltan más, permisos de la semana.

### `/panel/categorias`
- Sin categoría: la mejor, la más baja, barras y tabla de comparación.
- Con `?categoria=`: vista de la categoría comparada con el colegio, tendencia con la línea del colegio, sus personas y accesos a las demás.

### `/panel/pendientes`
Buscador de personas, lista de pendientes con su botón y filtro por tipo, estado de hoy y accesos frecuentes.

### `/asistencia/revision` · `/permisos`
- Revisión: marcaciones señaladas con motivo, distancia y mapa → **Revisada**.
- Permisos: listado con filtros; nuevo/editar con resumen en vivo (días que abarca, faltas que cubre).

### `/personal` y `/personal/[id]`
- Lista con búsqueda, filtros y paginación.
- Ficha por pestañas: **Resumen** (semana a semana, últimos registros, permisos), **Datos**, **Horario**, **Teléfono y cuenta**, **Estado**. Arriba: asistencia de 30 días con su lectura; a la derecha, «De un vistazo».

### `/reportes` · `/reportes/resumen`
Planilla diaria oficial y resumen del período por persona, en PDF o Excel.

### `/configuracion` y subpáginas (directiva)
Accesos, institución con **vista previa** del encabezado de la planilla, datos de demostración, marcación (ubicación y cierre diario), QR, usuarios y puesta en marcha.

## Navegación

```
🖥️ PC: barra superior (logo · nombre y rol · Acciones · Mi asistencia · 🔔 · Salir)
      + menú lateral
   Directiva:  Panel de control (Hoy · Asistencia · Puntualidad · Ausencias y permisos ·
               Por categoría · Pendientes) · Permisos · Personal · Reportes · Ajustes
   Secretaría: Panel de control (…las mismas seis) · Permisos · Personal · Reportes ·
               Mi asistencia

📱 Celular: barra inferior
   Directiva y secretaría: Panel · Permisos · Personal · Reportes · (Ajustes / Mi asistencia);
                           dentro del panel, pestañas deslizables con las secciones
   Personal:               Mi asistencia · Historial
```

La app navega **sin recargar** (D-46): al cambiar de pantalla solo se reemplaza el contenido, y las pantallas se precargan al pasar el mouse o al abrir un vistazo.
