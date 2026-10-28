---
titulo: Manual de usuario
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: entregable
estado: activo
fecha: 2026-10-28
---

# Manual de usuario — GRU-system

> [!info] Para quién es
> **Parte 1** es para todo el personal (marcar con el teléfono). **Parte 2** es para secretaría y directiva (el PC del colegio). Hay una versión de una página de cada parte: [[05-Entregables/Guia-rapida-personal|Guía rápida del personal]] y [[05-Entregables/Guia-rapida-secretaria|Guía rápida de secretaría]].
>
> Las capturas de la parte 2 no se incluyen en el repositorio porque muestran datos reales del personal. Para el manual impreso se generan en el PC con `npm run capturas`.

Dirección de la app: **https://control-de-asistencia-vert.vercel.app**

---

# Parte 1 · Personal

## 1. ¿Qué es GRU-system?

Es la app de asistencia del colegio. Con ella:

- marca su **entrada y salida** escaneando el **código QR** pegado en la entrada;
- ve su **historial**: días presentes, tardanzas, faltas, permisos y horas.

Para marcar necesita **internet**, **estar en el colegio** (la app verifica la ubicación) y **su teléfono**, siempre el mismo.

## 2. Instalar la app

1. Abra la dirección de la app en el navegador del teléfono: **Chrome** en Android, **Safari** en iPhone.
2. **Android:** menú ⋮ → **Instalar aplicación**.
3. **iPhone:** botón Compartir → **Agregar a pantalla de inicio**.
4. Aparece el ícono **GRU-system**. Ábrala siempre desde ese ícono.

> [!warning] iPhone
> Instale la app **antes** de iniciar sesión. Si entra primero desde Safari y luego desde la app instalada, el iPhone las cuenta como dos teléfonos distintos y el segundo queda pendiente de aprobación.

## 3. Primer ingreso

![[05-Entregables/capturas/01-iniciar-sesion.png|260]] ![[05-Entregables/capturas/02-crear-contrasena.png|260]]

1. En **Cédula** escriba solo los números (por ejemplo, `12345678`).
2. En **Contraseña** escriba **0000** (la contraseña inicial de todas las cuentas nuevas).
3. La app le pide **crear su propia contraseña**: al menos 6 caracteres; puede ser solo de números, pero no su cédula ni algo como 111111. Escríbala dos veces y toque **Guardar contraseña**.
4. Desde ahora entra con su cédula y su contraseña nueva.

¿La olvidó? Pida en secretaría que la **restablezcan**: vuelve a ser 0000 y al entrar crea una nueva. Después de 5 intentos fallidos, la app espera 15 minutos.

## 4. Marcar entrada y salida

![[05-Entregables/capturas/03-mi-asistencia.png|260]]

1. Al llegar, abra la app. Verá la hora oficial y su jornada.
2. Toque **Marcar entrada**. La primera vez, **permita la ubicación y la cámara**.
3. Apunte la cámara al **código QR** de la entrada, dentro del recuadro.
4. La app confirma en grande: **Entrada registrada a tiempo** (verde) o **con retraso** (ámbar), con la hora.
5. Al salir, toque **Marcar salida** y escanee el mismo QR. Verá las horas trabajadas.

El primer teléfono con el que marque queda registrado como **su teléfono**. Marque siempre desde él.

### Mensajes que puede ver

| Mensaje | Qué hacer |
|---|---|
| Sin conexión | Active datos o Wi-Fi. Si no puede, vaya a secretaría. |
| Debe estar en el colegio para marcar. Está a … | Acérquese a la entrada e intente de nuevo. |
| Active la ubicación para marcar | Encienda la ubicación y dé permiso a la app en los ajustes del teléfono. |
| Código QR no válido | Escanee el QR **vigente** pegado en la entrada (no una foto vieja). |
| Este teléfono está pendiente de aprobación | Está usando otro teléfono: avise en secretaría. |
| Ya registró su entrada hoy a las … | No hace falta marcar de nuevo. |
| Su asistencia la registra secretaría | Usted marca en secretaría (no tiene teléfono registrado). |

## 5. Ver mi historial

![[05-Entregables/capturas/04-historial.png|260]]

