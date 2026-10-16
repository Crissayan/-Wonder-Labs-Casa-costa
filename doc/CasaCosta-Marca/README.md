# Casa Costa Hotel — Recursos de marca

Kit de marca extraído del UI Toolkit de Figma (`CasaCostaUIToolKit.pdf`) y de las pantallas `CasaCostaWeb.pdf` / `CasaCostaMobile.pdf` del proyecto [Wonder Labs] CasaCosta.

## Estructura

| Carpeta | Contenido |
|---|---|
| `01-logo/isotipo` | Isotipo (ola + sol + montaña) en color, blanco y negro — PNG transparente, alta resolución |
| `01-logo/logo-completo` | Isotipo + "CASA COSTA / HOTEL" en color, blanco y negro |
| `01-logo/wordmark` | Solo texto "CASA COSTA / HOTEL", azul y blanco |
| `02-color` | Paleta (`paleta.png`, `paleta.txt`) |
| `03-tipografia` | Nunito e Inter (WOFF2, latin, pesos 400–900) + licencia OFL |
| `04-iconos` | 11 iconos de comodidades + navegación + redes, en SVG y PNG |
| `05-fotografia` | Fotos reales del diseño: destino, hotel, habitaciones, gastronomía, piezas de planes |
| `06-ui-toolkit` | Láminas del toolkit en PNG (referencia de componentes y medidas) |
| `07-tokens` | `tokens.css`, `tailwind.config.js` (preset), `design-tokens.json` |

## Logo

- **Isotipo**: círculo con ola (cyans), sol (#FAB53F) y montaña (navy + teal).
- Versiones: **color** sobre fondos claros, **blanco** sobre navy o fotografía, **negro** para usos monocromáticos.
- En el header web se usa el isotipo a color solo (sin texto) sobre fondo navy.
- El wordmark usa Nunito: "CASA COSTA" en mayúsculas y "HOTEL" con tracking muy amplio.

## Color

| Rol | Nombre | Hex |
|---|---|---|
| Texto, fondos e íconos | Navy | `#1A364F` |
| Fondo | Blanco | `#FFFFFF` |
| Botones y CTA | Sol | `#FAB53F` |
| Detalles / texto en fondo oscuro | Cyan 500 | `#3DBCD5` |
| Detalles | Cyan 400 | `#6AC6DE` |
| Detalles | Cyan 200 | `#A0D7E8` |
| Detalles | Teal | `#67C1BD` |

Observados en los diseños pero no declarados en la paleta: `#1C3149` (footer), `#2F4670` (botón FAQ), `#EFEFEF` (tarjetas y FAQ cerrado), `#D9D9D9` (placeholders), overlay del pop-up navy al 95%.

## Tipografía

- **Principal — Nunito**: títulos, subtítulos, encabezados, botones.
- **Secundaria — Inter**: captions y párrafos.

| Estilo | Escritorio | Mobile |
|---|---|---|
| Títulos | 64 | 28 |
| Subtítulos | 48 | 24 |
| Encabezado / apartados | 36 | 20 |
| Botones | 30 | 12 |
| Captions (Inter) | 26 | 12 |
| Párrafos (Inter) | 22 | 12 |

## Layout

- **Escritorio**: 8 columnas, margen 80, gutter 24 · 4 filas, gutter 20.
- **Mobile**: 5 columnas, margen 30, gutter 16 · 6 filas, gutter 20.
- **Espaciado entre bloques (escritorio)**: 50px.
- **Radios**: imágenes 15px · bloques de información 10px · botones en píldora.

## Componentes (ver `06-ui-toolkit`)

- **Header**: fondo navy, isotipo, links EXPERIENCIAS · COMODIDADES · CÓMO LLEGAR · FAQS (activo subrayado), botón RESERVAR en píldora amarilla.
- **Footer**: fondo navy profundo, línea divisoria cyan, columnas Contáctanos (Instagram @hotelcasacosta_, WhatsApp 312 8686680), Reservas (Booking.com), Dirección (Calle la Arrocera, 278017, Capurganá, Colombia); botón flotante de WhatsApp.
- **Botones**: CTA amarillo (RESERVAR, LEER MÁS, COMPRA AHORA), acordeón FAQ navy con chevron, navegación circular (cerrar amarillo, isotipo, flechas izq/der).
- **Tarjeta de habitación**: 1350×660 escritorio / 329×316 mobile deslizable con dots.
- **Carruseles**: slide central + laterales al 50% de opacidad; botones en escritorio, swipe en mobile.
- **Pop-up de plan**: 916×1606 escritorio (overlay 95%) / 352×606 mobile.
- **Reseñas**: Google 4.7 ★ Booking 9.0, tarjetas con "LEER MÁS" / "VER MÁS".
- **FAQs**: acordeón de dos columnas (escritorio, gap 38) / una columna (mobile, gap 10).

## Imágenes

| Pieza | Escritorio | Mobile |
|---|---|---|
| Imagen home | 1456×676 | 393×489 |
| Imagen banner | 1456×402 | 393×172 |

> Las tipografías Nunito e Inter son de Google Fonts bajo licencia SIL Open Font License. Las fotografías y el logo pertenecen a Casa Costa Hotel.
