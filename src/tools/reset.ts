import type { LuzConfig } from "../config";
import { COMPONENT_NAMES } from "./component-names.generated";
import { COMPONENTS, RESET } from "./reset-css.generated";

export function buildReset(exclude: LuzConfig["exclude"] = []): string {
  return `${RESET}\n${COMPONENT_NAMES.filter(
    (name) => !exclude.some((excluded) => excluded === name),
  )
    .map((name) => COMPONENTS[name])
    .join("\n")}`;
}
