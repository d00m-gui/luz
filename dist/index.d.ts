interface DefaultTheme {
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
	mode: "light" | "dark";
	neutrals?: string | "grey" | "gray" | "neutral";
	prefix?: string;
	transition?: string;
	"box-shadow"?: string;
	"scale-factor"?: number;
	spacing?: string;
}
declare function luzGenerator(tokens?: DefaultTheme): any;
declare function luz(tokens?: DefaultTheme): void;
export { luzGenerator, luz, DefaultTheme };
