# Quickstart: validar el sitio Hotel Casa Costa

Guía para levantar el proyecto y comprobar que el feature funciona de punta a punta. Detalles del
contrato en [contracts/](./contracts/) y de los datos en [data-model.md](./data-model.md).

## Requisitos previos

- Node.js 18.20 o superior y npm 10.
- Navegadores de Playwright instalados (`npx playwright install chromium webkit`).
- Imágenes exportadas de Figma en `frontend/public/img/` y PNG de frames en
  `frontend/e2e/visual/frames/` (FV-06).

## Puesta en marcha

```bash
npm install            # instala frontend y backend (workspaces)
npm run db:build       # recrea db/casacosta.db desde schema.sql + seed.sql
npm run dev            # API en http://localhost:3001 y frontend en http://localhost:5173
```

Resultado esperado: `db:build` termina sin errores (si el seed viola un `CHECK`, `UNIQUE` o
`FOREIGN KEY`, termina con error y no deja base — CB-07…CB-09).

## Comprobaciones rápidas de la API

```bash
curl -s localhost:3001/api/planes?categoria=plan        # 200, 3 planes ordenados
curl -s localhost:3001/api/planes?categoria=tour        # 400 INVALID_PARAM
curl -s localhost:3001/api/planes/no-existe             # 404 NOT_FOUND
curl -s -X POST localhost:3001/api/faqs -i              # 405, cabecera Allow: GET
curl -s localhost:3001/api/resenas                      # GOOGLE 4.7, BOOKING 9.0, 3 reseñas
curl -s localhost:3001/api/contacto                     # 8 claves; ausentes en null
```

## Pruebas automatizadas

```bash
npm test                     # Vitest: contrato de la API + componentes y formateadores
npm run test:e2e             # Playwright: escenarios de aceptación en 393 y 1456 px
npm run test:visual          # Playwright: cajas ±2 px, fuentes, sin scroll horizontal (FR-070)
```

Resultado esperado: todo en verde. `test:visual` deja capturas en `frontend/e2e/visual/output/`.

## Recorrido manual (escenarios clave del spec)

| # | Acción | Resultado esperado |
|---|---|---|
| 1 | Pulsar RESERVAR en el header, el banner y un pop-up de plan | Se abre siempre el mismo modal; DIRECTO abre WhatsApp y BOOKING abre Booking en pestaña nueva (Historia 1) |
| 2 | Experiencias → abrir "Plan Capurganá Intrépida" | "$980.000" destacado y "Precio normal $1.100.000" (Historia 2) |
| 3 | Pop-up de "Plan Conoce Capurganá" → clic en "Bahía Sapzurro" | Se cierra el pop-up y se desplaza a su bloque en Tours |
| 4 | Comodidades (1456 px) → flecha derecha y clic en una miniatura | Pasa a "Habitación #2"; la miniatura cambia la imagen de la tarjeta (Historia 3) |
| 5 | Inicio → "LEER MÁS" en la reseña de Daniela | Pop-up con "EXCELENTE", "5 ESTRELLAS", "10/10/2025" (Historia 4) |
| 6 | Cómo llegar → "Consulta tiquetes" (ambas vistas) | Abre `bus_url`; si la clave no está en el seed, el botón no aparece (CB-01) |
| 7 | FAQs → clic en una pregunta dos veces | Abre y cierra; `aria-expanded` cambia (Historia 6) |
| 8 | Footer → usuario de Instagram y teléfono | Abren Instagram y WhatsApp en pestaña nueva; la dirección no es enlace |
| 9 | Detener la API y recargar Inicio | Las secciones con datos muestran el mensaje amigable; hero, banner y WhatsApp siguen visibles |

## Verificación visual (FV-07)

Para cada pantalla y estado: `npm run test:visual` en verde y una fila completa en
`frontend/e2e/visual/REVIEW.md` tras la superposición con el frame (ver
[contracts/visual-verification.md](./contracts/visual-verification.md)). Sin ambas, la pantalla
no se da por terminada.

## Producción

```bash
npm run build && npm start   # Express sirve la API y frontend/dist en http://localhost:3001
```
