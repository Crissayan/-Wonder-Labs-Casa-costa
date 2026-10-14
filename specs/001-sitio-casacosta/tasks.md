---

description: "Task list for feature 001-sitio-casacosta"
---

# Tasks: Sitio web Hotel Casa Costa (MVP)

**Input**: Design documents from `specs/001-sitio-casacosta/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluidos. FR-070 / FV-07 exigen verificación visual automatizada por pantalla, y el plan
(D-12) define pruebas de contrato de la API, de componentes y E2E de los escenarios de aceptación.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Reglas que aplican a TODAS las tareas de interfaz**: antes de maquetar, consultar el frame con
`get_design_context` del archivo Figma `FUuT2oETZHhIh0PIIBFDHX` (FV-05); usar solo clases de los
tokens de `frontend/tailwind.config.ts` (Principio IV); íconos `lucide/*` con `lucide-react` y
demás assets exportados de Figma (FV-06); marcar con `data-fv="<id>"` los elementos clave a medir
(contracts/visual-verification.md); textos en español tomados de la base o de la constitución
(FV-02); enlaces externos con `ExternalLink` (FR-064).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1…US7)

## Path Conventions

Web app: `backend/src/`, `backend/tests/`, `frontend/src/`, `frontend/tests/`, `frontend/e2e/`, `db/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create root `package.json` with npm workspaces `["frontend", "backend"]` and scripts `dev` (backend + frontend en paralelo), `db:build`, `build`, `start`, `test`, `test:e2e`, `test:visual`; create `.gitignore` excluding `node_modules/`, `dist/`, `db/casacosta.db`, `frontend/e2e/visual/output/`
- [ ] T002 Initialize backend in `backend/package.json` (`"type": "module"`; deps `express@4.21`, `better-sqlite3@11`; devDeps `typescript@5.6`, `tsx`, `@types/express`, `@types/better-sqlite3`, `@types/node`, `vitest@2`, `supertest`, `@types/supertest`; scripts `dev`, `build`, `start`, `test`, `db:build`) and `backend/tsconfig.json` (strict, `module`/`moduleResolution` `NodeNext`, `outDir` `dist`)
- [ ] T003 [P] Initialize frontend with Vite 5.4 + React 18.3 + TypeScript in `frontend/package.json` (deps `react`, `react-dom`, `react-router-dom@6`, `lucide-react`, `@fontsource/nunito`, `@fontsource/inter`; devDeps `tailwindcss@3.4`, `postcss`, `autoprefixer`, `vitest@2`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `@playwright/test@1.48`), `frontend/tsconfig.json` with `paths` `"@api/types": ["../backend/src/types.ts"]`, and `frontend/vite.config.ts` with the same alias, proxy `/api` → `http://localhost:3001` and Vitest `environment: 'jsdom'`
- [ ] T004 [P] Configure Playwright in `frontend/playwright.config.ts` with projects `mobile` (viewport 393×852) and `desktop` (viewport 1456×900), `testDir: 'e2e'`, and `webServer` entries that run `npm run db:build && npm run start -w backend` (port 3001) and `npm run dev -w frontend` (port 5173)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Base de datos

- [ ] T005 Create `db/schema.sql` copying verbatim the DDL of the constitution v1.3.0 ("Esquema SQLite (fuente de verdad)"), including `PRAGMA foreign_keys = ON;` and all `CHECK`, `UNIQUE` and `FOREIGN KEY … ON DELETE CASCADE` constraints
- [ ] T006 Implement `backend/scripts/build-db.ts`: delete and recreate `db/casacosta.db`, enable `foreign_keys`, run `db/schema.sql` and `db/seed.sql` inside one transaction, exit with code ≠ 0 and delete the file if any constraint fails (research D-09, CB-07…CB-09); wire it to `npm run db:build`
- [ ] T007 Write `db/seed.sql` with the inventory of `data-model.md` ("Contenido semilla"), reading every value marked **F** from its Figma frame with `get_design_context` and fixing the P-15 typos: `configuracion` (all keys of the inventory except the pending `vuelo_url` and `bus_url`; `whatsapp_url` = `https://wa.me/573128686680?text=` + URL-encoded "Quiero más info sobre Hotel Casa Costa 🏝️"); 5 `planes` with the listed slugs (`precio_temporada_baja` "NULL o `0 < x < precio_normal`", `duracion_dias` "> 0", promociones `categoria = 'promocion'` without "Tour" prefix); 3 `destinos`; 5 `habitaciones` (`capacidad_max` "1–8", `precio` NULL) with **3** `habitacion_imagenes` each (`/img/habitaciones/{slug}-{1..3}.webp`); 3 `resenas` (calificación 5, fecha `2025-10-10`); `calificaciones_plataforma` GOOGLE 4.7/5 and BOOKING 9.0/10; 3 `faqs` with the literal answers of constitution P-10; all slugs matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`; run `npm run db:build` until it succeeds

### Backend base

- [ ] T008 [P] Create `backend/src/types.ts` with `CategoriaPlan`, `Plan`, `Destino`, `HabitacionImagen`, `Habitacion`, `Resena`, `CalificacionPlataforma`, `Faq`, `Contacto` (including `instagramUrl: string | null`) and `ApiError` exactly as in spec Anexo A.3
- [ ] T009 [P] Create `backend/src/db.ts`: open `better-sqlite3` with `fileMustExist: true` at `process.env.CASACOSTA_DB_PATH` or `fileURLToPath(new URL('../../db/casacosta.db', import.meta.url))` (research D-08) and run `db.pragma('foreign_keys = ON')`
- [ ] T010 [P] Create `backend/src/validate.ts` with `isValidSlug` (`^[a-z0-9]+(?:-[a-z0-9]+)*$`, máximo 100 caracteres) and `isValidCategoria` (`'plan' | 'promocion'`), plus helpers `sendData(res, data)` and `sendError(res, status, code)` using the messages of `contracts/api.md`
- [ ] T011 Create `backend/src/server.ts` exporting `createApp()`: JSON responses with `charset=utf-8`, a mount point for the routers in `backend/src/routes/`, catch-all `app.all('/api/*')` after the routers (`GET` → 404 `NOT_FOUND`; any other method → 405 `METHOD_NOT_ALLOWED` with `Allow: GET`), error middleware → 500 `INTERNAL_ERROR` logging the detail only with `console.error`, static serving of `frontend/dist` with `index.html` fallback for non-`/api` routes when `NODE_ENV=production` (research D-13), and `listen(3001)` when run directly
- [ ] T012 Implement `backend/src/routes/contacto.ts` (`GET /api/contacto`): prepared statement `SELECT clave, valor FROM configuracion WHERE clave IN ('telefono','whatsapp_url','instagram','instagram_url','booking_url','vuelo_url','bus_url','direccion')`, mapped to `Contacto` with missing keys as `null`; mount it in `backend/src/server.ts`
- [ ] T013 [P] Create `backend/tests/helpers.ts` that builds a temporary DB (schema + seed, or schema only for empty-list cases), sets `CASACOSTA_DB_PATH` and returns a Supertest agent over `createApp()`
- [ ] T014 Write `backend/tests/api.base.test.ts`: `POST/PUT/DELETE /api/faqs` → 405 with `Allow: GET` and unchanged data; `GET /api/no-existe` → 404 `NOT_FOUND`; forced exception → 500 `INTERNAL_ERROR` without stack trace in the body; `GET /api/contacto` → 200 with the 8 keys (`vueloUrl` and `busUrl` = `null`)

### Frontend base

- [ ] T015 [P] Configure `frontend/tailwind.config.ts` and `frontend/postcss.config.js` replacing (not extending) `theme.colors` (`primary #1A364F`, `white #FFFFFF`, `cta #FAB53F`, `secondary-1 #3DBCD5`, `secondary-2 #6AC6DE`, `secondary-3 #A0D7E8`, `secondary-4 #67C1BD`, `surface #EFEFEF`, `transparent`, `current`), `theme.fontFamily` (`nunito`, `inter`), `theme.fontSize` by role (títulos 28/64, subtítulos 24/48, encabezados 20/36, botones 12/30, captions 12/26, párrafos 12/22 mobile/escritorio), `theme.borderRadius` (50 px pop-ups/modales/píldoras, 14 px escritorio / 10 px mobile botones rectangulares, 15 px imágenes, 10 px bloques) and screen `lg: 1456px`, container margins 30/80 px and gutters 16/24 px (research D-02); confirm values with `get_variable_defs` on the UI Toolkit
- [ ] T016 [P] Create `frontend/src/index.css` (`@tailwind` layers + `@fontsource` imports for the Nunito and Inter weights used by the frames) and `frontend/index.html` (`lang="es"`, title "Hotel Casa Costa", preload of the main font weight) (research D-03)
- [ ] T017 [P] Create `frontend/src/messages.ts` with the friendly-message catalog of the spec and `frontend/src/api.ts` with typed `fetch` helpers (`import type` from `@api/types`) that turn any network/HTTP error into the catalog message (never raw errors)
- [ ] T018 [P] Create `frontend/src/format.ts` (`formatPrecio` → `"$" + Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 })` → `$1.100.000`; `formatFecha` splitting `YYYY-MM-DD` → `DD/MM/YYYY` without `Date`; `formatPuntaje` → `toFixed(1)`; `formatEstrellas` → "{n} ESTRELLAS" / "1 ESTRELLA"; `formatDuracion` → "{d−1} Noches · {d} Días") and `frontend/tests/format.test.ts` covering FR-060…FR-063, CB-14 and `formatDuracion(3)`
- [ ] T019 [P] Create `frontend/src/hooks/useApi.ts` (loading / empty / error / data) and `frontend/src/components/SectionState.tsx` (skeleton on `surface`, empty and error messages from the catalog) (FR-065)
- [ ] T020 [P] Create `frontend/src/hooks/useCarousel.ts` and `frontend/src/components/Carousel.tsx`: circular index without autoplay, desktop arrows with active item centered and side items at 50 % opacity, mobile `scroll-snap` swipe synced via IntersectionObserver, dot indicator, arrows/dots hidden with 0–1 items (research D-05, CB-12); test in `frontend/tests/Carousel.test.tsx`
- [ ] T021 [P] Create `frontend/src/hooks/useOverlay.ts` and `frontend/src/components/Overlay.tsx`: one open layer at a time, body scroll lock with position restore, close by "X", backdrop click and Esc, focus trap and return, `role="dialog"` `aria-modal="true"` (research D-06, CB-15)
- [ ] T022 [P] Create `frontend/src/components/ExternalLink.tsx`: renders nothing (or plain text when `fallback="text"`) if `href` is null/empty, otherwise `<a target="_blank" rel="noopener noreferrer">` (FR-064, CB-01)
- [ ] T023 Create `frontend/src/hooks/useContacto.tsx` (context that calls `/api/contacto` once per visit, FR-007) and `frontend/src/hooks/useReserva.tsx` (context with `abrirReserva()` / `cerrarReserva()` for the single reservation modal, R-02)
- [ ] T024 Create `frontend/src/main.tsx` and `frontend/src/App.tsx`: providers (contacto, reserva), React Router routes `/`, `/experiencias`, `/comodidades`, `/como-llegar`, `/faqs` with placeholder pages in `frontend/src/pages/`, unknown routes → `<Navigate to="/" />`, smooth scroll to `location.hash` after data renders (research D-07)
- [ ] T025 [P] Create `frontend/src/components/ReservarButton.tsx` (variants "Predeterminado" and "Variante 2" as hover, color `cta`, labels "RESERVAR"/"RESERVA") calling `abrirReserva()` (FR-003)
- [ ] T026 Create `frontend/src/components/Header.tsx` from frames `304:37` (web) and `278:2` (mobile "Barra" 57 px): web links EXPERIENCIAS · COMODIDADES · COMO LLEGAR · FAQS, logo → `/`, `ReservarButton`; mobile logo + hamburger icon (menu wired in US7); mount it in `frontend/src/App.tsx` (FR-001)
- [ ] T027 [P] Create shared `frontend/src/components/Banner.tsx` (page banner 1456×402 / 393×172, title + intro, FR-068) and `frontend/src/components/CallToAction.tsx` ("CASACOSTA TE ESPERA" block with `ReservarButton` "RESERVA", frames `424:307` / `523:1347`)
- [ ] T028 Create the visual verification runner `frontend/e2e/visual/visual.spec.ts` per `contracts/visual-verification.md` (reads `frontend/e2e/visual/expected/*.json`, waits `document.fonts.ready`, checks `document.fonts.check` for Nunito and Inter, opens the requested state, compares `data-fv` boxes ±2 px, checks no horizontal scroll at 393/768/1024/1456 px, saves screenshots to `frontend/e2e/visual/output/`), plus `frontend/e2e/visual/REVIEW.md` with the review table header

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Elegir canal de reserva desde cualquier CTA (Priority: P1) 🎯 MVP

**Goal**: Cualquier botón de reserva abre el mismo modal con DIRECTO (WhatsApp) y BOOKING.

**Independent Test**: Pulsar RESERVAR en el header abre el modal; DIRECTO abre `whatsapp_url` y BOOKING abre `booking_url` en pestaña nueva; un canal sin configurar no se muestra.

### Tests for User Story 1

- [ ] T029 [P] [US1] Component test `frontend/tests/ReservaModal.test.tsx`: both channels visible; `bookingUrl = null` hides BOOKING and its text; both null shows "En este momento no podemos mostrar las opciones de reserva. Intenta de nuevo más tarde."; closes with "X", Esc and backdrop; links have `target="_blank"` and `rel="noopener noreferrer"`
- [ ] T030 [P] [US1] E2E `frontend/e2e/reserva.spec.ts` (mobile + desktop): acceptance scenarios 1–5 of User Story 1, including scroll position preserved after closing

### Implementation for User Story 1

- [ ] T031 [US1] Export the modal assets (close icon, decorations) from frames `459:550` and `505:854` into `frontend/public/img/modal/`
- [ ] T032 [US1] Implement `frontend/src/components/ReservaModal.tsx` on `Overlay`: "RESERVA YA", "Conoce las dos formas de reservar en Casa Costa:", web two columns (container 973×336, radius 50 px) / mobile stacked card 327×529, DIRECTO → `contacto.whatsappUrl`, BOOKING → `contacto.bookingUrl` via `ExternalLink`, missing-channel rules of FR-004; mount it once in `frontend/src/App.tsx` controlled by `useReserva`
- [ ] T033 [US1] Create expected boxes `frontend/e2e/visual/expected/modal-reserva.1456.json` and `modal-reserva.393.json` (state `modal-abierto`) from frames `459:550` / `505:854`, export their PNGs to `frontend/e2e/visual/frames/`, run `npm run test:visual` and record the overlay review in `frontend/e2e/visual/REVIEW.md` (FR-070)

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Ver planes y promociones con precio y detalle (Priority: P1)

**Goal**: Experiencias lista 3 planes y 2 promociones con su pop-up de detalle, precios y enlaces a destinos.

**Independent Test**: En `/experiencias` se ven 3 planes y 2 promociones; cada uno abre su pop-up con precio(s) formateados y RESERVAR; los destinos registrados son enlaces a su bloque en Tours.

### Tests for User Story 2

- [ ] T034 [P] [US2] API test `backend/tests/planes.test.ts`: `?categoria=plan` → 3 ordered by `orden, id`; `?categoria=promocion` → 2; no param → 5; `?categoria=tour` → 400 `INVALID_PARAM`; `/api/planes/plan-capurgana-intrepida` → `precioNormal` 1100000 and `precioTemporadaBaja` 980000; inactive or unknown slug → 404; slug with `../`, spaces or uppercase → 400; empty table → 200 `{ "data": [] }`; `/api/destinos` → 3 ordered
- [ ] T035 [P] [US2] Unit test `frontend/tests/linkDestinos.test.tsx`: exact, case- and accent-sensitive match of `destinos.nombre` inside `descripcion`; "Plan Conoce Capurganá" links Playa La Miel en Panamá, Bahía Sapzurro and Cabo Tiburón; "Bahía Aguacate" and "Reserva Natural El Cielo" stay plain text; no destinos → no links (FR-024)
- [ ] T036 [P] [US2] E2E `frontend/e2e/experiencias.spec.ts`: acceptance scenarios 1–7 of User Story 2 in mobile and desktop

### Implementation for User Story 2

- [ ] T037 [P] [US2] Implement `backend/src/routes/planes.ts`: `GET /api/planes` (validate optional `categoria` before querying; `WHERE activo = 1 [AND categoria = @categoria] ORDER BY orden ASC, id ASC`) and `GET /api/planes/:slug` (validate slug; `WHERE slug = ? AND activo = 1`; undefined → 404), mapping snake_case → camelCase; mount in `backend/src/server.ts`
- [ ] T038 [P] [US2] Implement `backend/src/routes/destinos.ts` (`SELECT id, slug, nombre, descripcion, destacado, imagen_url FROM destinos ORDER BY orden ASC, id ASC`); mount in `backend/src/server.ts`
- [ ] T039 [P] [US2] Export from Figma the plan/promotion photos (backgrounds without embedded text), the Transporte · Comida · Tours icons and the destination images of frame `14:39` into `frontend/public/img/planes/`, `frontend/public/img/iconos/` and `frontend/public/img/destinos/` (WebP for photos, SVG for vectors)
- [ ] T040 [P] [US2] Create `frontend/src/linkDestinos.tsx` returning the description as React nodes with each existing destination name wrapped in an underlined link to `#destino-{slug}` (FR-024)
- [ ] T041 [P] [US2] Implement `frontend/src/components/PlanCard.tsx` replicating the poster composition of the carousel frames: `imagenUrl` as background, name, `formatDuracion(duracionDias)` and prices (single price, or low-season highlighted + "Precio normal $X") from the API; no itinerary, "Incluye" or 4-dot indicator; without image → same content on `primary` (FR-021, clarificación 2)
- [ ] T042 [US2] Implement `frontend/src/components/PlanPopup.tsx` on `Overlay` from frames `199:383`, `514:710`, `514:836`, `514:914`, `514:1029` / `369:541`, `369:587`, `369:602`, `384:290`, `384:305`: backdrop at 95 % opacity, web container 1318×615 radius 50 px, mobile card 346×606; image, name, `linkDestinos(descripcion)`, `textoIdeal` only if not null, price rules of FR-023, RESERVAR closes the popup then calls `abrirReserva()`; fetch `/api/planes/:slug` and show "Este plan ya no está disponible. Escríbenos por WhatsApp y te ayudamos a encontrar otro." on 404 (WhatsApp mention only if `whatsappUrl` exists); clicking a destination link closes the popup and scrolls to its block (FR-023, FR-024, CB-04, CB-11, CB-13, CB-15, CB-16)
- [ ] T043 [US2] Implement `frontend/src/pages/Experiencias.tsx` from frames `14:39` / `167:162`: `Banner` "EXPERIENCIAS", PLANES header with icons and "Todos nuestros planes incluyen:", plans `Carousel` of `PlanCard`, "Contamos con acomodación de 1 a 8 personas", PROMOCIONES header "Disfruta de estos increíbles precios" with its `Carousel`, Tours banner with `id="tours"`, one block per destination with `id="destino-{slug}"` (image radius 15 px, name, description, `destacado` if not null; one image per destination in both views, Q-06), `SectionState` for each API section with the plan/promotion empty messages
- [ ] T044 [US2] Create expected boxes for `experiencias.1456.json` / `experiencias.393.json` and popup states (`popup-plan-*`, `popup-promo-*`) from the frames of FR-067, export frame PNGs, run `npm run test:visual` and record the review in `frontend/e2e/visual/REVIEW.md`

**Checkpoint**: User Stories 1 and 2 work independently

---

## Phase 5: User Story 3 - Conocer las habitaciones (Priority: P2)

**Goal**: Comodidades muestra las 5 habitaciones con datos, 3 imágenes y galería, más Alimentación.

**Independent Test**: En `/comodidades` se navega por las 5 habitaciones; en escritorio las miniaturas cambian la imagen de la tarjeta; en mobile se desliza entre habitaciones e imágenes; no hay precio.

### Tests for User Story 3

- [ ] T045 [P] [US3] API test `backend/tests/habitaciones.test.ts`: list of 5 ordered, each with 3 `imagenes` ordered and `precio` null; `/api/habitaciones/habitacion-3` → `camasDescripcion` "1 cama doble y 1 litera", `capacidadMax` 3; unknown slug → 404; invalid slug → 400
- [ ] T046 [P] [US3] E2E `frontend/e2e/comodidades.spec.ts`: acceptance scenarios 1–3 of User Story 3 plus thumbnail click changing the card image (desktop) and image reset when changing room

### Implementation for User Story 3

- [ ] T047 [P] [US3] Implement `backend/src/routes/habitaciones.ts`: list (`listHabitaciones` + `listImagenes`, grouped in TypeScript into `imagenes`) and detail by slug (validate slug; 404 if missing), queries as in spec Anexo A.4; mount in `backend/src/server.ts`
- [ ] T048 [P] [US3] Export from Figma the 3 images per room (`frontend/public/img/habitaciones/{slug}-{1..3}.webp`), the food images and the comfort icons (snowflake, toilet, wifi) into `frontend/public/img/`
- [ ] T049 [P] [US3] Implement `frontend/src/components/HabitacionCard.tsx` from `551:3055` / `454:896`: card 329×316 on mobile, active image with label "Hasta {capacidadMax} personas", name, `camasDescripcion`, "Hasta {capacidadMax} personas", no price field (R-22); mobile mini-carousel of the 3 images with indicator; no images → `surface` placeholder (CB-10)
- [ ] T050 [P] [US3] Implement `frontend/src/components/HabitacionDetalle.tsx` (desktop panel): 3 thumbnails radius 15 px with the active one highlighted, keyboard operable, click sets the card image; name, `tipo`, `descripcion` (FR-033)
- [ ] T051 [US3] Implement `frontend/src/pages/Comodidades.tsx` from `27:16` / `167:1017`: `Banner` "COMODIDADES" with the definitive intro of constitution P-14, "HABITACIONES", "Todas nuestras habitaciones cuentan con:" with Aire acondicionado · Baño privado · WiFi (P-20), "Anímate a conocer más de nuestras habitaciones", rooms `Carousel` (desktop: card + detail per slide with arrows; mobile: swipe; active image resets to the first on room change), ALIMENTACIÓN with its 3-image `Carousel`, `SectionState` with "No pudimos mostrar las habitaciones en este momento."
- [ ] T052 [US3] Create expected boxes `comodidades.1456.json` / `comodidades.393.json` (including the 329×316 card, FR-068) and room-carousel states from `454:896`, `551:3055`, `526:1660`, export frame PNGs, run `npm run test:visual` and record the review in `frontend/e2e/visual/REVIEW.md`

**Checkpoint**: User Story 3 works independently

---

## Phase 6: User Story 4 - Leer reseñas y calificaciones (Priority: P2)

**Goal**: Inicio completo con calificaciones GOOGLE/BOOKING y carrusel de reseñas con pop-up.

**Independent Test**: En `/` se ven 4.7 GOOGLE y 9.0 BOOKING y 3 reseñas; LEER MÁS / VER MÁS abre el texto completo con fecha `10/10/2025` y sin plataforma de origen.

### Tests for User Story 4

- [ ] T053 [P] [US4] API test `backend/tests/resenas.test.ts`: 3 reseñas ordered; `calificaciones` GOOGLE (4.7/5) then BOOKING (9.0/10); empty tables → 200 with empty arrays
- [ ] T054 [P] [US4] E2E `frontend/e2e/inicio.spec.ts`: acceptance scenarios 1–3 of User Story 4 and robustness scenario 2 (reseñas endpoint failing → section message, rest of the page visible)

### Implementation for User Story 4

- [ ] T055 [P] [US4] Implement `backend/src/routes/resenas.ts` (`listResenas` + `listCalificaciones` ordered `GOOGLE`, `BOOKING`) returning `{ resenas, calificaciones }`; mount in `backend/src/server.ts`
- [ ] T056 [P] [US4] Export from Figma the hero image (1456×560 / 393×489), the 3 comfort images, the tours image, the CTA background and the star icon into `frontend/public/img/inicio/`
- [ ] T057 [P] [US4] Implement `frontend/src/components/ResenaCard.tsx` (avatar with the author's initial on `secondary-1`, author, `formatEstrellas`, title, "LEER MÁS" pill radius 50 px on desktop / "VER MÁS" on mobile, no body text) and `frontend/src/components/ResenaPopup.tsx` on `Overlay` (frames `304:137`, `454:1678`, `454:1690` / `344:362`, `369:377`, `369:391`: avatar, author, stars, `formatFecha`, title, full text, close) (FR-014, FR-015, R-14, R-16)
- [ ] T058 [US4] Implement `frontend/src/pages/Inicio.tsx` from `12:2` / `158:182`: hero "TU ESCAPE A CAPURGANÁ" in both views with the subtitle (FR-010), "Todas las comodidades a tu disposición" (desktop 3 static images, mobile 3-image `Carousel` with dots) with "Ver opciones" → `/comodidades` (FR-011), "Descubre a Capurganá por completo" with "Conoce más" → `/experiencias#tours` (FR-012), "Nuestras Reseñas" with `formatPuntaje` per platform hiding missing ones (FR-013), reviews `Carousel` of `ResenaCard` opening `ResenaPopup`, `CallToAction`, `SectionState` with "Aún no hay reseñas para mostrar."
- [ ] T059 [US4] Create expected boxes `inicio.1456.json` / `inicio.393.json` (hero 1456×560 / 393×489, FR-068) and review-popup states, export frame PNGs, run `npm run test:visual` and record the review in `frontend/e2e/visual/REVIEW.md`

**Checkpoint**: User Story 4 works independently

---

## Phase 7: User Story 5 - Saber cómo llegar (Priority: P2)

**Goal**: Cómo llegar muestra la vía directa y la ruta mixta con botones a vuelo, bus y WhatsApp.

**Independent Test**: En `/como-llegar` COMPRA AHORA / Agenda tu vuelo abre `vuelo_url`, Consulta tiquetes abre `bus_url` (ambas vistas) y VER MÁS abre `whatsapp_url`; un enlace no configurado oculta su botón.

### Tests for User Story 5

- [ ] T060 [P] [US5] E2E `frontend/e2e/como-llegar.spec.ts`: acceptance scenarios 1–3 of User Story 5 in both views, and with the seed lacking `vuelo_url`/`bus_url` the corresponding buttons are absent (CB-01)

### Implementation for User Story 5

- [ ] T061 [P] [US5] Export from Figma the plane, clock, bus, car and boat icons and the mobile option images of `27:38` / `167:1501` into `frontend/public/img/como-llegar/`
- [ ] T062 [US5] Implement `frontend/src/pages/ComoLlegar.tsx`: `Banner` "¿CÓMO LLEGAR?" with the web intro (P-14), "TUS OPCIONES", "Para llegar a Casa Costa", "Opción 1:" / "Opción 2:" in both views; VÍA DIRECTA card with "COMPRA AHORA" (desktop) / "Agenda tu vuelo" (mobile) → `vueloUrl`; RUTA MIXTA card with EN BUS (plus "Consulta tiquetes" → `busUrl` in both views, desktop styled as "COMPRA AHORA" radius 14 px), EN TU VEHÍCULO, EN LANCHA and "VER MÁS" → `whatsappUrl`; rectangular `cta` buttons radius 14/10 px; `CallToAction` in both views (FR-040, FR-041)
- [ ] T063 [US5] Create expected boxes `como-llegar.1456.json` / `como-llegar.393.json`, export frame PNGs, run `npm run test:visual` and record the review (excepciones: "Consulta tiquetes" en web, banner CTA y "Opción N:" en mobile) in `frontend/e2e/visual/REVIEW.md`

**Checkpoint**: User Story 5 works independently

---

## Phase 8: User Story 6 - Resolver dudas frecuentes (Priority: P3)

**Goal**: FAQs muestra las 3 preguntas en acordeón accesible.

**Independent Test**: En `/faqs` al hacer clic en una pregunta se despliega su respuesta y `aria-expanded` cambia; no aparecen preguntas de prueba ni la de mascotas.

### Tests for User Story 6

- [ ] T064 [P] [US6] API test `backend/tests/faqs.test.ts`: 3 FAQs ordered with the constitution answers; empty table → 200 `{ "data": [] }`
- [ ] T065 [P] [US6] Component test `frontend/tests/Acordeon.test.tsx`: closed by default, toggles with click, Enter and Space, `aria-expanded` true/false, several open at once (Q-14)
- [ ] T066 [P] [US6] E2E `frontend/e2e/faqs.spec.ts`: acceptance scenarios 1–3 of User Story 6 and robustness scenario 3 (empty list message)

### Implementation for User Story 6

- [ ] T067 [P] [US6] Implement `backend/src/routes/faqs.ts` (`SELECT id, pregunta, respuesta FROM faqs ORDER BY orden ASC, id ASC`); mount in `backend/src/server.ts`
- [ ] T068 [P] [US6] Implement `frontend/src/components/Acordeon.tsx` from `458:423` (Closed 81 px / Open 167 px, `surface` background, radius 10 px, chevron icon) with button + `aria-expanded` + `aria-controls`
- [ ] T069 [US6] Implement `frontend/src/pages/Faqs.tsx` from `31:2` / `167:1620`: `Banner` "¿QUÉ PREGUNTAS TIENES?" with the web text (FR-050), desktop two columns alternating by `orden` / mobile one column, `SectionState` with "Pronto publicaremos las preguntas frecuentes. Mientras tanto, escríbenos por WhatsApp." (WhatsApp mention only if `whatsappUrl` exists)
- [ ] T070 [US6] Create expected boxes `faqs.1456.json` / `faqs.393.json` with states `acordeon-closed` and `acordeon-open`, export frame PNGs, run `npm run test:visual` and record the review in `frontend/e2e/visual/REVIEW.md`

**Checkpoint**: User Story 6 works independently

---

## Phase 9: User Story 7 - Navegar y ver datos de contacto (Priority: P3)

**Goal**: Menú mobile, footer con enlaces de contacto y botón flotante de WhatsApp en todas las páginas.

**Independent Test**: El menú mobile navega y se cierra; el footer muestra los datos de `configuracion` con Instagram → `instagram_url` y teléfono → `whatsapp_url`; el botón flotante abre WhatsApp.

### Tests for User Story 7

- [ ] T071 [P] [US7] Component test `frontend/tests/Footer.test.tsx`: Instagram links to `instagramUrl`, phone links to `whatsappUrl`, address is plain text, rows without text data are hidden, Instagram/phone fall back to text when their URL is null (FR-005)
- [ ] T072 [P] [US7] E2E `frontend/e2e/navegacion.spec.ts`: acceptance scenarios 1–4 of User Story 7 on every route, plus header links on desktop and unknown route redirecting to `/`

### Implementation for User Story 7

- [ ] T073 [P] [US7] Export from Figma the logo (icon + wordmark), hamburger, close, Instagram, phone and WhatsApp assets into `frontend/public/img/global/`
- [ ] T074 [P] [US7] Implement `frontend/src/components/MobileMenu.tsx` from `270:32` on `Overlay`: right panel 225 px over dimmed backdrop, Inicio · Experiencias · Comodidades · Como llegar · FAQS navigate and close, RESERVAR closes the menu then calls `abrirReserva()`, close icon; wire the hamburger in `frontend/src/components/Header.tsx` (FR-002)
- [ ] T075 [P] [US7] Implement `frontend/src/components/Footer.tsx` from `454:2856` / `523:1298`: "Contáctanos", Instagram (`instagram` → `instagramUrl`), phone (`telefono` → `whatsappUrl`), "Reservas / Booking.com" → `bookingUrl`, "Dirección" as text, all links via `ExternalLink` (FR-005, P-21)
- [ ] T076 [P] [US7] Implement `frontend/src/components/WhatsAppButton.tsx` (fixed bottom-right circle 85 px desktop / 63 px mobile, hidden without `whatsappUrl`) (FR-006)
- [ ] T077 [US7] Mount `Footer` and `WhatsAppButton` in the layout of `frontend/src/App.tsx` so they appear on every page, including FAQs desktop (Q-08)
- [ ] T078 [US7] Create expected boxes for header, footer and WhatsApp button on each page and the `menu-abierto` state (`270:32`), export frame PNGs, run `npm run test:visual` and record the review in `frontend/e2e/visual/REVIEW.md`

**Checkpoint**: All user stories independently functional

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T079 [P] Constitution compliance sweep over `frontend/src/` and `backend/src/`: no hex colors, fonts or radii outside `frontend/tailwind.config.ts`; no ORM; every SQL is a prepared statement with parameters; only `GET` endpoints; no hard-coded contact data or URLs in components (SC-002)
- [ ] T080 [P] Performance check of the production build (`npm run build && npm start`) with Lighthouse mobile on `/` and `/experiencias`: LCP < 2,5 s and CLS < 0,1; fix image sizes/formats in `frontend/public/img/` if needed
- [ ] T081 Run the full visual suite at 393 and 1456 px and confirm every screen and state has a completed row in `frontend/e2e/visual/REVIEW.md` with no unlisted deviation (FV-04, FV-07, SC-004)
- [ ] T082 Run every step of `specs/001-sitio-casacosta/quickstart.md` (setup, API checks, `npm test`, `npm run test:e2e`, `npm run test:visual`, manual walkthrough, production) and fix any failure

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies.
- **Foundational (Phase 2)**: depends on Setup; blocks all user stories. T007 (seed) depends on T005–T006; T011 before T012; T023 before T024–T026.
- **User Stories (Phases 3–9)**: all depend only on Foundational and can proceed in parallel or in priority order (P1 → P2 → P3).
- **Polish (Phase 10)**: depends on all desired stories.

### User Story Dependencies

- **US1 (P1)**: only Foundational (uses the header RESERVAR from T026).
- **US2 (P1)**: only Foundational; its RESERVAR opens the modal of US1 if present (otherwise the context call is a no-op until US1 is merged).
- **US3, US4, US5 (P2)** and **US6, US7 (P3)**: only Foundational. US4 and US5 reuse `CallToAction` (T027).
- Each story touches `backend/src/server.ts` only to mount its own router (one line), so parallel work merges trivially.

### Within Each User Story

- Tests are written alongside or before implementation and must pass at the checkpoint.
- Backend route → assets → components → page → visual verification (FV-07 closes each screen).

### Parallel Opportunities

- Setup: T003 and T004 in parallel after T002.
- Foundational: T008–T010, T013 and T015–T022 in parallel; T025 and T027 in parallel after T023.
- Across stories: once Phase 2 is done, US1…US7 can be assigned to different people.
- Inside each story: all tasks marked [P] (tests, backend route, assets, independent components).

---

## Parallel Example: User Story 2

```bash
# Tests together:
Task: "API test backend/tests/planes.test.ts"
Task: "Unit test frontend/tests/linkDestinos.test.tsx"
Task: "E2E frontend/e2e/experiencias.spec.ts"

# Independent implementation pieces together:
Task: "backend/src/routes/planes.ts"
Task: "backend/src/routes/destinos.ts"
Task: "Export plan, icon and destination images from Figma"
Task: "frontend/src/linkDestinos.tsx"
Task: "frontend/src/components/PlanCard.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "API test backend/tests/habitaciones.test.ts"
Task: "backend/src/routes/habitaciones.ts"
Task: "frontend/src/components/HabitacionCard.tsx"
Task: "frontend/src/components/HabitacionDetalle.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (database, API base, tokens, layout, header).
3. Complete Phase 3: User Story 1 (reservation modal).
4. **STOP and VALIDATE**: test US1 independently (T029, T030, T033).
5. Demo: any page's RESERVAR leads to WhatsApp or Booking in ≤ 2 interactions (SC-001).

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. US1 → reservation works (MVP).
3. US2 → Experiencias with plans and promotions (second P1).
4. US3, US4, US5 → Comodidades, Inicio, Cómo llegar (P2).
5. US6, US7 → FAQs, mobile menu, footer and WhatsApp (P3).
6. Polish → compliance, performance and the full visual review.

### Notes

- Content still pending (not blocking): `vuelo_url` and `bus_url` values (research D-11) — their buttons stay hidden until added to `db/seed.sql`; Q-19 (road time) and Q-20 ("Reserva ahora" copy) need confirmation before publishing.
- Commit after each task or logical group; stop at any checkpoint to validate a story independently.
