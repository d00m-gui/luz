// Extracts JSDoc + prop types straight from the parent repo's source using
// the raw TS Compiler API. Never throws on missing/partial JSDoc — the repo
// is mid-refactor in a parallel branch, so "undocumented" is a valid result,
// not an error.
import ts from "typescript";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "../../../src");

export interface DocTag {
  value: string;
  meaning: string;
}

export interface ParsedDoc {
  description: string;
  default?: string;
  params: DocTag[];
}

export interface ConfigField {
  name: string;
  doc: ParsedDoc;
}

export interface AnnotationEntry {
  id: string;
  title: string;
  category: "Components" | "Hooks" | "Config" | "Astro";
  description: string;
  tags: { default?: string; params?: DocTag[] };
  propsTypeText?: string;
  /** Only populated for the "Config" (LuzConfig) entry. */
  fields?: ConfigField[];
  sourceFile: string;
  sourceLine: number;
}

const NO_DOC: ParsedDoc = { description: "", params: [] };

/** Parses a raw `/** ... *\/` block against luz's `@default`/`@param "value" meaning` convention. */
function parseRawDoc(raw: string): ParsedDoc {
  const lines = raw
    .replace(/^\/\*\*/, "")
    .replace(/\*\/$/, "")
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trimEnd());

  const descLines: string[] = [];
  const params: DocTag[] = [];
  let def: string | undefined;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("@default")) {
      def = trimmed.replace(/^@default\s*/, "").trim();
    } else if (trimmed.startsWith("@param")) {
      const rest = trimmed.replace(/^@param\s*/, "").trim();
      const m = rest.match(/^"([^"]+)"\s*(.*)$/) ?? rest.match(/^(\S+)\s*(.*)$/);
      if (m) params.push({ value: m[1] ?? "", meaning: (m[2] ?? "").trim() });
    } else if (trimmed.length) {
      descLines.push(trimmed);
    }
  }

  return { description: descLines.join(" ").trim(), default: def, params };
}

function getDoc(node: ts.Node): ParsedDoc {
  try {
    const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc);
    if (!docs.length) return NO_DOC;
    // Merge multiple jsDoc blocks if present (rare); last one wins for @default.
    let merged: ParsedDoc = { description: "", params: [] };
    for (const doc of docs) {
      const raw = doc.getText();
      const parsed = parseRawDoc(raw);
      merged = {
        description: [merged.description, parsed.description].filter(Boolean).join(" "),
        default: parsed.default ?? merged.default,
        params: [...merged.params, ...parsed.params],
      };
    }
    return merged;
  } catch {
    return NO_DOC;
  }
}

function loc(sourceFile: ts.SourceFile, node: ts.Node): { file: string; line: number } {
  try {
    const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    return { file: path.relative(SRC, sourceFile.fileName), line: line + 1 };
  } catch {
    return { file: sourceFile.fileName, line: 0 };
  }
}

function typeTextFor(
  checker: ts.TypeChecker,
  node: ts.Node,
  symbol: ts.Symbol | undefined,
): string | undefined {
  if (!symbol) return undefined;
  try {
    const type = checker.getTypeOfSymbolAtLocation(symbol, node);
    const text = checker.typeToString(type, node, ts.TypeFormatFlags.NoTruncation);
    return text.length > 3000 ? `${text.slice(0, 3000)}…` : text;
  } catch {
    return undefined;
  }
}

function findTopLevel(sourceFile: ts.SourceFile, name: string) {
  let fn: ts.FunctionDeclaration | undefined;
  let varDecl: ts.VariableDeclaration | undefined;
  let varStatement: ts.VariableStatement | undefined;
  let iface: ts.InterfaceDeclaration | undefined;

  for (const stmt of sourceFile.statements) {
    if (ts.isFunctionDeclaration(stmt) && stmt.name?.text === name) {
      fn = stmt;
    } else if (ts.isInterfaceDeclaration(stmt) && stmt.name.text === name) {
      iface = stmt;
    } else if (ts.isVariableStatement(stmt)) {
      for (const d of stmt.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.name.text === name) {
          varDecl = d;
          varStatement = stmt;
        }
      }
    }
  }
  return { fn, varDecl, varStatement, iface };
}

