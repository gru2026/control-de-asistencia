---
titulo: Inicio — Mapa de Contenidos
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: MOC
estado: activo
fecha: 2026-10-20
tags: [emma-soler, MOC]
---

# Biblioteca Pública Emma Soler — Mapa de Contenidos

Documentación del proyecto **Biblioteca Pública Emma Soler**: sitio institucional y biblioteca digital de una biblioteca del casco central de Cúa (estado Miranda, Venezuela). El personal digitaliza libros físicos a PDF y el público los lee en línea.

> [!info] Cómo usar esta documentación
> - Si eres nuevo en el proyecto, empieza por el [[Biblioteca Emma Soler/00-Inicio/Resumen ejecutivo|Resumen ejecutivo]].
> - Para levantarlo en tu equipo, ve a [[Biblioteca Emma Soler/04-Desarrollo/Puesta-en-marcha|Puesta en marcha]].
> - Para preparar la defensa, revisa [[Biblioteca Emma Soler/05-Algoritmos-C++/Integracion-Node-C++|Algoritmos en C++]] y el [[Biblioteca Emma Soler/06-Entregables/Guion-de-presentacion|Guion de presentación]].

> [!warning] Proyecto académico
> La biografía de Emma Soler, la dirección, el teléfono y las redes sociales son **ficticios**. Los datos históricos de Cúa vienen de Wikipedia y las fotos de Wikimedia Commons.

---

## 00 · Inicio
- [[Biblioteca Emma Soler/00-Inicio/Resumen ejecutivo|Resumen ejecutivo]]: el proyecto en una página
- [[Biblioteca Emma Soler/00-Inicio/Glosario|Glosario]]: OCR, RLS, TF-IDF, isla de servidor…

## 01 · Proyecto
- [[Biblioteca Emma Soler/01-Proyecto/Contexto-y-objetivos|Contexto y objetivos]]: la biblioteca, Cúa y las 8 mejoras propuestas

## 02 · Requisitos
- [[Biblioteca Emma Soler/02-Requisitos/Funcionalidades|Funcionalidades]]: qué hace el sitio, sección por sección
- [[Biblioteca Emma Soler/02-Requisitos/Roles-y-permisos|Roles y permisos]]: visitante, lector, bibliotecario y administración

## 03 · Diseño
- [[Biblioteca Emma Soler/03-Diseno/Arquitectura-y-stack|Arquitectura y stack]]: Astro, Supabase, Docker y C++
- [[Biblioteca Emma Soler/03-Diseno/Modelo-de-datos|Modelo de datos]]: tablas, funciones SQL y almacenamiento
- [[Biblioteca Emma Soler/03-Diseno/Mapa-de-pantallas|Mapa de pantallas]]: todas las rutas y quién puede entrar
- [[Biblioteca Emma Soler/03-Diseno/Identidad-visual|Identidad visual]]: paleta «Sol», tipografías y animaciones
- [[Biblioteca Emma Soler/03-Diseno/Uso-de-JSON|Uso de JSON]]: dónde y por qué (requisito de la materia)
- [[Biblioteca Emma Soler/03-Diseno/Seguridad|Seguridad]]: RLS, middleware y archivos privados
- [[Biblioteca Emma Soler/03-Diseno/Registro-de-decisiones|Registro de decisiones]]: lo que se acordó y por qué

## 04 · Desarrollo
- [[Biblioteca Emma Soler/04-Desarrollo/Puesta-en-marcha|Puesta en marcha]]: instalación, comandos y cuentas de prueba
- [[Biblioteca Emma Soler/04-Desarrollo/Estructura-de-carpetas|Estructura de carpetas]]
- [[Biblioteca Emma Soler/04-Desarrollo/API|API]]: endpoints JSON
- [[Biblioteca Emma Soler/04-Desarrollo/Flujo-de-digitalizacion|Flujo de digitalización]]: de las fotos al PDF con OCR
- [[Biblioteca Emma Soler/04-Desarrollo/Busqueda|Búsqueda]]: texto completo, tildes, errores de escritura
- [[Biblioteca Emma Soler/04-Desarrollo/Historial-de-cambios|Historial de cambios]]: auditoría de quién cambió qué
- [[Biblioteca Emma Soler/04-Desarrollo/Pruebas|Pruebas]]: qué se probó y cómo repetirlo

## 05 · Algoritmos en C++
- [[Biblioteca Emma Soler/05-Algoritmos-C++/Integracion-Node-C++|Integración Node ↔ C++]]: cómo se comunican
- [[Biblioteca Emma Soler/05-Algoritmos-C++/1-Enderezar-paginas|1. Enderezar páginas]]: perfil de proyección
- [[Biblioteca Emma Soler/05-Algoritmos-C++/3-Quisiste-decir-Levenshtein|3. «¿Quisiste decir…?»]]: distancia de Levenshtein
- [[Biblioteca Emma Soler/05-Algoritmos-C++/4-Libros-similares-TF-IDF|4. Libros similares]]: TF-IDF y similitud del coseno
- [[Biblioteca Emma Soler/05-Algoritmos-C++/5-Integridad-SHA-256|5. Integridad SHA-256]]: huella de los PDF

## 06 · Entregables
- [[Biblioteca Emma Soler/06-Entregables/Manual-de-usuario|Manual de usuario]]: para lectores y para el personal
- [[Biblioteca Emma Soler/06-Entregables/Guion-de-presentacion|Guion de presentación]]: demostración paso a paso para el profesor

## 07 · Pendientes
- [[Biblioteca Emma Soler/07-Pendientes/Proximas-etapas|Próximas etapas y pendientes]]
