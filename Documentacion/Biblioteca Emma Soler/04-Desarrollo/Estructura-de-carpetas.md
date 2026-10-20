---
titulo: Estructura de carpetas
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: desarrollo
estado: activo
fecha: 2026-10-19
tags: [emma-soler, desarrollo]
---

# Estructura de carpetas

```
desarrollo web/
├─ cpp/                         Algoritmos en C++
│  ├─ src/                      enderezar · sugerencias · similares · sha256 (.cpp)
│  ├─ include/                  comun.hpp (entrada/salida JSON) · json.hpp (nlohmann)
│  ├─ pruebas/ejecutar.sh       Pruebas de entrada y salida
│  ├─ Makefile                  g++ -std=c++17 -O2 -Wall
│  └─ bin/                      Ejecutables compilados (no se versionan)
├─ data/tessdata/               Modelo de OCR en español
├─ referencias/imagenes/        app.webp y 1.jpg (diseño de referencia)
├─ scripts/
│  ├─ seed-libros.mjs           Carga inicial: PDF, portadas, OCR, SHA-256 y similares
│  ├─ catalogo-semilla.json     Datos de ejemplo
│  ├─ lib/pdf-texto.mjs         Genera un PDF a partir de texto plano
│  ├─ textos/                   15 obras de dominio público + «Cúa, la Perla del Tuy»
│  └─ pruebas/                  digitalizar · pdf · enderezar · integridad
├─ supabase/
│  ├─ config.toml
│  └─ migrations/               5 migraciones SQL
└─ src/
   ├─ assets/cua/               14 fotos de Cúa
   ├─ content/                  datos/*.json · eventos/*.md · noticias/*.md
   ├─ content.config.ts         Colecciones de contenido y su validación con Zod
   ├─ components/               ui/ · sitio/ (y sitio/islas/) · biblioteca/ · admin/
   ├─ layouts/                  Base · App (marco app.webp) · Admin
   ├─ lib/
   │  ├─ supabase.ts            Clientes: con sesión, público y de servicio
   │  ├─ datos.ts               Consultas del catálogo
   │  ├─ catalogo.ts            Escrituras del catálogo y recálculo de similares
   │  ├─ digitalizacion.ts      Imágenes → enderezar (C++) → OCR → PDF → SHA-256 (C++)
   │  ├─ integridad.ts          Verificación de los PDF
   │  ├─ api.ts · formato.ts · navegacion.ts
   │  └─ compartido/            cpp.mjs (puente) · algoritmos.mjs · portada.mjs
   ├─ middleware.ts             Sesión y roles
   ├─ pages/                    Páginas y api/
   └─ styles/global.css         Identidad «Sol»
```
