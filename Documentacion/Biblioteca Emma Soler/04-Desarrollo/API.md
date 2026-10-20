---
titulo: API
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: desarrollo
estado: activo
fecha: 2026-10-20
tags: [emma-soler, desarrollo]
---

# API (JSON)

Todos los endpoints responden JSON. En caso de error devuelven `{ "error": "mensaje" }` con el código HTTP correspondiente.

## Públicos
| Método | Ruta | Cuerpo / parámetros | Respuesta |
|---|---|---|---|
| GET | `/api/buscar` | `q`, `categoria`, `limite` | `{ consulta, total, sugerencias, resultados: [{ slug, titulo, autores_texto, portada, fragmento, pagina }] }` |
| POST | `/api/contacto` | `{ nombre, correo, asunto, mensaje }` | `{ mensaje }` (201) |
| POST | `/api/suscribir` | `{ correo }` | `{ mensaje }` |

## Con sesión
| Método | Ruta | Cuerpo | Respuesta |
|---|---|---|---|
| GET | `/api/libros/:id/pdf` | Cabecera `Range` opcional | El PDF completo (200) o un trozo (206). Registra una lectura |
| GET / PUT | `/api/lecturas/:libro` | `{ pagina_actual, total_paginas, marcadores? }` | Progreso y marcadores |
| POST / DELETE | `/api/favoritos/:libro` | — | `{ favorito }` |
| POST | `/api/resenas` | `{ libro_id, puntuacion, comentario }` | `{ mensaje }` |
| POST | `/api/auth/salir` | — | Redirige a `/` |

## Personal
| Método | Ruta | Cuerpo | Respuesta |
|---|---|---|---|
| POST | `/api/admin/digitalizar` | multipart: datos del libro, `paginas[]`, `rotaciones` (JSON), `opciones` (JSON) | `{ trabajo_id, libro_id, slug }` (202) |
| GET | `/api/admin/digitalizaciones/:id` | — | `{ estado, paso, progreso, total, mensaje }` |
| PATCH / DELETE | `/api/admin/libros/:id` | `{ estado?, destacado? }` | Libro actualizado o eliminado. Recalcula los similares |
| POST | `/api/admin/integridad` | `{ ids? }` | `{ verificados, ok, danados, faltantes, resultados }` |
| GET | `/api/admin/estadisticas` | `dias`, `formato=json\|csv` | Archivo descargable |
| POST | `/api/admin/usuarios/:id` | `{ rol }` | Solo administración |
| GET | `/api/admin/auditoria` | `tabla`, `accion`, `usuario`, `registro`, `desde`, `hasta`, `pagina`, `formato=json` | `{ entradas, total, pagina, paginas }`, o un archivo descargable |
