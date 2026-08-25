import { describe, expect, test } from "bun:test";
import { resolveVariant, VARIANTS } from "../src/tools/variants";

// The full closed vocabulary — one entry per real @base-ui/react `data-*`
// attribute (grepped from node_modules/@base-ui/react), plus the two plain
// pseudo-class variants.
const DATA_ATTR_VARIANTS: Record<string, string> = {
  open: "[data-open]",
  closed: "[data-closed]",
  disabled: "[data-disabled]",
  checked: "[data-checked]",
  unchecked: "[data-unchecked]",
  indeterminate: "[data-indeterminate]",
  highlighted: "[data-highlighted]",
  pressed: "[data-pressed]",
  active: "[data-active]",
  selected: "[data-selected]",
  expanded: "[data-expanded]",
  invalid: "[data-invalid]",
  valid: "[data-valid]",
  required: "[data-required]",
  readonly: "[data-readonly]",
  starting: "[data-starting-style]",
  ending: "[data-ending-style]",
};

describe("VARIANTS registry", () => {
  test("maps every data-attribute variant name to its real Base UI selector", () => {
    for (const [name, selector] of Object.entries(DATA_ATTR_VARIANTS)) {
      expect(VARIANTS[name]).toBe(selector);
    }
  });

  test("maps hover/focus to plain pseudo-classes, not data attributes", () => {
    expect(VARIANTS.hover).toBe(":hover");
    // :focus-visible, not :focus — matches Base UI's own keyboard-only
    // focus-ring convention instead of firing on every mouse click too.
    expect(VARIANTS.focus).toBe(":focus-visible");
  });

  test("is a closed vocabulary with exactly the documented 19 entries", () => {
    expect(Object.keys(VARIANTS)).toHaveLength(
      Object.keys(DATA_ATTR_VARIANTS).length + 2,
    );
  });
});

describe("resolveVariant()", () => {
  test("resolves a known variant name to its selector fragment", () => {
    expect(resolveVariant("open")).toBe("[data-open]");
    expect(resolveVariant("hover")).toBe(":hover");
  });

  test("returns undefined for an unknown variant — no fallback, no arbitrary variants", () => {
    expect(resolveVariant("dark")).toBeUndefined();
    expect(resolveVariant("data-[state=open]")).toBeUndefined();
    expect(resolveVariant("")).toBeUndefined();
  });
});
