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
    expect(Object.keys(sizes)).toHaveLength(27);
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
});
