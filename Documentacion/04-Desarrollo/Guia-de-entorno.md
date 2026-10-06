---
titulo: Guía de entorno
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: desarrollo
estado: activo
fecha: 2026-10-01
---

# Guía de Entorno (desarrollo local)

## Requisitos previos

| Software | Versión | Verificar con |
|---|---|---|
| Node.js | 20 LTS o superior | `node -v` |
| npm | incluido con Node | `npm -v` |
| Git | cualquiera | `git --version` |
| Cuenta Supabase | plan gratis | https://supabase.com |
| Cuenta GitHub | gratis | para el repo |
| Cuenta Vercel | gratis | para deploy (Semana 4) |

## 1. Clonar e instalar

```bash
git clone <url-del-repo> "servicio comunitario"
cd "servicio comunitario"
npm install
```

## 2. Andamiaje

El proyecto ya está creado (Astro + TypeScript estricto + adaptador Vercel + Vitest + ESLint/Prettier). La PWA se hace con **manifest + service worker propios** en `public/` (sin integraciones de terceros, ver [[03-Diseno/Registro-de-decisiones|D-13]]).

## 3. Variables de entorno

Crear `.env` en la raíz a partir de `.env.example` (ya está en `.gitignore`):

```bash
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=...     # clave pública "anon" / "publishable" (puede ir al navegador)
SUPABASE_SECRET_KEY=...          # clave "service_role" / "secret" (SOLO servidor)
CRON_SECRET=...                  # protege /api/cierre-diario
TOKEN_ACCESS=sbp_...             # SOLO scripts locales (npm run db:*). Nunca en Vercel.
```

Cómo obtenerlas: Supabase → Project → **Settings → API Keys**. `SUPABASE_SECRET_KEY` es la que Supabase llama **service_role** (claves heredadas) o **secret key** (claves nuevas). En Astro, solo las variables con prefijo `PUBLIC_` llegan al navegador.

> [!danger] Regla de seguridad
> `SUPABASE_SECRET_KEY` **nunca** se sube a Git ni se usa en código de navegador. Si se filtra: rotarla desde Supabase de inmediato.

Plantilla: `.env.example` en el repo (sin valores reales).

## 4. Base de datos

```bash
npm run db:migrar     # aplica las migraciones pendientes de supabase/migrations
npm run db:seed       # configuración, jornada "General" y feriados
npm run db:sql -- "select count(*) from personal"
npm run crear-usuario -- correo@x.com directiva Nombre Apellido   # primer administrador
```

Las migraciones aplicadas se registran en `interno.migraciones`. Para cambiar el esquema, crear un archivo nuevo (`005_...sql`); nunca editar uno ya aplicado.

El seed crea: configuración por defecto, jornada "General" (07:00–16:00, tol. 15) y feriados nacionales. Los usuarios de prueba se crean en **Authentication → Users** y luego se les asigna rol (instrucciones en `supabase/seed.sql`).

> [!tip] Cámara y GPS en desarrollo
> `localhost` cuenta como contexto seguro en el PC. Para probar en el **celular** hace falta HTTPS: usar un Preview de Vercel o un túnel (ej. `cloudflared tunnel --url http://localhost:4321`).

## 5. Levantar en local

```bash
npm run dev          # http://localhost:4321
npm run build        # build de producción
npm run preview      # previsualizar el build
npm run lint         # ESLint
npm run format       # Prettier
npm test             # Vitest (reglas de negocio)
```

## 6. Estructura del día a día

1. `git pull` / crear rama: `git checkout -b feat/marcacion-entrada`
2. Desarrollar → `npm run lint` + `npm test` antes de commitear
3. Commit convencional (ver [[04-Desarrollo/Convenciones-y-calidad]])
4. Push → PR → merge a `main`

## Problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| Error 401 con Supabase | Claves mal copiadas o RLS sin select | Revisar `.env.local` y políticas RLS |
| `middleware` no redirige | Ruta no incluida en matcher | Revisar config del middleware |
| SW no se registra | Estás en `dev` sin HTTPS/localhost permitido | Probar con `npm run build && npm run preview` |
| Puerto ocupado | Otro proceso en 4321 | `npm run dev -- --port 4322` |
