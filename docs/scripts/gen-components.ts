import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "lightningcss";
import yaml from "js-yaml";

/** Reset-only/structural tags with no meaningful standalone demo — kept in sync with `src/content/components.ts`. */
const EXEMPT_ELEMENTS = [
  "html",
  "body",
  "svg",
  "canvas",
  "img",
  "picture",
  "video",
  "br",
  "section",
  "q",
  "address",
  "figure",
  "optgroup",
];

const TOOLS_DIR = fileURLToPath(new URL("../../src/tools", import.meta.url));
const OUT_FILE = fileURLToPath(
  new URL("../src/content/components.generated.ts", import.meta.url),
);
const COMPONENTS_DIR = fileURLToPath(
  new URL("../src/content/components/", import.meta.url),
);

/** Old enough that lightningcss can't rely on native CSS nesting — forces it to flatten `&` into plain selectors. */
const FLATTEN_TARGETS = { chrome: 1 << 16 };

function listImports(manifestPath: string): string[] {
  const css = readFileSync(manifestPath, "utf8");
  return [...css.matchAll(/^@import\s+"(.+?)";$/gm)].map((m) =>
    join(dirname(manifestPath), m[1]!),
  );
}

/** Splits `text` on top-level `sep` occurrences, ignoring ones inside `()`/`[]` (e.g. `:not(a, button)`). */
function splitTopLevel(text: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of text) {
    if (char === "(" || char === "[") depth++;
    else if (char === ")" || char === "]") depth--;
    if (char === sep && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts;
}

type Segment =
  | { kind: "decl"; text: string }
  | { kind: "block"; header: string; body: string; isAtRule: boolean };

/** Splits a CSS body into top-level declarations and `{ header, body }` blocks, in source order, ignoring `;`/`{` inside `()`/`[]`. */
function splitSegments(css: string): Segment[] {
  const segments: Segment[] = [];
  let parenDepth = 0;
  let start = 0;
  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    if (char === "(" || char === "[") parenDepth++;
    else if (char === ")" || char === "]") parenDepth--;
    else if (parenDepth === 0 && char === ";") {
      segments.push({ kind: "decl", text: css.slice(start, i + 1) });
      start = i + 1;
    } else if (parenDepth === 0 && char === "{") {
      const header = css.slice(start, i).trim();
      let depth = 1;
      let j = i + 1;
      while (depth > 0 && j < css.length) {
        if (css[j] === "{") depth++;
        else if (css[j] === "}") depth--;
        j++;
      }
      const body = css.slice(i + 1, j - 1);
      if (header)
        segments.push({
          header,
          body,
          isAtRule: header.startsWith("@"),
          kind: "block",
        });
      start = j;
      i = j - 1;
    }
  }
  return segments;
}

/** Rewrites every non-`&`, non-at-rule selector list to just its first alternative, so lightningcss's `&` flatten doesn't multiply across component aliases (`.btn, .button, [role="button"], ...`). */
function trimToPrimarySelector(css: string): string {
  return splitSegments(css)
    .map((seg) => {
      if (seg.kind === "decl") return seg.text;
      const inner = trimToPrimarySelector(seg.body);
      if (seg.isAtRule || seg.header.includes("&"))
        return `${seg.header} { ${inner} }`;
      const primary = splitTopLevel(seg.header, ",")[0]!.trim();
      return `${primary} { ${inner} }`;
    })
    .join("\n");
}

function flatten(css: string): string {
  return transform({
    filename: "component.css",
    code: Buffer.from(css),
    targets: FLATTEN_TARGETS,
    minify: false,
  }).code.toString();
}

/** Walks flattened (non-nested) CSS collecting every resolved selector, recursing into `@media`/`@supports` but skipping `@keyframes`. */
function collectSelectors(css: string, out: Set<string>): void {
  for (const seg of splitSegments(css)) {
    if (seg.kind !== "block") continue;
    if (seg.isAtRule) {
      if (!seg.header.startsWith("@keyframes")) collectSelectors(seg.body, out);
      continue;
    }
    for (const selector of splitTopLevel(seg.header, ",")) {
      const trimmed = selector.trim();
      if (trimmed) out.add(trimmed);
    }
  }
}

