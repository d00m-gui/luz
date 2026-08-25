/**
 * Utility-class engine: resolves Tailwind-shaped class candidates
 * (`p-4`, `bg-primary-600`, `open:bg-primary-600`, `rounded-none`, …)
 * against a `LuzTokens` object and emits real CSS rules for the ones that
 * resolve. Vocabulary is closed on purpose (see the plan this implements):
 * no arbitrary values (`w-[137px]`), no arbitrary variants
 * (`data-[state=open]:`) — a candidate that doesn't map onto a known
 * namespace + a real token (or a known variant) is dropped silently, never
 * errored.
 */

import type { LuzTokens } from "../luz";
import { withShadeFallback } from "./base";
import { resolveVariant } from "./variants";
import { scanCandidates } from "./scan";

/** A namespace backed by the numbered `size-N` scale (`tokens.sizes`). */
interface ScaleNamespace {
  kind: "scale";
  /** Class prefix, e.g. `"p"` for `p-4`. */
  prefix: string;
  /** CSS properties the resolved `var(--size-N)` value is assigned to. */
  cssProps: string[];
}

/** A namespace backed by the generated color palette (`tokens.colors`). */
interface ColorNamespace {
  kind: "color";
  /** Class prefix, e.g. `"bg"` for `bg-primary-600`. */
  prefix: string;
  cssProps: string[];
}

/**
 * A namespace with no suffix/scale at all — the class name is the whole
 * match. Unlike `ScaleNamespace`/`ColorNamespace` (one resolved value shared
 * across every prop in `cssProps`, e.g. `px-4`'s value going into both
 * `padding-left`/`padding-right`), a literal can set several properties to
 * *different* fixed values (`border` → width one value, style another;
 * `sr-only` → eight) — so it carries its declarations directly as pairs.
 */
interface LiteralNamespace {
  kind: "literal";
  /** Exact class name, e.g. `"rounded-none"`. */
  className: string;
  /** `[property, value]` pairs, e.g. `[["border-style", "solid"]]`. */
  declarations: readonly (readonly [string, string])[];
}

/**
 * A namespace backed by the shadcn token bridge's aliases (`--card`,
 * `--muted`, `--destructive`, …) rather than `tokens.colors` — these are
 * single named values, not a `{name}-{weight}` family, so the suffix is an
 * exact match against `BRIDGE_COLOR_NAMES`, not a shade lookup.
 */
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

/**
 * Names `shadcnBridgeCSS` (see `shadcn-bridge.ts`) emits as `:root` aliases.
 * Kept as a literal list, not derived from `tokens.colors` (the bridge's
 * output isn't part of `LuzTokens` — it's a separate composed block) — this
 * list must stay in sync with `shadcn-bridge.ts`'s alias names by hand.
 * `border` is deliberately excluded: it's already a real `tokens.colors`
 * key with no bridge alias needed.
 */
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
  "ring",
]);

/**
 * Declaration order doubles as emission order (see `emitUtilitiesCSS`), and
 * also resolves prefix collisions between namespaces that share a literal
 * prefix string but pull from different token buckets (`text-16` → font
 * size vs `text-primary` → color): namespaces are tried in this order and
 * the first one whose suffix actually resolves against its token bucket
 * wins, so the scale namespace goes first and only cedes to the color
 * namespace when the suffix isn't a valid step.
 *
 * This is a static shape — independent of any one config's tokens — so it
 * takes no arguments; `resolveUtility`/`emitUtilitiesCSS` are what read the
 * live `LuzTokens` to decide whether a given suffix actually resolves.
 */
