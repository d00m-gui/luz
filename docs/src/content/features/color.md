---
title: "Color"
fields:
  - "primary"
  - "secondary"
  - "name"
  - "neutrals"
  - "prefix"
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
  - label: "Nombres de custom property propios"
    lang: "ts"
    code: |
      luz({
        primary: "#f28c20",
        name: "brand",
        neutrals: "slate",
        prefix: "acme-",
      })
---

Sin `secondary`, se deriva rotando el hue de `primary` 180° — no hace
falta definirlo si alcanza con un complementario automático. `name` y
`neutrals` solo renombran las custom properties generadas
(`--{name}-500`, `--{neutrals}-500`); `prefix` se antepone a todas por
igual. `mode: "auto"` emite paleta clara en `:root` y oscura bajo
`prefers-color-scheme: dark`, a diferencia de `"light"`/`"dark"` que
fijan una sola.
