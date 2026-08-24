import { luz as createLuz } from "./luz";
import { lui as components } from "./components";

export const luz: typeof createLuz = createLuz;
export const lui: typeof components = components;

export type { LuzConfig, LuzResult, LuzTokens, TokenSettings } from "./luz";
export { TYPE_SCALES, FLUID_RANGES } from "./tools/sizes";
export type { TypeScaleName, FluidRangeName } from "./tools/sizes";
export type { LuzScrollConfig } from "./tools/scroll";
export {
  bindScrollVideo,
  initLuzScroll,
  splitWords,
  type ScrollVideoOptions,
} from "./tools/scroll-runtime";
