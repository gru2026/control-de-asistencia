---
titulo: Flujo de digitalización
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: desarrollo
estado: activo
fecha: 2026-10-19
tags: [emma-soler, desarrollo]
---

# Flujo de digitalización

## Para el bibliotecario (`/admin/digitalizar`)
1. **Datos:** título, autores, categoría, año, signatura, etiquetas, resumen y metadatos JSON.
2. **Páginas:** arrastrar las fotos o tomarlas con la cámara del teléfono. Se pueden reordenar arrastrando, rotar de 90° en 90° y quitar.
3. **Opciones:** mejorar la legibilidad, escala de grises, recortar bordes, **enderezar páginas (C++)** y tipo de portada (la primera página o una ilustrada).
4. **Procesar:** una barra de avance consulta `/api/admin/digitalizaciones/:id` cada segundo.

## Lo que hace el servidor (`src/lib/digitalizacion.ts`)
```
Por cada página:
  sharp: orientación EXIF → rotación manual → recortar bordes
  C++ enderezar: calcula la inclinación → sharp la corrige
  sharp: tamaño máximo 1800×2600 → grises → contraste y enfoque → JPG
  guarda el JPG en Storage/escaneos
  tesseract.js (español): texto + posición de cada línea
  pdf-lib: página = imagen + capa de texto invisible
Al final:
  guarda el PDF en Storage/pdfs
  C++ sha256: huella del PDF → libros.pdf_sha256
  genera la portada → Storage/portadas
  guarda el texto de cada página en paginas_ocr (índice de búsqueda)
  libro → estado «revision»
```

## Revisión y publicación
- En `/admin/libros/[id]` se corrige el texto del OCR página por página. Solo se guardan las páginas modificadas.
- Al cambiar el estado a **Publicado**, el libro aparece en el catálogo y se **recalculan los libros similares** (C++).

## Subir un PDF ya digital
En `/admin/libros/nuevo`, pdfjs extrae el texto de cada página y se calcula su SHA-256.

## Números de las pruebas
| Prueba | Resultado |
|---|---|
| 3 páginas (una girada 90° y otra torcida 3°) | Confianza media del OCR: 89 %. La página 2 se enderezó −3°. |
| Página torcida 6° | Confianza del OCR: 88 % sin enderezar y 95 % enderezada. |
