---
titulo: Puesta en marcha
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: desarrollo
estado: activo
fecha: 2026-10-19
tags: [emma-soler, desarrollo]
---

# Puesta en marcha

## Requisitos
- Node.js 22.12 o superior
- Docker en ejecución: `sudo systemctl start docker`
- g++ (con soporte de C++17) y make

## Primera vez
```bash
cd "desarrollo web"
npm install
cp .env.example .env     # completar con las claves que muestra npm run db:status
npm run setup            # compila C++, levanta Supabase, crea las tablas y carga los 16 libros
npm run dev              # http://localhost:4321
```

> [!tip] Si el puerto 4321 está ocupado
> Por ejemplo, por otro proyecto: `npx astro dev --port 4330`. Las pruebas que usan el sitio aceptan `BASE_URL=http://localhost:4330`.

## Cuentas de prueba
Todas usan la contraseña `EmmaSoler2026!`.

| Correo | Rol |
|---|---|
| admin@emmasoler.local | Administración |
| bibliotecaria@emmasoler.local | Bibliotecario/a |
| lector@emmasoler.local | Lector/a |

## Comandos
| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo (compila C++ antes) |
| `npm run build` y `npm run preview` | Versión de producción |
| `npm run check` | Revisa los tipos de TypeScript y Astro |
| `npm run build:cpp` | Compila `cpp/` → `cpp/bin/` |
| `npm run test:cpp` | 14 pruebas de los programas C++ |
| `npm run db:start` / `db:stop` / `db:status` | Supabase local (Studio: http://127.0.0.1:54323) |
| `npm run db:reset` | Recrea la base de datos (**borra los datos**) |
| `npm run seed:libros` | Vuelve a cargar los usuarios y los libros, con sus hashes y similares |
| `npm run prueba:*` | Pruebas de extremo a extremo. Ver [[Biblioteca Emma Soler/04-Desarrollo/Pruebas|Pruebas]] |

## Problemas frecuentes
| Síntoma | Solución |
|---|---|
| `permission denied ... docker.sock` | Cerrar sesión y volver a entrar (el usuario está en el grupo `docker`) |
| «No se pudo ejecutar cpp/bin/…» | Ejecutar `npm run build:cpp` |
| Las páginas no muestran libros | ¿Está corriendo Supabase? `npm run db:status` |
| Error de clave al iniciar | Revisar que `.env` tenga las claves de `npm run db:status` |
