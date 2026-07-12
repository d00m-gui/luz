/**
 * Infers and emits CSS @property declarations for animatable custom properties.
 * Each token's actual value is classified by shape; values that can't be
 * represented by a single `@property` syntax component (shorthands like
 * `border` or `transition`) are skipped rather than mis-typed.
 */

import type { LuzTokens } from "../luz";

const SYNTAX = {
  color: "<color>",
  number: "<number>",
  length: "<length>",
  percentage: "<percentage>",
  ident: "<custom-ident>",
} as const;

type PropertySyntax = (typeof SYNTAX)[keyof typeof SYNTAX];

const NUMBER = /^-?\d+(\.\d+)?$/;
const PERCENTAGE = /^-?\d+(\.\d+)?%$/;
const LENGTH =
  /^-?\d+(\.\d+)?(rem|em|px|vh|vw|vmin|vmax|ch|cqi|cqw|cqh|cqmin|cqmax|pt|pc|cm|mm|in|q)$/;
const FLUID_LENGTH = /^(calc|clamp|min|max)\(/;
const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;
const COLOR_FN = /^(rgba?|hsla?|oklch|oklab|lab|lch|color)\(/;
const CUSTOM_IDENT = /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/;

/** True if `value` has no top-level whitespace (ignoring text inside parens). */
function isSingleToken(value: string): boolean {
  let depth = 0;
  for (const char of value) {
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (depth === 0 && /\s/.test(char)) return false;
  }
  return true;
}

/**
 * Infers the narrowest `@property` syntax a value can be safely registered
 * under, or `null` if it's a shorthand/multi-token value with no single
 * matching syntax component.
 */
function classify(
  value: string,
  isColorToken: boolean,
): { syntax: PropertySyntax; initialValue: string } | null {
  const v = value.trim();
  if (!isSingleToken(v)) return null;

  if (NUMBER.test(v)) return { syntax: SYNTAX.number, initialValue: v };
  if (PERCENTAGE.test(v)) return { syntax: SYNTAX.percentage, initialValue: v };
  if (LENGTH.test(v) || FLUID_LENGTH.test(v))
    return { syntax: SYNTAX.length, initialValue: v };
  if (HEX_COLOR.test(v) || COLOR_FN.test(v))
    // `initial-value` must be computationally independent — a value that
    // references `var(...)` (e.g. `oklch(from var(--primary) ...)`) can't
    // be used as-is, so fall back to a static placeholder of the same type.
    return {
      syntax: SYNTAX.color,
      initialValue: v.includes("var(") ? "#000000" : v,
    };
  if (v.startsWith("var("))
    // A bare var() reference is only reliably typeable as `<color>`, and
    // only for tokens we know originate from the colors bucket.
    return isColorToken
      ? { syntax: SYNTAX.color, initialValue: "#000000" }
      : null;
  if (CUSTOM_IDENT.test(v)) return { syntax: SYNTAX.ident, initialValue: v };

  return null;
}

/** Builds a declaration for one token, or `null` if it can't be typed. */
function toDecl(name: string, value: string, isColor: boolean) {
  const classified = classify(value, isColor);
  if (!classified) return null;
  return { name, inherits: true, ...classified };
}

/** Inferred from `toDecl`'s return shape rather than hand-declared. */
type PropertyDecl = NonNullable<ReturnType<typeof toDecl>>;

/**
 * Merges tokens in the same precedence used to build `:root`'s variables
 * block (sizes → colors → typography), so a name present in more than one
 * bucket (e.g. a user-supplied `spacing` override) only produces one
 * `@property` rule, matching the value that actually lands in CSS.
 */
function mergedTokenValues(tokens: LuzTokens): Map<string, [string, boolean]> {
  const merged = new Map<string, [string, boolean]>();
  const add = (record: Record<string, unknown>, isColor: boolean) => {
    for (const [name, value] of Object.entries(record)) {
      if (value === undefined || value === null) continue;
      merged.set(name, [String(value), isColor]);
    }
  };
  add(tokens.sizes, false);
  add(tokens.colors, true);
  add(tokens.typography as Record<string, unknown>, false);
  return merged;
}

/** Maps Luz tokens to inferred `@property` declarations. */
function inferProperties(tokens: LuzTokens): PropertyDecl[] {
  const declarations: PropertyDecl[] = [];
  for (const [name, [value, isColor]] of mergedTokenValues(tokens)) {
    const decl = toDecl(name, value, isColor);
    if (decl) declarations.push(decl);
  }
  return declarations;
}

/** Render a single `@property` CSS rule from a declaration object. */
function renderPropertyDecl(decl: PropertyDecl): string {
  const { name, syntax, initialValue, inherits } = decl;
  return `@property --${name} {
    syntax: "${syntax}";
    inherits: ${inherits};
    initial-value: ${initialValue};
  }`;
}

/**
 * Returns a string of CSS `@property` declarations inferred from Luz tokens.
 */
export function luzProperty(
  /** Pre-generated Luz tokens object — the source of truth for type inference. */
  tokens: LuzTokens,
): string {
  return inferProperties(tokens).map(renderPropertyDecl).join("\n\n");
}

/** Type guard so consumers know this produces a valid CSS @property set. */
export function luzPropertyAsArray(tokens: LuzTokens): PropertyDecl[] {
  return inferProperties(tokens);
}
