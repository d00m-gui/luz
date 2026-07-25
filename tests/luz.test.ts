import { describe, expect, test } from "bun:test";
import { luz } from "../src/luz";

describe("luz()", () => {
  test("returns tokens, variables, propierties and style", () => {
    const result = luz({ primary: "#D44541" });
    expect(Object.keys(result).sort()).toEqual([
      "propierties",
      "style",
      "tokens",
      "variables",
    ]);
  });

  test("token set is fully structured", () => {
    const { tokens } = luz({ primary: "#D44541" });
    expect(Object.keys(tokens).sort()).toEqual([
      "colors",
      "settings",
      "sizes",
      "typography",
    ]);
  });

  test("applies defaults when only primary is given", () => {
    const { tokens } = luz({ primary: "#D44541" });
    expect(tokens.settings.name).toBe("primary");
    expect(tokens.settings.neutrals).toBe("neutral");
    expect(tokens.colors.primary).toBe("#D44541");
  });

  test("keeps the raw primary color untouched", () => {
    const { tokens } = luz({ primary: "rebeccapurple" });
    expect(tokens.colors.primary).toBe("rebeccapurple");
  });

  test("derives a secondary color 180deg from primary by default", () => {
    const { tokens } = luz({ primary: "#D44541" });
    expect(tokens.colors.secondary).toBe(
      "oklch(from var(--primary) l c calc(h + 180))",
    );
  });

  test("honors an explicit secondary color", () => {
    const { tokens } = luz({ primary: "#D44541", secondary: "#94F6D8" });
    expect(tokens.colors.secondary).toBe("#94F6D8");
  });

  test("generates the full primary shade scale", () => {
    const { tokens } = luz({ primary: "#D44541" });
    for (const weight of [50, 100, 500, 900, 950]) {
      expect(tokens.colors[`primary-${weight}`]).toBeDefined();
    }
  });

  test("exposes background/foreground semantic tokens", () => {
    const { tokens } = luz({ primary: "#D44541" });
    expect(tokens.colors.background).toBe("var(--neutral-900)");
    expect(tokens.colors.foreground).toBe("var(--neutral-100)");
  });

  test("includes the rotated hue wheel", () => {
    const { tokens } = luz({ primary: "#D44541" });
    for (const hue of ["red", "sky", "teal", "green"]) {
      expect(tokens.colors[hue]).toBeDefined();
    }
  });

  test("prefixes generated custom property names", () => {
    const { tokens } = luz({ primary: "#000", prefix: "lz-" });
    expect(tokens.colors["lz-primary-500"]).toBeDefined();
    expect(tokens.colors["lz-red"]).toBeDefined();
  });

  test("light and dark modes invert the shade ramp", () => {
    const dark = luz({ primary: "#000", mode: "dark" });
    const light = luz({ primary: "#000", mode: "light" });
    expect(dark.tokens.colors["primary-50"]).not.toBe(
      light.tokens.colors["primary-50"],
    );
  });

  test("passes typography through to tokens", () => {
    const { tokens } = luz({ primary: "#000", font: '"DM Sans", sans-serif' });
    expect(tokens.typography.font).toBe('"DM Sans", sans-serif');
  });

  test("variables string declares CSS custom properties", () => {
    const { variables } = luz({ primary: "#000" });
    expect(variables).toContain("--size-1: 0.1rem;");
    expect(variables).toContain("--primary:");
  });

  test("style embeds a :root block by default", () => {
    const { style } = luz({ primary: "#000" });
    expect(style).toContain(":root");
    expect(style).toContain("--primary");
  });

  test("minify collapses whitespace and newlines", () => {
    const { style } = luz({ primary: "#000", minify: true });
    expect(style).not.toContain("\n");
    expect(style).not.toMatch(/\s{2,}/);
  });
});
