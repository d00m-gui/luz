import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { LuzTokens } from "../src/luz";
import {
  buildUtilityRegistry,
  emitUtilitiesCSS,
  resolveUtility,
  scanAndEmitUtilities,
} from "../src/tools/utilities";

/**
 * Minimal-but-representative LuzTokens fixture: a handful of `size-N` steps
 * (not the full 22, to exercise out-of-range rejection) and a color bucket
 * shaped like the real `luz()` output — bare aliases, numbered shades for
 * primary/secondary, and one wheel-style `-seed` key that utilities must
 * never resolve against.
 */
function tokens(overrides: Partial<LuzTokens> = {}): LuzTokens {
  return {
    settings: { name: "primary", neutrals: "neutral" },
    sizes: {
      // Typographic scale — only `text-N` (font-size) resolves against these.
      "size-1": "0.1rem",
      "size-4": "0.4rem",
      "size-16": "1.6rem",
      // Linear spacing scale — p-/m-/gap-/w-/h- resolve against these instead.
      "space-1": "0.25rem",
      "space-4": "1rem",
      "space-16": "4rem",
    },
    colors: {
      primary: "var(--primary-500)",
      "primary-500": "oklch(0.6 0.15 250)",
      "primary-600": "oklch(0.5 0.15 250)",
      secondary: "var(--secondary-500)",
      "secondary-500": "oklch(0.6 0.15 70)",
      red: "oklch(0.55 0.21 0)",
      "red-seed": "oklch(0.55 0.21 0)",
    },
    typography: {},
    ...overrides,
  };
}

describe("buildUtilityRegistry()", () => {
  test("declares the font-size `text` (scale) namespace before the color and bridge-color `text` namespaces", () => {
    const registry = buildUtilityRegistry();
    const textIndexes = registry
      .map((ns, i) => ({ ns, i }))
      .filter(({ ns }) => "prefix" in ns && ns.prefix === "text")
      .map(({ ns, i }) => ({ kind: ns.kind, i }));
    expect(textIndexes).toHaveLength(3);
    const scaleIndex = textIndexes.find((t) => t.kind === "scale")!.i;
    const colorIndex = textIndexes.find((t) => t.kind === "color")!.i;
    const bridgeIndex = textIndexes.find((t) => t.kind === "bridge-color")!.i;
    expect(scaleIndex).toBeLessThan(colorIndex);
    expect(scaleIndex).toBeLessThan(bridgeIndex);
  });

  test("has no numbered rounded-N namespace — only the literal rounded/rounded-none", () => {
    const registry = buildUtilityRegistry();
    const rounded = registry.filter(
      (ns) => "className" in ns && ns.className.startsWith("rounded"),
    );
    expect(rounded.map((ns) => (ns as { className: string }).className)).toEqual([
      "rounded",
      "rounded-none",
    ]);
  });
});

describe("resolveUtility() — scale namespaces", () => {
  test("single-property prefix (p) resolves to var(--space-N), the linear scale, not var(--size-N)", () => {
    const result = resolveUtility("p-4", tokens());
    expect(result).toEqual({
      selector: ".p-4",
      css: "padding: var(--space-4);",
    });
  });

  test("multi-property prefix (px) expands to both physical properties", () => {
    const result = resolveUtility("px-4", tokens());
    expect(result?.css).toBe(
      "padding-left: var(--space-4); padding-right: var(--space-4);",
    );
  });

  test("gap-x/gap-y resolve to column-gap/row-gap, not the shared gap prefix", () => {
    expect(resolveUtility("gap-x-4", tokens())?.css).toBe(
      "column-gap: var(--space-4);",
    );
    expect(resolveUtility("gap-y-4", tokens())?.css).toBe(
      "row-gap: var(--space-4);",
    );
    // Bare "gap-4" still resolves against the plain gap namespace itself.
    expect(resolveUtility("gap-4", tokens())?.css).toBe("gap: var(--space-4);");
  });

  test("w/h resolve against the space scale too, same as padding/margin/gap", () => {
    expect(resolveUtility("w-4", tokens())?.css).toBe("width: var(--space-4);");
    expect(resolveUtility("h-4", tokens())?.css).toBe("height: var(--space-4);");
  });

  test("text-N (font-size) resolves against the typographic size-N scale, not space-N", () => {
    expect(resolveUtility("text-4", tokens())?.css).toBe(
      "font-size: var(--size-4);",
    );
  });

  test("out-of-range step is dropped silently — no fallback, no arbitrary value", () => {
    expect(resolveUtility("p-99", tokens())).toBeNull();
  });

  test("non-numeric suffix is dropped silently", () => {
    expect(resolveUtility("p-huge", tokens())).toBeNull();
  });

  test("leading-zero suffix does not match a canonical space-N key", () => {
    expect(resolveUtility("p-04", tokens())).toBeNull();
  });
});

