---
titulo: Puesta en marcha
proyecto: PWA Control de Asistencia — U.E.E. General Rafael Urdaneta
tipo: guia
estado: activo
fecha: 2026-10-19
---

# Puesta en marcha (de las pruebas al uso real)

> [!important] Quién decide
> La fecha la decide la coordinación del proyecto (Schormeiker) con la directiva. Mientras tanto, las pruebas siguen con los datos de demostración. Nada de esta lista se ejecuta solo.

La app tiene una lista de verificación en vivo en **Ajustes › Puesta en marcha** (solo directiva): marca cada paso como listo o pendiente y lleva a la pantalla donde se hace.

## Orden sugerido

| # | Paso | Dónde | Notas |
|---|---|---|---|
| 0 | Respaldo de la base | Terminal: `npm run db:respaldo` | Queda en `Documentacion/_privado/respaldos/` (no se sube a GitHub) |
| 1 | Revisar la nómina, las jornadas y los feriados | Personal · Ajustes › Jornadas | Antonio con secretaría |
| 2 | Marcar a quien no tiene teléfono | Ficha › Teléfono › «Marca en secretaría» | No necesitan cuenta |
| 3 | Completar los datos de la planilla (firmante, código DEA, logo) | Ajustes › Institución | El logo está pendiente del colegio |
| 4 | Crear la cuenta de la directiva real | Ajustes › Usuarios | Con su correo; luego desactivar la de prueba |
| 5 | Borrar los datos de demostración | Ajustes › Datos de demostración | El panel quedará vacío hasta las primeras marcaciones |
| 6 | Desactivar fichas, cuentas y ubicaciones de prueba | Personal · Ajustes › Usuarios · Ajustes › Marcación | Cuentas `…@example.com`; fichas V-1000000x |
| 7 | Generar e imprimir el QR definitivo | Ajustes › Código QR | Pegarlo en la entrada |
| 8 | Crear las cuentas del personal | Personal › Cuentas | El mismo día de la capacitación (contraseña inicial 0000) |
| 9 | Capacitación: instalar, entrar, crear contraseña, marcar | En el colegio | Ver el manual y la guía rápida |
| 10 | Fijar la fecha de inicio del control | Ajustes › Marcación › Cierre diario | Desde ese día el cierre pone falta a quien no marque |

## Después del primer día

- Revisar **Permisos › Por revisar** (ubicación dudosa u horas escritas a mano).
- Revisar **Personal › Cuentas › Sin activar**: quien no creó su contraseña.
- Atender **Panel de control › Pendientes** y los avisos de la campana (teléfonos nuevos, faltas, salidas sin marcar).

## Respaldo

`npm run db:respaldo` guarda una copia JSON de cada tabla y la lista de cuentas (sin contraseñas). Para restaurar una cuenta, se crea de nuevo o se restablece a 0000. Recomendación: un respaldo semanal y antes de cualquier cambio grande.
