# Data Model: Sitio web Hotel Casa Costa (MVP)

**Fecha**: 2026-10-13 · **Plan**: [plan.md](./plan.md)

El esquema SQL es el de la constitución v1.3.0 ("Contratos de Datos") y se copia sin cambios a
`db/schema.sql`. Este documento resume cada entidad, su mapeo a JSON, sus validaciones y el
inventario del contenido semilla. No hay transiciones de estado: el sitio solo lee.

## Entidades

### Configuración (`configuracion`)

Pares clave/valor. Se exponen como un único objeto `Contacto` (clave ausente → `null`).

| Clave SQL | Campo JSON | Uso |
|---|---|---|
| `telefono` | `telefono` | Footer (texto que abre `whatsapp_url`) |
| `whatsapp_url` | `whatsappUrl` | DIRECTO, WhatsApp flotante, "VER MÁS" de Cómo llegar, teléfono del footer |
| `instagram` | `instagram` | Footer (texto) |
| `instagram_url` | `instagramUrl` | Footer: enlace del usuario de Instagram |
| `booking_url` | `bookingUrl` | BOOKING y "Booking.com" del footer |
| `vuelo_url` | `vueloUrl` | "COMPRA AHORA" / "Agenda tu vuelo" |
| `bus_url` | `busUrl` | "Consulta tiquetes" |
| `direccion` | `direccion` | Footer (texto) |
| `whatsapp` | — | Número sin URL; ningún componente lo consume (no se expone) |

Validación: las URLs se guardan limpias (R-20); `whatsapp_url` lleva solo el parámetro del
mensaje prellenado de P-08.

### Plan (`planes`)

| Columna | Campo JSON | Tipo | Reglas |
|---|---|---|---|
| `id` | `id` | number | PK |
| `slug` | `slug` | string | Único; `^[a-z0-9]+(?:-[a-z0-9]+)*$`, ≤ 100 |
| `nombre` | `nombre` | string | Promociones sin prefijo "Tour" (R-19) |
| `categoria` | `categoria` | `'plan' \| 'promocion'` | `CHECK` |
| `descripcion` | `descripcion` | string | Destinos existentes se enlazan (R-21) |
| `texto_ideal` | `textoIdeal` | string \| null | |
| `duracion_dias` | `duracionDias` | number | > 0; tarjeta: "{d−1} Noches · {d} Días" |
| `precio_normal` | `precioNormal` | number (COP) | > 0 |
| `precio_temporada_baja` | `precioTemporadaBaja` | number \| null | `0 < x < precio_normal` (R-06) |
| `imagen_url` | `imagenUrl` | string \| null | Foto de fondo de la tarjeta y del pop-up |
| `orden` | — | number | `ORDER BY orden, id` |
| `activo` | — | 0/1 | `0` → excluido de listas y 404 en detalle |

### Destino (`destinos`)

`id`, `slug` (ancla `#destino-{slug}`), `nombre` (coincidencia exacta para R-21), `descripcion`,
`destacado` (nullable), `imagen_url` → `imagenUrl` (nullable), `orden`. Sin precio (R-12).

### Habitación (`habitaciones`) e imágenes (`habitacion_imagenes`)

| Columna | Campo JSON | Reglas |
|---|---|---|
| `id`, `slug` | `id`, `slug` | Slug único |
| `nombre` | `nombre` | "Habitación #N" / "Apartamento" (R-09) |
| `tipo` | `tipo` | |
| `area_m2` | `areaM2` | > 0 |
| `capacidad_max` | `capacidadMax` | 1–8 |
| `camas_descripcion` | `camasDescripcion` | |
| `descripcion` | `descripcion` | Incluye m², capacidad, camas, dotación y desayuno |
| `precio` | `precio` | Siempre `NULL` (R-22) |
| `orden` | — | |

`habitacion_imagenes` (1:N, `ON DELETE CASCADE`): `id`, `url`, `alt`, `orden`. **3 imágenes por
habitación** (clarificación 3); se devuelven anidadas en `Habitacion.imagenes`, ordenadas.

### Reseña (`resenas`) y calificación (`calificaciones_plataforma`)

- `resenas`: `id`, `autor`, `calificacion` (1–5), `titulo`, `texto`, `fecha` (`YYYY-MM-DD`,
  se muestra `DD/MM/YYYY` sin `Date`), `orden`. Sin plataforma de origen (R-16).
- `calificaciones_plataforma`: `plataforma` (`GOOGLE` | `BOOKING`), `puntaje`, `escala_max` →
  `escalaMax`; `puntaje ≤ escala_max`. Orden fijo GOOGLE, BOOKING.

### FAQ (`faqs`)

`id`, `pregunta` (única), `respuesta`, `orden`.

