import { luz, type LuzConfig } from "../luz";
import { reset } from "../tools/reset";
import { setup } from "../tools/setup";
import { base } from "../tools/base";
import { writeFileSync } from "node:fs";
import { transform } from "lightningcss";
import type { AstroIntegration, AstroIntegrationLogger } from "astro";

export const luzAstro = (config: LuzConfig): AstroIntegration => {
  const generateFile = (logger: AstroIntegrationLogger) => {
    const { variables, tokens, propierties } = luz(config);
    const cssContent = `
      ${propierties}
      ${reset()}
      ${setup(tokens)}
      :root {
        ${variables}
      }
      ${base(tokens)}
    `;
    const outputPath = config.path;
    if (!outputPath) {
      return logger.error(
        "A path in config luz must be provided for the static generation",
      );
    }
    let transformed = transform({
      filename: outputPath,
      code: Buffer.from(cssContent),
      minify: true,
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
