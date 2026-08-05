import { AstroIntegration } from "astro";
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
/** `LuzConfig` with `path` required — only the Astro adapter writes a file. */
type LuzAstroConfig = LuzConfig & {
	path: string;
};
declare const luzAstro: (config: LuzAstroConfig) => AstroIntegration;
export { luzAstro, LuzAstroConfig };
