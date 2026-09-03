import type { LuzTokens } from "../luz";

const SYNTAX = {
  color: "<color>",
  number: "<number>",
  length: "<length>",
  percentage: "<percentage>",
  ident: "<custom-ident>",
  transformList: "<transform-list>",
} as const;

type PropertySyntax = (typeof SYNTAX)[keyof typeof SYNTAX];

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;
const COLOR_FN = /^(rgba?|hsla?|oklch|oklab|lab|lch|color)\(/;
const CUSTOM_IDENT = /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/;
const TRANSFORM_FN =
  "matrix3d|matrix|translate3d|translateX|translateY|translateZ|translate|scale3d|scaleX|scaleY|scaleZ|scale|rotate3d|rotateX|rotateY|rotateZ|rotate|skewX|skewY|skew|perspective";
const TRANSFORM_LIST = new RegExp(
  `^(?:(?:${TRANSFORM_FN})\\((?:[^()]|\\([^()]*\\))*\\)\\s*)+$`,
);

/** Regexes that map 1:1 to a `@property` syntax with the value used as-is. */
const SIMPLE_SYNTAX: [RegExp, PropertySyntax][] = [
  [/^-?\d+(\.\d+)?$/, SYNTAX.number],
  [/^-?\d+(\.\d+)?%$/, SYNTAX.percentage],
  [
    /^-?\d+(\.\d+)?(rem|em|px|vh|vw|vmin|vmax|ch|cqi|cqw|cqh|cqmin|cqmax|pt|pc|cm|mm|in|q)$/,
    SYNTAX.length,
  ],
  [/^(calc|clamp|min|max)\(/, SYNTAX.length],
];

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

function classify(
  value: string,
  isColorToken: boolean,
): { syntax: PropertySyntax; initialValue: string } | null {
  const v = value.trim();
  if (TRANSFORM_LIST.test(v))
    return {
      syntax: SYNTAX.transformList,
      initialValue: v.includes("var(") ? "translateX(0)" : v,
    };
  if (!isSingleToken(v)) return null;

  for (const [re, syntax] of SIMPLE_SYNTAX) {
    if (re.test(v))
      return { syntax, initialValue: v.includes("var(") ? "0px" : v };
  }
  if (HEX_COLOR.test(v) || COLOR_FN.test(v))
    return {
      syntax: SYNTAX.color,
      initialValue: v.includes("var(") ? "#000000" : v,
    };
  if (v.startsWith("var("))
    return isColorToken
      ? { syntax: SYNTAX.color, initialValue: "#000000" }
      : null;
  if (CUSTOM_IDENT.test(v)) return { syntax: SYNTAX.ident, initialValue: v };

  return null;
}

function toDecl(name: string, value: string, isColor: boolean) {
  const classified = classify(value, isColor);
  if (!classified) return null;
  return { name, inherits: true, ...classified };
}

type PropertyDecl = NonNullable<ReturnType<typeof toDecl>>;

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

/** Anything reading `var(--depth...)` (e.g. `element-background`) must stay unregistered: a typed `@property` resolves once where it's declared and inherits that fixed value, instead of re-substituting per consuming element — which is how `--depth` (set per nesting level in `_depth.css`) is meant to work. */
const READS_DEPTH = /var\(--depth\b/;

function inferProperties(tokens: LuzTokens): PropertyDecl[] {
  const declarations: PropertyDecl[] = [];
  for (const [name, [value, isColor]] of mergedTokenValues(tokens)) {
    if (READS_DEPTH.test(value)) continue;
    const decl = toDecl(name, value, isColor);
    if (decl) declarations.push(decl);
  }
  return declarations;
}

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
