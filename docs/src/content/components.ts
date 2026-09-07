import { getCollection } from "astro:content";
import { DESIGN_FILES } from "./components.generated";

/** Reset-only/structural tags with no meaningful standalone demo. */
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

export interface ComponentDoc {
  id: string;
  title: string;
  /** Short explanatory tail, rendered next to the title — e.g. the class/selector a variant demonstrates. */
  desc?: string;
  category:
    | "Overlays"
    | "Feedback"
    | "Navigation"
    | "Layout"
    | "Primitives"
    | "Surfaces"
    | "Data"
    | "Identity";
  /** Class names or bare tag selectors from luz's CSS this entry demonstrates — checked against each `DESIGN_FILES` entry's `classes`/`elements`. */
  covers: string[];
  /** Copyable source, also used as the live preview unless `preview` is set. */
  html: string;
  /** Docs-only override for the live preview (e.g. bounding a `position: fixed` component) — `html` stays the copyable source. */
  preview?: string;
  /** Grid column span in the `/` component index — for previews wide enough that a single column cramps them. Default 1. */
  span?: 2 | 3;
  /** Excludes the entry from the index, sidebar, and routing while it's being reworked. Still counts toward `covers`. */
  wip?: boolean;
  /** Variant demos shown on the same page below the base one — a class-modifier flavor of this component (e.g. `.tabs.segmented`) rather than a component of its own. */
  variants?: { title: string; desc?: string; html: string; preview?: string }[];
}

const PREVIEW_RE = /<!--\s*preview\s*-->([\s\S]*?)<!--\s*\/preview\s*-->/;

/** Pulls a `<!--preview-->…<!--/preview-->` override out of a section, leaving the rest as copyable `html`. */
function splitPreview(section: string): { html: string; preview?: string } {
  const match = section.match(PREVIEW_RE);
  if (!match || match.index === undefined) return { html: section.trim() };
  return {
    preview: match[1].trim(),
    html: (
      section.slice(0, match.index) +
      section.slice(match.index + match[0].length)
    ).trim(),
  };
}

/** Splits a component's body on `## Title — desc` headings into the base entry and its variants. */
function parseBody(body: string) {
  const [base, ...sections] = body.split(/\n(?=## )/);
  const variants = sections.map((section) => {
    const newline = section.indexOf("\n");
    const heading = section
      .slice(2, newline === -1 ? undefined : newline)
      .trim();
    const content = newline === -1 ? "" : section.slice(newline + 1);
    const sep = heading.indexOf(" — ");
    const title = sep === -1 ? heading : heading.slice(0, sep);
    const desc = sep === -1 ? undefined : heading.slice(sep + 3);
    return {
      title: title.trim(),
      desc: desc?.trim(),
      ...splitPreview(content),
    };
  });
  return {
    ...splitPreview(base ?? ""),
    variants: variants.length ? variants : undefined,
  };
}

export async function loadComponents() {
  const entries = await getCollection("components");
  const components: ComponentDoc[] = entries.map((entry) => ({
    id: entry.id,
    ...parseBody(entry.body?.trim() ?? ""),
    ...entry.data,
  }));

  const covered = new Set(components.flatMap((c) => c.covers));
  const uncoveredFiles = DESIGN_FILES.filter((f) => {
    const tokens = [...f.classes, ...f.elements, ...f.attrs];
    if (tokens.length > 0 && tokens.every((t) => EXEMPT_ELEMENTS.includes(t)))
      return false;
    return !tokens.some((t) => covered.has(t));
  }).map((f) => f.file);

  return {
    components,
    visibleComponents: components.filter((c) => !c.wip),
    uncoveredFiles,
  };
}
