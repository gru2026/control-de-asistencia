---
titulo: Próximas etapas y pendientes
proyecto: Biblioteca Pública Emma Soler — Cúa
tipo: pendientes
estado: activo
fecha: 2026-10-19
tags: [emma-soler, pendientes]
---

# Próximas etapas y pendientes

## Segunda etapa (mejoras 5, 7 y 8)
- [ ] **7. Historial de cambios (auditoría):** tabla `auditoria` con lo que cambió en cada registro (antes y después, en JSON), quién y cuándo, más una pantalla en el panel.
- [ ] **8. Respaldos:** respaldo automático de la base de datos y de los archivos, y un botón para restaurar. *La integridad SHA-256 ya está hecha.*
- [ ] **5. Derechos y préstamo digital:** marcar cada libro como dominio público, solo consulta o préstamo; límite de lectores a la vez; marca de agua con el nombre del lector en el PDF.

## Lo que quedó a medias
- [ ] Recuperar la contraseña («Olvidé mi contraseña»). En local los correos llegan a Mailpit.
- [ ] Confirmar la suscripción al boletín y enviar correos.
- [ ] Reanudar las digitalizaciones que quedaron en «procesando» si el servidor se reinicia, y procesar varios libros a la vez.
- [ ] Editar eventos y noticias desde el panel (hoy están en Markdown).
- [ ] Pantalla para moderar reseñas.

## Verificación pendiente
- [ ] Revisar visualmente el lector, Mi cuenta y el panel en el móvil.
- [ ] Medir con Lighthouse.
- [ ] Pruebas automáticas de la interfaz.

## Tareas del estudiante
- [ ] Cambiar la contraseña de sudo (quedó escrita en el chat).
- [ ] Confirmar o reemplazar los datos ficticios: biografía, dirección, teléfono y redes.
- [ ] Agregar contenido real en `referencias/contenido`, si lo hay.
- [ ] Iniciar git (`git init`). El `.gitignore` ya excluye `cpp/bin/`, `.env` y `node_modules`.
