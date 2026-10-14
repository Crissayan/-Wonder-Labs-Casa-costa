<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.0 → 1.1.1
Tipo de cambio: PATCH — se cierra contenido pendiente (P-10, P-14) y se precisa P-13. No cambia
ningún principio, regla R-xx, esquema ni contrato de API.

Principios modificados: ninguno.

Secciones modificadas:
  - Preguntas Abiertas y Decisiones:
    · "Preguntas abiertas": queda vacía (P-10 y P-14 cerradas).
    · "Registro de decisiones": P-10 y P-14 pasan a cerradas con el contenido aprobado; P-13
      aclara que el destino del enlace se define en el spec.md de Experiencias.
    · "Contenido confirmado para seed.sql": 3 FAQs con respuesta; "¿Puedo llevar a mi
      mascota?" fuera del seed; texto definitivo de introducción de Comodidades.

Secciones añadidas: ninguna.
Secciones eliminadas: ninguna.

Plantillas dependientes: sin cambios requeridos.

Notas de trazabilidad:
  - El contenido de P-10 y P-14 lo aporta el responsable del proyecto (no proviene de Figma),
    incluidos "aproximadamente 1,5 horas" de vuelo, la "planta de energía" y la mención de
    Bahía Aguacate en el plan Capurganá Intrépida.

TODOs diferidos:
  - "¿Puedo llevar a mi mascota?": pendiente de la política del hotel; se agregará como cambio
    de contenido en seed.sql, sin enmendar la constitución.
  - P-13: destino concreto del enlace a definir en el spec.md de Experiencias.
-->

# Constitución del Proyecto — [WonderLabs] CasaCosta

> Documento rector del proyecto. Toda especificación (`spec.md`) y todo código DEBEN respetar
> esta constitución. Si algo la contradice, prevalece este documento hasta que se actualice
> explícitamente.
>
> **Fuentes analizadas:** `CasaCostaWeb.pdf`, `CasaCostaMobile.pdf`, `CasaCostaUIToolKit.pdf`
> (exportaciones de Figma) y el archivo Figma `FUuT2oETZHhIh0PIIBFDHX` (evidencia de la
> enmienda 1.1.0). El contenido cerrado en la enmienda 1.1.1 (P-10, P-14) lo aporta el
> responsable del proyecto.

## Core Principles

### I. Alcance Estricto y Cero Código Sombra

- Se construye **estrictamente** lo documentado en `spec.md`. NO se añaden características
  "por si acaso".
- Quedan explícitamente **fuera de alcance**: motor de reservas propio, calendario de
  disponibilidad, carrito o checkout; pasarelas de pago; registro, login, perfiles de usuario
  o panel de administración; publicación de reseñas por parte de visitantes; y todo lo que no
  esté documentado en `spec.md`.
- El usuario es **anónimo**: no existe autenticación de ningún tipo.

**Justificación:** el sitio es informativo y de conversión; cada funcionalidad no pedida añade
mantenimiento y riesgo sin aportar al objetivo de llevar al visitante a reservar.

### II. La Reserva Ocurre Fuera del Sistema

