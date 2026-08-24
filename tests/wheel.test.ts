import { describe, expect, test } from "bun:test";
import { luzWheel } from "../src/tools/wheel";
import { WEIGHTS } from "../src/tools/constants";

const HUES = [
  "sky",
  "blue",
  "cyan",
  "teal",
  "emerald",
  "green",
  "yellow",
  "orange",
  "copper",
  "red",
];

describe("luzWheel()", () => {
  test("generates a full shade scale, a seed literal, and a bare alias per named hue", () => {
    const wheel = luzWheel(false);
    for (const hue of HUES) {
      expect(wheel[hue]).toBeDefined();
      expect(wheel[`${hue}-seed`]).toBeDefined();
      for (const weight of WEIGHTS) {
        expect(wheel[`${hue}-${weight}`]).toBeDefined();
      }
    }
    // 10 hues * (WEIGHTS.length shades + 1 seed literal + 1 bare alias)
    expect(Object.keys(wheel)).toHaveLength(
      HUES.length * (WEIGHTS.length + 2),
    );
  });

  test("bare alias points at the -500 shade; the seed is a hand-tuned literal (not inherited from primary)", () => {
    const wheel = luzWheel(false);
    expect(wheel.red).toBe("var(--red-500)");
    expect(wheel["red-seed"]).toContain(" 0)");
    expect(wheel["sky-seed"]).toContain(" 270)");
    // Shades read the seed via var() rather than nesting a literal
    // oklch(...) as their `from` source — lightningcss's relative-color
    // parser chokes on `oklch(from oklch(...) ...)`.
    expect(wheel["red-500"]).toContain("var(--red-seed)");
  });

  test("applies a prefix to every key", () => {
    const wheel = luzWheel(false, "lz-");
    expect(wheel["lz-red"]).toBeDefined();
    expect(wheel["lz-red-seed"]).toBeDefined();
    expect(wheel["lz-red-500"]).toBeDefined();
    expect(wheel.red).toBeUndefined();
  });
});
