// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { config } from "./luz.config.mjs";
import { luzAstro } from "../src/astro/index.ts";

// Playground sources (docs/src/playgrounds/*.mdx) are raw react-live code,
// not real MDX prose — this registers `.mdx` as a data entry type that hands
// back the file's untouched text as `data.code`, skipping the real MDX
// compiler/render pipeline entirely (it would choke on the JS/JSX-as-code
// these files hold, and we never render them — react-live evals the text).
function rawMdxEntries() {
  return {
    name: "raw-mdx-entries",
    hooks: {
      "astro:config:setup"({ addDataEntryType }) {
        addDataEntryType({
          extensions: [".mdx"],
          getEntryInfo({ contents }) {
            return { data: { code: contents }, rawData: contents };
          },
        });
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [react(), rawMdxEntries(), luzAstro(config)],
});
