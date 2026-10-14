# Research: Sitio web Hotel Casa Costa (MVP)

**Fecha**: 2026-10-13 · **Plan**: [plan.md](./plan.md)

Las decisiones se numeran `D-xx` para no confundirlas con las reglas `R-xx` de la constitución.
No quedan puntos "NEEDS CLARIFICATION" en el Technical Context.

## D-01 · Versiones compatibles con Node 18

- **Decision**: Node 18.20 (instalado); Vite 5.4, React 18.3, React Router 6, Tailwind 3.4,
  Express 4.21, `better-sqlite3` 11, TypeScript 5.6, Vitest 2, Playwright 1.48.
- **Rationale**: Vite 7 exige Node ≥ 20.19 y Tailwind 4 abandona `tailwind.config` (la
  constitución exige configurar los tokens ahí). `better-sqlite3` 11 publica binarios para Node 18
  en Windows, sin compilación nativa.
- **Alternatives considered**: Actualizar a Node 22 y usar Vite 7 / Tailwind 4 (rechazado:
  cambia el entorno y contradice "tema de Tailwind (`tailwind.config`)"). Express 5 (rechazado: su
  sintaxis de comodines cambia `app.all('/api/*')` del spec).

## D-02 · Tokens del UI Toolkit en Tailwind

- **Decision**: `tailwind.config.ts` **reemplaza** `theme.colors`, `theme.fontFamily`,
  `theme.borderRadius` y `theme.fontSize` con los tokens de la constitución (colores
  `primary`, `white`, `cta`, `secondary-1…4`, `surface`, más `transparent`/`current`; fuentes
  `nunito` e `inter`; tamaños por rol, p. ej. `titulo` 28/64, `subtitulo` 24/48,
  `encabezado` 20/36, `boton` 12/30, `caption` 12/26, `parrafo` 12/22; radios `pill` 50,
  `btn` 10 mobile / 14 escritorio, `img` 15, `bloque` 10). Breakpoint único `lg` = 1456 px con
  contenedor de márgenes 30/80 px y gutters 16/24 px.
- **Rationale**: Reemplazar (no extender) hace imposible usar colores o radios ajenos al toolkit
  (Principio IV) y vuelve verificable la regla en revisión de código.
- **Alternatives considered**: `theme.extend` (rechazado: deja disponible la paleta por defecto).
  Breakpoints intermedios (se añadirán solo si la verificación entre 393 y 1456 px muestra
  desbordes; FV-03 pide adaptación fluida, resuelta con `clamp()`/porcentajes en los
  contenedores).

## D-03 · Fuentes reales (FV-06)

- **Decision**: `@fontsource/nunito` y `@fontsource/inter` (auto-alojadas), solo con los pesos que
  usen los frames (se leen con `get_design_context`). `font-display: swap` y precarga del peso
  principal; la verificación de FR-070 comprueba con `document.fonts.check()` que ambas fuentes
  cargaron.
- **Rationale**: Auto-alojar evita depender de Google Fonts y garantiza que la fuente se carga
  realmente; comprobarla en las pruebas cumple "nunca una fuente de respaldo como sustituto".
- **Alternatives considered**: `<link>` a Google Fonts (rechazado: dependencia externa y sin
  control de carga en pruebas).

## D-04 · Íconos y assets desde Figma

- **Decision**: Capas `lucide/*` → `lucide-react` con el mismo nombre y grosor del frame. Íconos
  no-lucide (logo, WhatsApp, íconos de planes) e imágenes → exportados desde Figma
  (`download_assets`) a `frontend/public/img/` en WebP (fotos) o SVG (vectores), con ancho
  máximo 2× el tamaño del frame.
- **Rationale**: Cumple FV-06 y FV-01 (iconografía idéntica); WebP reduce peso para el objetivo
  de LCP.
- **Alternatives considered**: Recrear íconos a mano (rechazado: desviación visual).

## D-05 · Carruseles sin librería

- **Decision**: Hook propio `useCarousel` (índice activo, circular, sin autoplay — Q-21) y un
  componente `Carousel`. Web: flechas, elemento activo centrado y laterales al 50 % de
  opacidad. Mobile: deslizamiento con CSS `scroll-snap` sincronizado con el índice
  (IntersectionObserver) e indicador de puntos.
- **Rationale**: Cinco carruseles con el mismo patrón; un hook pequeño es más simple que una
  dependencia (Principio V) y permite replicar exactamente la composición de Figma.
- **Alternatives considered**: Swiper / Embla (rechazados: dependencia extra y estilos por
  defecto que hay que anular para cumplir FV-01).

## D-06 · Capas (modal, pop-ups, menú)

- **Decision**: Hook `useOverlay`: una sola capa abierta a la vez (CB-15), bloqueo del scroll del
  `body` con restauración de la posición, cierre con "X", clic en el fondo y Esc (Q-10), foco
  atrapado dentro de la capa y devuelto al disparador al cerrar, `role="dialog"` y
  `aria-modal="true"`. El modal de reserva vive en un contexto global (`useReserva`) para que
  cualquier CTA lo abra (R-02).
- **Rationale**: Cubre los casos borde y la accesibilidad sin librería.
- **Alternatives considered**: `<dialog>` nativo (viable; se descarta por la necesidad de animar
  y controlar el fondo al 95 % de forma idéntica al frame).

## D-07 · Rutas y anclas

