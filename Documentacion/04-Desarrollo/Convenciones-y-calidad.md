---
titulo: Convenciones y calidad
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: desarrollo
estado: activo
fecha: 2026-10-01
---

# Convenciones y Calidad

## Código

- **TypeScript estricto** en todo el proyecto (sin `any` sin justificación).
- **ESLint + Prettier**: formateo automático al guardar; CI bloquea errores de lint.
- **CSS puro**: variables en `styles/tokens.css`; CSS scoped de Astro por componente.
  - Colores semánticos: `--color-exito`, `--color-alerta`, `--color-error`, `--color-info`.
  - Nada de valores mágicos: todo pasa por tokens.
- Nombres en **español** para archivos/pantallas orientados al usuario; identificadores internos en inglés si se prefiere — **elegir uno y mantenerlo**.

## Componentes

- Primero buscar en `components/ui/` antes de crear uno nuevo.
- Un componente = un archivo; lógica compleja → `lib/`.
- `lib/reglas/` es **puro**: sin fetch, sin DOM, sin Supabase.

## Ramas y commits (Convención Conventional Commits)

```
main          ← siempre desplegable
 └─ feat/asistencia-marcaje
 └─ fix/reporte-fechas
 └─ docs/manual-usuario
 └─ chore/config-eslint
```

Tipos: `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore`.

Ejemplos:
```
feat: marcación de entrada con hora del servidor
fix: cálculo de horas descuenta pausa mal
docs: agrega manual de usuario
test: casos de tardanza con tolerancia 15 min
```

## Pruebas

- **Unitarias (Vitest)** para `lib/reglas/`: estados, cálculo de horas, acumulados. Obligatorio en Semana 2.
- **Checklist manual** por pantalla (ver [[05-Entregables/Plan-de-pruebas]]).
- Criterio de "terminado": lint ✅ + tests ✅ + probado en móvil ✅.

## Calidad de interfaz

- **Mobile-first**: diseñar a 360 px primero, luego subir.
- Contraste mínimo WCAG AA; etiquetas en todos los formularios.
- Estados vacíos amigables ("Aún no hay registros hoy").
- Mensajes de error claros en español, sin tecnicismos.

## Seguridad (checklist permanente)

- [ ] Nada de claves en el repo (`.env.local` ignorado).
- [ ] Toda ruta privada protegida por `middleware.ts`.
- [ ] Toda tabla con políticas RLS (nunca "RLS off").
- [ ] Hora de marcación tomada del servidor.
- [ ] Datos personales solo visibles a roles autorizados.

## Documentación

- Este vault se actualiza cuando cambia diseño/alcance.
- `README.md` en el repo con: qué es, cómo correrlo, cómo desplegarlo.
- Las respuestas del colegio se trasladan de [[00-Inicio/Preguntas-para-el-colegio]] a la nota correspondiente.

## Rendimiento

- Imágenes comprimidas (iconos ≤ 50 KB, maskable incluida).
- JS mínimo en el navegador: cargar por `client:*` de Astro solo donde hay interactividad.
- Meta tags y `og:` listos (ver [[05-Entregables/Presentacion-del-proyecto]] si se comparte enlazando).
