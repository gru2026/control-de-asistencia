---
titulo: Arquitectura y stack
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: diseno
estado: activo
fecha: 2026-10-19
tags: [emma-soler, diseno]
---

# Arquitectura y stack

## Diagrama general
```
┌────────────────────────────┐
│ Navegador (lector/personal)│  HTML casi sin JS · PDF.js en el lector · Chart.js en el panel
└─────────────┬──────────────┘
              │ HTTP (páginas + API JSON)
              ▼
┌──────────────────────────────────────────────────────────────┐
│ Astro 7 + @astrojs/node (servidor Node.js)                   │
│  · Páginas estáticas: sitio institucional                    │
│  · Páginas del servidor: biblioteca, panel, API JSON         │
│  · middleware.ts → sesión y rol                              │
│  · Digitalización: sharp → tesseract.js (OCR) → pdf-lib      │
│        │                                                     │
│        │ JSON por stdin/stdout                               │
│        ▼                                                     │
│  Programas C++ (cpp/bin): enderezar · sugerencias ·          │
│                           similares · sha256                 │
└─────────────┬────────────────────────────────────────────────┘
              │ supabase-js (HTTP)
              ▼
┌──────────────────────────────────────────────────────────────┐
│ Supabase local (Docker)                                      │
│  · PostgreSQL 17: tablas, RLS, búsqueda de texto completo    │
│  · Auth: usuarios y sesiones (cookies)                       │
│  · Storage: portadas (pública), pdfs y escaneos (privados)   │
└──────────────────────────────────────────────────────────────┘
```

## Stack
| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | **Astro 7** + adaptador Node | Envía muy poco JavaScript; combina páginas estáticas con páginas del servidor |
| Base de datos | **Supabase local** (PostgreSQL 17) en **Docker** | Base de datos, autenticación y archivos en un solo lugar, sin internet |
| Imágenes | sharp | Recorte, contraste y conversión a WebP |
| OCR | tesseract.js + modelo `spa` en `data/tessdata` | Funciona sin conexión |
| PDF | pdf-lib (crear) · pdfjs-dist (leer y mostrar) | |
| Algoritmos propios | **C++17** (g++, make) | Requisito de la materia. Ver [[Biblioteca Emma Soler/05-Algoritmos-C++/Integracion-Node-C++|Integración Node ↔ C++]] |
| Gráficos | Chart.js | Solo se carga en el panel |
| Fuentes | Lora y Nunito (Fontsource) | Servidas desde el propio sitio |

## Rendimiento
- El sitio institucional se genera **estático**. Lo que depende del usuario se carga con **islas de servidor** (`server:defer`) y esqueletos de carga.
- La portada envía unos 14 KB de JavaScript.
- Las imágenes de `astro:assets` se convierten a WebP en varios tamaños.
- Las animaciones usan CSS, IntersectionObserver y View Transitions, y respetan `prefers-reduced-motion`.

## Instalación local
Todo queda dentro del proyecto (`node_modules`, la CLI de Supabase y el modelo de OCR). A nivel de sistema solo se necesitan **Docker**, **g++** y **make**.
