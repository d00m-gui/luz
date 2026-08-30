import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SRC_FILE = fileURLToPath(
  new URL("../../src/tools/design.css", import.meta.url),
);
const OUT_FILE = fileURLToPath(
  new URL("../src/content/components.generated.ts", import.meta.url),
);

/** Top-level class selectors declared in `design.css` (excludes `&`-nested modifiers, attribute/pseudo selectors). */
function extractClasses(css: string): string[] {
  const classes = new Set<string>();
  for (const line of css.split("\n")) {
    if (/^\s/.test(line)) continue;
    const selector = line.split("{")[0] ?? "";
    for (const match of selector.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
      classes.add(match[1]!);
    }
  }
  return [...classes].sort();
}

const classes = extractClasses(readFileSync(SRC_FILE, "utf-8"));

writeFileSync(
  OUT_FILE,
  `// Generado por \`bun run gen:components\` desde src/tools/design.css. No editar a mano.
export const DESIGN_CLASSES: readonly string[] = ${JSON.stringify(classes, null, 2)};
`,
);

console.log(`generated ${OUT_FILE} (${classes.length} clases)`);
