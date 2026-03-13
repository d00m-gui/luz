import { luz } from "../luz";
import { reset } from "../tools/reset";
import { setup } from "../tools/setup";
import { base } from "../tools/base";
import { formatCSS } from "../tools/format";
import { writeFileSync } from "node:fs";

export const luzAstro = (config: any) => {
	return {
		name: "luz",
		hooks: {
			"astro:server:setup": (): void | Promise<void> => {
				const { variables, tokens } = luz(config);
				const cssContent = `
						${reset()}
						${setup(tokens)}
						:root {
							${variables}
						}
						${base(tokens)}
						`;
				const minCSS = formatCSS(cssContent);
				const outputPath = "./src/styles/luz.css";

				writeFileSync(outputPath, minCSS, {
					encoding: "utf-8",
				});
				console.log(`[luz] CSS created @ '${outputPath}'`);
			},
		},
	};
};
