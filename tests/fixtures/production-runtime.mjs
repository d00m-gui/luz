import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { lui } from "@d00m-gui/luz";
import { LuzReact } from "@d00m-gui/luz/react";

const html = renderToString(
  createElement(
    LuzReact,
    { config: { primary: "#007dea" } },
    createElement(lui.card, null, "Production runtime"),
  ),
);

if (!html.includes("Production runtime")) {
  throw new Error("LuzReact production render did not include its children");
}
