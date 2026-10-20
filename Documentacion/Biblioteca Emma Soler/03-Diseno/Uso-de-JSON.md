---
titulo: Uso de JSON
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: diseno
estado: activo
fecha: 2026-10-19
tags: [emma-soler, diseno]
---

# Uso de JSON (requisito de la materia)

JSON se usa solo donde aporta algo, no en todos lados.

| Lugar | Ejemplo | Por qué JSON |
|---|---|---|
| **API REST** (`src/pages/api/**`) | `GET /api/buscar?q=…` → `{ total, resultados, sugerencias }` | Es el formato estándar entre el navegador y el servidor |
| **Datos del sitio** (`src/content/datos/*.json`) | `servicios.json`, `faq.json`, `citas.json`, `sitio.json`, `creditos-fotos.json` | Se edita el texto sin tocar el HTML. Astro lo valida con Zod |
| **Columna `libros.metadatos`** (JSONB) | `{ "edicion": "Primera", "traductor": "…" }` | Cada libro tiene datos distintos y no hace falta una columna por cada uno |
| **Columna `lecturas.marcadores`** (JSONB) | `[{ "pagina": 3, "nota": "…", "fecha": "…" }]` | Lista variable por lector |
| **Funciones SQL** | `estadisticas()`, `contadores_publicos()` | Todo el panel en una sola consulta |
| **Exportación** | `/api/admin/estadisticas?formato=json` | Reporte descargable |
| **Comunicación con C++** | `{"consulta":"bolibar",…}` → `{"sugerencias":[…]}` | Interfaz simple entre dos lenguajes. Ver [[Biblioteca Emma Soler/05-Algoritmos-C++/Integracion-Node-C++|Integración Node ↔ C++]] |
| **JSON-LD** | `Event`, `Book`, `FAQPage` | Datos estructurados para los buscadores |
| **Carga inicial** | `scripts/catalogo-semilla.json` | Libros, autores, categorías y usuarios de ejemplo |

> [!tip] Para la defensa
> El editor de metadatos del panel (Editar libro → «Información adicional») muestra en vivo el JSON que se guardará.
