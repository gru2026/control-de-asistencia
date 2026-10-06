---
titulo: Despliegue Vercel + Supabase
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: desarrollo
estado: activo
fecha: 2026-10-06
---

# Despliegue — Vercel + Supabase

## Visión

```
GitHub (repo) ──push──► Vercel (build automático) ──► https://asistencia-uen.vercel.app
                                   │
                                   ├── PUBLIC_SUPABASE_URL / ANON / SECRET / CRON (env vars)
                                   ▼
                          Supabase (Postgres + Auth + RLS)
```

## 1. Supabase (Semana 1, se usa desde local)

1. Crear cuenta → **New project** (plan Free): nombre `asistencia-uen`, región más cercana, contraseña de BD guardada.
2. Aplicar migraciones (`supabase/migrations/*.sql`) en **SQL Editor** o con Supabase CLI.
3. Ejecutar `seed.sql`.
4. Copiar de **Settings → API**: `Project URL`, `anon key`, `service_role key`.
5. **Authentication → Providers**: Email activado (default).
6. (Opcional Semana 4) Authentication → URL Configuration: poner la URL de Vercel en *Site URL* y *Redirect URLs* para que el login redirija bien.

## 2. Repositorio

```bash
git init
git add .
git commit -m "feat: proyecto inicial"
git branch -M main
git remote add origin <url GitHub>
git push -u origin main
```

## 3. Vercel

1. Login en https://vercel.com con GitHub → **Add New → Project** → importar el repo.
2. Framework preset: **Astro** (auto-detectado).
3. **Environment Variables** (todas las de `.env.local`):

| Nombre | Valor | Ambiente |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Production + Preview |
| `PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Production + Preview |
| `CRON_SECRET` | cadena aleatoria larga | Production |
| `SUPABASE_SECRET_KEY` | `eyJ...` | Production + Preview |

4. **Deploy**. En minutos queda en `https://<proyecto>-<usuario>.vercel.app`.
5. Dominio: Settings → Domains → usar el sugerido o apuntar un dominio propio.

## 4. Cron diario (cierre de jornada)

En `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cierre-diario", "schedule": "30 22 * * 1-5" }
  ]
}
```

- Ajustar la hora a la **salida real** del colegio + margen (hora UTC — recordar la conversión, VZLA = UTC-4).
- El endpoint valida un secreto (`CRON_SECRET`) para que nadie más lo llame.

## 5. Checklist de producción

- [ ] Variables de entorno configuradas en Vercel (no en el repo)
- [ ] Site URL de Supabase apuntando a Vercel (redirecciones de login)
- [ ] RLS activo en **todas** las tablas
- [ ] `npm run build` y `npm run preview` pasan en local antes del push
- [ ] HTTPS activo (Vercel lo da por defecto) → el SW funciona
- [ ] Manifest e iconos accesibles: `/.well-known/` y `/manifest.webmanifest`
- [ ] Probar en un celular real: login + marcación + instalar app
- [ ] Datos reales cargados (personal + horarios)
- [ ] Respaldo de BD programado (Supabase → Database → Backups / pg_dump)

## 6. Después del despliegue

1. Compartir el enlace con la directiva.
2. Generar cuentas del personal (o enlace de registro según política).
3. Capacitar con el [[05-Entregables/Manual-de-usuario]].
4. Monitorear: Vercel → Logs, Supabase → Logs.

## Rollback

- Vercel guarda cada deploy: **Deployments → redeploy** de la versión anterior (reversión en segundos).
- Migraciones de BD: siempre versionadas en `supabase/migrations/`; nunca editar tablas a mano en producción.
