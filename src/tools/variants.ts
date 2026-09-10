import { DEFAULT_BREAKPOINTS } from "./breakpoints";

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
  hover: ":hover",
  focus: ":focus-visible",
};

const ARBITRARY_ATTR_RE =
  /^(data|aria)-\[([a-zA-Z0-9_-]+)(?:=['"]?([a-zA-Z0-9_-]+)['"]?)?\]$/;

export function resolveVariant(name: string): string | undefined {
  const fixed = VARIANTS[name];
  if (fixed !== undefined) return fixed;

  const match = name.match(ARBITRARY_ATTR_RE);
  if (!match) return undefined;
  const [, prefix, attr, value] = match;
  return value === undefined
    ? `[${prefix}-${attr}]`
    : `[${prefix}-${attr}="${value}"]`;
}

const BREAKPOINT_NAMES = Object.keys(DEFAULT_BREAKPOINTS);

/** Media queries for `sm:`…`2xl:` then `max-sm:`…`max-2xl:`, in emit order. */
export const MEDIA_VARIANTS: Record<string, string> = Object.fromEntries([
  ...BREAKPOINT_NAMES.map((name) => [
    name,
    `(min-width: ${DEFAULT_BREAKPOINTS[name]}rem)`,
  ]),
  ...BREAKPOINT_NAMES.map((name) => [
    `max-${name}`,
    `(max-width: calc(${DEFAULT_BREAKPOINTS[name]}rem - 0.02rem))`,
  ]),
]);

export const MEDIA_QUERIES: readonly string[] = Object.values(MEDIA_VARIANTS);