- **Decision**: React Router 6 con `/`, `/experiencias`, `/comodidades`, `/como-llegar`,
  `/faqs`; ruta desconocida → redirige a `/` (Q-17). Anclas `#tours` y `#destino-{slug}`; al
  navegar a un ancla se hace scroll suave tras renderizar los datos.
- **Rationale**: Rutas propuestas en el spec (Q-01); el scroll a ancla debe esperar a que los
  destinos carguen desde la API.
- **Alternatives considered**: Una sola página con secciones (rechazado: el diseño tiene páginas
  separadas).

## D-08 · API Express y manejo de errores

- **Decision**: Backend ESM; ruta a la base resuelta con
  `fileURLToPath(new URL('../../db/casacosta.db', import.meta.url))` (el `__dirname` del Anexo
  A no existe en ESM). Handlers síncronos (better-sqlite3 es síncrono), por lo que cualquier
  excepción llega al middleware de errores → `500 INTERNAL_ERROR` con el detalle solo en
  `console.error`. Validación antes de consultar (`slug`, `categoria`). Catch-all `/api/*`
  después de las rutas: `GET` → 404, otro método → 405 con `Allow: GET` (Anexo A del spec).
  `GET /api/planes` sin `categoria` devuelve ambas categorías activas (Q-18). JSON con
  `Content-Type: application/json; charset=utf-8`.
- **Rationale**: Cumple el Principio VI con el mínimo de código.
- **Alternatives considered**: Validación con una librería de esquemas (rechazado: solo hay dos
  parámetros).

## D-09 · Construcción de la base

- **Decision**: `backend/scripts/build-db.ts` borra y recrea `db/casacosta.db`, activa
  `foreign_keys`, ejecuta `schema.sql` y `seed.sql` dentro de una transacción y termina con
  código ≠ 0 si cualquier `CHECK`, `UNIQUE` o `FOREIGN KEY` falla (CB-07…CB-09). La base no se
  versiona; se genera en `npm run db:build` y antes de `build`/`test`.
- **Rationale**: Una base inválida nunca llega a ejecutarse.
- **Alternatives considered**: Migraciones incrementales (rechazado: no hay escritura en
  producción; recrear es más simple).

## D-10 · Tipos compartidos

- **Decision**: `backend/src/types.ts` es la única definición; el frontend la importa con
  `import type` mediante el alias `@api/types` (Vite y `tsconfig` `paths`).
- **Rationale**: Una sola fuente de verdad para el contrato sin crear un paquete adicional.
- **Alternatives considered**: Carpeta `shared/` (rechazado: añade una carpeta fuera de la
  estructura de la constitución).

## D-11 · Contenido semilla y datos pendientes

- **Decision**: `seed.sql` toma los datos de la constitución ("Contenido confirmado") y el resto
  de los textos de los frames de Figma, con las erratas de P-15 corregidas. El inventario está en
  [data-model.md](./data-model.md#contenido-semilla).
- **Pendientes sin fuente (no se inventan, Principio VII):** valores de `vuelo_url` (Moon
  Flights chárter) y `bus_url` (redBus Medellín–Necoclí) — la constitución nombra el servicio pero
  no la URL; duración de algunos planes/promociones y textos de habitaciones y reseñas, que se
  leen del frame correspondiente al escribir el seed. Mientras falte una URL, su botón no se
  muestra (CB-01).
- **Rationale**: Mantiene la trazabilidad de cada dato.
- **Alternatives considered**: Escribir URLs de búsqueda genéricas (rechazado: sería inventar).

## D-12 · Estrategia de pruebas y verificación visual

- **Decision**:
  - **API (Vitest + Supertest)** sobre una base construida desde el seed: cada endpoint, 400/404/
    405/500, formato `{ data }`/`{ error }`, listas vacías con 200.
  - **Componentes (Vitest + RTL)**: formateadores (`$1.100.000`, `10/10/2025`, `9.0`,
    "1 ESTRELLA"), modal con canales ausentes, acordeón con `aria-expanded`, detección de
    destinos en descripciones (FR-024), estados de sección.
  - **E2E (Playwright)**: escenarios de aceptación de las historias 1–7 en 393 y 1456 px,
    con la API real; incluye que los enlaces externos usen `target="_blank"` y
    `rel="noopener noreferrer"`.
  - **Visual (FR-070)**: por pantalla y estado, Playwright mide `getBoundingClientRect()` de los
    elementos marcados con `data-fv="<id>"` y los compara con las cajas esperadas extraídas de
    Figma (±2 px); además genera capturas para la revisión con superposición sobre la
    exportación del frame. Formato en
    [contracts/visual-verification.md](./contracts/visual-verification.md).
- **Rationale**: Cada nivel prueba lo que mejor puede probar; la comparación de cajas evita los
  falsos positivos que daría una comparación píxel a píxel con textos distintos (FV-02).
- **Alternatives considered**: Diff de píxeles (rechazado en la clarificación 1).

## D-13 · Producción

- **Decision**: `npm run build` compila el frontend a `frontend/dist` y el backend a
  `backend/dist`; en producción Express sirve `frontend/dist` y responde `index.html` para las
  rutas del frontend (todo lo que no empiece por `/api`).
- **Rationale**: Un solo proceso Node; no hay requisitos de despliegue en el spec.
- **Alternatives considered**: Hosting estático separado + API (rechazado: más piezas sin
  necesidad declarada).
