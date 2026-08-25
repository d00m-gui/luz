import { useEffect, useState } from "react";
import { CrtIntro, type CrtIntroMode } from "./CrtIntro";

/** Once per browser session, not once ever — a fresh tab/session should see
 *  the intro again, but navigating around the site within one session
 *  shouldn't replay an ~11.6s sequence on every visit. */
const SEEN_KEY = "luz-intro-seen";

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
 *   there's no overlap with the intro trigger above.
 */
export function CrtIntroMount() {
  const [active, setActive] = useState<CrtIntroMode | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    setActive("intro");
  }, []);

  useEffect(() => {
    const onBeforeSwap = () => setActive("transition");
    document.addEventListener("astro:before-swap", onBeforeSwap);
    return () => document.removeEventListener("astro:before-swap", onBeforeSwap);
  }, []);

  if (!active) return null;

  // Conditional mount (not a prop change on a persistent instance) is
  // deliberate — `CrtIntro`'s own `exiting`/`gone` state needs to start
  // fresh each time, which only happens on a real mount.
  return <CrtIntro mode={active} onDone={() => setActive(null)} />;
}
