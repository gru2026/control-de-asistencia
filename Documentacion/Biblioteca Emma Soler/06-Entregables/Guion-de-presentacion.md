---
titulo: Guion de presentación
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: entregable
estado: activo
fecha: 2026-10-19
tags: [emma-soler, entregable]
---

# Guion de presentación (unos 15 minutos)

> [!tip] Antes de empezar
> - Encender Docker y ejecutar `npm run db:start` y `npm run dev`.
> - Tener dos ventanas abiertas: una con la sesión del **lector** y otra (en incógnito) con la de la **bibliotecaria**.
> - Tener una foto de una página de un libro tomada con el teléfono, un poco torcida.

## 1. El problema (1 min)
La biblioteca de Cúa tiene libros que solo se pueden consultar en sala. Este sistema permite digitalizarlos y leerlos en línea.

## 2. El sitio institucional (2 min)
- **Inicio:** se basa en la referencia `app.webp`. Mostrar la cita del día, los contadores que suben y la animación del estante.
- **Colección local:** la historia real de Cúa, con fotos de Wikimedia y sus créditos.
- Achicar la ventana para mostrar la versión móvil, con la barra inferior.

## 3. Biblioteca digital como lector (3 min)
1. Buscar `tortuga`: la palabra aparece **dentro** de «Cuentos de la selva», en la página 7.
2. Buscar `bolibar`: aparece **«¿Quisiste decir bolívar?»** (C++, Levenshtein). Explicar la tabla de programación dinámica.
3. Abrir «Carta de Jamaica» → «También te puede gustar»: otros textos de Bolívar con su similitud (C++, TF-IDF + coseno).
4. Leer: pasar páginas, poner un marcador, salir y volver. El lector recuerda la página.

## 4. Digitalizar como bibliotecaria (4 min)
1. **Panel → Digitalizar:** completar los datos y agregar un metadato (mostrar el JSON en vivo).
2. Subir la foto torcida y dejar marcado **Enderezar páginas (C++)**.
3. Al terminar, el mensaje dice «Páginas enderezadas (C++): pág. 1: −3°». Explicar el perfil de proyección.
4. Revisar el texto del OCR y **publicar**. El libro ya aparece en el catálogo.

## 5. Integridad y estadísticas (2 min)
1. **Panel → Integridad → Verificar todos:** todos los PDF salen íntegros. Explicar SHA-256.
2. En la terminal, ejecutar `npm run prueba:integridad`: cambia 1 bit, lo detecta como «dañado» y lo restaura.
3. **Panel → Resumen:** gráficos, búsquedas sin resultados y exportación a JSON o CSV.

## 6. Preguntas técnicas probables
| Pregunta | Respuesta corta |
|---|---|
| ¿Dónde está el C++? | En `cpp/src/`: 4 programas que Node ejecuta enviándoles JSON. Ver [[Biblioteca Emma Soler/05-Algoritmos-C++/Integracion-Node-C++|Integración]] |
| ¿Por qué no un addon nativo? | Un ejecutable es más simple, se prueba solo y no necesita node-gyp |
| ¿Dónde usan JSON? | Ver [[Biblioteca Emma Soler/03-Diseno/Uso-de-JSON|Uso de JSON]] |
| ¿Cómo protegen los PDF? | Bucket privado + sesión + RLS + huella SHA-256 |
| ¿Funciona sin internet? | Sí. Supabase está en Docker y el modelo de OCR está en el proyecto |
| ¿Los libros son legales? | Son de dominio público (autores fallecidos hace más de 60 años) |
