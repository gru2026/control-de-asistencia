---
titulo: 4. Libros similares (TF-IDF)
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: algoritmos
estado: activo
fecha: 2026-10-19
tags: [emma-soler, algoritmos, cpp]
---

# 4. Libros similares (`cpp/src/similares.cpp`)

## Problema
Recomendar libros parecidos por lo que **dicen** sus textos, no solo por su categoría.

## Pasos
| Paso | Función | Fórmula |
|---|---|---|
| 1. Separar en palabras y quitar las vacías («de», «la», «que»…) | `tokenizar()` | — |
| 2. Frecuencia de la palabra en el libro | `calcularTF()` | TF = veces / total |
| 3. Rareza de la palabra en el catálogo | `calcularIDF()` | IDF = log(N / libros que la contienen) |
| 4. Vector del libro | `main()` | peso = TF × IDF |
| 5. Comparar dos libros | `similitudCoseno()` | cos = (A·B) / (‖A‖·‖B‖) |

```cpp
double similitudCoseno(const Vector& a, const Vector& b) {
    double producto = 0, normaA = 0, normaB = 0;
    for (const auto& [palabra, peso] : a) {
        normaA += peso * peso;
        auto it = b.find(palabra);
        if (it != b.end()) producto += peso * it->second;
    }
    for (const auto& [_, peso] : b) normaB += peso * peso;
    return producto / (std::sqrt(normaA) * std::sqrt(normaB));
}
```

**Por qué IDF:** «libertad» aparece en pocos libros y por eso identifica a los textos de Bolívar. «Tiempo» aparece en casi todos y no ayuda a distinguirlos.

## Entrada y salida
```json
{"libros": [{"id": "…", "texto": "titulo resumen autores etiquetas texto de las paginas…"}], "limite": 5}
→ {"similares": {"id-libro": [{"id": "otro", "puntuacion": 0.101}, …]}}
```

## Integración
- `recalcularSimilares()` en `algoritmos.mjs` arma el texto de cada libro publicado (título, resumen, autores, etiquetas y OCR) y guarda los resultados en la tabla `libros_similares`.
- Se ejecuta en la carga inicial y cada vez que se publica, edita o elimina un libro.
- La ficha del libro muestra «También te puede gustar» con la **similitud** de cada recomendado.

## Resultado real
| Libro | Más parecidos |
|---|---|
| Carta de Jamaica | Discurso de Angostura (0,101) · Manifiesto de Cartagena (0,099) · La Edad de Oro (0,096) |
| Cuentos de la selva | La Edad de Oro (0,070) · Vuelta a la patria (0,043) |

Los valores son bajos porque son textos distintos entre sí. Lo que importa es el **orden**: los textos de Bolívar quedan juntos.

**Complejidad:** O(N² × V), con N libros y V palabras distintas por libro. Con 16 libros tarda menos de 0,1 s.

---
← [[Biblioteca Emma Soler/05-Algoritmos-C++/Integracion-Node-C++|Integración Node ↔ C++]] · [[Biblioteca Emma Soler/00-Inicio/Inicio — MOC|Inicio]]
