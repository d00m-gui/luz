import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { writeFileSync } from "node:fs";
import { luz, minifyCss, type LuzConfig } from "../luz";
import { base } from "../tools/base";

/** `LuzConfig` with `path` required — only the Astro adapter writes a file. */
export type LuzAstroConfig = LuzConfig & { path: string };

/**
 * Astro integration: on both `astro:build:done` and `astro:server:start`,
 * calls `luz(config)`, composes reset + setup + `:root{variables}` + base
 * CSS, minifies with `lightningcss`, and writes the result to `config.path`
 * (required — throws via the Astro logger if it's missing).
 */
export const luzAstro = (config: LuzAstroConfig): AstroIntegration => {
  const generateFile = (logger: AstroIntegrationLogger) => {
    const { style, tokens } = luz(config);
    const cssContent = `${style}\n${base(tokens)}`;
    const outputPath = config.path;
    const isMinified = config.minify ?? false;
    if (!outputPath) {
      logger.error(
        "A path in config luz must be provided for the static generation",
      );
      throw new Error("luzAstro: `path` is required in config");
    }

    const output = isMinified ? minifyCss(cssContent) : cssContent;
    writeFileSync(outputPath, output, {
      encoding: "utf-8",
    });
    logger.info(`Static CSS generated @ ${outputPath}`);
  };

  return {
    name: "luz",
    hooks: {
      "astro:build:done": ({ logger }): void | Promise<void> => {
        generateFile(logger);
      },
      "astro:server:start": ({ logger }): void | Promise<void> => {
        generateFile(logger);
      },
    },
  };
};
