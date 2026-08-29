---
title: "Layout"
fields:
  - "transition"
  - "box-shadow"
  - "spacing"
  - "background"
  - "foreground"
order: 4
examples:
  - label: "Overrides de layout base"
    lang: "ts"
    code: |
      luz({
        primary: "#f28c20",
        transition: "all ease 150ms",
        "box-shadow": "0 2px 8px rgb(0 0 0 / 20%)",
        spacing: "1.5rem",
      })
---

`background`/`foreground` sobreescriben los shades de `neutrals` que
`luz` usa por defecto (900/100 o 100/900 según `mode`) — útil para fijar
un fondo que no siga la escala de grises generada. `spacing` reemplaza
el gutter derivado de `base` sin afectar el resto de la escala de
tamaños.
