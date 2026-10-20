---
titulo: Manual de usuario
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: entregable
estado: activo
fecha: 2026-10-20
tags: [emma-soler, entregable]
---

# Manual de usuario

## Para lectores
1. **Buscar un libro:** escribe en el buscador de arriba. Puedes buscar por título, autor o **cualquier palabra que esté dentro del libro**. Si escribes mal, el sitio te sugiere la palabra correcta.
2. **Crear una cuenta:** ve a «Crear cuenta», escribe tu nombre, tu correo y una contraseña de al menos 8 caracteres. Es gratis.
3. **Leer:** en la ficha del libro, pulsa «Leer ahora».
   - Pasa de página con las flechas, con el teclado (← →) o deslizando el dedo.
   - En la computadora, el botón 📖 muestra dos páginas a la vez, como un libro abierto.
   - Usa 🔍 para ampliar, ☀ para el modo sepia y ⛶ para la pantalla completa.
   - Pulsa 🔖 para guardar un marcador con una nota. La lista de marcadores está en ☰.
   - El sitio recuerda la página donde quedaste.
4. **Favoritos y reseñas:** en la ficha del libro, pulsa ♡ para guardarlo en favoritos o deja tu reseña con estrellas.
5. **Mi cuenta:** lecturas en curso, favoritos, marcadores y reseñas.

## Para el personal (bibliotecarios)
### Digitalizar un libro
1. Ve a **Panel → Digitalizar**.
2. **Paso 1:** completa los datos. El título es obligatorio. En «Información adicional» puedes agregar datos libres (edición, procedencia…), que se guardan como JSON.
3. **Paso 2:** sube las fotos de las páginas. Ordénalas arrastrándolas o con «Ordenar por nombre de archivo», y rota con ⟳ las que estén giradas.
4. **Paso 3:** deja marcadas las opciones recomendadas, incluida **Enderezar páginas**.
5. **Paso 4:** espera a que termine. Al final verás la confianza del OCR y qué páginas se enderezaron.
6. Pulsa **Revisar y publicar**: corrige el texto de las páginas con baja confianza y cambia el estado a **Publicado**.

### Otras tareas
| Tarea | Dónde |
|---|---|
| Subir un PDF que ya es digital | Libros → «Subir PDF existente» |
| Destacar un libro en la portada | Libros → interruptor «Destacado» |
| Saber qué buscan los lectores y no encuentran | Resumen → «Búsquedas sin resultados» → «Digitalizar» |
| Exportar las estadísticas | Resumen → botones JSON o CSV |
| Comprobar que los PDF no estén dañados | Integridad → «Verificar todos» |
| Saber quién cambió un libro y qué cambió | Historial, o al final de la edición del libro |
| Responder mensajes | Mensajes → enlace al correo → «Marcar leído» |

## Para la administración
- **Usuarios:** cambiar el rol de una persona (lector, bibliotecario o administración). No puedes cambiar tu propio rol.
