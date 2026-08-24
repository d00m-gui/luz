import { useEffect } from "react";
import {
  bindScrollVideo,
  initLuzScroll,
  splitWords,
  type ScrollVideoOptions,
} from "../tools/scroll-runtime";

/**
 * Scans `ref`'s subtree for `[data-luz-text]` and `[data-luz-scroll-video]`
 * and wires them up (word-splitting / video scroll-scrubbing) — the two
 * scroll archetypes CSS alone can't do. Everything else (`.luz-reveal`,
 * `.luz-stagger`, `.luz-parallax`, `.luz-sticky`, `.luz-stack`) is plain
 * CSS classes from `config.scroll`, no hook needed.
 *
 *   const ref = useRef<HTMLDivElement>(null);
 *   useLuzScroll(ref);
 *   <div ref={ref}>
 *     <h1 data-luz-text className="luz-reveal-text">Staggered words</h1>
 *     <video data-luz-scroll-video src="..." />
 *   </div>
 */
export function useLuzScroll<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
): void {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    return initLuzScroll(root);
  }, [ref]);
}

/** Single-element version of `useLuzScroll`'s video binding, for direct control. */
export function useScrollVideo(
  ref: React.RefObject<HTMLVideoElement | null>,
  options?: ScrollVideoOptions,
): void {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    return bindScrollVideo(video, options);
  }, [ref, options?.axis]);
}

export {
  bindScrollVideo,
  initLuzScroll,
  splitWords,
  type ScrollVideoOptions,
};
export type { LuzScrollConfig } from "../tools/scroll";