En **Historial** (o **Ver historial** desde Mi asistencia) ve el mes en un calendario de colores: **verde** presente, **ámbar** tarde, **rojo** falta, **azul** permiso. Debajo están los totales, sus permisos y cada día con sus horas. Con las flechas cambia de mes.

La campana de arriba muestra sus **avisos**.

## 6. Situaciones comunes

| Situación | Qué hacer |
|---|---|
| No tengo el teléfono o no tiene batería | Pase por secretaría: registran su entrada o salida desde el PC. |
| Cambié de teléfono | Avise en secretaría: tocan «Cambiar de teléfono» en su ficha y el teléfono nuevo queda aprobado al marcar. |
| Olvidé marcar la salida | Avise en secretaría: la registran con la hora y el motivo. |
| No tengo teléfono inteligente | Secretaría lo marca como «marca en secretaría» y registra su asistencia en el PC. |
| ¿La app me rastrea? | No. La ubicación solo se toma en el momento de marcar. |
| ¿Puedo marcar con una foto del QR? | No sirve: además del QR, debe estar en el colegio. |

---

# Parte 2 · Secretaría y directiva (PC del colegio)

En el PC se entra con el **correo** de la cuenta (o con la cédula, si la cuenta se creó así). Al entrar, la **directiva** llega al resumen del *Panel de control* y la **secretaría** a *Pendientes*.

**Menú de la izquierda:**

| Opción | Para qué |
|---|---|
| **Panel de control** | Cómo va la asistencia del colegio. Debajo están sus seis secciones: **Hoy · Asistencia · Puntualidad · Ausencias y permisos · Por categoría · Pendientes** |
| **Permisos** | Cargar y consultar permisos; pestaña **Por revisar** |
| **Personal** | Lista del personal, fichas, cuentas |
| **Reportes** | Planilla diaria y resumen del período (PDF y Excel) |
| **Ajustes** (directiva) | QR, marcación, jornadas, categorías, usuarios, institución |

En el celular, el menú está abajo y las secciones del panel aparecen como pestañas arriba.

> [!tip] Todo sin salir de la pantalla
> - **Toque el nombre de una persona** en cualquier lista y se abre a la derecha su resumen, con botones para marcar, cargar un permiso, aprobar o cambiar el teléfono, crear la cuenta o restablecer la contraseña. «Abrir ficha completa» lleva a todos los datos.
> - Después de cada acción aparece un mensaje abajo. Si se equivocó, toque **Deshacer**.
> - El botón **Acciones** (arriba) reúne lo más frecuente: buscar a una persona, registrar personal nuevo, cargar un permiso, crear cuentas y descargar la planilla de hoy o el resumen del mes.
> - La **campana** abre los avisos encima de la pantalla.

## 7. Cómo leer el Panel de control

El panel se lee en **tres pasos**, de lo general a lo detallado:

| Paso | Qué ve | Cómo se llega |
|---|---|---|
| **1. Resumen** | Seis recuadros que dicen en palabras cómo vamos: «32 de 45 ya llegaron», «96 % de asistencia» | Panel de control |
| **2. Vistazo** | A la derecha: tres cifras, una gráfica, lo más importante (hasta 5) y una o dos acciones | Tocando un recuadro |
| **3. Sección** | La página completa: filtros, gráfica grande, tabla que se ordena y busca, descargas | Botón **«Ver todo en …»** del vistazo, o el menú |

**Las etiquetas de color** dicen cómo va cada cosa, siempre con una palabra:

| Etiqueta | Significa |
|---|---|
| 🟢 **Bien** | 90 % o más |
| 🟠 **Atención** | De 80 % a 89 % |
| 🔴 **Bajo** | Menos de 80 % |

Los mismos colores se usan en las barras, los puntos de las gráficas y los días del calendario.

**Filtros.** Arriba de cada sección se elige el **período** (Esta semana, Este mes, Últimos 30 días, Mes anterior) y la **categoría**. Se mantienen al pasar de una sección a otra. Lo que se está filtrando aparece como una pastilla — «Viendo solo: Cocina ✕» —; toque la **✕** para quitarlo.

**Casi todo se puede tocar.** Cada barra, punto o día lleva a su detalle con el filtro ya puesto:

