import { DESIGN, RESET, STRUCTURE } from "./reset-css.generated";

export function buildReset(): string {
  return `${RESET}\n${STRUCTURE}\n${DESIGN}`;
}
