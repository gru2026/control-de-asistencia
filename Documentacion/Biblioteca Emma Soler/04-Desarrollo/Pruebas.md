---
titulo: Pruebas
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: desarrollo
estado: activo
fecha: 2026-10-20
tags: [emma-soler, desarrollo]
---

# Pruebas

| Comando | Qué comprueba | Último resultado (19/10/2026) |
|---|---|---|
| `npm run check` | Tipos de TypeScript y Astro | 0 errores en 91 archivos (20/10) |
| `npm run build` | Compilación de producción (incluye C++) | ✅ |
| `npm run test:cpp` | 14 pruebas de los programas C++: vectores oficiales de SHA-256, igualdad con `sha256sum`, sugerencias, similares y JSON inválido | 14/14 ✅ |
| `npm run prueba:enderezar` | Páginas giradas 0°, 3°, −4°, 1,5° y −2,25° → detecta la corrección exacta | 5/5 ✅ |
| `npm run prueba:integridad` | 16 PDF íntegros → se cambia 1 bit → «dañado» → se restaura → «íntegro» | ✅ |
| Libros reales | 27 PDF íntegros; búsqueda dentro de escaneos («perro nevado» → *Tradiciones y leyendas*, p. 10; «carabobo» → *Venezuela heroica*, p. 275); lector revisado con capturas con sesión (doble página, móvil) | ✅ (20/10) |
| `npm run prueba:historial` | Cambio de la bibliotecaria y cambio de rol registrados con nombre y JSON; nadie puede insertar, editar ni borrar entradas; un lector no puede leerlas | 7/7 ✅ (20/10) |
| `npm run prueba:digitalizar` | Imágenes → enderezar → OCR → PDF → publicar → buscar una palabra del OCR → eliminar | ✅ OCR al 89 % |
| `npm run prueba:pdf` | Subir un PDF existente → extraer su texto → buscar → eliminar | ✅ |

**Base de datos desde cero:** `supabase db reset` aplica las 6 migraciones sin errores y `npm run seed:libros` vuelve a cargar todo (20/10).

**Pruebas manuales (curl y capturas):**
- todas las páginas responden 200, o 302 cuando piden sesión;
- un lector no puede entrar a `/admin` y una bibliotecaria no puede entrar a `/admin/usuarios`;
- sin sesión, `/api/libros/:id/pdf` responde 401;
- revisión visual a 390, 1440, 1600, 1865 y 2560 px.

> [!todo] Falta
> - Revisar visualmente el lector y Mi cuenta (ya es posible capturar pantallas con sesión).
> - Medir con Lighthouse.
> - Pruebas automáticas de la interfaz.
