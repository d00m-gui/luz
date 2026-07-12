import { luz, type LuzConfig } from "../luz";
import { base } from "../tools/base";
import { writeFileSync } from "node:fs";

import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { LightningParser } from "@/tools/lightningpass";

export const luzAstro = (config: LuzConfig): AstroIntegration => {
  const generateFile = (logger: AstroIntegrationLogger) => {
    const { style, tokens } = luz(config);
    const cssContent = `${style}\n${base(tokens)}`;
    const outputPath = config.path;
    const isMinified = config.minify ?? false;
    if (!outputPath) {
      return logger.error(
        "A path in config luz must be provided for the static generation",
      );
    }

    let transformed = LightningParser({
      path: outputPath,
      code: cssContent,
      minify: isMinified,
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
