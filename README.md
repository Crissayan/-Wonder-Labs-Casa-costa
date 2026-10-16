# Hotel Casa Costa — Sitio web

Sitio web público del **Hotel Casa Costa** en Capurganá (Chocó, Colombia). Es un sitio informativo,
anónimo y de **solo lectura**: muestra planes, promociones, tours, habitaciones, reseñas, cómo
llegar y preguntas frecuentes. Las reservas se hacen fuera del sitio, por **WhatsApp** (reserva
directa) o por **Booking.com**.

## Páginas

| Ruta | Página | Contenido |
|---|---|---|
| `/` | Inicio | Hero, comodidades, tours, reseñas (Google y Booking) y llamado a la acción |
| `/experiencias` | Experiencias | Carruseles de planes y promociones con pop-up de detalle, y destinos (tours) |
| `/comodidades` | Comodidades | Habitaciones con galería, alimentación y servicios |
| `/como-llegar` | Cómo llegar | Rutas en avión, bus, vehículo y lancha |
| `/faqs` | FAQs | Preguntas frecuentes en acordeón |

Componentes globales: header, menú mobile, footer, botón flotante de WhatsApp y modal de reserva
(Directo / Booking). El diseño es responsive y se valida en **393 px** (mobile) y **1456 px**
(escritorio).

## Stack

- **Frontend:** React 18, TypeScript, Vite, React Router, Tailwind CSS, lucide-react.
- **Backend:** Node.js, Express 4, TypeScript, SQLite (better-sqlite3).
- **Pruebas:** Vitest + Testing Library + Supertest (unitarias y de contrato), Playwright (e2e y
  verificación visual).
- **Metodología:** Spec-Driven Development con [Spec Kit](https://github.com/github/spec-kit).

## Estructura del proyecto

```
hotel-casacosta/
├── backend/            # API REST (Express + SQLite)
│   ├── scripts/        # build-db.ts: genera la base desde db/*.sql
│   ├── src/            # servidor, rutas, validación y tipos
│   └── tests/          # pruebas de contrato de la API
├── frontend/           # SPA (React + Vite + Tailwind)
│   ├── public/img/     # imágenes optimizadas (webp/svg)
│   ├── src/            # páginas, componentes y hooks
│   └── e2e/            # pruebas Playwright (funcionales y visuales)
├── db/
│   ├── schema.sql      # esquema de la base de datos
│   └── seed.sql        # datos iniciales del hotel
├── specs/              # especificación, plan, contratos y tareas (Spec Kit)
└── .specify/           # constitución del proyecto y plantillas de Spec Kit
```

## Requisitos

- Node.js **18.20** o superior y npm 10.
- Para las pruebas e2e: navegadores de Playwright
  (`npx playwright install chromium webkit`).

## Puesta en marcha

```bash
npm install          # instala backend y frontend (npm workspaces)
npm run db:build     # crea db/casacosta.db desde schema.sql + seed.sql
npm run dev          # API en http://localhost:3001 y frontend en http://localhost:5173
```

La base de datos `db/casacosta.db` no se versiona: se regenera con `npm run db:build` (también lo
hacen `dev`, `build` y `test`).

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta API y frontend en modo desarrollo |
| `npm run build` | Compila backend y frontend para producción |
| `npm start` | Inicia el servidor de producción (sirve API y frontend) |
| `npm test` | Pruebas unitarias y de contrato (Vitest) |
| `npm run test:e2e` | Escenarios de aceptación con Playwright |
| `npm run test:visual` | Verificación visual (posiciones ±2 px, fuentes, sin scroll horizontal) |

## API

Base `/api`, solo `GET`, respuestas JSON con la forma `{ "data": ... }` o
`{ "error": { "code", "message" } }`.

| Endpoint | Descripción |
|---|---|
| `GET /api/planes?categoria=plan\|promocion` | Planes y promociones activos |
| `GET /api/planes/:slug` | Detalle de un plan |
| `GET /api/destinos` | Destinos de tours |
| `GET /api/habitaciones` | Habitaciones con sus imágenes |
| `GET /api/habitaciones/:slug` | Detalle de una habitación |
| `GET /api/resenas` | Reseñas y calificaciones (Google, Booking) |
| `GET /api/faqs` | Preguntas frecuentes |
| `GET /api/contacto` | Teléfono, WhatsApp, Instagram, Booking, enlaces de transporte y dirección |

Errores: `400 INVALID_PARAM`, `404 NOT_FOUND`, `405 METHOD_NOT_ALLOWED` (cabecera `Allow: GET`) y
`500 INTERNAL_ERROR`. El contrato completo está en
[`specs/001-sitio-casacosta/contracts/api.md`](specs/001-sitio-casacosta/contracts/api.md).

## Producción

```bash
npm run build
npm start            # http://localhost:3001 (puerto configurable con PORT)
```

En producción Express sirve tanto la API como el frontend compilado (`frontend/dist`).

## Documentación

- [Constitución del proyecto](.specify/memory/constitution.md)
- [Especificación funcional](specs/001-sitio-casacosta/spec.md)
- [Plan de implementación](specs/001-sitio-casacosta/plan.md)
- [Modelo de datos](specs/001-sitio-casacosta/data-model.md)
- [Tareas](specs/001-sitio-casacosta/tasks.md)
- [Quickstart y recorrido de validación](specs/001-sitio-casacosta/quickstart.md)
