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
        stateHoverDelta: 0.06,
        statePressedDelta: 0.08,
        statePressedShift: "0.25ch",
      })

      // plana
      luz({
        primary: "#f28c20",
        stateHoverDelta: 0.01,
        statePressedDelta: 0.01,
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

`stateHoverDelta`/`statePressedDelta` son los saltos de `l` (OKLCH) que
los componentes aplican sobre `--current-bg` en `:hover` y `:active`;
`statePressedShift` es el `translateY` del estado presionado. Salen como
`--state-hover-delta`/`--state-pressed-delta`/`--state-pressed-shift`,
vivos y con el default como fallback en el CSS de los componentes, así
que un subárbol los redeclara sin regenerar el tema. Subirlos da una
marca táctil, donde el control se hunde y cambia de tono de forma
evidente; bajarlos con `statePressedShift: "0"` da una marca plana, en la
que el estado se nota apenas.
