---
titulo: Manual de usuario
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: entregable
estado: borrador
fecha: 2026-10-06
---

# 📖 Manual de Usuario — Control de Asistencia U.E.E. Gral. Rafael Urdaneta

> [!info] Para quién es
> Guía para el personal del colegio. Sin tecnicismos: paso a paso con capturas (pendientes de agregar al final del desarrollo).

## 1. ¿Qué es esta aplicación?

Es una **aplicación de asistencia** que se instala en su celular. Con ella:

- Marca su **entrada y salida** escaneando el **código QR** de la entrada del colegio.
- Consulta sus horas, tardanzas y faltas.
- La directiva obtiene reportes automáticos, sin libros ni papeles.

Para marcar necesita: **internet**, **estar en el colegio** (la app verifica la ubicación) y **su propio teléfono** registrado.

## 2. Instalar la app en su celular

1. Abra el enlace de la app en el navegador del celular (Chrome en Android, Safari en iPhone).
2. **Android:** menú ⋮ → *"Instalar aplicación"*.
3. **iPhone:** botón compartir ⬆ → *"Agregar a pantalla de inicio"*.
4. Aparecerá el ícono **Asistencia UEN**. **Ábrala siempre desde ese ícono.**

> [!warning] iPhone
> No use la app desde Safari después de instalarla: el sistema lo verá como otro teléfono y tendrá que pedir aprobación a secretaría.

## 3. Iniciar sesión

1. Abra la app, escriba su **correo** y **contraseña** y toque **Iniciar sesión**.
2. La primera vez, su teléfono queda **registrado** como su teléfono de marcación.
3. ¿Olvidó la contraseña? Solicítela a la administración.

> Los usuarios los crea la administración. No se autoregistre.

## 4. Marcar su asistencia

1. Al llegar, abra la app y toque **"Marcar entrada"**.
2. La primera vez, **permita la ubicación y la cámara** (son necesarias para marcar).
3. Apunte la cámara al **código QR** pegado en la entrada.
4. Verá la confirmación: *"Entrada 07:04 ✓ Presente"* (o *Tarde*).
5. Al salir, repita: **"Marcar salida"** → escanee el mismo QR.

| Color | Significado |
|---|---|
| 🟩 Verde | Presente |
| 🟨 Amarillo | Tarde |
| 🟥 Rojo | Falta |
| ⬜ Gris | Permiso |

### Mensajes que puede ver

| Mensaje | Qué hacer |
|---|---|
| *Sin conexión* | Active datos o Wi-Fi. Si no puede, vaya a secretaría. |
| *Debe estar en el colegio para marcar* | Acérquese a la entrada e intente de nuevo. |
| *Active la ubicación* | Encienda la ubicación del teléfono y dé permiso a la app. |
| *Código QR no válido* | El QR fue cambiado: escanee el QR **vigente** de la entrada. |
| *Teléfono pendiente de aprobación* | Cambió de teléfono: pida a secretaría que lo apruebe. |
| *Ya registró su entrada hoy* | No hace falta marcar de nuevo. |

## 5. Si no tiene su teléfono

Diríjase al **PC del colegio**:
- **Opción 1:** pida a secretaría que registre su entrada/salida.
- **Opción 2 (kiosco):** en la pantalla de autoservicio escriba su **cédula** y su **PIN** → toque **Entrada** o **Salida**. El PIN se lo asigna secretaría.

## 6. Cambié de teléfono

1. Instale la app en el nuevo teléfono e inicie sesión.
2. Verá *"Teléfono pendiente de aprobación"*.
3. Avise a secretaría: lo aprueban desde el PC y el teléfono anterior queda desactivado.

---

## Para directiva y secretaría (PC del colegio)

### 7. Registro del día
1. **Asistencia → Registro del día**: todo el personal con su estado.
2. **Marcar** en la fila de quien no pudo hacerlo (queda constancia de quién lo registró).
3. **Cargar permiso**: elija fechas y motivo, agregue observación → **Guardar**.
4. Si falló el internet del colegio: registre con la observación *"falla de conexión"*.

### 8. Revisión de marcaciones señaladas ⚠️
Marcaciones con ubicación imprecisa aparecen en **Asistencia → Revisión**. Verifique y toque **Marcar como revisada**.

### 9. Dispositivos y PIN
En **Personal →** (persona) **→ Dispositivos**: aprobar o revocar teléfonos. En **PIN**: asignar, restablecer o desbloquear.

### 10. Código QR (directiva)
1. **Configuración → Código QR → Generar nuevo** (opcional: fecha de vencimiento).
2. **Imprimir** y pegar en la entrada. Puede reutilizarlo todos los días.
3. Si sospecha que el código circula por fotos, **genere uno nuevo**: el anterior deja de funcionar al instante. Recomendado: renovarlo cada mes.

### 11. Jornadas y configuración (directiva)
- **Jornadas:** horas de entrada/salida, tolerancia, pausa y días laborables. Los cambios **no alteran** los días ya registrados.
- **Configuración:** ubicación del colegio y radio permitido, kiosco, datos de la institución.
- **Usuarios:** crear cuentas y asignar roles.

### 12. Reportes
1. **Reportes** → elija rango de fechas y persona (o todos) → **Generar**.
2. Descargue **PDF** (imprimir/firmar) o **Excel** (analizar).

Incluye: horas trabajadas, tardanzas, faltas, permisos, % de asistencia y marcaciones hechas en el PC.

### 13. Panel
Presentes hoy, tardanzas y faltas del mes, marcaciones por revisar, teléfonos pendientes y alertas 🔔.

## 14. Preguntas frecuentes

| Pregunta | Respuesta |
|---|---|
| Llegué tarde, ¿qué hago? | Marque igual; quedará como **tarde**. |
| Olvidé marcar la salida | Avise a secretaría: la registran con observación. |
| No tengo internet | Conéctese o marque en el PC del colegio. |
| ¿La app me rastrea? | No. La ubicación solo se toma en el momento de marcar. |
| ¿Puedo marcar con una foto del QR? | No: hay que escanear con la cámara **y** estar en el colegio. |
| ¿Puedo ver las faltas de otros? | No, solo directiva y secretaría. |
| ¿Se puede borrar un registro? | No; las correcciones las hace la administración con observación. |

---

*Manual v1 — pendiente: capturas de pantalla reales y datos definitivos de jornada.*
