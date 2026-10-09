# Product

> Construido a partir de las decisiones registradas con la institución
> (`Documentacion/03-Diseno/Registro-de-decisiones.md`). Actualizar si cambian.

## Register

product

## Platform

web — PWA instalable (teléfonos Android/iPhone y PC con Windows 10 vía Microsoft Edge).

## Product

GRU-system: control de asistencia del personal docente, administrativo, obrero, de cocina y de vigilancia de la U.E.E. General Rafael Urdaneta (Cúa, Miranda, Venezuela). Proyecto de Servicio Comunitario universitario.

Reemplaza el libro de actas y las planillas en papel: cada persona marca entrada y salida desde su teléfono (QR impreso + ubicación + hora del servidor), y la dirección obtiene cálculos automáticos, un panel con indicadores y la planilla diaria oficial en PDF/Excel.

## Users

- **Directiva** (rectoría, coordinación): revisa indicadores, toma decisiones sobre el personal, configura jornadas, categorías y el QR. Trabaja en el PC de la oficina.
- **Secretaría**: registra asistencia de quien no tiene teléfono, carga permisos, aprueba cambios de teléfono, imprime la planilla del día. PC de la oficina.
- **Personal** (≈ 51 personas): marca entrada y salida en segundos desde su teléfono, en la entrada del plantel, a veces con poca señal y con una mano.

Usuarios no técnicos, con experiencia digital variada. Equipos modestos: PC con Windows 10 y teléfonos de gama media o baja.

## Principles

- Calma y claridad antes que espectáculo: la herramienta desaparece en la tarea.
- Marcar asistencia en 3 toques o menos.
- Español sencillo, sin tecnicismos; los errores dicen qué pasó y cómo resolverlo.
- Los datos deben poder imprimirse con el formato oficial del plantel.
- Ligera: carga rápida en equipos y conexiones modestas.

## Accessibility & Inclusion

- Contraste WCAG AA (≥ 4.5:1), foco visible, controles ≥ 44 px, sin depender solo del color.
- Respeta «reducir movimiento» y el zoom del sistema.
- Áreas seguras del iPhone.

## Brand commitments

- Nombre: GRU-system. Ícono con las iniciales «GRU» (blanco sobre azul noche, línea azul).
- Colores de marca: azul noche `#0f172a` y azul `#2563eb`.
- Planillas con el encabezado oficial del Gobierno de Miranda y la firma de la dirección.

## Stack

Astro (SSR) + TypeScript, CSS propio con tokens (sin frameworks de UI), Supabase, Vercel.
