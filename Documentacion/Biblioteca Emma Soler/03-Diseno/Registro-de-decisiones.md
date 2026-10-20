---
titulo: Registro de decisiones
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: diseno
estado: activo
fecha: 2026-10-20
tags: [emma-soler, diseno]
---

# Registro de decisiones

| # | Decisión | Motivo |
|---|---|---|
| D-01 | Node.js + Supabase local | Lo pidió el estudiante. Todo funciona en local. |
| D-02 | Astro en lugar de Express + EJS | Sitio más rápido, con animaciones y View Transitions. |
| D-03 | Docker instalado a nivel de sistema | Supabase lo necesita. Es la única excepción a «nada global». |
| D-04 | Paleta «Sol» (coral, oro y crema) | La eligió el estudiante entre dos propuestas. |
| D-05 | Marco de `app.webp` en todo el sitio | Pedido explícito: Inicio igual a la referencia y sitio unificado. |
| D-06 | Proyecto en la raíz de `desarrollo web/` | Lo eligió el estudiante. |
| D-07 | Biografía y dirección ficticias, con aviso visible | No hay datos reales de Emma Soler. |
| D-08 | Fotos de Wikimedia Commons con créditos | Licencias libres, autorizadas por el estudiante. |
| D-09 | Libros reales de dominio público (Wikisource) | Contenido auténtico y legal. |
| D-10 | Sitio a todo el ancho de la pantalla | Pedido del estudiante (19/10). Se muestran más libros en vez de agrandar las portadas. |
| D-11 | C++ como ejecutables que se comunican por JSON (opción A) | Requisito de C++ con la menor complejidad: sin addons nativos ni WebAssembly. |
| D-12 | Algoritmos C++: enderezar, Levenshtein, TF-IDF y SHA-256 | Son reales, aportan algo al sitio y se pueden explicar. |
| D-13 | nlohmann/json para leer JSON en C++ | El código propio se dedica a los algoritmos y no a escribir un lector de JSON. |
| D-14 | Documentación en Obsidian, carpeta «Biblioteca Emma Soler» | Mantenerla ordenada y separada de otros proyectos del vault. |
| D-15 | Auditoría con un disparador genérico en la base de datos, no en Node | Registra los cambios vengan de donde vengan; el historial es de solo agregar |

> [!note] Python
> El proyecto no tiene código Python. Solo se usó como herramienta auxiliar durante el desarrollo, por ejemplo para descargar los textos y las fotos y recortar capturas.
