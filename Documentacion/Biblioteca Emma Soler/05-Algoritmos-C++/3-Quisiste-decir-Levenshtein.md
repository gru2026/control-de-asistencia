---
titulo: 3. ¿Quisiste decir? (Levenshtein)
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: algoritmos
estado: activo
fecha: 2026-10-19
tags: [emma-soler, algoritmos, cpp]
---

# 3. «¿Quisiste decir…?» (`cpp/src/sugerencias.cpp`)

## Problema
Si el lector escribe «bolibar», la búsqueda no encuentra nada.

## Distancia de Levenshtein
Es el número mínimo de **inserciones, borrados o sustituciones** de una letra para convertir una palabra en otra. Se calcula con **programación dinámica**: `tabla[i][j]` es la distancia entre las primeras `i` letras de `a` y las primeras `j` de `b`.

```cpp
int distanciaLevenshtein(const std::string& a, const std::string& b) {
    std::vector<std::vector<int>> tabla(a.size() + 1, std::vector<int>(b.size() + 1));
    for (size_t i = 0; i <= a.size(); i++) tabla[i][0] = i;   // borrar
    for (size_t j = 0; j <= b.size(); j++) tabla[0][j] = j;   // insertar
    for (size_t i = 1; i <= a.size(); i++)
        for (size_t j = 1; j <= b.size(); j++) {
            int costo = (a[i - 1] == b[j - 1]) ? 0 : 1;
            tabla[i][j] = std::min({ tabla[i-1][j] + 1, tabla[i][j-1] + 1, tabla[i-1][j-1] + costo });
        }
    return tabla[a.size()][b.size()];
}
```

Ejemplo: «bolibar» → «bolivar». Solo cambia la b por la v, así que la distancia es 1 y la similitud es 1 − 1/7 = **0,86**.

## Dos estrategias
| Función | Estrategia | Ejemplo |
|---|---|---|
| `compararFrases()` | La búsqueda completa contra cada título y autor | «carta de jamaika» → *Carta de Jamaica* |
| `corregirPalabras()` | Cada palabra contra el vocabulario del catálogo | «silba criola» → *silva criolla* |

`main()` junta ambas, ordena por similitud y devuelve hasta 3 sugerencias con similitud de 0,6 o más.

## Entrada y salida
```json
{"consulta": "bolibar",
 "frases": [{"clave": "simon bolivar", "texto": "Simón Bolívar"}],
 "vocabulario": [{"clave": "bolivar", "texto": "bolívar"}]}
→ {"sugerencias": [{"texto": "bolívar", "similitud": 0.86}]}
```
Node normaliza la `clave` (sin tildes ni mayúsculas) y C++ compara texto ASCII. El `texto` conserva las tildes para mostrarlo al lector.

## Dónde se ve
- `/biblioteca/catalogo?q=bolibar` muestra «¿Quisiste decir *bolívar*?».
- El buscador superior (`/api/buscar`) muestra la sugerencia en la lista desplegable.

**Complejidad:** O(n × m) por comparación.

---
← [[Biblioteca Emma Soler/05-Algoritmos-C++/Integracion-Node-C++|Integración Node ↔ C++]] · [[Biblioteca Emma Soler/00-Inicio/Inicio — MOC|Inicio]]
