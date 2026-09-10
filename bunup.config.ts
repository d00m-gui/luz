import { defineConfig } from "bunup";
import { copy, exports, unused } from "bunup/plugins";

const staticCss = [
  "reset.css",
  "components.css",
  "luz.css",
  "theme.css",
  "bridge.css",
  "utilities.css",
];

export default defineConfig({
  plugins: [
    copy(staticCss.map((name) => `src/tools/${name}`)).to("."),
    copy("src/tools/components").to("components"),
    exports({
      customExports: () => ({
        ...Object.fromEntries(
          staticCss.map((name) => [`./${name}`, `./dist/${name}`]),
        ),
        "./components/*": "./dist/components/*",
      }),
    }),
    unused(),
  ],
  entry: [
    "src/index.ts",
    "src/astro/index.ts",
    "src/vite/index.ts",
    "src/color/index.ts",
  ],
  format: ["esm"],
  unused: true,
  minify: true,
});
