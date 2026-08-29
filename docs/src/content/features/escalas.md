---
title: "Escalas"
fields:
  - "base"
  - "power"
  - "colorSteps"
  - "sizeFluidRange"
  - "preset"
  - "sizeRelativeToBase"
  - "spaceSteps"
order: 3
examples:
  - label: "Escala tipográfica custom"
    lang: "ts"
    code: |
      luz({
        primary: "#f28c20",
        base: 18,
        power: "major-third",
        sizeRelativeToBase: true,
      })
  - label: "Preset para landing"
    lang: "ts"
    code: |
      luz({
        primary: "#f28c20",
        preset: "landing",
      })
---

`power` define el ratio entre pasos de la escala `text-xs`..`text-3xl` y
de los landmarks `h1`-`h6` — ambas son exponenciales, `space-N` (la
escala de `p-`/`m-`/`gap-`) es lineal y fija, controlada por
`spaceSteps` aparte. `sizeFluidRange` controla cuánto crece cada paso
entre viewport mínimo y máximo (`clamp()`); `preset` es un atajo que lo
fija (`"app"` → sin reflow, `"landing"` → reflow grande) — un
`sizeFluidRange` explícito lo pisa.
