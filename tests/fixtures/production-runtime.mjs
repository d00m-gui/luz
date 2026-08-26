import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { withComponentStyle } from "@d00m-gui/luz/react";

function PlainDiv(props) {
  return createElement("div", props, props.children);
}

const StyledDiv = withComponentStyle(
  "smoke-test",
  "background: red;",
  PlainDiv,
);

const html = renderToString(
  createElement(StyledDiv, null, "Production runtime"),
);

if (!html.includes("Production runtime")) {
  throw new Error("withComponentStyle production render did not include its children");
}

// React 19's Resource treatment for `<style href precedence>` serializes
// those two props as `data-href`/`data-precedence` in SSR output (verified
// by inspecting the actual `renderToString` output — not guessed).
if (
  !html.includes('data-href="smoke-test"') ||
  !html.includes('data-precedence="luz-component"')
) {
  throw new Error(
    "withComponentStyle did not render its <style href precedence> tag",
  );
}
