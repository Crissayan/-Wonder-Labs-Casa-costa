# Contrato de la interfaz: rutas, anclas y enlaces

## Rutas

| Ruta | Página | Frames (web / mobile) |
|---|---|---|
| `/` | Inicio | 12:2 / 158:182 |
| `/experiencias` | Experiencias | 14:39 / 167:162 |
| `/comodidades` | Comodidades | 27:16 / 167:1017 |
| `/como-llegar` | Cómo llegar | 27:38 / 167:1501 |
| `/faqs` | FAQs | 31:2 / 167:1620 |
| cualquier otra | Redirige a `/` (Q-17) | — |

## Anclas

| Ancla | Destino | Usada por |
|---|---|---|
| `/experiencias#tours` | Banner "TOURS" | "Conoce más" de Inicio (FR-012) |
| `/experiencias#destino-{slug}` | Bloque de un destino | Enlaces del pop-up de plan (FR-024) |

## Navegación interna

| Disparador | Destino |
|---|---|
| Logo del header (web) / "Inicio" del menú mobile | `/` |
| EXPERIENCIAS · COMODIDADES · COMO LLEGAR · FAQS | Ruta correspondiente |
| "Ver opciones" (Inicio) | `/comodidades` |
| Cualquier RESERVAR / RESERVA | Abre el modal de reserva (no navega) |

## Enlaces externos (siempre `target="_blank" rel="noopener noreferrer"`)

| Disparador | Clave de `configuracion` | Si falta la clave |
|---|---|---|
| DIRECTO (modal) | `whatsapp_url` | Se oculta la opción |
| BOOKING (modal) | `booking_url` | Se oculta la opción |
| Botón flotante de WhatsApp | `whatsapp_url` | Se oculta |
| Footer: usuario de Instagram | `instagram_url` | Texto sin enlace |
| Footer: teléfono | `whatsapp_url` | Texto sin enlace |
| Footer: "Booking.com" | `booking_url` | Se oculta la fila |
| "COMPRA AHORA" / "Agenda tu vuelo" | `vuelo_url` | Se oculta el botón |
| "Consulta tiquetes" (ambas vistas) | `bus_url` | Se oculta el botón |
| "VER MÁS" (lancha) | `whatsapp_url` | Se oculta el botón |

Si faltan ambos canales del modal, se muestra "En este momento no podemos mostrar las opciones de
reserva. Intenta de nuevo más tarde."