export function extractAnnotations(): AnnotationEntry[] {
  const rootNames = [
    "index.ts",
    "react/index.tsx",
    "react/useSound.tsx",
    "react/useScroll.tsx",
    "astro/index.ts",
    "components/index.ts",
    "components/types.ts",
    "luz.ts",
  ].map((f) => path.join(SRC, f));

  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    esModuleInterop: true,
    allowJs: false,
    skipLibCheck: true,
    noEmit: true,
    strict: false,
  };

  const entries: AnnotationEntry[] = [];

  let program: ts.Program;
  let checker: ts.TypeChecker;
  try {
    program = ts.createProgram(rootNames, options);
    checker = program.getTypeChecker();
  } catch {
    // Parent repo mid-refactor could make this unresolvable; return nothing
    // rather than crash the content loader.
    return entries;
  }

  const getSf = (rel: string) => program.getSourceFile(path.join(SRC, rel));

  // --- Components: walk `export const lui = { ... }` in components/index.ts
  const componentsSf = getSf("components/index.ts");
  if (componentsSf) {
    const { varDecl } = findTopLevel(componentsSf, "lui");
    if (varDecl && varDecl.initializer && ts.isObjectLiteralExpression(varDecl.initializer)) {
      for (const prop of varDecl.initializer.properties) {
        if (!ts.isPropertyAssignment(prop)) continue;
        const name = prop.name.getText(componentsSf);
        const doc = getDoc(prop);
        const symbol = checker.getSymbolAtLocation(prop.name);
        const { file, line } = loc(componentsSf, prop);
        entries.push({
          id: name,
          title: name,
          category: "Components",
          description: doc.description || "Sin documentar.",
          tags: { default: doc.default, params: doc.params.length ? doc.params : undefined },
          propsTypeText: typeTextFor(checker, prop, symbol),
          sourceFile: file,
          sourceLine: line,
        });
      }
    }
  }

  // --- Hooks: useLuzSound, useLuzScroll
  const soundSf = getSf("react/useSound.tsx");
  const scrollSf = getSf("react/useScroll.tsx");
  for (const [sf, name] of [
    [soundSf, "useLuzSound"],
    [scrollSf, "useLuzScroll"],
  ] as const) {
    if (!sf) continue;
    const { fn } = findTopLevel(sf, name);
    const doc = fn ? getDoc(fn) : NO_DOC;
    const { file, line } = fn ? loc(sf, fn) : { file: sf.fileName, line: 0 };
    entries.push({
      id: name,
      title: name,
      category: "Hooks",
      description: doc.description || "Sin documentar.",
      tags: { default: doc.default, params: doc.params.length ? doc.params : undefined },
      sourceFile: file,
      sourceLine: line,
    });
  }

  // --- Config: LuzConfig interface + every field
  const luzSf = getSf("luz.ts");
  if (luzSf) {
    const { iface } = findTopLevel(luzSf, "LuzConfig");
    if (iface) {
      const ifaceDoc = getDoc(iface);
      const fields: ConfigField[] = iface.members
        .filter(ts.isPropertySignature)
        .map((member) => ({
          name: member.name.getText(luzSf),
          doc: getDoc(member),
        }));
      const { file, line } = loc(luzSf, iface);
      entries.push({
        id: "luzconfig",
        title: "LuzConfig",
        category: "Config",
        description: ifaceDoc.description || "Sin documentar.",
        tags: {},
        fields,
        sourceFile: file,
        sourceLine: line,
      });
    }
  }

  // --- Astro: luzAstro
  const astroSf = getSf("astro/index.ts");
  if (astroSf) {
    const { varDecl, varStatement } = findTopLevel(astroSf, "luzAstro");
    const docNode = varStatement ?? varDecl;
    const doc = docNode ? getDoc(docNode) : NO_DOC;
    const { file, line } = varDecl
      ? loc(astroSf, varDecl)
      : { file: astroSf.fileName, line: 0 };
    entries.push({
      id: "luzastro",
      title: "luzAstro",
      category: "Astro",
      description: doc.description || "Sin documentar.",
      tags: { default: doc.default, params: doc.params.length ? doc.params : undefined },
      sourceFile: file,
      sourceLine: line,
    });
  }

  return entries;
}
