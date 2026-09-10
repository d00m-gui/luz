---
title: "Color"
fields:
  - "primary"
  - "secondary"
  - "name"
  - "mode"
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
  - label: "Nombre de custom property propio"
    lang: "ts"
    code: |
      luz({
        primary: "#f28c20",
        name: "brand",
      })
---

Sin `secondary`, se deriva rotando el hue de `primary` 180° — no hace
falta definirlo si alcanza con un complementario automático. `name` solo
renombra las custom properties de la paleta primaria (`--{name}-500`);
la de grises es siempre `--neutral-*`. `mode: "auto"` emite paleta clara
en `:root` y oscura bajo `prefers-color-scheme: dark`, a diferencia de
`"light"`/`"dark"` que fijan una sola.
