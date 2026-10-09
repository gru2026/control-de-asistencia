---
titulo: Mapa de pantallas
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: diseno
estado: activo
fecha: 2026-10-06
---

# Mapa de Pantallas

Dos contextos de uso:
- 📱 **Celular** del personal → marcar y ver su historial (mobile-first).
- 🖥️ **PC del colegio** → administración y respaldo de marcación (escritorio).

## Árbol de rutas

```
/login                          Autenticación (pública)

📱 Celular
/asistencia                     Marcar entrada/salida (escáner QR + GPS)
/historial                      Su asistencia personal

🖥️ PC (directiva / secretaria)
/panel                          Dashboard con KPIs
/asistencia/registro            Tabla del día + marcación asistida + permisos
/asistencia/revision            Marcaciones señaladas ⚠️
/personal                       Lista de personal (búsqueda + paginación)
/personal/nuevo                 [directiva] Alta
/personal/[id]                  Ficha: datos, jornada, dispositivos, PIN, resumen
/jornadas                       [directiva] Plantillas de jornada + feriados
/reportes                       Reportes + exportación PDF/Excel
/notificaciones                 Centro de alertas
/permisos                       Permisos (listado + filtros) · /permisos/[id] crear/editar
/configuracion                  [directiva] Institución, accesos, demostración
/configuracion/marcacion        [directiva] Geocerca, ubicaciones de prueba, franjas, cierre diario
/configuracion/qr               [directiva] Generar / regenerar / imprimir QR
/configuracion/usuarios         [directiva] Cuentas y roles

🖥️ Kiosco (solo en el PC autorizado)
/kiosco                         Autoservicio: cédula + PIN → entrada/salida
```

> [!info] Protección
> Todo excepto `/login` pasa por `middleware.ts`: sin sesión → `/login`; sin permiso → 403 amigable. `/kiosco` exige además que el navegador sea un dispositivo tipo `kiosco` aprobado.

## Detalle por pantalla

### `/login`
- Correo + contraseña, mensaje de error claro.
- Redirige según rol: directiva/secretaria → `/panel`; personal → `/asistencia`.
- Al entrar, registra el dispositivo (ver [[03-Diseno/Registro-de-decisiones|D-07]]).

### `/asistencia` — Marcación ⭐ (celular)
- Saludo + fecha + hora en vivo + jornada del día ("Entrada 07:00 · tolerancia 15 min").
- **Botón grande** según estado:
  - Sin entrada → verde **"Marcar entrada"**
  - Con entrada → muestra la hora + naranja **"Marcar salida"**
  - Ambas → resumen ("Entrada 07:04 · Salida 16:01 ✓")
- Al tocar: pide **ubicación** → abre **cámara** con visor → al leer el QR envía al servidor → confirmación grande (✅ Presente / 🟨 Tarde) o error claro.
- Estados especiales:
  - 📵 Sin conexión: *"Conéctese para marcar o diríjase a secretaría."*
  - ⏳ Teléfono pendiente de aprobación.
  - 📍 Ubicación desactivada (con pasos para activarla).
- Últimos 5 días con su estado.

### `/historial` (celular)
- Lista/calendario del mes con estados y totales. Solo lo propio.

### `/panel` — Dashboard (PC)
- KPIs: presentes hoy · tardanzas del mes · faltas del mes · **señaladas por revisar** · **teléfonos pendientes**.
- Últimas alertas. Accesos rápidos.

### `/asistencia/registro` — Tabla del día (PC)
- Todo el personal activo con estado: pendiente / presente / tarde / permiso, hora y método (📱 QR / 🖥️ PC).
- Botón **Marcar** por fila (asistido; queda `registrado_por`).
- **Cargar permiso** (rango de fechas, motivo, observación).
- Completar salida no registrada / contingencia "falla de conexión".
- Filtros por cargo y estado; búsqueda.

### `/asistencia/revision` (PC)
- Marcaciones con ⚠️ (motivo: precisión GPS, etc.), con mapa/distancia.
- Acción: **Marcar como revisada** (+ observación).

### `/personal` y `/personal/[id]` (PC)
- Lista: nombre, cédula, cargo, jornada, estado. Búsqueda + filtros + paginación.
- Ficha:
  - Datos personales y cuenta asociada.
  - Jornada asignada + excepciones por día.
  - **Dispositivos**: aprobado actual, pendientes → *Aprobar* / *Revocar*.
  - **PIN de kiosco**: asignar / restablecer / desbloquear.
  - Resumen del último mes.

### `/jornadas` (PC, directiva)
- CRUD de plantillas (entrada, salida, tolerancia, pausa, días).
- Feriados.

### `/configuracion` (PC, directiva)
- Institución (nombre, logo para reportes).
- **Geocerca:** coordenadas del colegio (pegar enlace/coordenadas o elegir en mapa), radio, precisión máxima, activa/inactiva.
- Franjas horarias opcionales.
- Kiosco: activar PIN; **"Autorizar este PC como kiosco"**.

### `/configuracion/qr` (PC, directiva)
- QR activo: descripción, fecha de creación, vencimiento.
- **Generar nuevo** (pide confirmación: *"El QR actual dejará de funcionar"*), con vencimiento opcional.
- **Imprimir**: hoja A4 con logo, QR grande, nombre del colegio e instrucciones ("Abra la app Asistencia UEN → Marcar → escanee este código").
- El código solo se muestra en el momento de generarlo/imprimir.

### `/kiosco` (PC autorizado)
- Pantalla simple, sin menú: cédula + PIN (teclado numérico en pantalla).
- Muestra nombre y estado → botón **Entrada** / **Salida** → confirmación → vuelve a inicio en 5 s.

### `/reportes`, `/notificaciones`, `/configuracion/usuarios`
- Reportes: filtros (rango, persona/todos), tabla (horas, tardanzas, faltas, permisos, % asistencia, marcaciones por PC), **PDF** y **Excel**.
- Notificaciones: lista con marcar leída; filtro no leídas.
- Usuarios: crear cuenta, asignar rol, desactivar.

## Navegación

```
🖥️ PC: header (logo · 👤) + nav lateral
   Directiva:  Panel · Personal · Permisos · Reportes · Ajustes (incluye Jornadas)
   Secretaría: Panel · Personal · Permisos · Reportes · Mi asistencia

📱 Celular: bottom bar
   Marcar · Historial · 🔔 · Perfil
```
