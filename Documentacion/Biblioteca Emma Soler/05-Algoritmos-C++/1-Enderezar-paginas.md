---
titulo: 1. Enderezar páginas
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: algoritmos
estado: activo
fecha: 2026-10-20
tags: [emma-soler, algoritmos, cpp]
---

# 1. Enderezar páginas (`cpp/src/enderezar.cpp`)

## Problema
Una página fotografiada con el teléfono suele quedar un poco torcida, y el OCR la reconoce peor.

## Idea: perfil de proyección
Se suma la **tinta** (los píxeles oscuros) de cada **fila**:
- **Texto derecho:** filas muy oscuras (las líneas) alternan con filas vacías (el espacio entre líneas). Las sumas son muy dispares, así que la **varianza es alta**.
- **Texto inclinado:** la tinta se reparte entre muchas filas y las sumas se parecen, así que la varianza es baja.

Se prueban ángulos entre −8° y +8° y se elige **el de mayor varianza**.

```
derecho                     inclinado
████████████  ← 980         ██████        ← 410
                ← 0           ██████      ← 430
████████████  ← 975             ██████    ← 420
varianza alta                varianza baja
```

## Funciones
| Función | Qué hace |
|---|---|
| `leerPGM()` | Lee la imagen PGM: cabecera `P5 ancho alto 255` y 1 byte por píxel |
| `calcularUmbral()` | Punto medio entre el tono promedio y el 1 % más oscuro, para que un fondo gris o la mesa no cuenten como tinta |
| `puntosDeTinta()` | Píxeles oscuros como coordenadas (x, y) medidas desde el centro |
| `perfilProyeccion()` | Gira cada punto (`y' = x·sen θ + y·cos θ`) y cuenta los puntos de cada fila |
| `varianza()` | Varianza de las cuentas |
| `mejorAngulo()` | Búsqueda gruesa de 1° en 1° y luego fina de 0,25° en 0,25° |

```cpp
// Versión resumida; la completa está en cpp/src/enderezar.cpp
std::vector<int> perfilProyeccion(const std::vector<Punto>& puntos, double grados, int alto) {
    double rad = grados * PI / 180.0;
    double seno = std::sin(rad), coseno = std::cos(rad);
    std::vector<int> filas(alto * 3, 0);
    for (const Punto& p : puntos) {
        int fila = int(std::lround(p.x * seno + p.y * coseno)) + alto / 2 + alto;
        if (fila >= 0 && fila < int(filas.size())) filas[fila]++;
    }
    return filas;
}
```

## Protección contra falsos positivos (agregada el 20/10)
Con libros reales escaneados, las páginas casi en blanco (portadillas o páginas con una sola línea) se «enderezaban» 3° o 5° por error. Ahora:
- si hay **menos de 2000 píxeles de tinta**, no se corrige;
- se calcula `mejora = varianza(ángulo elegido) / varianza(0°)`; si es **menor a 1,15** (menos del 15 % de mejora), la inclinación se considera ruido y se devuelve 0.

En las 154 páginas reales de prueba no hubo ningún giro falso, y las pruebas sintéticas siguen detectando el ángulo exacto.

## Entrada y salida
```json
// entrada
{"imagen": "/tmp/pagina.pgm", "minimo": -8, "maximo": 8, "paso": 0.25}
// salida
{"angulo": -3.0, "mejora": 3.4, "ancho": 1000, "alto": 1414, "umbral": 140, "pixelesTinta": 51234}
```
`angulo` es lo que hay que girar la imagen; el valor positivo es en el sentido de las agujas del reloj. Después, sharp la gira con `rotate(angulo)`.

## Integración
- `calcularInclinacion()` en `algoritmos.mjs` reduce la imagen a 1000 px de ancho en escala de grises, la guarda en PGM y llama a C++.
- `procesarImagen()` en `digitalizacion.ts` solo corrige la página si la inclinación es de 0,25° o más.

## Complejidad y resultados
- **Complejidad:** O(P × A), donde P son los píxeles de tinta y A unos 25 ángulos. Tarda unos 0,2 s por página.
- `npm run prueba:enderezar`: detecta exactamente 3°, −4°, 1,5° y −2,25°.
- En una página girada 6°, la confianza del OCR sube del 88 % al 95 %.
- Tesseract ya tolera inclinaciones pequeñas, así que la mejora se nota a partir de unos 5°.

---
← [[Biblioteca Emma Soler/05-Algoritmos-C++/Integracion-Node-C++|Integración Node ↔ C++]] · [[Biblioteca Emma Soler/00-Inicio/Inicio — MOC|Inicio]]
