import { describe, expect, test } from "bun:test";
import { luzSizes } from "../src/tools/sizes";

describe("luzSizes()", () => {
  test("emits size-1 through size-12 as fixed rem steps", () => {
    const sizes = luzSizes(16);
    expect(sizes["size-1"]).toBe("0.1rem");
    expect(sizes["size-12"]).toBe("1.2rem");
  });

  test("emits size-13 through size-22 as fluid cqi clamps", () => {
    const sizes = luzSizes(16);
    expect(sizes["size-13"]).toBe("clamp(1.30rem, 1.16rem + 0.70cqi, 1.70rem)");
    expect(sizes["size-22"]).toBe("clamp(2.20rem, 1.96rem + 1.19cqi, 2.88rem)");
  });

  test("includes all 22 numbered steps plus derived tokens", () => {
    const sizes = luzSizes(16);
    const numbered = Object.keys(sizes).filter((k) => k.startsWith("size-"));
    expect(numbered).toHaveLength(22);
    // 22 numbered steps + border-radius/border-width/spacing/element-vertical/
    // element-horizontal/transform-origin + 6 toast-* tokens = 33.
    expect(Object.keys(sizes)).toHaveLength(33);
  });

  test("derives spacing and radii from the base font size", () => {
    const sizes = luzSizes(16);
    expect(sizes["border-radius"]).toBe("0.5rem"); // 16 / 32
    expect(sizes["border-width"]).toBe("0.1rem"); // 16 / 128
    expect(sizes.spacing).toBe("5rem"); // (16 / 10) * 3, rounded
    expect(sizes["element-vertical"]).toBe("0.8rem"); // 16 / 20
    expect(sizes["element-horizontal"]).toBe("1.6rem"); // 16 / 10
  });

  test("scales derived tokens with a different base", () => {
    const sizes = luzSizes(32);
    expect(sizes["border-radius"]).toBe("1.0rem"); // 32 / 32
    expect(sizes["element-horizontal"]).toBe("3.2rem"); // 32 / 10
  });

  describe("steps / dynamicFrom / relativeToBase", () => {
    test("default call is unaffected by the new params", () => {
      const withDefaults = luzSizes(16, 1.31, 22, 13, false);
      const omitted = luzSizes(16);
      expect(withDefaults).toEqual(omitted);
    });

    test("custom step count changes the numbered token count", () => {
      const sizes = luzSizes(16, 1.31, 10);
      const numbered = Object.keys(sizes).filter((k) => k.startsWith("size-"));
      expect(numbered).toHaveLength(10);
      expect(sizes["size-11"]).toBeUndefined();
    });

    test("dynamicFrom moves the fixed/fluid split point", () => {
      const sizes = luzSizes(16, 1.31, 22, 5);
      expect(sizes["size-4"]).toBe("0.4rem");
      expect(sizes["size-5"]).toContain("clamp(");
    });

    test("relativeToBase scales the ramp proportionally to base", () => {
      const base16 = luzSizes(16, 1.31, 22, 13, true);
      const base32 = luzSizes(32, 1.31, 22, 13, true);
      expect(base16["size-1"]).toBe("0.1rem");
      expect(base32["size-1"]).toBe("0.2rem"); // scale = 32/16 = 2
    });

    test("relativeToBase also scales the fluid zone", () => {
      const base16 = luzSizes(16, 1.31, 22, 13, true);
      const base32 = luzSizes(32, 1.31, 22, 13, true);
      expect(base16["size-13"]).not.toBe(base32["size-13"]);
    });
  });
});
