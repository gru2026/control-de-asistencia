---
titulo: Historial de cambios (auditoría)
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: desarrollo
estado: activo
fecha: 2026-10-20
tags: [emma-soler, desarrollo, auditoria]
---

# Historial de cambios (auditoría)

Corresponde a la **mejora 7** de las propuestas: el sistema guarda quién cambió qué y cuándo.

## Qué se registra
| Tabla | Ejemplos |
|---|---|
| `libros` | Creación, cambio de estado (publicar), edición de datos, PDF nuevo, integridad dañada, eliminación |
| `autores`, `categorias` | Altas, ediciones y bajas |
| `perfiles` | Registro de usuarios, cambios de nombre y **de rol** |

Cada entrada guarda la **tabla**, el **registro**, la **acción** (crear, editar o eliminar), la **persona** y la **fecha**. Además, en `cambios` (JSONB), guarda solo los campos que cambiaron:

```json
{ "estado":       { "antes": "revision", "despues": "publicado" },
  "publicado_en": { "antes": null,       "despues": "2026-10-20T00:54:12Z" } }
```

## Cómo funciona
Lo hace **un solo disparador genérico**, `registrar_auditoria()`, que se aplica a las 4 tablas (migración `20261020000006_auditoria.sql`):

1. Convierte la fila anterior (`old`) y la nueva (`new`) a JSON con `to_jsonb()`.
2. Recorre todos los campos y guarda solo los que cambiaron (`is distinct from`).
3. Ignora los campos que cambian solos: `busqueda`, `actualizado_en`, `verificado_en` y `creado_en`. Si después de eso no cambió nada, **no registra la edición**. Así, por ejemplo, una verificación de integridad sin problemas no llena el historial.
4. Identifica a la persona con `auth.uid()` y busca su nombre en `perfiles`. Los procesos en segundo plano, como la digitalización o la carga inicial, aparecen como **«Sistema»**.

> [!tip] Por qué un disparador y no código en Node
> Así no se escapa ningún cambio: da igual si viene del panel, de la API, de un script o de Supabase Studio. La base de datos lo registra siempre.

## Seguridad: historial de solo agregar
- Solo el personal puede **leerlo** (RLS con `es_personal()`).
- **Nadie** puede insertar, editar ni borrar entradas desde la API (`revoke insert, update, delete`). Solo escribe el disparador, que es `security definer`.
- `npm run prueba:historial` lo comprueba: la bibliotecaria no puede borrar ni editar entradas, nadie puede insertar entradas falsas y un lector no ve nada.

## Dónde se ve
- **Panel → Historial** (`/admin/historial`):
  - filtros por tipo, acción, persona y fechas;
  - cada entrada se despliega y muestra una tabla con el antes (en rojo y tachado) y el después (en verde), además del JSON guardado;
  - paginación de 30 en 30;
  - **Exportar JSON** (`/api/admin/auditoria?formato=json`).
- **Edición de un libro:** al final está «Historial de este libro», con sus últimos 6 cambios.

## Ejemplo real (prueba de digitalización)
| Persona | Acción | Campos |
|---|---|---|
| María Rondón | Creó «Romancero de Cúa» | título, año, estado = escaneando… |
| Sistema | Editó | estado → revisión, PDF, páginas, huella SHA-256, portada |
| María Rondón | Editó | estado → publicado, fecha de publicación |
| María Rondón | Eliminó | todos los valores que tenía el libro |

## Archivos
- `supabase/migrations/20261020000006_auditoria.sql`: tabla, disparador y permisos.
- `src/lib/auditoria.ts`: consultas, filtros y nombres legibles de cada campo.
- `src/components/admin/ListaHistorial.astro`: la lista de cambios desplegable.
- `src/pages/admin/historial.astro` y `src/pages/api/admin/auditoria.ts`.
- `scripts/pruebas/prueba-historial.mjs`.

## Mejora posible
Un botón «Restaurar valores anteriores» que use el `antes` guardado. No se hizo porque deshacer cambios en cadena (por ejemplo, de un libro eliminado) necesita más cuidado.
