---
title: "Avanzado"
fields:
  - "properties"
  - "vars"
order: 5
examples:
  - label: "@property y overrides crudos"
    lang: "ts"
    code: |
      luz({
        primary: "#f28c20",
        properties: true,
        vars: {
          "radius": "0.5rem",
          "size-4": "1.1rem",
        },
      })
---

`vars` se mergea al final del pipeline: pisa cualquier token generado
por nombre (como `size-4` arriba) o agrega uno nuevo si el nombre no
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
