import { luz } from "../luz";
import { reset } from "../tools/reset";
import { setup } from "../tools/setup";
import { base } from "../tools/base";
import { writeFileSync } from "node:fs";
import type { AstroIntegration, AstroIntegrationLogger } from "astro";

export const luzAstro = (config: any): AstroIntegration => {
  const generateFile = (logger: AstroIntegrationLogger) => {
    const { variables, tokens } = luz(config);
    const cssContent = `
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
    writeFileSync(outputPath, cssContent, {
      encoding: "utf-8",
    });
    logger.info(`[luz] CSS created @ '${outputPath}'`);
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
