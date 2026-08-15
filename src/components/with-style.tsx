import { forwardRef, useMemo } from "react";
import { componentCSS } from "../tools/base";
import { useTheme } from "../react/context";

type ComponentName = keyof typeof componentCSS;

/**
 * Wraps a component so it lazily mounts its own
 * `<style href={name} precedence="component">` tag (deduped by React 19)
 * the first time it renders, instead of shipping every component's CSS
 * up front via the global stylesheet.
 */
export function withComponentStyle<P extends object, R = unknown>(
  name: ComponentName,
  Component: React.ComponentType<P>,
) {
  const Styled = forwardRef<R, P>(function StyledComponent(props, ref) {
    const { tokens } = useTheme();
    const { prefix, neutrals, name: primaryName } = tokens.settings;
    const css = useMemo(
      () =>
        componentCSS[name]({
          neutral: `${prefix}${neutrals}`,
          primary: `${prefix}${primaryName}`,
        }),
      [prefix, neutrals, primaryName],
    );

    return (
      <>
        <style href={name} precedence="luz-component">
          {css}
        </style>
        <Component {...(props as P)} ref={ref as never} />
      </>
    );
  });
  Styled.displayName = `Luz(${name})`;
  return Styled;
}
