/**
 * Identificador de este teléfono (R11). Se genera una vez y se guarda en el
 * navegador; también se copia en una cookie para que el servidor pueda mostrar
 * si el teléfono está aprobado. No contiene datos personales.
 */
const CLAVE = "gru-dispositivo";
const COOKIE = "gru_disp";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function nuevoUid(): string {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6]! & 0x0f) | 0x40;
  b[8] = (b[8]! & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function obtenerUidDispositivo(): string {
  let uid: string | null = null;
  try {
    uid = localStorage.getItem(CLAVE);
  } catch {
    /* almacenamiento bloqueado */
  }
  if (!uid || !UUID.test(uid)) {
    // Si localStorage se borró pero la cookie sigue, se recupera de allí.
    const deCookie = document.cookie.match(/(?:^|;\s*)gru_disp=([^;]+)/)?.[1];
    uid = deCookie && UUID.test(deCookie) ? deCookie : nuevoUid();
    try {
      localStorage.setItem(CLAVE, uid);
    } catch {
      /* sin almacenamiento: se usa solo la cookie */
    }
  }
  const seguro = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${uid}; Path=/; Max-Age=${60 * 60 * 24 * 400}; SameSite=Lax${seguro}`;
  return uid;
}
