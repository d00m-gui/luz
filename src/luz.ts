/**
 * Luz - Lightweight theming library.
 */

import { luzShadesByHue } from "./tools/hue";
import { luzProperty } from "./tools/props";
import { reset } from "./tools/reset";
import {
  luzSizes,
  luzSpace,
  type FluidRangeName,
  type TypeScaleName,
} from "./tools/sizes";
import { luzWheel } from "./tools/wheel";
import { withShadeFallback } from "./tools/shade-fallback";

/**
 * Full configuration for the `luz()` function.
 */
export interface LuzConfig {
  /** Body font stack. Default `"sans-serif"`. */
  font?: string;
  /** Default `"line-height"` for body text. Default `"130%"`. */
  "line-height"?: string;
  /** `font-weight` used for `<strong>`/`<b>`. Default `800`. */
  "font-bold-weight"?: number;
  /** Base `font-weight` for body text. Default `400`. */
  "font-weight"?: number;
  /** Font stack for `<code>`/`<pre>`/`<kbd>`. Default `"monospace"`. */
  "font-monospace"?: string;
  /** Font stack for `h1`–`h6`. Default `"sans-serif"`. */
  "font-headings"?: string;
  /** Font stack for `<em>`/`<i>`. Default `"serif"`. */
  "font-emphasis"?: string;
  /** Root font size in px, drives every size/spacing token. Default `16`. */
  base?: number;
  /**
   * Ratio for the exponential `size-N` scale, or a raw number for a custom ratio.
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
  /** Base color for the primary palette (any CSS color). Required. */
  primary: string;
  /** Custom-property name for the primary palette, e.g. `--{name}-500`. Default `"primary"`. */
  name?: string;
  /** Base color for the secondary palette. Default: primary hue rotated 180°. */
  secondary?: string;
  /**
   * Color scheme the generated palette ships as.
   * @default "dark"
   * @param "light" fixed light palette
   * @param "dark" fixed dark palette
   * @param "auto" light palette in `:root`, dark override under `@media (prefers-color-scheme: dark)`
   */
  mode?: "light" | "dark" | "auto";
  /** Custom-property name for the neutral/gray palette. Default `"neutral"`. */
  neutrals?: string;
  /** Prepended to every generated custom-property name (e.g. `"luz-"` → `--luz-primary-500`). Default `""`. */
  prefix?: string;
  /** Default `transition` shorthand applied via setup rules. Default `"all ease 200ms"`. */
  transition?: string;
  /** Default `box-shadow` token. Default `"none"`. */
  "box-shadow"?: string;
  /** `--spacing` token override (page-level gutter). Default derived from `base`. */
  spacing?: string;
  /** `--background` override. Default: `neutrals` 900/100 shade depending on `mode`. */
  background?: string;
  /** `--foreground` override. Default: `neutrals` 100/900 shade depending on `mode`. */
  foreground?: string;
  /** Minify the generated `style` string (hand-rolled, no CSS parser — see `minifyCss`). Default `false`. */
  minify?: boolean;
  /** Shade steps generated per color palette. Default `11` (50–950). */
  colorSteps?: number;
  /** Total `size-N` tokens generated. Default `22`. */
  sizeSteps?: number;
  /** First `size-N` step that uses the fluid `clamp()` zone. Default `13`. */
  sizeDynamicFrom?: number;
  /**
   * How many scale rungs (see `power`) the fluid zone's viewport-max value
   * reaches past its viewport-min value, or a raw number for a custom offset.
   * @default "balanced"
   * @param "fixed" 0 — locked, no reflow with viewport width (dense app UI)
   * @param "tight" 0.35 — subtle reflow
   * @param "balanced" 1 — one full scale rung
   * @param "dramatic" 1.6 — large reflow (marketing hero text)
   */
  sizeFluidRange?: FluidRangeName | number;
  /** Scale the size ramp by `base / 16` instead of a fixed 16px assumption. Default `false`. */
  sizeRelativeToBase?: boolean;
  /**
   * Total `space-N` tokens generated. Default `24`. Unlike `size-N` (an
   * exponential type scale — see `power` — meant for font-size/typographic
   * rhythm), `space-N` is linear and fixed (`N * base/64`, e.g. `space-4` =
   * `1rem` at the default `base`): the scale the utility engine's
   * `p-`/`m-`/`gap-`/`w-`/`h-` classes resolve against, where predictable,
   * evenly-spaced steps matter more than typographic proportion.
   */
  spaceSteps?: number;
}

