/**
 * GET /api/cierre-diario · Lo llama Vercel Cron con «Authorization: Bearer CRON_SECRET».
 * Ver src/lib/servicios/cierre.ts y Reglas-de-negocio (R3).
 */
import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { ejecutarCierre } from "@/lib/servicios/cierre";

export const prerender = false;

const huella = (t: string) => createHash("sha256").update(t).digest();

function autorizado(cabecera: string | null): boolean {
  const secreto = getSecret("CRON_SECRET");
  if (!secreto || !cabecera) return false;
  return timingSafeEqual(huella(cabecera), huella(`Bearer ${secreto}`));
}

export const GET: APIRoute = async ({ request }) => {
  if (!autorizado(request.headers.get("Authorization"))) {
    return new Response(JSON.stringify({ ok: false }), { status: 401 });
  }
  try {
    const resumen = await ejecutarCierre({ origen: "cron" });
    return new Response(JSON.stringify({ ok: true, resumen }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[cierre-diario]", e);
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
};
