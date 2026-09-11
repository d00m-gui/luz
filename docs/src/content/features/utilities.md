---
title: "Utilities"
fields: []
order: 6
examples:
  - label: "Variantes de estado y de breakpoint"
    lang: "html"
    code: |
      <aside class="hidden lg:flex flex-col gap-4">…</aside>
      <button class="max-md:hidden md:hover:bg-primary-600">Menú</button>
      <div class="size-8 rounded-full bg-primary-500"></div>
---

Las utilities son un vocabulario cerrado con nomenclatura Tailwind —
`{propiedad}-{valor}`, sin valores arbitrarios ni corchetes — escaneado
de tu código (`.astro`, `.html`, `.tsx`, `.jsx`, `.ts`) y emitido como
CSS estático solo para las clases que aparecen. `p-`/`m-`/`gap-`/`w-`/
`h-`/`size-`/`min-w-`/`max-w-`/`min-h-`/`max-h-`/`top-`/`right-`/
`bottom-`/`left-`/`inset-` resuelven contra `space-N` (`N` es cualquier
entero positivo: más allá de `spaceSteps` sale como
`calc(N * var(--space-1))`, la escala es lineal); `text-xs`..`text-3xl`
contra la escala tipográfica; `bg-`/`text-`/`border-` contra
`{paleta}-{paso}` y los
tokens semánticos (`bg-primary-600`, `text-foreground`), con opacidad
opcional (`bg-primary/20`). Literales de layout: `flex`, `grid`,
`hidden`, `sticky`, `flex-col`, `items-center`, `justify-between`,
`w-full`, `w-screen`, `h-screen`, `min-h-screen`, `max-h-full`,
`inset-0`, `p-0`, `m-0`, `gap-0`, `col-span-full`, `aspect-square`,
`aspect-video`, `rounded-full`, `truncate`, `z-10`, entre otros.

**Variantes de estado** — un prefijo antes de la utility: `hover:` y
`focus:` (pseudo-clases), `open:`/`closed:`/`checked:`/`disabled:`/
`expanded:`/`selected:`/… (los `data-*` de Base UI y Radix) y la sintaxis
arbitraria `data-[state=on]:`/`aria-[expanded=true]:`, que se parsea de
forma genérica — el código copiado de un kit basado en esas librerías
matchea sin que `luz` conozca la librería.

**Variantes de breakpoint** — `sm:`/`md:`/`lg:`/`xl:`/`2xl:` envuelven la
regla en `@media (min-width: 40|48|64|80|96rem)`; `max-sm:`…`max-2xl:` en
`@media (max-width: calc(Nrem - 0.02rem))`. Las reglas con media se
emiten después de las que no lo tienen, ordenadas por breakpoint
ascendente, `min-*` antes que `max-*`, así `hidden md:flex` y
`flex max-md:hidden` funcionan sin pelear especificidad. Se puede
combinar con una única variante de estado, siempre en el orden
`breakpoint:estado:util` (`md:hover:flex`, `max-lg:open:hidden`);
`hover:md:flex` no emite nada. Los breakpoints son fijos, no se
configuran.
