import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as wawoff2 from "wawoff2";

const GLYPHNAMES_URL =
  "https://raw.githubusercontent.com/ryanoasis/nerd-fonts/master/glyphnames.json";
const FONT_ZIP_URL =
  "https://github.com/ryanoasis/nerd-fonts/releases/latest/download/NerdFontsSymbolsOnly.zip";
const TTF_NAME = "SymbolsNerdFont-Regular.ttf";

const CSS_OUT = fileURLToPath(
  new URL("../src/styles/nerd-icons.generated.css", import.meta.url),
);
const FONT_OUT = fileURLToPath(
  new URL("../public/fonts/nerd-icons.woff2", import.meta.url),
);

const glyphnames: Record<string, { code: string }> = await fetch(
  GLYPHNAMES_URL,
).then((r) => r.json());
delete (glyphnames as Record<string, unknown>).METADATA;

const zipBuffer = await fetch(FONT_ZIP_URL).then((r) => r.arrayBuffer());
const tmpDir = mkdtempSync(join(tmpdir(), "nerd-icons-"));
const zipPath = join(tmpDir, "nf.zip");
writeFileSync(zipPath, new Uint8Array(zipBuffer));
await Bun.spawn(["unzip", "-o", zipPath, TTF_NAME, "-d", tmpDir]).exited;
const ttfBuffer = await Bun.file(join(tmpDir, TTF_NAME)).arrayBuffer();
rmSync(tmpDir, { recursive: true });

const woff2Buffer: Buffer = await wawoff2.compress(new Uint8Array(ttfBuffer));
writeFileSync(FONT_OUT, woff2Buffer);

const rules = Object.entries(glyphnames)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(
    ([name, info]) => `.nf-${name}:before {\n  content: "\\${info.code}";\n}`,
  );

writeFileSync(
  CSS_OUT,
  `/* Generado por \`bun run gen:nerd-icons\` desde ryanoasis/nerd-fonts (NerdFontsSymbolsOnly). No editar a mano. */
@font-face {
  font-family: "NerdFontsSymbols Nerd Font";
  src: url("/fonts/nerd-icons.woff2") format("woff2");
  font-weight: normal;
  font-style: normal;
}
.nf {
  font-family: "NerdFontsSymbols Nerd Font";
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
${rules.join("\n")}
`,
);

console.log(`generated ${CSS_OUT} (${rules.length} icons) and ${FONT_OUT}`);
