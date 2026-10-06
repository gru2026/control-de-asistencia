---
titulo: Cómo exportar a Google Docs y PDF
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: instrucciones
estado: activo
fecha: 2026-10-01
---

# 📤 Cómo exportar la documentación

## Opción A — Google Docs (recomendada) + PDF

1. **Regenerar** el documento consolidado (se hace solo al crear/editar notas):

   ```bash
   cd Documentacion/90-Export
   node generar-consolidado.mjs
   ```

2. **Generar el Word (.docx):**

   ```bash
   pandoc Documento-consolidado.md -o Documento-Asistencia-UEN.docx \
     --toc --toc-depth=2 \
     -V lang=es
   ```

3. **Subir a Google Drive:** arrastrar `Documento-Asistencia-UEN.docx` a Drive.
4. **Convertir:** clic derecho → *Abrir con → Google Documentos* (Drive lo convierte conservando títulos, tablas y listas).
5. **Compartir:** *Compartir* → copiar enlace → permiso "Cualquier persona con el enlace = Lector" (o invitar por correo a los compañeros).
6. **PDF desde Google Docs:** *Archivo → Descargar → Documento PDF (*.pdf)*.

## Opción B — PDF directo desde la terminal (si Pandoc tiene motor de PDF)

```bash
pandoc Documento-consolidado.md -o Documento-Asistencia-UEN.pdf --toc
```

> Requiere un motor PDF (LaTeX o wkhtmltopdf). Si no está instalado, usar la **Opción A** (el PDF de Google Docs sale con mejor formato).

## Opción C — PDF desde Obsidian

Abrir `Documento-consolidado.md` en Obsidian → *Exportar a PDF* (menú de la nota). Bueno para una vista rápida; las tablas largas salen mejor con la Opción A.

## Archivos

| Archivo | Para qué |
|---|---|
| `Documento-consolidado.md` | Fuente única (se regenera con el script) |
| `generar-consolidado.mjs` | Script que arma el consolidado |
| `Documento-Asistencia-UEN.docx` | Para Google Docs / Word |
| `Documento-Asistencia-UEN.pdf` | Versión final para compartir |

> [!nota] Mantenimiento
> Al actualizar cualquier nota del vault, volver a correr `generar-consolidado.mjs` y reexportar. El `.docx`/`.pdf` son **derivados**: la fuente de verdad son las notas.