| Toque | Y verá |
|---|---|
| La barra de una categoría | Esa categoría comparada con el colegio y su gente |
| Un día del calendario o un punto de la gráfica | *Hoy* de esa fecha: quién vino y quién no |
| Un segmento de la barra de hoy (tarde, sin marcar…) | *Hoy* con solo esas personas |
| Un día de la semana (Martes) | *Asistencia* con solo los martes |
| Un tramo de llegada («De 16 a 30 min») | La lista de esas llegadas: quién, qué día, cuántos minutos |
| Una semana de faltas | Las faltas de esa semana |

Si llegó desde un vistazo, **«Volver al vistazo»** lo devuelve donde estaba. Las **descargas** salen con los mismos filtros que está viendo. Si un filtro deja la pantalla vacía, el panel le dice por qué y le ofrece ver los últimos 30 días o quitar el filtro.

## 8. Hoy (antes «Registro del día»)

**Panel de control › Hoy.** Arriba dice en palabras cómo va el día («32 de 54 ya llegaron») con una barra de avance.

- **La semana:** toque cualquier día para verlo. Cada día muestra su porcentaje con el color de su lectura. Las flechas pasan a la semana anterior o siguiente; el calendario pequeño elige otra fecha y **«Volver a hoy»** regresa.
- **Los botones de estado** (Todos, Por llegar, Llegaron, Tarde, Sin salida, Faltas, Permiso…) muestran cuántas personas hay en cada uno; tóquelos para ver solo esas.
- **Buscar:** escriba el nombre o la cédula y la lista se filtra al instante.

Debajo está la lista de todo el personal que trabaja ese día, con su estado: **por llegar** (o **sin registro** en un día pasado), **presente, tarde, falta, permiso o sin salida**, y cómo marcó (teléfono, secretaría o a mano).

- **Marcar entrada / Marcar salida:** se abre una ventana con **Ahora** ya elegido; toque **Registrar**.
- **Otra hora (contingencia):** si se cayó el internet o alguien olvidó marcar, toque **Otra hora**, escriba la hora y elija el motivo con los botones. Queda señalada para revisión.
- **Días anteriores:** con las flechas o la fecha. Para un día pasado siempre se escribe la hora y el motivo.
- **Permiso:** desde la fila, carga un permiso para esa persona.
- Una **falta** puesta por el cierre diario se corrige marcando la entrada.
- La **categoría** se elige en la lista y se aplica sola.

## 9. Pendientes

**Panel de control › Pendientes.** Lo que espera una acción, cada cosa con su botón: **Aprobar** un teléfono nuevo, **Cargar permiso** por una falta, **Ver** una salida sin marcar, **Revisar** marcaciones señaladas, personas **sin jornada** o **sin cuenta**. Los botones de arriba filtran por tipo.

También tiene un **buscador grande** (nombre o cédula: abre el panel de esa persona), el estado de hoy y los accesos de todos los días: marcar, cargar permiso, planilla de hoy, resumen del mes y nuevo personal.

## 10. Las demás secciones del panel

- **Asistencia:** asistencia, faltas, permisos y horas del período; tendencia con la línea del promedio (o del colegio, si eligió una categoría); calendario; tabla día por día con botones **Lun · Mar · Mié…** para ver un solo día de la semana.
- **Puntualidad:** cuántos llegan a la hora, en tolerancia o tarde; gráfica de **hora de llegada** (toque un tramo para ver esas llegadas); asistencia por día de la semana; tabla de quiénes llegan tarde, con veces y retraso promedio.
- **Ausencias y permisos:** faltas sin justificar del período (cada una con **Cargar permiso**), faltas por semana, quiénes faltan más y los permisos de esta semana.
- **Por categoría:** la mejor, la más baja y cuántas están por debajo de 90 %; barras y tabla de comparación. Al tocar una categoría se abre **su vista**: comparada con el colegio («8 puntos por debajo del colegio»), su tendencia, **sus personas** de menor a mayor asistencia y accesos a las demás categorías.

## 11. Por revisar

**Permisos › Por revisar.** Marcaciones con advertencia: GPS impreciso, hora escrita a mano o ubicación de prueba. Muestra el motivo, la distancia y un enlace al mapa. Verifique y toque **Revisada** (o «Marcar las … como revisadas»).

## 12. Permisos

