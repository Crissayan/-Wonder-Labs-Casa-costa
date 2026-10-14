# Revisión visual con superposición (FR-070, FV-07)

Procedimiento en `specs/001-sitio-casacosta/contracts/visual-verification.md`. Cada fila registra
una pantalla/estado verificado en su ancho: mediciones automáticas (`npm run test:visual`) y
revisión de la captura superpuesta al frame de Figma.

| Pantalla | Ancho | Estado | Mediciones fuera de tolerancia | Diferencias visuales | Excepción aplicada | Resultado |
|---|---|---|---|---|---|---|
| Modal de reserva | 1456 | modal-abierto (459:550) | 0 | Ninguna en composición, colores, tipografía e íconos | Radio 50 px del contenedor (P-17; el frame usa 10 px); fondo `primary` al 20 % en lugar de negro al 21 % (P-18); aspa de cierre en `cta` (P-18) | ✅ |
| Modal de reserva | 393 | modal-abierto (505:854) | 0 | Ninguna | Las mismas que en 1456 | ✅ |
| Experiencias | 1456 | default (14:39) | 0 | Separación de secciones depende de los textos reales (FV-02) | Tarjetas de plan sobre fondo `primary` sin foto (excepción temporal FR-021); radio de imágenes de destino 15 px (constitución; el frame usa 32 px); color de frase destacada `cta` (P-18; el frame usa #F0B856) | ✅ |
| Experiencias | 393 | default (167:162) | 0 | Ídem | Las mismas; una sola imagen por destino en lugar del carrusel de 3 (Q-06) | ✅ |
| Pop-up de plan | 1456 | popup-plan (514:710) | 0 | Ninguna en composición | Botón RESERVAR añadido (Q-04); fondo blanco al 95 % (frame sin fondo definido); radio 50 px (P-17) | ✅ |
| Pop-up de plan | 393 | popup-plan (369:541) | 0 | Precio de temporada baja destacado y "Precio normal" como referencia (R-06; el frame mobile invierte el énfasis) | Radio 50 px (P-17) | ✅ |
| Comodidades | 1456 | default (27:16) | 0 | Texto del banner a 28 px para que el texto definitivo de P-14 quepa en 402 px (FV-02) | Fondo de Alimentación `secondary-4` (P-18; el frame usa #4EAABD); ícono de baño exportado de Figma (lucide-react 0.454 no trae `toilet`); etiqueta "Hasta N personas" incrustada en la foto principal, como en Figma | ✅ |
| Comodidades | 393 | default (167:1017) | 0 | El banner crece en alto para el texto definitivo de P-14 (FV-02) | Rótulos de íconos según P-20 y erratas P-15 | ✅ |
| Inicio | 1456 | default (12:2) | 0 | Ninguna en composición | Fondo de Tours `secondary-4` y enlaces `cta` (P-18); avatar con inicial sobre `secondary-1` (Q-16; el frame usa un círculo gris) | ✅ |
| Inicio | 393 | default (158:182) | 0 | El título del hero ocupa 2 líneas (texto web más largo, FV-02 y Q-15); botones con etiquetas web "Ver opciones" / "Conoce más" (Q-15) | Las mismas | ✅ |
| Pop-up de reseña | 1456 | popup-resena (454:1690) | 0 | Ninguna | Radio 50 px (P-17) | ✅ |
| Pop-up de reseña | 393 | popup-resena (344:362) | 0 | Se muestra el título de la reseña (regla web; el frame mobile lo omite) | Radio 50 px (P-17) | ✅ |
| Cómo llegar | 1456 | default (27:38) | 0 | Altura de tarjetas según textos reales (FV-02) | "Consulta tiquetes" en web (Q-12); radio de tarjetas 10 px (bloques de información, constitución; el frame usa 25 px); íconos exportados de Figma con trazo `primary` (P-18) | ✅ |
| Cómo llegar | 393 | default (167:1501) | 0 | Texto del banner = texto web (P-14) | Rótulos "Opción 1:" / "Opción 2:" y banner CTA en mobile (regla web); "VER MÁS" en mayúsculas (R-20) | ✅ |
| FAQs | 1456 | acordeon-closed / acordeon-open (31:2, 458:423) | 0 | 3 FAQs en lugar de 6 (P-10); reparto alterno en 2 columnas (Q-14) | Radio 10 px de los acordeones (bloques, constitución; el frame usa 15 px); capa `primary` al 70 % (P-18) | ✅ |
| FAQs | 393 | acordeon-closed (167:1620) | 0 | Texto del banner = texto web (regla web) | Capa `primary` al 50 % (P-18) | ✅ |
| Header, footer y WhatsApp | 1456 | default (304:37, 454:2856) | 0 | Header de 118 px (rectángulo visible del frame) | Logo de WhatsApp con su color de marca (asset de Figma, no es token); línea del footer en blanco | ✅ |
| Header, footer y WhatsApp | 393 | default (278:2, 523:1298) | 0 | Ninguna | Las mismas | ✅ |
| Menú mobile | 393 | menu-abierto (270:32) | 0 | "Inicio" con el mismo peso que los demás enlaces (el frame lo deja en regular) | Fondo `primary` al 20 % (P-18) | ✅ |
