// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { luzAstro } from "../src/astro/index.ts";
import { config } from "./luz.config.mjs";

// Written to `public/` so Astro serves it as a plain static file — dogfoods
// the same `luzAstro` other consumers get, generating the classless reset +
// shadcn token bridge + scanned utility classes for the docs site itself.
// Reuses the same `config` kitchen-sink.astro renders its token tables
// from, rather than the separate, deliberately-reduced `docsRuntimeConfig`
// (that one's for the React islands' live `setPrimary`/`setMode` overrides —
// see its own doc comment — not the site's static baseline theme).
const luzCssPath = fileURLToPath(new URL("./public/luz.css", import.meta.url));

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
  integrations: [
    react(),
    rawMdxEntries(),
    luzAstro({ ...config, path: luzCssPath }),
  ],
});
