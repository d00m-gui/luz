import { ComponentsShowcase } from "./ComponentsShowcase";

/** Toolbar/`LuzReact` removed — see `DocsIsland`'s doc comment for why (the
 *  dynamic-vs-static CSS conflict applies here identically). A separate
 *  island component so the components page doesn't need the
 *  `Playground`/MDX-code plumbing `DocsIsland` carries. */
export function ComponentsIsland() {
  return <ComponentsShowcase />;
}
