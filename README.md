# luz

> ⚠️ **Under active development.** APIs may change before `1.0.0`.

**luz** is a lightweight CSS-in-TypeScript theming library. Give it a single primary color and it generates a full set of CSS custom properties — an [oklch](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) color palette, a rotated hue wheel, semantic tokens, and a fluid size scale — from one JavaScript configuration object.

It works as a lightweight alternative to utility-first frameworks like Tailwind: instead of shipping thousands of utility classes, luz gives you a small, well-named set of design tokens (`var(--primary-500)`, `var(--size-12)`, `var(--spacing)`) and styles plain HTML elements out of the box. It ships a core generator plus optional React and Astro adapters.

## Features

- **One color in, a full theme out** — pass a `primary` color and get shades `50`–`950`, a derived `secondary`, `neutral` ramp, and a 10-hue color wheel.
- **oklch throughout** — perceptually uniform palettes with automatic light/dark inversion.
- **Fluid size scale** — `--size-1`…`--size-22` plus derived `spacing`, `border-radius`, and element sizing.
- **Framework adapters** — a React provider (`luz/react`) and an Astro integration (`luz/astro`) for static CSS generation.
- **Tiny & typed** — ships ESM with full TypeScript types, no runtime CSS framework required.

## Installation

```bash
bun add luz
# or: npm install luz / pnpm add luz
```

React and Astro are optional [peer dependencies](package.json) — install them only if you use the corresponding adapter.

## Core usage

The `luz()` function is the heart of the library. It takes a config object and returns generated tokens and CSS.

```ts
import { luz } from "luz";

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
| `propierties` | `string` | Generated CSS [`@property`](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) rules for animatable tokens. |
| `style`       | `string` | Complete stylesheet: reset + element setup + `@property` rules + `:root { … }`.                                      |

> Note: the field is spelled `propierties` — that is the established name, not a typo.

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
  mode: "dark", // "light" | "dark" — inverts the shade ramp

  // Typography
  font: "sans-serif",
  "font-headings": "sans-serif",
  "font-emphasis": "serif",
  "font-monospace": "monospace",
  "font-weight": 400,
  "font-bold-weight": 800,
  "line-height": "130%",

  // Sizing
  base: 16, // base font size in px, drives the size scale
  power: 1.33, // growth ratio for the scale
  spacing: "5vw",

  // Misc
  prefix: "", // prefix every generated custom-property name
  transition: "all ease 200ms",
  "box-shadow": "none",
  minify: false, // collapse whitespace in `style`
});
```

### Generated tokens

From a single primary color luz derives:

- **Primary / secondary / neutral shades** — `--primary-50` through `--primary-950` (and the same for `secondary` and your neutral name).
- **A hue wheel** — `--red`, `--copper`, `--orange`, `--yellow`, `--green`, `--emerald`, `--teal`, `--cyan`, `--blue`, `--sky`, all rotated in oklch from your primary.
- **Semantic tokens** — `--background`, `--foreground`, `--on-primary`, `--border`, `--element-background`, `--element-border-color`, and more.
- **Sizes** — `--size-1`…`--size-22`, plus `--spacing`, `--border-radius`, `--border-width`, `--element-vertical`, `--element-horizontal`.

Set `prefix` to namespace everything (e.g. `prefix: "lz-"` → `--lz-primary-500`).

## React usage

Wrap your app in `LuzReact` to inject the generated stylesheet, then use the pre-styled `lui` components (built on [`@base-ui/react`](https://base-ui.com)).

```tsx
import { LuzReact } from "luz/react"; // provider that injects the stylesheet
import { lui } from "luz"; // pre-styled components

const config = { primary: "#D44541", secondary: "#94F6D8" };

export function App() {
  return (
    <LuzReact config={config}>
      <lui.card>
        <h2>Buttons</h2>
        <div role="group">
          <lui.button>Button</lui.button>
          <lui.button className="danger">Danger</lui.button>
          <lui.button className="ghost">Ghost</lui.button>
        </div>
      </lui.card>
    </LuzReact>
  );
}
```

`LuzReact` renders a global `<style>` from `luz(config).style` and exposes the tokens via context, so every child can use `var(--…)` immediately. The `lui` namespace re-exports Base UI primitives (`button`, `card`, `menu`, `tabs`, `form`, `field`, `toast`, `switch`, `dialog`, `meter`, and more) pre-wired to luz tokens.

> `LuzReact` is exported from `luz/react`; `luz` and `lui` are exported from the package root.

## Astro usage

For Astro projects, `luzAstro` generates a static CSS file at build time and on dev-server start.

**1. Define your theme** in `luz.config.ts`:

```ts
import type { LuzConfig } from "luz";

export const config: LuzConfig = {
  primary: "#D44541",
  secondary: "#94F6D8",
  font: '"DM Sans", sans-serif',
  path: "./src/styles/luz.css", // required — where the CSS is written
};
```

**2. Register the integration** in `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import { luzAstro } from "luz/astro";
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

> `path` is required — the integration logs an error and writes nothing if it is missing. Make sure the target directory (e.g. `./src/styles`) exists. Set `minify: true` in the config to emit minified CSS.

## Development

luz uses [Bun](https://bun.sh) as its runtime and toolchain.

```bash
bun install          # install dependencies
bun run bunup        # build dist/ (ESM, minified)
bun run type-check   # tsc --noEmit
bun run lint         # oxlint
bun run format       # oxfmt
bun run test         # run the Bun test suite
bun run dev          # React component playground (examples/ui)
bun run astro:dev    # Astro integration demo (examples/nimda)
```

Run a single test file with `bun test tests/luz.test.ts`. Pre-commit hooks run `lint` and `type-check`, so commits fail if either does.

## License

[MIT](LICENSE)
