---
titulo: Búsqueda
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: desarrollo
estado: activo
fecha: 2026-10-19
tags: [emma-soler, desarrollo]
---

# Búsqueda

La función SQL `buscar_libros()` combina tres técnicas:

1. **Texto completo en español:** configuración `es_unaccent`, que reduce las palabras a su raíz (`spanish_stem`) e ignora las tildes (`unaccent`). Busca en:
   - `libros.busqueda`, con pesos: el título y los autores pesan más;
   - `paginas_ocr.busqueda`, que contiene el texto de cada página.
2. **Fragmento:** `ts_headline` devuelve el trozo de la página con las palabras marcadas con `<mark>`. Se muestra con el número de página.
3. **Tolerancia a errores en los títulos:** `pg_trgm` (similitud de trigramas mayor a 0,25), por ejemplo «silba criola» encuentra «Silva criolla».

Cuando **nada** coincide, el catálogo pide sugerencias al programa C++ `sugerencias` (distancia de Levenshtein) y muestra «¿Quisiste decir *bolívar*?». Ver [[Biblioteca Emma Soler/05-Algoritmos-C++/3-Quisiste-decir-Levenshtein|Levenshtein]].

Cada búsqueda se registra en `busquedas` con su cantidad de resultados. El panel muestra las **búsquedas sin resultados** para decidir qué digitalizar.

| Búsqueda | Qué resuelve |
|---|---|
| `tortuga` | La palabra está dentro del texto de «Cuentos de la selva» (página 7) |
| `bolivar` | Ignora la tilde |
| `silba criola` | Trigramas en el título |
| `bolibar` | 0 resultados → C++ sugiere «bolívar» |
