---
titulo: Funcionalidades
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: requisitos
estado: activo
fecha: 2026-10-19
tags: [emma-soler, requisitos]
---

# Funcionalidades

## Sitio institucional (9 secciones)
Todas las páginas usan el marco de la referencia `app.webp`: barra lateral coral fija a la izquierda y el contenido a todo el ancho. En el móvil, la barra pasa a la parte de abajo.

| # | Sección | Ruta | Contenido |
|---|---|---|---|
| 1 | Inicio | `/` | Cita del día, «Continuar leyendo» o «Novedades», libro recomendado, contadores, comunidad, boletín, próximos eventos y «Visítanos» |
| 2 | Nosotros | `/nosotros` | Historia, quién fue Emma Soler, misión, visión, valores y línea de tiempo |
| 3 | Servicios | `/servicios` | 8 servicios (desde `servicios.json`) y cómo sacar el carnet |
| 4 | Colección local | `/coleccion-local` | «Cúa, la Perla del Tuy»: cronología, cueños ilustres, tradiciones y galería |
| 5 | Biblioteca digital | `/biblioteca` | Vitrina inspirada en la referencia `1.jpg` |
| 6 | Eventos | `/eventos` | Agenda con filtros y detalle de cada evento (Markdown) |
| 7 | Noticias | `/noticias` | Noticias en Markdown |
| 8 | Preguntas frecuentes | `/preguntas-frecuentes` | Acordeón con buscador (desde `faq.json`) |
| 9 | Contacto | `/contacto` | Formulario que se guarda en la base de datos, dirección y horario |

## Biblioteca digital (público y lectores)
- **Catálogo:** búsqueda de texto completo, filtros por categoría y autor, distintos órdenes y paginación. Junto a cada resultado muestra el fragmento de la página donde aparece la palabra. Ver [[Biblioteca Emma Soler/04-Desarrollo/Busqueda|Búsqueda]].
- **«¿Quisiste decir…?»:** sugerencias cuando no hay resultados (C++). Ver [[Biblioteca Emma Soler/05-Algoritmos-C++/3-Quisiste-decir-Levenshtein|Levenshtein]].
- **Ficha del libro:** metadatos, signatura física, reseñas con estrellas, favoritos y «También te puede gustar» (C++, TF-IDF). Ver [[Biblioteca Emma Soler/05-Algoritmos-C++/4-Libros-similares-TF-IDF|TF-IDF]].
- **Lector PDF (PDF.js):** zoom, modo sepia, pantalla completa, teclado y gestos táctiles, marcadores con nota y guardado automático del progreso.
- **Mi cuenta:** lecturas en curso, favoritos, marcadores, reseñas y nombre.

## Panel del personal (`/admin`)
- **Resumen:** estadísticas de 7, 30 o 90 días, gráficos, libros más leídos, búsquedas frecuentes y **búsquedas sin resultados** (sirven para decidir qué digitalizar). Se exportan en JSON o CSV.
- **Digitalizar:** asistente de 4 pasos. Ver [[Biblioteca Emma Soler/04-Desarrollo/Flujo-de-digitalizacion|Flujo de digitalización]].
- **Libros:** filtros por estado, cambio rápido de estado, destacar y eliminar.
- **Edición de libro:** datos, autores, etiquetas, metadatos JSON, reemplazar el PDF o la portada, y corregir el texto del OCR página por página.
- **Subir un PDF existente:** su texto se extrae y se indexa automáticamente.
- **Categorías y autores:** crear, editar y borrar.
- **Integridad:** huella SHA-256 de cada PDF y verificación (C++). Ver [[Biblioteca Emma Soler/05-Algoritmos-C++/5-Integridad-SHA-256|SHA-256]].
- **Mensajes:** mensajes del formulario de contacto (marcar como leído) y suscriptores del boletín.
- **Usuarios:** cambio de roles. Solo para administración.