describe("resolveUtility() — color namespaces", () => {
  test("bg resolves a bare color alias", () => {
    expect(resolveUtility("bg-red", tokens())?.css).toBe(
      "background-color: var(--red);",
    );
  });

  test("bg resolves a numbered shade with a shade-fallback to its bare family alias", () => {
    const result = resolveUtility("bg-primary-600", tokens());
    // Same mechanism as luz.ts's withShadeFallback: a config with a reduced
    // colorSteps that dropped -600 still resolves to the bare `primary`.
    expect(result?.css).toBe(
      "background-color: var(--primary-600, var(--primary));",
    );
  });

  test("text (color) resolves color, distinct from text (font-size)", () => {
    expect(resolveUtility("text-primary-600", tokens())?.css).toBe(
      "color: var(--primary-600, var(--primary));",
    );
  });

  test("text-4 resolves as font-size (scale namespace wins over color for a numeric suffix)", () => {
    expect(resolveUtility("text-4", tokens())?.css).toBe(
      "font-size: var(--size-4);",
    );
  });

  test("border resolves border-color", () => {
    expect(resolveUtility("border-secondary-500", tokens())?.css).toBe(
      "border-color: var(--secondary-500, var(--secondary));",
    );
  });

  test("a -seed key is excluded from the color vocabulary even though it's a real tokens.colors key", () => {
    expect(resolveUtility("bg-red-seed", tokens())).toBeNull();
  });

  test("an unknown color name is dropped silently", () => {
    expect(resolveUtility("bg-mystery", tokens())).toBeNull();
  });
});

describe("resolveUtility() — bridge-color namespaces", () => {
  test("bg resolves a shadcn bridge alias not present in tokens.colors", () => {
    expect(resolveUtility("bg-card", tokens())?.css).toBe(
      "background-color: var(--card);",
    );
  });

  test("text resolves a bridge alias, no shade-fallback (it's a single named value, not a family)", () => {
    expect(resolveUtility("text-muted-foreground", tokens())?.css).toBe(
      "color: var(--muted-foreground);",
    );
  });

  test("border resolves the bridge's input alias", () => {
    expect(resolveUtility("border-input", tokens())?.css).toBe(
      "border-color: var(--input);",
    );
  });

  test("a bridge name not in BRIDGE_COLOR_NAMES is dropped silently (closed vocabulary, not open-ended pass-through)", () => {
    expect(resolveUtility("bg-not-a-real-bridge-name", tokens())).toBeNull();
  });
});

