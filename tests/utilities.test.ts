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
      "size-1": "0.1rem",
      "size-4": "0.4rem",
      "size-16": "1.6rem",
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
  test("declares the font-size `text` (scale) namespace before the color `text` namespace", () => {
    const registry = buildUtilityRegistry();
    const textIndexes = registry
      .map((ns, i) => ({ ns, i }))
      .filter(({ ns }) => "prefix" in ns && ns.prefix === "text")
      .map(({ ns, i }) => ({ kind: ns.kind, i }));
    expect(textIndexes).toHaveLength(2);
    const scaleIndex = textIndexes.find((t) => t.kind === "scale")!.i;
    const colorIndex = textIndexes.find((t) => t.kind === "color")!.i;
    expect(scaleIndex).toBeLessThan(colorIndex);
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
  test("single-property prefix (p) resolves to var(--size-N)", () => {
    const result = resolveUtility("p-4", tokens());
    expect(result).toEqual({
      selector: ".p-4",
      css: "padding: var(--size-4);",
    });
  });

  test("multi-property prefix (px) expands to both physical properties", () => {
    const result = resolveUtility("px-4", tokens());
    expect(result?.css).toBe(
      "padding-left: var(--size-4); padding-right: var(--size-4);",
    );
  });

  test("gap-x/gap-y resolve to column-gap/row-gap, not the shared gap prefix", () => {
    expect(resolveUtility("gap-x-4", tokens())?.css).toBe(
      "column-gap: var(--size-4);",
    );
    expect(resolveUtility("gap-y-4", tokens())?.css).toBe(
      "row-gap: var(--size-4);",
    );
    // Bare "gap-4" still resolves against the plain gap namespace itself.
    expect(resolveUtility("gap-4", tokens())?.css).toBe("gap: var(--size-4);");
  });

  test("out-of-range step is dropped silently — no fallback, no arbitrary value", () => {
    expect(resolveUtility("p-99", tokens())).toBeNull();
  });

  test("non-numeric suffix is dropped silently", () => {
    expect(resolveUtility("p-huge", tokens())).toBeNull();
  });

  test("leading-zero suffix does not match a canonical size-N key", () => {
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
    expect(css).toContain(".p-4 { padding: var(--size-4); }");
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
      expect(css).toContain(".p-4 { padding: var(--size-4); }");
      expect(css).toContain(".bg-red { background-color: var(--red); }");
      expect(css).not.toContain("not-a-utility");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