## Contenido semilla

Fuente de cada dato: **C** = constitución ("Contenido confirmado" y reglas), **F** = frame de
Figma (se lee con `get_design_context` al escribir el seed, FV-05), **S** = spec. Erratas de P-15
corregidas. `—` = pendiente sin fuente (D-11).

### `configuracion`

| Clave | Valor | Fuente |
|---|---|---|
| `whatsapp` | `573128686680` | C (P-08) |
| `whatsapp_url` | `https://wa.me/573128686680?text=` + "Quiero más info sobre Hotel Casa Costa 🏝️" codificado en URL | C (P-08) |
| `telefono` | `+57 312 8686680` | F (footer) |
| `instagram` | `@hotelcasacosta_` | F (footer) |
| `instagram_url` | `https://www.instagram.com/hotelcasacosta_/` | C (P-21) |
| `booking_url` | `https://www.booking.com/hotel/co/casa-costa.es.html` | S |
| `direccion` | `Calle la Arrocera, 278017, Capurganá Colombia` | F (footer) |
| `vuelo_url` | — (Moon Flights chárter) | Pendiente |
| `bus_url` | — (redBus Medellín–Necoclí) | Pendiente |

### `planes`

| slug | nombre | categoria | duración | precio_normal | temporada_baja | Fuente |
|---|---|---|---|---|---|---|
| `plan-conoce-capurgana` | Plan Conoce Capurganá | plan | 3 | 600000 | NULL | F (369:541), S |
| `plan-capurgana-intrepida` | Plan Capurganá Intrépida | plan | F | 1100000 | 980000 | C (P-02) |
| `plan-explora-capurgana` | Plan Explora Capurganá | plan | 4 | 850000 | 750000 | C (P-12) |
| `capurgana-a-tu-ritmo` | Capurganá a tu Ritmo | promocion | 4 | 210000 | NULL | C (P-06), F (384:290) |
| `capurgana-express` | Capurganá Express | promocion | F | 320000 | NULL | C (P-06) |

Descripciones e "ideal para…": F (frames de pop-up de FR-067). "Plan Conoce Capurganá": "3 días
inolvidables en Capurganá con transporte ida y regreso desde Necoclí, desayunos y cenas en el
hotel, y tours espectaculares como Playa La Miel en Panamá, Bahía Sapzurro y Cabo Tiburón." /
"Ideal para quienes quieren una primera experiencia completa, cómoda y al mejor precio."
"Explora Capurganá": descripción web de P-12. El `orden` sigue el orden del carrusel en Figma.

### `destinos` (F: 14:39)

| slug | nombre | destacado |
|---|---|---|
| `playa-la-miel` | Playa La Miel en Panamá | "Un imperdible en tu visita a Capurganá, perfecto para disfrutar de mar, paisaje y cultura en un solo lugar." |
| `bahia-sapzurro` | Bahía Sapzurro | "Un destino para quienes buscan paz, belleza natural y desconexión total." |
| `cabo-tiburon` | Cabo Tiburón | "Perfecto para quienes buscan explorar y llevarse una experiencia inolvidable del Caribe." |

Descripciones: texto completo de cada bloque en 14:39 (sin la errata "PCabo Tiburón").

### `habitaciones` (C: R-09; F: 454:896)

| slug | nombre | m² | capacidad | camas |
|---|---|---|---|---|
| `habitacion-1` | Habitación #1 | 18 | 6 | F |
| `habitacion-2` | Habitación #2 | 13 | 4 | 1 cama individual y 2 literas (S) |
| `habitacion-3` | Habitación #3 | 11 | 3 | 1 cama doble y 1 litera (C, P-03) |
| `habitacion-4` | Habitación #4 | 11 | 3 | F |
| `apartamento` | Apartamento | 24 | 8 | F |

`tipo` y `descripcion`: F. `precio`: NULL. 3 imágenes por habitación (`/img/habitaciones/{slug}-{1..3}.webp`).

### `resenas` (C: P-11; textos F)

| autor | titulo | calificación | fecha |
|---|---|---|---|
| Daniela | EXCELENTE | 5 | 2025-10-10 |
| Gabriela | INCREÍBLE | 5 | 2025-10-10 |
| Samuel | PERFECTO | 5 | 2025-10-10 |

### `calificaciones_plataforma` (C: R-15)

`GOOGLE` 4.7 / 5 · `BOOKING` 9.0 / 10.

### `faqs` (C: P-10)

1. "¿En Capurganá hay aeropuerto?" · 2. "¿Cuál es la diferencia entre planes y tours?" ·
3. "¿Qué hay en Bahía Aguacate?" — respuestas literales de la constitución. Sin la FAQ de
mascotas.
