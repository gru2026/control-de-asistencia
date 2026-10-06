---
titulo: Presentación del proyecto
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: entregable
estado: borrador
fecha: 2026-10-06
---

# 🎤 Presentación del Proyecto (estructura de exposición)

Estructura sugerida para exponer ante el docente y el equipo (10-12 minutos + demo).

## Diapositiva 1 — Portada

- Título: *Diseño de una aplicación web progresiva de control de asistencia para el personal docente y administrativo de la U.E.E. General Rafael Urdaneta*
- Servicio comunitario · Integrantes · Fecha

## Diapositiva 2 — El problema

- Registro manual con libros de actas y formatos físicos.
- Síntomas: lentitud, errores, pérdida de documentos, reportes difíciles.
- Consecuencia: cuello de botella administrativo (cita de [[01-Proyecto/Planteamiento-del-problema]]).

## Diapositiva 3 — Solución propuesta

- **PWA**: se instala en el celular, funciona con y sin internet.
- Digitaliza el registro · automatiza cálculos · reportes inmediatos.
- Mockup o captura de la pantalla de marcación.

## Diapositiva 4 — Objetivos

- Objetivo general + los 6 objetivos específicos (ver [[01-Proyecto/Justificacion-y-objetivos]]).

## Diapositiva 5 — Alcance

- Dentro de: asistencia del **personal** (docentes y administrativos).
- Fuera de: asistencia de estudiantes, nómina, biométrico.

## Diapositiva 6 — Usuarios y roles

- Directiva / Secretaría / Personal — mini matriz de permisos.

## Diapositiva 7 — Cómo funciona (arquitectura)

- Diagrama simple: celular → Vercel (Astro) → Supabase.
- Puntos clave: seguridad por roles (RLS), QR + GPS + hora del servidor, un teléfono por cuenta.

## Diapositiva 8 — Reglas automáticas

- Ejemplo visual: 07:10 con tolerancia 15 → presente; 07:16 → tarde.
- Cierre automático genera faltas + alertas.

## Diapositiva 9 — Cronograma

- Tabla de 4 semanas con hitos (ver [[01-Proyecto/Cronograma-4-semanas]]).

## Diapositiva 10 — Demo en vivo

1. Login como directiva → dashboard con KPIs.
2. Marcar entrada/salida (celular).
3. Tabla del día + marcación asistida y kiosco en el PC.
4. Generar reporte mensual → exportar PDF.
5. (Bonus) Instalar la app / intentar marcar fuera del colegio → bloqueado.

## Diapositiva 11 — Resultados y métricas

- Lighthouse (capturas), pruebas ejecutadas, tiempo de generación de reporte.

## Diapositiva 12 — Conclusiones

- Problema resuelto, beneficios cuantificables (horas ahorradas/semana).
- Lecciones aprendidas y mejoras futuras (notificaciones por correo, multi-sede…).

## Diapositiva 13 — Preguntas

---

## Guion breve (para hablar)

> "El colegio registra la asistencia en libros de actas: eso genera errores, pérdidas y horas de trabajo manual. Diseñamos una PWA que se instala en el celular del personal, permite marcar entrada y salida con un toque —incluso sin internet— y calcula automáticamente horas, tardanzas y faltas. La directiva obtiene reportes en PDF en segundos en lugar de horas. Se desarrolló en 4 semanas con Astro y Supabase, con hosting gratuito."

**Métricas para impresionar:**
- Tiempo de reporte: horas manuales → < 1 minuto.
- Cero pérdida de documentos (todo digital y centralizado).
- Marcación verificada: QR + ubicación + hora del servidor.
- Costo de infraestructura: $0 (planes gratuitos).
