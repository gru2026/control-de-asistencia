---
titulo: PWA y modo offline
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: diseno
estado: activo
fecha: 2026-10-06
---

# PWA y Modo Offline

> [!important] Alcance v1 (decisión [[03-Diseno/Registro-de-decisiones|D-09]])
> La app **se instala** y **abre sin internet**, pero **marcar requiere conexión** (la validación de QR, GPS y hora ocurre en el servidor). La marcación offline real queda para **v2**.

## ¿Por qué PWA?

- Se **instala** en el celular del personal (ícono, pantalla completa, sin tiendas).
- Acceso a **cámara** (escáner QR) y **GPS** desde el navegador (requiere HTTPS).
- Abre al instante gracias a la caché, incluso con señal débil.
- Distribución sencilla: un enlace o QR de instalación.

## Componentes

### 1. `manifest.webmanifest`

```json
{
  "name": "Control de Asistencia — U.E.E. Gral. Rafael Urdaneta",
  "short_name": "Asistencia UEN",
  "start_url": "/asistencia",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "lang": "es",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### 2. Service Worker propio (`public/sw.js`)

| Recurso | Estrategia | Detalle |
|---|---|---|
| App shell (CSS/JS/iconos/fuentes) | **Cache first** + actualización en segundo plano | Abre al instante |
| Páginas HTML | **Network first** con fallback a caché / página "Sin conexión" | Siempre datos frescos si hay red |
| `/api/*` (marcación, datos) | **Solo red** (no se cachea) | Nunca se muestra una confirmación falsa |

**Ciclo de vida:** `install` precachea el shell → `activate` limpia cachés de versiones viejas → el cliente detecta nueva versión y muestra *"Hay una actualización, recargar"*.

### 3. Comportamiento sin conexión

```
Usuario toca "Marcar entrada"
  ├─ navigator.onLine = false  → mensaje: "Sin conexión. Conéctese para marcar
  │                               o diríjase a secretaría." (no se guarda nada)
  └─ online → pide GPS → escanea QR → POST /api/marcacion
                 ├─ respuesta OK  → confirmación
                 └─ falla de red  → "No se pudo enviar. Intente de nuevo."
                                    (reintentar es seguro: el servidor rechaza duplicados)
```

**Contingencia (cae el internet del colegio):** secretaría registra luego desde el PC con observación *"falla de conexión"* (`metodo = manual`).

### 4. Escáner QR y GPS

- Escáner: API `BarcodeDetector` donde exista (Chrome Android) y librería ligera de respaldo (ej. `jsQR`) para iOS/otros.
- Solo cámara **en vivo**; no se permite subir imágenes.
- GPS: `navigator.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 })`. Se envían `lat`, `lng` y `accuracy`; **el servidor decide**.
- El permiso de cámara/ubicación se pide en el primer uso, con una pantalla previa explicando por qué.

### 5. Identificador de dispositivo

- Al primer login se genera un `dispositivo_uid` (uuid) guardado en `localStorage` + IndexedDB.
- Se envía en cada marcación; el servidor comprueba que esté **aprobado** ([[03-Diseno/Reglas-de-negocio|R11]]).

## Instalabilidad

- Meta tags en `BaseLayout`: `theme-color`, `apple-mobile-web-app-capable`, link al manifest, `apple-touch-icon`.
- Íconos **maskable** para Android.

> [!warning] iPhone: usar siempre la app instalada
> En iOS, Safari y la app instalada tienen almacenamiento separado: abrir en Safari se ve como **otro teléfono** (requeriría nueva aprobación). El manual lo explica.

## Pruebas (checklist)

- [ ] "Instalar app" aparece en Chrome Android y "Agregar a inicio" funciona en Safari iOS.
- [ ] Sin datos → la app abre desde el ícono y muestra "Sin conexión" al intentar marcar.
- [ ] Cámara y GPS funcionan en la app instalada (Android e iOS).
- [ ] Con red intermitente, reintentar no duplica la marcación.
- [ ] Al publicar una versión nueva aparece el aviso de actualización.

## v2 — Marcación offline (futuro)

Guardar en IndexedDB `{ id_unico, codigo_qr, lat, lng, precision, hora_telefono, dispositivo_uid }` y enviarlo al reconectar; el servidor valida QR/GPS, usa la hora del teléfono y marca el registro como **señalado** para revisión. Requiere ampliar el modelo (`sincronizado_desde`, `id_unico`).

## Límites conocidos

- Login requiere conexión.
- Notificaciones push: **no** en v1 (solo in-app).
- iOS: validar cámara/GPS dentro de la app instalada en Semana 4.

Ver: [[03-Diseno/Arquitectura-y-stack|Arquitectura]] · [[02-Requisitos/Requisitos-no-funcionales|RNF]]
