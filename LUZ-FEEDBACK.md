# luz — hallazgos desde concepto

Revisión de `../luz` (v0.2.0, `src/`, `dist/`, `SDD.md`, `TODO.md`, `docs/public/llms.txt`) contra lo que concepto necesita (`TODO.md` 11, 12, 14, 15, 17, 19). Para trabajar con el agente de luz. Las propuestas de API están marcadas **PROPUESTA** (regla de `luz/CLAUDE.md`: no inventar campos de `LuzConfig` sin marcarlos).

## Qué necesita concepto de luz

| Tarea concepto | Uso de luz | Estado hoy |
|---|---|---|
| 12 `configure_luz` → tokens + CSS por marca, server-side (`apps/api`, Bun, sin Astro/Vite) | `luz(config)` puro + reset + componentes + utilities de un set fijo de clases | Parcial: `luz()` es puro, pero reset/componentes/utilities solo salen por los adaptadores o mezclados en `style` |
| 12/14 styleguide y manual renderizados dentro de la app (que ya tiene su propio tema luz) | Tema de marca scopeado a un contenedor | No: `:root` hardcodeado |
| 11 `packages/color` (cuantización, roles, armonía) con preview en cliente igual al CSS final | Conversión sRGB↔OKLCH, gamut, armonías, shade por peso | No exportado; concepto lo reimplementaría |
| 15 export HTML autocontenido con `@media print` | Capa print de componentes | Inexistente |
| 19 diff de tokens entre releases; swatches en nodos del canvas; hex para prompts Ideogram | Valores numéricos por shade y modo | No: `tokens.colors` son strings CSS (`var()`, `calc()`, `light-dark()`) |
| 17 landing consume config luz exportada | `luzAstro(config)` | OK |

## Bugs

1. **`@d00m-gui/luz/design.css` roto en el paquete publicado.** `bunup.config.ts:4-8` copia solo `src/tools/design.css` (el manifest de `@import "./design/*.css"`, ver `dist/design.css`) y no `src/tools/design/`. `dist/` no tiene carpeta `design/`, así que los 54 `@import` no resuelven. `./reset.css` sí funciona pero es solo la capa genérica (70 líneas). Consecuencia: no hay forma pública de obtener reset+componentes sin pasar por `luz().style`.
2. **`peerDependencies` no opcionales heredadas del showcase shadcn retirado**: `@base-ui/react`, `class-variance-authority`, `@astrojs/react` (`package.json:89-98`; solo `react`/`react-dom`/`astro`/`typescript`/`vite` están en `peerDependenciesMeta` como opcionales). Bun auto-instala peers no opcionales → un consumidor recibe 3 dependencias que no pidió. En concepto ninguna dependencia entra sin aprobación, así que esto bloquea un `bun add` limpio. `luz/CLAUDE.md` confirma que shadcn se retiró de `docs/`; el bridge (`shadcn-bridge.ts`) no necesita esos paquetes en runtime.
3. **TSDoc stale / inconsistente con `LUZ_DEFAULT_CONFIG`** (`src/luz.ts`):
   - `neutralTint` dice default `0.2` (l.97); el default real es `0` (l.249) y `llms.txt` dice `0`.
   - `sizeFluidRange` dice `@default "balanced"` (l.157); el default real es `"fixed"` (l.257).
   - `LuzTokens.sizes` dice `--size-1 → 0.1rem` (l.204); `size-N` fue retirado (SDD "Escala de texto con nombre").

4. **`README.md`/`llms.txt` documentan un default export que no existe.** Ambos muestran `import luz from "@d00m-gui/luz/astro"` / `"@d00m-gui/luz/vite"`; `src/astro/index.ts` y `src/vite/index.ts` solo exportan `luzAstro`/`luzVite` nombrados (`grep "export default"` → 0). Un consumidor nuevo que copie el snippet falla en build.
5. **`@custom-media` se emite por default y lightningcss lo rechaza.** `breakpoints` default `{ sm, md, lg, xl, 2xl }` → cinco `@custom-media --breakpoint-*` al inicio de `style`; `astro build` (Vite + lightningcss minify) imprime `[WARN] Unknown at rule: @custom-media` por cada uno, en todo proyecto Astro sin configurar nada. Confirmado en el scaffold de concepto (Astro 7.3.2). Ya está en el `TODO.md` de luz como "wip, sin decisión de uso" y sin consumidor real; mientras no se decida, el default debería ser `false`.
## Gaps de API pública

