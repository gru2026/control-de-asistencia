---
titulo: 5. Integridad SHA-256
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: algoritmos
estado: activo
fecha: 2026-10-19
tags: [emma-soler, algoritmos, cpp]
---

# 5. Integridad de los PDF (`cpp/src/sha256.cpp`)

## Problema
Saber si un PDF guardado se **dañó o fue modificado**.

## SHA-256
Convierte cualquier archivo en una huella de 64 caracteres hexadecimales. Si cambia **1 bit** del archivo, la huella cambia por completo. Está implementado paso a paso según el estándar **FIPS 180-4**:

| Función | Qué hace |
|---|---|
| `rellenar()` | Agrega un bit 1, luego ceros, y la longitud original en 64 bits, hasta un múltiplo de 64 bytes |
| `procesarBloque()` | Expande el bloque a 64 palabras de 32 bits y aplica 64 rondas de mezcla (rotaciones, XOR, «elección», «mayoría» y sumas) |
| `rotarDerecha()` | `(x >> n) \| (x << (32 - n))` |
| `sha256()` | Estado inicial de 8 constantes, procesa todos los bloques y devuelve el resultado en hexadecimal |

```cpp
for (int i = 0; i < 64; i++) {
    uint32_t S1 = rotarDerecha(e, 6) ^ rotarDerecha(e, 11) ^ rotarDerecha(e, 25);
    uint32_t eleccion = (e & f) ^ (~e & g);
    uint32_t temp1 = h + S1 + eleccion + K[i] + w[i];
    uint32_t S0 = rotarDerecha(a, 2) ^ rotarDerecha(a, 13) ^ rotarDerecha(a, 22);
    uint32_t mayoria = (a & b) ^ (a & c) ^ (b & c);
    uint32_t temp2 = S0 + mayoria;
    h = g; g = f; f = e; e = d + temp1;
    d = c; c = b; b = a; a = temp1 + temp2;
}
```

## Entrada y salida
```json
{"archivos": ["/tmp/0.bin", "/tmp/1.bin"]}
→ {"resultados": [{"archivo": "/tmp/0.bin", "bytes": 70712, "hash": "3cd23ddde3b91326…c922be8f"}]}
```
`{"texto": "abc"}` también funciona, para las pruebas.

## Integración
- **Al guardar** (digitalizar, subir un PDF o la carga inicial): `sha256(bytes)` → `libros.pdf_sha256`, con `integridad = 'ok'`.
- **Al verificar** (`/admin/integridad`): `verificarIntegridad()` descarga los PDF, calcula todas las huellas con **una sola** ejecución de C++, las compara y marca cada libro como `ok`, `danado` o `faltante`.

## Verificación
- Vectores oficiales: `""` → `e3b0c442…` y `"abc"` → `ba7816bf…`, más un mensaje de 56 bytes que ocupa dos bloques.
- Da el mismo resultado que el comando `sha256sum` de Linux.
- `npm run prueba:integridad` cambia **1 bit** de *Carta de Jamaica* → «dañado» → lo restaura → «íntegro».

> [!tip] Demostración en clase
> Primero pulsar «Verificar todos» en el panel: todo sale íntegro. Después ejecutar `npm run prueba:integridad` en la terminal: muestra cómo un solo bit cambiado se detecta como «dañado» y cómo, al restaurar el original, vuelve a salir «íntegro».

Esto adelanta la parte de integridad del punto 8 de las mejoras propuestas.

---
← [[Biblioteca Emma Soler/05-Algoritmos-C++/Integracion-Node-C++|Integración Node ↔ C++]] · [[Biblioteca Emma Soler/00-Inicio/Inicio — MOC|Inicio]]