/** Bare class names, leading tag names, and `[attr="value"]`/`[attr]` tokens referenced by `selectors` — the vocabulary `covers` in components.ts matches against. */
function bareTokens(selectors: string[]): {
  classes: string[];
  elements: string[];
  attrs: string[];
} {
  const classes = new Set<string>();
  const elements = new Set<string>();
  const attrs = new Set<string>();
  for (const selector of selectors) {
    for (const match of selector.matchAll(/\.([a-zA-Z][\w-]*)/g))
      classes.add(match[1]!);
    const tag = selector.match(/^([a-zA-Z][a-zA-Z0-9]*)/);
    if (tag) elements.add(tag[1]!);
    for (const match of selector.matchAll(
      /\[([\w-]+)(?:[~|^$*]?=["']?([\w-]+)["']?)?\]/g,
    )) {
      attrs.add(match[2] ?? match[1]!);
    }
  }
  return {
    classes: [...classes].sort(),
    elements: [...elements].sort(),
    attrs: [...attrs].sort(),
  };
}

interface DesignFile {
  file: string;
  selectors: string[];
  classes: string[];
  elements: string[];
  attrs: string[];
}

function processCss(css: string): {
  selectors: string[];
  classes: string[];
  elements: string[];
  attrs: string[];
} {
  const flat = flatten(trimToPrimarySelector(css));
  const selectors = new Set<string>();
  collectSelectors(flat, selectors);
  const sorted = [...selectors].sort();
  return { selectors: sorted, ...bareTokens(sorted) };
}

const resetFile = join(TOOLS_DIR, "reset.css");
const resetResult = processCss(readFileSync(resetFile, "utf8"));

const designFiles: DesignFile[] = listImports(join(TOOLS_DIR, "design.css"))
  .filter((path) => !basename(path).startsWith("_"))
  .map((path) => ({
    file: basename(path, ".css"),
    ...processCss(readFileSync(path, "utf8")),
  }));

const allClasses = new Set(resetResult.classes);
const allElements = new Set(resetResult.elements);
const allAttrs = new Set(resetResult.attrs);
for (const f of designFiles) {
  f.classes.forEach((c) => allClasses.add(c));
  f.elements.forEach((e) => allElements.add(e));
  f.attrs.forEach((a) => allAttrs.add(a));
}
const DESIGN_CLASSES = [...allClasses].sort();
const DESIGN_ELEMENTS = [...allElements].sort();
const DESIGN_ATTRS = [...allAttrs].sort();

writeFileSync(
  OUT_FILE,
  `// Generado por \`bun run gen:components\` desde src/tools/{reset,design}.css. No editar a mano.

export interface DesignFile {
  file: string;
  selectors: readonly string[];
  classes: readonly string[];
  elements: readonly string[];
  attrs: readonly string[];
}

export const DESIGN_FILES: readonly DesignFile[] = ${JSON.stringify(designFiles, null, 2)};
export const DESIGN_CLASSES: readonly string[] = ${JSON.stringify(DESIGN_CLASSES, null, 2)};
export const DESIGN_ELEMENTS: readonly string[] = ${JSON.stringify(DESIGN_ELEMENTS, null, 2)};
export const DESIGN_ATTRS: readonly string[] = ${JSON.stringify(DESIGN_ATTRS, null, 2)};
`,
);

console.log(
  `generated ${OUT_FILE} (${designFiles.length} componentes, ${DESIGN_CLASSES.length} clases, ${DESIGN_ELEMENTS.length} tags, ${DESIGN_ATTRS.length} attrs)`,
);

function titleize(file: string): string {
  return file
    .split(/[-_]/)
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join(" ");
}

const covered = new Set<string>();
for (const name of readdirSync(COMPONENTS_DIR)) {
  if (!name.endsWith(".md")) continue;
  const raw = readFileSync(join(COMPONENTS_DIR, name), "utf8");
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;
  const data = yaml.load(fm[1]!) as { covers?: string[] };
  data.covers?.forEach((c) => covered.add(c));
}

const stubs: string[] = [];
for (const f of designFiles) {
  const tokens = [...f.classes, ...f.elements, ...f.attrs];
  if (tokens.length > 0 && tokens.every((t) => EXEMPT_ELEMENTS.includes(t)))
    continue;
  if (tokens.some((t) => covered.has(t))) continue;
  const outPath = join(COMPONENTS_DIR, `${f.file}.md`);
  if (existsSync(outPath)) continue;
  const frontmatter = yaml.dump(
    {
      title: titleize(f.file),
      category: "Primitives",
      covers: [f.file],
      wip: true,
    },
    { lineWidth: -1 },
  );
  writeFileSync(
    outPath,
    `---\n${frontmatter}---\n<!-- TODO: ejemplo de .${f.file} -->\n`,
  );
  stubs.push(outPath);
}
if (stubs.length > 0) {
  console.log(
    `generated ${stubs.length} doc stub(s) sin ejemplo:\n${stubs.join("\n")}`,
  );
}
