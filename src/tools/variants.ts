/**
 * Closed registry of utility-class variant prefixes (`open:`, `hover:`, …)
 * mapped to real CSS selector fragments. The `data-*` names come straight
 * from `@base-ui/react`'s own components (grepped from
 * `node_modules/@base-ui/react/**\/*.js` — not guessed), so a variant class
 * like `open:bg-primary-600` lines up with the attribute Base UI actually
 * sets on an open popover/dialog/etc.
 *
 * Closed vocabulary: there is no fallback or arbitrary-variant escape hatch
 * (no `data-[state=open]:` support) — an unknown variant name simply has no
 * entry here, and callers must treat that as unresolved.
 */
export const VARIANTS: Record<string, string> = {
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
  // Plain pseudo-classes, not Base UI data attributes — `:focus-visible`
  // (not `:focus`) so keyboard-only focus styling matches Base UI's own
  // focus-ring conventions instead of firing on every mouse click too.
  hover: ":hover",
  focus: ":focus-visible",
};

/**
 * Resolves a variant name to its selector fragment, or `undefined` if it's
 * not in the closed registry — closed vocabulary, no fallback.
 */
export function resolveVariant(name: string): string | undefined {
  return VARIANTS[name];
}