export function buildUtilityRegistry(): UtilityNamespace[] {
  return [
    { kind: "scale", prefix: "p", cssProps: ["padding"] },
    { kind: "scale", prefix: "px", cssProps: ["padding-left", "padding-right"] },
    { kind: "scale", prefix: "py", cssProps: ["padding-top", "padding-bottom"] },
    { kind: "scale", prefix: "pt", cssProps: ["padding-top"] },
    { kind: "scale", prefix: "pr", cssProps: ["padding-right"] },
    { kind: "scale", prefix: "pb", cssProps: ["padding-bottom"] },
    { kind: "scale", prefix: "pl", cssProps: ["padding-left"] },
    { kind: "scale", prefix: "m", cssProps: ["margin"] },
    { kind: "scale", prefix: "mx", cssProps: ["margin-left", "margin-right"] },
    { kind: "scale", prefix: "my", cssProps: ["margin-top", "margin-bottom"] },
    { kind: "scale", prefix: "mt", cssProps: ["margin-top"] },
    { kind: "scale", prefix: "mr", cssProps: ["margin-right"] },
    { kind: "scale", prefix: "mb", cssProps: ["margin-bottom"] },
    { kind: "scale", prefix: "ml", cssProps: ["margin-left"] },
    { kind: "scale", prefix: "gap", cssProps: ["gap"] },
    { kind: "scale", prefix: "gap-x", cssProps: ["column-gap"] },
    { kind: "scale", prefix: "gap-y", cssProps: ["row-gap"] },
    { kind: "scale", prefix: "w", cssProps: ["width"] },
    { kind: "scale", prefix: "h", cssProps: ["height"] },
    // `text-16` (font size) is tried before the `text` color namespace below
    // — see the ordering note on the function doc comment.
    { kind: "scale", prefix: "text", cssProps: ["font-size"] },
    { kind: "color", prefix: "bg", cssProps: ["background-color"] },
    { kind: "color", prefix: "text", cssProps: ["color"] },
    { kind: "color", prefix: "border", cssProps: ["border-color"] },
    // Bridge names (`card`, `muted`, `destructive`, …) aren't part of
    // `tokens.colors` — see `BridgeColorNamespace`'s doc comment. No naming
    // collision with the `color` namespaces above (bridge names never match
    // a real palette family), so declaration order between them doesn't
    // matter functionally; grouped here for readability.
    { kind: "bridge-color", prefix: "bg", cssProps: ["background-color"] },
    { kind: "bridge-color", prefix: "text", cssProps: ["color"] },
    { kind: "bridge-color", prefix: "border", cssProps: ["border-color"] },
    // No `--radius-N` scale exists today (only the single scalar
    // `--border-radius`) — `rounded`/`rounded-none` are the only two
    // border-radius utilities in v1, deliberately not a numbered namespace.
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
    ...LAYOUT_LITERALS,
    ...MULTI_DECL_LITERALS,
  ];
}

/**
 * Literal utilities that need more than one differently-valued declaration —
 * `LAYOUT_LITERALS` below can't express these (its builder shares one value
 * across every prop, correct for something like `inset-0`'s single `0` but
 * wrong for e.g. `border`, where width and style differ). Small enough to
 * hand-write directly rather than invent a second builder shape.
 */