describe("resolveUtility() — opacity modifier", () => {
  test("wraps a resolved family color in oklch relative-color syntax", () => {
    expect(resolveUtility("bg-primary-600/50", tokens())?.css).toBe(
      "background-color: oklch(from var(--primary-600, var(--primary)) l c h / 50%);",
    );
  });

  test("wraps a resolved bridge alias the same way", () => {
    expect(resolveUtility("bg-destructive/10", tokens())?.css).toBe(
      "background-color: oklch(from var(--destructive) l c h / 10%);",
    );
  });

  test("escapes the / in the emitted selector", () => {
    expect(resolveUtility("bg-destructive/10", tokens())?.selector).toBe(
      ".bg-destructive\\/10",
    );
  });

  test("an opacity suffix over 100 is dropped, not clamped", () => {
    expect(resolveUtility("bg-primary/150", tokens())).toBeNull();
  });

  test("an opacity suffix on a non-color utility never resolves", () => {
    expect(resolveUtility("p-4/50", tokens())).toBeNull();
    expect(resolveUtility("rounded/50", tokens())).toBeNull();
  });

  test("an opacity suffix combined with a variant still resolves", () => {
    expect(resolveUtility("hover:bg-destructive/10", tokens())?.css).toBe(
      "background-color: oklch(from var(--destructive) l c h / 10%);",
    );
  });
});

describe("resolveUtility() — layout literals", () => {
  test("resolves a handful of display/flexbox/sizing/overflow utilities to fixed CSS", () => {
    expect(resolveUtility("flex", tokens())?.css).toBe("display: flex;");
    expect(resolveUtility("items-center", tokens())?.css).toBe(
      "align-items: center;",
    );
    expect(resolveUtility("justify-between", tokens())?.css).toBe(
      "justify-content: space-between;",
    );
    expect(resolveUtility("w-full", tokens())?.css).toBe("width: 100%;");
    expect(resolveUtility("overflow-hidden", tokens())?.css).toBe(
      "overflow: hidden;",
    );
    expect(resolveUtility("z-50", tokens())?.css).toBe("z-index: 50;");
  });

  test("an unknown layout-shaped class still doesn't resolve (closed vocabulary, not a generic display/position parser)", () => {
    expect(resolveUtility("flex-99", tokens())).toBeNull();
    expect(resolveUtility("z-999", tokens())).toBeNull();
  });
});

describe("resolveUtility() — literal namespaces", () => {
  test("rounded maps to the scalar --border-radius token", () => {
    expect(resolveUtility("rounded", tokens())).toEqual({
      selector: ".rounded",
      css: "border-radius: var(--border-radius);",
    });
  });

  test("rounded-none maps to a literal 0, not a token lookup", () => {
    expect(resolveUtility("rounded-none", tokens())).toEqual({
      selector: ".rounded-none",
      css: "border-radius: 0;",
    });
  });

  test("rounded-4 does not resolve — no numbered radius scale in v1", () => {
    expect(resolveUtility("rounded-4", tokens())).toBeNull();
  });

  test("border emits width + style as two separate declarations, distinct values", () => {
    expect(resolveUtility("border", tokens())?.css).toBe(
      "border-width: var(--border-width); border-style: solid;",
    );
  });

  test("border composes with border-{color} on the same element without either clobbering the other (distinct longhands, never the shorthand)", () => {
    expect(resolveUtility("border", tokens())?.css).not.toContain("border-color");
    expect(resolveUtility("border-primary-600", tokens())?.css).toBe(
      "border-color: var(--primary-600, var(--primary));",
    );
  });

  test("font-normal and font-bold use luz's real typography tokens", () => {
    expect(resolveUtility("font-normal", tokens())?.css).toBe(
      "font-weight: var(--font-weight);",
    );
    expect(resolveUtility("font-bold", tokens())?.css).toBe(
      "font-weight: var(--font-bold-weight);",
    );
  });

  test("font-medium and font-semibold fall back to plain numbers — no matching luz token", () => {
    expect(resolveUtility("font-medium", tokens())?.css).toBe("font-weight: 500;");
    expect(resolveUtility("font-semibold", tokens())?.css).toBe("font-weight: 600;");
  });

  test("underline/no-underline resolve to text-decoration-line", () => {
    expect(resolveUtility("underline", tokens())?.css).toBe(
      "text-decoration-line: underline;",
    );
    expect(resolveUtility("no-underline", tokens())?.css).toBe(
      "text-decoration-line: none;",
    );
  });

  test("sr-only is the real visually-hidden-but-accessible pattern, not display:none", () => {
    const css = resolveUtility("sr-only", tokens())?.css;
    expect(css).toContain("position: absolute;");
    expect(css).toContain("clip: rect(0, 0, 0, 0);");
    expect(css).not.toContain("display: none");
  });

  test("not-sr-only reverses sr-only", () => {
    expect(resolveUtility("not-sr-only", tokens())?.css).toContain("position: static;");
  });
});

