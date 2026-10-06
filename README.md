# Asistencia UEN

PWA de control de asistencia del personal docente y administrativo de la **U.E.E. General Rafael Urdaneta** (proyecto de servicio comunitario).

- Marcación desde el celular con **QR impreso + GPS + hora del servidor**.
- **PC del colegio** para administración y respaldo (marcación asistida y kiosco con PIN).
- Jornadas y tolerancias **configurables**; reportes PDF/Excel.

Documentación completa (vault de Obsidian): [`Documentacion/`](Documentacion/00-Inicio/Inicio%20—%20MOC.md) · decisiones en [`Registro-de-decisiones`](Documentacion/03-Diseno/Registro-de-decisiones.md).

## Stack

Astro (SSR) + TypeScript · CSS puro · Supabase (Postgres, Auth, RLS) · Vercel · Vitest.

## Desarrollo

```bash
npm install
cp .env.example .env         # completar claves de Supabase
npm run db:migrar            # aplica supabase/migrations pendientes
npm run dev                  # http://localhost:4321
```

| Comando          | Qué hace                                              |
| ---------------- | ----------------------------------------------------- |
| `npm run dev`    | Servidor de desarrollo                                |
| `npm run build`  | Build de producción                                   |
| `npm run check`  | Verificación de tipos (Astro + TS)                    |
| `npm run lint`   | ESLint                                                |
| `npm run format` | Prettier                                              |
| `npm test`       | Pruebas de reglas de negocio (Vitest)                 |
| `npm run docs` | Regenera el documento consolidado de la documentación |
| `npm run db:migrar` | Aplica las migraciones pendientes (API de gestión de Supabase) |
| `npm run db:seed` | Ejecuta `supabase/seed.sql` |
| `npm run db:sql -- "select 1"` | Ejecuta una consulta suelta |
| `npm run crear-usuario -- <email> <rol> <nombre> <apellido> [clave]` | Crea una cuenta (ej. el primer administrador) |

## Base de datos

Las migraciones están en `supabase/migrations/` y se registran en `interno.migraciones`
(no se reaplican). **Nunca editar una migración ya aplicada**: crear una nueva (`005_...sql`).

Primer administrador del colegio:

```bash
npm run crear-usuario -- correo@colegio.com directiva Nombre Apellido
```

## Estructura

```
src/middleware.ts sesión + roles + redirecciones
src/lib/reglas/   reglas de negocio puras (R0–R10) — sin UI, red ni BD
src/lib/auth/     reglas de acceso por ruta y rol (puras, probadas)
src/lib/validacion/ validación de formularios (pura, probada)
src/lib/servicios/  operaciones con la BD (cuentas, personal)
src/components/ui/  Boton, Tarjeta, Tabla, Input, Select, Modal, Badge, Alerta, Paginacion
tests/            pruebas unitarias (Vitest)
scripts/          db.mjs (migraciones), crear-usuario.mjs
supabase/         migraciones SQL + seed
Documentacion/    vault de Obsidian (fuente de verdad del diseño)
```

## Seguridad

- `.env` y `Documentacion/_privado/` están en `.gitignore`: **nunca** subir claves ni credenciales.
- Las variables secretas se leen con `astro:env` en tiempo de ejecución (no quedan en el build).
- Sesión en cookies `httpOnly`; el rol se lee de la BD en el middleware, nunca del navegador.
- Las marcaciones, QR y dispositivos se escriben solo desde el servidor (clave secreta); el cliente solo lee lo que RLS permite.
- `anon` no tiene ningún privilegio sobre las tablas (migración 004).
