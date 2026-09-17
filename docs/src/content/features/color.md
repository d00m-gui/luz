---
title: "Color"
fields:
  - "primary"
  - "secondary"
  - "mode"
  - "contrastThreshold"
order: 2
examples:
  - label: "Paleta con secundario explícito"
    lang: "ts"
    code: |
      luz({
        primary: "#f28c20",
        secondary: "#2563eb",
        mode: "auto",
      })
  - label: "Marca sobre una superficie, sin declarar texto"
    lang: "css"
    code: |
      .card.brand {
        --current-bg: oklch(0.42 0.11 264);
      }
      .card.brand .badge {
        --current-bg: oklch(0.62 0.14 264);
      }
  - label: "Motor OKLCH sin luz()"
    lang: "ts"
    code: |
      import { contrastRatio, oklchToSrgb, srgbToOklch } from "@d00m-gui/luz/color";

      const brand = srgbToOklch([0, 125, 234]);
      // { l: 0.5937882089772928, c: 0.1883495436898707, h: -106.11389388258317 }
      oklchToSrgb({ ...brand, l: 0.85 }); // [172, 209, 255]
      contrastRatio(brand, srgbToOklch([255, 255, 255])); // 4.1003220927636
---

Sin `secondary`, se deriva rotando el hue de `primary` 180° — no hace
falta definirlo si alcanza con un complementario automático. La paleta
primaria es siempre `--primary-*` y la de grises `--neutral-*`.
`mode: "auto"` emite paleta clara en `:root` y oscura bajo
`prefers-color-scheme: dark`, a diferencia de `"light"`/`"dark"` que
fijan una sola.

`--current-bg` y `--current-color` son API pública: el primero es "el
fondo de esto", el segundo el texto legible sobre ese fondo.
`_contrast.css` lo calcula para cualquier elemento
(`* { --current-color: var(--on-scheme, oklch(from var(--current-bg) … )) }`),
así que reescribir `--current-bg` en un scope alcanza para vestir una
superficie de marca — el texto se recalcula solo y no hay que declarar
ningún color: ninguna de las dos reglas del ejemplo declara `color`.

`contrastThreshold` mueve el punto de `l` donde ese cálculo pasa de
texto claro a oscuro, y `--on-scheme` lo saltea del todo: gana sobre
`--current-color` cuando querés un texto fijo
(`button.danger { --on-scheme: white }`).

`--scheme` es la palanca del otro extremo. Las clases de esquema
(`.primary`, `.danger`, `.neutral`, …) solo fijan `--scheme`, y cada
componente lo convierte en su propio `--current-bg`: sólido en
`.card`/`button`/`.stat`, 26% de opacidad en `.badge`, 12% mezclado con
`--background` en `.alert`. Como es una custom property, fijarla en un
contenedor tiñe todo lo que haya adentro sin saber qué componentes son.

`--element-background` es el fondo de superficie que `_depth.css`
calcula por nivel de anidamiento (`:root` = `--background`; cada
componente elevado se aclara u oscurece según `depthMax`/`depthDecay`/
`depthSign`). Es el token para pintar un adorno propio "del mismo color
que la superficie que lo contiene", y el fallback de `--current-bg` en
`.card`/`.stat` cuando no hay `--scheme`.

`@d00m-gui/luz/color` expone el mismo motor OKLCH con el que `luz()`
bakea los shades, sin llamar a `luz()`: `srgbToOklch([r, g, b])` (0–255)
devuelve `{ l, c, h }`, `oklchToSrgb({ l, c, h })` devuelve una tupla
0–255 ya mapeada al gamut sRGB y `contrastRatio(a, b)` el ratio WCAG 2.1
(21 entre blanco y negro), además de
`parseColorToOklch`/`formatOklch`/`clampToSrgb`/`maxSrgbChroma`/
`isInSrgbGamut`. Un preview en cliente calcula los mismos números que el
CSS emitido en vez de duplicar la conversión.
