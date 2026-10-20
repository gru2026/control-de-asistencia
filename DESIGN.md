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
- Gráfica de tendencia: solo línea y área en SVG; ejes, promedio y globos en HTML (13 px); puntos por fecha real; 3 marcas en el eje Y.
- Marcación (celular): una sola superficie con el reloj grande (hora del servidor), la jornada y un botón de ancho completo según el momento (entrada primario, salida secundario). El escáner ocupa toda la pantalla en azul noche con el visor cuadrado; el resultado se muestra en grande (sello verde a tiempo, ámbar con retraso, rojo si no se registró) con la hora.
- Pestañas entre páginas hermanas (`Pestanas.astro`): enlaces con subrayado azul en la actual y contador ámbar opcional (Registro del día · Por revisar · Permisos; Planilla diaria · Resumen del período; avisos).
- Registro del día: cifras del día en línea (sin tarjetas), tabla con botón «Marcar» secundario por fila; el diálogo pide la hora solo si es contingencia.
- Barra superior: campana de avisos con contador rojo; en celular se oculta el avatar.
- Historial: calendario del mes con celdas cuadradas tintadas por estado (verde, ámbar, rojo, azul) y leyenda; hoy con contorno azul.
- Hoja de claves: tiras recortables con borde punteado (nombre, usuario = cédula, contraseña 0000 y 3 pasos), dos por fila al imprimir.
- Aviso de versión nueva: barra flotante azul noche con botón blanco «Actualizar», sobre la barra inferior en el celular.
- Puesta en marcha: lista numerada con ícono verde (listo) o ámbar (pendiente) y enlace a la pantalla de cada paso.
- Navegación de una sola página: barra y menú fijos; el contenido cambia con un fundido de 120 ms. Nada recarga la app.
- Ventanas (`ventanas.css`, clases `v-`): panel lateral a la derecha en la PC (28 rem) y desde abajo en el celular; ventana centrada para formularios cortos y confirmaciones. Cabecera con título y X, contenido con bloques separados por líneas, pie con la acción principal.
- Opciones como botones redondeados grandes (`.v-chips`): la elegida en azul noche. Se prefieren a listas desplegables para elegir entre pocas opciones.
- Mensajes de resultado: barra azul noche abajo (roja si es error), con «Deshacer» blanco cuando aplica.
- Panel de avisos: desde la campana; en el celular sube desde abajo sobre la barra inferior.
- Ficha por capas: pestañas (Resumen · Datos · Horario · Teléfono y cuenta · Estado); la elegida en azul noche.
- Botón «Acciones» en la barra superior (fondo translúcido, con texto en la PC): abre un mosaico de accesos con buscador de persona.
- Pantallas de una columna centradas en el espacio junto al menú (56 rem o 40 rem).
- Avisos dentro de una tarjeta: línea con ícono y texto (ámbar si es advertencia), nunca un recuadro, para no anidar superficies.
- Hoja del QR para imprimir: A4, nombre del plantel, título, QR de 120 mm con corrección alta y 3 pasos numerados.

## Motion

150–200 ms, curva de salida exponencial `cubic-bezier(0.16, 1, 0.3, 1)`. Solo para estados (hover, foco, diálogos, carga). Esqueletos al actualizar datos. Todo se desactiva con «reducir movimiento».

## Browser surfaces

Barras de desplazamiento finas con la paleta, cursor de texto azul, selección azul claro, `placeholder` en texto tenue, foco de 2 px en toda la app.
