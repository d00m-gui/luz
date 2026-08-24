import type { LuzConfig } from "../../../src/luz";

/** Shared live-editable luz config for docs-site React islands (Playground
 *  previews, the statusbar toolbar) — one `<LuzReact>` instance's `setPrimary`/
 *  `setMode` writes `:root` CSS vars, which cascade to the whole page
 *  regardless of which island's context called them. */
export const docsRuntimeConfig: LuzConfig = {
  primary: "#007DEA",
  mode: "dark",
};
