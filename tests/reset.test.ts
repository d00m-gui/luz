import { describe, expect, test } from "bun:test";
import { reset } from "../src/tools/reset";

describe("reset", () => {
  // Regression: `html, body { font-size: 62.5%; }` used to force the real
  // root font-size to 10px regardless of `base`, while every dynamically
  // generated token (`size-N`, `space-N`, `border-radius`, …) computes its
  // rem values assuming a standard 1rem≈base(px) — a systemic ~1.6x
  // mismatch between what the tokens claim and what actually rendered.
  test("does not force a 62.5% root font-size — rem tokens render at their real computed size", () => {
    expect(reset).not.toContain("62.5%");
  });

  // The handful of literal (non-`var()`) rem values in this file were all
  // calibrated for the old 10px-per-rem convention — converted to their
  // real intended size (font-size stays rem at the new 1rem≈16px basis,
  // everything else became a literal px). Spot-check a few landmarks
  // rather than the whole file.
  test("literal font-size values are 1rem, not the old 1.6rem (10px-rem) convention", () => {
    expect(reset).toContain("font-size: 1rem;");
    expect(reset).not.toContain("1.6rem");
  });

  test("decorative literal dimensions converted to px, not left as stale small rem fractions", () => {
    expect(reset).toContain("height: 1px;"); // hr
    expect(reset).not.toContain("0.1rem");
  });
});
