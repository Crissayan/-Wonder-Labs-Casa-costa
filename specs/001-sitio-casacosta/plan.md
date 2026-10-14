# Implementation Plan: Sitio web Hotel Casa Costa (MVP)

**Branch**: `001-sitio-casacosta` | **Date**: 2026-10-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-sitio-casacosta/spec.md`

## Summary

Sitio público, anónimo y de solo lectura del Hotel Casa Costa: cinco páginas (Inicio,
Experiencias, Comodidades, Cómo llegar, FAQs) y componentes globales (header, menú mobile, footer,
WhatsApp flotante y modal de reserva) que llevan al visitante a reservar por WhatsApp o Booking.
Enfoque técnico: SPA en React + Tailwind (Vite) que consume una API Express de solo lectura (8
endpoints `GET`) sobre SQLite con SQL puro (`better-sqlite3`). La base se construye desde
`db/schema.sql` + `db/seed.sql`. La interfaz se implementa frame a frame desde Figma (FV-05) y se
verifica con medición automática de cajas (±2 px) y revisión con superposición en 393 px y
1456 px (FR-070).

## Technical Context

**Language/Version**: TypeScript 5.6 en todo el stack; Node.js 18.20 LTS (versión instalada).

**Primary Dependencies**: Frontend: React 18.3, React Router 6, Tailwind CSS 3.4, Vite 5.4,
`lucide-react`, `@fontsource/nunito` y `@fontsource/inter`. Backend: Express 4.21,
`better-sqlite3` 11. Herramientas: `tsx` (ejecución TS en desarrollo y scripts).

**Storage**: SQLite en un único archivo `db/casacosta.db`, construido desde `db/schema.sql` y
`db/seed.sql` (ver [data-model.md](./data-model.md)).

**Testing**: Vitest 2 + Supertest (contrato de la API), Vitest + React Testing Library + jsdom
(componentes y formateadores), Playwright 1.48 (flujos E2E y verificación visual de FR-070).

**Target Platform**: Navegadores modernos (últimas 2 versiones de Chrome, Safari, Firefox y Edge;
Safari iOS y Chrome Android). Servidor Node 18 que sirve la API y, en producción, el frontend
compilado.

**Project Type**: Aplicación web (frontend + backend).

**Performance Goals**: LCP < 2,5 s y CLS < 0,1 en mobile con 4G; respuestas de la API < 100 ms en
el servidor (lecturas sobre una base pequeña).

**Constraints**: Solo lectura (`GET`); sin ORM; solo tokens del UI Toolkit; fidelidad visual ±2 px
en 393 px y 1456 px sin scroll horizontal entre ambos anchos; fuentes reales (FV-06); todo el
contenido visible en español.

**Scale/Scope**: 5 páginas, ~25 componentes, 8 tablas, ~40 filas de contenido semilla; tráfico
bajo (sitio de un hotel).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitución v1.3.0.

| Gate | Verificación | Pre-diseño | Post-diseño |
|---|---|---|---|
| **I. Alcance estricto** | Solo lo del spec: sin reservas propias, pagos, login, admin ni publicación de reseñas. Los 8 endpoints son `GET`. | ✅ | ✅ |
| **II. Reserva fuera del sistema** | Un único `ReservaModal` abierto por todos los CTA; DIRECTO → `whatsapp_url`, BOOKING → `booking_url`; enlaces desde `configuracion` (R-03, R-20). | ✅ | ✅ |
| **III. Stack fijo y SQL puro** | React + Tailwind + Vite; Express; TypeScript; `better-sqlite3` con *prepared statements*; `PRAGMA foreign_keys = ON`; sin ORM. | ✅ | ✅ |
| **IV. Sistema de diseño** | Tokens del toolkit en `tailwind.config.ts` (incluye `surface`); `theme` reemplazado (no extendido) para colores, fuentes y radios, de modo que no existan clases fuera de los tokens. Contenido en español. | ✅ | ✅ |
| **V. Simplicidad** | Estructura plana `/frontend`, `/backend`, `/db`; sin repositorios, servicios ni DI; componentes funcionales con hooks; carruseles con un hook propio en lugar de una librería. | ✅ | ✅ |
| **VI. Errores amigables** | Formato `{ data }` / `{ error }`; 200/400/404/405/500; validación previa a la consulta; estados cargando/vacío/error por sección con el catálogo del spec. | ✅ | ✅ |
| **VII. Fuente de verdad** | Regla web aplicada; contenido semilla desde la constitución y Figma; datos sin fuente marcados como pendientes (ver research D-11). | ✅ | ✅ |
| **FV-01…FV-07** | Implementación por frame con `get_design_context` (FV-05); assets exportados de Figma; íconos `lucide-react`; fuentes con `@fontsource`; verificación FR-070 con Playwright. | ✅ | ✅ |

Sin violaciones: no aplica "Complexity Tracking".

## Project Structure

### Documentation (this feature)

```text
specs/001-sitio-casacosta/
├── plan.md              # Este archivo
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md        # Fase 1
├── contracts/
│   ├── api.md           # Contrato HTTP de la API de solo lectura
│   ├── ui-routes.md     # Rutas, anclas y enlaces externos de la interfaz
│   └── visual-verification.md  # Formato de la verificación visual (FR-070)
├── checklists/
│   └── requirements.md
└── tasks.md             # Fase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
package.json                 # workspaces frontend + backend; scripts raíz (dev, build, test)