/** Settings sub-object within tokens (metadata only). */
export interface TokenSettings {
  /** Resolved palette name (falls back to `"primary"` if `config.name` is empty). */
  name: string;
  /** Resolved `config.prefix`, echoed back for consumers building var names. */
  prefix?: string;
  /** Resolved `config.neutrals` palette name. */
  neutrals?: string;
}

/** Full token set used by all downstream consumers. */
export interface LuzTokens {
  /** Metadata about the resolved palette (name/prefix/neutrals). */
  settings: TokenSettings;
  /** Generated color variable map (primary/secondary/neutral shades, wheel, semantic aliases). */
  colors: Record<string, string>;
  /** Generated size variable map (`--size-1` → `0.1rem`, etc.). */
  sizes: Record<string, string>;
  /** Non-color, non-size config fields (fonts, weights, line-height, …), echoed back as tokens. */
  typography: Partial<LuzConfig>;
}

/** Return value of the `luz()` function. */
export interface LuzResult {
  /** Raw tokens object (structured). */
  tokens: LuzTokens;
  /** CSS custom property declarations as a single string. */
  variables: string;
  /** CSS @property generated via tokens */
  properties: string;
  /** Complete CSS as a string */
  style: string;
}

//  Internal Default Config
const defaultConfig: LuzConfig = {
  font: "sans-serif",
  "line-height": "130%",
  "font-bold-weight": 800,
  "font-weight": 400,
  "font-monospace": "monospace",
  "font-headings": "sans-serif",
  "font-emphasis": "serif",
  base: 16,
  power: "perfect-fourth",
  primary: "#007dea",
  name: "primary",
  mode: "dark",
  neutrals: "neutral",
  prefix: "",
  transition: "all ease 200ms",
  "box-shadow": "none",
  colorSteps: 11,
  sizeSteps: 22,
  sizeDynamicFrom: 13,
  sizeRelativeToBase: false,
  sizeFluidRange: "balanced",
  spaceSteps: 24,
};

/**
 * Theme-color custom properties consumed by reset.ts's element-level rules
 * (buttons, inputs, tables, …). This used to be a second CSS pass —
 * `setup()` — that reopened the same selectors reset.ts already declared
 * just to layer color on top, duplicating every selector list between the
 * two files (e.g. the full 6-selector "what counts as a button" chain).
 * Now that luz never does runtime/dynamic theming (see `LuzResult`'s
 * docs) there's no reason for two passes: reset.ts owns every selector —
 * structure *and* color — referencing these fixed, prefix-agnostic names
 * (`--btn-bg`, not `--${prefix}${name}-500`), and this function just
 * resolves them to the actual configured palette once, as flat
 * `:root` declarations. `reset.ts` can't do that resolution itself since
 * it's a static string shared by every config, with no way to know a
 * given build's `prefix`/`name`/`neutrals`.
 */
function themeVariables(tokens: LuzTokens): Record<string, string> {
  const { name, prefix, neutrals } = { ...tokens.settings };
  return {
    anchor: `var(--${prefix}blue)`,
    "anchor-secondary": `var(--${prefix}secondary-500)`,
    "anchor-contrast": `var(--${prefix}${neutrals}-500)`,
    "anchor-danger": `var(--${prefix}red)`,
    "anchor-success": `var(--${prefix}emerald)`,
    "anchor-warning": `var(--${prefix}yellow)`,
    "hr-color": `var(--${prefix}${name})`,
    "kbd-border-color": `var(--${prefix}${name}-900)`,
    "kbd-bg": `var(--${prefix}${name}-500)`,
    "kbd-color": `var(--on-${prefix}${name})`,
    "kbd-shadow-1": `var(--${prefix}${name}-300)`,
    "kbd-shadow-2": `var(--${prefix}${name}-600)`,
    "table-hover-bg": `var(--${prefix}${name}-800)`,
    "table-hover-color": `var(--${prefix}${name}-300)`,
    "selection-bg": `var(--${prefix}${name}-500)`,
    "selection-color": `var(--on-${prefix}${name})`,
    "file-input-border-top": `var(--${prefix}${name}-200)`,
    "range-track-bg": `var(--${prefix}${neutrals}-900)`,
    "range-track-shadow": `var(--${prefix}${neutrals}-600)`,
    "range-thumb-active-bg": `var(--${prefix}${name}-500)`,
    accent: `var(--${prefix}${name}-500)`,
    "progress-shadow": `var(--${prefix}${name}-500)`,
    "checkbox-color": `var(--${prefix}${name}-100)`,
    "checkbox-checked-bg": `var(--${prefix}${name}-500)`,
    "checkbox-checked-border": `var(--${prefix}${name}-200)`,
    "switch-bg": `var(--${prefix}${name}-500)`,
    "radio-dot-bg": `var(--${prefix}green)`,
    "radio-checked-bg": `var(--${prefix}${name}-500)`,
    "radio-checked-border": `var(--${prefix}${name}-500)`,
    "blockquote-border": `var(--${prefix}${name}-200)`,
    "blockquote-footer-color": `var(--${prefix}${name}-500)`,
    "btn-bg": `var(--${prefix}${name}-500)`,
    "btn-color": `var(--on-${prefix}${name})`,
    "btn-shadow-color": `var(--${prefix}${name}-700)`,
    "btn-bg-secondary": `var(--${prefix}secondary-500)`,
    "btn-color-secondary": `var(--on-${prefix}secondary)`,
    "btn-bg-neutral": `var(--${prefix}${neutrals}-500)`,
    "btn-bg-success": `var(--${prefix}green)`,
    "btn-bg-danger": `var(--${prefix}red)`,
    "btn-bg-warning": `var(--${prefix}yellow)`,
    "btn-color-ghost": `var(--${prefix}${name}-400)`,
    "input-valid": `var(--${prefix}green)`,
    "input-invalid": `var(--${prefix}red)`,
    "tooltip-bg": `var(--${prefix}${name}-900)`,
    "tooltip-color": `var(--${prefix}${name}-100)`,
  };
}

