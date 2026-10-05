---
title: "Avanzado"
fields:
  - "properties"
  - "vars"
  - "stateHoverDelta"
  - "statePressedDelta"
  - "statePressedShift"
order: 5
examples:
  - label: "@property y overrides crudos"
    lang: "ts"
    code: |
      luz({
        primary: "#f28c20",
        properties: true,
        vars: {
          "space-4": "1.1rem",
          "brand-outline": "0.125rem",
        },
      })
  - label: "Marca táctil vs. marca plana"
    lang: "ts"
    code: |
      // táctil
      luz({
        primary: "#f28c20",
        stateHoverDelta: 0.14,
        statePressedDelta: 0.12,
        statePressedShift: "0.25ch",
      })

      // plana
      luz({
        primary: "#f28c20",
        stateHoverDelta: 0.03,
        statePressedDelta: 0.02,
        statePressedShift: "0",
      })
---

`vars` se mergea al final del pipeline: pisa cualquier token generado
por nombre (como `space-4` arriba) o agrega uno nuevo si el nombre no
existe todavía. `properties` solo agrega las declaraciones `@property`
por token — no cambia ningún valor, habilita animación/transición de
custom properties donde el navegador lo soporte.

Sin `@property` un custom property es opaco para el navegador — un
`transition` sobre un ángulo o un stop de gradiente salta en vez de
animar, porque no hay `syntax` declarado para interpolar. Con
`@property --angle { syntax: "<angle>"; }` (o `<percentage>`, etc.)
el navegador sabe interpolar y el `transition` anima de verdad — así
es como funcionan los tres gradientes animados de
[Animated gradients (`@property`)](/components/gradient-property),
mezclando `--primary`/`--secondary`/`--neutral` en hover.

`stateHoverDelta`/`statePressedDelta` son la fracción de `--foreground`
que los componentes mezclan sobre `--current-bg` en `:hover` y `:active`
(el `:active` suma las dos): oscurece en modo claro, aclara en oscuro, y
sobre un fondo transparente (`ghost`, `outline`) da un tinte sutil;
`statePressedShift` es el `translateY` del estado presionado. Salen como
`--state-hover-delta`/`--state-pressed-delta`/`--state-pressed-shift`,
vivos y con el default como fallback en el CSS de los componentes, así
que un subárbol los redeclara sin regenerar el tema. Subirlos da una
marca táctil, donde el control se hunde y cambia de tono de forma
evidente; bajarlos con `statePressedShift: "0"` da una marca plana, en la
que el estado se nota apenas.

Todo el CSS que entrega luz (reset, componentes, tema, bridge y
utilities) vive en la capa `@layer luz`. Cualquier regla del proyecto que
no esté en una capa le gana, sin importar el orden de los `@import` ni la
especificidad: un `.mi-handle { position: absolute }` pisa a
`.pane-handle` aunque tengan el mismo peso. Importarlo con `layer(app)`
lo anida como `app.luz`. Como en cualquier capa, los `!important` de luz
(`prefers-reduced-motion`, impresión) le ganan a los `!important` sin
capa.
