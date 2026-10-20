---
titulo: Seguridad
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: diseno
estado: activo
fecha: 2026-10-19
tags: [emma-soler, diseno]
---

# Seguridad

- **Row Level Security** en todas las tablas:
  - el público solo ve los libros `publicado`;
  - cada lector solo ve y modifica sus propias lecturas y favoritos;
  - las reseñas son públicas, pero solo su autor puede editarlas;
  - solo el personal (`es_personal()`) puede escribir en el catálogo;
  - las estadísticas solo las ve el personal.
- **Roles:** el disparador `proteger_rol` impide que alguien que no sea administrador cambie roles, y nadie puede cambiar su propio rol.
- **PDF privados:** el bucket `pdfs` es privado. `/api/libros/[id]/pdf` exige sesión, y la política de Storage verifica que el libro esté publicado.
- **Middleware:** protege `/admin`, `/biblioteca/leer` y `/biblioteca/cuenta`. Las páginas con sesión llevan `Cache-Control: private, no-store`.
- **Formularios:** se validan en el servidor y en la base de datos (`check`). El formulario de contacto tiene un campo trampa contra bots.
- **Fragmentos de búsqueda:** el HTML se escapa y solo se permite `<mark>`.
- **Clave de servicio:** solo la usan los procesos de digitalización en segundo plano, después de verificar el rol.
- **Integridad de los PDF:** la huella SHA-256 detecta archivos alterados. Ver [[Biblioteca Emma Soler/05-Algoritmos-C++/5-Integridad-SHA-256|SHA-256]].

> [!warning] Solo para desarrollo
> Las claves de `.env` son las que Supabase usa por defecto en local. No sirven para producción.
