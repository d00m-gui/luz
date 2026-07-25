import { describe, expect, test } from "bun:test";
import { luzShadesByHue } from "../src/tools/hue";
import { WEIGHTS } from "../src/tools/constants";

describe("luzShadesByHue()", () => {
  test("produces one shade per weight step", () => {
    const shades = luzShadesByHue({ color: "var(--primary)", name: "primary" });
    expect(Object.keys(shades)).toHaveLength(WEIGHTS.length);
  });

  test("names keys as <name>-<weight>", () => {
    const shades = luzShadesByHue({ color: "var(--primary)", name: "primary" });
    expect(shades["primary-50"]).toBeDefined();
    expect(shades["primary-950"]).toBeDefined();
  });

  test("emits oklch values relative to the source color", () => {
    const shades = luzShadesByHue({ color: "var(--primary)", name: "primary" });
    expect(shades["primary-500"]).toContain("oklch(from var(--primary)");
  });

  test("reverse flips the lightness ramp", () => {
    const normal = luzShadesByHue({ color: "var(--x)", name: "x" });
    const reversed = luzShadesByHue({
      color: "var(--x)",
      name: "x",
      reverse: true,
    });
    expect(reversed["x-50"]).not.toBe(normal["x-50"]);
  });

  test("respects a custom name", () => {
    const shades = luzShadesByHue({ color: "var(--n)", name: "neutral" });
    expect(shades["neutral-500"]).toBeDefined();
    expect(shades["primary-500"]).toBeUndefined();
  });
});
