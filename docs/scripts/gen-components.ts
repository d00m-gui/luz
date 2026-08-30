import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SRC_FILES = ["reset.css", "structure.css", "design.css"].map((f) =>
  fileURLToPath(new URL(`../../src/tools/${f}`, import.meta.url)),
);
const OUT_FILE = fileURLToPath(
  new URL("../src/content/components.generated.ts", import.meta.url),
);

/** Class names and bare tag selectors declared top-level across luz's 3 CSS layers (excludes `&`-nested modifiers). */
function extractSelectors(css: string): { classes: string[]; elements: string[] } {
  const classes = new Set<string>();
  const elements = new Set<string>();
  for (const line of css.split("\n")) {
    if (/^\s/.test(line)) continue;
    const selectorLine = line.split("{")[0] ?? "";
    for (const part of selectorLine.split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      for (const match of trimmed.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
        classes.add(match[1]!);
      }
      const tag = trimmed.match(/^([a-zA-Z][a-zA-Z0-9]*)/);
      if (tag) elements.add(tag[1]!);
    }
  }
  return { classes: [...classes].sort(), elements: [...elements].sort() };
}

const merged = { classes: new Set<string>(), elements: new Set<string>() };
for (const file of SRC_FILES) {
  const { classes, elements } = extractSelectors(readFileSync(file, "utf-8"));
  classes.forEach((c) => merged.classes.add(c));
  elements.forEach((e) => merged.elements.add(e));
}

const DESIGN_CLASSES = [...merged.classes].sort();
const DESIGN_ELEMENTS = [...merged.elements].sort();

writeFileSync(
  OUT_FILE,
  `// Generado por \`bun run gen:components\` desde src/tools/{reset,structure,design}.css. No editar a mano.
export const DESIGN_CLASSES: readonly string[] = ${JSON.stringify(DESIGN_CLASSES, null, 2)};
export const DESIGN_ELEMENTS: readonly string[] = ${JSON.stringify(DESIGN_ELEMENTS, null, 2)};
`,
);

console.log(
  `generated ${OUT_FILE} (${DESIGN_CLASSES.length} clases, ${DESIGN_ELEMENTS.length} tags)`,
);
