---
titulo: Colección de libros reales
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: desarrollo
estado: activo
fecha: 2026-10-20
tags: [emma-soler, desarrollo, coleccion]
---

# Colección de libros reales

La biblioteca digital tiene **27 libros de dominio público**, que vienen de tres fuentes.

## 1. Libros completos (Proyecto Gutenberg), 12 títulos
| Libro | Autor | Páginas | Categoría |
|---|---|---|---|
| Cuentos de poeta (1900) | Rufino Blanco Fombona 🇻🇪 | 95 | Narrativa |
| Cuentos de amor de locura y de muerte | Horacio Quiroga | 191 | Narrativa |
| La Edad de Oro (los 4 números) | José Martí | 184 | Infantil |
| Amistad funesta | José Martí | 178 | Narrativa |
| Azul... | Rubén Darío | 126 | Narrativa |
| Ariel | José Enrique Rodó | 77 | Ensayo y pensamiento |
| El gaucho Martín Fierro | José Hernández | 100 | Poesía |
| Biografía del Libertador Simón Bolívar (1868) | L. C. | 82 | Historia |
| Fábulas | Félix María Samaniego | 267 | Infantil |
| Ratón Pérez | Luis Coloma | 18 | Infantil |
| Tradiciones peruanas | Ricardo Palma | 171 | Narrativa |
| Historia de Venezuela, tomo I | Fray Pedro de Aguado | **587** | Historia |

- `npm run importar:gutenberg` (`scripts/importar-gutenberg.mjs`):
  1. Descarga cada texto y lo guarda en `.cache/gutenberg`.
  2. Quita la licencia y la cabecera de Gutenberg, las notas del transcriptor y las marcas de ilustraciones, itálicas y negritas.
  3. Une las líneas cortadas en la prosa y respeta los versos.
- Después, `npm run seed:libros` genera el PDF, la portada, el índice de búsqueda, el SHA-256 y los libros similares.
- Se agregó la categoría **Ensayo y pensamiento**. *La Edad de Oro* y *Azul...* pasaron de ser selecciones a estar **completos**.

## 2. Libros escaneados de verdad (Internet Archive), 3 títulos
Son fotos de los **ejemplares originales**, procesadas con el mismo asistente que usa el personal: descarga → enderezar (C++) → OCR → PDF con capa de texto → SHA-256 → publicar.

| Libro | Edición | Escaneo | Páginas | OCR | PDF |
|---|---|---|---|---|---|
| Silva criolla | Caracas, 1901 | Google Books | 28 | 78 % | 1,7 MB |
| Tradiciones y leyendas | Mérida, 1911 | University of North Carolina | 119 | 82 % | 40 MB |
| Venezuela heroica | Caracas, 1881 | University of Toronto | 277 | 87 % | 53 MB |

En *Venezuela heroica* el algoritmo C++ enderezó 32 páginas que de verdad estaban torcidas, entre 0,5° y 2,75°: las del final del ejemplar, donde el escaneo quedó menos derecho.

- `npm run importar:escaneos` (`scripts/importar-escaneos.mjs`) necesita el sitio en marcha. Inicia sesión como bibliotecaria, envía las páginas a `/api/admin/digitalizar` y publica el libro. Así esas acciones también quedan en el [[Biblioteca Emma Soler/04-Desarrollo/Historial-de-cambios|historial]].
- Las páginas descargadas quedan en `.cache/escaneos/`, así que volver a ejecutarlo no las descarga de nuevo. Los libros que ya existen se saltan.

## 3. Selecciones de Wikisource y publicación propia, 12 títulos
Bolívar (4), Bello (2), Pérez Bonalde, Baralt, José Asunción Silva, Díaz Rodríguez, Quiroga (*Cuentos de la selva*) y *Cúa, la Perla del Tuy*.

## Lo que se mejoró al probar con libros reales
| Problema | Causa | Solución |
|---|---|---|
| El OCR de un libro de 1911 dio 54 % | Se reconocía la imagen en color, con el contraste estirado por canal | Ahora el OCR usa **siempre una copia en escala de grises** (sin estirar el contraste) y el PDF conserva el color del papel. Subió a **80-87 %** (las páginas sueltas pasaron de 41-79 % a 88-91 %). En la prueba sintética, estirar el contraste convertía el ruido de una página casi blanca en «letras»; sin estirarlo, la confianza es del 95 % |
| Las páginas casi en blanco se «enderezaban» 3° o 5° | Con poca tinta, el perfil de proyección es ruido | Enderezar exige al menos 2000 píxeles de tinta y que la varianza mejore al menos un **15 %** frente a no girar (campo `mejora`) |
| El PDF de 126 páginas pesaba 117 MB y había que bajarlo entero para leerlo | Imágenes de 1800 px a calidad 82, sin descarga por partes | Imágenes de 1400 px a calidad 68 (en color) → 41 MB, más **descarga por partes** (cabecera `Range`): el lector baja solo las páginas visibles |
| El OCR tardaba unos 15 s por página | Un solo trabajador de Tesseract | **4 trabajadores en paralelo** (uno por núcleo): unos 2 s por página |
| Las guardas y la ficha de la biblioteca de origen llenaban la búsqueda de texto basura | El OCR intenta leer cualquier imagen | Las páginas con confianza menor al **40 %** se guardan como imagen, sin texto, y se recortaron las páginas finales |
| La portada de *Silva criolla* salía casi blanca | La portada original es una hoja con poco texto | Opción `portada: 'ilustrada'` en el importador |

## Lector
- **Ajuste a la página:** la página entera cabe en la pantalla. El zoom parte de ahí.
- **Doble página** (botón 📖): en pantallas de 900 px o más se ven dos páginas, como un libro abierto, con la sombra del lomo. La portada va sola y después siguen los pares 2-3, 4-5… La preferencia se guarda en el navegador.
- **Carga por partes:** PDF.js pide trozos de 256 KB (`disableAutoFetch`). `/api/libros/:id/pdf` reenvía la cabecera `Range` a Supabase Storage con el token del lector, así que las políticas de seguridad siguen aplicándose.

## Créditos
La página `/creditos` cita el Proyecto Gutenberg, Wikisource e Internet Archive. Cada ficha enlaza a su fuente en «Más información de la edición».
