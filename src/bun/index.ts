import type { BunPlugin } from "bun";
import { luz } from "../luz";
import { setup } from "../tools/setup";
import { base } from "../tools/base";
import { formatCSS } from "../tools/format";
import { reset } from "../tools/reset";

export const luzPlugin = (config: any): BunPlugin => {
	const { variables, tokens } = luz(config);
	let path = config.path ?? "./";
	return {
		name: "luz",
		setup(build) {
			build.onEnd(async () => {
				const cssContent = `
					${reset()}
					${setup(tokens)}
					:root {
						${variables}
					}
					${base(tokens)}`;
				const minCSS = formatCSS(cssContent);
				const outputPath = `${path}/luz.css`;
				await Bun.write(outputPath, minCSS);
				console.log(`[luz] CSS created @ '${outputPath}'`);
			});
		},
	};
};
