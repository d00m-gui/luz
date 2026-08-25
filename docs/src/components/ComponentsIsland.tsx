import { LuzReact } from "../../../src/react";
import { docsRuntimeConfig } from "../lib/docs-runtime-config";
import { ComponentsShowcase } from "./ComponentsShowcase";
import { Toolbar } from "./Toolbar";

/** Same shared-`<LuzReact>`-per-page shape as `DocsIsland` (see its doc
 *  comment) — a separate island component so the components page doesn't
 *  need the `Playground`/MDX-code plumbing `DocsIsland` carries. */
export function ComponentsIsland() {
  return (
    <LuzReact config={docsRuntimeConfig}>
      <ComponentsShowcase />
      <Toolbar />
    </LuzReact>
  );
}
