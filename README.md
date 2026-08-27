# luz

[![CI](https://github.com/d00m-gui/luz/actions/workflows/ci.yml/badge.svg)](https://github.com/d00m-gui/luz/actions/workflows/ci.yml)

> ⚠️ **Under active development.** APIs may change before `1.0.0`. Published as `@d00m-gui/luz`.

**luz** is a lightweight CSS-in-TypeScript theming library. Give it a single primary color and it generates a full set of CSS custom properties — an [oklch](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) color palette, a rotated hue wheel, semantic tokens, and two numbered scales — from one JavaScript configuration object.

luz doesn't try to be a full Tailwind replacement. It's three things you can use independently:

1. **Classless** — plain semantic HTML, styled by luz's own reset. No classes needed.
2. **Utility classes** — a small, closed set of Tailwind-shaped classes (`p-4`, `bg-primary-600`, `rounded`), generated at build time from your project's actual source, with zero arbitrary values and zero runtime JS.
3. **Real [shadcn/ui](https://ui.shadcn.com) components** for anything genuinely complex (dialogs, menus, toasts) — luz doesn't maintain a component library of its own. A small token bridge lets shadcn's own component source consume luz's tokens directly.

## Features

- **One color in, a full theme out** — pass a `primary` color and get shades `50`–`950`, a derived `secondary`, `neutral` ramp, and a 10-hue color wheel.
- **oklch throughout** — perceptually uniform palettes with automatic light/dark inversion.
- **Two numbered scales, on purpose** — `size-N` (an exponential typographic scale, for font-size) and `space-N` (linear, for padding/margin/gap/width/height) are kept separate rather than one scale awkwardly serving both.
- **A closed-vocabulary utility engine** — Tailwind-nomenclature-compatible classes (`p-4`, `bg-primary-600`, `open:bg-primary-600`), scanned from your source and emitted as static CSS at build time. No arbitrary values, no bracket syntax, nothing shipped that isn't used.
- **A shadcn/ui token bridge** — real, unmodified shadcn component source (Base UI variant) can consume luz's tokens directly, via a small `:root` alias block generated automatically.
- **Framework adapters** — a React provider (`luz/react`), and static CSS generation for Astro (`luz/astro`) and Vite (`luz/vite`).
- **Tiny & typed** — ships ESM with full TypeScript types, no runtime CSS framework required.

## Installation

```bash
bun add @d00m-gui/luz
# or: npm install @d00m-gui/luz / pnpm add @d00m-gui/luz
```

React, `@base-ui/react`, Astro, and Vite are optional [peer dependencies](package.json) — install them only if you use the corresponding adapter. `@base-ui/react` in particular is worth installing even without the React adapter if you plan to bring in shadcn components (see [Using shadcn components](#using-shadcn-components)) — it's the primitive library their source imports.

## Core usage

The `luz()` function is the heart of the library. It takes a config object and returns generated tokens and CSS.

```ts
import { luz } from "@d00m-gui/luz";

const { tokens, variables, style } = luz({
  primary: "#D44541",
  secondary: "#94F6D8",
  font: '"DM Sans", sans-serif',
  "font-monospace": '"Datatype", monospace',
});
```

### What you get back

| Field         | Type     | Description                                                                                                          |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `tokens`      | `object` | Structured source of truth: `{ settings, colors, sizes, typography }`.                                               |
| `variables`   | `string` | The custom-property declarations (`--primary: …;`), ready for a `:root` block.                                       |
| `properties` | `string` | Generated CSS [`@property`](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) rules for animatable tokens. |
| `style`       | `string` | Complete stylesheet: reset + element setup + `@property` rules + `:root { … }`.                                      |


Inject `style` however you like (a `<style>` tag, a `.css` file, your bundler), then reference the tokens in your CSS:

```css
.cta {
  background: var(--primary-500);
  color: var(--on-primary);
  padding: var(--element-vertical) var(--element-horizontal);
  border-radius: var(--border-radius);
}
```

### Configuration

Only `primary` is required — everything else falls back to sensible defaults.

```ts
luz({
  // Colors
  primary: "#007dea", // required — base of the whole palette
  secondary: "#94F6D8", // optional — defaults to primary hue + 180°
  neutrals: "neutral", // name used for the neutral ramp
  mode: "dark", // "light" | "dark" | "auto" — "auto" ships both under prefers-color-scheme
  colorSteps: 11, // shade steps per palette (50–950 by default)

  // Typography
  font: "sans-serif",
  "font-headings": "sans-serif",
  "font-emphasis": "serif",
  "font-monospace": "monospace",
  "font-weight": 400,
  "font-bold-weight": 800,
  "line-height": "130%",

  // Sizing — two independent scales, see "Two scales" below
  base: 16, // base font size in px, drives both scales
  power: "perfect-fourth", // growth ratio for size-N's fluid zone (or a raw number)
  sizeSteps: 22, // total size-N tokens (typographic scale)
  sizeDynamicFrom: 13, // first size-N step that becomes a fluid cqi clamp()
  sizeRelativeToBase: false, // true: scale the whole size-N ramp by base / 16
  spaceSteps: 24, // total space-N tokens (linear scale, p-/m-/gap-/w-/h-)
  spacing: undefined, // optional override for the single --spacing scalar — defaults to a base-derived value, not a fixed string

  // Misc
  prefix: "", // prefix every generated custom-property name
  transition: "all ease 200ms",
  "box-shadow": "none",
  minify: false, // collapse whitespace in `style`
});
```

### Two scales: `size-N` vs `space-N`

`size-N` is deliberately an exponential type scale (fixed micro-steps below `sizeDynamicFrom`, then a real `power`-ratio ramp) — correct for font-size, where non-linear jumps read as typographic hierarchy. `space-N` is deliberately linear (`N × base/64`, so `space-4` = `1rem` at the default `base` — the same ratio Tailwind's own spacing scale uses) — correct for padding/margin/gap/width/height, where predictable, evenly-spaced steps matter more than proportion. Reusing one scale for both was tried and abandoned; see the two functions in [`src/tools/sizes.ts`](src/tools/sizes.ts) (`luzSizes`/`luzSpace`) if you're curious about the exact formulas.

### Generated tokens

From a single primary color luz derives:

- **Primary / secondary / neutral shades** — `--primary-50` through `--primary-950` (and the same for `secondary` and your neutral name).
- **A hue wheel** — `--red`, `--copper`, `--orange`, `--yellow`, `--green`, `--emerald`, `--teal`, `--cyan`, `--blue`, `--sky`, all rotated in oklch from your primary.
- **Semantic tokens** — `--background`, `--foreground`, `--on-primary`, `--border`, `--element-background`, `--element-border-color`, and more.
- **Sizes** — `--size-1`…`--size-22` (typographic scale) and `--space-1`…`--space-24` (linear scale), plus `--spacing`, `--border-radius`, `--border-width`, `--element-vertical`, `--element-horizontal`.

Set `prefix` to namespace everything (e.g. `prefix: "lz-"` → `--lz-primary-500`).

## Utility classes

`luzAstro` and `luzVite` (see below) scan your project's actual source files and generate a small, closed set of Tailwind-shaped utility classes as static CSS — nothing runs in the browser, nothing ships that your source doesn't actually use.

| Prefix                                                                  | Resolves against                          | Example                                                     |
| ------------------------------------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------ |
| `p-`/`px-`/`py-`/`pt-`/`pr-`/`pb-`/`pl-`, `m-`+dirs, `gap-`/`gap-x-`/`gap-y-`, `w-`, `h-` | `space-N` (linear scale)                  | `p-4` → `padding: var(--space-4)`                            |
| `text-{N}`                                                              | `size-N` (typographic scale)               | `text-16` → `font-size: var(--size-16)`                      |
| `bg-`/`text-`/`border-{name}`                                           | any real palette family/shade              | `bg-primary-600`                                              |
| `bg-`/`text-`/`border-{name}`                                           | shadcn bridge alias (see below)            | `bg-card`, `text-muted-foreground`                            |
| `rounded`, `rounded-none`                                               | `--border-radius`                          |                                                                 |
| `border`                                                                | `--border-width` + solid style             | composes with `border-{color}` — different longhands, never the shorthand |
| `font-normal`/`font-bold`                                               | `--font-weight`/`--font-bold-weight`       | `font-medium`/`font-semibold` are plain numbers — no matching token |
| `underline`/`no-underline`, `sr-only`/`not-sr-only`                     | fixed, no token                            | `sr-only` is the real visually-hidden-but-accessible pattern, not `display:none` |
| Layout literals                                                        | fixed, no token                            | `flex`, `items-center`, `justify-between`, `w-full`, `overflow-hidden`, `z-50`, … |
| `{utility}/{N}`                                                        | opacity modifier on any color utility      | `bg-destructive/10` → `oklch(from var(--destructive) l c h / 10%)` |

**Variants** prefix the base utility with `name:` (a single level — no `dark:hover:x` stacking): `open:`, `closed:`, `disabled:`, `checked:`, `unchecked:`, `indeterminate:`, `highlighted:`, `pressed:`, `active:`, `selected:`, `expanded:`, `invalid:`, `valid:`, `required:`, `readonly:`, `starting:`, `ending:` — all map to real `data-*` attributes [`@base-ui/react`](https://base-ui.com) emits — plus `hover:` and `focus:`.

Anything that doesn't resolve — an unknown prefix, an out-of-range step, `w-[137px]` bracket syntax — is dropped silently. That's deliberate, not a gap to be filled: the moment this engine grows arbitrary values or arbitrary selector variants, there's no real reason to have it instead of Tailwind itself. See the next section for where that line actually shows up in practice.

## Using shadcn components

luz doesn't ship or maintain a component library. For anything genuinely complex — dialogs, menus, toasts, comboboxes — bring in real [shadcn/ui](https://ui.shadcn.com) components instead. A small bridge makes their source consume luz's tokens with no fork.

### 1. The token bridge (automatic)

Both `luzAstro` and `luzVite` emit a `:root` block aliasing luz's tokens to the exact CSS variable names shadcn's component source expects — `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary-foreground`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--input`, `--ring`, `--radius`. (`--background`, `--foreground`, `--border`, and `--primary-*`/`--secondary-*` are already named exactly what shadcn expects — no alias needed.) Nothing to configure; it's baked into the generated CSS.

### 2. Bring in a component

```bash
bunx shadcn@latest add dialog
```

Base UI has been shadcn's default primitive library since July 2026 (Radix is still supported) — and `@base-ui/react` is already a luz peer dependency, so the component's own imports need nothing extra. This drops real, unmodified component source into your project (`src/components/ui/dialog.tsx` by default).

The shadcn CLI's `components.json` requires a `tailwind` block even in a project with no Tailwind at all — its schema won't validate without one — but `tailwind.css` doesn't need to point at a real file; an empty string (`"css": ""`) resolves fine for both `shadcn add` and `shadcn info`, so there's no placeholder stylesheet to maintain. The CLI also defaults `iconLibrary` to `lucide` regardless of this repo's actual dependencies — every component you pull in will import from `lucide-react`, which isn't installed. Step 3 below covers swapping those out too.

### 3. Adapt the className strings

Real shadcn source leans on Tailwind's full feature set — arbitrary values (`w-[137px]`), `has-*`/`in-*`/`aria-*` variants, `animate-in`/`fade-in-*` classes — none of which luz's closed-vocabulary engine resolves (see [Utility classes](#utility-classes)). Bringing a component in means rewriting its `className` strings once: swap arbitrary values for the nearest `space-N`/`size-N` step or a plain layout literal, replace `data-[state=open]:`-style variants with luz's own (`open:`, `checked:`, …), drop or reimplement animation classes, and replace any `lucide-react` icon imports with plain inline SVGs (see [`docs/src/components/icons.tsx`](docs/src/components/icons.tsx) for the small stroke-based set backing this repo's own adapted components).

This repo's own docs site does exactly this for 9 real components (avatar, dialog, dropdown-menu, field, menubar, tabs, toast, toggle, toggle-group) — see [`docs/src/components/ui/`](docs/src/components/ui) for worked examples; each file's top comment documents exactly what was adapted from upstream and why.

## Astro usage

For Astro projects, `luzAstro` generates a static CSS file at build time and on dev-server start — `style` + the shadcn token bridge + element-setup CSS + scanned utility classes, all in one file.

**1. Define your theme** in `luz.config.ts`:

```ts
import type { LuzAstroConfig } from "@d00m-gui/luz/astro";

export const config: LuzAstroConfig = {
  primary: "#D44541",
  secondary: "#94F6D8",
  font: '"DM Sans", sans-serif',
  path: "./src/styles/luz.css", // required — where the CSS is written
};
```

**2. Register the integration** in `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import { luzAstro } from "@d00m-gui/luz/astro";
import { config } from "./luz.config";

export default defineConfig({
  integrations: [luzAstro(config)],
});
```

**3. Import the generated CSS** from your global stylesheet:

```css
/* src/styles/global.css */
@import url("./luz.css");
```

> `path` is required — the integration throws (after logging) if it is missing, so a broken config fails the build instead of shipping unthemed output. Make sure the target directory (e.g. `./src/styles`) exists. The generated file is always written unminified — `minify` has no effect through `luzAstro`/`luzVite`; it's imported as a normal `.css` file (see step 3 above), so Astro's own build already minifies it. `minify` still works if you call `luz()` directly (see [Core usage](#core-usage)). Utility-class scanning covers `.astro`/`.tsx`/`.jsx`/`.ts` files under your project's `srcDir` by default.

**`splitCss: true`** writes `theme`/`bridge`/`utilities` as separate sibling files instead of one flat one — `luz.theme.css`, `luz.bridge.css`, `luz.utilities.css` next to `path`, with `path` itself reduced to a plain `@import` aggregator:

```css
/* luz.css, when splitCss is set */
@import url("./luz.theme.css");
@import url("./luz.bridge.css");
@import url("./luz.utilities.css");
```

Nothing else about your setup changes — you still just `@import url("./luz.css")` once. Default `false` (one file, as above).

## Vite usage

For plain React apps (or anything else on Vite) without Astro, `luzVite` does the same static generation — same composition, same file — as a Vite plugin instead of an Astro integration.

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { luzVite } from "@d00m-gui/luz/vite";

export default defineConfig({
  plugins: [
    luzVite({
      primary: "#D44541",
      secondary: "#94F6D8",
      path: "./src/styles/luz.css", // required
    }),
  ],
});
```

Generation runs once on `buildStart` (before Vite resolves/transforms modules, so a plain `import "./luz.css"` in app code sees the file) and again on `configureServer` — no file watcher / incremental re-scan yet, matching `luzAstro`'s current behavior. Import the generated file from your app the same way you would with Astro.

## React usage

The React entry point (`luz/react`) is for authoring your own token-aware components — it does **not** ship a component library (see [Using shadcn components](#using-shadcn-components) for that) and it does **not** do live/dynamic theming: a luz theme is a fixed set of CSS variables generated once, by the Astro or Vite integration, at build time.

```tsx
import { withComponentStyle } from "@d00m-gui/luz/react";

const Badge = withComponentStyle(
  "my-badge",
  `.my-badge { background: var(--primary-500); color: var(--on-primary); border-radius: var(--border-radius); }`,
  (props: React.ComponentProps<"span">) => <span className="my-badge" {...props} />,
);
```

| Export | For |
| --- | --- |
| `withComponentStyle(name, css, Component)` | Wraps a component with a self-contained `<style href precedence="luz-component">` — for npm-*packaged* component authors whose CSS the static build-time scanner can't see (it only scans your own repo, not `node_modules`). Deduped and hoisted by React itself. |

`luz/react` used to also ship `LuzReact`/`useTheme` (a live theme provider) plus sound and scroll-driven-interaction helpers (`withSound`, `useLuzSound`, `useLuzScroll`, `useScrollVideo`, …). Both were retired: live/dynamic theming doesn't fit a library whose whole model is a theme fixed at build time (it's real runtime JS reacting to state, and it visibly conflicted with the static CSS the Astro/Vite integrations generate on the same page), and sound/scroll are runtime JS in a codebase that's otherwise zero-runtime-JS by design. That code now lives in [`@d00m-gui/vsfx`](https://github.com/d00m-gui/vsfx), a standalone package with no dependency on luz.

## Development

luz uses [Bun](https://bun.sh) as its runtime and toolchain.

```bash
bun install          # install dependencies
bun run bunup        # build dist/ (ESM, minified)
bun run type-check   # tsc --noEmit
bun run lint         # oxlint
bun run format       # oxfmt
bun run test         # run the Bun test suite
```

The `bunup` script always builds with `NODE_ENV=production` so published React entrypoints use `react/jsx-runtime`.

Run a single test file with `bun test tests/luz.test.ts`. Pre-commit hooks run `lint` and `type-check`, so commits fail if either does.

## License

[MIT](LICENSE)
