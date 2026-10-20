---
titulo: Integración Node ↔ C++
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: algoritmos
estado: activo
fecha: 2026-10-19
tags: [emma-soler, algoritmos, cpp]
---

# Algoritmos en C++: integración con el sitio

## La idea en una frase
Cada algoritmo es un **programa C++ independiente**. Node le envía los datos en **JSON por la entrada estándar** y lee la respuesta en **JSON por la salida estándar**.

```
Astro (Node.js)                                  cpp/bin/sugerencias
────────────────                                 ───────────────────
ejecutarCpp('sugerencias', datos) ── stdin ──►  leerEntrada()  → json
                                                 algoritmo (Levenshtein)
          resultado (objeto JS)  ◄── stdout ──  responder(json)
```

## Por qué así (opción A)
| Opción | Se descartó porque… |
|---|---|
| Addon nativo de Node (node-gyp) | Necesita Python y se rompe con facilidad al compilar |
| WebAssembly (Emscripten) | Hay que instalar más de 1 GB de herramientas y no aporta nada |
| **Ejecutables con JSON** ✅ | Solo necesita g++ y make. Cada programa se prueba desde la terminal. Además cumple otra vez el requisito de JSON |

## Piezas
| Archivo | Rol |
|---|---|
| `cpp/include/comun.hpp` | `leerEntrada()`, `responder()` y `ejecutar()`, que convierte las excepciones en `{"error": …}` |
| `cpp/include/json.hpp` | Biblioteca nlohmann/json (un solo archivo, licencia MIT) |
| `cpp/Makefile` | `g++ -std=c++17 -O2 -Wall -Wextra` → `cpp/bin/` |
| `src/lib/compartido/cpp.mjs` | `ejecutarCpp(programa, entrada)` con `child_process.spawn` y un límite de 60 s, y `normalizar()`, que quita tildes y mayúsculas |
| `src/lib/compartido/algoritmos.mjs` | Prepara los datos de cada algoritmo: consultas y archivos temporales |

## Esqueleto común de un programa
```cpp
#include "comun.hpp"

int main() {
    return ejecutar([](const json& entrada) {
        std::string consulta = entrada.at("consulta");
        // … algoritmo …
        return json{{"sugerencias", resultado}};
    });
}
```

## Los 4 algoritmos
| # | Programa | Técnica | Dónde se ve |
|---|---|---|---|
| 1 | [[Biblioteca Emma Soler/05-Algoritmos-C++/1-Enderezar-paginas|enderezar]] | Perfil de proyección y varianza | Asistente de digitalización |
| 3 | [[Biblioteca Emma Soler/05-Algoritmos-C++/3-Quisiste-decir-Levenshtein|sugerencias]] | Distancia de Levenshtein (programación dinámica) | Catálogo y buscador superior |
| 4 | [[Biblioteca Emma Soler/05-Algoritmos-C++/4-Libros-similares-TF-IDF|similares]] | TF-IDF + similitud del coseno | Ficha del libro |
| 5 | [[Biblioteca Emma Soler/05-Algoritmos-C++/5-Integridad-SHA-256|sha256]] | SHA-256 (FIPS 180-4) | Panel → Integridad |

La numeración sigue la propuesta original de algoritmos; la opción 2 (binarización de Otsu) no se eligió.

## Probar desde la terminal
```bash
npm run build:cpp
echo '{"texto":"abc"}' | cpp/bin/sha256
# {"resultados":[{"hash":"ba7816bf…20015ad","texto":"abc"}]}
npm run test:cpp     # 14 pruebas
```
