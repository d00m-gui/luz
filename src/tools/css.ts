import { luz, type LuzConfig } from "../luz";
import { scanSources } from "./scan";
import { shadcnBridgeCSS } from "./shadcn-bridge";
import { emitUtilitiesCSS } from "./utilities";

export interface CssSections {
  reset: string;
  theme: string;
  bridge: string;
  utilities: string;
}

/** Runs `luz()`, the shadcn bridge and the utility scan over `root`. */
export function buildCssSections(config: LuzConfig, root: string): CssSections {
  const { reset, theme, tokens } = luz(config);
  return {
    reset,
    theme,
    bridge: shadcnBridgeCSS(tokens),
    utilities: emitUtilitiesCSS(scanSources(root).candidates, tokens),
  };
}

export function composeCss(sections: CssSections): string {
  return `${sections.reset}\n${sections.theme}\n${sections.bridge}\n${sections.utilities}`;
}

/** Sections the `@luz <section>;` directive can expand to. */
export type LuzSection = "theme" | "bridge" | "utilities";

export interface ExpandedCss {
  code: string;
  sections: Set<LuzSection>;
}

const PACKAGE_CSS = "@d00m-gui/luz/";

const ENTRY_IMPORT_RE =
  /@import\s+(?:url\(\s*)?(["'])@d00m-gui\/luz\/(luz|theme|bridge|utilities)\.css\1\s*\)?(?:\s+layer\(([^)]*)\))?\s*;/g;

const DIRECTIVE_RE = /@luz\s+(theme|bridge|utilities)\s*;/g;

const STATEMENT_AT_RULES: Record<string, true> = {
  import: true,
  charset: true,
  layer: true,
};

const ENTRY_SECTIONS: readonly LuzSection[] = ["theme", "bridge", "utilities"];

function skipString(code: string, from: number): number {
  const quote = code[from];
  for (let i = from + 1; i < code.length; i++) {
    const c = code[i];
    if (c === "\\") i++;
    else if (c === quote) return i + 1;
  }
  return code.length;
}

function skipComment(code: string, from: number): number {
  const end = code.indexOf("*/", from + 2);
  return end === -1 ? code.length : end + 2;
}

const AT_RULE_NAME_RE = /@([\w-]+)/y;

/** Index right after the terminating `;` or at the opening `{` of the at-rule starting at `from`. */
function atRuleEnd(code: string, from: number): number {
  let parens = 0;
  let i = from;
  while (i < code.length) {
    const c = code[i];
    if (c === '"' || c === "'") {
      i = skipString(code, i);
      continue;
    }
    if (c === "/" && code[i + 1] === "*") {
      i = skipComment(code, i);
      continue;
    }
    if (c === "(") parens++;
    else if (c === ")") parens--;
    else if (parens === 0) {
      if (c === "{") return i;
      if (c === ";") return i + 1;
    }
    i++;
  }
  return code.length;
}

/** Offset right after the last top-level `@import`/`@charset`/`@layer …;` statement, or 0. */
function statementInsertOffset(code: string): number {
  let depth = 0;
  let offset = 0;
  let i = 0;
  while (i < code.length) {
    const c = code[i];
    if (c === '"' || c === "'") {
      i = skipString(code, i);
      continue;
    }
    if (c === "/" && code[i + 1] === "*") {
      i = skipComment(code, i);
      continue;
    }
    if (c === "@" && depth === 0) {
      AT_RULE_NAME_RE.lastIndex = i;
      const name = AT_RULE_NAME_RE.exec(code)?.[1] ?? "";
      const end = atRuleEnd(code, i);
      if (code[end - 1] === ";" && STATEMENT_AT_RULES[name] === true)
        offset = end;
      i = end;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") depth--;
    i++;
  }
  return offset;
}

function directive(section: LuzSection, layer: string | undefined): string {
  const rule = `@luz ${section};`;
  return layer === undefined ? rule : `@layer ${layer} {\n${rule}\n}`;
}

/** Expands `@d00m-gui/luz` entry imports and `@luz <section>;` directives in `code`. `undefined` when nothing matched. */
export function expandLuzCss(
  code: string,
  provide: (section: LuzSection) => string,
): ExpandedCss | undefined {
  if (!code.includes(PACKAGE_CSS) && !code.includes("@luz ")) return undefined;

  const queued: string[] = [];
  let source = code.replace(
    ENTRY_IMPORT_RE,
    (_match, _quote, entry: string, layer: string | undefined) => {
      if (entry === "luz") {
        for (const section of ENTRY_SECTIONS)
          queued.push(directive(section, layer));
        const suffix = layer === undefined ? "" : ` layer(${layer})`;
        return `@import "${PACKAGE_CSS}reset.css"${suffix};\n@import "${PACKAGE_CSS}components.css"${suffix};`;
      }
      queued.push(directive(entry as LuzSection, layer));
      return "";
    },
  );

  if (queued.length > 0) {
    const at = statementInsertOffset(source);
    const block = `${queued.join("\n")}\n`;
    source =
      at === 0
        ? block + source
        : `${source.slice(0, at)}\n${block}${source.slice(at)}`;
  }

  const sections = new Set<LuzSection>();
  source = source.replace(DIRECTIVE_RE, (_match, section: LuzSection) => {
    sections.add(section);
    return provide(section);
  });

  return sections.size === 0 ? undefined : { code: source, sections };
}
