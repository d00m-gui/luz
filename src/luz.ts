/**
 * Luz - Lightweight CSS-in-TypeScript theming library.
 */

import { luzShadesByHue } from "./tools/hue";
import { luzProperty } from "./tools/props";
import { reset } from "./tools/reset";
import {
  luzSizes,
  type FluidRangeName,
  type TypeScaleName,
} from "./tools/sizes";
import type { LuzSoundConfig } from "./tools/sound";
import { luzWheel } from "./tools/wheel";
import { withShadeFallback } from "./tools/base";

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
  /** Synthesized UI sound effects (Web Audio API, no external files). Opt-in, disabled by default. */
  sound?: LuzSoundConfig;
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
  spacing: "5vw",
  colorSteps: 11,
  sizeSteps: 22,
  sizeDynamicFrom: 13,
  sizeRelativeToBase: false,
  sizeFluidRange: "balanced",
};

/** Element-level style rules (buttons, inputs, tables, …) wired to theme tokens. */
function setup(tokens: LuzTokens): string {
  const { name, prefix, neutrals } = { ...tokens.settings };
  return `
a { color: var(--anchor, var(--${prefix}blue)); &.secondary { --anchor: var(--${prefix}secondary-500); } &.contrast { --anchor: var(--${prefix}${neutrals}-500); } &.danger { --anchor: var(--${prefix}red); } &.success { --anchor: var(--${prefix}emerald); } &.warning { --anchor: var(--${prefix}yellow); } } hr { background: var(--${prefix}${name}); color: var(--${prefix}${name}); } kbd { border: var(--border-width) solid var(--${prefix}${name}-900); background-color: var(--${prefix}${name}-500); color: var(--on-${prefix}${name}); box-shadow: inset 0 0 var(--size-3) var(--size-3) var(--${prefix}${name}-300), inset 0 -1rem var(--size-5) var(--size-2) var(--${prefix}${name}-600), 0 0 0 var(--size-1) var(--${prefix}${name}-600); } table { tr:hover { background-color: var(--${prefix}${name}-800); color: var(--${prefix}${name}-300); } th { background-color: var(--element-background); } } mark, ::selection, ::-moz-selection { background-color: var(--${prefix}${name}-500); color: var(--on-${prefix}${name}); outline: 3px solid var(--${prefix}${name}-500); } label[for="file"], [role="file"], [file-] { input[type="file"] { &::file-selector-button { border-top: var(--border-width) solid var(--${prefix}${name}-200); } } } input[type="range"] { background-color: var(--${prefix}${neutrals}-900); box-shadow: inset 0 0 0 var(--border-width) var(--${prefix}${neutrals}-600); &:active { &::-webkit-slider-thumb, &::-moz-range-thumb { background: var(--${prefix}${name}-500); } } } [type="checkbox"], [type="radio"], [type="range"], progress { accent-color: var(--${prefix}${name}-500); } progress { background-color: var(--background); border: none; box-shadow: 0 0 var(--size-1) var(--${prefix}${name}-500) inset; border-radius: var(--border-radius); height: var(--size-12); } [type="checkbox"], [type="radio"] { color: var(--${prefix}${name}-100); &:checked { background-color: var(--${prefix}${name}-500); border-color: var(--${prefix}${name}-200); } } [type="checkbox"][role="switch"] { &::before { background-color: var(--${prefix}${name}-500); } &:checked { background-color: var(--${prefix}${name}-500); } } [type="radio"] { &::before { background-color: var(--${prefix}-secondary-500); } &:checked { background-color: var(--${prefix}${name}-500); border-color: var(--${prefix}${name}-500); } } blockquote { border-left: 0.25rem solid var(--${prefix}${name}-200); border-inline-start: 0.25rem solid var(--${prefix}${name}-200); footer { color: var(--${prefix}${name}-500); } } [type="file"]::file-selector-button { background-color: var(--${prefix}${name}-500); color: var(--on-${prefix}${name}); text-shadow: 0 0 0.2ch var(--${prefix}${name}-700); } .btn, .button, button[type="submit"], [role="button"], [type="button"], [type="reset"], [type="submit"], button { background-color: var(--${prefix}${name}-500); color: var(--on-${prefix}${name}); text-shadow: 0 0 0.2ch var(--${prefix}${name}-700); &[role="secondary"], &[role="alternative"] { background-color: var(--${prefix}secondary-500); color: var(--on-${prefix}secondary); } &[type="reset"], &[role="cancel"], &.cancel, &.reset { background-color: var(--${prefix}${neutrals}-500); } &[role="apply"], &.apply, &.success { background-color: var(--${prefix}green); } &[role="contrast"], &.contrast { background-color: var(--foreground); color: var(--background); } &.danger { background-color: var(--${prefix}red); } &.warning { background-color: var(--${prefix}yellow); } &.ghost { background-color: transparent; color: var(--${prefix}${name}-400); } &:hover, &.over { filter: brightness(1.1); } &:active, &.pressed { filter: brightness(1.3); transform: scale(0.98); } } input[aria-invalid="false"] { border-color: var(--${prefix}green); color: var(--${prefix}green); &::placeholder { color: var(--${prefix}green); } } input[aria-invalid="true"] { border-color: var(--${prefix}red); color: var(--${prefix}red); &::placeholder { color: var(--${prefix}red); } } [data-tooltip] { &[data-placement="top"]::before, &::before { background: var(--${prefix}${name}-900); color: var(--${prefix}${name}-100); border-color: transparent; } }
  `;
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
    sound: _sound,
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

  //  Hue wheel (rotated hues from primary) — mode-independent, computed once.
  const wheel: Record<string, string> = luzWheel(
    `var(--${primaryName})`,
    prefix,
  );

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
    const neutralShades = luzShadesByHue({
      color: neutralCSSVar,
      name: neutralsName,
      base: 0.05,
      reverse,
      steps: colorSteps,
    });

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

  //  Size tokens + derived sizing variables
  const sizeTokens: Record<string, string> = luzSizes(
    normalBase,
    power,
    sizeSteps,
    sizeDynamicFrom,
    sizeRelativeToBase,
    sizeFluidRange,
  );

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
  ${withShadeFallback(setup(tokens), shadedNames)}
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
