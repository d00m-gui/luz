---
title: "Color"
fields:
  - "primary"
  - "secondary"
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
---

Sin `secondary`, se deriva rotando el hue de `primary` 180° — no hace
falta definirlo si alcanza con un complementario automático. La paleta
primaria es siempre `--primary-*` y la de grises `--neutral-*`.
`mode: "auto"` emite paleta clara en `:root` y oscura bajo
`prefers-color-scheme: dark`, a diferencia de `"light"`/`"dark"` que
fijan una sola.
