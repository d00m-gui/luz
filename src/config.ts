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
  /** Heading/text scale ratio. Default `"perfect-fourth"`. */
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
  /** Harmony used to derive unset secondary palettes. Default `"complementary"`. */
  harmony?: ColorHarmony;
  /** Palette emitted as `--scheme-accent`, the color of focus, selection and active states. Default `"primary"`. */
  accent?: "primary" | "secondary";
  /** Palette mode. Default `"dark"`. */
  mode?: "light" | "dark" | "auto";
  /** Fraction (0–1) of `primary`'s chroma carried into the neutral palette when `neutral` is unset. Default `0`. */
  neutralTint?: number;
  /** Fraction (0–1) of `secondary`/`tertiary`/`quaternary`'s own chroma carried into their `surface-*` scale (the muted background each feeds to the `.surface-*` utility classes) — independent of `neutralTint`. Default `0.4`. */
  surfaceTint?: number;
  /** Target OKLCH lightness for scheme shades; overridden by `schemeShade`. */
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
  /** Scheme color chroma multiplier (0–1). Default `1`. */
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
  /** Live element padding/control density multiplier. Default `1`. */
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
  /** Radius unit multiplier or literal CSS value. Default `1`. */
  radius?: number | string;
  /** Number of generated radius scale steps. Default `8`. */
  radiusSteps?: number;
  /** Foreground fraction mixed on hover. Default `0.08`. */
  stateHoverDelta?: number;
  /** Additional foreground fraction mixed on press. Default `0.06`. */
  statePressedDelta?: number;
  /** Vertical shift on press. Default `"0.1ch"`. */
  statePressedShift?: string;
  /** Generate `@property` declarations for every token. Default `false`. */
  properties?: boolean;
  /** Fluid scale expansion beyond the minimum viewport value. Default `"fixed"`. */
  sizeFluidRange?: FluidRangeName | number;
  /** Sets `sizeFluidRange` (`"app"` → `"fixed"`, `"content"` → `"balanced"`, `"landing"` → steeper than `"dramatic"`). An explicit `sizeFluidRange` overrides this. */
  preset?: "app" | "content" | "landing";
  /** Scale `size-unit` and the `text-*`/heading type scale by `base / 16` instead of a fixed 16px assumption. Default `false`. */
  sizeRelativeToBase?: boolean;
  /** Number of generated linear spacing steps. Default `24`. */
  spaceSteps?: number;
  /** Raw CSS custom properties, merged last — overrides an existing token by name or adds a new one. */
  vars?: Record<string, string | number>;
}
