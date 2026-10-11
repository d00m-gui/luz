import type { ColorHarmony } from "./tools/hue";
import type { FluidRangeName, TypeScaleName } from "./tools/sizes";
import type { WheelHueName } from "./tools/wheel";
import type { LuzComponent } from "./tools/component-names.generated";
/** Also accepts any of luz's 12 wheel hue names (`red`, `copper`, `orange`, `yellow`, `green`, `emerald`, `teal`, `cyan`, `blue`, `sky`, `violet`, `pink`) as a raw CSS color. */
export interface LuzConfig extends Partial<Record<WheelHueName, string>> {
  /** Components and generated sections omitted from bundle imports. Default `[]`. */
  exclude?: readonly (LuzComponent | "bridge" | "utilities")[];
  /** Body font stack. Default `"sans-serif"`. */
  font?: string;
  /** Default `"line-height"` for body text. Default `"130%"`. */
  "line-height"?: string;
  /** `letter-spacing` applied to `h1`-`h6`. Default `"-0.02em"`. */
  "heading-letter-spacing"?: string;
  /** `font-weight` used for `<strong>`/`<b>`. Default `800`. */
  "font-bold-weight"?: number;
  /** Base `font-weight` for body text. Default `400`. */
  "font-weight"?: number;
  /** Font stack for `<code>`/`<pre>`/`<kbd>`. Default `"monospace"`. */
  "font-monospace"?: string;
  /** Font stack for `h1`–`h6`. Default `"sans-serif"`. */
  "font-headings"?: string;
  /** Font stack for `<em>`/`<i>`. Default `"cursive"`. */
  "font-emphasis"?: string;
  /** Root font size in px, drives every size/spacing token. Default `16`. */
  base?: number;
  /**
   * Ratio for the exponential `text-*`/heading type scale, or a raw number for a custom ratio.
   * @default "perfect-fourth"
   * @param "minor-second" 1.067
   * @param "major-second" 1.125
   * @param "minor-third" 1.2
   * @param "major-third" 1.25
   * @param "perfect-fourth" 1.333
   * @param "augmented-fourth" 1.414
   * @param "perfect-fifth" 1.5
   * @param "golden" 1.618
   */
  power?: TypeScaleName | number;
  /** Base color for the primary palette (any CSS color). Default `"#007dea"`. */
  primary?: string;
  /** Base color for the neutral palette. Default: `primary` with `neutralTint` applied. */
  neutral?: string;
  /** Base color for the secondary palette. Default: derived from `primary` per `harmony`. */
  secondary?: string;
  /** Base color for the tertiary palette. Default: derived from `primary` per `harmony` when it defines one (`"monochrome"`, `"triad"`, `"analogous"`); otherwise same as `neutral` (`"complementary"` has no third color). */
  tertiary?: string;
  /** Base color for the quaternary palette. Default: derived from `primary` per `harmony` when it defines one (only `"analogous"` has a fourth color); otherwise `primary`'s own hue at a fixed low lightness — an "ink" shade in the brand hue. */
  quaternary?: string;
  /**
   * Color harmony used to derive `secondary`/`tertiary`/`quaternary` from `primary` when they aren't set explicitly. A slot a harmony doesn't define (see `tertiary`/`quaternary`) falls back to `neutral`/an "ink" shade instead.
   * @default "complementary"
   * @param "complementary" primary + secondary, hue rotated 180°
   * @param "analogous" primary + secondary/tertiary/quaternary, hue rotated 30°/60°/90°
   * @param "triad" primary + secondary/tertiary, hue rotated 120°/240°
   * @param "monochrome" primary + secondary/tertiary, same hue, lower chroma
   */
  harmony?: ColorHarmony;
  /** Palette emitted as `--scheme-accent`, the color of focus, selection and active states. Default `"primary"`. */
  accent?: "primary" | "secondary";
  /**
   * Color scheme the generated palette ships as.
   * @default "dark"
   * @param "light" fixed light palette
   * @param "dark" fixed dark palette
   * @param "auto" both palettes emitted in `:root` via `light-dark()`, resolved per `prefers-color-scheme`
   */
  mode?: "light" | "dark" | "auto";
  /** Fraction (0–1) of `primary`'s chroma carried into the neutral palette when `neutral` is unset. Default `0`. */
  neutralTint?: number;
  /** Fraction (0–1) of `secondary`/`tertiary`/`quaternary`'s own chroma carried into their `surface-*` scale (the muted background each feeds to the `.surface-*` utility classes) — independent of `neutralTint`. Default `0.4`. */
  surfaceTint?: number;
  /**
   * Target lightness (0–1, OKLCH `l`) for `scheme-primary`/`-secondary`/`-tertiary`/`-quaternary`/`-neutral` — the shade `.badge`/`.btn`/`.alert` use, both the default (unmodified) look and every variant class (`.secondary`, `.success`, …). Instead of a fixed nominal weight, each palette picks whichever of its generated shades has the real lightness closest to this target — harmonic across hues regardless of how each one's chroma happens to fall. Requires the palette's seed to be a parseable color literal (same as gamut baking); a palette that can't be baked keeps its fixed weight. Overridden per-palette by `schemeShade`. Unset by default — behaves as `schemeShade`'s default (`500`, or `800` for `neutral`).
   */
  schemeLightness?: number;
  /** Forces the exact weight used by `scheme-*` for one or all palettes, overriding `schemeLightness`. A number applies to every palette; an object targets individual ones. Default `{ neutral: 800 }` (`500` for the rest). */
  schemeShade?:
    | number
    | Partial<
        Record<
          | "primary"
          | "secondary"
          | "tertiary"
          | "quaternary"
          | "neutral"
          | "danger"
          | "success"
          | "warning"
          | "info",
          number
        >
      >;
  /** Chroma multiplier (0–1) applied to every `scheme-*` color on top of whichever shade `schemeShade`/`schemeLightness` picks — the peak-chroma `-500` shade of a saturated hue can read too loud for `.btn`/`.badge`/`.alert`. `1` (default) leaves it untouched; same mechanism as `muted()`'s `anchor-*` (fixed at `0.6`), just a knob instead of a constant. */
  schemeChroma?: number;
  /** Opacity multiplier (0–1) for component borders. Default `0.3`. Focus rings are independent. */
  borderOpacity?: number;
  /** Selector the theme block (`color-scheme` + every custom property) is emitted under. Default `":root"`. */
  selector?: string;
  /** Default `transition` shorthand applied via setup rules. Default `"all ease 200ms"`. */
  transition?: string;
  /** Default `box-shadow` token. Default `"none"`. */
  "box-shadow"?: string;
  /** `--spacing` token override (page-level gutter). Default derived from `base`. */
  spacing?: string;
  /** `--background` override. Default: `neutral` 900/100 shade depending on `mode`. */
  background?: string;
  /** `--foreground` override. Default: `neutral` 100/900 shade depending on `mode`. */
  foreground?: string;
  /**
   * Multiplier on element padding (`--element-vertical`/`--element-horizontal`, buttons/fields/forms) and form-control chrome size (`range` track/thumb). Emitted as `--density`, a live `calc()` factor (not baked at generation time) — overridable per subtree/instance by redeclaring `--density` locally, same as any custom property. `1` = default, `<1` = denser, `>1` = looser. Default `1`.
   */
  density?: number;
  /** `--depth-base` offset added to the nesting level counted by `.card`/`.popover`/etc. (1–4, capped). Default `0`. */
  depth?: number;
  /** Max lightness offset from `background` the `--depth` elevation curve (nested `.card`/`.popover`/etc.) approaches asymptotically. Default `0.125`. */
  depthMax?: number;
  /** Per-level falloff (0–1) of the `--depth` elevation curve — smaller means more contrast between the first few nesting levels. Default `0.6`. */
  depthDecay?: number;
  /** Forces the `--depth` elevation direction/magnitude, overriding the automatic `mode`-based sign. A `.elements-depth-light`/`.elements-depth-dark` class on a subtree still overrides this. */
  depthSign?: number;
  /** Lightness (0–1) above which `luzOnColor`'s auto-contrast text (the 12 wheel hues' `on-*`, and the `contrast-color()` fallback) flips from white-ish to black-ish. Emitted as `--contrast-threshold`, live (not baked) — overridable per subtree. Default `0.6`. */
  contrastThreshold?: number;
  /**
   * Multiplier on the base radius unit (`base / 78` rem), or a literal CSS value used as `--border-radius` verbatim (`"8px"`, `"0"`). Drives the whole `--border-radius-N` scale.
   * @default 1
   */
  radius?: number | string;
  /**
   * Total `border-radius-N` tokens generated (`N * ` the radius unit), the scale `rounded-N` resolves against — linear, same shape as `space-N`.
   * @default 8
   */
  radiusSteps?: number;
  /**
   * Fraction (0–1) of `--foreground` mixed into `--current-bg` on `:hover` — darkens in light mode, lightens in dark. Emitted as `--state-hover-delta`, live (not baked) — overridable per subtree.
   * @default 0.08
   */
  stateHoverDelta?: number;
  /**
   * Extra fraction (0–1) of `--foreground` mixed on `:active`, on top of `stateHoverDelta`. Emitted as `--state-pressed-delta`, live (not baked) — overridable per subtree.
   * @default 0.06
   */
  statePressedDelta?: number;
  /**
   * `translateY` applied on `:active`. Emitted as `--state-pressed-shift`, live (not baked) — overridable per subtree.
   * @default "0.1ch"
   */
  statePressedShift?: string;
  /** Generate `@property` declarations for every token. Default `false`. */
  properties?: boolean;
  /**
   * How many scale rungs (see `power`) the fluid zone's viewport-max value
   * reaches past its viewport-min value, or a raw number for a custom offset.
   * @default "fixed"
   * @param "fixed" 0 — locked, no reflow with viewport width (dense app UI)
   * @param "tight" 0.35 — subtle reflow
   * @param "balanced" 1 — one full scale rung
   * @param "dramatic" 1.6 — large reflow (marketing hero text)
   */
  sizeFluidRange?: FluidRangeName | number;
  /** Sets `sizeFluidRange` (`"app"` → `"fixed"`, `"content"` → `"balanced"`, `"landing"` → steeper than `"dramatic"`). An explicit `sizeFluidRange` overrides this. */
  preset?: "app" | "content" | "landing";
  /** Scale `size-unit` and the `text-*`/heading type scale by `base / 16` instead of a fixed 16px assumption. Default `false`. */
  sizeRelativeToBase?: boolean;
  /**
   * Total `space-N` tokens generated. Default `24`. Unlike the `text-*`/
   * heading type scale (exponential — see `power` — meant for font-size/
   * typographic rhythm), `space-N` is linear and fixed (`N * base/64`, e.g.
   * `space-4` = `1rem` at the default `base`): the scale the utility
   * engine's `p-`/`m-`/`gap-`/`w-`/`h-` classes resolve against, where
   * predictable, evenly-spaced steps matter more than typographic
   * proportion.
   */
  spaceSteps?: number;
  /** Raw CSS custom properties, merged last — overrides an existing token by name or adds a new one. */
  vars?: Record<string, string | number>;
}
