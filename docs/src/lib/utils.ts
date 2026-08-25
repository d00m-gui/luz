// Simplified stand-in for shadcn's usual `cn()` (normally `clsx` +
// `tailwind-merge`). luz's utility engine has a closed, non-conflicting
// class vocabulary — there's no Tailwind-style "later class wins on the same
// CSS property" ambiguity to resolve — so a plain filter+join is sufficient
// and keeps `clsx`/`tailwind-merge` out of the dependency tree entirely.
//
// Parameter type is deliberately `unknown[]`, not `Array<string | false |
// null | undefined>`: several `@base-ui/react` primitives type their own
// `className` prop as `string | ((state) => string | undefined) |
// undefined` (a render-prop form for state-driven classNames) — this
// component set never actually passes a function through, but a destructured
// `className` forwarded straight into `cn(base, className)` still carries
// that wider prop type, so `cn` has to accept it. Anything that isn't a
// non-empty string (including a stray function) is just filtered out.
export function cn(...classes: unknown[]): string {
  return classes.filter((c): c is string => typeof c === "string" && c.length > 0).join(" ");
}
