import type { BunPlugin } from "bun";
import { transform } from "lightningcss";

const TEMPLATE_CONST = /(export\s+)?const\s+(\w+)\s*=\s*`([\s\S]*?)`;/g;

/**
 * `src/tools/reset.ts` and `src/tools/base.ts` embed CSS as plain template
 * literal constants. They're fully static (no `${}` interpolation — dynamic
 * neutral/primary bucket names in `base.ts` are written as literal
 * placeholder tokens and substituted at render time), so Bun's JS minifier
 * ships them verbatim: it never touches string *content*, only surrounding
 * code. This plugin runs each one through lightningcss — a real CSS
 * minifier, safe to use here because it only executes in this Node build
 * process, never in the shipped browser bundle — before Bun compiles the
 * file. Any const whose body still contains `${` (a genuinely dynamic
 * template) is left untouched.
 */
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
