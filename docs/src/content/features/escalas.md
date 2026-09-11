---
title: "Escalas"
fields:
  - "base"
  - "power"
  - "sizeFluidRange"
  - "preset"
  - "sizeRelativeToBase"
  - "spaceSteps"
  - "density"
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
  - label: "Densidad por subárbol"
    lang: "html"
    code: |
      <table style="--density: 0.75">…</table>
---

`power` define el ratio entre pasos de la escala `text-xs`..`text-3xl` y
de los landmarks `h1`-`h6` — ambas son exponenciales, `space-N` (la
escala de `p-`/`m-`/`gap-`) es lineal y fija, controlada por
`spaceSteps` aparte. `sizeFluidRange` controla cuánto crece cada paso
entre viewport mínimo y máximo (`clamp()`); `preset` es un atajo que lo
fija (`"app"` → sin reflow, `"landing"` → reflow grande) — un
`sizeFluidRange` explícito lo pisa.

Hacia arriba de `base` (`lg`, `xl`, `2xl`, `3xl`) cada paso multiplica
por el ratio completo; hacia abajo (`sm`, `xs`) por su raíz cuadrada,
para que el texto chico siga siendo legible con ratios grandes. Con
`perfect-fourth` (1.333): `sm` ≈ 0.866rem y `xs` = 0.75rem, en vez de
0.75rem y 0.563rem. Los landmarks `small`..`h1` no tienen pasos
negativos, así que no cambian.

`density` multiplica el padding (`--element-vertical`/
`--element-horizontal`/`--element-gap`), el gutter `--spacing` y el
chrome de los controles (track y thumb del `range`, radios de `.card`),
no la tipografía: los `font-size-*` no dependen de `--density`. Se emite
como custom property viva, así que una tabla densa o un panel más
holgado la redeclaran localmente sin tocar el resto de la página.
