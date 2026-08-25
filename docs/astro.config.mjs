// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig, fontProviders } from "astro/config";
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
  // DM Sans (font/font-headings) + DM Mono (font-monospace) — the CSS
  // variable names here must match luz.config.mjs's `var(--dm-sans)` /
  // `var(--dm-mono)` and Layout.astro's <Font cssVariable> tags exactly.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "DM Sans",
      cssVariable: "--dm-sans",
      weights: [400, 500, 600, 700],
    },
    {
      provider: fontProviders.google(),
      name: "DM Mono",
      cssVariable: "--dm-mono",
      weights: [400, 500],
    },
  ],
});
