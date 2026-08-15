import { describe, expect, test } from "bun:test";
import type { LuzTokens } from "../src/luz";
import { luzProperty } from "../src/tools/props";

/** Builds a minimal LuzTokens fixture with values placed in the requested bucket. */
function tokens(
  sizes: Record<string, string> = {},
  colors: Record<string, string> = {},
  typography: Record<string, string> = {},
): LuzTokens {
  return {
    settings: { name: "primary" },
    sizes,
    colors,
    typography,
  };
}

/** Extracts the `@property --name { ... }` block for one token, or undefined. */
function block(css: string, name: string): string | undefined {
  const match = css.match(
    new RegExp(`@property --${name} \\{[^}]*\\}`, "s"),
  );
  return match?.[0];
}

describe("luzProperty() — classification", () => {
  test("number", () => {
    const css = luzProperty(tokens({ "toast-index": "0" }));
    expect(block(css, "toast-index")).toContain('syntax: "<number>"');
    expect(block(css, "toast-index")).toContain("initial-value: 0;");
  });

  test("percentage", () => {
    const css = luzProperty(tokens({}, { opacity: "50%" }));
    expect(block(css, "opacity")).toContain('syntax: "<percentage>"');
    expect(block(css, "opacity")).toContain("initial-value: 50%;");
  });

  test("fixed length", () => {
    const css = luzProperty(tokens({ "size-1": "0.1rem" }));
    expect(block(css, "size-1")).toContain('syntax: "<length>"');
    expect(block(css, "size-1")).toContain("initial-value: 0.1rem;");
  });

  test("fluid length (clamp)", () => {
    const value = "clamp(1.30rem, 1.15rem + 0.75cqi, 1.73rem)";
    const css = luzProperty(tokens({ "size-13": value }));
    expect(block(css, "size-13")).toContain('syntax: "<length>"');
    expect(block(css, "size-13")).toContain(`initial-value: ${value};`);
  });

  test("hex color, no var() reference", () => {
    const css = luzProperty(tokens({}, { primary: "#007dea" }));
    expect(block(css, "primary")).toContain('syntax: "<color>"');
    expect(block(css, "primary")).toContain("initial-value: #007dea;");
  });

  test("color function, no var() reference", () => {
    const css = luzProperty(tokens({}, { accent: "oklch(0.5 0.1 200)" }));
    expect(block(css, "accent")).toContain('syntax: "<color>"');
    expect(block(css, "accent")).toContain(
      "initial-value: oklch(0.5 0.1 200);",
    );
  });

  test("color function referencing var() falls back to placeholder", () => {
    const css = luzProperty(
      tokens({}, { "on-primary": "oklch(from var(--primary) 88% 0 h)" }),
    );
    expect(block(css, "on-primary")).toContain('syntax: "<color>"');
    expect(block(css, "on-primary")).toContain("initial-value: #000000;");
  });

  test("bare var() in colors bucket is typed as color", () => {
    const css = luzProperty(tokens({}, { secondary: "var(--secondary-500)" }));
    expect(block(css, "secondary")).toContain('syntax: "<color>"');
    expect(block(css, "secondary")).toContain("initial-value: #000000;");
  });

  test("bare var() outside colors bucket is skipped", () => {
    const css = luzProperty(tokens({ spacing: "var(--something)" }));
    expect(block(css, "spacing")).toBeUndefined();
  });

  test("custom-ident", () => {
    const css = luzProperty(tokens({}, {}, { font: "sans-serif" }));
    expect(block(css, "font")).toContain('syntax: "<custom-ident>"');
    expect(block(css, "font")).toContain("initial-value: sans-serif;");
  });

  test("multi-token shorthand is skipped, not mis-typed", () => {
    const css = luzProperty(tokens({}, {}, { transition: "all ease 200ms" }));
    expect(block(css, "transition")).toBeUndefined();
  });

  test("box-shadow shorthand stays skipped (no matching @property syntax)", () => {
    const css = luzProperty(
      tokens({}, {}, { "box-shadow": "0 0 4px 2px rgba(0,0,0,0.5)" }),
    );
    expect(block(css, "box-shadow")).toBeUndefined();
  });

  test("single transform function", () => {
    const css = luzProperty(tokens({ "transform-origin-scale": "scale(1.1)" }));
    expect(block(css, "transform-origin-scale")).toContain(
      'syntax: "<transform-list>"',
    );
    expect(block(css, "transform-origin-scale")).toContain(
      "initial-value: scale(1.1);",
    );
  });

  test("multi-function transform list", () => {
    const value = "translateX(10px) rotate(5deg)";
    const css = luzProperty(tokens({ transform: value }));
    expect(block(css, "transform")).toContain('syntax: "<transform-list>"');
    expect(block(css, "transform")).toContain(`initial-value: ${value};`);
  });

  test("transform list referencing var() falls back to a static placeholder", () => {
    const css = luzProperty(
      tokens({ transform: "translateX(var(--size-1))" }),
    );
    expect(block(css, "transform")).toContain('syntax: "<transform-list>"');
    expect(block(css, "transform")).toContain("initial-value: translateX(0);");
  });

  test("same name across buckets: colors overrides sizes, typography overrides colors", () => {
    const css = luzProperty(
      tokens(
        { spacing: "5rem" },
        { spacing: "#007dea" },
        { spacing: "sans-serif" },
      ),
    );
    // typography wins last — spacing ends up classified as custom-ident
    expect(block(css, "spacing")).toContain('syntax: "<custom-ident>"');
  });
});
