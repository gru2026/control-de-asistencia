---
titulo: Roles y permisos
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: requisitos
estado: activo
fecha: 2026-10-20
tags: [emma-soler, requisitos]
---

# Roles y permisos

| Acción | Visitante | Lector | Bibliotecario | Administración |
|---|:-:|:-:|:-:|:-:|
| Ver el sitio institucional y el catálogo | ✅ | ✅ | ✅ | ✅ |
| Buscar y ver las fichas de los libros | ✅ | ✅ | ✅ | ✅ |
| Enviar mensajes de contacto y suscribirse al boletín | ✅ | ✅ | ✅ | ✅ |
| Leer PDF, guardar progreso, favoritos y reseñas | ❌ | ✅ | ✅ | ✅ |
| Digitalizar, editar el catálogo y ver estadísticas | ❌ | ❌ | ✅ | ✅ |
| Verificar la integridad y leer los mensajes | ❌ | ❌ | ✅ | ✅ |
| Consultar el historial de cambios | ❌ | ❌ | ✅ | ✅ |
| Modificar o borrar el historial | ❌ | ❌ | ❌ | ❌ |
| Cambiar los roles de los usuarios | ❌ | ❌ | ❌ | ✅ |

## Cómo se aplica
1. **Middleware** (`src/middleware.ts`): redirige a `/ingresar` o devuelve 401/403 según la ruta (`/admin`, `/admin/usuarios`, `/biblioteca/leer`, `/biblioteca/cuenta`, `/api/admin/*`).
2. **RLS en PostgreSQL:** aunque alguien saltara el middleware, la base de datos solo devuelve lo permitido. Ver [[Biblioteca Emma Soler/03-Diseno/Seguridad|Seguridad]].
3. **Disparador `proteger_rol`:** solo un administrador puede cambiar el campo `rol`.

## Alta de usuarios
- Los lectores se registran solos en `/registro`. Un disparador les crea su perfil con el rol `lector`.
- El rol de bibliotecario o administrador lo asigna la administración en `/admin/usuarios`.
