/**
 * Datos de demostración y limpieza. Solo directiva (verificar el rol antes de llamar).
 * Usa el cliente admin porque los registros de asistencia solo los escribe el servidor.
 */
import { clienteAdmin } from "@/lib/supabase/servidor";
import { generarAsistenciaDemo, type PersonaDemo } from "@/lib/demo/generador";
import { aExcepcion, aJornada, type FilaHorario, type FilaJornada } from "@/lib/datos/jornadas";
import { hoyEnZona } from "@/lib/fecha";
import { horaAMinutos, horaEnZona, sumarDias } from "@/lib/reglas/tiempo";

const LOTE = 500;

async function insertarPorLotes(tabla: string, filas: object[], conflicto?: string) {
  const admin = clienteAdmin();
  for (let i = 0; i < filas.length; i += LOTE) {
    const lote = filas.slice(i, i + LOTE);
    const { error } = conflicto
      ? await admin.from(tabla).upsert(lote, { onConflict: conflicto, ignoreDuplicates: true })
      : await admin.from(tabla).insert(lote);
    if (error) throw new Error(`${tabla}: ${error.message}`);
  }
}

export async function eliminarDemo(): Promise<{ registros: number; permisos: number }> {
  const admin = clienteAdmin();
  const r = await admin.from("registros_asistencia").delete({ count: "exact" }).eq("es_demo", true);
  const p = await admin.from("permisos").delete({ count: "exact" }).eq("es_demo", true);
  if (r.error || p.error) throw new Error(r.error?.message ?? p.error?.message);
  return { registros: r.count ?? 0, permisos: p.count ?? 0 };
}

/** Genera ~5 semanas de asistencia simulada para todo el personal activo con jornada. */
export async function generarDemo(directivaId: string, dias = 35) {
  const admin = clienteAdmin();
  await eliminarDemo();
  const hoy = hoyEnZona();
  const [{ data: personal, error }, { data: feriados }] = await Promise.all([
    admin
      .from("personal")
      .select(
        "id, jornadas(id, nombre, hora_entrada, hora_salida, tolerancia_min, pausa_min, dias_laborables, activa, nocturna), horarios(dia_semana, hora_entrada, hora_salida, tolerancia_min, libre)",
      )
      .eq("estado", "activo")
      .limit(2000),
    admin.from("feriados").select("fecha").gte("fecha", sumarDias(hoy, -dias)).lte("fecha", hoy),
  ]);
  if (error) throw new Error(error.message);

  const personas: PersonaDemo[] = (
    (personal ?? []) as unknown as {
      id: string;
      jornadas: FilaJornada | null;
      horarios: FilaHorario[];
    }[]
  ).map((x) => ({
    id: x.id,
    jornada: x.jornadas ? aJornada(x.jornadas) : null,
    excepciones: x.horarios.map(aExcepcion),
  }));

  const { registros, permisos } = generarAsistenciaDemo(personas, {
    desde: sumarDias(hoy, -dias),
    hasta: hoy,
    feriados: (feriados ?? []).map((f: { fecha: string }) => f.fecha),
    ahoraMin: horaAMinutos(horaEnZona(new Date())),
    registradoPor: directivaId,
    semilla: Number(hoy.replaceAll("-", "")),
  });
  // No pisa registros reales: (personal_id, fecha) es único y se ignoran los duplicados.
  await insertarPorLotes("registros_asistencia", registros, "personal_id,fecha");
  await insertarPorLotes(
    "permisos",
    permisos.map((p) => ({ ...p, creado_por: directivaId })),
  );
  return {
    personas: personas.filter((p) => p.jornada).length,
    registros: registros.length,
    permisos: permisos.length,
  };
}

/** Elimina el personal cargado por importación (y su asistencia). Las cuentas de acceso se conservan. */
export async function eliminarImportados(): Promise<number> {
  const admin = clienteAdmin();
  const { data } = await admin.from("personal").select("id").eq("origen", "importado").limit(5000);
  const ids = (data ?? []).map((x: { id: string }) => x.id);
  for (let i = 0; i < ids.length; i += 200) {
    const lote = ids.slice(i, i + 200);
    await admin.from("registros_asistencia").delete().in("personal_id", lote);
    await admin.from("permisos").delete().in("personal_id", lote);
    const { error } = await admin.from("personal").delete().in("id", lote);
    if (error) throw new Error(error.message);
  }
  return ids.length;
}
