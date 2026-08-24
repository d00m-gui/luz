/**
 * luz scroll — runtime helpers for the two archetypes CSS alone can't do:
 * splitting text into per-word `--i` spans (for `.luz-reveal-text`, see
 * `scroll.ts`), and scrubbing a `<video>`'s `currentTime` off scroll
 * position (CSS scroll-driven animations can't touch `currentTime`).
 * Framework-agnostic — `useScroll.tsx` just wraps these in a `useEffect`.
 *
 * Video scrubbing deliberately does NOT use the native `ViewTimeline`
 * API — its `currentTime` proved unreliable (stuck instead of tracking
 * scroll) in real-world testing. A plain `requestAnimationFrame` loop
 * reading `getBoundingClientRect` is a few more bytes but actually works.
 */

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/**
 * Splits `el`'s text into `<span class="luz-word" style="--i:N">word</span>`
 * runs (whitespace left untouched between them) so `.luz-reveal-text` can
 * stagger them via CSS alone. Returns a restore function.
 */
export function splitWords(el: HTMLElement, className = "luz-word"): () => void {
  const original = el.innerHTML;
  const parts = el.textContent?.split(/(\s+)/) ?? [];
  let index = 0;
  el.innerHTML = parts
    .map((part) =>
      /^\s+$/.test(part) || part === ""
        ? part
        : `<span class="${className}" style="--i:${index++}">${part}</span>`,
    )
    .join("");
  return () => {
    el.innerHTML = original;
  };
}

/**
 * Reads how far `el` has crossed the viewport, 0 (about to enter) to 1
 * (fully exited) — same shape as a `view()` timeline's `cover` range, used
 * as the fallback when the `ViewTimeline` constructor isn't available.
 */
function rectProgress(el: Element, axis: "block" | "inline"): number {
  const rect = el.getBoundingClientRect();
  const viewportExtent = axis === "inline" ? window.innerWidth : window.innerHeight;
  const elExtent = axis === "inline" ? rect.width : rect.height;
  const start = axis === "inline" ? rect.left : rect.top;
  return clamp01((viewportExtent - start) / (viewportExtent + elExtent));
}

/** Options for `bindScrollVideo`. */
export interface ScrollVideoOptions {
  /** Scroll axis to track. Default `"block"` (vertical). */
  axis?: "block" | "inline";
  /**
   * Element whose position drives the scrub progress. Defaults to `video`
   * itself — fine for a video that scrolls normally. For a `position:
   * sticky` video (pinned full-screen while content scrolls over it), the
   * video's own rect stays static while pinned, so pass the scrolling
   * content next to/over it instead (e.g. the sticky wrapper's next
   * sibling) so progress keeps advancing for the whole pinned duration.
   */
  track?: Element;
}

/**
 * Drives `video.currentTime` from scroll position instead of playback —
 * pauses/mutes the video and scrubs it via a `requestAnimationFrame` loop
 * reading `getBoundingClientRect` on `options.track` (or `video`).
 * Returns a cleanup function.
 */
export function bindScrollVideo(
  video: HTMLVideoElement,
  options: ScrollVideoOptions = {},
): () => void {
  const axis = options.axis ?? "block";
  const track = options.track ?? video;
  video.pause();
  video.muted = true;
  video.preload = "auto";

  let raf = 0;
  function tick() {
    const duration = video.duration;
    if (Number.isFinite(duration) && duration > 0) {
      const time = rectProgress(track, axis) * duration;
      if (Number.isFinite(time)) video.currentTime = time;
    }
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(raf);
}

/**
 * Scans `root` for `[data-luz-text]` (word-split for `.luz-reveal-text`)
 * and `[data-luz-scroll-video]` (`bindScrollVideo`) and wires them up.
 * Call once per mount; returns a single cleanup function.
 */
export function initLuzScroll(root: ParentNode = document): () => void {
  const cleanups: (() => void)[] = [];

  for (const el of root.querySelectorAll<HTMLElement>("[data-luz-text]")) {
    cleanups.push(splitWords(el));
  }
  for (const el of root.querySelectorAll<HTMLVideoElement>("[data-luz-scroll-video]")) {
    const trackSelector = el.dataset.luzScrollTrack;
    const track = trackSelector ? (document.querySelector(trackSelector) ?? undefined) : undefined;
    cleanups.push(
      bindScrollVideo(el, {
        axis: el.dataset.luzScrollAxis === "inline" ? "inline" : "block",
        track,
      }),
    );
  }

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
