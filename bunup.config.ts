import { defineConfig } from "bunup";
import { copy, exports, unused } from "bunup/plugins";

const staticCss = ["reset.css", "design.css"];

export default defineConfig({
  plugins: [
    copy(staticCss.map((name) => `src/tools/${name}`)).to("."),
    exports({
      customExports: () =>
        Object.fromEntries(
          staticCss.map((name) => [`./${name}`, `./dist/${name}`]),
        ),
    }),
    unused(),
  ],
  entry: ["src/index.ts", "src/astro/index.ts", "src/vite/index.ts"],
  format: ["esm"],
  jsx: {
    development: false,
  },
  unused: true,
  minify: true,
});
