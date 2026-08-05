import { useMemo, useState } from "react";
import { luz, type LuzConfig } from "../luz";
import { LuzThemeContext, type LuzTheme } from "./context";

export function LuzReact({
  config,
  children,
}: {
  config: LuzConfig;
  children?: React.ReactNode;
}): React.ReactNode {
  const [override, setOverride] = useState<Partial<LuzConfig>>({});
  const merged = useMemo(
    () => ({ ...config, ...override }),
    [config, override],
  );
  const { tokens, style } = useMemo(() => luz(merged), [merged]);

  const theme: LuzTheme = useMemo(
    () => ({
      tokens,
      setPrimary: (primary: string) =>
        setOverride((current) => ({ ...current, primary })),
      setMode: (mode: NonNullable<LuzConfig["mode"]>) =>
        setOverride((current) => ({ ...current, mode })),
    }),
    [tokens],
  );

  return (
    <LuzThemeContext.Provider value={theme}>
      <style href="luz" precedence="global">
        {style}
      </style>
      {children}
    </LuzThemeContext.Provider>
  );
}

export { useTheme, type LuzTheme } from "./context";
