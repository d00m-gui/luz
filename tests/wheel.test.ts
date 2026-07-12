import { describe, expect, test } from "bun:test";
import { luzWheel } from "../src/tools/wheel";

describe("luzWheel()", () => {
  test("generates the ten named hues", () => {
    const wheel = luzWheel("var(--primary)");
    for (const hue of [
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
    ]) {
      expect(wheel[hue]).toBeDefined();
    }
    expect(Object.keys(wheel)).toHaveLength(10);
  });

  test("rotates hue in oklch from the source color", () => {
    const wheel = luzWheel("var(--primary)");
    expect(wheel.red).toBe("oklch(from var(--primary) l c 0)");
    expect(wheel.sky).toBe("oklch(from var(--primary) l c 270)");
  });

  test("applies a prefix to every key", () => {
    const wheel = luzWheel("var(--primary)", "lz-");
    expect(wheel["lz-red"]).toBeDefined();
    expect(wheel.red).toBeUndefined();
  });
});