- El sitio NO procesa reservas ni pagos (R-01).
- Todo CTA de reserva ("RESERVAR", "RESERVA", "RESERVA YA") DEBE abrir el **mismo modal**
  "Conoce las dos formas de reservar en Casa Costa" con dos canales: **DIRECTO** (abre
  `whatsapp_url`: WhatsApp con asesores y mensaje prellenado "Quiero más info sobre Hotel Casa
  Costa 🏝️") y **BOOKING** (abre `booking_url`, página de Casa Costa en Booking.com) (R-02).
- Los datos de contacto y enlaces externos DEBEN leerse de la tabla `configuracion`; está
  prohibido escribirlos en duro en los componentes (R-03). Los enlaces externos abren en
  pestaña nueva (R-20).

**Justificación:** los dos canales existentes ya resuelven disponibilidad y cobro; duplicarlos
crearía inconsistencias.

### III. Stack Fijo y SQL Puro (sin ORM)

- Frontend: **React** + **Tailwind CSS**, empaquetado con **Vite**. Backend: **Node.js** +
  **Express**.
- **TypeScript** en todo el stack (frontend, backend y scripts de base de datos).
- Base de datos: **SQLite** en un único archivo `/db/casacosta.db`.
- **Prohibido usar ORMs** (Prisma, TypeORM, Sequelize, etc.). Toda la persistencia se hace con
  **SQL puro** mediante **`better-sqlite3`**, siempre con *prepared statements* y parámetros;
  está prohibido concatenar valores en SQL.
- Al abrir la conexión DEBE ejecutarse `PRAGMA foreign_keys = ON;`.

**Justificación:** stack mínimo, verificable y sin capas de abstracción que oculten el SQL;
los parámetros previenen inyección SQL.

### IV. Sistema de Diseño Obligatorio (UI Toolkit)

- Los tokens del UI Toolkit (colores, tipografías, tamaños, retícula y radios) DEBEN
  configurarse como tema de Tailwind (`tailwind.config`).
- Está prohibido usar colores, fuentes o radios fuera de esos tokens. Los hex sueltos que
  aparecen en las pantallas de Figma (`#1C3149`, `#F9B43F`, `#282940`) NO se usan: se
  sustituyen por el token del toolkit equivalente (`primary`, `cta`).
- Los estilos se escriben solo con clases de Tailwind; CSS ad-hoc únicamente en casos
  imposibles de resolver con Tailwind, justificados en el código.
- Diseño **mobile-first**; las vistas de Figma de **393 px** (mobile) y **1456 px**
  (escritorio) son la referencia visual obligatoria.
- Todo el contenido visible está en **español** (R-17).

**Justificación:** garantiza fidelidad al diseño aprobado y coherencia visual entre pantallas.

### V. Simplicidad y Estructura Plana

- Estructura de carpetas: `/frontend`, `/backend`, `/db` (ver sección "Estructura y Estilo de
  Código").
- Prohibido implementar "Clean Architecture" o patrones complejos (repositorios, inyección de
  dependencias, capas de servicios, etc.).
- Programación funcional y componentes funcionales con Hooks; NO se usan clases salvo que sea
  obligatorio.

**Justificación:** el dominio es pequeño y de solo lectura; la complejidad estructural no se
justifica (YAGNI).

### VI. Errores Amigables y HTTP Semántico

- La UI NUNCA expone errores crudos ni stack traces; todo error técnico se traduce a un mensaje
  amigable en español.
- Una sección que no puede cargar sus datos muestra un mensaje amigable **en esa sección** sin
  romper el resto de la página. Las listas vacías muestran un estado vacío amigable.
- El backend DEBE responder con códigos HTTP semánticos (200, 400, 404, 405, 500) y el formato
  de respuesta definido en "Contratos de Datos".
- Parámetros de ruta y query se validan **antes** de ejecutar cualquier consulta.

**Justificación:** la experiencia del visitante no debe degradarse por fallos parciales, y
los clientes de la API necesitan respuestas predecibles.

### VII. Fuente de Verdad y Cero Suposiciones

- Si una instrucción del usuario contradice esta constitución, o se detecta una falla lógica,
  el agente DEBE **detenerse**, advertir del problema y solicitar actualizar `spec.md` (y, si
  aplica, esta constitución) antes de tocar el código fuente.
- Lo que no esté en Figma, en esta constitución o en `spec.md` se registra como **pregunta
  abierta**; NO se inventa.
- **Prioridad de fuentes:** esta constitución (reglas y datos) → `spec.md` (funcionalidad) →
  diseños de Figma (UI).
- **Regla web:** ante discrepancias de contenido o datos entre la vista web y la mobile,
  prevalece la **versión web**, salvo las excepciones registradas en "Preguntas Abiertas y
  Decisiones" (p. ej. P-20).

**Justificación:** Spec-Driven Development exige que el código derive de documentos
aprobados, no de suposiciones del implementador.

## Naturaleza del Proyecto

- **Qué es:** sitio web informativo y de conversión del **Hotel Casa Costa**, en Capurganá
  (Chocó/Antioquia, Colombia). Presenta el hotel, sus habitaciones, planes turísticos,
  destinos, reseñas, preguntas frecuentes y cómo llegar, y canaliza al visitante hacia la
  reserva.
- **Problema que resuelve:** dar al viajero toda la información necesaria para decidirse a
  visitar Capurganá con Casa Costa y llevarlo con el menor esfuerzo posible a reservar por uno
  de los dos canales existentes.
- **Usuarios principales:** viajeros (principalmente nacionales, con salida desde
  Medellín/Necoclí) que planean vacaciones en Capurganá. Usuario anónimo: **no hay registro,
  login ni perfiles**.
- **Plataformas:** web responsive con dos vistas diseñadas: escritorio (frame **1456 px**) y
  mobile (frame **393 px**, con menú hamburguesa).

### Mapa del sitio (derivado de Figma)

| Página | Contenido principal |
|---|---|
| **Inicio** | Hero ("Tu escape a Capurganá" / "Bienvenido al paraíso"), bloque de comodidades (CTA "Ver opciones"), bloque de tours (CTA "Conoce más"/"Conócelas"), carrusel de reseñas con calificación Google/Booking, banner "CasaCosta te espera" con CTA de reserva. |
| **Experiencias** | Planes (todos incluyen Transporte, Comida y Tours; acomodación de 1 a 8 personas), Promociones y Tours (destinos turísticos: Playa La Miel, Bahía Sapzurro, Cabo Tiburón). |
| **Comodidades** | Habitaciones (todas con aire acondicionado, baño privado y WiFi), tarjetas/carrusel por habitación con detalle, y sección Alimentación. |
| **Cómo llegar** | Opción 1: Vía directa (vuelo desde aeropuerto Olaya Herrera). Opción 2: Ruta mixta (bus o vehículo propio hasta Necoclí + lancha hasta Capurganá). |
| **FAQs** | Lista de preguntas en acordeón (pregunta → respuesta). |
| **Global** | Header con navegación (Experiencias, Comodidades, Cómo llegar, FAQs, Reservar) y footer de contacto (Instagram, teléfono/WhatsApp, Booking.com, dirección). |

### Flujos principales

1. **Explorar → Reservar:** cualquier CTA "RESERVAR" / "RESERVA" abre el modal **"Conoce las
   dos formas de reservar en Casa Costa"** con dos opciones:
   - **DIRECTO:** contacto con asesores de Casa Costa (WhatsApp).
   - **BOOKING:** redirección a la página de Casa Costa en Booking.com.
2. **Ver detalle de un plan:** en Experiencias, al abrir un plan se muestra un **pop-up**
   (fondo con opacidad 95 %) con descripción detallada, texto "ideal para…", precio y botón
   RESERVAR.
3. **Ver detalle de una habitación:** en Comodidades, al abrir una habitación se muestra el
   detalle (m², capacidad, camas, dotación, desayuno) con carrusel de imágenes.
4. **Leer una reseña completa:** en el carrusel de reseñas, "LEER MÁS" (web) / "VER MÁS"
   (mobile) muestra el texto completo.
5. **Consultar FAQs:** tap/clic en una pregunta despliega su respuesta.

## Stack Tecnológico y Sistema de Diseño

El stack es el definido en el Principio III. Los tokens siguientes son obligatorios
(Principio IV).

### Colores

| Token | Hex | Uso según toolkit |
|---|---|---|
| `primary` | `#1A364F` | Texto, fondos e íconos |
| `white` | `#FFFFFF` | Texto, fondos e íconos |
| `cta` | `#FAB53F` | Botones y CTA |
| `secondary-1` | `#3DBCD5` | Detalles pequeños, resaltar, textos en fondos oscuros |
| `secondary-2` | `#6AC6DE` | Ídem |
| `secondary-3` | `#A0D7E8` | Ídem |
| `secondary-4` | `#67C1BD` | Ídem |
| `surface` | `#EFEFEF` | Fondos neutros de superficie (añadido en P-18) |

### Tipografía

Principal **Nunito** · Secundaria **Inter**.

| Rol | Escritorio (px) | Mobile (px) |
|---|---|---|
| Títulos | 64 | 28 |
| Subtítulos | 48 | 24 |
| Encabezados / Apartados | 36 | 20 |
| Botones | 30 | 12 |
| Captions | 26 | 12 |
| Párrafos | 22 | 12 |

### Retícula y redondeado

| Vista | Columnas | Margen | Gutter |
|---|---|---|---|
| Escritorio | 8 | 80 px | 24 px |
| Mobile | 5 | 30 px | 16 px |

**Redondeado (P-17):**

| Elemento | Escritorio | Mobile |
|---|---|---|
| Pop-ups / modales y botones tipo píldora ("LEER MÁS") | 50 px | 50 px |
| Botones rectangulares ("COMPRA AHORA", "VER MÁS") | 14 px | 10 px |
| Imágenes | 15 px | 15 px |
| Bloques de información | 10 px | 10 px |

### Componentes de referencia

Header, Footer, Botones (CTA/Información: "RESERVAR", "LEER MÁS"; Navegación: "COMPRA AHORA"),
FAQ en acordeón, tarjetas de habitación (escritorio estático / mobile deslizable), carruseles
de imágenes (escritorio con botones / mobile deslizable, elementos laterales con opacidad
50 %), pop-up de planes, tarjetas de reseña.

## Reglas de Dominio y Lógica de Negocio

Reglas inmutables salvo enmienda formal de esta constitución.

### Reservas

- **R-01.** El sitio **no procesa reservas ni pagos**. Toda reserva se realiza fuera del
  sistema por uno de dos canales: **DIRECTO** (WhatsApp con asesores de Casa Costa) o
  **BOOKING** (página de Casa Costa en Booking.com).
- **R-02.** Todo CTA de reserva ("RESERVAR", "RESERVA", "RESERVA YA") abre el **mismo modal
  de selección de canal**. No existe un CTA que reserve directamente.
- **R-03.** Los datos de contacto y enlaces (`whatsapp`, `whatsapp_url`, `instagram`,
  `booking_url`, `vuelo_url`, `bus_url`, `direccion`, `telefono`) se leen de la tabla
  `configuracion`; no se escriben en duro en los componentes. El canal DIRECTO usa
  `whatsapp_url`, que incluye el mensaje prellenado "Quiero más info sobre Hotel Casa Costa 🏝️".

### Planes y promociones

- **R-04.** Un plan tiene: nombre, descripción, texto "ideal para…", duración en días, precio
  normal y, opcionalmente, precio de temporada baja.
- **R-05.** Los precios se almacenan como **enteros en pesos colombianos (COP)**, sin
  decimales, y se muestran con el formato `$600.000` (separador de miles con punto).
- **R-06.** Si un plan tiene `precio_temporada_baja`, este DEBE ser **estrictamente menor**
  que `precio_normal`, y la UI muestra **siempre** ambos precios (el normal como referencia,
  el de temporada baja destacado). No existe lógica de fechas de temporada (P-05).
- **R-07.** Todos los elementos con `categoria = 'plan'` incluyen **Transporte, Comida y
  Tours** (mensaje global de la sección Planes). La regla NO aplica a las promociones (R-19).
- **R-08.** La acomodación ofrecida va de **1 a 8 personas**.
- **R-19.** Las promociones (`categoria = 'promocion'`) se muestran en la sección
  PROMOCIONES, sin prefijo "Tour" en su nombre, y abren **el mismo pop-up** que los planes.
- **R-21.** En el pop-up de un plan o promoción, los destinos mencionados que existan en la
  tabla `destinos` se muestran **subrayados como enlace**; los que no existan se muestran como
  texto plano.

### Habitaciones

- **R-09.** El catálogo de habitaciones es: Habitación #1 (18 m², hasta 6 personas),
  Habitación #2 (13 m², hasta 4), Habitación #3 (11 m², hasta 3; "1 cama doble y 1 litera"),
  Habitación #4 (11 m², hasta 3) y Apartamento (24 m², hasta 8).
- **R-10.** La capacidad máxima de una habitación está entre **1 y 8** personas.
- **R-11.** Todas las habitaciones incluyen aire acondicionado, baño privado (WC, papel
  higiénico, ducha), WiFi, toallas, ventilador y desayuno continental. En Comodidades, la
  etiqueta del bloque de íconos es "Todas nuestras habitaciones cuentan con:" y el ícono de
  internet se rotula "WiFi" (excepción P-20 a la regla web).
- **R-22.** No se muestra precio de habitación: `habitaciones.precio` queda `NULL` y la
  tarjeta oculta el campo "Precio" (P-07).

### Destinos (sección "Tours")

- **R-12.** Los "Tours" de Experiencias son **destinos turísticos informativos** (sin precio
  ni reserva independiente): Playa La Miel en Panamá, Bahía Sapzurro y Cabo Tiburón.

### Reseñas y calificaciones

- **R-13.** Una reseña tiene autor, calificación entera de **1 a 5 estrellas**, título corto
  (ej. "EXCELENTE"), fecha y texto.
- **R-14.** En el carrusel la reseña se muestra **truncada** con "LEER MÁS" (web) / "VER MÁS"
  (mobile); el texto completo se ve al expandir.
- **R-15.** Las calificaciones agregadas se muestran por plataforma (**GOOGLE**,
  **BOOKING**), cada una con su escala (Google **4.7** sobre 5, Booking **9.0** sobre 10).
  Son datos almacenados, no calculados a partir de las reseñas del sitio.
- **R-16.** El sitio **solo muestra** reseñas; no permite crearlas. Las reseñas son una
  **selección manual** en la tabla `resenas` y no muestran plataforma de origen.

### Contenido

- **R-17.** Todo el contenido visible del sitio está en **español**.
- **R-18.** Las fechas se almacenan en ISO 8601 (`YYYY-MM-DD`) y se muestran como
  `DD/MM/YYYY`.
- **R-20.** Los enlaces externos se guardan **limpios** en `configuracion` (sin parámetros de
  sesión, fechas ni rastreo) y abren en **pestaña nueva**:
  - `booking_url` — página de Casa Costa en Booking.com (canal BOOKING).
  - `whatsapp_url` — WhatsApp con mensaje prellenado (canal DIRECTO y botón "VER MÁS" de
    Cómo llegar).
  - `vuelo_url` — Moon Flights chárter ("COMPRA AHORA" / "Agenda tu vuelo").
  - `bus_url` — redBus Medellín–Necoclí ("Consulta tiquetes").

## Contratos de Datos

> Tipos nativos de SQLite: `INTEGER`, `REAL`, `TEXT`. Booleanos como `INTEGER` (0/1). Dinero
> como `INTEGER` (COP). Fechas como `TEXT` ISO 8601.
> Archivos: `/db/schema.sql` (DDL), `/db/seed.sql` (contenido inicial tomado de Figma),
> `/db/casacosta.db`.

### Esquema SQLite (fuente de verdad)

```sql
PRAGMA foreign_keys = ON;

-- Datos de contacto y enlaces externos (clave/valor)
CREATE TABLE configuracion (
  clave  TEXT PRIMARY KEY,          -- 'whatsapp', 'whatsapp_url', 'instagram', 'booking_url',
                                    -- 'vuelo_url', 'bus_url', 'direccion', 'telefono'
  valor  TEXT NOT NULL
);

-- Planes y promociones (paquetes con precio)
CREATE TABLE planes (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  slug                   TEXT    NOT NULL UNIQUE,
  nombre                 TEXT    NOT NULL,
  categoria              TEXT    NOT NULL CHECK (categoria IN ('plan', 'promocion')),
  descripcion            TEXT    NOT NULL,
  texto_ideal            TEXT,                       -- "Ideal para quienes…"
  duracion_dias          INTEGER NOT NULL CHECK (duracion_dias > 0),
  precio_normal          INTEGER NOT NULL CHECK (precio_normal > 0),
  precio_temporada_baja  INTEGER CHECK (precio_temporada_baja IS NULL
                                        OR (precio_temporada_baja > 0
                                            AND precio_temporada_baja < precio_normal)),
  imagen_url             TEXT,
  orden                  INTEGER NOT NULL DEFAULT 0,
  activo                 INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1))
);

-- Destinos turísticos (sección "Tours")
CREATE TABLE destinos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL UNIQUE,
  nombre      TEXT    NOT NULL,
  descripcion TEXT    NOT NULL,
  destacado   TEXT,                                  -- frase de cierre resaltada
  imagen_url  TEXT,
  orden       INTEGER NOT NULL DEFAULT 0
);

-- Habitaciones
CREATE TABLE habitaciones (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  slug              TEXT    NOT NULL UNIQUE,
  nombre            TEXT    NOT NULL,                -- "Habitación #1", "Apartamento"
  tipo              TEXT    NOT NULL,                -- "Habitación familiar con baño privado"
  area_m2           INTEGER NOT NULL CHECK (area_m2 > 0),
  capacidad_max     INTEGER NOT NULL CHECK (capacidad_max BETWEEN 1 AND 8),
  camas_descripcion TEXT    NOT NULL,                -- "5 camas individuales"
  descripcion       TEXT    NOT NULL,
  precio            INTEGER CHECK (precio IS NULL OR precio > 0),  -- siempre NULL (R-22)
  orden             INTEGER NOT NULL DEFAULT 0
);

-- Imágenes del carrusel de cada habitación
CREATE TABLE habitacion_imagenes (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  habitacion_id  INTEGER NOT NULL REFERENCES habitaciones(id) ON DELETE CASCADE,
  url            TEXT    NOT NULL,
  alt            TEXT    NOT NULL,
  orden          INTEGER NOT NULL DEFAULT 0
);

-- Reseñas mostradas en el carrusel
CREATE TABLE resenas (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  autor        TEXT    NOT NULL,
  calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  titulo       TEXT    NOT NULL,
  texto        TEXT    NOT NULL,
  fecha        TEXT    NOT NULL,                     -- YYYY-MM-DD
  orden        INTEGER NOT NULL DEFAULT 0
);

-- Calificación agregada por plataforma
CREATE TABLE calificaciones_plataforma (
  plataforma  TEXT PRIMARY KEY CHECK (plataforma IN ('GOOGLE', 'BOOKING')),
  puntaje     REAL NOT NULL CHECK (puntaje >= 0),
  escala_max  REAL NOT NULL CHECK (escala_max > 0),
  CHECK (puntaje <= escala_max)
);

-- Preguntas frecuentes
CREATE TABLE faqs (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  pregunta  TEXT    NOT NULL UNIQUE,
  respuesta TEXT    NOT NULL,
  orden     INTEGER NOT NULL DEFAULT 0
);
```

### Contrato de la API (solo lectura)

El backend expone únicamente endpoints `GET`; no hay escritura desde el sitio público.

| Método | Ruta | Respuesta | Tabla(s) |
|---|---|---|---|
| GET | `/api/planes?categoria=plan\|promocion` | Lista de planes activos ordenados por `orden` | `planes` |
| GET | `/api/planes/:slug` | Detalle de un plan (pop-up) | `planes` |
| GET | `/api/destinos` | Lista de destinos | `destinos` |
| GET | `/api/habitaciones` | Lista con imágenes | `habitaciones`, `habitacion_imagenes` |
| GET | `/api/habitaciones/:slug` | Detalle de una habitación | `habitaciones`, `habitacion_imagenes` |
| GET | `/api/resenas` | Reseñas + calificaciones por plataforma | `resenas`, `calificaciones_plataforma` |
| GET | `/api/faqs` | Lista de FAQs | `faqs` |
| GET | `/api/contacto` | Datos de contacto y enlaces | `configuracion` |

**Formato de respuesta:**

- Éxito: `{ "data": ... }`
- Error: `{ "error": { "code": "NOT_FOUND", "message": "Mensaje amigable en español" } }`

**Tipos compartidos:** las interfaces de respuesta (`Plan`, `Destino`, `Habitacion`, `Resena`,
`CalificacionPlataforma`, `Faq`, `Contacto`) se definen en TypeScript con nombres en
`PascalCase` y campos en `camelCase`; el backend mapea `snake_case` de SQL → `camelCase` de
JSON.

**Ejemplo (`better-sqlite3`):**

```ts
const getPlanBySlug = db.prepare(`
  SELECT id, slug, nombre, categoria, descripcion, texto_ideal,
         duracion_dias, precio_normal, precio_temporada_baja, imagen_url
  FROM planes
  WHERE slug = ? AND activo = 1
`);
const row = getPlanBySlug.get(slug); // undefined → 404
```

## Estructura y Estilo de Código

- **Estructura plana:**

  ```text
  /frontend   → app React + Tailwind (páginas, componentes, hooks, tipos)
  /backend    → servidor Express (rutas, consultas SQL, tipos)
  /db         → schema.sql, seed.sql, casacosta.db
  ```

- **Estilo:** programación funcional y componentes funcionales (Hooks en React); sin clases
  salvo que sea obligatorio.
- **Nomenclatura:**
  - `camelCase` para funciones y variables.
  - `PascalCase` para Interfaces, Tipos y componentes de React.
  - `snake_case` únicamente para tablas y columnas SQL.
- **Estilos:** solo clases de Tailwind con los tokens de "Stack Tecnológico y Sistema de
  Diseño"; sin CSS ad-hoc salvo casos imposibles de resolver con Tailwind.
- **Responsive:** mobile-first; las vistas de Figma de 393 px y 1456 px son la referencia
  visual obligatoria.

## Manejo de Errores y Validaciones

- **UI:** nunca exponer errores crudos o stack traces. Todo error técnico se traduce a un
  mensaje amigable en español.
  - Si una sección no puede cargar sus datos, se muestra un mensaje amigable en esa sección
    sin romper el resto de la página.
  - Listas vacías (sin planes, reseñas o FAQs) muestran un estado vacío amigable, nunca un
    contenedor roto.
- **Backend — códigos HTTP:**
  - `200 OK` — consulta exitosa (incluye listas vacías: `{ "data": [] }`).
  - `400 Bad Request` — parámetro inválido (ej. `categoria` fuera de `plan|promocion`).
  - `404 Not Found` — `slug` inexistente o plan inactivo.
  - `405 Method Not Allowed` — cualquier método distinto de `GET` sobre `/api/*`.
  - `500 Internal Server Error` — error inesperado; el detalle se registra en el log del
    servidor y se responde con mensaje genérico.
- **Validación:** parámetros de ruta y query se validan antes de ejecutar cualquier consulta.
  La integridad se garantiza además con las restricciones `CHECK`, `UNIQUE` y `FOREIGN KEY`
  del esquema.

## Preguntas Abiertas y Decisiones

> Las preguntas abiertas DEBEN resolverse antes de cerrar el `spec.md` de la pantalla afectada.
> Evidencia de las decisiones: archivo Figma `FUuT2oETZHhIh0PIIBFDHX` (enmienda 1.1.0).

### Preguntas abiertas

| # | Tema | Detalle |
|---|---|---|
| — | — | No hay preguntas abiertas (enmienda 1.1.1). |

### Registro de decisiones

| # | Tema | Decisión |
|---|---|---|
| P-01 | Nombre de la base de datos | `/db/casacosta.db`. Instrucciones del proyecto corregidas. |
| P-02 | Precio Capurganá Intrépida | `precio_normal` 1100000, `precio_temporada_baja` 980000 (web). |
| P-03 | Camas Habitación #3 | "1 cama doble y 1 litera", hasta 3 personas (confirmado por foto). Nombre "Habitación #3" en ambas vistas. |
| P-04 | Calificaciones | Booking 9.0 / 10; Google 4.7 / 5 (web). Ver R-15. |
| P-05 | Temporada baja | Sin lógica de fechas; se muestran siempre ambos precios. Ver R-06. |
| P-06 | Planes vs. Promociones | "Capurganá a tu Ritmo" y "Capurganá Express" son `categoria = 'promocion'`, sin prefijo "Tour", mismo pop-up. Ver R-07 y R-19. |
| P-07 | Precio de habitaciones | No se muestra; `habitaciones.precio` = `NULL`. Ver R-22. |
| P-08 | Canal DIRECTO | Abre `whatsapp_url` con mensaje "Quiero más info sobre Hotel Casa Costa 🏝️". Ver R-03. |
| P-09 | Enlaces de "Cómo llegar" | "COMPRA AHORA"/"Agenda tu vuelo" → `vuelo_url`; "Consulta tiquetes" → `bus_url`; "VER MÁS" → `whatsapp_url`; pestaña nueva. Ver R-20. |
| P-10 | FAQs | Se publican 3 FAQs con respuesta definitiva (ver "Contenido confirmado"); se excluyen las de prueba ("¿El profe es el CEO?", "¿Cuántos buñuelos trae el desayuno?"). "¿Puedo llevar a mi mascota?" queda fuera del seed hasta tener la política del hotel y se agregará como cambio de contenido, sin enmendar la constitución. Contenido aportado por el responsable del proyecto (1.1.1). |
| P-11 | Origen de reseñas | Selección manual, sin plataforma de origen; títulos de la versión web. Ver R-16. |
| P-12 | Explora Capurganá | Descripción web; 850000 / 750000. |
| P-13 | Enlaces planes → destinos | Solo los destinos existentes en `destinos` se enlazan (subrayados). Ver R-21. El destino concreto del enlace se define en el `spec.md` de Experiencias. |
| P-14 | Textos de introducción | Cómo llegar: texto web en ambas vistas ("Llegar a Casa Costa es más fácil..."). Comodidades: texto definitivo propio de habitaciones (ver "Contenido confirmado"), aportado por el responsable del proyecto (1.1.1). |
| P-15 | Erratas | Confirmado: se corrigen en `seed.sql`. |
| P-16 | Herramienta de build | Vite. Ver Principio III. |
| P-17 | Redondeado | Radios por componente. Ver "Retícula y redondeado". |
| P-18 | Colores sueltos en pantallas | Se usan los tokens del toolkit, no `#1C3149`, `#F9B43F`, `#282940`. Nuevo token `surface` = `#EFEFEF`. |
| P-19 | URLs externas | Se guardan limpias (sin sesión, fechas ni rastreo). Ver R-20. |
| P-20 | Etiqueta de comodidades (**excepción a la regla web**) | "Todas nuestras habitaciones cuentan con:" (mobile); ícono rotulado "WiFi". Ver R-11. |

### Contenido confirmado para `seed.sql`

- **Planes / promociones:**
  - "Capurganá Intrépida" (`plan`): `precio_normal` 1100000, `precio_temporada_baja` 980000.
  - "Explora Capurganá" (`plan`): 4 días; transporte ida y regreso desde Necoclí, desayunos y
    cenas, 2 tours con 6 destinos como Cabo Tiburón, Bahía Aguacate y Piscina de coral;
    `precio_normal` 850000, `precio_temporada_baja` 750000.
  - "Capurganá a tu Ritmo" (`promocion`): 210000. "Capurganá Express" (`promocion`): 320000.
- **Reseñas** (5 estrellas, fecha `2025-10-10`): Daniela "EXCELENTE", Gabriela "INCREÍBLE",
  Samuel "PERFECTO".
- **Calificaciones:** GOOGLE 4.7 / 5; BOOKING 9.0 / 10.
- **FAQs** (en este orden):
  1. "¿En Capurganá hay aeropuerto?" → "Sí. Puedes llegar en vuelo directo desde el aeropuerto
     Olaya Herrera de Medellín, en aproximadamente 1,5 horas. Si prefieres, también puedes
     llegar por la ruta mixta: bus o vehículo propio hasta Necoclí y lancha hasta Capurganá."
  2. "¿Cuál es la diferencia entre planes y tours?" → "Los planes son paquetes completos con
     precio que incluyen transporte, comida y tours. Los tours son los destinos turísticos que
     visitas durante tu estadía, como Playa La Miel, Bahía Sapzurro y Cabo Tiburón; no se
     reservan por separado."
  3. "¿Qué hay en Bahía Aguacate?" → "Bahía Aguacate es uno de los destinos que visitas en los
     planes Capurganá Intrépida y Explora Capurganá. Escríbenos por WhatsApp y te contamos qué
     incluye cada recorrido."
  - "¿Puedo llevar a mi mascota?" NO se incluye en el seed hasta tener la política del hotel.
- **Textos de introducción:**
  - Cómo llegar: texto web en ambas vistas ("Llegar a Casa Costa es más fácil...").
  - Comodidades: "Descansa en habitaciones pensadas para tu comodidad. Todas cuentan con aire
    acondicionado, baño privado y WiFi, y gracias a nuestra planta de energía nada
    interrumpirá tu descanso. Elige entre cuatro habitaciones y un apartamento para grupos de
    hasta 8 personas, y empieza cada día con desayuno continental incluido."
- **Erratas** ("PCabo Tiburón", "toured", "Aire acodicionado", "disrutes", "aereopuerto",
  "puedes llegarás") se corrigen.

## Governance

- **Supremacía:** esta constitución prevalece sobre `spec.md`, `plan.md`, `tasks.md`, los
  diseños de Figma y cualquier instrucción ad-hoc. Ante conflicto se aplica el Principio VII.
- **Procedimiento de enmienda:** toda modificación se hace editando este archivo
  (`.specify/memory/constitution.md`) mediante `/speckit-constitution`, documentando en el
  Sync Impact Report qué cambió y por qué. Ningún código que dependa de una regla modificada
  se toca hasta que la enmienda esté registrada.
- **Resolución de preguntas abiertas:** al resolverse una P-xx, se retira de "Preguntas
  abiertas", su decisión se incorpora a la sección correspondiente (reglas, esquema o diseño)
  y queda trazada en el "Registro de decisiones". Toda excepción a la regla web (Principio VII)
  DEBE registrarse allí explícitamente.
- **Política de versionado (SemVer):**
  - MAJOR: eliminación o redefinición incompatible de un principio, regla R-xx o contrato de
    datos/API.
  - MINOR: nuevo principio, sección o regla, o ampliación material de una existente
    (incluye cerrar una P-xx que añade una regla).
  - PATCH: aclaraciones, redacción, erratas sin cambio semántico.
- **Revisión de cumplimiento:** cada `plan.md` DEBE incluir un "Constitution Check" contra los
  Principios I–VII; cada `spec.md` DEBE citar las reglas R-xx que aplica y las P-xx que
  resuelve o deja abiertas; toda revisión de código verifica: ausencia de ORM, SQL
  parametrizado, uso exclusivo de tokens de diseño, ausencia de funcionalidades fuera de
  alcance y respuestas HTTP conformes.

**Version**: 1.1.1 | **Ratified**: 2026-10-13 | **Last Amended**: 2026-10-13
