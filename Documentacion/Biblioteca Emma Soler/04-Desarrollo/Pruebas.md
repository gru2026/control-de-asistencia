---
titulo: Pruebas
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: desarrollo
estado: activo
fecha: 2026-10-19
tags: [emma-soler, desarrollo]
---

# Pruebas

| Comando | Qué comprueba | Último resultado (19/10/2026) |
|---|---|---|
| `npm run check` | Tipos de TypeScript y Astro | 0 errores en 87 archivos |
| `npm run build` | Compilación de producción (incluye C++) | ✅ |
| `npm run test:cpp` | 14 pruebas de los programas C++: vectores oficiales de SHA-256, igualdad con `sha256sum`, sugerencias, similares y JSON inválido | 14/14 ✅ |
| `npm run prueba:enderezar` | Páginas giradas 0°, 3°, −4°, 1,5° y −2,25° → detecta la corrección exacta | 5/5 ✅ |
| `npm run prueba:integridad` | 16 PDF íntegros → se cambia 1 bit → «dañado» → se restaura → «íntegro» | ✅ |
| `npm run prueba:digitalizar` | Imágenes → enderezar → OCR → PDF → publicar → buscar una palabra del OCR → eliminar | ✅ OCR al 89 % |
| `npm run prueba:pdf` | Subir un PDF existente → extraer su texto → buscar → eliminar | ✅ |

**Pruebas manuales (curl y capturas):**
- todas las páginas responden 200, o 302 cuando piden sesión;
- un lector no puede entrar a `/admin` y una bibliotecaria no puede entrar a `/admin/usuarios`;
- sin sesión, `/api/libros/:id/pdf` responde 401;
- revisión visual a 390, 1440, 1600, 1865 y 2560 px.

> [!todo] Falta
> - Revisar visualmente el lector y Mi cuenta (ya es posible capturar pantallas con sesión).
> - Medir con Lighthouse.
> - Pruebas automáticas de la interfaz.
