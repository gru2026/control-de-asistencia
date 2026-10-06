---
titulo: Alcance y beneficiarios
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: proyecto
estado: activo
fecha: 2026-10-06
---

# Alcance y Beneficiarios

## Dentro del alcance (v1)

- ✅ Autenticación con login y **roles**: directiva (admin), secretaria, personal (docentes y administrativos).
- ✅ **Gestión de personal** y **jornadas configurables** (horas, tolerancia, pausa, días laborables).
- ✅ **Marcación desde el celular propio** escaneando un **QR impreso** + **GPS** (geocerca) + hora del servidor, en entrada y salida.
- ✅ **Un celular por cuenta**, con aprobación de cambios de teléfono desde el PC.
- ✅ **PC del colegio** como centro de administración y respaldo: marcación asistida por secretaría y kiosco con cédula + PIN.
- ✅ **Cálculo automático**: horas trabajadas, tardanzas, faltas y permisos.
- ✅ **Reportes** con filtros exportables a **PDF y Excel**.
- ✅ **Dashboard** con KPIs y **notificaciones** in-app.
- ✅ **PWA instalable** que abre sin conexión (marcar requiere internet).
- ✅ Despliegue en internet (hosting gratuito).

## Fuera del alcance (v1)

- ❌ **Asistencia de estudiantes** (excluida — confirmado por el colegio el 2026-10-06).
- ❌ **Marcación sin internet** (cola offline) → v2.
- ❌ Notificaciones push.
- ❌ Control de acceso físico (puertas, biométrico, tarjetas).
- ❌ Nómina, pagos o cálculo de sueldos.
- ❌ Gestión de estudiantes, notas o académico.
- ❌ App nativa para tiendas (solo PWA instalable).
- ❌ Integración con correo electrónico externo (pendiente de decisión: ver pregunta 6).
- ❌ Múltiples sedes / multi-institución.

## Beneficiarios

| Beneficiario | Beneficio |
|---|---|
| **Directiva / Rectoría** | Reportes inmediatos, transparencia, datos en tiempo real para decisiones |
| **Personalista / Secretaría** | Menos trabajo manual, registro ágil, control centralizado del día |
| **Docentes y administrativos** | Marcaje rápido desde el celular, historial propio visible y claro |
| **Institución** | Reducción de errores, documentos digitales que no se pierden, base para futuras evaluaciones |

## Supuestos y restricciones

- El colegio provee los datos iniciales (personal, jornadas, correo del administrador).
- Se usan servicios con **plan gratuito** (Supabase, Vercel): límites de uso suficientes para una plantilla de escuela.
- Desarrollo a cargo de **una persona** con las funciones de diseño, desarrollo y pruebas.
- Plazo fijo: **4 semanas** (ver [[01-Proyecto/Cronograma-4-semanas]]).
- El colegio dispone de **un PC con internet**; cada miembro del personal tiene **teléfono con datos**.
- El QR se imprime y se pega en la entrada; la administración lo renueva cuando lo considere.