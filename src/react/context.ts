import { createContext, useContext } from "react";
import type { LuzTokens } from "../luz";

/** Holds the tokens produced by `luz(config)` for the subtree rendered inside `<LuzReact>`. */
export const LuzTokensContext = createContext<LuzTokens | null>(null);

/** Reads the current `LuzTokens` from context. Throws if used outside `<LuzReact>`. */
export function useLuzTokens(): LuzTokens {
  const tokens = useContext(LuzTokensContext);
  if (!tokens) {
    throw new Error(
      "luz: components from `lui` must be rendered inside <LuzReact config={...}>.",
    );
  }
  return tokens;
}
