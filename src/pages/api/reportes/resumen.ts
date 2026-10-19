import type { APIRoute } from "astro";
import { cargarInstitucion, cargarResumen } from "@/lib/reportes/datos";
import { rangoResumen } from "@/lib/reportes/resumen";
import { resumenExcel, resumenPdf } from "@/lib/reportes/resumen-archivos";
import { listarCategorias } from "@/lib/datos/categorias";
import { hoyEnZona } from "@/lib/fecha";

/** GET /api/reportes/resumen?desde=AAAA-MM-DD&hasta=AAAA-MM-DD&categoria=<id>&formato=pdf|xlsx */
export const GET: APIRoute = async ({ locals, url }) => {
  const perfil = locals.perfil;
  if (!perfil) return new Response("Inicie sesión", { status: 401 });
  if (perfil.rol === "personal") return new Response("Prohibido", { status: 403 });

  const p = url.searchParams;
  const { desde, hasta } = rangoResumen(p.get("desde"), p.get("hasta"), hoyEnZona());
  const formato = p.get("formato") === "xlsx" ? "xlsx" : "pdf";
  const categorias = await listarCategorias(locals.supabase);
  const cat = categorias.find((c) => c.id === p.get("categoria")) ?? null;

  const [resumen, inst] = await Promise.all([
    cargarResumen(locals.supabase, desde, hasta, cat?.id ?? null),
    cargarInstitucion(locals.supabase),
  ]);
  const titulo = cat
    ? `RESUMEN DE ASISTENCIA · ${cat.nombre.toUpperCase()}`
    : "RESUMEN DE ASISTENCIA";
  const nombreCat = (id: string) => categorias.find((c) => c.id === id)?.nombre ?? "";
  const generado = new Intl.DateTimeFormat("es-VE", {
    timeZone: "America/Caracas",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());
  const cuerpo =
    formato === "pdf"
      ? resumenPdf(resumen, inst, titulo, nombreCat, generado)
      : await resumenExcel(resumen, inst, titulo, nombreCat, generado);
  const archivo = `resumen-asistencia-${desde}-a-${resumen.hasta}.${formato}`;
  return new Response(cuerpo, {
    headers: {
      "Content-Type":
        formato === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `${formato === "pdf" && p.get("ver") ? "inline" : "attachment"}; filename="${archivo}"`,
      "Cache-Control": "private, no-store",
    },
  });
};
