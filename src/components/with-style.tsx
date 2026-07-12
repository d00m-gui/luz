import { forwardRef } from "react";
import { componentCSS } from "../tools/base";
import { useLuzTokens } from "../react/context";

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
    const tokens = useLuzTokens();
    const v = {
      neutral: `${tokens.settings.prefix}${tokens.settings.neutrals}`,
      primary: `${tokens.settings.prefix}${tokens.settings.name}`,
    };

    return (
      <>
        <style href={name} precedence="luz-component">
          {componentCSS[name](v)}
        </style>
        <Component {...(props as P)} ref={ref as never} />
      </>
    );
  });
  Styled.displayName = `Luz(${name})`;
  return Styled;
}
