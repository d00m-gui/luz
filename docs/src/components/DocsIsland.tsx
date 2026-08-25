import { Playground } from "./Playground";

/** Toolbar (sound toggle + live theme override via `LuzReact`) was removed
 *  from here — loading `LuzReact`'s dynamic `<style>` injection alongside
 *  the statically-generated `luz.css` on the same page caused visible
 *  conflicts (the two sources disagreeing on `:root` values). Fixing that
 *  properly means reconciling `docsRuntimeConfig` against the static build's
 *  config rather than running both blind; until then this island just
 *  renders the Playground. */
export function DocsIsland({
  playgroundCode,
  hasPlayground,
}: {
  playgroundCode?: string;
  hasPlayground: boolean;
}) {
  return <>{hasPlayground && <Playground code={playgroundCode} />}</>;
}