describe("resolveUtility() — variants", () => {
  test("a known variant wraps the resolved base selector with its selector fragment", () => {
    const result = resolveUtility("open:bg-primary-600", tokens());
    expect(result).toEqual({
      selector: ".open\\:bg-primary-600[data-open]",
      css: "background-color: var(--primary-600, var(--primary));",
    });
  });

  test("hover/focus map to plain pseudo-classes appended to the class selector", () => {
    expect(resolveUtility("hover:bg-red", tokens())?.selector).toBe(
      ".hover\\:bg-red:hover",
    );
    expect(resolveUtility("focus:bg-red", tokens())?.selector).toBe(
      ".focus\\:bg-red:focus-visible",
    );
  });

  test("an unknown variant name drops the whole candidate", () => {
    expect(resolveUtility("dark:bg-primary-600", tokens())).toBeNull();
  });

  test("more than one ':' (stacked variants) is unsupported in v1 and drops the candidate", () => {
    expect(resolveUtility("dark:hover:bg-primary-600", tokens())).toBeNull();
  });

  test("a variant with an unresolvable base utility still drops the whole candidate", () => {
    expect(resolveUtility("open:bg-mystery", tokens())).toBeNull();
  });
});

describe("resolveUtility() — general closed-vocabulary behavior", () => {
  test("an unknown prefix is dropped silently", () => {
    expect(resolveUtility("wat-4", tokens())).toBeNull();
  });

  test("arbitrary-value syntax never resolves (no bracket escape hatch)", () => {
    expect(resolveUtility("w-[137px]", tokens())).toBeNull();
  });
});

describe("emitUtilitiesCSS()", () => {
  test("resolves and dedupes candidates, dropping unresolved ones silently", () => {
    const css = emitUtilitiesCSS(
      new Set(["p-4", "p-4", "bg-mystery", "bg-red"]),
      tokens(),
    );
    const rules = css.split("\n");
    expect(rules).toHaveLength(2); // one p-4 rule, one bg-red rule — bg-mystery dropped
    expect(css).toContain(".p-4 { padding: var(--space-4); }");
    expect(css).toContain(".bg-red { background-color: var(--red); }");
  });

  test("orders rules by namespace declaration order, then variant-less before variant, then alphabetically", () => {
    // bg (namespace index after the scale namespaces) must come after p
    // (an earlier scale namespace); within bg, the plain class sorts
    // before its variant sibling.
    const css = emitUtilitiesCSS(
      new Set(["open:bg-red", "bg-red", "p-4"]),
      tokens(),
    );
    const pIndex = css.indexOf(".p-4 {");
    const bgIndex = css.indexOf(".bg-red {");
    const openBgIndex = css.indexOf(".open\\:bg-red[data-open]");
    expect(pIndex).toBeGreaterThanOrEqual(0);
    expect(pIndex).toBeLessThan(bgIndex);
    expect(bgIndex).toBeLessThan(openBgIndex);
  });

  test("an empty candidate set emits an empty string", () => {
    expect(emitUtilitiesCSS(new Set(), tokens())).toBe("");
  });
});

describe("scanAndEmitUtilities()", () => {
  test("scans a directory and emits CSS for the utility classes found in it", () => {
    const dir = mkdtempSync(join(tmpdir(), "luz-utilities-"));
    try {
      writeFileSync(
        join(dir, "page.astro"),
        `<div class="p-4 bg-red not-a-utility"></div>`,
      );
      const css = scanAndEmitUtilities({ root: dir, tokens: tokens() });
      expect(css).toContain(".p-4 { padding: var(--space-4); }");
      expect(css).toContain(".bg-red { background-color: var(--red); }");
      expect(css).not.toContain("not-a-utility");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
