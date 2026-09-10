import type { LuzTokens } from "../luz";
import { withShadeFallback } from "./shade-fallback";
import { MEDIA_QUERIES, MEDIA_VARIANTS, resolveVariant } from "./variants";

interface ScaleNamespace {
  kind: "scale";
  /** Class prefix, e.g. `"p"` for `p-4`. */
  prefix: string;
  /** Which numbered token family the suffix resolves against. */
  scaleFamily: "space";
  /** CSS properties the resolved `var(--{scaleFamily}-N)` value is assigned to. */
  cssProps: string[];
}

/** A namespace backed by the generated color palette (`tokens.colors`). */
interface ColorNamespace {
  kind: "color";
  /** Class prefix, e.g. `"bg"` for `bg-primary-600`. */
  prefix: string;
  cssProps: string[];
}

interface LiteralNamespace {
  kind: "literal";
  className: string;
  declarations: readonly (readonly [string, string])[];
  /** Overrides `declarations` when a value depends on `settings.name`/`prefix`, resolved against `tokens`. */
  dynamic?: (tokens: LuzTokens) => readonly (readonly [string, string])[];
}

interface BridgeColorNamespace {
  kind: "bridge-color";
  prefix: string;
  cssProps: string[];
}

export type UtilityNamespace =
  | ScaleNamespace
  | ColorNamespace
  | LiteralNamespace
  | BridgeColorNamespace;

const BRIDGE_COLOR_NAMES = new Set([
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary-foreground",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "input",
  "border",
  "ring",
]);

function buildUtilityRegistry(): UtilityNamespace[] {
  return [
    { kind: "scale", prefix: "p", scaleFamily: "space", cssProps: ["padding"] },
    {
      kind: "scale",
      prefix: "px",
      scaleFamily: "space",
      cssProps: ["padding-left", "padding-right"],
    },
    {
      kind: "scale",
      prefix: "py",
      scaleFamily: "space",
      cssProps: ["padding-top", "padding-bottom"],
    },
    {
      kind: "scale",
      prefix: "pt",
      scaleFamily: "space",
      cssProps: ["padding-top"],
    },
    {
      kind: "scale",
      prefix: "pr",
      scaleFamily: "space",
      cssProps: ["padding-right"],
    },
    {
      kind: "scale",
      prefix: "pb",
      scaleFamily: "space",
      cssProps: ["padding-bottom"],
    },
    {
      kind: "scale",
      prefix: "pl",
      scaleFamily: "space",
      cssProps: ["padding-left"],
    },
    { kind: "scale", prefix: "m", scaleFamily: "space", cssProps: ["margin"] },
    {
      kind: "scale",
      prefix: "mx",
      scaleFamily: "space",
      cssProps: ["margin-left", "margin-right"],
    },
    {
      kind: "scale",
      prefix: "my",
      scaleFamily: "space",
      cssProps: ["margin-top", "margin-bottom"],
    },
    {
      kind: "scale",
      prefix: "mt",
      scaleFamily: "space",
      cssProps: ["margin-top"],
    },
    {
      kind: "scale",
      prefix: "mr",
      scaleFamily: "space",
      cssProps: ["margin-right"],
    },
    {
      kind: "scale",
      prefix: "mb",
      scaleFamily: "space",
      cssProps: ["margin-bottom"],
    },
    {
      kind: "scale",
      prefix: "ml",
      scaleFamily: "space",
      cssProps: ["margin-left"],
    },
    { kind: "scale", prefix: "gap", scaleFamily: "space", cssProps: ["gap"] },
    {
      kind: "scale",
      prefix: "gap-x",
      scaleFamily: "space",
      cssProps: ["column-gap"],
    },
    {
      kind: "scale",
      prefix: "gap-y",
      scaleFamily: "space",
      cssProps: ["row-gap"],
    },
    { kind: "scale", prefix: "w", scaleFamily: "space", cssProps: ["width"] },
    { kind: "scale", prefix: "h", scaleFamily: "space", cssProps: ["height"] },
    {
      kind: "scale",
      prefix: "size",
      scaleFamily: "space",
      cssProps: ["width", "height"],
    },
    {
      kind: "scale",
      prefix: "min-h",
      scaleFamily: "space",
      cssProps: ["min-height"],
    },
    {
      kind: "scale",
      prefix: "max-h",
      scaleFamily: "space",
      cssProps: ["max-height"],
    },
    { kind: "scale", prefix: "top", scaleFamily: "space", cssProps: ["top"] },
    {
      kind: "scale",
      prefix: "right",
      scaleFamily: "space",
      cssProps: ["right"],
    },
    {
      kind: "scale",
      prefix: "bottom",
      scaleFamily: "space",
      cssProps: ["bottom"],
    },
    { kind: "scale", prefix: "left", scaleFamily: "space", cssProps: ["left"] },
    {
      kind: "scale",
      prefix: "inset",
      scaleFamily: "space",
      cssProps: ["inset"],
    },
    ...TEXT_SCALE_LITERALS,
    { kind: "color", prefix: "bg", cssProps: ["background-color"] },
    { kind: "color", prefix: "text", cssProps: ["color"] },
    { kind: "color", prefix: "border", cssProps: ["border-color"] },
    { kind: "bridge-color", prefix: "bg", cssProps: ["background-color"] },
    { kind: "bridge-color", prefix: "text", cssProps: ["color"] },
    { kind: "bridge-color", prefix: "border", cssProps: ["border-color"] },
    {
      kind: "literal",
      className: "rounded",
      declarations: [["border-radius", "var(--border-radius)"]],
    },
    {
      kind: "literal",
      className: "rounded-none",
      declarations: [["border-radius", "0"]],
    },
    {
      kind: "literal",
      className: "rounded-full",
      declarations: [["border-radius", "9999px"]],
    },
    ...LAYOUT_LITERALS,
    ...MULTI_DECL_LITERALS,
  ];
}

