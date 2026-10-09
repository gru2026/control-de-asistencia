/** R4 · Permisos: guardar, eliminar y reflejarlos en la asistencia ya cerrada. */
import type { SupabaseClient } from "@supabase/supabase-js";
import { clienteAdmin } from "@/lib/supabase/servidor";
import type { DatosPermiso } from "@/lib/validacion";
import {
  faltasCubiertas,
  permisoSolapado,
  permisosQueVuelvenAFalta,
  type PermisoRango,
} from "@/lib/reglas/permisos";
import { fechaCorta } from "@/lib/fecha";

type Resultado =
  { ok: true; id: string; cambios: number } | { ok: false; mensaje: string; campo?: string };

async function permisosDe(sb: SupabaseClient, personalId: string): Promise<PermisoRango[]> {
  const { data } = await sb
    .from("permisos")
    .select("id, personal_id, fecha_desde, fecha_hasta")
    .eq("personal_id", personalId);
  return (data ?? []).map((p) => ({
    id: p.id as string,
    personalId: p.personal_id as string,
    desde: p.fecha_desde as string,
    hasta: p.fecha_hasta as string,
  }));
}

/**
 * Ajusta los registros sin entrada del rango: faltas cubiertas → permiso;
 * permisos que ya no cubre ninguno → falta. Devuelve cuántos días cambiaron.
 */
async function sincronizarRegistros(
  personalId: string,
  desde: string,
  hasta: string,
  vigentes: PermisoRango[],
) {
  const admin = clienteAdmin();
  const { data } = await admin
    .from("registros_asistencia")
    .select("id, fecha, estado, hora_entrada")
    .eq("personal_id", personalId)
    .is("hora_entrada", null)
    .gte("fecha", desde)
    .lte("fecha", hasta);
  const regs = (data ?? []).map((r) => ({
    fecha: r.fecha as string,
    estado: r.estado as string,
    horaEntrada: r.hora_entrada as string | null,
  }));
  const aPermiso = new Set<string>();
  for (const p of vigentes)
    for (const f of faltasCubiertas(regs, p.desde, p.hasta)) aPermiso.add(f);
  const aFalta = permisosQueVuelvenAFalta(regs, personalId, vigentes);

  let cambios = 0;
  if (aPermiso.size) {
    const { data: d } = await admin
      .from("registros_asistencia")
      .update({ estado: "permiso" })
      .eq("personal_id", personalId)
      .is("hora_entrada", null)
      .in("fecha", [...aPermiso])
      .select("id");
    cambios += d?.length ?? 0;
  }
  if (aFalta.length) {
    const { data: d } = await admin
      .from("registros_asistencia")
      .update({ estado: "falta" })
      .eq("personal_id", personalId)
      .is("hora_entrada", null)
      .in("fecha", aFalta)
      .select("id");
    cambios += d?.length ?? 0;
  }
  return cambios;
}

export async function guardarPermiso(
  sb: SupabaseClient,
  datos: DatosPermiso,
  usuarioId: string,
  id?: string,
): Promise<Resultado> {
  const existentes = await permisosDe(sb, datos.personal_id);
  const anterior = id ? existentes.find((p) => p.id === id) : undefined;
  if (id && !anterior) {
    // Cambió de persona: se busca el permiso original para revertir sus días.
    const { data } = await sb.from("permisos").select("id").eq("id", id).maybeSingle();
    if (!data) return { ok: false, mensaje: "El permiso no existe." };
  }
  const nuevo = {
    id,
    personalId: datos.personal_id,
    desde: datos.fecha_desde,
    hasta: datos.fecha_hasta,
  };
  const choque = permisoSolapado(nuevo, existentes);
  if (choque) {
    return {
      ok: false,
      campo: "fecha_desde",
      mensaje: `Ya tiene un permiso del ${fechaCorta(choque.desde)} al ${fechaCorta(choque.hasta)} que se cruza con estas fechas.`,
    };
  }

  let permisoId = id;
  if (id) {
    const { data: previo } = await sb
      .from("permisos")
      .select("personal_id, fecha_desde, fecha_hasta")
      .eq("id", id)
      .single();
    const { error } = await sb
      .from("permisos")
      .update({ ...datos, es_demo: false })
      .eq("id", id);
    if (error) return { ok: false, mensaje: "No se pudo guardar el permiso." };
    // Si cambió la persona, la anterior pierde el permiso en esas fechas.
    if (previo && previo.personal_id !== datos.personal_id) {
      await sincronizarRegistros(
        previo.personal_id,
        previo.fecha_desde,
        previo.fecha_hasta,
        await permisosDe(sb, previo.personal_id),
      );
    } else if (previo) {
      nuevo.desde = previo.fecha_desde < nuevo.desde ? previo.fecha_desde : nuevo.desde;
      nuevo.hasta = previo.fecha_hasta > nuevo.hasta ? previo.fecha_hasta : nuevo.hasta;
    }
  } else {
    const { data, error } = await sb
      .from("permisos")
      .insert({ ...datos, creado_por: usuarioId })
      .select("id")
      .single();
    if (error || !data) return { ok: false, mensaje: "No se pudo guardar el permiso." };
    permisoId = data.id as string;
  }

  const cambios = await sincronizarRegistros(
    datos.personal_id,
    nuevo.desde,
    nuevo.hasta,
    await permisosDe(sb, datos.personal_id),
  );
  return { ok: true, id: permisoId!, cambios };
}

export async function eliminarPermiso(
  sb: SupabaseClient,
  id: string,
): Promise<{ ok: true; cambios: number } | { ok: false; mensaje: string }> {
  const { data: p } = await sb
    .from("permisos")
    .select("personal_id, fecha_desde, fecha_hasta")
    .eq("id", id)
    .maybeSingle();
  if (!p) return { ok: false, mensaje: "El permiso no existe." };
  const { error } = await sb.from("permisos").delete().eq("id", id);
  if (error) return { ok: false, mensaje: "No se pudo eliminar el permiso." };
  const cambios = await sincronizarRegistros(
    p.personal_id,
    p.fecha_desde,
    p.fecha_hasta,
    await permisosDe(sb, p.personal_id),
  );
  return { ok: true, cambios };
}
