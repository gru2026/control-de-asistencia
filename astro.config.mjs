// @ts-check
import { defineConfig, envField } from "astro/config";
import vercel from "@astrojs/vercel";

// SSR completo: las rutas privadas se protegen en el servidor (middleware).
export default defineConfig({
  output: "server",
  adapter: vercel(),
  site: "https://control-de-asistencia-vert.vercel.app",
  server: { port: 4321 },
  security: { checkOrigin: true },
  // Precarga: la pantalla se pide al pasar el mouse sobre el enlace (en el celular, al tocarlo).
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  // Versión de la publicación: cambia la URL del service worker y activa el aviso de actualización.
  vite: {
    define: {
      __VERSION_APP__: JSON.stringify(
        process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? Date.now().toString(36),
      ),
    },
  },
  env: {
    // "secret" se lee en tiempo de ejecución: nunca queda escrita en el build.
    schema: {
      PUBLIC_SUPABASE_URL: envField.string({ context: "server", access: "public", url: true }),
      PUBLIC_SUPABASE_ANON_KEY: envField.string({ context: "server", access: "public" }),
      SUPABASE_SECRET_KEY: envField.string({ context: "server", access: "secret" }),
      CRON_SECRET: envField.string({ context: "server", access: "secret", optional: true }),
    },
    validateSecrets: true,
  },
});
