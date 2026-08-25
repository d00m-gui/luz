import { luz } from "@d00m-gui/luz";
import { withComponentStyle } from "@d00m-gui/luz/react";

if (typeof luz !== "function") {
  throw new TypeError("luz must be a function");
}

if (typeof withComponentStyle !== "function") {
  throw new TypeError("withComponentStyle must be a function");
}

globalThis.__luzConsumer = {
  variables: luz({ primary: "#007dea" }).variables,
};
