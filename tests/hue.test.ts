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

  describe("steps", () => {
    test("default step count is byte-identical to omitting `steps`", () => {
      const withDefault = luzShadesByHue({ color: "var(--x)", name: "x" });
      const explicit = luzShadesByHue({
        color: "var(--x)",
        name: "x",
        steps: WEIGHTS.length,
      });
      expect(explicit).toEqual(withDefault);
    });

    test("custom step count produces that many shades", () => {
      const shades = luzShadesByHue({ color: "var(--x)", name: "x", steps: 5 });
      expect(Object.keys(shades)).toHaveLength(5);
    });

    test("weight labels span 50 to 950 for a custom step count", () => {
      const shades = luzShadesByHue({
        color: "var(--x)",
        name: "x",
        steps: 5,
      });
      expect(shades["x-50"]).toBeDefined();
      expect(shades["x-950"]).toBeDefined();
    });

    test("resampled percents stay within the tuned curve's range", () => {
      const shades = luzShadesByHue({
        color: "var(--x)",
        name: "x",
        steps: 20,
      });
      for (const value of Object.values(shades)) {
        const percent = Number(value.match(/oklch\(from var\(--x\) ([\d.]+)%/)?.[1]);
        expect(percent).toBeGreaterThanOrEqual(14.5);
        expect(percent).toBeLessThanOrEqual(99.9);
      }
    });

    test("single step falls back to the curve's midpoint", () => {
      const shades = luzShadesByHue({ color: "var(--x)", name: "x", steps: 1 });
      expect(Object.keys(shades)).toHaveLength(1);
    });
  });

  describe("chroma curve symmetry", () => {
    // The chroma multiplier is `sin(perIndex * pi)`, evaluated by the
    // browser but built as a plain string here — perIndex must run 0→1
    // across the steps so both palette extremes land on sin(0)=sin(π)=0
    // (minimal chroma) and the true midpoint hits sin(π/2)=1 (peak chroma).
    // A previous off-by-one (`(step+1)/steps`) skipped perIndex=0 and ran
    // past 1 on the last step, producing a negative multiplier there.
    test("first shade uses perIndex 0", () => {
      const shades = luzShadesByHue({ color: "var(--x)", name: "x" });
      expect(shades["x-50"]).toContain("sin(0 * pi)");
    });

    test("last shade uses perIndex 1, not >1", () => {
      const shades = luzShadesByHue({ color: "var(--x)", name: "x" });
      expect(shades["x-950"]).toContain("sin(1 * pi)");
    });

    test("midpoint weight peaks at perIndex 0.5", () => {
      const shades = luzShadesByHue({ color: "var(--x)", name: "x" });
      expect(shades["x-500"]).toContain("sin(0.5 * pi)");
    });

    test("custom step count still spans perIndex 0 to 1", () => {
      const shades = luzShadesByHue({ color: "var(--x)", name: "x", steps: 5 });
      expect(shades["x-50"]).toContain("sin(0 * pi)");
      expect(shades["x-950"]).toContain("sin(1 * pi)");
    });
  });
});
