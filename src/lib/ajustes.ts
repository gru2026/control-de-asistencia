/**
 * Ajustes (D-58): sus secciones y la lista de puesta en marcha (D-44), que usan
 * tanto su propia pantalla como el resumen de Ajustes.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { NombreIcono } from "@/components/ui/Icono.astro";
import { plural } from "@/lib/formato";
import { fechaCorta } from "@/lib/fecha";

export const SECCIONES_AJUSTES: { href: string; texto: string; icono: NombreIcono }[] = [
  { href: "/configuracion", texto: "Resumen", icono: "ajustes" },
  { href: "/configuracion/institucion", texto: "Institución", icono: "documento" },
  { href: "/configuracion/marcacion", texto: "Marcación", icono: "ubicacion" },
  { href: "/configuracion/qr", texto: "Código QR", icono: "qr" },
  { href: "/jornadas", texto: "Jornadas y categorías", icono: "calendario" },
  { href: "/configuracion/usuarios", texto: "Usuarios", icono: "escudo" },
  { href: "/configuracion/datos", texto: "Datos", icono: "datos" },
  { href: "/configuracion/puesta-en-marcha", texto: "Puesta en marcha", icono: "exito" },
];

export interface Paso {
  titulo: string;
  listo: boolean;
  detalle: string;
  enlace: string;
  accion: string;
}

/** Pasos para pasar de pruebas a uso real. Solo informa; cada paso se hace en su pantalla. */
export async function cargarPuestaEnMarcha(sb: SupabaseClient) {
  const PRUEBA = "%@example.com";

  const [
    { count: demoRegs },
    { count: demoPerms },
    { data: cuentasPrueba },
    { data: ubis },
    { data: cfg },
    { data: qr },
    { data: gente },
    { data: directivas },
  ] = await Promise.all([
    sb
      .from("registros_asistencia")
      .select("id", { count: "exact", head: true })
      .eq("es_demo", true),
    sb.from("permisos").select("id", { count: "exact", head: true }).eq("es_demo", true),
    sb
      .from("usuarios")
      .select("id, nombre, apellido, email")
      .like("email", PRUEBA)
      .eq("estado", "activo"),
    sb.from("ubicaciones").select("nombre").eq("activa", true).eq("es_prueba", true),
    sb
      .from("configuracion")
      .select("geocerca_activa, inicio_control, firmante_nombre, cod_dea")
      .eq("id", 1)
      .single(),
    sb.from("codigos_qr").select("descripcion, creado_en").eq("activo", true).maybeSingle(),
    sb.from("personal").select("id, usuario_id, marca_en_pc").eq("estado", "activo"),
    sb
      .from("usuarios")
      .select("id")
      .eq("rol", "directiva")
      .eq("estado", "activo")
      .not("email", "like", PRUEBA),
  ]);

  const { data: fichasPrueba } = (cuentasPrueba ?? []).length
    ? await sb
        .from("personal")
        .select("id, nombre, apellido")
        .eq("estado", "activo")
        .in(
          "usuario_id",
          (cuentasPrueba ?? []).map((c) => c.id),
        )
    : { data: [] };

  const personas = (gente ?? []) as {
    id: string;
    usuario_id: string | null;
    marca_en_pc: boolean;
  }[];
  const sinCuenta = personas.filter((x) => !x.usuario_id && !x.marca_en_pc).length;
  const demo = (demoRegs ?? 0) + (demoPerms ?? 0);
  const qrDePrueba = !!qr?.descripcion && /prueba/i.test(qr.descripcion);

  const pasos: Paso[] = [
    {
      titulo: "Borrar los datos de demostración",
      listo: demo === 0,
      detalle: demo
        ? `Quedan ${plural(demoRegs ?? 0, "registro", "registros")} y ${plural(demoPerms ?? 0, "permiso", "permisos")} simulados.`
        : "No hay datos simulados.",
      enlace: "/configuracion/datos#demo",
      accion: "Ir a Datos de demostración",
    },
    {
      titulo: "Desactivar las cuentas y fichas de prueba",
      listo: (cuentasPrueba ?? []).length === 0,
      detalle: (cuentasPrueba ?? []).length
        ? `Activas: ${(cuentasPrueba ?? []).map((c) => `${c.nombre} ${c.apellido}`).join(", ")}${(fichasPrueba ?? []).length ? ` (con ${plural((fichasPrueba ?? []).length, "ficha", "fichas")} de personal)` : ""}.`
        : "No hay cuentas de prueba activas.",
      enlace: "/configuracion/usuarios",
      accion: "Ir a Usuarios",
    },
    {
      titulo: "Desactivar las ubicaciones de prueba",
      listo: (ubis ?? []).length === 0,
      detalle: (ubis ?? []).length
        ? `Activas: ${(ubis ?? []).map((u) => u.nombre).join(", ")}.`
        : "Solo se puede marcar en el colegio.",
      enlace: "/configuracion/marcacion#ubicaciones",
      accion: "Ir a Ubicaciones",
    },
    {
      titulo: "Verificar la ubicación al marcar",
      listo: !!cfg?.geocerca_activa,
      detalle: cfg?.geocerca_activa
        ? "La verificación de ubicación está activa."
        : "Está desactivada: se puede marcar desde cualquier lugar.",
      enlace: "/configuracion/marcacion#geocerca",
      accion: "Ir a Ubicación del colegio",
    },
    {
      titulo: "Imprimir el QR definitivo",
      listo: !!qr && !qrDePrueba,
      detalle: !qr
        ? "No hay un QR activo."
        : qrDePrueba
          ? `El QR activo es de prueba («${qr.descripcion}»). Genere el definitivo e imprímalo.`
          : `QR activo desde el ${fechaCorta(qr.creado_en.slice(0, 10))}. Si se generó para las pruebas, genere uno nuevo el día de inicio.`,
      enlace: "/configuracion/qr",
      accion: "Ir a Código QR",
    },
    {
      titulo: "Crear las cuentas del personal",
      listo: sinCuenta === 0,
      detalle: sinCuenta
        ? `${plural(sinCuenta, "persona no tiene", "personas no tienen")} cuenta. Créelas cerca de la capacitación.`
        : "Todo el personal que marca con teléfono tiene cuenta.",
      enlace: "/personal/cuentas",
      accion: "Ir a Cuentas del personal",
    },
    {
      titulo: "Entregar la cuenta de la directiva",
      listo: (directivas ?? []).length > 0,
      detalle: (directivas ?? []).length
        ? "Hay al menos una cuenta de directiva real."
        : "Solo existe la cuenta de directiva de prueba. Cree la de la directiva del colegio.",
      enlace: "/configuracion/usuarios",
      accion: "Ir a Usuarios",
    },
    {
      titulo: "Completar los datos de la planilla",
      listo: !!cfg?.firmante_nombre && !!cfg?.cod_dea,
      detalle:
        cfg?.firmante_nombre && cfg?.cod_dea
          ? "Firmante y código DEA cargados."
          : "Faltan el nombre de quien firma o el código DEA.",
      enlace: "/configuracion/institucion",
      accion: "Ir a Institución",
    },
    {
      titulo: "Fijar la fecha de inicio del control",
      listo: !!cfg?.inicio_control,
      detalle: cfg?.inicio_control
        ? `Rige desde el ${fechaCorta(cfg.inicio_control)}.`
        : "Hágalo al final: desde ese día el cierre diario pone falta a quien no marque.",
      enlace: "/configuracion/marcacion#cierre",
      accion: "Ir a Cierre diario",
    },
  ];
  const listos = pasos.filter((p) => p.listo).length;
  return { pasos, listos };
}
