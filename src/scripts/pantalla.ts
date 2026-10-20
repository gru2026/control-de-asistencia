/**
 * Con la navegación sin recarga (D-46), el script de una página se ejecuta una
 * sola vez, la primera vez que se visita. `enCadaPantalla` ejecuta la
 * inicialización ahora y cada vez que se muestra una pantalla nueva; la función
 * debe comprobar que sus elementos existen y no inicializarlos dos veces.
 */
export function enCadaPantalla(iniciar: () => void | (() => void)): void {
  let limpiar: void | (() => void);
  const correr = () => {
    limpiar?.();
    limpiar = iniciar();
  };
  correr();
  document.addEventListener("astro:page-load", correr);
  // Antes de cambiar de pantalla se liberan relojes, cámara, etc.
  document.addEventListener("astro:before-swap", () => {
    limpiar?.();
    limpiar = undefined;
  });
}

/** Marca un elemento como inicializado; devuelve false si ya lo estaba. */
export function primeraVez(el: HTMLElement, clave = "listo"): boolean {
  if (el.dataset[clave]) return false;
  el.dataset[clave] = "1";
  return true;
}
