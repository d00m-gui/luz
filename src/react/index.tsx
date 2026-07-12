import { luz, type LuzConfig } from "../luz";
import { LuzTokensContext } from "./context";

export function LuzReact({
  config,
  children,
}: {
  config: LuzConfig;
  children?: React.ReactNode;
}): React.ReactNode {
  const { tokens, style } = luz(config);
  return (
    <LuzTokensContext.Provider value={tokens}>
      <style href="luz" precedence="global">
        {style}
      </style>
      {children}
    </LuzTokensContext.Provider>
  );
}