**Permisos** → **Nuevo permiso** (o «Cargar permiso» desde el panel de la persona, *Pendientes* o *Ausencias*): escriba el nombre o la cédula y elija a la persona; toque **Hoy**, **Mañana** u **Otras fechas**; elija el motivo con los botones y **Guardar permiso**. Las faltas de esas fechas pasan a permiso; si lo elimina, vuelven a falta. No se permiten dos permisos que se crucen.

## 13. Personal: fichas, teléfonos y cuentas

- **Nuevo personal** (directiva): desde *Acciones* o *Pendientes* se abre una ventana con lo esencial (nombre, apellido, cédula, categoría y vínculo) y la casilla **«Crear su cuenta ahora»** (cédula + 0000). La jornada se asigna sola según la categoría.
- **La ficha** muestra arriba su asistencia de los últimos 30 días con su etiqueta (Bien, Atención o Bajo) y, en *Resumen*, **cómo le ha ido semana a semana** en las últimas 8 semanas.
- **Cambiar de teléfono:** quita el teléfono actual; el próximo con el que la persona marque queda aprobado solo.
- **Aprobar / Revocar:** para un teléfono pendiente o uno que ya no se debe usar.
- **No tiene teléfono: marca en secretaría:** la persona aparece primero en *Hoy* y no marca desde la app.
- **Restablecer a 0000:** si olvidó su contraseña. Al entrar crea una nueva.

**Crear cuentas (directiva):** **Personal › Cuentas** → elija las personas → **Crear cuentas con contraseña 0000** → **Imprimir** la hoja de claves y entregue cada tira. En «Sin activar» ve quién no ha creado su contraseña y puede reimprimir su tira.

**Gestionar una cuenta (directiva):** **Ajustes › Usuarios › Gestionar** (o «Gestionar cuenta» en el panel de la persona) abre una ventana para cambiar el tipo de cuenta, la contraseña o desactivarla.

> [!warning] Cuándo crear las cuentas
> Mientras alguien no entra por primera vez, cualquiera que conozca su cédula podría hacerlo con 0000. Créelas cerca de la capacitación.

## 14. Reportes

- **Planilla diaria:** el formato oficial del día (docentes o personal), en **PDF** o **Excel**, con la firma de la dirección.
- **Resumen del período:** elija las fechas y la categoría. Por persona: días laborables, presente, tarde, faltas, permisos, días sin registro, % de asistencia, horas y marcaciones en secretaría. Ordene por columna y descargue en **PDF** o **Excel**.
- Desde cualquier sección del panel, **«Descargar en Excel»** baja el resumen con el período y la categoría que se están viendo.

## 15. Avisos

La **campana** muestra los avisos: faltas y salidas sin marcar del cierre diario, teléfonos nuevos y el QR por vencer. Al abrir un aviso, lleva a la pantalla correspondiente. En **Avisos** se pueden ver por tipo.

## 16. Ajustes (directiva)

- **Puesta en marcha:** lista de lo que falta para empezar el uso real, con su barra de avance.
- **Marcación:** ubicación del colegio y radio, ubicaciones de prueba, franjas horarias y **cierre diario** (fecha de inicio del control).
- **Código QR:** generar, imprimir y desactivar. El anterior deja de funcionar al instante. Recomendado: renovarlo cada lapso o si circula una foto.
- **Institución:** datos de la planilla; a la derecha se ve **cómo saldrá el encabezado** mientras se escribe.
- **Jornadas y feriados**, **Categorías**, **Usuarios**, **Importar personal** y **Datos de demostración**.

## 17. Cierre diario

Todos los días a las 18:00 el sistema cierra las jornadas terminadas: quien no marcó queda con **falta** (o **permiso** si tiene uno), y quien no marcó la salida queda **sin salida** para que secretaría la complete. Solo funciona desde la **fecha de inicio del control** (Ajustes › Marcación).

---

*Manual v3.0 · 28/10/2026 · Panel de control en tres niveles con secciones (D-55) · cada dato lleva a su detalle (D-56) · animaciones y lectura Bien/Atención/Bajo (D-53, D-54) · formularios en ventanas (D-49, D-51) · sin kiosco ni PIN (D-37); cuentas por cédula (D-42).*
