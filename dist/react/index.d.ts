/**
* Full configuration for the `luz()` function.
*/
interface LuzConfig {
	font?: string;
	"line-height"?: string;
	"font-bold-weight"?: number;
	"font-weight"?: number;
	"font-monospace"?: string;
	"font-headings"?: string;
	"font-emphasis"?: string;
	base?: number;
	power?: number;
	primary: string;
	name?: string;
	secondary?: string;
	mode?: "light" | "dark" | "auto";
	neutrals?: string;
	prefix?: string;
	transition?: string;
	"box-shadow"?: string;
	spacing?: string;
	background?: string;
	foreground?: string;
	minify?: boolean;
}
/** Settings sub-object within tokens (metadata only). */
interface TokenSettings {
	name: string;
	prefix?: string;
	neutrals?: string;
}
/** Full token set used by all downstream consumers. */
interface LuzTokens {
	settings: TokenSettings;
	colors: Record<string, string>;
	/** Generated size variable map (`--size-1` → `0.1rem`, etc.). */
	sizes: Record<string, string>;
	typography: Partial<LuzConfig>;
}
/** Live theme handle: current tokens plus setters that trigger a re-render inside `<LuzReact>`. */
interface LuzTheme {
	tokens: LuzTokens;
	setPrimary(primary: string): void;
	setMode(mode: NonNullable<LuzConfig["mode"]>): void;
}
/** Reads the current `LuzTheme` from context. Throws if used outside `<LuzReact>`. */
declare function useTheme(): LuzTheme;
declare function LuzReact({ config, children }: {
	config: LuzConfig;
	children?: React.ReactNode;
}): React.ReactNode;
export { useTheme, LuzTheme, LuzReact };
