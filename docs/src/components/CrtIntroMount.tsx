import { useEffect, useRef, useState } from "react";
import { CrtIntro, type CrtIntroMode } from "./CrtIntro";

/** Once per browser session, not once ever — a fresh tab/session should see
 *  the intro again, but navigating around the site within one session
 *  shouldn't replay an ~11.6s sequence on every visit. */
const SEEN_KEY = "luz-intro-seen";

/** `Layout.astro` sets `<title>{title} — luz docs</title>` — stripping the
 *  fixed suffix recovers exactly the `title` prop (the section name) for
 *  whatever page is about to be swapped in, no extra markup needed. */
const TITLE_SUFFIX_RE = /\s*—\s*luz docs\s*$/;

interface Entry {
  /** Forces a fresh `CrtIntro` mount even when `mode` repeats back-to-back
   *  (e.g. two navigations fired close together) — a plain `mode` prop
   *  wouldn't do this: React bails out of re-rendering when a state update
   *  sets the same string value, so a second "transition" while the first
   *  one is still exiting would silently no-op, leaving a stale overlay
   *  running its own timer against a page that already moved on. A `key`
   *  that increments on every trigger guarantees React always tears down
   *  the previous instance (rAF loop, WebGL context, `exiting`/`gone`
   *  state) and starts a completely fresh one instead. */
  key: number;
  mode: CrtIntroMode;
  sectionName?: string;
}

/**
 * Global mount point for `CrtIntro`, meant to live once in `Layout.astro`
 * with `client:load transition:persist` — `transition:persist` is what
 * makes this work: without it Astro destroys and recreates the island (and
 * its WebGL context) on every page swap, which would both lose the
 * `sessionStorage` gate's effect (nothing to lose, that's fine) and be
 * needlessly expensive for a canvas/GL setup that doesn't need to happen
 * more than once per session.
 *
 * Two triggers, cleanly separated by when each can actually fire:
 * - First page load: an effect that runs once on this component's own
 *   mount (which — because of `transition:persist` — only happens for the
 *   very first page of the session, never again) shows `mode="intro"` if
 *   `sessionStorage` doesn't already have the seen-flag.
 * - Every subsequent client-side navigation: Astro's View Transitions
 *   lifecycle fires `astro:before-swap` on `document` right before it swaps
 *   the DOM to the new page — that's the trigger for `mode="transition"`.
 *   It never fires for the very first load (there's no "swap" yet), so
 *   there's no overlap with the intro trigger above. The event's
 *   `newDocument` gives access to the incoming page's `<title>` before the
 *   swap happens, which is how `sectionName` gets to `CrtIntro`.
 */
export function CrtIntroMount() {
  const [entry, setEntry] = useState<Entry | null>(null);
  const nextKey = useRef(0);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    setEntry({ key: nextKey.current++, mode: "intro" });
  }, []);

  useEffect(() => {
    const onBeforeSwap = (event: Event) => {
      const newDocument = (event as Event & { newDocument?: Document }).newDocument;
      const title = newDocument?.title.replace(TITLE_SUFFIX_RE, "").trim();
      setEntry({ key: nextKey.current++, mode: "transition", sectionName: title || undefined });
    };
    document.addEventListener("astro:before-swap", onBeforeSwap);
    return () => document.removeEventListener("astro:before-swap", onBeforeSwap);
  }, []);

  if (!entry) return null;

  return (
    <CrtIntro
      key={entry.key}
      mode={entry.mode}
      sectionName={entry.sectionName}
      onDone={() => setEntry(null)}
    />
  );
}
