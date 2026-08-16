# design-system-builder demo theme

Source: `examples/design-system-builder` `initialConfig`, resolved through
`luz()`. Colors are CSS relative-color expressions (`oklch(from var(--x) ...)`),
computed by the browser at paint time from the two base hex values below —
not static hex per shade.

```ts
{
  primary: "#D44541",
  secondary: "#94F6D8",
  font: `"DM Sans", sans-serif`,
  "font-headings": `"DM Serif Display", serif`,
  "font-monospace": `"Datatype", monospace`,
  mode: "dark",
  neutrals: "neutral",
}
```

## Palette

Base colors: `--primary: #D44541`, `--secondary: #94F6D8`,
`--neutral: oklch(from var(--primary) l 0 h)` (desaturated primary — no
separate neutral hue was set).

Each of `primary` / `secondary` / `neutral` generates the same 11-step
lightness ramp (`50`…`950`), chroma follows a sine curve peaking at the
midpoint (`500`):

| Shade | Lightness | Chroma curve position |
|---|---|---|
| 50  | 98.0% | sin(0 · π) — min chroma |
| 100 | 99.9% | sin(0.1 · π) |
| 200 | 92.2% | sin(0.2 · π) |
| 300 | 88.8% | sin(0.3 · π) |
| 400 | 88.0% | sin(0.4 · π) |
| 500 | 55.6% | sin(0.5 · π) — peak chroma |
| 600 | 43.9% | sin(0.6 · π) |
| 700 | 37.1% | sin(0.7 · π) |
| 800 | 26.9% | sin(0.8 · π) |
| 900 | 20.5% | sin(0.9 · π) |
| 950 | 14.5% | sin(1 · π) — min chroma |

Access as `var(--primary-500)`, `var(--secondary-200)`, `var(--neutral-900)`.

Semantic tokens derived from the above: `--background` (`neutral-900`),
`--foreground` (`neutral-100`), `--on-primary`, `--on-secondary`,
`--element-background` (`neutral-950`), `--element-border-color`,
`--border-color`.

Hue wheel — 9 fixed rotations off the primary hue, always available
regardless of palette: `--red` `--copper` `--orange` `--yellow` `--green`
`--emerald` `--teal` `--cyan` `--blue`.

See `previews/colors.html` for a rendered ramp.

## Typography

| Token | Value |
|---|---|
| `--font` | `"DM Sans", sans-serif` |
| `--font-headings` | `"DM Serif Display", serif` |
| `--font-monospace` | `"Datatype", monospace` |
| `--font-emphasis` | `serif` (default, not set in config) |
| `--font-weight` | `400` |
| `--font-bold-weight` | `800` |
| `--line-height` | `130%` |

Heading sizes map to the size scale: `h1``--size-22`, `h2``--size-21`,
`h3``--size-20`, `h4``--size-19`, `h5``--size-18`, `h6``--size-17`.

See `previews/typography.html`.

## Sizing & spacing

Fixed steps `--size-1`…`--size-12` (`0.1rem` → `1.2rem`, linear); fluid
`clamp()` steps `--size-13`…`--size-22` from this config's default
`sizeDynamicFrom` (13):

| Token | Value |
|---|---|
| `--size-1` | `0.1rem` |
| `--size-8` | `0.8rem` |
| `--size-16` | `clamp(1.60rem, 1.42rem + 0.92cqi, 2.13rem)` |
| `--size-22` | `clamp(2.20rem, 1.95rem + 1.26cqi, 2.93rem)` |
| `--border-radius` | `0.5rem` |
| `--border-width` | `0.1rem` |
| `--spacing` | `5rem` (structured tokens) / `5vw` (typography default) |
| `--element-vertical` | `0.8rem` |
| `--element-horizontal` | `1.6rem` |

Root font-size is `62.5%` (`1rem = 10px` convention) — see `previews/sizing.html`.

## Components (`lui`)

| Component | Purpose | Variants |
|---|---|---|
| `lui.button` | Action trigger | `success` `danger` `warning` `ghost` `contrast` `reset` `pressed` `over` |
| `lui.card` | Content container with header | — |
| `lui.field` | Labeled form control wrapper | — |
| `lui.form` | Form layout root | `role="row"` |
| `lui.switch` | Native `<input type="checkbox" role="switch">` pattern | — |
| `lui.toggle` / `lui.togglegroup` | Toggle button(s) | — |
| `lui.tabs` | Tabbed panels | — |
| `lui.dialog` | Modal dialog | — |
| `lui.menu` / `lui.menubar` | Dropdown / bar menu | — |
| `lui.meter` | Progress/value meter | — |
| `lui.toast` | Transient notification | — |
| `lui.avatar` | Image/fallback avatar | — |

Native elements (`button`, `input`, `table`, `blockquote`, `kbd`, `[data-tooltip]`,
etc.) are themed automatically by `src/tools/setup.ts` — no wrapper needed for
plain HTML controls. See `previews/components.html`.

## Usage

```tsx
import { LuzReact } from "luz/react"; // "../../src/react" inside this repo
import { lui } from "luz/react";

<LuzReact config={config}>
  <lui.button>Click</lui.button>
</LuzReact>
```

Styling rule: reference luz tokens only (`var(--primary-500)`, `var(--size-N)`,
`var(--font)`, …) — never hardcode hex/px. Same rule enforced by the `luz-ui`
skill.
