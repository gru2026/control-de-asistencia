---
titulo: Resumen ejecutivo
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: resumen
estado: activo
fecha: 2026-10-06
---

# Resumen ejecutivo

## Problema

En la U.E.E. General Rafael Urdaneta el registro y control de asistencia del personal docente y administrativo se realiza de forma **manual** (libros de actas y formatos físicos). Esto provoca:

- Lentitud en el registro diario.
- Errores humanos en la transcripción de datos.
- Deterioro o pérdida de los documentos físicos.
- Imposibilidad de generar reportes estadísticos rápidos para la directiva.

Resultado: un cuello de botella administrativo que consume horas de trabajo manual.

## Solución

Desarrollar una **aplicación web progresiva (PWA)** de control de asistencia que:

1. **Digitaliza** el registro de entrada y salida con hora automática.
2. **Automatiza** el cálculo de horas, tardanzas y faltas.
3. Ofrece **reportes** exportables (PDF/Excel) para la toma de decisiones.
4. Se instala en el celular del personal; cada marcación se valida con **QR impreso + GPS + hora del servidor**.
5. Usa el **PC del colegio** como centro de administración y respaldo (marcación asistida y kiosco con PIN).
6. Centraliza los datos **en tiempo real** con transparencia y disponibilidad inmediata.

## Stack tecnológico

| Capa | Elección | Motivo |
|---|---|---|
| Frontend + SSR | **Astro 7 + TypeScript** | Rápido, seguro (rutas protegidas), PWA-friendly |
| Estilos | **CSS puro** (variables, scoped CSS, Grid/Flex) | Sin dependencias pesadas |
| Backend / BDD / Auth | **Supabase** (Postgres + Auth + RLS) | Gratis, sin servidor propio |
| Hosting | **Vercel** (plan gratis) | Deploy automático desde Git |
| PWA | Manifest + Service Worker | Instalable; abre sin conexión |
| Reportes | SVG/CSS + jsPDF + SheetJS | Exportación sin frameworks pesados |

## Alcance clave

- **Roles:** directiva (administración del colegio), secretaria, personal (docentes y administrativos).
- **Módulos:** login, gestión de personal y jornadas configurables, QR imprimible, marcación con QR + GPS, aprobación de dispositivos, respaldo en el PC (asistido y kiosco), reportes PDF/Excel, dashboard y notificaciones.
- **Fuera de alcance:** asistencia de estudiantes (solo personal).

## Plan

4 semanas de desarrollo individual, por fases: (1) auth y personal, (2) marcación y reglas, (3) reportes y dashboard, (4) PWA, pulido y despliegue. Detalle en [[01-Proyecto/Cronograma-4-semanas|Cronograma]].

## Estado

Decisiones principales cerradas con el colegio (2026-10-06) → [[03-Diseno/Registro-de-decisiones|Registro de decisiones]]. Repositorio y andamiaje creados. Pendientes: valores concretos de jornada, coordenadas y administrador inicial → [[Preguntas-para-el-colegio]].
