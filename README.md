# luz

> ⚠️ **Under active development.** APIs may change before `1.0.0`. Published as `@d00m-gui/luz`.

**luz** is a lightweight CSS-in-TypeScript theming library. Give it a single primary color and it generates a full set of CSS custom properties — an [oklch](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) color palette, a rotated hue wheel, semantic tokens, and two numbered scales — from one JavaScript configuration object.

luz doesn't try to be a full Tailwind replacement, and it doesn't try to be a component library either. It's four things you can use independently:

1. **Classless** — plain semantic HTML, styled by luz's own reset. No classes needed.
2. **Utility classes** — a small, closed set of Tailwind-shaped classes (`p-4`, `bg-primary-600`, `rounded`), generated at build time from your project's actual source, with zero arbitrary values and zero runtime JS.
3. **A small curated set of visual patterns** — badge, alert, card, avatar, tabs, accordion, modal, breadcrumbs, skeleton. Pure CSS classes generated from your tokens; they style states but never implement behavior. The HTML-only interactions in this repository's demos are not a requirement for consumers.
4. **La interacción y la accesibilidad son responsabilidad de tu app** — luz no implementa teclado, foco, selección ni apertura de menús o diálogos. Recomendamos primitivas accesibles sin estilos como [Base UI](https://base-ui.com); no es obligatorio y podés usar [Radix](https://radix-ui.com), HTML nativo u otra solución. Las clases de luz solo aportan apariencia a los elementos y estados que renderiza tu app.

## Features

- **One color in, a full theme out** — optionally pass a `primary` color (default `#007dea`) and get shades `50`–`950`, a derived `secondary`, neutral ramp, and a 12-hue color wheel.
- **oklch throughout** — perceptually uniform palettes with automatic light/dark inversion.
- **Named type scale, numbered spacing scale** — `text-xs`…`text-3xl` (exponential, for font-size) and `space-N` (linear, for padding/margin/gap/width/height) are kept separate rather than one scale awkwardly serving both.
- **A closed-vocabulary utility engine** — Tailwind-nomenclature-compatible classes (`p-4`, `bg-primary-600`, `open:bg-primary-600`), scanned from your source and emitted as static CSS at build time. No arbitrary values, no bracket syntax, nothing shipped that isn't used. Variant selectors also parse Tailwind's arbitrary `data-[attr=value]:`/`aria-[attr=value]:` syntax generically, so component source copied from Radix- or Base UI-based kits (shadcn, animate-ui, ...) matches without luz needing to know which library it came from.
- **A shadcn/ui token bridge** — real, unmodified shadcn component source (Base UI variant) can consume luz's tokens directly, via a small `:root` alias block generated automatically.
- **One `@import`, any Vite framework** — add `luzVite(config)` (or `luzAstro(config)` in Astro) and write `@import "@d00m-gui/luz/luz.css";` in your CSS; the plugin expands the theme, bridge and scanned utilities right there, Tailwind v4 style — nothing written to disk. Compose your own bundle from `reset.css`, `components/<name>.css`, `theme.css`, `bridge.css` and `utilities.css` instead (see `fixtures/tanstack-dashboard`).
- **Tiny & typed** — ships ESM with full TypeScript types, no runtime CSS framework required.

## Installation

```bash
bun add @d00m-gui/luz
# or: npm install @d00m-gui/luz / pnpm add @d00m-gui/luz
```

### Skill opcional para agentes

El paquete incluye [llms.txt](llms.txt), la referencia de API de esa versión, y `skills/luz/SKILL.md`. Para registrar la skill en un proyecto consumidor, después de instalar luz, ejecutá desde la raíz de ese proyecto:

```sh
node node_modules/@d00m-gui/luz/scripts/install-skill.mjs
```

También está disponible como bin `luz-install-skill` para scripts del proyecto. Crea `.agents/skills/luz` como enlace al directorio del paquete instalado (junction en Windows); rechaza cualquier destino existente, incluso enlaces rotos. No copia la API, no sobrescribe archivos, no modifica `AGENTS.md` y no corre durante la instalación. Al actualizar el paquete, la skill lee su `llms.txt` instalado. La referencia del sitio se copia desde el `llms.txt` raíz al iniciar Astro (`dev` o `build`); no editar `docs/public/llms.txt` a mano.

## Usage

Register the plugin (any Vite-based framework) or the Astro integration:

```ts
// vite.config.ts
import { luzVite } from "@d00m-gui/luz/vite";
export default defineConfig({ plugins: [luzVite({ primary: "#f28c20" })] });

// astro.config.mjs
import { luzAstro } from "@d00m-gui/luz/astro";
export default defineConfig({ integrations: [luzAstro({ primary: "#f28c20" })] });
```

Then import luz from your own stylesheet — the plugin expands the theme, the shadcn bridge and the utilities scanned from your source right where the import sits:

```css
/* app.css */
@import "@d00m-gui/luz/luz.css";
```

`luz.css` incluye por defecto reset, todos los componentes (también controls y print), tema, bridge y utilities. Para omitir partes, configurá `exclude` en `luzVite`/`luzAstro`:

```ts
luzVite({ primary: "#f28c20", exclude: ["controls", "_print", "bridge", "utilities"] });
```

`exclude?: readonly (ComponentName | "_print" | "bridge" | "utilities")[]`, donde `ComponentName` es el nombre de un archivo de componente sin `.css`, excepto los compartidos que empiezan con `_`. Por defecto no se excluye nada. Filtra los imports agregados por `luz.css` y `components.css`; reset, tema y estilos compartidos siguen presentes. Los imports directos de `components/<name>.css`, `bridge.css` o `utilities.css` son elecciones explícitas y no se filtran. Para componer desde cero, importá las piezas:

```css
@import "@d00m-gui/luz/reset.css";
@import "@d00m-gui/luz/theme.css";
@import "@d00m-gui/luz/components/button.css";
@import "@d00m-gui/luz/components/card.css";
@import "@d00m-gui/luz/utilities.css";
```

Los componentes y el reset son archivos CSS reales con scope estático incorporado. El plugin filtra los imports de los manifests según `exclude`; `theme.css`, `bridge.css` y `utilities.css` se generan desde tu configuración y código. La forma de bajo nivel es `@luz theme;` / `@luz bridge;` / `@luz utilities;`, que podés colocar en tu CSS.

`components/controls.css` está incluido por defecto en `luz.css` y `components.css`: controles de panel (`.led`, `.readout`, `.knob`, `.fader`, `.toggle-switch`, `.selector`, `.led-button`, `.control-label`) y un bisel `.mfd`. `exclude: ["controls"]` lo omite del bundle; un import directo siempre lo incluye. Son solo visuales: la app maneja interacción, teclado y accesibilidad; el estado se refleja en `aria-pressed`/`aria-checked`/`data-state`/`data-disabled`, la posición en `--knob-angle` (`-135deg`…`135deg`) y `--fader-value` (0–1). Las skins usan `vars` o custom properties en un contenedor (`--control-face`, `--control-ink`, `--control-led-on`, `--mfd-key-size`, etc.).

The CSS entries put everything in the `luz` cascade layer, so any unlayered CSS of yours wins over it without import-order or specificity tricks. `@import … layer(name)` nests it as `name.luz`. Inside a layer, luz's few `!important` rules (`prefers-reduced-motion`, print) beat unlayered `!important` ones.

### Scope y subárboles sin luz

Los estilos estáticos usan siempre `:root:not([data-luz-off])` como raíz de scope, incluso al importar componentes directamente o sin plugin. `selector` solo define dónde se emiten los tokens del tema y del bridge; no cambia ese scope. Marcá un wrapper con `data-luz-off` para excluirlo, junto con su subárbol, de las reglas estáticas y las utilities emitidas por la integración:

```html
<section>
  <button>Con luz</button>
  <div data-luz-off><button>Sin reglas de luz</button></div>
</section>
```

Es un scope con agujeros (donut scope), no un reset de la herencia: fuentes, colores y custom properties ya heredados pueden seguir presentes dentro de `data-luz-off`. El tema y el bridge emiten tokens, no se desactivan con ese atributo. Usá CSS propio si también necesitás cambiar esos valores heredados.

`luz(config)` itself is pure and runs anywhere (browser, edge) if you need the tokens or the theme CSS without a bundler.

`@d00m-gui/luz/color` exposes the OKLCH engine on its own — `srgbToOklch`, `oklchToSrgb`, `contrastRatio`, `parseColorToOklch`, `clampToSrgb`, `maxSrgbChroma`, `formatOklch` — for tooling that needs the same math luz uses to derive palettes.

## Examples

`fixtures/` holds standalone apps that install `@d00m-gui/luz` as a real package (via `bun pm pack`, not the source tree) — e.g. a TanStack Start dashboard (`bun run fixture:tanstack`). See each fixture's own `README.md`.

## License

[MIT](LICENSE)
