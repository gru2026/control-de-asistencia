# GRU-system — Control de Asistencia U.E.E. General Rafael Urdaneta

Aplicación web progresiva (PWA) para el registro y control de asistencia del personal docente y administrativo de la **Unidad Educativa Estadal General Rafael Urdaneta**.

Proyecto de **Servicio Comunitario** desarrollado por estudiantes universitarios en beneficio de la institución.

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-orange)
![Astro](https://img.shields.io/badge/Astro-7-BC52EE)
![TypeScript](https://img.shields.io/badge/TypeScript-estricto-3178C6)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)
![Vercel](https://img.shields.io/badge/deploy-Vercel-000000)

---

## Contenido

- [El problema](#el-problema)
- [La solución](#la-solución)
- [Funcionalidades](#funcionalidades)
- [Roles de usuario](#roles-de-usuario)
- [Cómo funciona una marcación](#cómo-funciona-una-marcación)
- [Tecnologías](#tecnologías)
- [Estado del proyecto](#estado-del-proyecto)
- [Instalación y desarrollo](#instalación-y-desarrollo)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Calidad y buenas prácticas](#calidad-y-buenas-prácticas)
- [Documentación](#documentación)
- [Equipo](#equipo)

---

## El problema

El registro de asistencia del personal de la institución se lleva de forma **manual**, en libros de actas y formatos físicos. Esto genera:

- Lentitud en el registro diario.
- Errores al transcribir y consolidar los datos.
- Deterioro o pérdida de los documentos.
- Dificultad para obtener reportes oportunos para la directiva.

El resultado es un cuello de botella administrativo que consume horas de trabajo cada mes.

## La solución

Una aplicación que se instala en el teléfono del personal y digitaliza todo el proceso.

**Aplicación en línea:** https://control-de-asistencia-vert.vercel.app

| Antes                                  | Con la aplicación                                       |
| -------------------------------------- | ------------------------------------------------------- |
| Firma en libro de actas                | Marcación desde el teléfono en segundos                 |
| Cálculo manual de tardanzas y faltas   | Cálculo automático según la jornada configurada         |
| Reportes elaborados a mano             | Reportes PDF y Excel generados al instante              |
| Documentos que se deterioran o pierden | Información centralizada y respaldada en la nube        |
| Sin forma de verificar la presencia    | Validación con código QR, ubicación y hora del servidor |

> **Costo de infraestructura: $0.** El sistema funciona sobre planes gratuitos de Supabase y Vercel, y aprovecha recursos que la institución ya posee: el computador de la oficina, la conexión a internet y los teléfonos del personal.

## Funcionalidades

**Marcación de asistencia**

- Entrada y salida desde el teléfono personal escaneando un **código QR impreso** en la entrada del plantel.
- Verificación de **ubicación (geocerca)**: solo se puede marcar dentro del perímetro del colegio.
- La fecha y la hora las registra el **servidor**, no el teléfono.
- **Un teléfono por cuenta**; los cambios de equipo los aprueba la secretaría.
- Respaldo en el **PC del colegio** para quien no tenga su teléfono: registro asistido por secretaría o autoservicio con cédula y PIN.

**Administración**

- Gestión del personal por **categoría** (docente, secretaría, cocina, obrero, vigilancia) y vínculo, con búsqueda, filtros, orden y paginación.
- Importación de personal desde una hoja de cálculo (CSV).
- **Jornadas configurables**: hora de entrada y salida, tolerancia, pausa y días laborables, con excepciones por persona y día.
- Calendario de feriados.
- Gestión de cuentas de usuario y roles.

**Panel para la directiva**

- Indicadores del período con comparación frente al período anterior: asistencia, puntualidad, faltas, retraso promedio y horas.
- Gráficas: tendencia diaria, asistencia por día de la semana, hora de llegada, comparación por categoría y seguimiento individual.
- Lectura rápida con observaciones calculadas a partir de los datos.

**Cálculos y reportes**

- Clasificación automática de cada día: presente, tarde, falta o permiso.
- Horas trabajadas, tardanzas, faltas y porcentaje de asistencia por período.
- Cierre diario automático que registra las faltas y genera alertas.
- Planilla diaria en **PDF** y **Excel** con el formato oficial del plantel (Asistencia Docentes / Asistencia Personal).

**Aplicación progresiva (PWA)**

- Se instala en Android, iPhone y escritorio sin pasar por tiendas de aplicaciones.
- Interfaz pensada primero para el teléfono, en español y sin términos técnicos.

## Roles de usuario

| Capacidad                                       | Directiva | Secretaría | Personal |
| ----------------------------------------------- | :-------: | :--------: | :------: |
| Marcar su propia asistencia                     |    Sí     |     Sí     |    Sí    |
| Ver su historial                                |    Sí     |     Sí     |    Sí    |
| Registrar asistencia de otros y cargar permisos |    Sí     |     Sí     |    —     |
| Aprobar cambios de teléfono                     |    Sí     |     Sí     |    —     |
| Consultar personal, reportes y panel            |    Sí     |     Sí     |    —     |
| Gestionar personal, jornadas y feriados         |    Sí     |     —      |    —     |
| Generar el código QR y configurar el sistema    |    Sí     |     —      |    —     |
| Administrar cuentas y roles                     |    Sí     |     —      |    —     |

## Cómo funciona una marcación

```
  Teléfono del personal                     Servidor
  ─────────────────────                     ────────
  1. Toca "Marcar entrada"
  2. Permite la ubicación
  3. Escanea el QR de la entrada  ───────►  4. Verifica la sesión y el teléfono
                                             5. Verifica que el QR esté vigente
                                             6. Verifica que esté dentro del colegio
                                             7. Registra la hora oficial
                                             8. Aplica la jornada: presente o tarde
  9. "Entrada 07:04 — Presente"   ◄───────
```

Si una validación falla, la persona recibe un mensaje claro sobre qué hacer (acercarse a la entrada, activar la ubicación, acudir a secretaría).

## Tecnologías

| Capa                          | Tecnología                                                              |
| ----------------------------- | ----------------------------------------------------------------------- |
| Framework web                 | [Astro](https://astro.build) con renderizado en servidor (SSR)          |
| Lenguaje                      | TypeScript en modo estricto                                             |
| Estilos                       | CSS nativo con variables de diseño (sin frameworks)                     |
| Base de datos y autenticación | [Supabase](https://supabase.com) (PostgreSQL, Auth, Row Level Security) |
| Hospedaje                     | [Vercel](https://vercel.com)                                            |
| Pruebas                       | [Vitest](https://vitest.dev)                                            |
| Calidad de código             | ESLint y Prettier                                                       |

### Arquitectura

```
┌────────────────────┐     ┌────────────────────┐
│ Teléfono (PWA)     │     │ PC del colegio     │
│ Marcación QR + GPS │     │ Administración     │
└─────────┬──────────┘     └─────────┬──────────┘
          └────────────┬─────────────┘
                       ▼
          ┌─────────────────────────┐
          │ Vercel · Astro (SSR)    │
          │ Validaciones y reglas   │
          └────────────┬────────────┘
                       ▼
          ┌─────────────────────────┐
          │ Supabase · PostgreSQL   │
          │ Datos, sesiones, roles  │
          └─────────────────────────┘
```

## Instalar la aplicación

| Dispositivo           | Pasos                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------- |
| iPhone (Safari)       | Abrir la dirección → botón Compartir → **Agregar a pantalla de inicio**                |
| Android (Chrome)      | Abrir la dirección → menú → **Instalar aplicación**                                    |
| PC con Windows (Edge) | Abrir la dirección → menú `…` → **Aplicaciones → Instalar este sitio como aplicación** |

## Estado del proyecto

Plan de trabajo de cuatro semanas, organizado por entregas funcionales completas.

| Semana | Alcance                                                                         | Estado         |
| ------ | ------------------------------------------------------------------------------- | -------------- |
| 1      | Base del sistema, inicio de sesión, roles, personal, jornadas y feriados        | **Completada** |
| 2      | Código QR, geocerca, aprobación de teléfonos, marcación y cierre diario         | En curso       |
| 3      | Respaldo en el PC (asistido y kiosco), reportes PDF/Excel y panel               | Pendiente      |
| 4      | Instalación como PWA, pruebas en dispositivos reales, despliegue y capacitación | Pendiente      |

El detalle de tareas se lleva en [`Tareas por semana`](Documentacion/04-Desarrollo/Tareas-por-semana.md).

## Instalación y desarrollo

### Requisitos

- Node.js 20 o superior
- Un proyecto de Supabase (plan gratuito)

### Puesta en marcha

```bash
git clone https://github.com/gru2026/control-de-asistencia.git
cd control-de-asistencia
npm install
cp .env.example .env     # completar con las claves del proyecto de Supabase
npm run db:migrar        # crea las tablas y políticas
npm run db:seed          # configuración inicial, jornada y feriados
npm run dev              # http://localhost:4321
```

Para crear la primera cuenta de administración:

```bash
npm run crear-usuario -- correo@ejemplo.com directiva Nombre Apellido
```

### Comandos

| Comando             | Descripción                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                                                 |
| `npm run build`     | Compilación para producción                                            |
| `npm run check`     | Verificación de tipos                                                  |
| `npm run lint`      | Análisis estático del código                                           |
| `npm run format`    | Formato automático                                                     |
| `npm test`          | Pruebas unitarias                                                      |
| `npm run test:e2e`  | Pruebas en un navegador real (requiere `npm run dev` en otra terminal) |
| `npm run capturas`  | Capturas de pantalla en PC y celular (`tests/e2e/capturas/`)           |
| `npm run db:migrar` | Aplica las migraciones pendientes                                      |
| `npm run db:seed`   | Carga los datos iniciales                                              |
| `npm run docs`      | Regenera el documento consolidado de la documentación                  |

## Estructura del repositorio

```
├── src/
│   ├── pages/            Pantallas y endpoints
│   ├── layouts/          Plantillas de página
│   ├── components/ui/    Componentes reutilizables
│   ├── lib/reglas/       Reglas de negocio (jornada, estados, horas, geocerca)
│   ├── lib/validacion/   Validación de formularios
│   ├── lib/servicios/    Operaciones sobre los datos
│   └── middleware.ts     Control de acceso por rol
├── supabase/
│   ├── migrations/       Esquema versionado de la base de datos
│   └── seed.sql          Datos iniciales
├── tests/                Pruebas unitarias
├── scripts/              Utilidades de base de datos y cuentas
└── Documentacion/        Documentación completa del proyecto
```

## Calidad y buenas prácticas

- **Reglas de negocio aisladas y probadas.** El cálculo de tardanzas, horas, porcentajes y distancias vive en funciones puras con pruebas unitarias.
- **Control de acceso en el servidor.** Cada pantalla verifica el rol del usuario antes de mostrarse, y la base de datos aplica permisos por fila de forma independiente.
- **Historial confiable.** Cada registro guarda la regla con la que se calculó, de modo que cambiar la jornada o la tolerancia no altera los meses anteriores. El personal se desactiva, nunca se borra.
- **Accesibilidad.** Formularios etiquetados, contraste adecuado, navegación por teclado y botones de tamaño cómodo en el teléfono.
- **Cambios trazables.** Esquema de base de datos versionado en migraciones y un registro de decisiones técnicas.

## Documentación

La documentación completa se encuentra en [`Documentacion/`](Documentacion/00-Inicio/Inicio%20—%20MOC.md) y puede abrirse como bóveda de Obsidian.

| Documento                                                                             | Contenido                                |
| ------------------------------------------------------------------------------------- | ---------------------------------------- |
| [Resumen ejecutivo](Documentacion/00-Inicio/Resumen%20ejecutivo.md)                   | El proyecto en una página                |
| [Planteamiento del problema](Documentacion/01-Proyecto/Planteamiento-del-problema.md) | Diagnóstico de la situación actual       |
| [Justificación y objetivos](Documentacion/01-Proyecto/Justificacion-y-objetivos.md)   | Objetivo general y específicos           |
| [Requisitos funcionales](Documentacion/02-Requisitos/Requisitos-funcionales.md)       | Qué debe hacer el sistema                |
| [Registro de decisiones](Documentacion/03-Diseno/Registro-de-decisiones.md)           | Decisiones tomadas con la institución    |
| [Modelo de datos](Documentacion/03-Diseno/Modelo-de-datos.md)                         | Tablas y relaciones                      |
| [Reglas de negocio](Documentacion/03-Diseno/Reglas-de-negocio.md)                     | Cálculo de estados, horas y validaciones |
| [Plan de pruebas](Documentacion/05-Entregables/Plan-de-pruebas.md)                    | Casos de prueba y resultados             |
| [Manual de usuario](Documentacion/05-Entregables/Manual-de-usuario.md)                | Guía para el personal del colegio        |

## Equipo

Proyecto de Servicio Comunitario.

| Integrante        | Rol                               |
| ----------------- | --------------------------------- |
| Schormeiker Lugo  | Coordinación y desarrollo         |
| Hector Diaz       | Pruebas y calidad                 |
| Rebeca Nexans     | Documentación y manual de usuario |
| Antonio Gonzalez  | Enlace con la institución y datos |
| Liz Espinoza      | Investigación                     |
| Mariansel Herrera | Capacitación y presentación       |

**Institución beneficiada:** U.E.E. General Rafael Urdaneta.

---

<sub>Proyecto académico sin fines de lucro, desarrollado para uso de la institución beneficiada.</sub>
