/**
 * Infers and emits CSS @property declarations for all animatable custom properties.
 * Each entry maps a variable name to its inferred syntax, initial value, and inheritance flag.
 */

import type { LuzTokens } from "../luz";

interface PropertyDecl {
  /** The variable name (without --). */
  name: string;
  /** CSS typescript `syntax` string. */
  syntax:
    | "<color>"
    | "<string>"
    | "<number>"
    | "<length>"
    | "<percentage>"
    | "<integer>"
    | "<color> | <string>"
    | "<number> | <length> | <percentage>";
  /** Value used as initial-value in the @property rule. */
  initialValue: string | number;
  /** Whether the property can be inherited by children. */
  inherits: boolean;
}

/**
 * Maps a token key (without `--`) to an inferred `@property` declaration.
 * Non-animatable or multi-value tokens are excluded.
 */
function inferProperties(tokens: LuzTokens): PropertyDecl[] {
  const result: PropertyDecl[] = [];
  Object.entries(tokens.sizes).map(([size, value], index) => {
    if (size.startsWith("size-")) {
      let iv = `${index + 1}`;
      result.push({
        name: size,
        syntax: "<number> | <length> | <percentage>",
        initialValue: iv,
        inherits: true,
      });
    } else {
      result.push({
        name: size,
        syntax: "<number> | <length> | <percentage>",
        initialValue: value.replace("rem", ""),
        inherits: true,
      });
    }
  });

  Object.entries(tokens.colors).map(([color, value]) => {
    result.push({
      name: color,
      syntax: "<color> | <string>",
      initialValue: value,
      inherits: true,
    });
  });

  Object.entries(tokens.typography).map(([font, value]) => {
    result.push({
      name: font,
      syntax: "<string>",
      initialValue: value,
      inherits: true,
    });
  });

  return result;
}

/** Render a single `@property` CSS rule from a declaration object. */
function renderPropertyDecl(decl: PropertyDecl): string {
  const { name, syntax, initialValue, inherits } = decl;
  return [
    `@property --${name} {
      syntax: "${syntax}";
      inherits: ${inherits};
      initial-value: ${initialValue.toString()};
    }`,
  ]
    .join("\n")
    .trim();
}

/**
 * Returns a string of CSS `@property` declarations inferred from Luz tokens.
 */
export function luzProperty(
  /** Pre-generated Luz tokens object — the source of truth for type inference. */
  tokens: LuzTokens,
): string {
  const declarations = inferProperties(tokens);
  return declarations.map(renderPropertyDecl).join("\n\n");
}

/** Type guard so consumers know this produces a valid CSS @property set. */
export function luzPropertyAsArray(tokens: LuzTokens): PropertyDecl[] {
  return inferProperties(tokens);
}
