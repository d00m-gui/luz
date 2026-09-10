# luz

> ⚠️ **Under active development.** APIs may change before `1.0.0`. Published as `@d00m-gui/luz`.

**luz** is a lightweight CSS-in-TypeScript theming library. Give it a single primary color and it generates a full set of CSS custom properties — an [oklch](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) color palette, a rotated hue wheel, semantic tokens, and two numbered scales — from one JavaScript configuration object.

luz doesn't try to be a full Tailwind replacement, and it doesn't try to be a component library either. It's four things you can use independently:

1. **Classless** — plain semantic HTML, styled by luz's own reset. No classes needed.
2. **Utility classes** — a small, closed set of Tailwind-shaped classes (`p-4`, `bg-primary-600`, `rounded`), generated at build time from your project's actual source, with zero arbitrary values and zero runtime JS.
3. **A small curated set of common patterns** — badge, alert, card, avatar, tabs, accordion, modal, breadcrumbs, skeleton. Pure CSS classes on plain HTML, zero JS, generated from your tokens instead of shipped as a fixed theme — the interactivity that needs _some_ state (tabs, accordion, modal) leans on native HTML (radio inputs, `<details>`, `<dialog>`) rather than a JS framework.
4. **Unstyled behavior primitives** ([Base UI](https://base-ui.com)/[Radix](https://radix-ui.com), or component kits built on them) for the handful of things CSS genuinely can't do — a combobox with real collision detection, a date picker, complex keyboard navigation. luz's own utility/pattern classes style them; the primitive only supplies behavior, not its own theming.

## Features

- **One color in, a full theme out** — pass a `primary` color and get shades `50`–`950`, a derived `secondary`, `neutral` ramp, and a 10-hue color wheel.
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

`luz.css` is the everything bundle (reset + components + theme + bridge + utilities). Pick pieces instead when you want less:

```css
@import "@d00m-gui/luz/reset.css";
@import "@d00m-gui/luz/theme.css";
@import "@d00m-gui/luz/components/button.css";
@import "@d00m-gui/luz/components/card.css";
@import "@d00m-gui/luz/utilities.css";
```

`reset.css`, `components.css` and `components/<name>.css` are static files; `theme.css`, `bridge.css` and `utilities.css` are generated from your config and code. The lower-level form is the `@luz theme;` / `@luz bridge;` / `@luz utilities;` directive, which you can place anywhere in your CSS. `@import … layer(name)` is honored.

`luz(config)` itself is pure and runs anywhere (browser, edge) if you need the tokens or the theme CSS without a bundler.

## Examples

`fixtures/` holds standalone apps that install `@d00m-gui/luz` as a real package (via `bun pm pack`, not the source tree) — e.g. a TanStack Start dashboard (`bun run fixture:tanstack`). See each fixture's own `README.md`.

## License

[MIT](LICENSE)