const MULTI_DECL_LITERALS: LiteralNamespace[] = [
  // Bare `border` (no color suffix — `border-{color}` is the separate
  // `color`/`bridge-color` namespace above) — sets width + style only, so it
  // composes correctly with a `border-{color}` class on the same element
  // regardless of which one appears later in the candidate set (both set
  // different longhands, never the `border` shorthand, so neither can clobber
  // the other's declaration the way re-declaring the shorthand would).
  {
    kind: "literal",
    className: "border",
    declarations: [
      ["border-width", "var(--border-width)"],
      ["border-style", "solid"],
    ],
  },
  // Real luz tokens where they exist (400/800 — see `LuzConfig`'s
  // `font-weight`/`font-bold-weight`); plain numbers for the two Tailwind
  // conventionally uses in between, since luz has no `font-medium`/
  // `font-semibold` token of its own.
  {
    kind: "literal",
    className: "font-normal",
    declarations: [["font-weight", "var(--font-weight)"]],
  },
  { kind: "literal", className: "font-medium", declarations: [["font-weight", "500"]] },
  { kind: "literal", className: "font-semibold", declarations: [["font-weight", "600"]] },
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
  // Standard visually-hidden-but-accessible pattern — deliberately NOT
  // `display: none` (that removes it from the accessibility tree too;
  // `hidden` already covers the "actually hide it" case).
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

/**
 * Fixed-value layout utilities: no token lookup, just a literal CSS
 * declaration — the same closed-vocabulary spirit as `rounded`/`rounded-none`
 * above, just covering `display`/`position`/flexbox/sizing/overflow
 * primitives that almost every real component needs and that have no
 * meaningful "token" to back them (there's no design-token scale for
 * `display: flex`). Deliberately NOT a grid-template/arbitrary-value system
 * — this is the same closed, hand-enumerated list approach as everything
 * else in this file.
 */
const LAYOUT_LITERALS: LiteralNamespace[] = (
  [
    ["flex", "display", "flex"],
    ["inline-flex", "display", "inline-flex"],
    ["grid", "display", "grid"],
    ["inline-grid", "display", "inline-grid"],
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
    ["flex-1", "flex", "1 1 0%"],
    ["w-full", "width", "100%"],
    ["w-fit", "width", "fit-content"],
    ["w-auto", "width", "auto"],
    ["h-full", "height", "100%"],
    ["h-fit", "height", "fit-content"],
    ["h-auto", "height", "auto"],
    ["min-w-0", "min-width", "0"],
    ["max-w-full", "max-width", "100%"],
    ["inset-0", "inset", "0"],
    ["overflow-hidden", "overflow", "hidden"],
    ["overflow-auto", "overflow", "auto"],
    ["overflow-visible", "overflow", "visible"],
    // Real truncation also needs `overflow-hidden`/`whitespace-nowrap` — a
    // single literal here can only carry one value across all its props
    // (see `LiteralNamespace`), so pair `truncate` with those two rather
    // than expecting it to behave like Tailwind's 3-declaration shorthand.
    ["truncate", "text-overflow", "ellipsis"],
    ["whitespace-nowrap", "white-space", "nowrap"],
    ["select-none", "user-select", "none"],
    ["pointer-events-none", "pointer-events", "none"],
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

/** Positive integer, no leading zero — `size-N` keys never have one. */
const SIZE_STEP_RE = /^[1-9]\d*$/;

/**
 * Resolves a `size-N` suffix against `tokens.sizes`, or `undefined` if the
 * suffix isn't a valid step for this config's `sizeSteps` (closed
 * vocabulary — out-of-range steps don't fall back to anything).
 */
function resolveSizeSuffix(suffix: string, tokens: LuzTokens): string | undefined {
  if (!SIZE_STEP_RE.test(suffix)) return undefined;
  return tokens.sizes[`size-${suffix}`];
}

/** Keys ending in `-seed` are the wheel's internal literal seed color, not a public token — excluded from the color namespaces' vocabulary. */
function isPublicColorKey(key: string, tokens: LuzTokens): boolean {
  return !key.endsWith("-seed") && tokens.colors[key] !== undefined;
}

/**
 * Builds the `var(--key)` reference for a resolved color suffix, adding a
 * shade fallback (`var(--key, var(--family))`) when `key` is itself a
 * numbered shade of a family that also has a bare alias in `tokens.colors`
 * (e.g. `primary-600` falls back to `primary`) — so utility classes stay
 * correct even for a `colorSteps` config that dropped that particular
 * shade. Mirrors `luz.ts`'s own `shadedNames` fallback, but derived per-key
 * from the live tokens instead of a hardcoded name list.
 */
function colorValue(key: string, tokens: LuzTokens): string {
  const varRef = `var(--${key})`;
  const shadeMatch = key.match(/^(.+)-\d{2,3}$/);
  const family = shadeMatch?.[1];
  if (family && tokens.colors[family] !== undefined) {
    return withShadeFallback(varRef, [family]);
  }
  return varRef;
}

/** One resolved utility's CSS shape, before it's wrapped in a selector. */
interface ResolvedBase {
  /** `[property, value]` pairs to render as declarations, in order. */
  declarations: readonly (readonly [string, string])[];
  /** Index into `buildUtilityRegistry()`'s array — used for emission order. */
  namespaceIndex: number;
}

/** Builds a `ResolvedBase.declarations` array from a namespace's `cssProps` (all sharing one resolved `value`) — the `scale`/`color`/`bridge-color` case. */
function sameValueDeclarations(cssProps: string[], value: string): [string, string][] {
  return cssProps.map((prop) => [prop, value]);
}

/**
 * Trailing `/N` opacity modifier on a color utility (`bg-destructive/10`).
 * `N` is a closed 0–100 integer, not an arbitrary value — matches the
 * project's closed-vocabulary rule the same way a `size-N` step does.
 */
const OPACITY_SUFFIX_RE = /^(.+)\/(\d{1,3})$/;

/**
 * Wraps a resolved color `var()` reference in oklch relative-color syntax to
 * apply an alpha percentage — natural here since luz's whole palette is
 * already oklch (see `tools/hue.ts`), unlike Tailwind's separate
 * color-mix()-based opacity machinery. `value` may itself be a
 * `var(--x, var(--y))` shade-fallback expression; `oklch(from …)` accepts
 * any valid `<color>` there, `var()` fallbacks included.
 */
function withOpacity(value: string, percent: number): string {
  return `oklch(from ${value} l c h / ${percent}%)`;
}

/** Resolves the non-variant half of a candidate (`"bg-primary-600"`, `"bg-destructive/10"`, `"rounded"`, …) against the namespace registry. */
function resolveBaseUtility(base: string, tokens: LuzTokens): ResolvedBase | null {
  const opacityMatch = base.match(OPACITY_SUFFIX_RE);
  const opacityPercent = opacityMatch ? Number(opacityMatch[2]) : undefined;
  // A malformed/out-of-range opacity suffix is a closed-vocabulary miss —
  // fail the whole candidate rather than silently resolving the base color
  // without it.
  if (opacityPercent !== undefined && opacityPercent > 100) return null;
  const target = opacityMatch ? opacityMatch[1]! : base;

  const registry = buildUtilityRegistry();
  for (let i = 0; i < registry.length; i++) {
    const ns = registry[i]!;
    if (ns.kind === "literal") {
      // Opacity only makes sense on a color value — a literal utility
      // (`flex`, `rounded`, …) with a `/N` suffix never resolves.
      if (opacityPercent === undefined && target === ns.className) {
        return { declarations: ns.declarations, namespaceIndex: i };
      }
      continue;
    }
    const marker = `${ns.prefix}-`;
    if (!target.startsWith(marker)) continue;
    const suffix = target.slice(marker.length);

    if (ns.kind === "scale") {
      if (opacityPercent !== undefined) continue; // same reasoning as literal, above
      const resolved = resolveSizeSuffix(suffix, tokens);
      if (resolved !== undefined) {
        return {
          declarations: sameValueDeclarations(ns.cssProps, `var(--size-${suffix})`),
          namespaceIndex: i,
        };
      }
    } else if (ns.kind === "color") {
      if (isPublicColorKey(suffix, tokens)) {
        let value = colorValue(suffix, tokens);
        if (opacityPercent !== undefined) value = withOpacity(value, opacityPercent);
        return { declarations: sameValueDeclarations(ns.cssProps, value), namespaceIndex: i };
      }
    } else {
      // bridge-color: single named alias, not a `{family}-{weight}` shade —
      // no `colorValue`/shade-fallback lookup needed, just an exact-name match.
      if (BRIDGE_COLOR_NAMES.has(suffix)) {
        let value = `var(--${suffix})`;
        if (opacityPercent !== undefined) value = withOpacity(value, opacityPercent);
        return { declarations: sameValueDeclarations(ns.cssProps, value), namespaceIndex: i };
      }
    }
  }
  return null;
}

/** A fully-resolved utility candidate, ready to emit as one CSS rule. */
export interface ResolvedUtility {
  /** Full CSS selector, e.g. `.open\:bg-primary-600[data-open]`. */
  selector: string;
  /** Declaration body (no braces), e.g. `background-color: var(--primary-600);`. */
  css: string;
}

/** Escapes the special characters a resolved candidate can contain (`:` from a variant prefix, `/` from an opacity modifier) for use in a class selector. */
function escapeClassSelector(candidate: string): string {
  return candidate.replace(/[:/]/g, "\\$&");
}

/**
 * Resolves one class candidate against `tokens`. Splits on `:` once
 * (`variant:utility` — v1 supports a single variant, no `dark:hover:x`
 * stacking); returns `null` if the variant is unknown, the base utility
 * doesn't resolve, or the candidate has more than one `:`.
 */
export function resolveUtility(
  candidate: string,
  tokens: LuzTokens,
): ResolvedUtility | null {
  const parts = candidate.split(":");
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
  const css = resolved.declarations.map(([prop, value]) => `${prop}: ${value};`).join(" ");
  return { selector, css };
}

/** Sort key used by `emitUtilitiesCSS` — namespace declaration order, then variant-less before variant, then alphabetical. */
function sortKey(candidate: string, tokens: LuzTokens): [number, number, string] {
  const parts = candidate.split(":");
  const base = parts.length === 2 ? parts[1]! : parts[0]!;
  const hasVariant = parts.length === 2 ? 1 : 0;
  const resolved = resolveBaseUtility(base, tokens);
  return [resolved?.namespaceIndex ?? Number.MAX_SAFE_INTEGER, hasVariant, candidate];
}

/**
 * Resolves every candidate in `candidates` against `tokens` and emits the
 * resolved ones as a single deduplicated, stably-ordered CSS string
 * (namespace declaration order, then variant-less before variant, then
 * alphabetical). Unresolved candidates are dropped silently.
 */
export function emitUtilitiesCSS(candidates: Set<string>, tokens: LuzTokens): string {
  const resolved = new Map<string, ResolvedUtility>();
  for (const candidate of candidates) {
    if (resolved.has(candidate)) continue;
    const utility = resolveUtility(candidate, tokens);
    if (utility) resolved.set(candidate, utility);
  }

  const ordered = [...resolved.keys()].sort((a, b) => {
    const ka = sortKey(a, tokens);
    const kb = sortKey(b, tokens);
    if (ka[0] !== kb[0]) return ka[0] - kb[0];
    if (ka[1] !== kb[1]) return ka[1] - kb[1];
    return ka[2] < kb[2] ? -1 : ka[2] > kb[2] ? 1 : 0;
  });

  return ordered
    .map((candidate) => {
      const { selector, css } = resolved.get(candidate)!;
      return `${selector} { ${css} }`;
    })
    .join("\n");
}

/**
 * Entry point shared by the Astro integration and the Vite plugin (and,
 * later, a `luz add` CLI): scans `root` for utility-class candidates and
 * emits the resolved ones as CSS in one call. Framework-agnostic — no
 * Astro/Vite imports anywhere in this module or `scan.ts`.
 */
export function scanAndEmitUtilities(options: {
  root: string;
  tokens: LuzTokens;
  extensions?: string[];
}): string {
  const { root, tokens, extensions } = options;
  const candidates = scanCandidates(root, extensions);
  return emitUtilitiesCSS(candidates, tokens);
}
