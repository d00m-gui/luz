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
	/** Shade steps generated per color palette. Default `11` (50–950). */
	colorSteps?: number;
	/** Total `size-N` tokens generated. Default `22`. */
	sizeSteps?: number;
	/** First `size-N` step that uses the fluid `clamp()` zone. Default `13`. */
	sizeDynamicFrom?: number;
	/** Scale the size ramp by `base / 16` instead of a fixed 16px assumption. Default `false`. */
	sizeRelativeToBase?: boolean;
}
/** `LuzConfig` with `path` required — only the Astro adapter writes a file. */
type LuzAstroConfig = LuzConfig & {
	path: string;
};
declare const luzAstro: (config: LuzAstroConfig) => AstroIntegration;
export { luzAstro, LuzAstroConfig };