const MULTI_DECL_LITERALS: LiteralNamespace[] = [
  {
    kind: "literal",
    className: "border",
    declarations: [
      ["border-width", "var(--border-width)"],
      ["border-style", "solid"],
    ],
    dynamic: (tokens) => {
      const primaryFamily = tokens.settings.name;
      return [
        ["border-width", "var(--border-width)"],
        ["border-style", "solid"],
        [
          "border-color",
          withOpacity(colorValue(`${primaryFamily}-500`, tokens), 50),
        ],
      ];
    },
  },
  {
    kind: "literal",
    className: "font-normal",
    declarations: [["font-weight", "var(--font-weight)"]],
  },
  {
    kind: "literal",
    className: "font-medium",
    declarations: [["font-weight", "500"]],
  },
  {
    kind: "literal",
    className: "font-semibold",
    declarations: [["font-weight", "600"]],
  },
  {
    kind: "literal",
    className: "font-bold",
    declarations: [["font-weight", "var(--font-bold-weight)"]],
  },
  {
    kind: "literal",
    className: "underline",
    declarations: [["text-decoration-line", "underline"]],
  },
  {
    kind: "literal",
    className: "no-underline",
    declarations: [["text-decoration-line", "none"]],
  },
  {
    kind: "literal",
    className: "sr-only",
    declarations: [
      ["position", "absolute"],
      ["width", "1px"],
      ["height", "1px"],
      ["padding", "0"],
      ["margin", "-1px"],
      ["overflow", "hidden"],
      ["clip", "rect(0, 0, 0, 0)"],
      ["white-space", "nowrap"],
      ["border-width", "0"],
    ],
  },
  {
    kind: "literal",
    className: "not-sr-only",
    declarations: [
      ["position", "static"],
      ["width", "auto"],
      ["height", "auto"],
      ["padding", "0"],
      ["margin", "0"],
      ["overflow", "visible"],
      ["clip", "auto"],
      ["white-space", "normal"],
    ],
  },
];

const TEXT_SCALE_LITERALS: LiteralNamespace[] = (
  ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"] as const
).map((name) => ({
  kind: "literal" as const,
  className: `text-${name}`,
  declarations: [["font-size", `var(--font-size-${name})`]] as const,
}));

