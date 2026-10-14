# Contrato de la verificación visual (FR-070, FV-07)

Define cómo se declara y se mide la fidelidad visual de cada pantalla en 393 px y 1456 px.

## 1. Marcado de elementos clave

Cada elemento que se mide lleva el atributo `data-fv="<id>"`, con ids estables en
`kebab-case` (p. ej. `home-hero`, `home-hero-titulo-caja`, `exp-plan-card-activa`,
`modal-reserva`). Se marcan contenedores de sección, imágenes, tarjetas, botones, íconos y las
medidas de FR-068. **No** se marcan cajas de texto (FV-02); sí el contenedor que las aloja.

## 2. Archivo de cajas esperadas

`frontend/e2e/visual/expected/<pantalla>.<ancho>.json`, extraído del frame de Figma con
`get_metadata` / `get_design_context` (FV-05):

```json
{
  "frame": "12:2",
  "viewport": { "width": 1456 },
  "state": "default",
  "boxes": {
    "home-hero": { "x": 0, "y": 120, "width": 1456, "height": 560 },
    "home-comodidades-img-1": { "x": 135, "y": 936, "width": 366, "height": 322 }
  }
}
```

- `state` admite `default` o el nombre de una variante (`modal-abierto`, `popup-plan-1`,
  `menu-abierto`, `acordeon-open`, …) para los estados de FR-067.
- Coordenadas relativas al documento (`y` incluye el scroll), redondeadas a enteros.
- Si un texto real más largo desplaza los elementos siguientes, solo se compara `x`, `width` y
  `height` de esos elementos (`"compare": ["x", "width", "height"]`), nunca se relaja la
  tolerancia.

## 3. Ejecución

`frontend/e2e/visual/visual.spec.ts`, por cada archivo esperado:

1. Abre la ruta con el viewport indicado y la API con el seed; espera a
   `document.fonts.ready` y comprueba `document.fonts.check('1em Nunito')` y
   `document.fonts.check('1em Inter')` (FV-06).
2. Lleva la página al estado indicado (abrir modal, pop-up, menú o acordeón).
3. Mide `getBoundingClientRect()` + scroll de cada `data-fv` y falla si alguna diferencia supera
   **±2 px** o falta un elemento esperado.
4. Comprueba que no hay scroll horizontal (`scrollWidth <= clientWidth`) en 393, 768, 1024 y
   1456 px (FV-03).
5. Guarda la captura de página completa en `frontend/e2e/visual/output/` para la revisión manual.

## 4. Revisión manual con superposición

Para cada pantalla y estado, la captura se superpone a la exportación PNG del frame
(`frontend/e2e/visual/frames/<frame>.png`, a escala 1×) con 50 % de opacidad. Se revisan
colores, tipografías y pesos, radios, íconos, opacidades, sombras y composición. El resultado se
registra en `frontend/e2e/visual/REVIEW.md`:

| Pantalla | Ancho | Estado | Mediciones fuera de tolerancia | Diferencias visuales | Excepción aplicada | Resultado |
|---|---|---|---|---|---|---|

Cualquier diferencia que no corresponda a una excepción visual permitida del spec es un defecto
(FV-04) y la pantalla no se da por terminada (FV-07).
