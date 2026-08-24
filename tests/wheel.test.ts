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
  test("generates a full shade scale plus a bare alias per named hue", () => {
    const wheel = luzWheel(false);
    for (const hue of HUES) {
      expect(wheel[hue]).toBeDefined();
      for (const weight of WEIGHTS) {
        expect(wheel[`${hue}-${weight}`]).toBeDefined();
      }
    }
    // 10 hues * (WEIGHTS.length shades + 1 bare alias)
    expect(Object.keys(wheel)).toHaveLength(HUES.length * (WEIGHTS.length + 1));
  });

  test("bare alias points at the -500 shade, hand-tuned l/c per hue (not inherited from primary)", () => {
    const wheel = luzWheel(false);
    expect(wheel.red).toBe("var(--red-500)");
    expect(wheel["red-500"]).toContain(" 0)");
    expect(wheel["sky-500"]).toContain(" 270)");
  });

  test("applies a prefix to every key", () => {
    const wheel = luzWheel(false, "lz-");
    expect(wheel["lz-red"]).toBeDefined();
    expect(wheel["lz-red-500"]).toBeDefined();
    expect(wheel.red).toBeUndefined();
  });
});
