# Design

Sistema visual de GRU-system. Fuente de verdad de los valores: `src/styles/tokens.css`.
Modo: **Operate** (interfaz de trabajo). Refinamiento hecho con la skill Impeccable.
Revisión automática: `npm run diseno:revisar` (debe terminar sin hallazgos).

## Type

- **Familia única:** Onest (variable 100–900), autoalojada, solo subconjunto latino (34 KB). Respaldo con métricas ajustadas a Arial (`size-adjust 105.65%`) para que el texto no salte al cargar.
- **Escala fija** (rem, proporción ~1.2):

| Rol | Tamaño | Peso |
|---|---|---|
| Cifra principal del panel | 40 px | 650, tracking −0.03em |
| Título de página | 28 px (26 px en celular) | 650, tracking −0.018em |
| Cifras secundarias | 22 px | 650 |
| Título de tarjeta / gráfica | 18 px | 600 |
| Cuerpo | 16 px | 400, interlineado 1.55 |
| Etiquetas, tablas, ayudas | 14 px | 500 / 400 |
| Metadatos, ejes, `<small>` | 13 px (mínimo absoluto) | 400–600 |

- Números en tablas, horas e indicadores con cifras tabulares.
- Mayúsculas solo en la réplica de la planilla oficial; el resto en tipo oración.

## Color

| Rol | Valor |
|---|---|
| Marca / acción principal | `#0f172a` (hover `#1e293b`) |
| Acento (acciones, selección, estado) | `#2563eb`; como texto sobre tinte `#1d4ed8` |
| Lienzo del contenido | `#f6f8fb` |
| Capa lateral (navegación) | `#eef2f7` |
| Superficie | `#ffffff` · zona hundida `#f8fafc` |
| Bordes | `#e2e8f0` · fuerte `#cbd5e1` |
| Texto | `#0f172a` · suave `#475569` · tenue `#64748b` (solo ≥ 13 px) |
| Presente / Tarde / Falta / Permiso | `#15803d` / `#b45309` / `#b91c1c` / `#475569`, cada uno con su fondo suave |

Categorías del personal: color propio configurable; el texto sobre su tinte se oscurece al 65 % para mantener contraste. Paleta slate/blue diseñada en OKLCH y entregada en hex por compatibilidad.

## Space

Base 4 px: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48`.
Ritmo: dentro de un grupo 6–12 px; entre controles 16 px; entre bloques 32 px (`--separacion-bloques`). Más espacio sobre un título que debajo.

## Shape & depth

- Radios: controles 8 px · tarjetas 12 px · diálogos y login 16 px · etiquetas en píldora.
- **Una superficie usa borde o sombra, nunca ambos.** Tarjetas: borde, sin sombra. Lo que flota (diálogos, login, ítem activo del menú, hoja de la planilla, barra inferior): sombra con desplazamiento y desenfoque suave.
- Sin bordes laterales de color, sin tarjetas dentro de tarjetas: las tablas llegan al borde de su tarjeta; las filas en celular se separan con líneas.

## Components

- Botones: primario (azul noche), secundario (borde), peligro, fantasma. 44 px de alto; 36 px el pequeño. Presionar desplaza 1 px.
- Campos: 48 px, borde `#cbd5e1`, foco con anillo azul de 3 px. Etiqueta visible siempre.
- Tablas: encabezado en zona hundida, ordenables, en celular como lista.
- Navegación: barra superior azul noche; lateral en capa neutra con el ítem actual como superficie blanca; barra inferior translúcida en celular.
- Panel en tres niveles: Hoy y 4 indicadores (detalle en tooltip) · «Requiere atención» (lista de pendientes con enlace) · Análisis en secciones plegables con la conclusión en el título.
- Columna lateral del panel (≥ 1400 px, fija al desplazarse; en laptops y celular va entre «Requiere atención» y el análisis): calendario coloreado por asistencia (≥ 95 % verde · 85–94 % ámbar · < 85 % rojo), llegadas de hoy por categoría y ausentes de la semana con el próximo feriado.
- Secciones plegables (`Seccion.astro`): `<details>` nativo, estado recordado por navegador.

## Motion

150–200 ms, curva de salida exponencial `cubic-bezier(0.16, 1, 0.3, 1)`. Solo para estados (hover, foco, diálogos, carga). Esqueletos al actualizar datos. Todo se desactiva con «reducir movimiento».

## Browser surfaces

Barras de desplazamiento finas con la paleta, cursor de texto azul, selección azul claro, `placeholder` en texto tenue, foco de 2 px en toda la app.