const LAYOUT_LITERALS: LiteralNamespace[] = (
  [
    ["flex", "display", "flex"],
    ["inline-flex", "display", "inline-flex"],
    ["grid", "display", "grid"],
    ["inline-grid", "display", "inline-grid"],
    ["col-span-full", "grid-column", "1 / -1"],
    ["block", "display", "block"],
    ["inline-block", "display", "inline-block"],
    ["hidden", "display", "none"],
    ["contents", "display", "contents"],
    ["relative", "position", "relative"],
    ["absolute", "position", "absolute"],
    ["fixed", "position", "fixed"],
    ["sticky", "position", "sticky"],
    ["flex-row", "flex-direction", "row"],
    ["flex-col", "flex-direction", "column"],
    ["flex-wrap", "flex-wrap", "wrap"],
    ["flex-nowrap", "flex-wrap", "nowrap"],
    ["items-start", "align-items", "flex-start"],
    ["items-end", "align-items", "flex-end"],
    ["items-center", "align-items", "center"],
    ["items-stretch", "align-items", "stretch"],
    ["justify-start", "justify-content", "flex-start"],
    ["justify-end", "justify-content", "flex-end"],
    ["justify-center", "justify-content", "center"],
    ["justify-between", "justify-content", "space-between"],
    ["justify-around", "justify-content", "space-around"],
    ["shrink-0", "flex-shrink", "0"],
    ["grow", "flex-grow", "1"],
    ["grow-0", "flex-grow", "0"],
    ["flex-1", "flex", "1 1 auto"],
    ["w-full", "width", "100%"],
    ["w-fit", "width", "fit-content"],
    ["w-auto", "width", "auto"],
    ["h-full", "height", "100%"],
    ["h-fit", "height", "fit-content"],
    ["h-auto", "height", "auto"],
    ["w-screen", "width", "100vw"],
    ["h-screen", "height", "100vh"],
    ["min-w-0", "min-width", "0"],
    ["max-w-full", "max-width", "100%"],
    ["min-h-screen", "min-height", "100vh"],
    ["max-h-full", "max-height", "100%"],
    ["inset-0", "inset", "0"],
    ["p-0", "padding", "0"],
    ["m-0", "margin", "0"],
    ["gap-0", "gap", "0"],
    ["aspect-square", "aspect-ratio", "1 / 1"],
    ["aspect-video", "aspect-ratio", "16 / 9"],
    ["overflow-hidden", "overflow", "hidden"],
    ["overflow-auto", "overflow", "auto"],
    ["overflow-visible", "overflow", "visible"],
    ["truncate", "text-overflow", "ellipsis"],
    ["whitespace-nowrap", "white-space", "nowrap"],
    ["select-none", "user-select", "none"],
    ["pointer-events-none", "pointer-events", "none"],
    ["pointer-events-auto", "pointer-events", "auto"],
    ["z-0", "z-index", "0"],
    ["z-10", "z-index", "10"],
    ["z-20", "z-index", "20"],
    ["z-50", "z-index", "50"],
  ] as const
).map(([className, prop, value]) => ({
  kind: "literal" as const,
  className,
  declarations: [[prop, value]] as const,
}));

const UTILITY_REGISTRY = buildUtilityRegistry();

const SIZE_STEP_RE = /^[1-9]\d*$/;

function resolveSizeSuffix(
  suffix: string,
  family: "space",
  tokens: LuzTokens,
): string | undefined {
  if (!SIZE_STEP_RE.test(suffix)) return undefined;
  return tokens.sizes[`${family}-${suffix}`];
}

function isPublicColorKey(key: string, tokens: LuzTokens): boolean {
  return !key.endsWith("-seed") && tokens.colors[key] !== undefined;
}

function colorValue(key: string, tokens: LuzTokens): string {
  const varRef = `var(--${key})`;
  const shadeMatch = key.match(/^(.+)-\d{2,3}$/);
  const family = shadeMatch?.[1];
  if (family && tokens.colors[family] !== undefined) {
    return withShadeFallback(varRef, [family]);
  }
  return varRef;
}

interface ResolvedBase {
  declarations: readonly (readonly [string, string])[];
  namespaceIndex: number;
}

function sameValueDeclarations(
  cssProps: string[],
  value: string,
): [string, string][] {
  return cssProps.map((prop) => [prop, value]);
}

const OPACITY_SUFFIX_RE = /^(.+)\/(\d{1,3})$/;

function withOpacity(value: string, percent: number): string {
  return `oklch(from ${value} l c h / ${percent}%)`;
}

