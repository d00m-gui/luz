import { type Dirent, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

export const DEFAULT_EXTENSIONS = ["astro", "html", "tsx", "jsx", "ts"];

const EXCLUDED_DIRS: Record<string, true> = {
  node_modules: true,
  dist: true,
  ".astro": true,
  ".git": true,
};

const CANDIDATE_RE = /[^\s"'`<>]+/g;

interface CacheEntry {
  mtimeMs: number;
  candidates: Set<string>;
}

const fileCache = new Map<string, CacheEntry>();

export interface ScanResult {
  /** Whitespace-delimited tokens found across every scanned file. */
  candidates: Set<string>;
  /** Absolute paths of the files scanned. */
  files: string[];
}

function extractCandidates(text: string): Set<string> {
  const found = new Set<string>();
  for (const match of text.matchAll(CANDIDATE_RE)) {
    found.add(match[0]);
  }
  return found;
}

function walk(dir: string, extensionSet: Set<string>, out: string[]): void {
  let entries: Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS[entry.name] === true) continue;
      walk(join(dir, entry.name), extensionSet, out);
    } else if (
      entry.isFile() &&
      extensionSet.has(extname(entry.name).slice(1))
    ) {
      out.push(join(dir, entry.name));
    }
  }
}

export function scanSources(
  root: string,
  extensions: string[] = DEFAULT_EXTENSIONS,
): ScanResult {
  const files: string[] = [];
  walk(root, new Set(extensions), files);
  const candidates = new Set<string>();

  for (const absolutePath of files) {
    let mtimeMs: number;
    try {
      mtimeMs = statSync(absolutePath).mtimeMs;
    } catch {
      continue;
    }

    const cached = fileCache.get(absolutePath);
    let found: Set<string>;
    if (cached && cached.mtimeMs === mtimeMs) {
      found = cached.candidates;
    } else {
      found = extractCandidates(readFileSync(absolutePath, "utf8"));
      fileCache.set(absolutePath, { mtimeMs, candidates: found });
    }

    for (const candidate of found) candidates.add(candidate);
  }

  return { candidates, files };
}
