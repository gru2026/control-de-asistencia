---
titulo: Manual de usuario
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: entregable
estado: activo
fecha: 2026-10-19
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

En el PC se entra con el **correo** de la cuenta (o con la cédula, si la cuenta se creó así). Menú: **Panel · Asistencia · Personal · Reportes**, y **Ajustes** para la directiva.

> [!tip] Todo sin salir de la pantalla
> - **Toque el nombre de una persona** (en Personal, Registro del día, Reportes o el Panel) y se abre a la derecha su resumen: hoy, el mes, permisos, teléfono y cuenta, con botones para marcar, cargar un permiso, aprobar o cambiar el teléfono, crear la cuenta o restablecer la contraseña. «Abrir ficha completa» lleva a todos los datos.
> - Después de cada acción aparece un mensaje abajo. Si se equivocó, toque **Deshacer**.
> - La **campana** abre los avisos encima de la pantalla; tóquelos para ir a lo que indican.
> - El **Panel** tiene dos vistas, arriba a la derecha: **Resumen** (cómo vamos, en palabras; toque un recuadro para ver el detalle) y **Acción rápida** (buscar a alguien, lo pendiente con su botón y los accesos directos). El panel recuerda la última que usó.
> - El botón **Acciones** (arriba) reúne lo más frecuente: buscar a una persona, registrar personal nuevo, cargar un permiso, crear cuentas y descargar la planilla de hoy o el resumen del mes.
> - En la PC, los formularios muestran a la derecha una columna de ayuda: por ejemplo, en Ajustes se ve cómo saldrá el encabezado de la planilla mientras se escribe, y en un permiso cuántos días abarca.
> - En **Ajustes › Usuarios**, «Gestionar» abre una ventana para cambiar el tipo de cuenta, la contraseña o desactivarla.

## 7. Registro del día (Asistencia)

Lista de todo el personal que trabaja ese día, con su estado: **por llegar, presente, tarde, falta, permiso o sin salida**, y cómo marcó (teléfono, secretaría o a mano).

- **Marcar entrada / Marcar salida:** se abre una ventana con **Ahora** ya elegido; toque **Registrar**.
- **Otra hora (contingencia):** si se cayó el internet o alguien olvidó marcar, toque **Otra hora**, escriba la hora y elija el motivo con los botones. Queda señalada para revisión.
- **Días anteriores:** con las flechas o la fecha. Para un día pasado siempre se escribe la hora y el motivo.
- **Permiso:** desde la fila, carga un permiso para esa persona.
- Una **falta** puesta por el cierre diario se corrige marcando la entrada.
- Filtros: **Mostrar** (por llegar, llegaron, sin salida, faltas, permisos, marcan en secretaría), categoría y búsqueda.

## 8. Por revisar

Marcaciones con advertencia: GPS impreciso, hora escrita a mano o ubicación de prueba. Muestra el motivo, la distancia y un enlace al mapa. Verifique y toque **Revisada** (o «Marcar las … como revisadas»).

## 9. Permisos

**Asistencia › Permisos** → **Nuevo permiso** (o «Cargar permiso» desde el panel de la persona): escriba el nombre o la cédula y elija a la persona; toque **Hoy**, **Mañana** u **Otras fechas**; elija el motivo con los botones y **Guardar permiso**. Las faltas de esas fechas pasan a permiso; si lo elimina, vuelven a falta. No se permiten dos permisos que se crucen. También están en la ficha de cada persona.

## 10. Teléfonos y cuentas (ficha de la persona)

- **Cambiar de teléfono:** quita el teléfono actual; el próximo con el que la persona marque queda aprobado solo.
- **Aprobar / Revocar:** para un teléfono pendiente o uno que ya no se debe usar.
- **No tiene teléfono: marca en secretaría:** la persona aparece primero en el registro del día y no marca desde la app.
- **Restablecer a 0000:** si olvidó su contraseña. Al entrar crea una nueva.

**Crear cuentas (directiva):** **Personal › Cuentas** → elija las personas → **Crear cuentas con contraseña 0000** → **Imprimir** la hoja de claves y entregue cada tira. En «Sin activar» ve quién no ha creado su contraseña y puede reimprimir su tira.

> [!warning] Cuándo crear las cuentas
> Mientras alguien no entra por primera vez, cualquiera que conozca su cédula podría hacerlo con 0000. Créelas cerca de la capacitación.

## 11. Reportes

- **Planilla diaria:** el formato oficial del día (docentes o personal), en **PDF** o **Excel**, con la firma de la dirección.
- **Resumen del período:** elija las fechas (o «Este mes», «Mes anterior», «Últimos 30 días») y la categoría. Por persona: días laborables, presente, tarde, faltas, permisos, días sin registro, % de asistencia, horas y marcaciones en secretaría. Ordene por columna y descargue en **PDF** o **Excel**.

## 12. Panel y avisos

El **Panel** muestra el día de hoy, los indicadores del período, lo que **requiere atención** (por revisar, teléfonos por aprobar, personas con muchas faltas) y el análisis en secciones plegables.

La **campana** muestra los avisos: faltas y salidas sin marcar del cierre diario, teléfonos nuevos y el QR por vencer. Al abrir un aviso, lleva a la pantalla correspondiente.

## 13. Ajustes (directiva)

- **Puesta en marcha:** lista de lo que falta para empezar el uso real.
- **Marcación:** ubicación del colegio y radio, ubicaciones de prueba, franjas horarias y **cierre diario** (fecha de inicio del control).
- **Código QR:** generar, imprimir y desactivar. El anterior deja de funcionar al instante. Recomendado: renovarlo cada lapso o si circula una foto.
- **Jornadas y feriados**, **Categorías**, **Usuarios** (cuentas de directiva y secretaría), **Importar personal**, **Institución** (datos de la planilla) y **Datos de demostración**.

## 14. Cierre diario

Todos los días a las 18:00 el sistema cierra las jornadas terminadas: quien no marcó queda con **falta** (o **permiso** si tiene uno), y quien no marcó la salida queda **sin salida** para que secretaría la complete. Solo funciona desde la **fecha de inicio del control** (Ajustes › Marcación).

---

*Manual v2.1 · 20/10/2026 · ventanas y panel lateral (D-49) · sin kiosco ni PIN (D-37); cuentas por cédula (D-42).*
