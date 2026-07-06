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
    | "<intiger>"
    | "<number> | <length> | <percentage>";
  /** Value used as initial-value in the @property rule. */
  initialValue: string;
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
      //console.log("other sizes", size);
      result.push({
        name: size,
        syntax: "<number> | <length> | <percentage>",
        initialValue: value.replace("rem", ""),
        inherits: true,
      });
    }
  });

  Object.entries(tokens.colors).map(([color, value], index) => {
    let initColor = tokens.colors["primary"];
    result.push({
      name: color,
      syntax: "<color>",
      initialValue: `${initColor}`,
      inherits: true,
    });
  });

  console.log("TBT", tokens.typography);

  Object.entries(tokens.typography).map(([font, value], index) => {
    result.push({
      name: font,
      syntax: "<string>",
      initialValue: `${value}`,
      inherits: true,
    });
  });

  return result;
}

// for (const key of Object.keys(tokens.colors)) {
//   result.push({
//     name: key,
//     syntax: "<color>",
//     initialValue: tokens.colors["primary"] ?? "#333",
//     inherits: true,
//   });
// }

// for (const key of Object.keys(tokens.sizes)) {
//   let value = tokens.sizes[key];
//   console.log("default value", key);
//   if (value?.startsWith("clamp(")) {
//     result.push({
//       name: key,
//       syntax: "<length>",
//       initialValue: value,
//       inherits: true,
//     });
//   }
// }

// function inferProperties(tokens: LuzTokens): PropertyDecl[] {
//   const result: PropertyDecl[] = [];
//   const colorMap = tokens.colors;

//   // --- Size scales: --size-N → <length> ---
//   for (const key of Object.keys(tokens.sizes)) {
//     if (!key.startsWith("size-")) continue;
//     const value = tokens.sizes[key];
//     //console.log("SIZES", value);
//     result.push({
//       name: key,
//       syntax: "<length>",
//       initialValue: value ?? "0",
//       inherits: true,
//     });

//     console.log("RESULTS", result);
//   }

//   // --- Color system with animated components (oklch … h / c references) ---
//   const ANIMATABLE_COLOR_KEYS = [
//     `${tokens.settings.name}-950`,
//     `${tokens.settings.name}-900`,
//     `${tokens.settings.name}-800`,
//     `${tokens.settings.name}-700`,
//     `${tokens.settings.name}-600`,
//     `${tokens.settings.name}-500`,
//     `${tokens.settings.name}-400`,
//     `${tokens.settings.name}-300`,
//     `${tokens.settings.name}-200`,
//     `${tokens.settings.name}-100`,
//     `${tokens.settings.name}-50`,
//   ];

//   for (const name of ANIMATABLE_COLOR_KEYS) {
//     const value = colorMap[name];
//     if (!value || !/calc\(.*sin\(/.test(value)) continue; // skip non-animated entries
//     result.push({
//       name,
//       syntax: "<color>",
//       initialValue: "hsl(0, 0%, 0%)",
//       inherits: true,
//     });
//   }

//   // --- Solid base/derived colors that can benefit from @property animation ---
//   const SOLID_COLOR_KEYS = [
//     tokens.settings.name, // e.g. primary
//     "secondary", // rotated hue color
//     "background", // resolved or referenced
//     `${tokens.settings.neutrals}-900`, // foreground alias
//     `on-${tokens.settings.name}`, // on-primary
//   ];

//   for (const name of SOLID_COLOR_KEYS) {
//     const value = colorMap[name];
//     if (!value || /var\(--/.test(value)) continue; // skip unresolved references
//     result.push({
//       name,
//       syntax: "<color>",
//       initialValue: "#000",
//       inherits: true,
//     });
//   }

//   // --- Hue wheel (rotated hues): all animatable ---
//   for (const [name] of Object.entries(colorMap)) {
//     if (
//       /^(red|copper|orange|yellow|green|emerald|teal|cyan|blue|sky)$/.test(name)
//     ) {
//       const value = colorMap[name];
//       if (!value) continue;
//       result.push({
//         name,
//         syntax: "<color>",
//         initialValue: "#000",
//         inherits: true,
//       });
//     }
//   }

//   // --- Special on-primary (uses `oklch(from …)` formula but is animatable as color) ---
//   if (!result.find((r) => r.name === "on-primary")) {
//     const value = colorMap["on-primary"];
//     if (value && !/var\(--/.test(value)) {
//       result.push({
//         name: "on-primary",
//         syntax: "<color>",
//         initialValue: "#000",
//         inherits: true,
//       });
//     }
//   }

//   // --- Lengths / widths / spacing ---
//   const LENGTH_MAP: Array<[string, string]> = [
//     ["border-radius", "0px"],
//     ["border-width", "0px"],
//     ["element-vertical", "0px"],
//     ["element-horizontal", "0px"],
//   ];
//   for (const [name, initial] of LENGTH_MAP) {
//     if (!(name in colorMap)) continue;
//     result.push({
//       name,
//       syntax: "<length>",
//       initialValue: initial,
//       inherits: true,
//     });
//   }

//   // --- Percentage / vw spacing ---
//   const spacing = tokens.colors.spacing;
//   if (spacing && !/var\(--/.test(spacing)) {
//     result.push({
//       name: "spacing",
//       syntax: "<percentage>",
//       initialValue: "0%",
//       inherits: true,
//     });
//   }

//   // --- Typography numbers ---
//   for (const [name, initial] of [
//     ["line-height", "1.3"],
//     ["font-weight", "400"],
//     ["font-bold-weight", "700"],
//   ] as const) {
//     if (!(name in tokens.typography)) continue;
//     result.push({
//       name,
//       syntax: "<number>",
//       initialValue: String(initial),
//       inherits: true,
//     });
//   }

//   return result;
// }

/** Render a single `@property` CSS rule from a declaration object. */
function renderPropertyDecl(decl: PropertyDecl): string {
  const { name, syntax, initialValue, inherits } = decl;
  return [
    `@property --${name} {
      syntax: "${syntax}";
      inherits: ${inherits};
      initial-value: ${initialValue};
    }`,
  ]
    .join("\n")
    .trim();
}

/**
 * Returns a string of CSS `@property` declarations inferred from Luz tokens.
 * Non-animatable properties (font-family, multi-value transitions, box-shadow) are excluded.
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
