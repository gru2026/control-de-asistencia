---
titulo: Modelo de datos
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: diseno
estado: activo
fecha: 2026-10-19
tags: [emma-soler, diseno]
---

# Modelo de datos

Las migraciones están en `supabase/migrations/`:

| Archivo | Contenido |
|---|---|
| `…01_esquema.sql` | Tipos, tablas e índices |
| `…02_funciones.sql` | Disparadores, la vista `v_libros` y las funciones de búsqueda y estadísticas |
| `…03_seguridad.sql` | RLS y buckets de almacenamiento |
| `…04_nombres_publicos.sql` | Nombre visible de quienes escriben reseñas |
| `…05_algoritmos_cpp.sql` | Integridad (SHA-256) y `libros_similares` |

## Tablas
| Grupo | Tabla | Para qué |
|---|---|---|
| Usuarios | `perfiles` | Nombre y rol (`admin`, `bibliotecario`, `lector`). 1 a 1 con `auth.users` |
| Catálogo | `libros` | Título, año, editorial, signatura, estado, PDF, portada, `metadatos` (JSONB), `busqueda` (tsvector), `pdf_sha256`, `integridad` |
| | `autores`, `categorias`, `etiquetas` | Catálogos |
| | `libros_autores`, `libros_etiquetas` | Relaciones muchos a muchos |
| | `libros_similares` | Recomendaciones calculadas en C++ (TF-IDF + coseno) |
| Contenido | `paginas_ocr` | Texto de cada página, con su índice de búsqueda |
| | `digitalizaciones` | Avance de cada proceso (paso, progreso y error) |
| Lectores | `lecturas` | Página actual y `marcadores` (JSONB) |
| | `favoritos`, `resenas` | |
| Estadísticas | `busquedas` | Término y cuántos resultados dio |
| | `vistas_libro` | Visitas a la ficha y lecturas |
| Sitio | `mensajes_contacto`, `suscriptores` | |

## Estados de un libro
`pendiente` → `escaneando` → `revision` → `publicado`. Solo los libros publicados son visibles para el público, y no se puede publicar un libro que no tenga PDF.

## Funciones SQL importantes
| Función | Qué hace |
|---|---|
| `buscar_libros(q, categoría, autor, orden, límite, desplazamiento)` | Búsqueda de texto completo en los metadatos y en el OCR, más similitud de títulos (`pg_trgm`) |
| `libros_populares(n)` | Los más vistos en los últimos 90 días |
| `contadores_publicos()` | Devuelve JSON con la cantidad de libros, autores y lectores |
| `estadisticas(días)` | Devuelve JSON con todo el panel. Solo para el personal |
| `nombres_publicos(ids)` | Nombre corto de quienes escriben reseñas («José M.») |
| `calcular_busqueda_libro()` | Disparador que arma el `tsvector` con pesos (A: título y autores; B: etiquetas y categoría; C: resumen) |

## Almacenamiento (buckets)
| Bucket | Acceso | Contenido |
|---|---|---|
| `portadas` | Público | Portadas WebP 400×600 |
| `pdfs` | Privado | Los PDF. El servidor los entrega solo a usuarios con sesión |
| `escaneos` | Privado | Imágenes procesadas de cada página |