function resolveBaseUtility(
  base: string,
  tokens: LuzTokens,
): ResolvedBase | null {
  const opacityMatch = base.match(OPACITY_SUFFIX_RE);
  const opacityPercent = opacityMatch ? Number(opacityMatch[2]) : undefined;
  if (opacityPercent !== undefined && opacityPercent > 100) return null;
  const target = opacityMatch ? opacityMatch[1]! : base;

  for (let i = 0; i < UTILITY_REGISTRY.length; i++) {
    const ns = UTILITY_REGISTRY[i]!;
    if (ns.kind === "literal") {
      if (opacityPercent === undefined && target === ns.className) {
        return {
          declarations: ns.dynamic?.(tokens) ?? ns.declarations,
          namespaceIndex: i,
        };
      }
      continue;
    }
    const marker = `${ns.prefix}-`;
    if (!target.startsWith(marker)) continue;
    const suffix = target.slice(marker.length);

    if (ns.kind === "scale") {
      if (opacityPercent !== undefined) continue; // same reasoning as literal, above
      const resolved = resolveSizeSuffix(suffix, ns.scaleFamily, tokens);
      if (resolved !== undefined) {
        return {
          declarations: sameValueDeclarations(
            ns.cssProps,
            `var(--${ns.scaleFamily}-${suffix})`,
          ),
          namespaceIndex: i,
        };
      }
    } else if (ns.kind === "color") {
      if (isPublicColorKey(suffix, tokens)) {
        let value = colorValue(suffix, tokens);
        if (opacityPercent !== undefined)
          value = withOpacity(value, opacityPercent);
        return {
          declarations: sameValueDeclarations(ns.cssProps, value),
          namespaceIndex: i,
        };
      }
    } else {
      if (BRIDGE_COLOR_NAMES.has(suffix)) {
        let value = `var(--${suffix})`;
        if (opacityPercent !== undefined)
          value = withOpacity(value, opacityPercent);
        return {
          declarations: sameValueDeclarations(ns.cssProps, value),
          namespaceIndex: i,
        };
      }
    }
  }
  return null;
}

export interface ResolvedUtility {
  selector: string;
  css: string;
  /** Media query the rule is wrapped in, for breakpoint variants. */
  media?: string;
  namespaceIndex: number;
  hasVariant: boolean;
}

function escapeClassSelector(candidate: string): string {
  return candidate
    .replace(/[:/[\]=]/g, "\\$&")
    .replace(/^\d/, (digit) => `\\3${digit} `);
}

export function resolveUtility(
  candidate: string,
  tokens: LuzTokens,
): ResolvedUtility | null {
  const parts = candidate.split(":");
  if (parts.length > 3) return null;

  const media: string | undefined =
    parts.length > 1 ? MEDIA_VARIANTS[parts[0]!] : undefined;
  if (media !== undefined) parts.shift();
  if (parts.length > 2) return null;

  let variantSelector = "";
  let base: string;
  if (parts.length === 2) {
    const [variantName, baseUtility] = parts as [string, string];
    const resolvedVariant = resolveVariant(variantName);
    if (resolvedVariant === undefined) return null;
    variantSelector = resolvedVariant;
    base = baseUtility;
  } else {
    base = parts[0]!;
  }
  if (base.length === 0) return null;

  const resolved = resolveBaseUtility(base, tokens);
  if (!resolved) return null;

  const selector = `.${escapeClassSelector(candidate)}${variantSelector}`;
  const css = resolved.declarations
    .map(([prop, value]) => `${prop}: ${value};`)
    .join(" ");
  return {
    selector,
    css,
    media,
    namespaceIndex: resolved.namespaceIndex,
    hasVariant: variantSelector.length > 0,
  };
}

export function emitUtilitiesCSS(
  candidates: Set<string>,
  tokens: LuzTokens,
): string {
  const resolved: ResolvedUtility[] = [];
  for (const candidate of candidates) {
    const utility = resolveUtility(candidate, tokens);
    if (utility) resolved.push(utility);
  }

  resolved.sort((a, b) => {
    const mediaA = a.media === undefined ? -1 : MEDIA_QUERIES.indexOf(a.media);
    const mediaB = b.media === undefined ? -1 : MEDIA_QUERIES.indexOf(b.media);
    if (mediaA !== mediaB) return mediaA - mediaB;
    if (a.namespaceIndex !== b.namespaceIndex)
      return a.namespaceIndex - b.namespaceIndex;
    if (a.hasVariant !== b.hasVariant) return a.hasVariant ? 1 : -1;
    return a.selector < b.selector ? -1 : a.selector > b.selector ? 1 : 0;
  });

  const lines: string[] = [];
  let openMedia: string | undefined;
  for (const { selector, css, media } of resolved) {
    if (media !== openMedia) {
      if (openMedia !== undefined) lines.push("}");
      if (media !== undefined) lines.push(`@media ${media} {`);
      openMedia = media;
    }
    lines.push(
      media === undefined
        ? `${selector} { ${css} }`
        : `  ${selector} { ${css} }`,
    );
  }
  if (openMedia !== undefined) lines.push("}");
  return lines.join("\n");
}
