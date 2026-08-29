import ts from "typescript";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SRC_FILE = fileURLToPath(new URL("../../src/luz.ts", import.meta.url));
const OUT_FILE = fileURLToPath(
  new URL("../src/content/api.generated.ts", import.meta.url),
);

interface ApiParamTag {
  value: string;
  text: string;
}

interface ApiField {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
  params?: ApiParamTag[];
}

function cleanQuotes(text: string): string {
  return text.replace(/^["'`]|["'`]$/g, "");
}

function extractField(
  member: ts.PropertySignature,
  sourceFile: ts.SourceFile,
): ApiField {
  const name = cleanQuotes(member.name.getText(sourceFile));
  const type = member.type ? member.type.getText(sourceFile) : "unknown";
  const required = !member.questionToken;

  let description = "";
  let defaultValue: string | undefined;
  const params: ApiParamTag[] = [];

  const jsDocs = (member as unknown as { jsDoc?: ts.JSDoc[] }).jsDoc ?? [];
  for (const doc of jsDocs) {
    description = ts.getTextOfJSDocComment(doc.comment) ?? "";
    for (const tag of doc.tags ?? []) {
      const text = ts.getTextOfJSDocComment(tag.comment) ?? "";
      if (tag.tagName.text === "default") {
        defaultValue = cleanQuotes(text);
      } else if (tag.tagName.text === "param") {
        const match = text.match(/^(`[^`]*`|"[^"]*"|\S+)\s*(.*)$/);
        if (match) params.push({ value: cleanQuotes(match[1]!), text: match[2]! });
      }
    }
  }

  const trailingDefault = /\s*Default `([^`]+)`\.?\s*$/;
  const match = description.match(trailingDefault);
  if (match) {
    if (!defaultValue) defaultValue = match[1];
    description = description.replace(trailingDefault, "");
  }

  return {
    name,
    type,
    required,
    description,
    ...(defaultValue !== undefined && { default: defaultValue }),
    ...(params.length > 0 && { params }),
  };
}

function extractInterface(
  sourceFile: ts.SourceFile,
  interfaceName: string,
): ApiField[] {
  const fields: ApiField[] = [];
  function visit(node: ts.Node) {
    if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
      for (const member of node.members) {
        if (ts.isPropertySignature(member)) fields.push(extractField(member, sourceFile));
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return fields;
}

const program = ts.createProgram([SRC_FILE], { allowJs: false, noEmit: true });
const sourceFile = program.getSourceFile(SRC_FILE);
if (!sourceFile) throw new Error(`no se pudo leer ${SRC_FILE}`);

const luzConfigFields = extractInterface(sourceFile, "LuzConfig");

writeFileSync(
  OUT_FILE,
  `// Generado por \`bun run gen:content\` (docs/scripts/gen-content.ts) — no editar a mano.\nexport const luzConfigFields = ${JSON.stringify(luzConfigFields, null, 2)} as const;\n`,
);

console.log(`generado ${OUT_FILE} (${luzConfigFields.length} campos de LuzConfig)`);
