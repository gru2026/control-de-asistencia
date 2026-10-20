---
titulo: Glosario
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: referencia
estado: activo
fecha: 2026-10-19
tags: [emma-soler, referencia]
---

# Glosario

| Término | Significado |
|---|---|
| **OCR** | Reconocimiento óptico de caracteres: convierte la imagen de una página en texto. Se usa tesseract.js con el modelo de español. |
| **Capa de texto invisible** | Texto transparente dibujado sobre la imagen escaneada dentro del PDF. Permite buscar y copiar texto en un PDF que en realidad es una foto. |
| **Deskew (enderezar)** | Corregir la inclinación de una página fotografiada. Ver [[Biblioteca Emma Soler/05-Algoritmos-C++/1-Enderezar-paginas|1. Enderezar páginas]]. |
| **Distancia de Levenshtein** | Número mínimo de cambios de una letra para convertir una palabra en otra. |
| **TF-IDF** | Peso de una palabra en un documento: cuánto aparece en él (TF) multiplicado por qué tan rara es en el resto de los documentos (IDF). |
| **Similitud del coseno** | Medida de 0 a 1 de qué tanto apuntan en la misma dirección dos vectores; aquí, qué tan parecidos son dos textos. |
| **SHA-256 / hash / huella** | Resumen de 64 caracteres de un archivo. Si el archivo cambia aunque sea en un bit, la huella cambia por completo. |
| **RLS (Row Level Security)** | Reglas de PostgreSQL que deciden qué filas puede ver o modificar cada usuario. |
| **Supabase** | Plataforma que reúne PostgreSQL, autenticación y almacenamiento de archivos. Aquí corre en local con Docker. |
| **Bucket** | Carpeta del almacenamiento de Supabase. Hay tres: `portadas` (pública), `pdfs` y `escaneos` (privadas). |
| **Astro** | Framework web que genera HTML en el servidor y envía muy poco JavaScript al navegador. |
| **Página estática / prerender** | Página generada al compilar, que se entrega ya hecha. Es lo más rápido. |
| **Isla de servidor (`server:defer`)** | Parte de una página estática que se carga aparte, en el servidor, por ejemplo «Continuar leyendo». |
| **View Transitions** | Animación del navegador al pasar de una página a otra. |
| **JSONB** | Tipo de columna de PostgreSQL que guarda JSON y permite consultarlo. |
| **Signatura** | Código de ubicación del ejemplar físico en la estantería, por ejemplo `V861 B446s`. |
| **Dominio público** | Obras cuyos derechos de autor vencieron. En Venezuela, 60 años después de la muerte del autor. |
| **PGM** | Formato de imagen muy simple: una cabecera de texto y un byte por píxel. Se usa para pasar imágenes a C++. |
