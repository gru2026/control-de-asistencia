---
titulo: Identidad visual
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: diseno
estado: activo
fecha: 2026-10-19
tags: [emma-soler, diseno]
---

# Identidad visual «Sol»

La biblioteca no tenía identidad visual. Como «Soler» recuerda al **sol**, se eligió una paleta cálida que combina las dos referencias de diseño (`referencias/imagenes/desktop`).

| Rol | Color | Hex |
|---|---|---|
| Primario | Coral atardecer | `#E85D4F` |
| Acento | Oro sol | `#F2B544` |
| Secundario | Azul cielo | `#7FB8DE` |
| Fondo | Crema papel | `#FAF6F0` y superficie `#F6F3EE` |
| Texto | Tinta | `#2B2D42` |
| Texto secundario | Gris cálido | `#8A8580` |

- **Tipografías:** *Lora* para títulos y citas, *Nunito* para la interfaz.
- **Logo:** un libro abierto con un sol naciente (`src/components/ui/Logo.astro`).
- **Referencias de diseño:**
  - `app.webp` es el marco de todo el sitio: barra lateral coral, cita del día, «Continuar leyendo» y contadores.
  - `1.jpg` es la vitrina de la biblioteca: tonos crema y dorado, libros sobre un estante.
- **Portadas generadas:** `src/lib/compartido/portada.mjs` dibuja en SVG el color de la categoría, un sol y curvas de nivel.
- **Animaciones:**
  - las tarjetas aparecen en cascada al hacer scroll;
  - los contadores suben desde 0 y las barras de progreso se llenan;
  - en la tarjeta de comunidad los libros caen al estante;
  - el indicador de la barra lateral se desplaza con View Transitions.

  Todas se desactivan si el usuario activa `prefers-reduced-motion`.
- **Diseño:** ocupa todo el ancho de la pantalla. Solo en monitores de más de 2200 px el contenido deja de crecer y se centra.
