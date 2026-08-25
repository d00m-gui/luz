import { forwardRef, useMemo } from "react";
import { useTheme } from "../react/context";
import type { LuzTokens } from "../luz";

/**
 * Wraps a component so it lazily mounts its own
 * `<style href={name} precedence="luz-component">` tag (deduped by React 19)
 * the first time it renders, instead of shipping every component's CSS
 * up front via the global stylesheet.
 *
 * This is a public primitive for authors of npm-*packaged* components who
 * want to ship self-contained, luz-token-styled CSS alongside their
 * component. luz's build-time utility-class scanner walks the consuming
 * project's own source files — it can't see into `node_modules`, so a
 * packaged component can't rely on being picked up by that scan. Wrapping
 * the component in `withComponentStyle` lets it carry its own CSS
 * (referencing luz tokens like `var(--primary-500)`, `var(--size-8)`, etc.)
 * and mount it lazily, deduped across instances by React 19's
 * `<style href precedence>` Resource treatment.
 *
 * `css` can be a static string, or a function of the current `LuzTokens`
 * (read live via `useTheme()`, so it stays correct as theme settings
 * change) for CSS that needs to branch on theme state — e.g. the current
 * primary/neutral color names.
 *
 * @param name - Unique `href` for the mounted `<style>` tag; also used to
 *   dedupe instances of the same styled component across a page.
 * @param css - CSS text, or a function producing it from `LuzTokens`.
 * @param Component - The component to wrap.
 */
export function withComponentStyle<P extends object, R = unknown>(
  name: string,
  css: string | ((tokens: LuzTokens) => string),
  Component: React.ComponentType<P>,
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<R>
> {
  const Styled = forwardRef<R, P>(function StyledComponent(props, ref) {
    const { tokens } = useTheme();
    const resolved = useMemo(
      () => (typeof css === "function" ? css(tokens) : css),
      [css, tokens],
    );

    return (
      <>
        <style href={name} precedence="luz-component">
          {resolved}
        </style>
        <Component {...(props as P)} ref={ref as never} />
      </>
    );
  });
  Styled.displayName = `Luz(${name})`;
  return Styled;
}
