import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { transform } from "lightningcss";
import { writeFileSync } from "node:fs";
import { luz, type LuzConfig } from "../luz";
import { base } from "../tools/base";

/** `LuzConfig` with `path` required — only the Astro adapter writes a file. */
export type LuzAstroConfig = LuzConfig & { path: string };

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

    const transformed = transform({
      filename: outputPath,
      code: Buffer.from(cssContent),
      minify: isMinified,
      sourceMap: false,
    });

    if (!transformed.code) {
      return logger.error("Failed to transform CSS content.");
    }
    writeFileSync(outputPath, transformed.code, {
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
