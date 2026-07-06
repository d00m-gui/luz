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
	mode?: "light" | "dark";
	neutrals?: string;
	prefix?: string;
	transition?: string;
	"box-shadow"?: string;
	spacing?: string;
	path?: string;
}
import { AstroIntegration } from "astro";
declare const luzAstro: (config: LuzConfig) => AstroIntegration;
export { luzAstro };