db/
├── schema.sql               # DDL de la constitución
├── seed.sql                 # Contenido semilla (constitución + Figma, erratas P-15)
└── casacosta.db             # Generado por backend/scripts/build-db.ts (no versionado)

backend/
├── package.json
├── tsconfig.json
├── scripts/
│   └── build-db.ts          # Recrea casacosta.db desde schema.sql + seed.sql
├── src/
│   ├── server.ts            # App Express: rutas, catch-all 404/405, errores, estáticos en prod
│   ├── db.ts                # Conexión better-sqlite3 + PRAGMA foreign_keys
│   ├── types.ts             # Tipos compartidos (Plan, Destino, Habitacion, …, ApiError)
│   ├── validate.ts          # Validación de slug y categoria
│   └── routes/
│       ├── planes.ts
│       ├── destinos.ts
│       ├── habitaciones.ts
│       ├── resenas.ts
│       ├── faqs.ts
│       └── contacto.ts      # Cada archivo: prepared statements + mapeo snake_case → camelCase
└── tests/
    └── api.test.ts          # Contrato: códigos, formato, validaciones (Supertest)

frontend/
├── package.json
├── vite.config.ts           # Proxy /api → backend en desarrollo
├── tailwind.config.ts       # Tokens del UI Toolkit (colores, fuentes, tamaños, radios, retícula)
├── index.html
├── public/
│   └── img/                 # Imágenes exportadas de Figma (FV-06)
├── src/
│   ├── main.tsx
│   ├── App.tsx              # Rutas + layout global (Header, Footer, WhatsApp, ReservaModal)
│   ├── index.css            # @tailwind + @fontsource
│   ├── api.ts               # fetch tipado + mensajes amigables
│   ├── format.ts            # precio, fecha, calificación, estrellas (FR-060…FR-063)
│   ├── hooks/
│   │   ├── useApi.ts        # estado cargando / vacío / error por sección
│   │   ├── useContacto.tsx  # contexto con /api/contacto (FR-007)
│   │   ├── useReserva.tsx   # contexto del modal único (R-02)
│   │   ├── useCarousel.ts   # índice, circular, flechas, swipe (scroll-snap)
│   │   └── useOverlay.ts    # bloqueo de scroll, Esc, clic en fondo, foco
│   ├── components/          # Header, MobileMenu, Footer, WhatsAppButton, ReservaModal,
│   │                        # ReservarButton, Carousel, PlanCard, PlanPopup, ResenaCard,
│   │                        # ResenaPopup, HabitacionCard, HabitacionDetalle, Acordeon,
│   │                        # SectionState, ExternalLink, Banner
│   └── pages/               # Inicio, Experiencias, Comodidades, ComoLlegar, Faqs
├── tests/                   # Vitest + RTL
└── e2e/
    ├── flows.spec.ts        # Escenarios de aceptación (Playwright)
    └── visual/
        ├── visual.spec.ts   # Medición de cajas ±2 px y capturas en 393/1456 (FR-070)
        ├── expected/        # Cajas esperadas por frame (ver contracts/visual-verification.md)
        └── frames/          # Exportaciones PNG de los frames de Figma para superposición
```

**Structure Decision**: Aplicación web con la estructura plana de la constitución (`/frontend`,
`/backend`, `/db`). Las pruebas viven dentro de cada carpeta (sin carpetas nuevas en la raíz). Un
`package.json` raíz con npm workspaces solo orquesta los scripts.

## Complexity Tracking

No hay violaciones de la constitución que justificar.
