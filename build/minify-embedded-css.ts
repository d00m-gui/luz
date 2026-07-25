import type { BunPlugin } from "bun";
import { transform } from "lightningcss";
const TEMPLATE_CONST = /(export\s+)?const\s+(\w+)\s*=\s*`([\s\S]*?)`;/g;
export function minifyEmbeddedCss(): BunPlugin {
  return {
    name: "minify-embedded-css",
    setup(build) {
      build.onLoad({ filter: /tools[\\/](reset|base)\.ts$/ }, async (args) => {
        const source = await Bun.file(args.path).text();
        const contents = source.replace(
          TEMPLATE_CONST,
          (full: string, exportKeyword = "", name: string, css: string) => {
            if (css.includes("${")) return full;
            const minified = transform({
              filename: `${name}.css`,
              code: Buffer.from(css),
              minify: true,
            }).code.toString();
            return `${exportKeyword}const ${name} = \`${minified}\`;`;
          },
        );

        return { contents, loader: "ts" };
      });
    },
  };
}
