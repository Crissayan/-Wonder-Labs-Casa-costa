# Feature Specification: Sitio web Hotel Casa Costa (MVP)

**Feature Branch**: `001-sitio-casacosta` (el proyecto aún no es un repositorio git; no se creó rama)

**Created**: 2026-10-13

**Status**: Draft

**Input**: User description: "Especificación Funcional — Sitio web Hotel Casa Costa, v1.0 (2026-10-13):
sitio público completo, anónimo y de solo lectura con cinco páginas (Inicio, Experiencias,
Comodidades, Cómo llegar, FAQs) y componentes globales (header, menú mobile, footer, botón
flotante de WhatsApp y modal de reserva). Borrador completo aportado por el responsable del
proyecto, con análisis visual del Figma, requerimientos, contratos, casos borde, criterios
Gherkin y 22 preguntas abiertas."

> **Rige:** `.specify/memory/constitution.md` **v1.3.0**. Ante cualquier contradicción prevalece
> la constitución (Principio VII).
> **Fuentes analizadas:** `CasaCostaWeb.pdf`, `CasaCostaMobile.pdf`, `CasaCostaUIToolKit.pdf` y
> archivo Figma `FUuT2oETZHhIh0PIIBFDHX` (páginas "Prototipo Escritorio" `0:1` y "Prototipo
> Mobile" `126:2`, incluidas variantes de componentes).
> **Convenciones:** `FR-xxx` = requerimiento funcional · `R-xx` / `P-xx` = regla o decisión de la
> constitución · `CB-xx` = caso borde · `Q-xx` = pregunta abierta de este spec.
> **Regla de discrepancias web ↔ mobile:** prevalece la versión web (Principio VII), salvo las
> excepciones registradas en la constitución (hoy: P-20) o las etiquetas que la constitución
> nombra explícitamente para ambas vistas (R-14 "LEER MÁS"/"VER MÁS"; R-20 "COMPRA AHORA"/"Agenda
> tu vuelo").

## Clarifications

### Session 2026-10-13

- Q: ¿Cómo se debe hacer la verificación visual que exige FV-07 para dar una pantalla por
  terminada en 393 px y 1456 px? → A: Medición automática de tamaño y posición de los elementos
  clave de cada frame (±2 px, ambos anchos) más revisión manual con la captura superpuesta al
  frame para lo no medible y para los estados de pop-ups, modal, menú y acordeón (FR-070).
- Q: ¿Las tarjetas de los carruseles de planes y promociones deben mostrar la imagen tipo afiche
  del diseño o construirse con los datos de la base? → A: Tarjeta con la composición del afiche:
  foto de fondo y encima nombre, duración y precios de la base; itinerario e "Incluye" solo en el
  pop-up (FR-021).
- Q: En escritorio, ¿cuántas imágenes tiene cada habitación y qué pasa al hacer clic en las
  miniaturas del panel de detalle? → A: 3 imágenes por habitación; la tarjeta muestra la primera
  y al hacer clic en una miniatura esta pasa a ser la imagen de la tarjeta, con la miniatura
  activa resaltada (FR-032, FR-033).
- Q: ¿El botón "Consulta tiquetes" debe aparecer también en la versión de escritorio de Cómo
  llegar? → A: Sí, en web bajo "EN BUS", con el estilo de "COMPRA AHORA" (botón rectangular
  `cta`, radio 14 px); se registra como desviación visual permitida (FR-040).
- Q: En el footer, ¿el Instagram, el teléfono y la dirección deben ser enlaces o solo texto? →
  A: Instagram abre el perfil del hotel en pestaña nueva (clave `instagram_url`, incorporada en
  la constitución v1.3.0 como P-21); el teléfono abre `whatsapp_url`; la dirección queda como
  texto (FR-005).

## User Scenarios & Testing *(mandatory)*

### Alcance

Sitio público, anónimo y de **solo lectura**. Toda reserva ocurre fuera del sitio (R-01, R-02).
Fuera de alcance (Principio I): motor de reservas, pagos, login, panel de administración,
publicación de reseñas, páginas de detalle de destino y lógica de temporadas por fecha (R-06).

### User Story 1 - Elegir canal de reserva desde cualquier CTA (Priority: P1)

Como viajero, quiero elegir cómo reservar (WhatsApp o Booking) desde cualquier botón de reserva,
para reservar sin fricción.

**Why this priority**: Es el objetivo de conversión del sitio; sin este flujo el sitio no cumple
su propósito.

**Independent Test**: Pulsar cualquier CTA de reserva abre el modal y cada opción abre el enlace
correcto en pestaña nueva.

**Acceptance Scenarios**:

1. **Dado** que estoy en cualquier página, **Cuando** hago clic en un botón "RESERVAR" o
   "RESERVA", **Entonces** se abre el modal "RESERVA YA" con las opciones "DIRECTO" y "BOOKING" y
   sus textos descriptivos.
2. **Dado** el modal abierto y `whatsapp_url` configurada, **Cuando** hago clic en "DIRECTO",
   **Entonces** se abre `whatsapp_url` en pestaña nueva, sin dar acceso a la página de origen.
3. **Dado** el modal abierto, **Cuando** hago clic en "BOOKING", **Entonces** se abre
   `booking_url` en pestaña nueva.
4. **Dado** que `booking_url` no está configurada, **Cuando** abro el modal, **Entonces** no veo
   "BOOKING" ni su texto descriptivo, y sí veo "DIRECTO".
5. **Dado** el modal abierto, **Cuando** hago clic en cerrar, **Entonces** el modal se cierra y la
   página conserva su posición de scroll.

---

### User Story 2 - Ver planes y promociones con precio y detalle (Priority: P1)

Como viajero, quiero ver los planes y promociones con su precio y detalle, para decidir qué
paquete me conviene.

**Why this priority**: Los planes son la oferta comercial principal y alimentan la reserva.

**Independent Test**: En Experiencias se listan 3 planes y 2 promociones; cada uno abre su pop-up
con precio(s) formateados y RESERVAR.

**Acceptance Scenarios**:

1. **Dado** el contenido semilla, **Cuando** visito Experiencias, **Entonces** PLANES muestra 3
   planes en el orden definido y PROMOCIONES muestra "Capurganá a tu Ritmo" y "Capurganá Express",
   sin prefijo "Tour" (R-19).
2. **Dado** Experiencias, **Cuando** abro "Plan Conoce Capurganá", **Entonces** veo su
   descripción, el texto "Ideal para quienes quieren una primera experiencia completa, cómoda y al
   mejor precio.", un único precio "$600.000" y el botón "RESERVAR".
3. **Dado** Experiencias, **Cuando** abro "Plan Capurganá Intrépida", **Entonces** veo "$980.000"
   destacado y debajo "Precio normal $1.100.000" (R-06, P-02).
4. **Dado** un pop-up de plan abierto, **Cuando** hago clic en "RESERVAR", **Entonces** el pop-up
   se cierra y se abre el modal "RESERVA YA".
5. **Dado** el pop-up de "Plan Conoce Capurganá" y "Bahía Sapzurro" registrado como destino,
   **Cuando** hago clic en el texto subrayado "Bahía Sapzurro", **Entonces** el pop-up se cierra y
   la página se desplaza hasta el bloque de ese destino en la sección Tours (R-21).
6. **Dado** el pop-up de "Plan Capurganá Intrépida", **Entonces** "Bahía Aguacate" y "Reserva
   Natural El Cielo" se muestran como texto plano, no como enlaces (R-21).
7. **Dado** un plan retirado (inactivo), **Cuando** se solicita su detalle, **Entonces** el pop-up
   muestra "Este plan ya no está disponible. Escríbenos por WhatsApp y te ayudamos a encontrar
   otro."
8. **Dado** una solicitud de planes con una categoría distinta de plan/promoción, **Entonces** se
   rechaza como parámetro inválido con un mensaje en español.

---

### User Story 3 - Conocer las habitaciones (Priority: P2)

Como viajero, quiero conocer las habitaciones (tamaño, capacidad, camas y fotos), para saber dónde
me voy a alojar.

**Why this priority**: Informa la decisión, pero la reserva no depende de ella.

**Independent Test**: En Comodidades se navega por las 5 habitaciones y cada una muestra sus datos
e imágenes.

**Acceptance Scenarios**:

1. **Dado** Comodidades a 1456 px mostrando "Habitación #1", **Cuando** hago clic en la flecha
   derecha, **Entonces** veo "Habitación #2" con "1 cama individual y 2 literas" y "Hasta 4
   personas".
2. **Dado** Comodidades, **Cuando** veo la tarjeta de "Habitación #3", **Entonces** veo "1 cama
   doble y 1 litera" y "Hasta 3 personas" (P-03), y ningún campo de precio (R-22).
3. **Dado** Comodidades a 393 px, **Cuando** deslizo la tarjeta hacia la izquierda, **Entonces**
   veo la siguiente habitación según su orden.

---

### User Story 4 - Leer reseñas y calificaciones (Priority: P2)

Como viajero, quiero leer reseñas y ver la calificación en Google y Booking, para confiar en el
hotel.

**Why this priority**: Genera confianza; complementa la conversión.

**Independent Test**: En Inicio se ven 4.7 GOOGLE y 9.0 BOOKING y las 3 reseñas, cada una con su
texto completo al expandir.

**Acceptance Scenarios**:

1. **Dado** el contenido semilla, **Cuando** visito Inicio, **Entonces** veo "4.7" con "GOOGLE" y
   "9.0" con "BOOKING" (R-15).
2. **Dado** Inicio en escritorio, **Cuando** hago clic en "LEER MÁS" en la reseña de "Daniela",
   **Entonces** se abre un pop-up con "EXCELENTE", "5 ESTRELLAS", "10/10/2025" y el texto completo,
   sin plataforma de origen (R-16).
3. **Dado** Inicio en mobile, **Cuando** toco "VER MÁS" en una reseña, **Entonces** se abre la capa
   con el texto completo y un botón cerrar (R-14).

---

### User Story 5 - Saber cómo llegar (Priority: P2)

Como viajero, quiero saber cómo llegar a Capurganá, para planear mi transporte.

**Why this priority**: Capurganá no tiene acceso por carretera; la logística es una barrera real
de decisión.

**Independent Test**: En Cómo llegar se ven las dos opciones y sus botones abren vuelo, bus o
WhatsApp.

**Acceptance Scenarios**:

1. **Dado** Cómo llegar, **Cuando** hago clic en "COMPRA AHORA" (web) o "Agenda tu vuelo"
   (mobile), **Entonces** se abre `vuelo_url` en pestaña nueva (R-20).
2. **Dado** Cómo llegar, **Cuando** hago clic en "VER MÁS" de la ruta mixta, **Entonces** se abre
   `whatsapp_url` en pestaña nueva.
3. **Dado** Cómo llegar, **Cuando** toco "Consulta tiquetes", **Entonces** se abre `bus_url` en
   pestaña nueva.

---

### User Story 6 - Resolver dudas frecuentes (Priority: P3)

Como viajero, quiero resolver dudas frecuentes, para no tener que escribir al hotel.

**Why this priority**: Reduce consultas, pero el sitio es útil sin ella.

**Independent Test**: En FAQs, al tocar una pregunta se despliega su respuesta.

**Acceptance Scenarios**:

1. **Dado** FAQs con todas las preguntas cerradas, **Cuando** hago clic en "¿En Capurganá hay
   aeropuerto?", **Entonces** el acordeón se abre, muestra su respuesta y se anuncia como
   expandido a tecnologías de asistencia.
2. **Dado** esa pregunta abierta, **Cuando** hago clic de nuevo, **Entonces** la respuesta se
   oculta y se anuncia como contraída.
3. **Cuando** visito FAQs, **Entonces** no veo "¿El profe es el CEO?", "¿Cuántos buñuelos trae el
   desayuno?", "¿Qué hacer en Capurganá con 2mil?" ni "¿Puedo llevar a mi mascota?" (P-10).

---

### User Story 7 - Navegar y ver datos de contacto (Priority: P3)

Como viajero, quiero navegar entre páginas y ver los datos de contacto en todo momento.

**Why this priority**: Soporte transversal de las demás historias.

**Independent Test**: El header/menú lleva a cada página y el footer muestra los datos de
contacto configurados.

**Acceptance Scenarios**:

1. **Dado** mobile, **Cuando** toco el ícono de menú, **Entonces** se abre el panel con Inicio,
   Experiencias, Comodidades, Como llegar, FAQS y RESERVAR; **Cuando** toco "Experiencias",
   **Entonces** navego a Experiencias y el menú se cierra.
2. **Dado** que la configuración contiene "@hotelcasacosta_", "+57 312 8686680" y la dirección,
   **Cuando** visito cualquier página, **Entonces** el footer muestra esos valores leídos de la
   configuración (R-03).
3. **Dado** cualquier página, **Cuando** hago clic en el botón flotante de WhatsApp, **Entonces**
   se abre `whatsapp_url` en pestaña nueva.
4. **Dado** el footer, **Cuando** hago clic en "@hotelcasacosta_", **Entonces** se abre
   `instagram_url` en pestaña nueva; **Cuando** hago clic en el teléfono, **Entonces** se abre
   `whatsapp_url` en pestaña nueva; la dirección no es un enlace.

---

### Escenarios de robustez (transversales)

1. **Cuando** se intenta modificar datos (cualquier operación distinta de lectura), **Entonces** se
   rechaza como método no permitido y los datos no cambian.
2. **Dado** que la carga de reseñas falla, **Cuando** visito Inicio, **Entonces** la sección de
   reseñas muestra "No pudimos cargar esta información. Intenta de nuevo en unos minutos." y el
   hero, el banner CTA, el footer y el botón de WhatsApp se muestran normalmente, sin stack traces
   ni texto en inglés.
3. **Dado** que no hay FAQs, **Cuando** visito FAQs, **Entonces** la consulta responde con éxito y
   lista vacía, y la página muestra un estado vacío amigable.

### Escenarios de fidelidad visual

1. **Dado** que abro cada pantalla a 1456 px, **Cuando** la comparo con su frame de Figma
   (FR-067) mediante la verificación de FR-070, **Entonces** estructura, tamaños, espaciados, colores, tipografías, radios e íconos
   coinciden con tolerancia de ±2 px, salvo las excepciones visuales permitidas.
2. **Dado** que abro cada pantalla a 393 px, **Cuando** la comparo con su frame mobile,
   **Entonces** se cumple lo mismo.
3. **Dado** un texto de la base más largo que el del diseño, **Cuando** se renderiza,
   **Entonces** el componente conserva su composición sin desbordes (FR-069).
4. **Dado** que se abre cada pop-up, modal, menú y acordeón, **Entonces** cada estado coincide
   con su variante en Figma.

### Análisis visual (referencia Figma)

#### Componentes globales

| Componente | Web (1456 px) | Mobile (393 px) | Estados detectados |
|---|---|---|---|
| Header | Enlaces EXPERIENCIAS · COMODIDADES · COMO LLEGAR · FAQS y botón RESERVAR. | Barra de 57 px: ícono del logo, logotipo e ícono hamburguesa. | Por defecto. Sin estado "página activa" (Q-09). |
| Menú mobile | — | Panel lateral derecho (225 px) sobre fondo oscurecido: Inicio, Experiencias, Comodidades, Como llegar, FAQS, RESERVAR y cerrar. | Cerrado / Abierto. |
| Botón RESERVAR | Variantes "Predeterminado" y "Variante 2". | Igual, tamaño reducido. | Por defecto / Variante 2 (hover presunto, Q-09). |
| Modal "Reserva" | Contenedor 973×336, cerrar, "RESERVA YA", "Conoce las dos formas de reservar en Casa Costa:", dos columnas (texto + DIRECTO / texto + BOOKING). | Fondo a pantalla completa, tarjeta 327×529, piezas apiladas. | Cerrado / Abierto. |
| Footer | "Contáctanos", `@hotelcasacosta_`, teléfono, "Reservas / Booking.com", "Dirección / Calle la Arrocera…". | Mismo contenido apilado (393×373). | Por defecto. Oculto en el frame FAQs web (Q-08). |
| Botón flotante WhatsApp | Círculo de 85 px, esquina inferior derecha. | Círculo de 63 px. | Por defecto. |

#### Inicio

| Componente | Web | Mobile | Estados |
|---|---|---|---|
| Hero | Imagen 1456×560 con capa, "TU ESCAPE A CAPURGANÁ", subtítulo. | Imagen 393×489, "BIENVENIDO AL PARAÍSO", mismo subtítulo. | Estático. |
| Bloque comodidades | "Todas las comodidades a tu disposición", párrafo, 3 imágenes estáticas, "Ver opciones". | Mismo texto, carrusel de 3 páginas con puntos, "VER MÁS". | Mobile: página 1/2/3. |
| Bloque tours | "Descubre a Capurganá por completo", párrafo, imagen 416×512, "Conoce más". | Imagen 339×450, "CONÓCELAS". | Estático. |
| Calificaciones | "Nuestras Reseñas", 4.7 GOOGLE · estrella · 9.0 BOOKING. | Booking muestra "10" → 9.0 (P-04). | Estático. |
| Carrusel de reseñas | 3 variantes; tarjetas con avatar, autor, "5 ESTRELLAS", título, "LEER MÁS". | 3 frames, una tarjeta visible, "VER MÁS", puntos. | Reseña 1/2/3 activa. |
| Pop-up de reseña | 480×406: avatar, autor, estrellas, fecha, título, texto, cerrar. | Capa completa, tarjeta 269×317, cerrar. | Cerrado / Abierto. |
| Banner CTA | "CASACOSTA TE ESPERA", texto, "RESERVA". | Igual. | — |

#### Experiencias

| Componente | Web | Mobile | Estados |
|---|---|---|---|
| Banner | "EXPERIENCIAS" + intro. | Igual. | — |
| Encabezado Planes | "PLANES", "Todos nuestros planes incluyen:", Transporte · Comida · Tours. | Igual. | — |
| Carrusel de planes | 3 variantes; tarjeta central destacada, laterales al 50 %, flechas, puntos. Tarjetas = imágenes tipo afiche con datos incrustados (Q-03). | 3 frames deslizables. | Plan 1/2/3 activo. |
| Leyenda | "Contamos con acomodación de 1 a 8 personas". | Igual. | — |
| Encabezado Promociones | "PROMOCIONES", "Disfruta de estos increíbles precios". | "…de nuestros increíbles precios" (prevalece web). | — |
| Carrusel de promociones | 2 variantes. | 2 frames. | Promo 1/2 activa. |
| Pop-up de plan/promoción | Fondo al 95 %, contenedor 1318×615 (radio 50 px): imagen, nombre, descripción, "ideal para…", precio(s), cerrar. | Tarjeta 346×606 con los mismos elementos y RESERVAR. | Con/sin temporada baja; con/sin "ideal para…". |
| Banner Tours | "TOURS" + "Estos son los lugares turísticos…". | Igual. | — |
| Bloques de destino (×3) | Imagen 496×332 + nombre + descripción + frase destacada. | Carrusel de 3 imágenes por destino (Q-06). | Estático. |

#### Comodidades

| Componente | Web | Mobile | Estados |
|---|---|---|---|
| Banner | "COMODIDADES" + intro (P-14). | Igual. | — |
| Encabezado Habitaciones | "HABITACIONES", "Todas nuestras habitaciones cuentan con:" (P-20), Aire acondicionado · Baño privado · WiFi; "Anímate a conocer más de nuestras habitaciones". | Igual (erratas P-15; rótulos P-20). | — |
| Carrusel de habitaciones | 5 variantes con flechas; tarjeta (imagen con "Hasta N personas", nombre, camas) + panel (3 miniaturas, nombre, tipo, descripción). | 5 frames deslizables; tarjeta 329×316 con mini-carrusel de 3 imágenes. | Habitación 1…5; imagen 1/2/3 (mobile). |
| Alimentación | "ALIMENTACIÓN", texto, carrusel de 3 imágenes con botones. | 3 frames deslizables. | Imagen 1/2/3. |

#### Cómo llegar

| Componente | Web | Mobile | Estados |
|---|---|---|---|
| Banner | "¿CÓMO LLEGAR?" + intro (P-14). | Igual. | — |
| Encabezado | "TUS OPCIONES", "Para llegar a Casa Costa", "Opción 1:" / "Opción 2:". | Sin rótulos "Opción N:" (prevalece web). | — |
| Vía directa | Avión, "VÍA DIRECTA", Olaya Herrera, "1.5 horas desde Medellín", "COMPRA AHORA". | + imagen; "Agenda tu vuelo". | — |
| Ruta mixta | "RUTA MIXTA", Necoclí, EN BUS / EN TU VEHÍCULO, "1.5 horas desde Medellín", EN LANCHA, "1.5 horas desde Necoclí", "solo pasa una vez al día", "VER MÁS". | + imagen; "Consulta tiquetes" bajo EN BUS (Q-12); tiempos separados; "Ver más". | — |
| Banner CTA | "CASACOSTA TE ESPERA" + RESERVAR. | No existe (prevalece web). | — |

#### FAQs

| Componente | Web | Mobile | Estados |
|---|---|---|---|
| Banner | "¿QUÉ PREGUNTAS TIENES?" + "Sabemos que antes de viajar surgen muchas dudas…". | Texto de Experiencias por error (prevalece web). | — |
| Acordeones | Dos columnas (599 px). | Una columna (339 px). | Closed (81 px) / Open (167 px). |

#### Flujos observados

1. **F-1 Reservar:** CTA (header, menú, banner, pop-up) → modal → DIRECTO o BOOKING en pestaña nueva.
2. **F-2 Detalle de plan:** tarjeta → pop-up → RESERVAR (F-1) o cerrar.
3. **F-3 Habitaciones:** flechas (web) / deslizar (mobile); mini-carrusel de imágenes en mobile.
4. **F-4 Reseña completa:** LEER MÁS / VER MÁS → pop-up → cerrar.
5. **F-5 FAQ:** tocar pregunta → abre / cierra.
6. **F-6 Transporte:** COMPRA AHORA / Agenda tu vuelo → `vuelo_url`; Consulta tiquetes → `bus_url`; VER MÁS → `whatsapp_url`.
7. **F-7 Navegación:** header / menú → páginas; botones de Inicio → Comodidades / Tours (Q-02).

### Edge Cases

| # | Caso | Origen | Comportamiento esperado |
|---|---|---|---|
| CB-01 | Dato de contacto o enlace no configurado (p. ej. `bus_url`). | R-03 | El botón/fila que lo usa no se muestra. Nunca un enlace vacío o roto. |
| CB-02 | Lista vacía de planes, promociones, reseñas, destinos o FAQs. | Principio VI | Mensaje de estado vacío del catálogo dentro de la sección; carruseles sin flechas ni indicadores; sin destinos, no se generan enlaces en pop-ups. |
| CB-03 | Falla la carga de una sección. | Principio VI | Solo esa sección muestra el mensaje de error; el resto de la página, header, footer y WhatsApp siguen funcionando. El detalle queda en el registro del servidor. |
| CB-04 | Plan inexistente o inactivo. | Principio VI | "No encontrado"; el pop-up muestra el mensaje del catálogo y conserva el botón cerrar. |
| CB-05 | Parámetro inválido (categoría desconocida; identificador con `../`, espacios o mayúsculas). | Principio VI | Rechazo como parámetro inválido **antes** de consultar datos. |
| CB-06 | Intento de escritura (cualquier operación distinta de lectura). | Principio VI | Rechazo como método no permitido; los datos no cambian. |
| CB-07 | Contenido semilla que viola una regla de integridad (temporada baja ≥ normal, capacidad 9, calificación 6). | Esquema | La construcción de la base falla y se detiene; nunca se publica una base con datos inválidos. |
| CB-08 | Duplicados (pregunta de FAQ repetida, identificador repetido). | Esquema | Igual que CB-07. |
| CB-09 | Imagen asociada a una habitación inexistente. | Esquema | Rechazada; al eliminar una habitación se eliminan sus imágenes. |
| CB-10 | Habitación sin imágenes. | FR-032 | Placeholder con fondo `surface`, sin indicador ni flechas de imagen. |
| CB-11 | Textos largos (reseña extensa, nombre largo, descripción extensa en mobile). | R-14 | Tarjeta de reseña: solo título + "LEER MÁS". Pop-ups con scroll interno; nombres con salto de línea sin desbordar. |
| CB-12 | Un solo elemento en un carrusel. | FR-021, FR-031 | Se ocultan flechas e indicadores. |
| CB-13 | "Ideal para…", frase destacada o imagen ausentes. | Esquema | No se muestra el elemento ni queda espacio vacío. |
| CB-14 | Fecha de reseña afectada por zona horaria (2025-10-10 mostrada como 09/10/2025 en UTC-5). | R-18 | La fecha se muestra siempre igual a la almacenada (FR-061). |
| CB-15 | RESERVAR dentro del pop-up de plan. | FR-023 | Se cierra el pop-up antes de abrir el modal; nunca dos capas a la vez; al cerrar se restaura el scroll. |
| CB-16 | Plan sin precio de temporada baja. | R-06 | Un solo precio, sin recuadro destacado ni "Precio normal". |

## Requirements *(mandatory)*

### Functional Requirements

#### Componentes globales

- **FR-001 · Header de navegación**
  - **Estado Visual:** Web: enlaces horizontales + botón RESERVAR (`cta`). Mobile: barra con logo e
    ícono hamburguesa.
  - **Acción / Disparador:** Clic en un enlace → navega a la página (rutas: Q-01). RESERVAR →
    FR-004.
  - **Impacto en datos:** Ninguno.

- **FR-002 · Menú mobile**
  - **Estado Visual:** Cerrado (por defecto) / Abierto (panel derecho sobre fondo oscurecido).
  - **Acción / Disparador:** Hamburguesa → abre. Opción → navega y cierra. "X" → cierra.
    RESERVAR → cierra el menú y abre FR-004.
  - **Impacto en datos:** Ninguno.

- **FR-003 · Botón RESERVAR / RESERVA (todas las instancias)**
  - **Estado Visual:** Por defecto / Variante 2 (Q-09). Siempre color `cta`.
  - **Acción / Disparador:** Abre **el mismo** modal de reserva (R-02). Ningún CTA de reserva
    lleva directamente a un canal.
  - **Impacto en datos:** Ninguno adicional (usa los datos de contacto ya cargados, FR-007).

- **FR-004 · Modal "RESERVA YA"**
  - **Estado Visual:** Cerrado / Abierto. Web: dos columnas, contenedor radio 50 px (P-17).
    Mobile: apilado.
  - **Acción / Disparador:**
    - **DIRECTO** → abre `whatsapp_url` en pestaña nueva (R-03, R-20).
    - **BOOKING** → abre `booking_url` en pestaña nueva.
    - "X" → cierra. Cierre por fondo o tecla Esc: Q-10.
    - Canal no configurado → su botón y texto no se muestran. Ambos ausentes → "En este momento
      no podemos mostrar las opciones de reserva. Intenta de nuevo más tarde."
  - **Impacto en datos:** Configuración: `whatsapp_url`, `booking_url`.

- **FR-005 · Footer de contacto**
  - **Estado Visual:** Presente en todas las páginas y vistas (componente global; Q-08).
  - **Acción / Disparador:** Muestra `instagram`, `telefono`, "Reservas — Booking.com" y
    `direccion`. Enlaces (todos en pestaña nueva, FR-064):
    - El usuario de Instagram (`instagram`) abre `instagram_url`; sin `instagram_url` se muestra
      como texto.
    - El teléfono (`telefono`) abre `whatsapp_url`; sin `whatsapp_url` se muestra como texto.
    - "Booking.com" abre `booking_url`.
    - La dirección es solo texto.
    - Cada fila sin su dato de texto se oculta.
  - **Impacto en datos:** Configuración: `instagram`, `instagram_url`, `telefono`,
    `whatsapp_url`, `booking_url`, `direccion`.
  - **Base constitucional:** R-03, R-20 y P-21 (constitución v1.3.0).

- **FR-006 · Botón flotante de WhatsApp**
  - **Estado Visual:** Fijo en la esquina inferior derecha, en todas las páginas y vistas. Oculto
    si falta `whatsapp_url`.
  - **Acción / Disparador:** Abre `whatsapp_url` en pestaña nueva.
  - **Impacto en datos:** Configuración: `whatsapp_url`.

- **FR-007 · Carga de datos de contacto**
  - **Estado Visual:** No visible.
  - **Acción / Disparador:** Los datos de contacto se obtienen una sola vez por visita y se
    comparten con FR-004, FR-005, FR-006 y FR-040.
  - **Impacto en datos:** Las 8 claves de configuración que usa la interfaz (`telefono`,
    `whatsapp_url`, `instagram`, `instagram_url`, `booking_url`, `vuelo_url`, `bus_url`,
    `direccion`). La clave
    `whatsapp` de R-03 (número sin URL) no la consume ningún componente de este spec.

#### Inicio

- **FR-010 · Hero**
  - **Estado Visual:** Estático. Título "TU ESCAPE A CAPURGANÁ" en ambas vistas (regla web;
    decisión Q-15: no se registra excepción, "BIENVENIDO AL PARAÍSO" no se usa). Subtítulo:
    "Con Hotel Casa Costa prepárate para unas vacaciones paradisíacas que no podrás olvidar."
  - **Acción / Disparador:** Ninguna.
  - **Impacto en datos:** Ninguno (contenido estático, Q-05).

- **FR-011 · Bloque "Todas las comodidades a tu disposición"**
  - **Estado Visual:** Web: 3 imágenes estáticas (radio 15 px). Mobile: carrusel deslizable de 3
    imágenes con indicador de puntos (activo / inactivo).
  - **Acción / Disparador:** Botón "Ver opciones" en ambas vistas (regla web; Q-15) → navega a
    Comodidades (Q-02).
  - **Impacto en datos:** Ninguno.

- **FR-012 · Bloque "Descubre a Capurganá por completo"**
  - **Estado Visual:** Estático.
  - **Acción / Disparador:** Botón "Conoce más" (etiqueta web en ambas vistas; Q-15) → navega a
    Experiencias, sección Tours (Q-02).
  - **Impacto en datos:** Ninguno.

- **FR-013 · Calificaciones por plataforma**
  - **Estado Visual:** Dos cifras con rótulo GOOGLE y BOOKING, separadas por una estrella. Un
    decimal con punto (`4.7`, `9.0`). La escala no se muestra. Plataforma sin dato → se oculta esa
    cifra; ambas ausentes → se oculta el bloque.
  - **Acción / Disparador:** Ninguna.
  - **Impacto en datos:** Calificaciones por plataforma (plataforma, puntaje).

- **FR-014 · Carrusel de reseñas**
  - **Estado Visual:** Web: reseña activa centrada. Mobile: una tarjeta visible, deslizable, con
    puntos. Tarjeta: avatar, autor, "{calificación} ESTRELLAS", título y botón "LEER MÁS" (web,
    píldora radio 50 px) / "VER MÁS" (mobile) (R-14). El cuerpo no se muestra en la tarjeta.
  - **Acción / Disparador:** Flechas / deslizar → cambia la reseña activa. LEER MÁS / VER MÁS →
    FR-015.
  - **Impacto en datos:** Reseñas (autor, calificación, título) en su orden.

- **FR-015 · Pop-up de reseña completa**
  - **Estado Visual:** Cerrado / Abierto. Avatar, autor, "{calificación} ESTRELLAS", fecha
    `DD/MM/YYYY` (R-18), título y texto completo. Sin plataforma de origen (R-16).
  - **Acción / Disparador:** Cerrar → cierra.
  - **Impacto en datos:** Ninguno adicional.

- **FR-016 · Banner "CASACOSTA TE ESPERA"**
  - **Estado Visual:** Estático con botón "RESERVA".
  - **Acción / Disparador:** RESERVA → FR-004.
  - **Impacto en datos:** Ninguno.

#### Experiencias

- **FR-020 · Banner y encabezado de Planes**
  - **Estado Visual:** Estático. Íconos Transporte · Comida · Tours (R-07) y leyenda "Contamos con
    acomodación de 1 a 8 personas" (R-08).
  - **Impacto en datos:** Ninguno.

- **FR-021 · Carrusel de Planes**
  - **Estado Visual:** Web: tarjeta activa centrada, laterales al 50 %, flechas. Mobile:
    deslizable. Cada tarjeta replica la composición del afiche de su frame: la imagen del plan
    como fondo fotográfico (sin datos incrustados) y encima, maquetados según el frame, el
    nombre, la duración ("{días − 1} Noches · {días} Días") y los precios con las reglas de
    FR-023 y FR-060, todos tomados de la base. El itinerario y "Incluye" no aparecen en la
    tarjeta; se ven en el pop-up. Sin imagen → mismo contenido sobre fondo `primary`. Un solo
    plan → sin flechas.
  - **Acción / Disparador:** Flechas / deslizar → cambia el plan activo. Clic/tap en la tarjeta
    activa → FR-023.
  - **Impacto en datos:** Planes activos de categoría `plan`, en su orden.

- **FR-022 · Carrusel de Promociones**
  - **Estado Visual:** Igual que FR-021, bajo "PROMOCIONES" / "Disfruta de estos increíbles
    precios".
  - **Acción / Disparador:** Igual que FR-021; abre el **mismo** pop-up (R-19).
  - **Impacto en datos:** Planes activos de categoría `promocion`, en su orden.

- **FR-023 · Pop-up de plan / promoción**
  - **Estado Visual:** Cerrado / Abierto; fondo al 95 %; contenedor radio 50 px. Contenido:
    - Imagen, nombre (promociones sin prefijo "Tour", R-19) y descripción.
    - "Ideal para…" solo si existe.
    - **Sin temporada baja:** precio único → `$600.000`.
    - **Con temporada baja (R-06):** precio de temporada baja destacado en recuadro y debajo
      "Precio normal $X". Siempre ambos; sin lógica de fechas (P-05).
    - Botón RESERVAR (flujo 2 de la constitución; Q-04).
  - **Acción / Disparador:** RESERVAR → cierra el pop-up y abre FR-004. "X" → cierra. Destino
    enlazado → FR-024.
  - **Impacto en datos:** Detalle del plan activo. No encontrado → mensaje del catálogo dentro del
    pop-up.

- **FR-024 · Enlaces a destinos dentro de la descripción (R-21, P-13)**
  - **Estado Visual:** Un destino mencionado que exista en el catálogo de destinos se muestra
    **subrayado** como enlace. Los demás (Playa Soledad, Bahía Aguacate, Reserva Natural El Cielo,
    Piscina de coral) se muestran como texto plano.
  - **Regla de detección:** coincidencia exacta del nombre del destino dentro de la descripción
    (sensible a mayúsculas y tildes). Con el contenido semilla: "Plan Conoce Capurganá" enlaza
    Playa La Miel en Panamá, Bahía Sapzurro y Cabo Tiburón; "Plan Explora Capurganá" enlaza Cabo
    Tiburón; "Plan Capurganá Intrépida" no enlaza ninguno.
  - **Acción / Disparador (resuelve el destino del enlace que P-13 delegó a este spec):** clic →
    cierra el pop-up y desplaza la página hasta el bloque `#destino-{slug}` de la sección Tours.
  - **Impacto en datos:** Destinos (nombre, identificador).

- **FR-025 · Sección Tours (destinos)**
  - **Estado Visual:** Banner "TOURS" + intro. Por destino, un bloque con ancla
    `destino-{slug}`: imagen (radio 15 px, texto alternativo = nombre), nombre, descripción y frase
    destacada si existe. Sin precio ni reserva (R-12). Una imagen por destino en ambas vistas
    (regla web; Q-06).
  - **Impacto en datos:** Destinos en su orden.

#### Comodidades

- **FR-030 · Banner, encabezado e íconos**
  - **Estado Visual:** Estático. Texto de introducción definitivo de Comodidades (constitución,
    "Contenido confirmado", P-14) y etiqueta "Todas nuestras habitaciones cuentan con:" con
    rótulos Aire acondicionado · Baño privado · WiFi (R-11, P-20).
  - **Impacto en datos:** Ninguno (dotación común fijada por R-11).

- **FR-031 · Carrusel de habitaciones**
  - **Estado Visual:** Web: una habitación por slide con flechas (5 posiciones). Mobile: tarjetas
    deslizables. Una sola habitación → sin flechas.
  - **Acción / Disparador:** Flecha / deslizar → habitación anterior/siguiente según su orden.
  - **Impacto en datos:** Habitaciones con sus imágenes.

- **FR-032 · Tarjeta de habitación**
  - **Estado Visual:** Cada habitación tiene **3 imágenes** (las mismas en ambas vistas). Imagen
    activa (al cargar, la de menor orden) con etiqueta "Hasta {capacidad} personas"; nombre
    ("Habitación #N" / "Apartamento", R-09); camas; "Hasta {capacidad} personas". **Sin precio**
    (R-22). Mobile: mini-carrusel con las 3 imágenes e indicador. Sin imágenes → placeholder
    `surface`.
  - **Acción / Disparador:** Mobile: deslizar/flechas sobre la imagen → cambia la imagen. Web:
    la imagen cambia desde las miniaturas de FR-033. Al pasar a otra habitación, la imagen
    activa vuelve a la primera.
  - **Impacto en datos:** Habitación (nombre, capacidad, camas) e imágenes (url, texto
    alternativo, orden).

- **FR-033 · Panel de detalle de habitación (web)**
  - **Estado Visual:** Las 3 imágenes de la habitación como miniaturas (radio 15 px), con la
    miniatura de la imagen activa resaltada; nombre, tipo (p. ej. "Habitación familiar con baño
    privado") y descripción (m², capacidad, camas, dotación y desayuno).
  - **Acción / Disparador:** Clic en una miniatura → esa imagen pasa a ser la imagen de la
    tarjeta (FR-032) y su miniatura queda resaltada. Operable con teclado.
  - **Impacto en datos:** Habitación (tipo, descripción) e imágenes. El detalle individual por
    identificador sigue disponible según el contrato de la constitución.

- **FR-034 · Alimentación**
  - **Estado Visual:** Título, texto y carrusel de 3 imágenes (web con botones, mobile deslizable;
    laterales al 50 %).
  - **Acción / Disparador:** Botones / deslizar → cambia la imagen.
  - **Impacto en datos:** Ninguno (contenido estático, Q-05).

#### Cómo llegar

- **FR-040 · Tarjetas de opciones de transporte**
  - **Estado Visual:** Estático, con los rótulos "Opción 1:" / "Opción 2:" en ambas vistas (regla
    web) y erratas corregidas (P-15: "EN TU VEHÍCULO", "puedes llegar a Capurganá"). Botones
    rectangulares `cta` (radio 14 px web / 10 px mobile, P-17).
  - **Acción / Disparador:**
    - "COMPRA AHORA" (web) / "Agenda tu vuelo" (mobile) → `vuelo_url` en pestaña nueva (R-20).
    - "Consulta tiquetes" (ambas vistas, bajo "EN BUS"; en web con el estilo de "COMPRA AHORA",
      radio 14 px) → `bus_url` en pestaña nueva.
    - "VER MÁS" (lancha) → `whatsapp_url` en pestaña nueva.
    - Enlace no configurado → el botón no se muestra.
  - **Impacto en datos:** Configuración: `vuelo_url`, `bus_url`, `whatsapp_url`.

- **FR-041 · Banner "CASACOSTA TE ESPERA"**
  - **Estado Visual:** Con botón RESERVAR en ambas vistas (existe solo en web; regla web).
  - **Acción / Disparador:** RESERVAR → FR-004.
  - **Impacto en datos:** Ninguno.

#### FAQs

- **FR-050 · Banner**
  - **Estado Visual:** "¿QUÉ PREGUNTAS TIENES?" + "Sabemos que antes de viajar surgen muchas
    dudas, por eso reunimos aquí todo lo que necesitas saber para planear tu visita sin
    complicaciones." (ambas vistas; regla web).
  - **Impacto en datos:** Ninguno.

- **FR-051 · Lista de acordeones**
  - **Estado Visual:** Cada FAQ es un acordeón Closed / Open (fondo `surface`, radio 10 px). Web:
    dos columnas; mobile: una. Todos cerrados al cargar, en su orden. Contenido: las 3 FAQs de la
    constitución (P-10).
  - **Acción / Disparador:** Clic/tap → alterna abierto/cerrado. Operable con teclado (Enter /
    Espacio) y con su estado expandido/contraído anunciado a tecnologías de asistencia (Q-14).
  - **Impacto en datos:** FAQs (pregunta, respuesta, orden).

#### Reglas transversales de presentación

- **FR-060 · Formato de precio:** pesos enteros con separador de miles con punto y sin decimales,
  precedidos de `$` sin espacio: `$600.000`, `$1.100.000` (R-05).
- **FR-061 · Formato de fecha:** fecha almacenada `YYYY-MM-DD` mostrada como `DD/MM/YYYY`, sin
  desfases por zona horaria (R-18, CB-14).
- **FR-062 · Formato de calificación:** un decimal con punto (`9.0`), como en el diseño.
- **FR-063 · Etiqueta de estrellas:** "{n} ESTRELLAS"; para n = 1, "1 ESTRELLA" (Q-16).
- **FR-064 · Enlaces externos:** siempre en pestaña nueva y sin dar a la página destino acceso a
  la página de origen (R-20).
- **FR-065 · Estados de sección:** toda sección con datos dinámicos tiene estados *cargando*
  (Q-17), *vacío* y *error*, con los mensajes del catálogo y sin romper el resto de la página
  (Principio VI).
- **FR-066 · Responsive:** mobile-first; referencias 393 px y 1456 px; solo tokens de la
  constitución (Principio IV).

#### Fidelidad visual

- **FR-067 · Fidelidad visual por pantalla:** cada pantalla y componente replica su frame de
  referencia del archivo Figma `FUuT2oETZHhIh0PIIBFDHX`:

  | Pantalla / componente | Web | Mobile |
  |---|---|---|
  | Inicio | 12:2 | 158:182 |
  | Experiencias | 14:39 | 167:162 |
  | Comodidades | 27:16 | 167:1017 |
  | Cómo llegar | 27:38 | 167:1501 |
  | FAQs | 31:2 | 167:1620 |
  | Menú mobile | — | 270:32 |
  | Modal de reserva | 459:550 | 505:854 |
  | Pop-up de plan / promoción | 199:383, 514:710, 514:836, 514:914, 514:1029 | 369:541, 369:587, 369:602, 384:290, 384:305 |
  | Pop-up de reseña | 304:137, 454:1678, 454:1690 | 344:362, 369:377, 369:391 |
  | Acordeón (Closed/Open) | 458:423 | instancias de 167:1620 |
  | Carrusel de habitaciones | 454:896 | 551:3055, 526:1660 |

- **FR-068 · Medidas obligatorias:** imagen del hero de Inicio 1456×560 / 393×489; banner de
  página 1456×402 / 393×172; tarjeta de habitación mobile 329×316; tarjeta del pop-up de plan
  mobile 346×606; carruseles con elementos laterales al 50 % de opacidad; radios según la
  constitución ("Retícula y redondeado").
  - *Verificado en Figma (2026-10-13):* el UI Toolkit indica 1456×676 para la imagen home y
    352×606 para el pop-up de plan mobile, pero los frames de los prototipos (12:2; 369:541 y
    384:290) miden 1456×560 y 346×606. Se adoptan las medidas de los frames. Las demás medidas
    del Toolkit coinciden con los frames (14:39, 167:162, 158:182, 551:3055).

- **FR-069 · Textos flexibles:** los contenedores admiten textos distintos a los del diseño (más
  largos o más cortos) sin desbordar, solapar ni cambiar la composición.

- **FR-070 · Verificación visual (FV-07):** una pantalla solo se da por terminada cuando, en 393
  px y 1456 px:
  1. **Medición automática:** el tamaño y la posición de los elementos clave de su frame
     (contenedores de sección, imágenes, tarjetas, botones, íconos y las medidas de FR-068)
     coinciden con Figma con tolerancia de ±2 px. Las cajas de texto no se miden (FV-02).
  2. **Revisión manual con superposición:** la captura de la pantalla, superpuesta a la
     exportación de su frame, no muestra diferencias en colores, tipografías y pesos, radios,
     íconos, opacidades, sombras ni composición, salvo las excepciones visuales permitidas.
  3. **Estados:** cada pop-up, el modal, el menú mobile y el acordeón (Closed/Open) se revisan
     de la misma forma contra su variante de Figma (FR-067).
  - El resultado (mediciones fuera de tolerancia y diferencias encontradas) queda registrado
    por pantalla; cualquier diferencia no listada como excepción es un defecto (FV-04).

- **Excepciones visuales permitidas (FV-04):**
  - Campo "Precio" oculto en las tarjetas de habitación (R-22).
  - Footer visible en FAQs web (Q-08).
  - Botón "Consulta tiquetes" en web bajo "EN BUS", con el estilo de "COMPRA AHORA" (Q-12).
  - Banner CTA en Cómo llegar mobile (Q-13, resuelta por regla web).
  - Una sola imagen por destino en mobile, en lugar del carrusel de 3 (Q-06, resuelta por regla
    web).
  - Rótulos "Opción 1:" / "Opción 2:" en Cómo llegar mobile (regla web, FR-040).
  - Tarjetas de plan y promoción sin itinerario, "Incluye" ni indicador de 4 puntos incrustados
    del afiche; nombre, duración y precios maquetados sobre la foto (Q-03, FR-021).
  - **Temporal (2026-10-13):** mientras no haya fotos limpias de cada plan y promoción (Figma solo
    trae afiches con los datos incrustados), la tarjeta usa fondo `primary` en lugar de foto; el
    pop-up muestra el afiche de Figma. Se retira esta excepción al cargar las fotos (FR-021).
  - Estados no diseñados (carga, vacío, error, hover distinto de "Variante 2"), que usan solo
    tokens del toolkit.

#### Catálogo de mensajes amigables

| Caso | Mensaje al usuario |
|---|---|
| Sección no carga (error de red o del servidor) | "No pudimos cargar esta información. Intenta de nuevo en unos minutos." |
| Plan no encontrado (pop-up) | "Este plan ya no está disponible. Escríbenos por WhatsApp y te ayudamos a encontrar otro." |
| Sin planes | "Pronto tendremos nuevos planes para ti." |
| Sin promociones | "En este momento no tenemos promociones activas." |
| Sin reseñas | "Aún no hay reseñas para mostrar." |
| Sin FAQs | "Pronto publicaremos las preguntas frecuentes. Mientras tanto, escríbenos por WhatsApp." |
| Sin habitaciones | "No pudimos mostrar las habitaciones en este momento." |
| Sin canales de reserva | "En este momento no podemos mostrar las opciones de reserva. Intenta de nuevo más tarde." |
| Errores de la interfaz de datos | Mensaje en español; nunca stack traces. |

> Los mensajes que sugieren WhatsApp solo mencionan el canal si `whatsapp_url` existe.

### Key Entities *(include if feature involves data)*

- **Configuración**: pares clave/valor con los datos de contacto y enlaces externos (R-03, R-20).
- **Plan**: paquete con precio; categoría `plan` o `promocion`; nombre, descripción, "ideal
  para…", duración, precio normal, precio de temporada baja opcional (menor que el normal), imagen,
  orden y estado activo.
- **Destino**: lugar turístico informativo de la sección Tours; nombre, descripción, frase
  destacada, imagen, orden. Sin precio (R-12).
- **Habitación**: nombre, tipo, área, capacidad (1–8), camas, descripción, precio siempre vacío
  (R-22), orden; tiene varias **Imágenes de habitación** ordenadas.
- **Reseña**: autor, calificación (1–5), título, texto, fecha; selección manual (R-16).
- **Calificación por plataforma**: GOOGLE o BOOKING, puntaje y escala (R-15).
- **FAQ**: pregunta única, respuesta, orden.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Desde cualquier página, el usuario llega a WhatsApp o Booking en **máximo 2
  interacciones** (CTA → canal).
- **SC-002**: El 100 % de los datos de contacto y enlaces externos proviene de la configuración
  (0 valores fijos en la interfaz).
- **SC-003**: Ningún error técnico (stack trace, mensaje en inglés, datos crudos) es visible al
  usuario en ninguno de los casos borde CB-01 a CB-16.
- **SC-004**: En 393 px y 1456 px, cada pantalla coincide con su frame de Figma en todo lo visual
  (FV-01) con tolerancia de ±2 px, salvo las excepciones de la sección "Fidelidad visual". Los
  textos se rigen por la constitución, no por el diseño (FV-02).
- **SC-005**: El 100 % de los escenarios de aceptación de las historias 1 a 7 y de robustez se
  cumplen en ambas vistas.

## Assumptions

- Rutas de páginas: `/`, `/experiencias`, `/comodidades`, `/como-llegar`, `/faqs`; en web el logo
  del header lleva a Inicio (Q-01).
- Los botones de Inicio llevan a Comodidades y a la sección Tours de Experiencias (Q-02).
- El pop-up de plan incluye RESERVAR también en web (Q-04).
- Hero, imágenes de comodidades de Inicio, alimentación y textos de banners son contenido
  estático del frontend (Q-05).
- Una sola imagen por destino en ambas vistas (Q-06, regla web).
- El footer se muestra en todas las páginas, incluida FAQs web (Q-08).
- "Variante 2" del botón RESERVAR es su estado hover; los demás hover se definen con diseño (Q-09).
- Modal y pop-ups se cierran también con clic en el fondo y tecla Esc (Q-10).
- Varios acordeones pueden estar abiertos a la vez; reparto alterno izquierda/derecha por orden
  (Q-14).
- Avatar de reseña: inicial del autor sobre `secondary-1` (Q-16).
- Estado de carga: skeleton con fondo `surface`; una ruta inexistente redirige a Inicio (Q-17).
- La lista de planes sin categoría devuelve ambas categorías activas (Q-18).
- Carruseles circulares y sin avance automático (Q-21).
- **Dependencia:** el contenido semilla (constitución, "Contenido confirmado") y las imágenes
  finales están disponibles al construir la base y el frontend.

## Preguntas abiertas

| # | Tema | Detalle observado | Estado / propuesta |
|---|---|---|---|
| Q-01 | Rutas y acceso a Inicio en web | La constitución no define URLs; el header web no tiene "Inicio". | Propuesta en Assumptions. Confirmar si el header web tiene logo. |
| Q-02 | Destino de los botones de Inicio | Sin destino explícito en Figma. | Propuesta en Assumptions. |
| Q-03 | Tarjetas de plan con datos incrustados | Los afiches traen nombre, "2 Noches · 3 Días", precios e itinerario; indicador de 4 puntos. Un cambio de precio en la base deja la imagen desactualizada. | **Resuelta (2026-10-13):** tarjeta maquetada con datos de la base sobre la foto; una imagen por plan (FR-021). |
| Q-04 | RESERVAR en el pop-up web | El toolkit lo muestra; los frames de escritorio no. | Se incluye (flujo 2 de la constitución). |
| Q-05 | Contenido estático | Hero, imágenes de Inicio, alimentación y banners no tienen tabla. | Archivos estáticos del frontend. Confirmar. |
| Q-06 | Imágenes por destino | Mobile: carrusel de 3; el esquema tiene una imagen. | **Resuelta por regla web:** una imagen. Un carrusel exigiría enmendar la constitución. |
| Q-07 | Enlaces del footer | Solo se guardan handle, teléfono y dirección. | **Resuelta (2026-10-13):** Instagram → `instagram_url`; teléfono → `whatsapp_url`; dirección como texto (FR-005). Incorporada a la constitución v1.3.0 (P-21). |
| Q-08 | Footer en FAQs web | Oculto en el frame de escritorio, visible en mobile. | Se muestra (componente global). |
| Q-09 | Estados hover / activo | Solo RESERVAR tiene "Variante 2". | Propuesta en Assumptions; resto con diseño. |
| Q-10 | Cierre de capas | Solo se diseña la "X". | Fondo y Esc también (accesibilidad). Confirmar. |
| Q-11 | Galería de habitación en web | No se define interacción ni número de imágenes (¿1 + 3 o 3?). | **Resuelta (2026-10-13):** 3 imágenes; miniaturas interactivas (FR-032, FR-033). |
| Q-12 | "Consulta tiquetes" en web | Solo en mobile; R-20 y P-09 lo nombran sin restringir vista. | **Resuelta (2026-10-13):** se agrega en web; desviación visual permitida (FR-040). |
| Q-13 | Banner CTA en Cómo llegar mobile | Web lo tiene; mobile no. | **Resuelta por regla web:** se muestra en ambas (FR-041). |
| Q-14 | Comportamiento del acordeón | No se define apertura múltiple ni reparto de 3 FAQs en 2 columnas. | Propuesta en Assumptions. |
| Q-15 | Textos de Inicio por vista | Hero ("TU ESCAPE A CAPURGANÁ" / "BIENVENIDO AL PARAÍSO") y botones ("Ver opciones" / "VER MÁS", "Conoce más" / "CONÓCELAS") difieren. | **Resuelta (2026-10-13):** textos web en ambas vistas, sin excepción a la regla web (FR-010 a FR-012). |
| Q-16 | Estrellas y avatar | Solo hay "5 ESTRELLAS"; no hay foto en reseñas. | Propuesta en FR-063 y Assumptions. Confirmar. |
| Q-17 | Estado de carga y 404 del frontend | Sin diseño. | Propuesta en Assumptions. Confirmar. |
| Q-18 | Lista de planes sin categoría | El contrato solo muestra la ruta con parámetro. | Ambas categorías. Alternativa: exigirlo y rechazar. |
| Q-19 | "1.5 horas desde Medellín" en la ruta mixta | El diseño da 1,5 h al vuelo y también al bus/vehículo Medellín → Necoclí; por carretera suele ser mucho más. | Posible error de contenido: confirmar con el hotel antes de publicar. |
| Q-20 | Copy "Haz clic en 'Reserva ahora'" | El botón dice "RESERVA"/"RESERVAR". | Alinear el copy con la etiqueta del botón. |
| Q-21 | Carruseles: bucle y autoplay | No especificado. | Propuesta en Assumptions. |
| Q-22 | FAQ de mascotas | Pendiente de la política del hotel (P-10). | No se publica; se agrega en el contenido semilla cuando exista. |

**Discrepancias ya resueltas por la constitución** (sin acción): precio Intrépida (P-02), camas
Habitación #3 (P-03), Booking 9.0 (P-04), nombres "Habitación #N" (R-09), descripción Explora
Capurganá (P-12), textos de introducción (P-14), erratas (P-15), etiqueta de Comodidades (P-20).

## Anexo A — Contratos de datos y consultas (insumo para `/speckit-plan`)

> Sección aportada en el borrador del responsable del proyecto. Contiene detalle de
> implementación que la constitución exige validar (Principio III, "Contratos de Datos") y se
> conserva como insumo para `plan.md`, `data-model.md` y `contracts/`. Si difiere de la
> constitución, prevalece la constitución.

### A.1 Tablas e impacto

| Tabla | Pantallas / componentes | Operación |
|---|---|---|
| `configuracion` | Modal de reserva, footer, WhatsApp flotante, Cómo llegar | Lectura |
| `planes` | Experiencias: carruseles de planes y promociones, pop-up | Lectura |
| `destinos` | Experiencias: sección Tours, enlaces del pop-up | Lectura |
| `habitaciones` | Comodidades: carrusel, tarjeta y detalle | Lectura |
| `habitacion_imagenes` | Comodidades: imágenes de cada habitación | Lectura |
| `resenas` | Inicio: carrusel y pop-up de reseñas | Lectura |
| `calificaciones_plataforma` | Inicio: GOOGLE / BOOKING | Lectura |
| `faqs` | FAQs: acordeones | Lectura |

No se crean tablas ni columnas nuevas. Las únicas escrituras ocurren en `/db/seed.sql` al
construir la base.

### A.2 Campos y restricciones aplicadas

| Tabla.campo | Tipo SQLite | Restricción | Efecto en UI |
|---|---|---|---|
| `configuracion.clave` | `TEXT` | `PRIMARY KEY` | Una sola URL por canal. Clave ausente → botón oculto. |
| `planes.slug` | `TEXT` | `NOT NULL UNIQUE` | Identifica el pop-up (`/api/planes/:slug`). |
| `planes.categoria` | `TEXT` | `CHECK IN ('plan','promocion')` | Define el carrusel. |
| `planes.texto_ideal` | `TEXT` | Nullable | `NULL` → no se renderiza. |
| `planes.duracion_dias` | `INTEGER` | `CHECK > 0` | "{días − 1} Noches · {días} Días" en la tarjeta del carrusel (FR-021). |
| `planes.precio_normal` | `INTEGER` | `NOT NULL CHECK > 0` | Precio principal o "Precio normal $X". |
| `planes.precio_temporada_baja` | `INTEGER` | `NULL` o `0 < x < precio_normal` | No `NULL` → ambos precios. |
| `planes.activo` | `INTEGER` | `CHECK IN (0,1)` | `0` → excluido de listas y 404 en detalle. |
| `*.orden` (planes, destinos, habitaciones, resenas, faqs) | `INTEGER` | `DEFAULT 0` | `ORDER BY orden, id`. |
| `destinos.slug` | `TEXT` | `NOT NULL UNIQUE` | Ancla `#destino-{slug}`. |
| `destinos.destacado` | `TEXT` | Nullable | `NULL` → no se muestra. |
| `habitaciones.capacidad_max` | `INTEGER` | `CHECK BETWEEN 1 AND 8` | "Hasta N personas". |
| `habitaciones.area_m2` | `INTEGER` | `CHECK > 0` | En la respuesta; en UI dentro de `descripcion`. |
| `habitaciones.precio` | `INTEGER` | `NULL` o `> 0` | Siempre `NULL` (R-22) → oculto. |
| `habitacion_imagenes.habitacion_id` | `INTEGER` | `FOREIGN KEY … ON DELETE CASCADE` | Requiere `PRAGMA foreign_keys = ON`. |
| `resenas.calificacion` | `INTEGER` | `CHECK BETWEEN 1 AND 5` | "{n} ESTRELLAS". |
| `resenas.fecha` | `TEXT` | ISO `YYYY-MM-DD` | `DD/MM/YYYY`. |
| `calificaciones_plataforma.plataforma` | `TEXT` | `PRIMARY KEY CHECK IN ('GOOGLE','BOOKING')` | Una cifra por plataforma. |
| `calificaciones_plataforma.puntaje` | `REAL` | `>= 0` y `<= escala_max` | `4.7`, `9.0`. |
| `faqs.pregunta` | `TEXT` | `NOT NULL UNIQUE` | Sin duplicados. |

### A.3 Contrato de API y tipos compartidos

Todos los endpoints son `GET`. Éxito: `{ "data": ... }`. Error:
`{ "error": { "code": "...", "message": "..." } }`.

| Endpoint | `data` | Errores |
|---|---|---|
| `GET /api/planes?categoria=plan\|promocion` | `Plan[]` | `400 INVALID_PARAM` si `categoria` no es válida (sin parámetro: Q-18) |
| `GET /api/planes/:slug` | `Plan` | `400 INVALID_PARAM` · `404 NOT_FOUND` (inexistente o `activo=0`) |
| `GET /api/destinos` | `Destino[]` | — |
| `GET /api/habitaciones` | `Habitacion[]` (con `imagenes`) | — |
| `GET /api/habitaciones/:slug` | `Habitacion` | `400` · `404` |
| `GET /api/resenas` | `{ resenas: Resena[]; calificaciones: CalificacionPlataforma[] }` | — |
| `GET /api/faqs` | `Faq[]` | — |
| `GET /api/contacto` | `Contacto` | — |
| Método distinto de `GET` sobre `/api/*` | — | `405 METHOD_NOT_ALLOWED` (cabecera `Allow: GET`) |
| `GET` a ruta `/api/*` inexistente | — | `404 NOT_FOUND` |
| Fallo inesperado | — | `500 INTERNAL_ERROR` (detalle solo en el log) |

Validación de `slug` antes de consultar: `^[a-z0-9]+(?:-[a-z0-9]+)*$`, máximo 100 caracteres.

```ts
// /backend/types.ts (compartible con /frontend)
export type CategoriaPlan = 'plan' | 'promocion';

export interface Plan {
  id: number;
  slug: string;
  nombre: string;
  categoria: CategoriaPlan;
  descripcion: string;
  textoIdeal: string | null;
  duracionDias: number;
  precioNormal: number;
  precioTemporadaBaja: number | null;
  imagenUrl: string | null;
}

export interface Destino {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  destacado: string | null;
  imagenUrl: string | null;
}

export interface HabitacionImagen { id: number; url: string; alt: string; }

export interface Habitacion {
  id: number;
  slug: string;
  nombre: string;
  tipo: string;
  areaM2: number;
  capacidadMax: number;
  camasDescripcion: string;
  descripcion: string;
  precio: number | null;
  imagenes: HabitacionImagen[];
}

export interface Resena {
  id: number;
  autor: string;
  calificacion: number;
  titulo: string;
  texto: string;
  fecha: string; // YYYY-MM-DD
}

export interface CalificacionPlataforma {
  plataforma: 'GOOGLE' | 'BOOKING';
  puntaje: number;
  escalaMax: number;
}

export interface Faq { id: number; pregunta: string; respuesta: string; }

export interface Contacto {
  telefono: string | null;
  whatsappUrl: string | null;
  instagram: string | null;
  instagramUrl: string | null;
  bookingUrl: string | null;
  vueloUrl: string | null;
  busUrl: string | null;
  direccion: string | null;
}

export interface ApiError {
  error: {
    code: 'INVALID_PARAM' | 'NOT_FOUND' | 'METHOD_NOT_ALLOWED' | 'INTERNAL_ERROR';
    message: string;
  };
}
```

### A.4 Ejemplos de consulta (`better-sqlite3`)

**Conexión (`/backend/db.ts`)**

```ts
import Database from 'better-sqlite3';
import path from 'node:path';

export const db = new Database(path.resolve(__dirname, '../db/casacosta.db'), { fileMustExist: true });
db.pragma('foreign_keys = ON');
```

**Planes / promociones — lista (FR-021, FR-022)**

```ts
const listPlanes = db.prepare(`
  SELECT id, slug, nombre, categoria, descripcion, texto_ideal,
         duracion_dias, precio_normal, precio_temporada_baja, imagen_url
  FROM planes
  WHERE activo = 1 AND categoria = @categoria
  ORDER BY orden ASC, id ASC
`);
const rows = listPlanes.all({ categoria }); // categoria ya validada: 'plan' | 'promocion'
```

**Plan / promoción — detalle (FR-023)**

```ts
const getPlanBySlug = db.prepare(`
  SELECT id, slug, nombre, categoria, descripcion, texto_ideal,
         duracion_dias, precio_normal, precio_temporada_baja, imagen_url
  FROM planes
  WHERE slug = ? AND activo = 1
`);
const row = getPlanBySlug.get(slug); // undefined → 404 NOT_FOUND
```

**Destinos (FR-024, FR-025)**

```ts
const listDestinos = db.prepare(`
  SELECT id, slug, nombre, descripcion, destacado, imagen_url
  FROM destinos
  ORDER BY orden ASC, id ASC
`);
```

**Habitaciones con imágenes (FR-031 a FR-033)** — dos consultas y agrupación en TypeScript:

```ts
const listHabitaciones = db.prepare(`
  SELECT id, slug, nombre, tipo, area_m2, capacidad_max,
         camas_descripcion, descripcion, precio
  FROM habitaciones
  ORDER BY orden ASC, id ASC
`);
const listImagenes = db.prepare(`
  SELECT id, habitacion_id, url, alt
  FROM habitacion_imagenes
  ORDER BY habitacion_id ASC, orden ASC, id ASC
`);

const getHabitacionBySlug = db.prepare(`
  SELECT id, slug, nombre, tipo, area_m2, capacidad_max,
         camas_descripcion, descripcion, precio
  FROM habitaciones
  WHERE slug = ?
`);
const listImagenesByHabitacion = db.prepare(`
  SELECT id, url, alt
  FROM habitacion_imagenes
  WHERE habitacion_id = ?
  ORDER BY orden ASC, id ASC
`);
```

**Reseñas y calificaciones (FR-013 a FR-015)**

```ts
const listResenas = db.prepare(`
  SELECT id, autor, calificacion, titulo, texto, fecha
  FROM resenas
  ORDER BY orden ASC, id ASC
`);
const listCalificaciones = db.prepare(`
  SELECT plataforma, puntaje, escala_max
  FROM calificaciones_plataforma
  ORDER BY CASE plataforma WHEN 'GOOGLE' THEN 1 WHEN 'BOOKING' THEN 2 END
`);
```

**FAQs (FR-051)**

```ts
const listFaqs = db.prepare(`
  SELECT id, pregunta, respuesta
  FROM faqs
  ORDER BY orden ASC, id ASC
`);
```

**Contacto (FR-004 a FR-007, FR-040)**

```ts
const listContacto = db.prepare(`
  SELECT clave, valor
  FROM configuracion
  WHERE clave IN ('telefono', 'whatsapp_url', 'instagram', 'instagram_url', 'booking_url',
                  'vuelo_url', 'bus_url', 'direccion')
`);
// Se mapea a Contacto: snake_case → camelCase; clave ausente → null.
```

**Catch-all de `/api/*` (Express, después de las rutas GET)** — un `GET` a una ruta inexistente
responde 404; cualquier otro método, 405:

```ts
app.all('/api/*', (req, res) => {
  if (req.method === 'GET') {
    res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'No encontramos lo que buscas.' },
    });
    return;
  }
  res.set('Allow', 'GET').status(405).json({
    error: { code: 'METHOD_NOT_ALLOWED', message: 'Esta acción no está disponible.' },
  });
});
```
