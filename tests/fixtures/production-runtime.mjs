import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { lui } from "luz";
import { LuzReact } from "luz/react";

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
