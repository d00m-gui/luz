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

export async function loadComponents() {
  const entries = await getCollection("components");
  const components: ComponentDoc[] = entries.map((entry) => ({
    id: entry.id,
    html: entry.body?.trim() ?? "",
    ...entry.data,
  }));

  const covered = new Set(components.flatMap((c) => c.covers));
  const uncoveredFiles = DESIGN_FILES.filter((f) => {
    const tokens = [...f.classes, ...f.elements, ...f.attrs];
    if (tokens.length > 0 && tokens.every((t) => EXEMPT_ELEMENTS.includes(t))) return false;
    return !tokens.some((t) => covered.has(t));
  }).map((f) => f.file);

  return {
    components,
    visibleComponents: components.filter((c) => !c.wip),
    uncoveredFiles,
  };
}
