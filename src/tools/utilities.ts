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

/** A namespace with no suffix/scale at all — the class name is the whole match. */
interface LiteralNamespace {
  kind: "literal";
  /** Exact class name, e.g. `"rounded-none"`. */
  className: string;
  cssProps: string[];
  /** Literal CSS value (not a token lookup). */
  value: string;
}

export type UtilityNamespace = ScaleNamespace | ColorNamespace | LiteralNamespace;

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
    // No `--radius-N` scale exists today (only the single scalar
    // `--border-radius`) — `rounded`/`rounded-none` are the only two
    // border-radius utilities in v1, deliberately not a numbered namespace.
    {
      kind: "literal",
      className: "rounded",
      cssProps: ["border-radius"],
      value: "var(--border-radius)",
    },
    {
      kind: "literal",
      className: "rounded-none",
      cssProps: ["border-radius"],
      value: "0",
    },
  ];
}

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
  cssProps: string[];
  value: string;
  /** Index into `buildUtilityRegistry()`'s array — used for emission order. */
  namespaceIndex: number;
}

/** Resolves the non-variant half of a candidate (`"bg-primary-600"`, `"rounded"`, …) against the namespace registry. */
function resolveBaseUtility(base: string, tokens: LuzTokens): ResolvedBase | null {
  const registry = buildUtilityRegistry();
  for (let i = 0; i < registry.length; i++) {
    const ns = registry[i]!;
    if (ns.kind === "literal") {
      if (base === ns.className) {
        return { cssProps: ns.cssProps, value: ns.value, namespaceIndex: i };
      }
      continue;
    }
    const marker = `${ns.prefix}-`;
    if (!base.startsWith(marker)) continue;
    const suffix = base.slice(marker.length);
    if (ns.kind === "scale") {
      const resolved = resolveSizeSuffix(suffix, tokens);
      if (resolved !== undefined) {
        return {
          cssProps: ns.cssProps,
          value: `var(--size-${suffix})`,
          namespaceIndex: i,
        };
      }
    } else {
      if (isPublicColorKey(suffix, tokens)) {
        return {
          cssProps: ns.cssProps,
          value: colorValue(suffix, tokens),
          namespaceIndex: i,
        };
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

/** Escapes the one special character a resolved candidate can contain (`:` from a variant prefix) for use in a class selector. */
function escapeClassSelector(candidate: string): string {
  return candidate.replace(/:/g, "\\:");
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
  const css = resolved.cssProps.map((prop) => `${prop}: ${resolved.value};`).join(" ");
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