6. **Composición programática sin adaptador.** `src/index.ts` exporta solo `luz`, tipos, `TYPE_SCALES`, `FLUID_RANGES`. `emitUtilitiesCSS(candidates, tokens)` (`utilities.ts:481`, pura, sin I/O), `shadcnBridgeCSS`, `composeCss`, `buildReset` son internos. La CLI `bin/luz.ts` del `TODO.md` de luz cubre "bundler sin plugin", pero concepto necesita la **función**: genera CSS por tenant en un servidor Bun, en caliente, N veces, y cachea. **PROPUESTA**: exportar `emitUtilitiesCSS` desde `.` y devolver las capas estáticas separadas del tema, p. ej. `LuzResult.reset: string` (RESET+COMPONENTS) y que `style` siga siendo la concatenación de siempre. Sin esto, para N temas en una página se repiten ~60 KB de reset por tema.
7. **`:root` hardcodeado** (`src/luz.ts:842`). Concepto necesita el tema de una marca dentro de la app (que corre su propio tema luz), y dos versiones lado a lado (diff `v1`/`v2`). Workaround hoy: tomar `variables` y envolverlo en un selector propio. Le faltan dos cosas: `color-scheme: light dark` solo se emite en `style` (l.836), y `body { background: var(--background); color: var(--foreground); font-family: var(--font); font-size }` (`reset.css:21-27`) no se re-aplica al contenedor scopeado. **PROPUESTA**: `LuzConfig.selector?: string` (default `":root"`) más una clase en design (`.theme` o similar) que aplique al contenedor lo que `body` recibe del reset. Nota a verificar: `light-dark()` resuelve contra el `color-scheme` del elemento, así que forzar claro/oscuro por sección (`.manual[data-scheme=light] { color-scheme: light }`) debería funcionar sin campo nuevo.
8. **Motor de color no reutilizable.** `gamut.ts` (`parseColorToOklch`, `formatOklch`, `clampToSrgb`, `maxSrgbChroma`, `isInSrgbGamut`) y `hue.ts` (`resolveBakedShade`, `nearestSchemeWeight`, `luzHarmonyColorSeeds`) son TS puro sin dependencias — exactamente lo que `packages/color` de concepto necesita para que el preview en cliente coincida con el CSS que luz emite. Sin exportarlos, habrá dos implementaciones de OKLCH que pueden divergir. **PROPUESTA**: subpath `@d00m-gui/luz/color` con esos helpers y `OklchSeed`. (El parser sin `lab()`/`lch()`/`color()`/nombres ya está en el `TODO.md` de luz; concepto siempre entrega hex u `oklch()`, no bloquea.)
9. **Tokens sin valores resueltos.** `tokens.colors` mezcla literales bakeados con `var()`/`calc()`/`light-dark(a, b)`. Para swatches en nodos del canvas, `DESIGN.md`, diff entre releases y hex para prompts de Ideogram, concepto necesita `{l,c,h}` por paleta, peso y modo. Parsear `light-dark(...)` de vuelta es frágil. **PROPUESTA**: `LuzResult.tokens.palettes?: Record<string, Record<number, OklchSeed>>` (o `{ light, dark }` en `mode: "auto"`), presente solo cuando el seed parsea. Si sale el punto 8, concepto puede calcularlo con `resolveBakedShade`, pero es duplicar la lógica de `buildColors`.
10. **Sin capa print.** `grep "@media print|print-color-adjust"` en `src/tools` → 0 resultados. Overlays con anchor positioning/`@starting-style`, `.glass` con `backdrop-filter`, `--depth` sobre `--background`: nada de eso tiene regla para impresión. Concepto exporta el manual con `@media print` (TODO 15) y puede llevar su propio CSS, pero es genérico: ocultar `.drawer`/`.menu`/`.tooltip`/`.popover`, `print-color-adjust: exact` en `.badge`/`.card`/swatches, abrir `<details>`, quitar blur. **PROPUESTA**: `design/print.css`.

## Lo que ya sirve tal cual

- `luz()` es puro (sin `node:fs`; `write-css.ts`/`scan.ts` solo los usan los adaptadores). Puede correr en el browser para preview instantáneo (TODO 11).
- `vars: Record<string, string | number>` mergeado al final: encaja con la salida de `configure_luz`.
- `preset` (`app`/`content`/`landing`) mapea a `kind` de concepto: `corporate`/`app`/`pwa` → `app`, `landing` → `landing`, `editorial`/`ecommerce` → `content`. Es solo `sizeFluidRange`; el set de componentes por `kind` lo elige concepto.
- `mode: "auto"` con `light-dark()` para variantes claro/oscuro del manual.
- Scan de `.tsx` por default (`scan.ts:4`): las islas React del canvas quedan cubiertas.

## Decisiones del lado de concepto (no son de luz)

- Colores data-driven en el canvas (paleta generada por nodo) vs regla "sin `style=` inline": el motor de utilities es vocabulario cerrado en build, no cubre valores por dato. Opciones: `<style href precedence>` por canvas con `[data-node="id"] { --swatch-N: … }` (hoisting React 19), o relajar la regla solo para custom properties. Va a `TODO.md`.
- Clases utility siempre literales completas en TSX (`bg-red-400`, no `bg-${hue}-400`); mapa de lookup cuando el hue es variable.
- Bug conocido `name`+`prefix` simultáneos (`luz/TODO.md`): concepto no usa `prefix`; el scoping por tenant será por selector.