/**
 * Generate theme tokens and CSS custom properties from configuration.
 *
 * @param config - Optional override of default settings (typography, colors, sizing).
 * @returns Object containing structured `tokens` and a string of CSS variables.
 */
export function luz(config?: LuzConfig): LuzResult {
  const settings: LuzConfig = { ...defaultConfig, ...config };

  // Destructure top-level config fields (all optional after spread)
  const {
    primary,
    name,
    mode,
    base,
    prefix,
    neutrals,
    power,
    secondary,
    minify,
    colorSteps,
    sizeSteps,
    sizeDynamicFrom,
    sizeRelativeToBase,
    sizeFluidRange,
    spaceSteps,
    spacing,
    ...typography
  } = settings;

  // `base` is always defined here — `defaultConfig` guarantees it via the spread above.
  const normalBase = base as number;
  const isAuto = mode === "auto";
  // "auto" ships a light baseline in `:root`, overridden by a
  // `@media (prefers-color-scheme: dark)` block built from `buildColors(true)`.
  const isDark: boolean = isAuto ? false : mode === "dark";

  const normalName: string = name && name.length > 0 ? name : "primary";
  const primaryName: string = `${prefix}${normalName}`;
  const primaryCSSVar: string = `var(--${primaryName})`;

  const secondaryColor: string =
    secondary ?? `oklch(from ${primaryCSSVar} l c calc(h + 180))`;

  const secondaryName: string = `${prefix}secondary`;
  const secondaryCSSVar: string = `var(--${secondaryName})`;

  const neutralsName: string = `${prefix}${neutrals}`;
  const neutralCSSVar: string = `var(--${neutralsName})`;
  const neutralColor: string = `oklch(from ${primaryCSSVar} l 0 h)`;

  /** Full `colors` token record for one shade direction (light or dark). */
  function buildColors(reverse: boolean): Record<string, string> {
    const primaryShades = luzShadesByHue({
      color: primaryCSSVar,
      name: primaryName,
      reverse,
      steps: colorSteps,
    });
    const secondaryShades = luzShadesByHue({
      color: secondaryCSSVar,
      name: secondaryName,
      reverse,
      steps: colorSteps,
    });
    // `neutralColor`'s chroma is a literal 0, so the sine curve's usual
    // `* c` (read from the source color) would multiply by zero at every
    // step — a silent no-op that flattens the whole ramp to `base`. Give it
    // a small literal `amplitude` instead, for a subtle curve that still
    // tracks primary's hue.
    const neutralShades = luzShadesByHue({
      color: neutralCSSVar,
      name: neutralsName,
      base: 0.05,
      amplitude: 0.02,
      reverse,
      steps: colorSteps,
    });
    // Semantic hue wheel (red/orange/.../sky) — hand-tuned l/c per hue, not
    // inherited from primary (see wheel.ts); still needs `reverse` per mode
    // like every other palette, so it's built once per `buildColors` call.
    const wheel: Record<string, string> = luzWheel(reverse, prefix, colorSteps);

    return {
      primary,
      ...primaryShades,
      ...secondaryShades,
      secondary: secondaryColor,
      [neutralsName]: neutralColor,
      ...neutralShades,
      background: `var(--${neutralsName}-900)`,
      foreground: `var(--${neutralsName}-100)`,
      [`on-${secondaryName}`]: `var(--${secondaryName}-100)`,
      [`on-${primaryName}`]: `oklch(from var(--${primaryName}) 88% 0 h)`,
      ...wheel,
      border: `var(--border-width) solid var(--element-border-color)`,
      "element-background": `var(--${neutralsName}-950)`,
      "element-border-color": `oklch(from var(--${neutralsName}-600) l c h / 50%)`,
      "border-color": `oklch(from var(--${neutralsName}-600) l c h / 50%)`,
      "element-active-border-color": `oklch(from var(--${primaryName}-200) l c h / 50%)`,
      "element-color": `var(--${primaryName}-100)`,
      "element-active-color": `var(--${primaryName}-900)`,
      "element-placeholder-color": `oklch(from var(--foreground) l c h / 50%)`,
    };
  }

  const colors = buildColors(isDark);

  //  Size tokens (typographic scale) + derived sizing variables
  const sizeTokens: Record<string, string> = {
    ...luzSizes(
      normalBase,
      power,
      sizeSteps,
      sizeDynamicFrom,
      sizeRelativeToBase,
      sizeFluidRange,
    ),
    // Spacing tokens (linear scale) — see `spaceSteps`'s doc comment for why
    // this is a separate function/scale from `luzSizes` rather than more
    // `size-N` steps.
    ...luzSpace(normalBase, spaceSteps),
  };
  // `spacing` (the single page-gutter scalar, distinct from the `space-N`
  // family above) is computed by `luzSizes` from `base` by default — only
  // overwrite it when the caller explicitly passed one. Previously this
  // field wasn't destructured out of `settings` at all, so `defaultConfig`'s
  // `spacing: "5vw"` silently leaked through `...typography` and always won
  // over the computed value (spread last in the `variables` merge below) —
  // every consumer got a viewport-relative page gutter instead of the
  // intended `base`-derived one, regardless of whether they asked for it.
  if (spacing !== undefined) sizeTokens.spacing = spacing;

  //  Compose token set
  const tokens: LuzTokens = {
    settings: {
      name: normalName,
      prefix,
      neutrals,
    },
    colors,
    sizes: sizeTokens,
    typography: { ...typography } as Partial<LuzConfig>,
  };

  const properties = luzProperty(tokens);

  /** Renders a flat `--name: value;` line per entry, skipping nullish values. */
  function toVariableLines(record: Record<string, unknown>): string {
    const lines: string[] = [];
    for (const [key, value] of Object.entries(record)) {
      if (value !== undefined && value !== null) {
        lines.push(`--${key}: ${value};`);
      }
    }
    return lines.join("\n");
  }


  const shadedNames = [primaryName, secondaryName, neutralsName];

  const variables = withShadeFallback(
    toVariableLines({
      ...tokens.sizes,
      ...tokens.colors,
      ...tokens.typography,
      ...themeVariables(tokens),
    }),
    shadedNames,
  );

  // In "auto" mode, only the entries that actually differ from the light
  // baseline need to ship inside the dark media override.
  let darkOverrideBlock = "";
  if (isAuto) {
    const darkColors = buildColors(true);
    const changed: Record<string, string> = {};
    for (const [key, value] of Object.entries(darkColors)) {
      if (colors[key] !== value) changed[key] = value;
    }
    const darkVariables = withShadeFallback(
      toVariableLines(changed),
      shadedNames,
    );
    if (darkVariables) {
      darkOverrideBlock = `
  @media (prefers-color-scheme: dark) {
    :root {
      ${darkVariables}
    }
  }`;
    }
  }

  let style = `
  ${reset}
  ${properties}
  :root {
    ${variables}
  }
  ${darkOverrideBlock}
  `;

  if (minify) {
    style = minifyCss(style);
  }

  return { tokens, variables, style, properties };
}

/**
 * Strips comments and collapses whitespace in a CSS string.
 *
 * Deliberately hand-rolled instead of using a CSS parser like `lightningcss`:
 * this file is imported by browser bundles (React) as well as Node (Astro),
 * and `lightningcss`'s native binding pulls in Node-only modules
 * (`child_process` via `detect-libc`) that break in the browser. The Astro
 * adapter reuses this same function for its own output — no runtime CSS
 * dependency needed.
 */
export function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\n+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
