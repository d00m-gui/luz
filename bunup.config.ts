import { defineConfig } from "bunup";
import { exports, unused } from "bunup/plugins";
import { minifyEmbeddedCss } from "./build/minify-embedded-css";

export default defineConfig({
  exports: true,
  plugins: [minifyEmbeddedCss(), exports(), unused()],
  entry: ["src/index.ts", "src/react/index.tsx", "src/astro/index.ts"],
  format: ["esm"],
  unused: true,
  minify: true,
});
