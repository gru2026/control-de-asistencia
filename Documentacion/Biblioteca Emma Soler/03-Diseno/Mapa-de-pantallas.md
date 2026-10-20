---
titulo: Mapa de pantallas
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: diseno
estado: activo
fecha: 2026-10-19
tags: [emma-soler, diseno]
---

# Mapa de pantallas

| Ruta | Acceso | Tipo | Descripción |
|---|---|---|---|
| `/` | Público | Estática + islas | Inicio (referencia `app.webp`) |
| `/nosotros` | Público | Estática | Historia y Emma Soler |
| `/servicios` | Público | Estática | Servicios |
| `/coleccion-local` | Público | Estática | Cúa, la Perla del Tuy |
| `/eventos`, `/eventos/[id]` | Público | Estática | Agenda |
| `/noticias`, `/noticias/[id]` | Público | Estática | Noticias |
| `/preguntas-frecuentes` | Público | Estática | Preguntas frecuentes |
| `/contacto` | Público | Estática | Formulario y datos |
| `/creditos` | Público | Estática | Licencias de las fotos y los textos |
| `/ingresar`, `/registro` | Público | Servidor | Inicio de sesión y registro |
| `/biblioteca` | Público | Servidor | Vitrina (referencia `1.jpg`) |
| `/biblioteca/catalogo` | Público | Servidor | Búsqueda y filtros |
| `/biblioteca/libro/[slug]` | Público | Servidor | Ficha del libro |
| `/biblioteca/leer/[slug]` | Con sesión | Servidor | Lector PDF |
| `/biblioteca/cuenta` | Con sesión | Servidor | Mi cuenta |
| `/admin` | Personal | Servidor | Resumen y estadísticas |
| `/admin/digitalizar` | Personal | Servidor | Asistente de digitalización |
| `/admin/libros`, `/admin/libros/[id]`, `/admin/libros/nuevo` | Personal | Servidor | Gestión de libros |
| `/admin/catalogo` | Personal | Servidor | Categorías y autores |
| `/admin/integridad` | Personal | Servidor | Verificación SHA-256 |
| `/admin/mensajes` | Personal | Servidor | Contacto y suscriptores |
| `/admin/usuarios` | Administración | Servidor | Roles |
| `/media/portadas/*` | Público | Servidor | Entrega las portadas desde Storage |

Los endpoints de `/api/*` están en [[Biblioteca Emma Soler/04-Desarrollo/API|API]].
