import { COMPONENTS, RESET } from "./reset-css.generated";

export function buildReset(): string {
  return `${RESET}\n${COMPONENTS}`;
}
