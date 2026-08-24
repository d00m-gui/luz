/**
 * luz scroll — CSS-native scroll-driven animation archetypes.
 * Built entirely on `animation-timeline`/`animation-range`
 * (https://www.joshwcomeau.com/animation/scroll-driven-animations/) — no
 * JS, no IntersectionObserver. Opt-in: nothing is emitted unless
 * `enabled` is explicitly true. Browsers without scroll-driven animation
 * support (`CSS.supports("animation-timeline: view()")`) just skip the
 * animation and show the final state — `both` fill-mode + a plain
 * `opacity`/`transform` end state means no invisible/broken content.
 *
 * Stagger is achieved by giving each child (or word) its own slice of the
 * shared timeline via `animation-range-start/end` offset by `--i` — the
 * classic scroll-driven-animation stagger trick, no JS delay needed.
 * `--i` is pre-assigned per `:nth-child` up to `staggerMax`; splitting text
 * into per-word `--i` spans still needs a DOM pass — see `splitWords` in
 * `scroll-runtime.ts`. Video scroll-scrubbing also needs JS (`currentTime`
 * isn't settable from CSS) — see `bindScrollVideo` in the same file.
 */

export interface LuzScrollConfig {
  /** Master switch. Default `false` — opt-in. */
  enabled?: boolean;
  /** Translate distance for `.luz-reveal`/`.luz-reveal-text`. Default `"2rem"`. */
  revealDistance?: string;
  /** Timeline-range offset between staggered siblings/words. Default `"4%"`. */
  staggerStep?: string;
  /** How many `:nth-child` stagger rules to pre-generate for `.luz-stagger`. Default `24`. */
  staggerMax?: number;
  /** Translate strength for `.luz-parallax`. Default `"15%"`. */
  parallaxStrength?: string;
}

/**
 * Generates the scroll-driven-animation utility CSS. Returns `""` unless
 * `config.enabled` — safe to splice into `style` unconditionally.
 *
 * Archetypes:
 * - `.luz-reveal` — fade + rise as an element enters the viewport.
 * - `.luz-stagger` — put on a container; each direct child reveals in
 *   sequence (own `--i`-offset slice of the container's timeline).
 * - `.luz-reveal-text` — put on a container whose words were split into
 *   `.luz-word` spans (`splitWords`); words reveal in reading order.
 * - `.luz-parallax` — continuous translate across the full page scroll.
 * - `.luz-sticky` / `.luz-stack` — sticky element / sticky card stack
 *   (each card recedes — scales down + dims — as the next covers it).
 */
export function luzScrollCSS(config: LuzScrollConfig = {}): string {
  if (!config.enabled) return "";

  const {
    revealDistance = "2rem",
    staggerStep = "4%",
    staggerMax = 24,
    parallaxStrength = "15%",
  } = config;

  const staggerIndexRules = Array.from(
    { length: staggerMax },
    (_, i) => `.luz-stagger > *:nth-child(${i + 1}) { --i: ${i}; }`,
  ).join("\n  ");

  return `
  @keyframes luz-reveal-in {
    from { opacity: 0; transform: translateY(var(--luz-reveal-distance, ${revealDistance})); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes luz-parallax {
    from { transform: translateY(calc(var(--luz-parallax-strength, ${parallaxStrength}) * -1)); }
    to { transform: translateY(var(--luz-parallax-strength, ${parallaxStrength})); }
  }
  @keyframes luz-stack-recede {
    to { transform: scale(0.92); filter: brightness(0.7); }
  }

  .luz-reveal {
    animation: luz-reveal-in auto linear both;
    animation-timeline: view();
    animation-range: 0% 40%;
  }

  .luz-stagger { view-timeline-name: --luz-stagger; view-timeline-axis: block; }
  .luz-stagger > * {
    --i: 0;
    animation: luz-reveal-in auto linear both;
    animation-timeline: --luz-stagger;
    animation-range-start: calc(var(--i) * ${staggerStep});
    animation-range-end: calc(30% + var(--i) * ${staggerStep});
  }
  ${staggerIndexRules}

  .luz-reveal-text { view-timeline-name: --luz-text; view-timeline-axis: block; }
  .luz-reveal-text .luz-word {
    --i: 0;
    display: inline-block;
    animation: luz-reveal-in auto linear both;
    animation-timeline: --luz-text;
    animation-range-start: calc(var(--i) * ${staggerStep});
    animation-range-end: calc(30% + var(--i) * ${staggerStep});
  }

  .luz-parallax {
    animation: luz-parallax auto linear both;
    animation-timeline: scroll();
    animation-range: 0% 100%;
  }

  .luz-sticky { position: sticky; top: var(--luz-sticky-offset, 0px); }

  .luz-stack { display: grid; }
  .luz-stack > * {
    grid-area: 1 / 1;
    position: sticky;
    top: var(--luz-stack-offset, 0px);
    animation: luz-stack-recede auto linear both;
    animation-timeline: view();
    animation-range: 60% 100%;
  }
  `;
}
