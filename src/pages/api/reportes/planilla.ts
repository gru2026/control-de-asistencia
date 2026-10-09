import type { APIRoute } from "astro";
import { cargarInstitucion, cargarPlanilla } from "@/lib/reportes/datos";
import { planillaPdf } from "@/lib/reportes/pdf";
import { planillaExcel } from "@/lib/reportes/excel";
import type { TipoPlanilla } from "@/lib/reportes/planilla";
import { esUuid } from "@/lib/validacion";
import { hoyEnZona } from "@/lib/fecha";

/** GET /api/reportes/planilla?fecha=AAAA-MM-DD&tipo=docentes|personal|categoria:<id>&formato=pdf|xlsx */
export const GET: APIRoute = async ({ locals, url }) => {
  const perfil = locals.perfil;
  if (!perfil) return new Response("Inicie sesión", { status: 401 });
  if (perfil.rol === "personal") return new Response("Prohibido", { status: 403 });

  const fecha = url.searchParams.get("fecha") ?? hoyEnZona();
  const tipoTexto = url.searchParams.get("tipo") ?? "docentes";
  const formato = url.searchParams.get("formato") === "xlsx" ? "xlsx" : "pdf";
  const valido =
    tipoTexto === "docentes" ||
    tipoTexto === "personal" ||
    (tipoTexto.startsWith("categoria:") && esUuid(tipoTexto.slice(10)));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !valido)
    return new Response("Parámetros no válidos", { status: 400 });
  const tipo = tipoTexto as TipoPlanilla;

  const [planilla, inst] = await Promise.all([
    cargarPlanilla(locals.supabase, tipo, fecha),
    cargarInstitucion(locals.supabase),
  ]);
  const generado = new Intl.DateTimeFormat("es-VE", {
    timeZone: "America/Caracas",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());
  const nombre = `${planilla.titulo.toLowerCase().replace(/[^a-z0-9ñ]+/g, "-")}-${fecha}`;

  const cuerpo =
    formato === "pdf"
      ? planillaPdf(planilla, inst, generado)
      : await planillaExcel(planilla, inst, generado);
  return new Response(cuerpo, {
    headers: {
      "Content-Type":
        formato === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `${formato === "pdf" && url.searchParams.get("ver") ? "inline" : "attachment"}; filename="${nombre}.${formato}"`,
      "Cache-Control": "private, no-store",
    },
  });
};
