import { Playground } from "./Playground";

/** Used to also render a Toolbar (sound toggle + live theme override via
 *  `LuzReact`) — dropped because loading `LuzReact`'s dynamic `<style>`
 *  injection alongside the statically-generated `luz.css` on the same page
 *  caused visible conflicts (the two sources disagreeing on `:root`
 *  values). `LuzReact` itself has since been retired from luz entirely —
 *  live/dynamic theming doesn't fit a library whose model is a theme fixed
 *  at build time — so there's nothing to reconcile it against going
 *  forward. Sound moved to a standalone `vsfx` package (see its
 *  `SoundProvider`) if a toolbar-style sound toggle is wanted again; this
 *  island just renders the Playground. */
export function DocsIsland({
  playgroundCode,
  hasPlayground,
}: {
  playgroundCode?: string;
  hasPlayground: boolean;
}) {
  return <>{hasPlayground && <Playground code={playgroundCode} />}</>;
}
