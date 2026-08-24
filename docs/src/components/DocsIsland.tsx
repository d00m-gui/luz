import { LuzReact } from "../../../src/react";
import { docsRuntimeConfig } from "../lib/docs-runtime-config";
import { Playground } from "./Playground";
import { Toolbar } from "./Toolbar";

/** One shared `<LuzReact>` for the whole page — Astro hydrates each
 *  `client:*` component as its own isolated React tree, so a separate
 *  `<LuzReact>` per island would give the Toolbar's sound toggle and the
 *  Playground's `lui.*` components different contexts, and the toggle
 *  would silently do nothing. The Toolbar's fixed positioning means it
 *  doesn't matter that both render from the same mount point in markup. */
export function DocsIsland({
  playgroundCode,
  hasPlayground,
}: {
  playgroundCode?: string;
  hasPlayground: boolean;
}) {
  return (
    <LuzReact config={docsRuntimeConfig}>
      {hasPlayground && <Playground code={playgroundCode} />}
      <Toolbar />
    </LuzReact>
  );
}
