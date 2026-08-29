---
title: "Tipografía"
fields:
  - "font"
  - "font-headings"
  - "font-monospace"
  - "font-emphasis"
  - "font-weight"
  - "font-bold-weight"
  - "line-height"
order: 1
examples:
  - label: "Body y headings distintos"
    lang: "ts"
    code: |
      luz({
        primary: "#f28c20",
        font: "Inter, sans-serif",
        "font-headings": "Poppins, sans-serif",
      })
---

`font` controla solo el body — `font-headings`/`font-monospace`/`font-emphasis`
son campos separados para cada rol tipográfico, no hay cascada entre ellos.
